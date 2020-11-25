const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals') // Webpack allows you to define externals - modules that should not be bundled.
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const base = require('./webpack.base.config')
const isProd = process.env.NODE_ENV === 'production'

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
]

let cssRules = [
    {
        loader: 'vue-style-loader', // 从 JS 中创建样式节点
    },
    {
        loader: 'css-loader', // 转化 CSS 为 CommonJS
    }
]
lessRules = cssRules.concat({ loader: 'less-loader' })

if (isProd) {
    cssRules = [
        {
            loader: 'css-loader'
        },
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            'autoprefixer'
                        ]
                    ]
                }
            }
        }
    ]
    lessRules = cssRules.concat({ loader: 'null-loader' })
}

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
    externals: nodeExternals({ // 忽略所有node_module包文件
        allowlist: /\.css$/ // 只允许引入CSS文件
    }),
    plugins,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssRules
            },
            {
                test: /\.less$/,
                use: lessRules
            }
        ]
    }
})
