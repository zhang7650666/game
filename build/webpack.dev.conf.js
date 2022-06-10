"use strict";
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");

const ENV = process.env.NODE_ENV;
const config = require("../config");
const htmlConfig = require("../static/config/config.js")["dev"];
htmlConfig.routerBase = config.build.routerBase;
const utils = require("./utils");

const baseWebpackConfig = require("./webpack.base.conf");

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap,
            usePostCSS: true
        })
    },
    devtool: config.dev.devtool,
    mode: "development",
    devServer: {
        clientLogLevel: "warning",
        historyApiFallback: true,
        hot: true,
        contentBase: false,
        compress: true,
        host: config.dev.host,
        port: config.dev.port,
        historyApiFallback: config.dev.historyApiFallback,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? { warnings: false, errors: true }
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true,
        watchOptions: {
            poll: config.dev.poll
        },
        disableHostCheck: true
    },
    plugins: [
        new webpack.DefinePlugin({
            WP_ENV: JSON.stringify(ENV),
            htmlConfig: JSON.stringify(htmlConfig)
        }),
        new webpack.HotModuleReplacementPlugin(),
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
console.log("pages", pages);
for (var pathname in pages) {
    var conf = {
        filename: pathname + ".html",
        template: pathname + ".ejs",
        htmlConfig,
        inject: true,
        env: ENV
    };
    if (pathname in webpackConfig.entry) {
        conf.chunks = ["runtime", "vendors", "babel-polyfill", pathname];
    }
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            process.env.PORT = port;
            webpackConfig.devServer.port = port;

            webpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${webpackConfig.devServer.host}:${port}`
                        ]
                    },
                    onErrors: config.dev.notifyOnErrors
                        ? utils.createNotifierCallback()
                        : undefined
                })
            );

            resolve(webpackConfig);
        }
    });
});
