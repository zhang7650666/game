/*
 * @Author: Hadwin zhanghuawei@shengpay.com
 * @Date: 2022-02-18 22:05:17
 * @LastEditors: Hadwin zhanghuawei@shengpay.com
 * @LastEditTime: 2022-06-10 12:51:49
 * @FilePath: \demo\static\config\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const base = {
    routerBase: null
};
module.exports = {
    dev: {
        ...base,
        baseUrl: "http://test.shequ.cxhy.cn/api",
        appId: "wx824434b3d37ffa6a",
        scope: "snsapi_userinfo", //获取用户的基本信息头像等
        state: "wxLogin"
    },
    test: {
        ...base,
        baseUrl: "http://test.shequ.cxhy.cn/api",
        appId: "wx824434b3d37ffa6a",
        scope: "snsapi_userinfo", //获取用户的基本信息头像等
        state: "wxLogin"
    },
    prod: {
        ...base,
        baseUrl: "http://shequ.tiance.cc/api",
        appId: "wx87b6c15e4518ab10",
        scope: "snsapi_userinfo", //获取用户的基本信息头像等
        state: "wxLogin"
    }
};
