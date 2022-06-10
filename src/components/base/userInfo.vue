<template>
    <div class="v-userInfo">
        <div class="owner">
            <bg
                :icon="owner.icon"
                :sex="owner.sex"
                size="0.8"
                class="icon"
                :manager="owner.is_manager"
                mSize="msize"
            ></bg>
            <!-- <img :src="owner.icon" alt="" class="icon" />
            <img
                :src="owner.sex == 0 ? nanIcon : nvIcon"
                alt=""
                class="sex-icon"
            /> -->
            <span class="name">{{ owner.name }}</span>
            <div class="hot-create">
                <div class="hot-wp" v-if="userInfo.hot">
                    <img :src="hotIcon" alt="" class="hot-icon" />
                </div>
                <span class="create_at">{{
                    this.$passDate(new Date(userInfo.create_at).getTime())
                }}</span>
            </div>
        </div>
        <div class="content">{{ userInfo.content }}</div>
        <div
            class="pics"
            v-if="
                userInfo.pics.length &&
                    userInfo.videos &&
                    !userInfo.videos.length
            "
        >
            <van-uploader
                v-model="userInfo.pics"
                :preview-size="previewSize"
                :max-count="userInfo.pics.length"
                :deletable="false"
            />
        </div>
        <div class="video-wp" v-if="userInfo.videos && userInfo.videos.length">
            <video
                :src="userInfo.videos[0]"
                width="100%"
                preload="none"
                controls
                controlspreload="none"
                :poster="userInfo.pics[0].url"
            ></video>
        </div>
        <!-- <v-video
            v-if="userInfo.pics.length && userInfo.videos.length"
        ></v-video> -->

        <v-status
            :userInfo="userInfo"
            source="article"
            @update:commit="getCommentList"
        ></v-status>
        <van-popup
            v-model:show="popShow"
            closeable
            position="bottom"
            :style="{ maxHeight: '100%' }"
        >
            <v-comment
                source="article"
                :userInfo="userInfo"
                :idx="idx"
            ></v-comment>
        </van-popup>
    </div>
</template>
<script>
export default {
    props: {
        userInfo: {
            type: Object
        },
        idx: {
            type: Number
        }
    },
    data() {
        return {
            loveIcon: require("@images/love.png"),
            collectionIcon: require("@images/collection.png"),
            topicIcon: require("@images/topic.png"),
            nanIcon: require("@images/nan.png"),
            nvIcon: require("@images/nv.png"),
            hotIcon: require("@images/hot.png"),
            popShow: false, // 评论弹框显示
            owner: {},
            previewSize: 110
        };
    },
    created() {
        this.owner = this.userInfo.owner
            ? this.userInfo.owner
            : JSON.parse(localStorage.getItem("wxUserInfo"));
        this.previewSize = this.$isAndr ? 105 : 110;
    },
    watch: {
        userInfo: {
            //深度监听，可监听到对象、数组的变化
            handler(val, oldVal) {
                this.userInfo = val;
            },
            deep: true //true 深度监听
        }
    },
    methods: {
        // 获取评论信息
        getCommentList() {
            this.popShow = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.v-userInfo {
    height: 100%;
    font-size: 0.28rem;
    padding: 0.28rem;
    padding-top: 0.48rem;
    border-bottom: thin solid #44403c;
    .owner {
        display: flex;
        align-items: center;
        position: relative;
        .icon {
            width: 0.8rem;
            height: 0.8rem;
            background-size: 0.8rem 0.8rem;
            border-radius: 100% 100%;
            display: inline-block;
            margin-right: 0.3rem;
        }
        .sex-icon {
            position: absolute;
            z-index: 3;
            bottom: 0rem;
            left: 0.5rem;
            width: 0.38rem;
            height: 0.38rem;
            background-size: 0.38rem 0.38rem;
            border-radius: 100% 100%;
        }
        .name {
            flex: 0 0 3.52rem;
            font-size: 0.32rem;
            color: #fff;
            line-height: 0.8rem;
            font-weight: 400;
            white-space: nowrap; /* 规定文本是否折行 */
            overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
        }
        .hot-create {
            padding-left: 0.1rem;
            width: 2.4rem;
            text-align: right;
            .hot-wp {
                text-align: right;
                .hot-icon {
                    display: inline-block;
                    width: 0.56rem;
                    height: 0.3rem;
                    background-size: 0.56rem 0.3rem;
                }
            }

            .create_at {
                display: inline-block;
                color: #999;
                font-size: 0.28rem;
                font-weight: 400;
                color: #999999;
                line-height: 0.4rem;
            }
        }
    }
    .content {
        font-size: 0.34rem;
        line-height: 0.52rem;
        margin-top: 0.12rem;
        font-weight: 400;
        color: #f4f4f4;
    }
    .pics {
        display: flex;
        padding-top: 0.2rem;
        > div:nth-child(3n + 0) {
            margin-right: 0px;
        }
        .pics-list {
            margin: 0 0.2rem 0.2rem 0;
            img {
                display: inline-block;
                width: 2.2rem;
                height: 2.2rem;
                background-size: 2.2rem 2.2rem;
                border-radius: 0.2rem;
            }
        }
    }
    .status-info {
        display: flex;
        padding: 0.1rem 0rem;
        div {
            width: 2.2rem;
            margin-right: 0.2rem;
            text-align: center;

            img {
                display: inline-block;
                width: 0.34rem;
                height: 0.34rem;
                background-size: 0.34rem 0.34rem;
                margin-right: 0.14rem;
            }
            span {
                display: inline-block;
                font-size: 0.28rem;
                color: #a49b90;
                position: relative;
                top: -0.03rem;
            }
        }
    }
    /deep/ {
        // 上传文件相关样式表
        .van-uploader__wrapper {
            > div:nth-child(3n + 0) {
                margin-right: 0px;
            }
            .van-uploader__upload,
            .van-uploader__preview {
                border-radius: 0.2rem;
                margin: 0 0.16rem 0.16rem 0;
                overflow: hidden;
            }
        }
        // pop弹框相关样式表
        .van-popup--bottom {
            bottom: -0.01rem;
            height: 100%;
        }
    }
}
</style>
