import VueRouter from "vue-router";
import Vue from "vue";

const routes = [
    {
        path: "/",
        redirect: { name: "login" }
    },
    {
        path: "/login",
        component: () => import("@/view/login.vue"), // 微信授权登录
        name: "login",
        meta: {
            keepAlive: false,
            title: "微信授权登录"
        }
    },

    {
        path: "/setName",
        component: () => import("@/view/setName.vue"), // 设置
        name: "setName",
        meta: {
            keepAlive: false,
            title: "设置昵称"
        }
    },
    {
        path: "/publish",
        component: () => import("@/view/publish.vue"), // 发布内容
        name: "publish",
        meta: {
            keepAlive: false,
            title: "发布内容"
        }
    },
    {
        path: "/partyInfo",
        component: () => import("@/view/partyInfo.vue"), // 发布聚会
        name: "partyInfo",
        meta: {
            keepAlive: false,
            title: "发布聚会"
        }
    },
    {
        path: "/infoCenter",
        component: () => import("@/view/infoCenter.vue"), // 消息中心
        name: "infoCenter",
        meta: {
            keepAlive: false,
            title: "消息中心"
        }
    },
    {
        path: "/index",
        component: () => import("@/view/index.vue"), // 主页
        name: "index",
        meta: {
            keepAlive: false,
            title: "主页"
        }
    },
    {
        path: "/my",
        component: () => import("@/view/my.vue"), // 我的
        name: "my",
        meta: {
            keepAlive: false,
            title: "我的"
        }
    },
    {
        path: "/publishParty",
        component: () => import("@/view/publishParty.vue"), // 我的
        name: "publishParty",
        meta: {
            keepAlive: false,
            title: "我发布的聚会"
        }
    },
    {
        path: "/signParty",
        component: () => import("@/view/signParty.vue"), // 我的
        name: "signParty",
        meta: {
            keepAlive: false,
            title: "我参与的聚会"
        }
    },
    {
        path: "/userInfo",
        component: () => import("@/view/userInfo.vue"), // 设置
        name: "userInfo",
        meta: {
            keepAlive: false,
            title: "个人信息"
        }
    },
    {
        path: "/editUserInfo",
        component: () => import("@/view/editUserInfo.vue"), // 设置
        name: "editUserInfo",
        meta: {
            keepAlive: false,
            title: "编辑个人信息"
        }
    },
    {
        path: "/mailList",
        component: () => import("@/view/mailList.vue"), // 通讯录
        name: "mailList",
        meta: {
            keepAlive: false,
            title: "通讯录"
        }
    },
    {
        path: "/myShare",
        component: () => import("@/view/myShare.vue"), // 我的分享
        name: "myShare",
        meta: {
            keepAlive: false,
            title: "我的分享"
        }
    },
    {
        path: "/myLove",
        component: () => import("@/view/myLove.vue"), // 我的分享
        name: "myLove",
        meta: {
            keepAlive: false,
            title: "我收藏的分享"
        }
    },

    {
        path: "*",
        redirect: { name: "404" }
    },
    {
        path: "/404",
        component: () => import("@/view/404.vue"), // 404
        name: "404",
        meta: {
            title: "404"
        }
    }
];
Vue.use(VueRouter);
const scrollBehavior = function(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition;
    } else {
        return { x: 0, y: 0 };
    }
};
const router = new VueRouter({
    routes,
    base: htmlConfig.routerBase,
    scrollBehavior,
    mode: "history"
});

router.beforeEach((to, form, next) => {
    // 路由拦截

    let fullPath = to.fullPath;
    if (to.name === "login") {
        next();
        return;
    }
    next();
    // const openId = localStorage.getItem("openId");
    // if (!openId) {
    //     //保存当前路由地址，授权后还会跳到此地址
    //     localStorage.setItem("wxRedirectUrl", fullPath);
    //     //请求微信授权,并跳转到 /auth 路由
    //     let appId = "公众号appid";
    //     let redirectUrl = encodeURIComponent("正式环境授权页面路径");
    //     //判断是否为正式环境
    //     if (window.location.origin.indexOf("正式环境域名") !== -1) {
    //         redirectUrl = encodeURIComponent("正式环境授权页面路径");
    //     } else {
    //         redirectUrl = encodeURIComponent("测试环境授权页面路径");
    //     }
    //     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize? appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect&connect_redirect=1`;
    // } else {
    //     next();
    // }
});

router.afterEach((to, from) => {
    document.title = to.params.title || to.meta.title; // 设置title
});

export default router;
