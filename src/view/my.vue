<template>
    <div class="my-wp">
        <!-- 用户信息 -->
        <div class="user-info">
            <bg
                :icon="wxUserInfo.icon"
                :sex="wxUserInfo.sex"
                :manager="wxUserInfo.is_manager"
                mSize="msize1"
            ></bg>
            <div class="name-set-phone">
                <div class="name-set">
                    <span class="name">{{ wxUserInfo.name }}</span>
                    <img
                        @click="jump('userInfo')"
                        :src="setIcon"
                        alt=""
                        class="set"
                    />
                </div>
                <p class="phone">{{ phoneMask(wxUserInfo.phone) }}</p>
            </div>
        </div>
        <!-- 联系人信息 -->
        <div class="concat-wp" @click="jump('mailList')">
            <img :src="concatIcon" alt="" class="concat-icon" />
            <p class="concat-text">查看江湖通讯录</p>
            <img :src="arrowIcon" alt="" class="arrow-icon" />
        </div>
        <!-- 入口信息 -->
        <ul class="entry-wp">
            <li>
                <div class="bg-shap2" @click="jump('publishParty')">
                    <p class="text">5</p>
                    <p class="title">我发布的聚会</p>
                </div>
                <div class="bg-shap2" @click="jump('signParty')">
                    <p class="text">20</p>
                    <p class="title">我参与的聚会</p>
                </div>
            </li>
            <li>
                <div class="bg-shap2" @click="jump('myShare')">
                    <img :src="shareIcon" alt="" />
                    <p class="title">我的分享</p>
                </div>
                <div class="bg-shap2" @click="jump('myLove')">
                    <img :src="loveIcon" alt="" />
                    <p class="title">我的收藏</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { phoneMask } from "@/utils/util";
export default {
    data() {
        return {
            setIcon: require("@images/set.png"),
            concatIcon: require("@images/concat.png"),
            arrowIcon: require("@images/arrow-right.png"),
            shareIcon: require("@images/share.png"),
            loveIcon: require("@images/my-love.png"),
            wxUserInfo: {
                name: "妖妖灵",
                phone: "18637407584",
                icon: require("@images/avatar.png"),
                sex: 0
            }
        };
    },
    created() {
        this.wxUserInfo =
            localStorage.getItem("wxUserInfo") &&
            JSON.parse(localStorage.getItem("wxUserInfo"));
    },
    methods: {
        phoneMask,
        // 跳转到其他页面
        jump(arg) {
            this.$router.push({ path: `/${arg}` });
        }
    }
};
</script>

<style lang="scss" scoped>
.my-wp {
    min-height: 100%;
    background: url("~@images/my-bg.png") no-repeat;
    background-size: 100% 100%;
    padding: 0.8rem 0.3rem 0;
    // 用户信息
    .user-info {
        display: flex;
        padding-top: 1.08rem;
        align-items: center;
        .name-set-phone {
            flex: 1;
            margin-left: 0.4rem;
            .name-set {
                display: flex;
                align-items: center;
                .name {
                    flex: 0 0 4.25rem;
                    font-weight: 600;
                    color: #ffffff;
                    font-size: 0.44rem;
                    line-height: 0.6rem;
                    white-space: nowrap; /* 规定文本是否折行 */
                    overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
                    text-overflow: ellipsis;
                }
                .set {
                    width: 0.4rem;
                    height: 0.4rem;
                    background-size: 0.4rem 0.4rem;
                    margin-left: 0.15rem;
                }
            }
            .phone {
                padding-top: 0.14rem;
                font-size: 0.32rem;
                font-weight: 400;
                color: #ffffff;
                line-height: 0.44rem;
            }
        }
    }
    // 联系人信息
    .concat-wp {
        background: url("~@images/shap1.png") no-repeat;
        width: 6.94rem;
        height: 1.04rem;
        background-size: 6.94rem 1.04rem;
        display: flex;
        align-items: center;
        margin-top: 0.74rem;
        .concat-icon {
            margin-left: 0.36rem;
            width: 0.4rem;
            height: 0.46rem;
            background-size: 0.4rem 0.46rem;
        }
        .concat-text {
            flex: 1;
            font-size: 0.36rem;
            font-weight: 400;
            color: #fae4a2;
            line-height: 0.5rem;
            padding-left: 0.62rem;
        }
        .arrow-icon {
            width: 0.4rem;
            height: 0.5rem;
            background-size: 0.4rem 0.5rem;
            margin-right: 0.22rem;
        }
    }
    // 入口信息
    .entry-wp {
        padding-top: 0.24rem;
        li {
            display: flex;
            .bg-shap2 {
                flex: 1;
                width: 3.34rem;
                height: 2.4rem;
                background: url("~@images/shap2.png") no-repeat;
                background-size: 3.34rem 2.4rem;
                margin: 0rem 0.26rem 0.24rem 0rem;
                text-align: center;
                &:last-child {
                    margin-right: 0rem;
                }
                .text {
                    font-size: 0.96rem;
                    font-weight: 400;
                    color: #fae4a2;
                    line-height: 1.34rem;
                    margin: 0.22rem auto 0.06rem;
                }
                .title {
                    font-size: 0.36rem;
                    font-weight: 400;
                    color: #fae4a2;
                    line-height: 0.5rem;
                }
                img {
                    width: 0.8rem;
                    height: 0.8rem;
                    background-size: 0.8rem 0.8rem;
                    margin: 0.34rem 0rem 0.1rem;
                }
            }
        }
    }
}
</style>
