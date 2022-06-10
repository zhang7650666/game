<template>
    <div class="login-wp">
        <div class="login-info" v-if="false">
            <img :src="logo" alt="" class="logo" />
            <div class="wecomle">欢迎来到社区</div>
            <div class="btn-wp" @click="isCodeFn">
                <img :src="wxIcon" alt="" />
                <span>微信登录</span>
            </div>
        </div>
        <div class="logo-bg">
            <img :src="btnImg" alt="" class="btn-img" @click="isCodeFn" />
        </div>
    </div>
</template>
<script>
import { GetURL } from "@/utils/util";
export default {
    data() {
        return {
            logo: require("@images/logo.png"),
            wxIcon: require("@images/wx-icon.png"),
            btnImg: require("@images/logo-btn.png"),
            code: ""
        };
    },
    created() {
        this.isCodeFn();
    },
    methods: {
        // 判断微信code是否存在
        isCodeFn() {
            let wxUserInfo =
                localStorage.getItem("wxUserInfo") &&
                JSON.parse(localStorage.getItem("wxUserInfo"));
            if (wxUserInfo) {
                if (wxUserInfo.session && wxUserInfo.name) {
                    this.$router.replace({ path: "index" });
                    return;
                } else if (wxUserInfo.session) {
                    this.$router.replace({ path: "setName" });
                    return;
                }
            }

            this.code = GetURL("code");
            if (this.code) {
                this.getUserInfo();
            } else {
                this.getWechatCode();
            }
        },
        // 获取微信code
        getWechatCode() {
            const { appId, scope, state } = htmlConfig;
            const redirectUrl = window.location.href;
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
        },
        // 获取用户信息
        getUserInfo() {
            const params = {
                method: "GET",
                url: `/login?wx_code=${this.code}`
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    localStorage.setItem("session", res.data.session);
                    localStorage.setItem(
                        "wxUserInfo",
                        JSON.stringify(res.data)
                    );
                } else {
                    this.$toast(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.login-wp {
    position: relative;
    width: 100%;
    height: 100%;
    // font-size: 0.36rem;
    // padding-top: 1.42rem;
    // text-align: center;
    // font-weight: 400;
    .logo {
        display: inline-block;
        width: 1.6rem;
        height: 1.6rem;
        background-size: 1.6rem 1.6rem;
    }
    .wecomle {
        margin-top: 0.4rem;
        font-size: 0.48rem;
        font-weight: 400;
        color: #000000;
        line-height: 0.66rem;
    }
    .btn-wp {
        display: flex;
        width: 4.8rem;
        height: 0.96rem;
        border-radius: 1rem;
        background: #5fcb78;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-top: 2.32rem;

        img {
            width: 0.54rem;
            height: 0.46rem;
            background-size: 0.54rem 0.46rem;
            display: inline-block;
            margin-right: 0.24rem;
        }
        span {
            font-size: 0.34rem;
            color: #fff;
        }
    }
    & > p {
        padding-top: 1rem;
    }
    & > button {
        outline: none;
        background: #fff;
        padding: 0.1rem 0.2rem;
        border: 1px solid #eee;
    }
    .logo-bg {
        width: 100%;
        height: 100%;
        background: url("~@images/logo-bg.png") no-repeat;
        background-size: 100% 100%;
        .btn-img {
            width: 3.61rem;
            height: 1.18rem;
            background-size: 3.61rem 1.18rem;
            margin: 6rem 1.94rem 0rem;
        }
    }
}
</style>
