<template>
    <div class="info-wp">
        <div class="search-wp">
            <van-search
                v-model="searchWord"
                show-action
                placeholder="请输入搜索关键词"
                @search="onSearch"
            >
                <template #action>
                    <div @click="onClickButton">搜索</div>
                </template>
            </van-search>
        </div>
        <div class="srcoll-wp" v-if="dataList.length">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="getInfo"
                >
                    <div v-for="(item, index) in dataList" :key="index">
                        <info :infoItem="item" source="mailList">
                            <div class="desc-wp">
                                <h3 class="title">{{ item.name }}</h3>
                            </div>
                        </info>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>

        <div class="no-data" v-else>
            <img :src="icon404" alt="" />
            <p>暂通讯录信息</p>
            <div class="btn-wp" @click="jump">
                <p class="save">返回</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
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
            searchWord: "" // 搜索关键字
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
                url: "/view/players",
                data: {
                    from: this.from,
                    to: this.to,
                    searchWord: this.searchWord
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    if (this.refreshing) {
                        this.dataList = [];
                        this.refreshing = false;
                    }

                    this.dataList = this.dataList.concat(res.data);
                    this.loading = false;
                    if (res.data.length < this.pageSize) {
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
            this.$router.push({ path: "/my" });
        },
        // 回车搜索
        onSearch() {
            this.dataList = [];
            this.getInfo();
        },
        // 点击搜索
        onClickButton() {
            this.dataList = [];
            this.getInfo();
        }
    }
};
</script>

<style lang="scss" scoped>
.info-wp {
    height: 100%;
    background: #312d29;
    display: flex;
    flex-direction: column;
    font-size: 0.28rem;
    .srcoll-wp {
        flex: 1;
        overflow-y: auto;
        .desc-wp {
            width: 3.46rem;
            margin-left: 0.38rem;
            .title {
                white-space: nowrap; /* 规定文本是否折行 */
                overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
                text-overflow: ellipsis;
                font-size: 0.3rem;
                line-height: 0.54rem;
                color: #fff;
                font-weight: 400;
            }
        }
    }
}
</style>
