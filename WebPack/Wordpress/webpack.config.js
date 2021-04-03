const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

/*
-- Custom functions --
 */
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
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
        ],
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}
const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: babelOptions()
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
                    return path.relative(path.dirname(resourcePath), context) + '../../';
                }
            }
        }
        ,
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

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        home: '/js/home.js',
    },
    mode: 'development',
    devtool: isDev ? 'source-map': false,
    optimization: optimization(),
    output: {
        filename: 'assets/js/[name].js',
        chunkFilename: 'vendors.js',
        path: path.resolve(__dirname, './'),
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['assets/*']
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css',
        }),
        new webpack.ProgressPlugin({ percentBy: 'entries' })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /node_modules/,
                use: stylesLoaders(false)
            },
            {
                test: /\.(png|jpe?g|gif)$/,
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
                test: /\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/images/[name].svg'
                        }
                    },
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/fonts/[name].[ext]'
                        }
                    }
                ]
            },
        ]
    }
}