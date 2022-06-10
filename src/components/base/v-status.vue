<template>
    <div class="v-status">
        <ul>
            <!-- 收藏 -->
            <li @click="clicCollection">
                <img
                    :src="
                        userInfoCache.isCollected > 0
                            ? activeCollectionIcon
                            : collectionIcon
                    "
                    alt=""
                />
                <span class="count">{{ userInfoCache.collectCount }}</span>
            </li>
            <!-- 评论 -->
            <li @click="clickTopic">
                <img :src="activeTopicIcon" alt="" />
                <span class="count">{{ userInfoCache.topicCount }}</span>
            </li>
            <!-- 点赞 -->
            <li @click="clickLove">
                <img
                    :src="userInfoCache.isLoved ? activeLoveIcon : loveIcon"
                    alt=""
                />
                <span class="count">{{ userInfoCache.loveCount }}</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        userInfo: {
            type: Object
        },
        source: {
            type: String // 分享： article   聚会： party   评论： topic
        }
    },
    data() {
        return {
            loveIcon: require("@images/love.png"), // 点赞
            activeLoveIcon: require("@images/love-active.png"),
            collectionIcon: require("@images/collection.png"), // 收藏
            activeCollectionIcon: require("@images/collection-active.png"),
            topicIcon: require("@images/topic.png"), // 评论
            activeTopicIcon: require("@images/topic-active.png"),
            userInfoCache: JSON.parse(JSON.stringify(this.userInfo))
        };
    },
    created() {},
    watch: {
        userInfo: {
            //深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                this.userInfo = val;
                this.userInfoCache.topicCount = val.topicCount;
            },
            deep: true //true 深度监听
        }
    },
    methods: {
        // 点赞
        // 上述问题已经解决。然后点赞接口加了一个必传字段cancel，值为true的时候就是取消点赞。false就是点赞
        clickLove() {
            const params = {
                url: `/love/${this.source}`,
                keepLoading: true,
                data: {
                    id: this.userInfoCache.id,
                    cancel: this.userInfoCache.isLoved
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.userInfoCache.loveCount = this.userInfoCache.isLoved
                        ? this.userInfoCache.loveCount - 1
                        : this.userInfoCache.loveCount + 1;
                    this.userInfoCache.isLoved = !this.userInfoCache.isLoved;
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 收藏
        clicCollection() {
            const params = {
                url: `/collect/${this.source}`,
                keepLoading: true,
                data: {
                    id: this.userInfoCache.id,
                    cancel: this.userInfoCache.isCollected
                }
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.userInfoCache.collectCount = this.userInfoCache
                        .isCollected
                        ? this.userInfoCache.collectCount - 1
                        : this.userInfoCache.collectCount + 1;
                    this.userInfoCache.isCollected = !this.userInfoCache
                        .isCollected;
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 获取评论
        clickTopic() {
            this.$emit("update:commit");
        }
    }
};
</script>

<style lang="scss" scoped>
.v-status {
    height: 100%;
    font-size: 0.28rem;
    height: 0.64rem;
    ul {
        display: flex;
        padding: 0.1rem 0rem;
        li {
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                display: inline-block;
                width: 0.4rem;
                height: 0.4rem;
                background-size: 0.4rem 0.4rem;
                margin-right: 0.08rem;
            }
            span {
                display: inline-block;
                font-size: 0.28rem;
                font-weight: 400;
                color: #999999;
                line-height: 0.4rem;
            }
        }
    }
}
</style>
