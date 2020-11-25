const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = (file) => path.resolve(__dirname, file)
module.exports = (app, env) => {
  let maxAge = 0

  // gzip压缩
  if (env === 'production') {
    maxAge = 1000 * 60 * 60 * 24 * 30 // 30天有效时长
    const compression = require('compression')
    app.use(compression())
  }

  // 图标icon
  app.use(favicon(resolve('../public/favicon.ico')))

  // 静态文件
  app.use('/dist', express.static(resolve('../dist'), { maxAge }))
}
