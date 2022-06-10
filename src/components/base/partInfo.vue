<template>
    <div class="v-partInfo" :class="{ 'sign-source': source == 'sign' }">
        <!-- 用户信息 -->
        <div class="user-info">
            <bg
                :icon="owner.icon"
                :size="1.04"
                :sex="owner.sex"
                :manager="owner.is_manager"
                mSize="msize3"
            ></bg>
            <div class="name-set-phone">
                <div class="name-set">
                    <span class="name">{{ owner.name }}</span>
                    <div class="icon-desc">
                        <img :src="statusIcon" alt="" class="set" />
                        <span class="desc-status">{{
                            partyInfo.joinStateDisplayText
                        }}</span>
                    </div>
                </div>
                <div class="hot-phone">
                    <p class="phone">{{ partyInfo.create_at.substr(0, 16) }}</p>
                    <div class="hot-wp" v-if="partyInfo.hot">
                        <img :src="hotIcon" alt="" class="hot-icon" />
                    </div>
                </div>
            </div>
        </div>
        <ul>
            <li>
                <p class="title">{{ partyInfo.title }}</p>
                <p class="content">{{ partyInfo.content }}</p>
            </li>
            <li class="flex">
                <p class="label">时间</p>
                <p class="value">
                    {{ getWeek(partyInfo.start_time) }}
                </p>
            </li>
            <li class="flex">
                <p class="label">地点</p>
                <p class="value">
                    {{ partyInfo.location }}
                </p>
            </li>
            <li class="flex">
                <p class="label">每人预算</p>
                <p class="value">{{ partyInfo.money }}元/人</p>
            </li>
            <li>
                <p class="title">活动安排</p>
                <p class="content">{{ partyInfo.desc }}</p>
            </li>
            <li class="sign-count">
                <div class="sign-info">
                    <p class="label">已报名人员</p>
                    <p class="value">
                        {{ partyInfoCache.joinPlayers.length }}人
                    </p>
                </div>
                <div class="img-list">
                    <img
                        v-for="(item, index) in partyInfoCache.joinPlayers"
                        :key="index"
                        :src="item.icon"
                        alt=""
                    />
                </div>
                <img
                    :src="isSignIcon"
                    alt=""
                    class="sign-status"
                    @click="clickJoin"
                    v-if="isPartyBtn"
                />

                <v-status
                    :userInfo="partyInfo"
                    :source="source"
                    @update:commit="getCommentList"
                ></v-status>
            </li>
        </ul>
        <van-popup
            v-model:show="popShow"
            closeable
            position="bottom"
            :style="{ height: '100%' }"
        >
            <v-comment
                source="party"
                :idx="idx"
                :userInfo="partyInfo"
            ></v-comment>
        </van-popup>
    </div>
