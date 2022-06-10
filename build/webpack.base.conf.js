"use strict";
const path = require("path");
const vConsolePlugin = require("vconsole-webpack-plugin");

const utils = require("./utils");
const config = require("../config");
const vueLoaderConfig = require("./vue-loader.conf");
const entries = utils.getEntry("./src/main.js");

const ENV = process.env.NODE_ENV; // 环境变量 dev | test | pro

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}
let webpackConfig = {
    context: path.resolve(__dirname, "../"),
    entry: ["babel-polyfill", "./src/main.js"],
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath:
            ENV !== "dev"
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
            "@images": path.resolve(__dirname, "../static/images")
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("node_modules/webpack-dev-server/client")
                ]
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 4800,
                            name: utils.assetsPath("images/[hash:8].[ext]")
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 4068,
                    name: utils.assetsPath("media/[hash:8].[ext]")
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 80000,
                    name: utils.assetsPath("fonts/[hash:8].[ext]")
                }
            }
        ]
    },

    node: {
        setImmediate: false,
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    },
    plugins: [
        new vConsolePlugin({
            filter: [],
            enable: ENV == "prod" ? false : true
        })
    ]
};
module.exports = webpackConfig;
