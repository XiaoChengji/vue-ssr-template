const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS抽取到单独的文件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩CSS文件
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const base = require('./webpack.base.config')
const isProd = process.env.NODE_ENV === 'production'

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development'
        ),
        'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
]

if (isProd) {
    plugins.push(        
        new MiniCssExtractPlugin({ filename: 'common.[chunkhash].css'}) // 抽取样式放至style.css内
    )
}

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
            loader: MiniCssExtractPlugin.loader
        },
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
    lessRules = cssRules.concat({ loader: 'less-loader' })
}

const config = {
    entry: {
        app: './src/entry-client.js'
    },
    plugins,
    optimization: {
        // 添加一个只包含运行时(runtime)额外代码块到每一个入口
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: { // 缓存组，将公共部分抽取出来为一个文件
                vendor: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/, // 用于控制哪些模块被这个缓存组匹配到
                    priority: -10,
                    chunks: 'initial' // 表示哪些代码需要优化，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2, // 表示最小被引用次数，默认为1
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true // 允许复用已经存在的代码块，而不是新建一个新的，需要在精确匹配到对应模块时候才会生效
                }
            },
        }
    },
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
    },
    optimization: {
        minimizer: isProd ? [new CssMinimizerPlugin()] : []
    }
}

module.exports = merge(base, config)