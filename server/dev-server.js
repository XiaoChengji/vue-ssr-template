const path = require('path')
const express = require('express')
const createAPI = require('./api')
const { createBundleRenderer } = require('vue-server-renderer')
const devServer = require('../build/setup-dev-server')
const middleware = require('../middleware')
const resolve = (file) => path.resolve(__dirname, file)

// 启动express
const app = express()

//使用中间件
middleware(app)

// 创建内嵌HTML模板
function createRenderer(bundle, options) {
    return createBundleRenderer(
        bundle,
        Object.assign(options, {
            basedir: resolve('../dist'),
            runInNewContext: false
        })
    )
}

// 处理请求回调
function render(req, res) {
    if (!renderer) { // 等待webpack-dev-server完成编译并生成renderer才可执行
      return res.end('waiting for compilation... refresh in a moment.')
    }

    console.log('request', req.url)

    const startTime = Date.now()
    res.setHeader('Content-Type', 'text/html')

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

    renderer.renderToStream({ title: 'Vue SSR', url: req.url })
      .on('error', handleError)
      .on('end', () => console.log(`whole request: ${Date.now() - startTime}ms`))
      .pipe(res)
}

let renderer
let readyPromise
const templatePath = resolve('../public/index.template.html')

// 启动webpack-dev-server
readyPromise = devServer(
    app,
    templatePath,
    (bundle, options) => {
        renderer = createRenderer(bundle, options)
    }
)

const port = 8080

app.listen(port, () => {
    console.log(`server started at localhost:${ port }`)
})

createAPI(app)

// 监听GET请求
app.get('*', (req, res) => {
    readyPromise.then(() => render(req, res))
})