<template>
    <div class="user-info-wp">
        <ul>
            <li>
                <span class="label">头像</span>
                <bg
                    :icon="wxUserInfo.icon"
                    size="0.96"
                    class="avatar"
                    :sex="wxUserInfo.sex"
                >
                </bg>
                <!-- <border-img
                    :icon="wxUserInfo.icon"
                    size="0.96"
                    class="avatar"
                ></border-img> -->
                <!-- <img :src="wxUserInfo.icon" alt="" class="avatar" /> -->
                <van-uploader
                    v-model="fileList"
                    accept="image/*"
                    preview-size="375"
                    multiple
                    :before-read="beforeRead"
                    :after-read="afterRead"
                    :max-count="maxCount"
                    :max-size="maxSize"
                    :deletable="false"
                    :preview-full-image="false"
                    class="uploader-wp"
                />
                <img :src="moreIcon" alt="" class="more" />
            </li>
            <li @click="editUserInfo('name')">
                <span class="label">昵称</span>
                <span class="desc">{{ wxUserInfo.name }}</span>
                <img :src="moreIcon" alt="" class="more" />
            </li>
            <li @click="editUserInfo('phone')">
                <span class="label">手机号</span>
                <span class="desc">{{ wxUserInfo.phone }}</span>
                <img :src="moreIcon" alt="" class="more" />
            </li>
            <li @click="editUserInfo('sex')">
                <span class="label">性别</span>
                <span class="desc">{{
                    wxUserInfo.sex == 0 ? "男" : "女"
                }}</span>
                <img :src="moreIcon" alt="" class="more" />
            </li>
        </ul>
        <van-popup v-model="show" position="bottom">
            <van-picker
                show-toolbar
                title="性别"
                :columns="columns"
                @cancel="show = false"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>
<script>
import Bg from "../components/base/bg.vue";
export default {
    data() {
        return {
            moreIcon: require("@images/more.png"),
            maxCount: "1",
            maxSize: 1024 * 1024 * 10,
            fileList: [],
            show: false,
            columns: ["男", "女"]
        };
    },
    created() {
        this.wxUserInfo =
            localStorage.getItem("wxUserInfo") &&
            JSON.parse(localStorage.getItem("wxUserInfo"));
    },
    methods: {
        // 跳转到其他页面
        editUserInfo(arg) {
            arg === "sex"
                ? (this.show = true)
                : this.$router.push({
                      path: `/editUserInfo`,
                      query: { type: arg }
                  });
        },
        // 文件上传前格式处理
        beforeRead(file) {
            if (file.length) {
                this.$toast("头像只能上传一张图片");
                return false;
            } else {
                if (file.type.indexOf("image/") == -1) {
                    this.$toast("请上传标准图片格式");
                    return false;
                }
            }
            if (file.size > this.maxSize) {
                this.$toast(`上传图片大小不能超过${this.maxSize / 1024}M`);
                return false;
            }
            return true;
        },
        // 文件上传完成
        afterRead(file) {
            file.fileType = file.file.type.split("/")[1] || "";
            const reader = new FileReader();
            reader.readAsArrayBuffer(file.file);
            const that = this;
            // 读取完成时的回调
            reader.onload = function(e) {
                const params = {
                    url: `/uploadImage?session=${localStorage.getItem(
                        "session"
                    )}&fileType=${file.fileType}`,
                    data: new Blob([e.target.result]),
                    head: true
                };
                that.http(params).then(res => {
                    if (res.code == 0) {
                        that.wxUserInfo.icon = res.data.url;
                        localStorage.setItem(
                            "wxUserInfo",
                            JSON.stringify(that.wxUserInfo)
                        );
                        that.fileList = [];
                    } else {
                        that.$toast(res.msg);
                    }
                });
            };
        },
        onConfirm(val, index) {
            this.show = false;
            this.wxUserInfo.sex = index;
            const params = {
                url: "/player/updateInfo",
                data: this.wxUserInfo
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    localStorage.setItem(
                        "wxUserInfo",
                        JSON.stringify(this.wxUserInfo)
                    );
                } else {
                    this.$toast(res.msg);
                }
            });
        }
    },
    components: { Bg }
};
</script>

<style lang="scss" scoped>
.user-info-wp {
    height: 100%;
    background: #312d29;
    ul {
        li {
            display: flex;
            align-items: center;
            border-bottom: thin solid #44403c;
            padding: 0.35rem 0.32rem;
            position: relative;
            &:first-child {
            }
            .uploader-wp {
                position: absolute;
                z-index: 2;
                left: 0rem;
                right: 0rem;
                top: 0rem;
            }
            .label {
                flex: 1;
                font-size: 0.3rem;
                font-weight: 400;
                color: #999999;
                line-height: 0.38rem;
            }
            .avatar {
                display: inline-block;
                width: 0.96rem;
                height: 0.96rem;
                background-size: 0.96rem 0.96rem;
                margin-right: 0.2rem;
            }
            .desc {
                font-size: 0.3rem;
                font-weight: 400;
                color: #ffffff;
                line-height: 0.38rem;
                margin-right: 0.2rem;
            }
            .more {
                width: 0.24rem;
                height: 0.24rem;
                background-size: 0.24rem 0.24rem;
            }
        }
    }
    /deep/ {
        .van-uploader__upload {
            width: 100% !important;
            height: 1.68rem !important;
            margin: 0rem;
            opacity: 0;
        }
        .van-uploader__preview-image {
            width: 100% !important;
            height: 1.68rem !important;
            margin: 0rem;
            opacity: 0;
        }
    }
}
</style>
