<template>
    <div class="info-wp">
        <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
            v-if="dataList.length"
        >
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="getInfo"
            >
                <div v-for="(item, index) in dataList" :key="index">
                    <info :infoItem="item" source="infoCenter">
                        <div class="desc-wp">
                            <h3 class="title">
                                {{ item.from ? item.from.name : "社区小助手" }}
                            </h3>
                            <p class="content">
                                {{ getContent(item) }}
                            </p>
                        </div>
                    </info>
                </div>
            </van-list>
        </van-pull-refresh>
        <div class="no-data" v-else>
            <img :src="icon404" alt="" />
            <p>暂无消息</p>
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
            icon404: require("@images/404.png"),
            dataList: []
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
                url: "/messages/read",
                data: {
                    from: this.from,
                    to: this.to
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
        // 返回
        jump() {
            this.$router.push({ path: "/index" });
        },
        // 获取消息内容
        getContent(args) {
            let res = "";
            if (args.from) {
                switch (args.type) {
                    case 0:
                        res = `您发布的${args.party ? "聚会" : "分享"}审核中`;
                        break;
                    case 1:
                        res = `您发布的${args.party ? "聚会" : "分享"}审核通过`;
                        break;
                    case 2:
                        res = `您发布的${
                            args.party ? "聚会" : "分享"
                        }审核不通过`;
                        break;
                    case 3:
                        res = `您发布的${args.party ? "聚会" : "分享"}被${
                            args.from.name
                        }点赞`;
                        break;
                    case 4:
                        res = `您发布的${args.party ? "聚会" : "分享"}被${
                            args.from.name
                        }评论`;
                        break;
                }
            } else {
                switch (args.type) {
                    case 0:
                        res = `您发布的${args.party ? "聚会" : "分享"}审核中`;
                        break;
                    case 1:
                        res = `您发布的${args.party ? "聚会" : "分享"}审核通过`;
                        break;
                    case 2:
                        res = `您发布的${
                            args.party ? "聚会" : "分享"
                        }审核不通过`;
                        break;
                    case 3:
                        res = `您发布的${args.party ? "聚会" : "分享"}被点赞`;
                        break;
                    case 4:
                        res = `您发布的${args.party ? "聚会" : "分享"}被评论`;
                        break;
                }
            }
            return res;
        }
    }
};
</script>

<style lang="scss" scoped>
.info-wp {
    min-height: 100%;
    background: #312d29;
    display: flex;
    flex-direction: column;
    font-size: 0.28rem;

    .desc-wp {
        width: 3.46rem;
        .title {
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
            font-size: 0.3rem;
            line-height: 0.54rem;
            color: #fff;
        }
        .content {
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
            color: #e6ab86;
            font-size: 0.26rem;
            line-height: 0.42rem;
        }
    }
}
</style>
