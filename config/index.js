/**
 * webpack配置
 */
"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
const ENV = process.env.NODE_ENV; // 环境变量 dev | test | pro | pre | ftp
const path = require("path");
const routerBase = "/"; // 访问地址的公共前缀部分
module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: "static",
        assetsPublicPath: routerBase, // 网页访问路径中的公共前缀
        routerBase,
        proxyTable: {
            // '/api': {
            //         target:'http://feedserver.sdptest.shengpay.com/feedserver/',
            //         // target:'http://10.241.80.32:7070/api/',
            //         // target:'http://10.132.98.18:8082/api/',
            //         changeOrigin: true,
            //         secure: true,
            //         pathRewrite: {
            //             '^/api': ''
            //         }
            // },
        },
        // Various Dev Server settings
        host: "localhost", // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false, // 默认自动打开浏览器
        historyApiFallback: {
            index: `${routerBase}main.html` // 单页应用history模式需要该配置
        },
        errorOverlay: true, // 显示编译器错误
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
        /**
         * Source Maps
         */
        // https://webpack.js.org/configuration/devtool/#development
        devtool: "cheap-module-eval-source-map",
        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,
        cssSourceMap: true
    },

    build: {
        assetsRoot: path.resolve(__dirname, `../dist/`), // 打包出来的所有文件所在的根目录
        assetsSubDirectory: "static/", // 静态资源打包出来后所存放的目录
        assetsPublicPath: routerBase, // html里引用的js css 路径
        routerBase, // 页面访问的公共前缀部分
        productionSourceMap: ENV === "test" ? true : false,
        devtool: "#source-map",
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],
        watch: false
    }
};
