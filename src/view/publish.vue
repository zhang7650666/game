<template>
    <div class="upload-wp">
        <van-field
            v-model="query.content"
            type="textarea"
            autosize
            rows="4"
            show-word-limit
            maxlength="500"
            placeholder="请输入你要发布的文字"
            autocomplete="off"
        />
        <van-field name="uploader">
            <!-- <template #input>
                <van-uploader
                    v-model="files"
                    accept="image/*"
                    preview-size="109"
                    multiple
                    :before-read="beforeRead"
                    :after-read="afterRead"
                    :before-delete="beforeDelete"
                    :max-count="maxCount"
                    :max-size="maxSize"
                    :upload-icon="addIcon"
                />
            </template> -->

            <template #input>
                <van-uploader
                    v-model="files"
                    preview-size="109"
                    multiple
                    :before-read="beforeRead"
                    :after-read="afterRead"
                    :before-delete="beforeDelete"
                    :max-count="maxCount"
                    :max-size="maxSize"
                    accept="*"
                    :upload-icon="addIcon"
                />
            </template>
        </van-field>
        <div class="btn-wp" @click="submitFn">
            <img :src="publishIcon" alt="" />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            maxCount: 25, // 图片最多上传数量
            maxSize: 1024 * 1024 * 10, // 文件大小不能超过10M
            files: [],
            query: {
                content: "",
                pics: [],
                videos: []
            },
            addIcon: require("@images/add-icon.png"),
            publishIcon: require("@images/publish.png"),
            isImgType: "image" // 图片 是image  视频 是video
        };
    },

    methods: {
        // 发布
        submitFn() {
            const { pics, videos, content } = this.query;
            if (!content) {
                this.$toast("要发布的内容不能为空");
                return;
            } else if (!pics.length && !videos.length) {
                this.$toast("图片/视频不能为空");
                return;
            }

            const params = {
                url: "/article/post",
                data: this.query
            };
            this.http(params).then(res => {
                if (res.code == 0) {
                    this.$router.push({ path: "/index" });
                } else {
                    this.$toast(res.msg);
                }
            });
        },

        // 文件上传前格式处理
        beforeRead(file) {
            let res = true;
            if (Array.isArray(file)) {
                for (let i = 0; i < file.length; i++) {
                    if (file[i].type.indexOf("image/") != -1) {
                        return this.checkFileTypeAndFileSize(file[i]);
                    } else {
                        res = false;
                        this.$toast("多选时只能全选图片类型的文件才能上传");
                        break;
                    }
                }
                return res;
            } else {
                return this.checkFileTypeAndFileSize(file);
            }
        },

        // 检查文件类型和大小
        checkFileTypeAndFileSize(file) {
            const imgSize = 1024 * 1024 * 10;
            const videoSize = 1024 * 1024 * 200;
            if (
                file.type.indexOf("image/") != -1 ||
                file.type.indexOf("video/") != -1
            ) {
                if (file.type.indexOf("image/") != -1) {
                    if (file.size > imgSize) {
                        this.$toast(`上传图片大小不能超过${imgSize / 1024}M`);
                        return false;
                    } else {
                        this.maxSize = imgSize;
                    }
                } else if (file.type.indexOf("video/") != -1) {
                    const whiteList = ["video/mp4", "video/mov"];

                    if (whiteList.indexOf(file.type) == -1) {
                        this.$toast(`上传视频格式必须为mp4/mov格式`);
                        return false;
                    } else if (file.size > videoSize) {
                        this.$toast(`上传视频大小不能超过${videoSize / 1024}M`);
                        return false;
                    } else {
                        this.maxSize = videoSize;
                        this.maxCount = 1;
                    }
                }
            }
            return true;
        },
        // 文件上传完成
        afterRead(file) {
            // 此时可以自行将文件上传至服务器
            // 如果选择多张图片的时候，返回的file是list
            // console.log("file", file);
            if (Array.isArray(file)) {
                file.map(item => {
                    item.fileType = item.file.type.split("/")[1] || "";
                    this.uploadImageFn(item);
                });
            } else {
                file.fileType = file.file.type.split("/")[1] || "";
                this.uploadImageFn(file);
            }
        },
        uploadImageFn(file) {
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
                        const { pics, videos } = that.query;
                        if (file.file.type.indexOf("image/") != -1) {
                            pics.push(res.data.url);
                        } else if (file.file.type.indexOf("video/") != -1) {
                            videos.push(res.data.url);
                            pics.push(res.data.videoImage);
                            that.$set(that.files, 0, {
                                url: res.data.videoImage
                            });
                            // this.files = [{ url: res.data.videoImage }];
                        }
                    } else {
                        that.$toast(res.msg);
                    }
                });
            };
        },
        // 删除文件
        beforeDelete(file) {
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
.upload-wp {
    height: 100%;
    background: #312d29;
    display: flex;
    flex-direction: column;
    font-size: 0.28rem;
    .btn-wp {
        padding-top: 0.5rem;
        text-align: center;
        img {
            width: 6.34rem;
            height: 0.96rem;
            background-size: 6.34rem 0.96rem;
        }
    }
    /deep/ {
        .van-cell {
            background: #312d29 !important;
            padding: 0.2rem 0.32rem;
            &::after {
                left: 0px;
                right: 0px;
                border-bottom: thin solid #46423e;
            }

            .van-field__control {
                font-weight: 400;
                line-height: 0.42rem;
                color: #fff;
                font-size: 0.3rem;
            }
            .van-field__word-limit {
                color: #fff;
            }
            .van-uploader__wrapper {
                > div:nth-child(3n + 0) {
                    margin-right: 0px;
                }
                .van-uploader__upload,
                .van-uploader__preview {
                    border-radius: 0.2rem;
                    overflow: hidden;
                    background: #46423e;
                }
            }
        }
    }
}
</style>
