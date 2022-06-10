<template>
    <div class="v-comment">
        <h3 class="total" v-if="dataList.length">
            全部评论{{ allCount }}条评论
        </h3>
        <div class="comment-list" v-if="dataList.length">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="getInfo"
                >
                    <ul class="com-list">
                        <li v-for="(item, index) in dataList">
                            <!-- <img :src="item.icon" alt="" class="avatar" /> -->
                            <bg
                                :icon="item.owner.icon"
                                size="0.56"
                                class="avatar"
                                :sex="item.owner.sex"
                                :manager="item.owner.is_manager"
                                mSize="msize4"
                            >
                            </bg>
                            <div class="com-content">
                                <div class="hot-user-name">
                                    <p class="user-name">
                                        {{ item.owner.name }}
                                    </p>
                                    <!-- <div class="hot-wp" v-if="item.hot">
                                        <img
                                            :src="hotIcon"
                                            alt=""
                                            class="hot-icon"
                                        />
                                    </div> -->
                                </div>

                                <p class="content" v-html="item.content"></p>
                                <div class="crate-time-topic">
                                    <span class="create-time">{{
                                        $passDate(
                                            new Date(item.create_at).getTime()
                                        )
                                    }}</span>
                                    <span class="topic-count">{{
                                        item.loveCount
                                    }}</span>

                                    <img
                                        :src="
                                            item.isLoved
                                                ? activeLoveIcon
                                                : loveIcon
                                        "
                                        alt=""
                                        class="topic-icon"
                                        @click="clickLove(index)"
                                    />
                                </div>
                            </div>
                        </li>
                    </ul>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="no-data" v-else>
            <img :src="icon404" alt="" />
            <p>暂无评论信息,点击下方评论</p>
        </div>
        <div class="reply-wp">
            <send @update:send="postComment"></send>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        source: {
            type: String
        },
        userInfo: {
            type: Object
        },
        idx: {
            type: Number
        }
    },
    data() {
        return {
            loading: false,
            finished: false,
            refreshing: false,
            pageSize: 10, // 每页多少条
            from: 0,
            to: 11,
            dataList: [],
            icon404: require("@images/404.png"),
            loveIcon: require("@images/love.png"), // 点赞
            activeLoveIcon: require("@images/love-active.png"),
            hotIcon: require("@images/hot.png"),
            allCount: 0,
            userInfoCache: JSON.parse(JSON.stringify(this.userInfo))
        };
    },
    created() {
        this.getInfo();
    },

    methods: {
        // 获取消息接口信息
        getInfo(arg) {
            if (arg == "refresh") {
                this.dataList = [];
            }
            this.from = this.dataList.length ? this.to : 0;
            this.to = this.dataList.length
                ? this.from + this.pageSize
                : this.from + this.pageSize + 1;

            const params = {
                url: `/${this.source}/topics`,
                data: {
                    from: this.from,
                    to: this.to,
                    id: this.userInfoCache.id
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    if (this.refreshing) {
                        this.dataList = [];
                        this.refreshing = false;
                    }
                    const ids = [];
                    if (this.from == "0") {
                        if (res.data.hot && res.data.hot.length) {
                            res.data.hot.forEach(item => {
                                ids.push(item.id);
                                item.hot = true;
                                this.dataList.push(item);
                            });
                        }
                    }

                    res.data.new.forEach(item => {
                        if (ids.indexOf(item.id) == -1) {
                            this.dataList.push(item);
                        }
                    });

                    this.loading = false;
                    this.allCount = res.data.allCount;
                    if (res.data.new.length < this.pageSize) {
                        this.finished = true;
                    }
                } else {
                    this.finished = true;
                    this.loading = false;
                    this.$toast(res.msg);
                }
            });
        },

        onRefresh() {
            // 清空列表数据
            this.finished = false;
            // 重新加载数据
            // 将 this.loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.getInfo("refresh");
        },
        // 去发布聚会
        jump() {
            this.$router.push({
                path: this.source == "article" ? "/publish" : "/partyInfo"
            });
        },
        // 发表评论
        postComment(arg) {
            if (!arg) return;
            const params = {
                url: `/${this.source}/post/topic`,
                data: {
                    id: this.userInfoCache.id,
                    content: arg
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.dataList.unshift(res.data);
                    this.$bus.$emit(
                        "update:commentCount",
                        this.idx,
                        this.source
                    );
                    this.allCount++;
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        clickLove(idx) {
            const params = {
                url: `/love/topic`,
                keepLoading: true,
                data: {
                    id: this.userInfoCache.id,
                    cancel: this.userInfoCache.isLoved
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.dataList[idx].loveCount = this.dataList[idx].isLoved
                        ? this.dataList[idx].loveCount - 1
                        : this.dataList[idx].loveCount + 1;
                    this.dataList[idx].isLoved = !this.dataList[idx].isLoved;
                } else {
                    this.$toast(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.v-comment {
    height: 100%;
    display: flex;
    font-size: 0.28rem;
    padding: 0.3rem 0rem 0.2rem;
    background: #312d29;
    flex-direction: column;
    box-sizing: border-box;
    .total {
        font-size: 0.34rem;
        font-weight: 500;
        color: #ffffff;
        line-height: 0.48rem;
        padding: 0 0 0.38rem 0.32rem;
    }
    .comment-list {
        flex: 1;
        overflow-y: auto;
        padding: 0 0.32rem;
        .com-list {
            li {
                display: flex;
                padding-top: 0.44rem;
                .avatar {
                    width: 0.56rem;
                    height: 0.56rem;
                    background-size: 0.56rem 0.56rem;
                    display: inline-block;
                    margin-right: 0.24rem;
                }
                .com-content {
                    display: flex;
                    flex-direction: column;
                    border-bottom: thin solid #46423e;
                    padding-bottom: 0.44rem;
                    .hot-user-name {
                        display: flex;
                        align-items: center;
                        .user-name {
                            font-size: 0.32rem;
                            font-weight: 400;
                            color: #ffffff;
                            line-height: 0.56rem;
                            width: 5.4rem;
                            // padding-bottom: 0.24rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
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

                    .content {
                        font-size: 0.3rem;
                        font-weight: 400;
                        color: #ffffff;
                        line-height: 0.48rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-top: 0.24rem;
                    }
                    .crate-time-topic {
                        display: flex;
                        padding-top: 0.26rem;
                        .create-time {
                            font-size: 0.28rem;
                            font-weight: 400;
                            color: #999999;
                            line-height: 0.4rem;
                        }
                        .topic-count {
                            flex: 1;
                            font-size: 0.28rem;
                            font-weight: 400;
                            color: #f2926e;
                            line-height: 0.4rem;
                            display: inline-block;
                            padding-right: 0.22rem;
                            text-align: right;
                        }
                        .topic-icon {
                            width: 0.4rem;
                            height: 0.4rem;
                            background-size: 0.4rem 0.4rem;
                        }
                    }
                }
            }
        }
    }
    .no-data {
        flex: 1;
        overflow-y: auto;
    }

    .reply-wp {
        padding: 0.15rem 0rem;

        .reply-main {
            width: 6.86rem;
            height: 0.64rem;
            background: #46423e;
            border-radius: 0.36rem;
            // opacity: 0.1;
            display: flex;
            align-items: center;
            img {
                width: 0.44rem;
                height: 0.44rem;
                background-size: 0.44rem 0.44rem;
                display: inline-block;
                margin-left: 0.28rem;
                margin-right: 0.08rem;
            }
            input {
                outline: none;
                border: none;
                font-size: 0.24rem;
                font-weight: 400;
                color: #fff;
                height: 0.48rem;
                line-height: 0.48rem;
                background: transparent;
                position: relative;
                top: 0.02rem;
            }
        }
    }
}
</style>
