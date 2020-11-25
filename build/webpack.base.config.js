const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CompressionPlugin = require('compression-webpack-plugin') // 生成Gzip
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS抽取到单独的文件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩CSS文件
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') // 压缩JS文件
const isProd = process.env.NODE_ENV === 'production'

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const plugins = [new VueLoaderPlugin()]

if (isProd) {
    plugins.push(
        // 压缩JS
        new UglifyJSPlugin({
            uglifyOptions: {
                warnings: false,
                ecma: 6,
                beautify: false,
                compress: false,
                comments: false,
                mangle: false,
                toplevel: false,
                keep_classnames: true,
                keep_fnames: true
            }
        }),
        // 开启 gzip 压缩
        new CompressionPlugin(),
        // 根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
        new webpack.HashedModuleIdsPlugin(),
        // 抽取样式放至style.css内
        new MiniCssExtractPlugin({
            filename: 'common.[chunkhash].css'
        })
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
let lessRules = [
    {
        loader: 'vue-style-loader', // 从 JS 中创建样式节点
    },
    {
        loader: 'css-loader', // 转化 CSS 为 CommonJS
    },
    {
        loader: 'less-loader' // 编译 Less 为 CSS
    } 
]
if (isProd) {
    cssRules = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                // 启用 CommonJS 语法，解决 export 'default' (imported as 'mod') was not found
                esModule: false
            }
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

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    context: path.resolve(__dirname, '../'),
    devtool: isProd ? 'none' : 'cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        // hash 整个工程发生变化，文件会发生变化
        // chunkhash 同属一个模块中的文件修改了，文件名会发生变化
        // contenthash 只有文件自己的内容变化了，文件名会发生变化
        filename: '[name].[chunkhash].js',
        // 需要在运行时根据 chunk 发送的请求去生成，给构建后的非入口js文件命名，与 SplitChunksPlugin 配合使用
        chunkFilename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.css'],
        alias: {
            public: resolve('public'),
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|eot|ttf)\??.*$/,
                loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]'
            },
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
    },
    performance: {
        hints: false
    },
    plugins
}