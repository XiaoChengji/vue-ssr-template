const fs = require('fs')
const path = require('path')
const express = require('express')
const LRU = require('lru-cache') // 删除最近最少使用的项机制的缓存类
const { createBundleRenderer } = require('vue-server-renderer')
const middleware = require('../middleware')
const resolve = file => path.resolve(__dirname, file) // 生成绝对路径

const createAPI = require('./api')

// 启动express
const app = express()

// 设置缓存对象
const microCache = new LRU({
    max: 100,
    maxAge: 60 * 60 * 24 * 1000 // PS：缓存资源将在 1 天后过期。
})

//使用中间件
middleware(app, 'production')

// 创建内嵌HTML模板
function createRenderer(bundle, options) {
    return createBundleRenderer(
        bundle,
        Object.assign(options, {
            basedir: resolve('../dist'),
            runInNewContext: false,
            cache: new LRU({ // 组件缓存
              max: 1000
            })
        })
    )
}

// 处理请求回调
function render(req, res) {
    res.setHeader('Content-Type', 'text/html')

    const hit = microCache.get(req.url)
    if (hit) {
        console.log('Response from cache')
        return res.end(hit)
    }

    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            res.status(500).send('500 | Internal Server Error~')
            console.log(err)
        }
    }

    const context = {
        title: 'Vue SSR', // default title
        url: req.url
    }

    let html = ''
    renderer.renderToStream({ title: 'Vue SSR', url: req.url })
      .on('data', data => {
        html += data.toString()
      })
      .on('error', handleError)
      .on('end', () => {
        microCache.set(req.url, html)
        html = '';
      })
      .pipe(res)
}

const templatePath = resolve('../public/index.template.html')
// 生成模板文件
const template = fs.readFileSync(templatePath, 'utf-8')
// 生成服务端渲染逻辑文件，供NodeJS使用
const bundle = require('../dist/vue-ssr-server-bundle.json')
// 生成客户端静态文件，将js文件注入到页面中
const clientManifest = require('../dist/vue-ssr-client-manifest.json')
// 根据NodeJS和浏览器相关配置生成renderer对象
const renderer = createRenderer(bundle, {
    template,
    clientManifest
})

const port = 8080

app.listen(port, () => {
    console.log(`server started at localhost:${ port }`)
})

createAPI(app)

// 监听GET请求
app.get('*', render)