</template>
<script>
export default {
    props: {
        partyInfo: {
            type: Object,
            default: () => ({})
        },
        source: {
            type: String
        },
        idx: {
            type: Number
        }
    },
    data() {
        return {
            statusIcon: require("@images/status.png"),
            signIcon: require("@images/sign.png"),
            signedIcon: require("@images/signed.png"),
            hotIcon: require("@images/hot.png"),
            isSignIcon: "",
            owner: {},
            popShow: false, // 评论弹框显示
            partyInfoCache: {},
            isPartyBtn: false,
            isSign: true // 是否可以报名
        };
    },
    watch: {
        partyInfo: {
            //深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                this.partyInfo = val;
            },
            deep: true //true 深度监听
        }
    },
    created() {
        this.partyInfoCache = JSON.parse(JSON.stringify(this.partyInfo));
        this.newDateGtEndDate();
        if (this.$route.name != "publishParty") {
            this.isSignIcon = this.isSign ? this.signedIcon : this.signIcon;
            this.isPartyBtn =
                this.partyInfoCache.joinStateDisplayText == "报名已经结束"
                    ? false
                    : true;
        }

        this.owner = this.partyInfo.owner
            ? this.partyInfo.owner
            : JSON.parse(localStorage.getItem("wxUserInfo"));
    },
    methods: {
        getWeek(dateStr) {
            const arr = dateStr.split(" ");
            const dateArray = arr[0].split("-");
            const date = new Date(
                dateArray[0],
                parseInt(dateArray[1] - 1),
                dateArray[2]
            );
            const week = "星期" + "日一二三四五六".charAt(date.getDay());
            const time = arr[1].substr(0, 5);
            return `${arr[0]} ${week} ${time}`;
        },
        // 结束时间是否大于当前时间
        newDateGtEndDate() {
            this.isSign =
                new Date(this.partyInfoCache.appy_end_time).getTime() >
                    new Date().getTime() && this.partyInfoCache.isJoined
                    ? true
                    : false;
        },
        // 获取评论信息
        getCommentList() {
            this.popShow = true;
        },
        // 我要报名
        clickJoin() {
            this.newDateGtEndDate();
            // 如果结束时间大于当前时间，直接返回
            // if (
            //     new Date(this.partyInfoCache.appy_end_time).getTime() >
            //     new Date().getTime()
            // ) {
            //     return;
            // }
            const params = {
                url: "/party/join",
                data: {
                    id: this.partyInfo.id,
                    cancel: this.partyInfoCache.isJoined
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.partyInfoCache.isJoined = !this.partyInfoCache
                        .isJoined;
                    this.newDateGtEndDate();
                    console.log("this.isSign", this.isSign);
                    this.isSignIcon = this.isSign
                        ? this.signedIcon
                        : this.signIcon;
                    this.$toast(
                        `${
                            this.partyInfoCache.isJoined
                                ? "报名成功"
                                : "取消报名"
                        }`
                    );
                    this.partyInfoCache.joinPlayers.push(
                        ...res.data.joinPlayers
                    );
                    console.log("this.partyInfoCache", this.partyInfoCache);
                } else {
                    this.$toast(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.v-partInfo {
    display: flex;
    height: 100%;
    font-size: 0.28rem;
    padding: 0.39rem;
    flex-direction: column;

    .user-info {
        display: flex;
        align-items: center;
        padding: 0.28rem 0 0.38rem;
        .name-set-phone {
            flex: 1;
            margin-left: 0.4rem;
            .name-set {
                display: flex;
                align-items: center;
                .name {
                    flex: 0 0 2.2rem;
                    font-weight: 600;
                    color: #ffffff;
                    font-size: 0.3rem;
                    line-height: 0.6rem;
                    white-space: nowrap; /* 规定文本是否折行 */
                    overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
                    text-overflow: ellipsis;
                }
                .icon-desc {
                    flex: 1;
                    text-align: right;
                    .set {
                        width: 0.4rem;
                        height: 0.4rem;
                        background-size: 0.4rem 0.4rem;
                        margin-left: 0.15rem;
                        vertical-align: middle;
                    }
                    .desc-status {
                        font-size: 0.3rem;
                        font-weight: 400;
                        color: #e9ad87;
                        line-height: 0.42rem;
                        display: inline-block;
                        margin-left: 0.16rem;
                        position: relative;
                        top: 0.04rem;
                    }
                }
            }
            .hot-phone {
                padding-top: 0.14rem;
                display: flex;
                .phone {
                    flex: 1;
                    font-size: 0.28rem;
                    font-weight: 400;
                    color: #a59c91;
                    line-height: 0.44rem;
                }
                .hot-wp {
                    text-align: right;
                    .hot-icon {
                        display: inline-block;
                        width: 0.56rem;
                        height: 0.3rem;
                        background-size: 0.56rem 0.3rem;
                    }
                }
            }
        }
    }
    ul {
        flex: 1;
        overflow-y: auto;
        li {
            font-weight: 500;
            border-bottom: thin solid #3b3733;
            &.flex {
                display: flex;
                padding: 0.36rem 0;
            }
            .title {
                font-size: 0.36rem;
                color: #f6b68e;
                line-height: 0.5rem;
                padding: 0.32rem 0 0.2rem;
            }
            .content {
                font-size: 0.3rem;
                color: #ffffff;
                line-height: 0.42rem;
                padding-bottom: 0.18rem;
            }
            .label {
                flex: 0 0 1.6rem;
                font-size: 0.3rem;
                font-weight: 400;
                color: #999999;
                line-height: 0.38rem;
            }
            .value {
                font-size: 0.3rem;
                font-weight: 400;
                color: #f6b68e;
                line-height: 0.38rem;
                flex: 1;
                text-align: right;
                padding-right: 0.24rem;
                // overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
            }
            &.sign-count {
                border-bottom: none;
                .sign-info {
                    display: flex;
                    padding: 0.32rem 0rem 0.32rem;
                }
                .img-list {
                    padding: 0.08rem 0rem;
                    display: flex;
                    flex-wrap: wrap;
                    img {
                        width: 0.56rem;
                        height: 0.56rem;
                        background-size: 0.56rem 0.56rem;
                        display: inline-block;
                        margin: 0 0.32rem 0.18rem 0rem;
                        border-radius: 100% 100%;
                        &:nth-child(8n) {
                            margin-right: 0rem;
                        }
                    }
                }
                .sign-status {
                    display: block;
                    width: 5.64rem;
                    height: 0.88rem;
                    background-size: 5.64rem 0.88rem;
                    margin: 0.15rem auto;
                    margin-bottom: 0.3rem;
                }
            }
        }
    }
    &.sign-source {
        padding: 0 0.18rem 0.24rem;
        ul {
            li {
                .value {
                    flex: 0 0 4.6rem;
                }
                .img-list {
                    padding: 0.08rem 0rem;
                    display: flex;
                    flex-wrap: wrap;
                    img {
                        width: 0.56rem;
                        height: 0.56rem;
                        background-size: 0.56rem 0.56rem;
                        display: inline-block;
                        margin: 0 0.28rem 0.18rem 0rem;
                        &:nth-child(8n) {
                            margin-right: 0rem;
                        }
                    }
                }
            }
        }
    }
}
</style>
