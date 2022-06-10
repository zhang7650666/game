"use strict";
const ENV = process.env.NODE_ENV;
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const utils = require("./utils");
const config = require("../config");
const baseWebpackConfig = require("./webpack.base.conf");

const htmlConfig =
    require("../static/config/config.js")[ENV] ||
    require("../static/config/config.js")["prod"];
htmlConfig.routerBase = config.build.routerBase;

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    watch: config.build.watch,
    mode: "production",
    optimization: {
        // 压缩插件配置
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console:
                            ENV === "prod" || ENV === "pre" ? true : false
                    }
                }
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendors"
                },
                "async-vendors": {
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 2,
                    chunks: "async",
                    name: "async-vendors"
                }
            }
        },
        runtimeChunk: { name: "runtime" }
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath("js/[name].[chunkhash:12].js"),
        chunkFilename: utils.assetsPath("js/[name].[chunkhash:12].js")
    },
    plugins: [
        new webpack.DefinePlugin({
            WP_ENV: JSON.stringify(ENV),
            htmlConfig: JSON.stringify(htmlConfig)
        }),

        new MiniCssExtractPlugin({
            filename: utils.assetsPath("css/[name].[chunkhash:12].css"),
            chunkFilename: utils.assetsPath("css/[name].[chunkhash:12].css")
        }),

        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "../static/other/"),
                to: config.build.assetsRoot + "/static/other",
                ignore: [".*"]
            }
        ])
    ]
});

var pages = utils.getEntry("./src/main.js");
for (var pathname in pages) {
    var conf = {
        env: ENV,
        htmlConfig,
        filename: config.build.assetsRoot + "/index.html",
        template: pathname + ".ejs",
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunksSortMode: "dependency"
    };
    if (pathname in webpackConfig.entry) {
        conf.chunks = ["runtime", "vendors", "babel-polyfill", pathname];
    }
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require("compression-webpack-plugin");
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (process.argv.slice(2).indexOf("fx") !== -1) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
