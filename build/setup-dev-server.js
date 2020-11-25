const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs') // 读取/写入内存
const chokidar = require('chokidar') // 监听文件变化
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
    } catch (e) {
        console.log('readFile error', e)
    }
}

module.exports = function setupDevServer(app, templatePath, cb) {
    let bundle // 服务端配置JSON，方便于热重载
    let template // 模板HTML
    let clientManifest // 客户端配置JSON，有利于推断和注入资源预加载/数据预取指令(preload/prefetch directive)，以及css链接/script标签到所渲染的HTML。
    const update = () => {
        if (template && bundle && clientManifest) {
            cb(bundle, {
                template,
                clientManifest
            })
        }
    }
    return new Promise((globalResolve, globalReject) => {
        // 生成模板配置
        const templatePromise = new Promise((resolve, reject) => {
            // 读取模板文件
            template = fs.readFileSync(templatePath, 'utf-8')
            // 监听模板文件的变化，触发更新
            chokidar.watch(templatePath).on('change', () => {
                template = fs.readFileSync(templatePath, 'utf-8')
                console.log('index.html template updated.')
                return update()
            })
            update()
            return resolve(template)
        })

        // 生成客户端配置
        const webpackClientPromise = new Promise((resolve, reject) => {
            // 修改客户端webpack配置
            clientConfig.mode = 'development'
            clientConfig.entry.app = [
                "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true",
                clientConfig.entry.app
            ]
            clientConfig.output.filename = '[name].js'
            clientConfig.plugins.push(
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoEmitOnErrorsPlugin()
            )

            // 运行webpack客户端配置
            const clientCompiler = webpack(clientConfig)
            const devMiddleware = webpackDevMiddleware(clientCompiler, {
                publicPath: clientConfig.output.publicPath,
                noInfo: true // 显示无信息到控制台（仅警告和错误）
            })
            // NodeJS应用webpack开发中间件服务
            app.use(devMiddleware)

            // 监听webpack done完成事件
            clientCompiler.hooks.done.tap('webpack', stats => {
                stats = stats.toJson()
                stats.errors.forEach(err => console.error(err))
                stats.warnings.forEach(err => console.warn(err))
                if (stats.errors.length) return reject(stats.errors)
                clientManifest = JSON.parse(
                    readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json')
                )
                update()
                return resolve(clientManifest)
            })
            // 使用热更新中间件
            app.use(webpackHotMiddleware(clientCompiler, { heartbeat: 5000 }))
        })

        // 生成服务端配置
        const webpackServerPromise = new Promise((resolve, reject) => {
            // 运行webpack服务端配置
            const serverCompiler = webpack(serverConfig)

            const mfs = new MFS()
            serverCompiler.outputFileSystem = mfs // 输出到内存，节省往磁盘写入的时间
            serverCompiler.watch({}, (err, stats) => {
                if (err) throw err
                stats = stats.toJson()
                stats.errors.forEach(err => console.error(err))
                stats.warnings.forEach(err => console.warn(err))
                if (stats.errors.length) return reject(stats.errors)
                // 通过vue-ssr-webpack-plugin生成服务端配置
                bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
                update()
                return resolve(bundle)
            })
        })

        return Promise.all([templatePromise, webpackClientPromise, webpackServerPromise])
            .then(res => {
                // cb(res[2], { template: res[0], clientManifest: res[1] })
                return globalResolve()
            })
            .catch(err => {
                console.log('error', err);
            })
    })
}