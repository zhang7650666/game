<template>
    <div
        class="my-paty-section"
        :class="{ 'no-data-bg': dataList.length == 0 }"
    >
        <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
            v-if="dataList.length"
            @load="getInfo"
        >
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="getInfo"
            >
                <div v-if="dataList.length">
                    <div v-for="(item, index) in dataList" :key="index">
                        <part-info :partyInfo="item" source="party"></part-info>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <div class="no-data" v-else>
            <img :src="icon404" alt="" />
            <p>暂无聚会信息</p>
            <div class="btn-wp" @click="jump">
                <p class="save">去发布聚会</p>
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
            pageSize: 5, // 每页多少条
            from: 0,
            to: 6,
            dataList: [],
            icon404: require("@images/404.png")
        };
    },
    created() {
        this.wxUserInfo =
            localStorage.getItem("wxUserInfo") &&
            JSON.parse(localStorage.getItem("wxUserInfo"));
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
                url: "/my/parties",
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
        // 去发布聚会
        jump() {
            this.$router.push({ path: "/partyInfo" });
        }
    }
};
</script>

<style lang="scss" scoped>
.my-paty-section {
    background-color: #312d29;
    min-height: 100%;
    min-height: 100vh;
    &.no-data-bg {
        background: #312d29;
    }
    .my-paty-card {
        .paty-title-box {
            .paty-title-box {
            }
            .paty-info {
                .title {
                    height: 25px;
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #f6b68e;
                    line-height: 25px;
                }
                .desc {
                    height: 42px;
                    font-size: 15px;
                    font-weight: 500;
                    color: #ffffff;
                    line-height: 21px;
                }
            }
            .paty-status {
            }
        }
    }
    .no-data {
        text-align: center;
        padding-top: 2.5rem;
        p {
            font-size: 0.32rem;
            font-weight: 400;
            color: #fff;
            line-height: 0.44rem;
            text-align: center;
        }
        .btn-wp {
            width: 6.34rem;
            height: 0.96rem;
            margin: 1rem auto 0;
            background: url("~@images/btn-bg.png") no-repeat;
            background-size: 6.34rem 0.96rem;
            .save {
                text-align: center;
                line-height: 0.96rem;
                font-size: 0.42rem;
                color: #fae4a2;
                letter-spacing: 0.05rem;
            }
        }
    }
}
</style>
