const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

/*
-- Custom functions --
 */
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

// set optimization
const optimization = () => {
  const config = {
    minimize: isProd,
  };

  if (isProd) {
    config.minimizer = [
      new CssMinimizerPlugin({
        parallel: 4,
      }),
      new TerserPlugin(),
    ];
  }

  return config;
};

// how to be processed styles
const stylesLoaders = () => {
  return [
    // Creates `style` nodes from JS strings
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, context) => {
          // publicPath is the relative path of the resource to the context
          // e.g. for ./css/admin/main.css the publicPath will be ../../
          // while for ./css/main.css the publicPath will be ../
          return path.relative(path.dirname(resourcePath), context) + "/";
        },
      },
    },
    // Translates CSS into CommonJS
    {
      loader: "css-loader",
      options: { sourceMap: isDev },
    },
    // Translate super css, sass futures into common css
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [["postcss-preset-env", { browsers: "last 2 versions" }]],
        },
        sourceMap: isDev,
      },
    },
    // understand sass syntax and translate into css
    {
      loader: "sass-loader",
      options: {
        sourceMap: isDev,
        implementation: require("dart-sass"),
      },
    },
  ];
};

/*
-- WebPack functions --
 */
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    home: ["/js/home.js"],
  },
  mode: process.env.NODE_ENV,
  devtool: isDev ? "source-map" : false,
  optimization: optimization(),
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new ESLintPlugin(),
    new webpack.ProgressPlugin({ percentBy: "entries" }),
  ],
  resolve: {
    alias: {
      "@scss": path.resolve(__dirname, "src/scss"),
      "@fonts": path.resolve(__dirname, "src/fonts"),
      "@js": path.resolve(__dirname, "src/js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: stylesLoaders(),
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
          },
        ],
      },
      // {
      //     test: /\.(png|jpe?g|svg|gif)$/,
      //     use: [
      //         {
      //             loader: 'file-loader',
      //             options: {
      //                 name: 'assets/images/[name].webp'
      //             }
      //         },
      //         'webp-loader?{quality: 75}',
      //     ]
      // },
    ],
  },
};
