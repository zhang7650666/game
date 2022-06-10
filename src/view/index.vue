<template>
    <div class="index-wp">
        <div class="title-info">
            <div class="left-info">
                <span class="info-count" v-if="infoCount > 0">{{
                    infoCount
                }}</span>
                <img
                    :src="info"
                    alt=""
                    class="info"
                    @click="jump('infoCenter')"
                />
            </div>
            <div class="tab">
                <span
                    class="share"
                    :class="{ active: tab == 1 }"
                    @click="changeTab(1)"
                    >分享</span
                >
                <span
                    class="party"
                    :class="{ active: tab == 2 }"
                    @click="changeTab(2)"
                    >聚会</span
                >
            </div>
            <div class="right-info">
                <img :src="my" alt="" class="my" @click="jump('my')" />
            </div>
        </div>
        <div class="wrap">
            <img :src="notify" alt="" class="notify-icon" />
            <ul class="list">
                <li v-for="(item, index) in notifyList" :key="index">
                    {{ item.title }}&nbsp;&nbsp;
                </li>
            </ul>
        </div>

        <!-- 分享 -->
        <div class="user-info" v-show="tab == 1" @scroll="paperScroll">
            <van-pull-refresh
                v-model="article.refreshing"
                @refresh="onRefreshArticle"
                v-if="article.artList.length"
            >
                <van-list
                    v-model:loading="article.loading"
                    :finished="article.finished"
                    finished-text="没有更多了"
                    @load="getArticle"
                >
                    <div v-for="(item, index) in article.artList" :key="index">
                        <user-info :userInfo="item" :idx="index"></user-info>
                    </div>
                </van-list>
            </van-pull-refresh>
            <div class="no-data" v-else>
                <img :src="icon404" alt="" />
                <p>暂分享信息</p>
                <div class="btn-wp" @click="jump('publish')">
                    <p class="save">去发布分享</p>
                </div>
            </div>
        </div>
        <!-- 聚会 -->
        <div class="user-info" v-show="tab == 2" @scroll="paperScroll">
            <van-pull-refresh
                v-model="party.refreshing"
                @refresh="onRefreshParty"
                v-if="party.partyList.length"
            >
                <van-list
                    v-model:loading="party.loading"
                    :finished="party.finished"
                    finished-text="没有更多了"
                    @load="getParty"
                >
                    <div v-for="(item, index) in party.partyList" :key="index">
                        <part-info
                            :partyInfo="item"
                            source="party"
                            :idx="index"
                        ></part-info>
                    </div>
                </van-list>
            </van-pull-refresh>
            <div class="no-data" v-else>
                <img :src="icon404" alt="" />
                <p>暂无聚会信息</p>
                <div class="btn-wp" @click="jump('partyInfo')">
                    <p class="save">去发布聚会</p>
                </div>
            </div>
        </div>

        <van-popover
            v-model:show="showPopover"
            theme="dark"
            :actions="actions"
            @select="onSelect"
            placement="top-end"
            class="fixed-edit-wp"
            v-if="isScrollEnd"
        >
            <template #reference>
                <img
                    :src="fixedEdit"
                    alt=""
                    class="fixed-edit"
                    @click="showPopover = true"
                />
            </template>
        </van-popover>
    </div>
