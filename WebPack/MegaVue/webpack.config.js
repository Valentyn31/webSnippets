const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const Autoprefixer = require('autoprefixer');

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
        MiniCssExtractPlugin.loader,
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
        hot: isDev
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
    ],
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