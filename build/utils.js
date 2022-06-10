"use strict";
const path = require("path");
const config = require("../config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageConfig = require("../package.json");
var glob = require("glob");

exports.assetsPath = function(_path) {
    const assetsSubDirectory =
        process.env.NODE_ENV !== "dev"
            ? config.build.assetsSubDirectory
            : config.dev.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function(options) {
    options = options || {};

    const cssLoader = {
        loader: "css-loader",
        options: {
            sourceMap: options.sourceMap,
            minimize: true
        }
    };

    const postcssLoader = {
        loader: "postcss-loader",
        options: {
            plugins: [require("autoprefixer")("last 100 versions")],
            sourceMap: options.sourceMap
        }
    };

    function resolveResource(name) {
        return path.resolve(__dirname, "../src/st/css/" + name);
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = [];

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            loaders.push(MiniCssExtractPlugin.loader);
        } else {
            loaders.push("vue-style-loader");
        }

        loaders.push(cssLoader);

        if (options.usePostCSS) {
            loaders.push(postcssLoader);
        }
        if (loader === "sass" || loader === "scss") {
            loaders.push({
                loader: "sass-loader",
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
            loaders.push({
                loader: "sass-resources-loader",
                options: {
                    // 多个文件时用数组的形式传入，单个文件时可以直接使用 path.resolve(__dirname, '../static/style/common.scss'
                    resources: [resolveResource("_variables.scss")]
                }
            });
        } else if (loader) {
            loaders.push({
                loader: loader + "-loader",
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        return loaders;
    }
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        sass: generateLoaders("sass"),
        scss: generateLoaders("sass")
    };
};

exports.styleLoaders = function(options) {
    const output = [];
    const loaders = exports.cssLoaders(options);
    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp("\\." + extension + "$"),
            use: loader
        });
    }
    return output;
};

exports.createNotifierCallback = () => {
    const notifier = require("node-notifier");

    return (severity, errors) => {
        if (severity !== "error") return;

        const error = errors[0];
        const filename = error.file && error.file.split("!").pop();

        notifier.notify({
            title: packageConfig.name,
            message: severity + ": " + error.name,
            subtitle: filename || "",
            icon: path.join(__dirname, "logo.png")
        });
    };
};

// 获取入口文件路径
exports.getEntry = function(globPath) {
    var entries = {},
        basename,
        tmp,
        pathname;
    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        entries[basename] = entry;
    });
    return entries;
};