</template>
<script>
export default {
    data() {
        return {
            edit: require("@images/edit-icon.png"),
            info: require("@images/info.png"),
            my: require("@images/my.png"),
            notify: require("@images/notify.png"),
            fixedEdit: require("@images/fixed-edit.png"),
            tab: 1, // 1表示分享 2表示聚会
            // 分享相关信息
            article: {
                loading: false,
                finished: false,
                refreshing: false,
                artList: [],
                pageSize: 5, // 每页多少条
                from: 0,
                to: 6
            },
            party: {
                loading: false,
                finished: false,
                refreshing: false,
                partyList: [],
                pageSize: 5, // 每页多少条
                from: 0,
                to: 6
            },

            infoCount: 0, // 消息数目
            timer: false,
            notifyList: [], // 轮播信息
            icon404: require("@images/404.png"),
            showPopover: false,
            actions: [
                { text: "分享内容", path: "publish" },
                { text: "发布聚会", path: "partyInfo" }
            ],
            isScrollEnd: true
        };
    },

    created() {
        // 获取消息数目
        this.timer = setInterval(() => {
            this.getInfoCount();
        }, 8000);
        this.getInfoCount();
        this.initGetPartyInfo(); // 初始化获取聚会前三条信息
        this.tab == 1 ? this.getArticle() : thie.getParty();
        // 接收评论派发事件
        this.$bus.$off().$on("update:commentCount", (idx, source) => {
            if (source == "article") {
                this.$set(
                    this.article.artList[idx],
                    "topicCount",
                    this.article.artList[idx].topicCount + 1
                );
            } else if (source == "party") {
                this.$set(
                    this.party.partyList[idx],
                    "topicCount",
                    this.party.partyList[idx].topicCount + 1
                );
            }
        });
    },

    methods: {
        // 获取分享数据
        getArticle(arg) {
            if (arg == "refresh") {
                this.article.artList = [];
            }
            this.article.from = this.article.artList.length
                ? this.article.to
                : 0;
            this.article.to = this.article.artList.length
                ? this.article.from + this.article.pageSize
                : this.article.from + this.article.pageSize + 1;

            // [0,1,2,3]的 from1to3就是[1,2]
            const params = {
                url: "/article/home",
                data: {
                    from: this.article.from,
                    to: this.article.to
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    if (this.article.refreshing) {
                        this.article.artList = [];
                        this.article.refreshing = false;
                    }
                    const ids = [];
                    if (this.article.from == "0") {
                        if (res.data.hot && res.data.hot.length) {
                            res.data.hot.forEach(item => {
                                ids.push(item.id);
                                item.hot = true;
                                const pics = [];
                                if (!item.videos) {
                                    item.videos = [];
                                }
                                item.pics.forEach(pic => {
                                    pics.push({ url: pic, isImage: true });
                                });
                                item.pics = pics;
                                this.article.artList.push(item);
                            });
                        }
                    }
                    res.data.new &&
                        res.data.new.forEach(item => {
                            if (ids.indexOf(item.id) == -1) {
                                const pics = [];
                                if (!item.videos) {
                                    item.videos = [];
                                }
                                item.pics &&
                                    item.pics.forEach(pic => {
                                        pics.push({ url: pic, isImage: true });
                                    });
                                item.pics = pics;
                                this.article.artList.push(item);
                            }
                        });

                    this.article.loading = false;
                    if (res.data.new.length < this.article.pageSize) {
                        this.article.finished = true;
                    }
                } else {
                    this.article.finished = true;
                    this.article.loading = false;
                    this.$toast(res.msg);
                }
            });
        },

        onRefreshArticle() {
            // 清空列表数据
            this.article.finished = false;
            // 重新加载数据
            // 将 this.loading 设置为 true，表示处于加载状态
            this.article.loading = true;
            this.getArticle("refresh");
        },

        // 获取聚会数据
        getParty(arg) {
            if (arg == "refresh") {
                this.party.partyList = [];
            }
            this.party.from = this.party.partyList.length ? this.party.to : 0;
            this.party.to = this.party.partyList.length
                ? this.party.from + this.party.pageSize
                : this.party.from + this.party.pageSize + 1;

            // [0,1,2,3]的 from1to3就是[1,2]
            const params = {
                url: "/party/home",
                data: {
                    from: this.party.from,
                    to: this.party.to
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    if (this.party.refreshing) {
                        this.party.partyList = [];
                        this.party.refreshing = false;
                    }

                    const ids = [];
                    if (this.party.from == "0") {
                        if (res.data.hot && res.data.hot.length) {
                            res.data.hot.forEach(item => {
                                ids.push(item.id);
                                item.hot = true;
                                this.party.partyList.push(item);
                            });
                        }
                    }
                    res.data.new &&
                        res.data.new.forEach(item => {
                            if (ids.indexOf(item.id) == -1) {
                                this.party.partyList.push(item);
                            }
                        });

                    this.party.loading = false;
                    if (res.data.new.length < this.party.pageSize) {
                        this.party.finished = true;
                    }
                } else {
                    this.party.finished = true;
                    this.party.loading = false;
                    this.$toast(res.msg);
                }
            });
        },

        onRefreshParty() {
            // 清空列表数据
            this.party.finished = false;
            // 重新加载数据
            // 将 this.loading 设置为 true，表示处于加载状态
            this.party.loading = true;
            this.getParty("refresh");
        },
        // 初始化获取聚会前三条信息
        initGetPartyInfo() {
            const params = {
                url: "/party/home",
                data: {
                    from: 0,
                    to: 4
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.notifyList = [
                        ...res.data.new,
                        ...res.data.new,
                        ...res.data.new
                    ];
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 点击tab切换
        changeTab(idx) {
            if (idx == 2 && !this.party.partyList.length) {
                this.getParty();
            }
            this.tab = idx;
        },
        // 跳转
        jump(arg) {
            this.$router.push({ path: `/${arg}` });
        },

        // 获取消息数目
        getInfoCount() {
            const params = {
                url: "/messages/new",
                data: {}
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    const { count } = res.data;
                    this.infoCount =
                        count == 0 ? "" : count > 99 ? "99+" : count;
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        onSelect(action) {
            this.$router.push({
                path: action.path
            });
        },
        paperScroll() {
            this.isScrollEnd = false;
            let timer = null;
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                this.isScrollEnd = true;
            }, 1000);
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    }
};
</script>

<style lang="scss" scoped>
.index-wp {
    height: 100%;
    background: #312d29;
    display: flex;
    flex-direction: column;
    font-size: 0.28rem;
    overflow: hidden;
    position: relative;
    .title-info {
        display: flex;
        line-height: 0.4rem;
        background: #423430;
        align-items: center;
        padding: 0.22rem 0.32rem;
        img {
            display: inline-block;
            &.edit {
                width: 0.48rem;
                height: 0.48rem;
                background-size: 0.48rem 0.48rem;
            }
        }
        .tab {
            flex: 1;
            text-align: center;
            font-size: 0.3rem;
            font-weight: 400;
            color: #867b73;
            line-height: 0.3rem;
            span {
                display: inline-block;
                // padding: 0 0.28rem;
                &.active {
                    color: #f6b68e;
                    font-weight: 500;
                    position: relative;
                    &::after {
                        position: absolute;
                        content: " ";
                        width: 100%;
                        height: 0.08rem;
                        background: #f2926e;
                        bottom: -0.2rem;
                        left: 0rem;
                        border-radius: 0.08rem;
                    }
                }
                &.party {
                    margin-left: 0.6rem;
                }
            }
        }
        .left-info {
            position: relative;
            .info-count {
                position: absolute;
                top: -0.1rem;
                left: 0.2rem;
                width: 0.5rem;
                height: 0.3rem;
                background: red;
                color: #fff;
                font-size: 0.24rem;
                z-index: 3;
                border-radius: 0.15rem;
                line-height: 0.3rem;
                text-align: center;
            }
            img {
                position: relative;
                top: 0.07rem;
                width: 0.4rem;
                height: 0.4rem;
                background-size: 0.4rem 0.4rem;
            }
        }
        .right-info {
            position: relative;
            img {
                position: relative;
                top: 0.07rem;
                width: 0.4rem;
                height: 0.4rem;
                background-size: 0.4rem 0.4rem;
                &.my {
                    margin-left: 0.26rem;
                }
            }
        }
    }
    // 滚动通知
    .wrap {
        overflow: hidden;
        width: 10rem;
        position: relative;
        margin: 0rem 0.32rem;
        height: 0.72rem;
        background: #2f2c2a;
        .notify-icon {
            position: absolute;
            top: 0.18rem;
            left: 0rem;
            width: 0.32rem;
            height: 0.32rem;
            background-size: 0.32rem 0.32rem;
            margin-right: 0.16rem;
            z-index: 3;
            background: #2f2c2a;
        }
        .list {
            position: relative;
            top: 0px;
            left: 0px;
            width: 200%;
            animation: mymove 15s infinite linear;
            li {
                font-size: 0.26rem;
                font-weight: 400;
                color: #f2926e;
                line-height: 0.72rem;
                float: left;
            }
        }
    }

    .user-info {
        flex: 1;
        overflow-y: scroll;
    }
    .fixed-edit-wp {
        position: fixed;
        bottom: 0.5rem;
        right: 0.32rem;
        img {
            width: 1.16rem;
            height: 1.16rem;
            background-size: 1.16rem 1.16rem;
        }
    }
}

@-webkit-keyframes mymove {
    from {
        left: 0px;
    }
    to {
        left: -6rem;
    }
}
</style>
