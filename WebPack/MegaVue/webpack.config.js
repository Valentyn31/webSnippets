const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const Autoprefixer = require('autoprefixer')
const {VueLoaderPlugin} = require('vue-loader')

/*
-- Custom functions --
 */
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ]
    }

    return config
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders
}

const tsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions('@babel/preset-typescript')
    }]

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders
}

const stylesLoaders = () => {
    const loaders = [
        // Creates `style` nodes from JS strings
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: (resourcePath, context) => {
                    // publicPath is the relative path of the resource to the context
                    // e.g. for ./css/admin/main.css the publicPath will be ../../
                    // while for ./css/main.css the publicPath will be ../
                    return path.relative(path.dirname(resourcePath), context) + '/';
                  },
            }
        },
        // Translates CSS into CommonJS
        'css-loader',
    ]
    // Add autoprefixer
    if (isProd) {
        loaders.push(
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            Autoprefixer()
                        ],
                    },
                }
            }
        )
    }
    // Compiles Sass to CSS
    loaders.push('sass-loader')

    return loaders
}

/*
-- WebPack functions --
 */
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        bundle: ['@babel/polyfill', '/main.js'],
    },
    mode: 'development',
    devtool: isDev ? 'source-map': false,
    optimization: optimization(),
    devServer: {
        port: 4200,
        host: 'localhost',
        hot: true
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: '/index.html'
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, 'src/assets/images'),
        //             to: 'assets/images'
        //         },
        //     ],
        // }),
        new MiniCssExtractPlugin({
            filename: isDev ? 'assets/css/style.css' : 'assets/css/style.[hash].css'
        }),
        new webpack.DefinePlugin({
            // Drop Options API from bundle
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                exclude: /node_modules/,
                use: stylesLoaders()
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: tsLoaders()
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpe?g|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/images/[name].webp'
                        }
                    },
                    'webp-loader?{quality: 75}',
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
        ]
    }
};