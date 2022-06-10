<template>
    <div class="index-wp">
        <!-- 分享 -->
        <div class="user-info" v-if="article.artList.length">
            <van-pull-refresh
                v-model="article.refreshing"
                @refresh="onRefreshArticle"
            >
                <van-list
                    v-model:loading="article.loading"
                    :finished="article.finished"
                    finished-text="没有更多了"
                    @load="getArticle"
                >
                    <div v-for="(item, index) in article.artList" :key="index">
                        <user-info
                            :userInfo="item"
                            v-if="item.type == 'article'"
                        ></user-info>
                        <part-info
                            :partyInfo="item"
                            source="party"
                            :idx="index"
                            v-if="item.type == 'party'"
                        ></part-info>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>

        <div class="no-data" v-else>
            <img :src="icon404" alt="" />
            <p>暂无收藏信息</p>
            <div class="btn-wp" @click="jump">
                <p class="save">去收藏</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
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
            icon404: require("@images/404.png")
        };
    },
    created() {
        this.getArticle();
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
                url: "/my/collects",
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
                    // 处理成需要的格式才能方便预览
                    res.data &&
                        res.data.map(item => {
                            const picsObj = [];
                            if (!item.videos) {
                                item.videos = [];
                            }
                            item.pics &&
                                item.pics.forEach(pic => {
                                    picsObj.push({ url: pic, isImage: true });
                                });
                            item.pics = picsObj;
                            this.article.artList.push(item);
                        });

                    this.article.loading = false;
                    if (res.data.length < this.article.pageSize) {
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
        // 去发布聚会
        jump() {
            this.$router.push({ path: "/index" });
        }
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

    .user-info {
        flex: 1;
        overflow-y: scroll;
    }
}
</style>
