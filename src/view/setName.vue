<template>
    <div class="set-wp">
        <img :src="ziliaoIcon" alt="" class="material" />
        <div class="set-user-info">
            <div class="icon-wp">
                <van-uploader
                    v-model="fileList"
                    accept="image/*"
                    preview-size="120"
                    multiple
                    :before-read="beforeRead"
                    :after-read="afterRead"
                    :before-delete="beforeDelete"
                    :max-count="maxCount"
                    :max-size="maxSize"
                    :deletable="false"
                    :preview-full-image="false"
                />
            </div>
            <div class="set-avatar-img" :class="{ border: updateFish == true }">
                <img :src="setAvatar" alt="" class="set-avatar" />
            </div>
            <div class="shap-wp">
                <van-form @submit="onSubmit" class="vant-form">
                    <van-cell-group inset>
                        <van-field
                            v-model="query.name"
                            name="name"
                            placeholder="设置一个响亮的江湖昵称"
                            :rules="[
                                {
                                    required: true,
                                    message: '请设置一个响亮的江湖昵称'
                                }
                            ]"
                            error-message-align="center"
                            input-align="center"
                            autocomplete="off"
                        />
                        <van-field
                            v-model="query.phone"
                            type="tel"
                            name="phnoe"
                            placeholder="请输入您的手机号码"
                            :rules="[
                                { required: true, message: '请填写手机号码' },
                                { pattern, message: '手机号格式错误' }
                            ]"
                            error-message-align="center"
                            input-align="center"
                            autocomplete="off"
                        />
                        <van-field
                            v-model="query.sex"
                            name="sex"
                            placeholder="请选择您的性别"
                            :rules="[
                                {
                                    required: true,
                                    message: '性别不能为空'
                                }
                            ]"
                            error-message-align="center"
                            input-align="center"
                            autocomplete="off"
                            readonly
                            @click="popShow = true"
                        />
                        <span></span>
                    </van-cell-group>
                    <div class="btn-wp" native-type="submit">
                        <button native-type="submit" class="btn-style">
                            <img :src="btnSureIcon" alt="" />
                        </button>
                    </div>
                </van-form>
            </div>
        </div>
        <van-popup v-model="popShow" position="bottom">
            <van-picker
                show-toolbar
                title="性别"
                :columns="columns"
                @cancel="popShow = false"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>
<script>
import { Dialog } from "vant";
export default {
    data() {
        return {
            maxCount: "1", // 图片最多上传数量
            maxSize: 1024 * 1024 * 2, // 文件大小不能超过10M
            query: {
                name: "",
                phone: "",
                icon: "",
                sex: ""
            },
            pattern: /^(1[3-9][0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            ziliaoIcon: require("@images/ziliao.png"),
            setAvatar: require("@images/set-avatar.png"),
            btnSureIcon: require("@images/btn-sure.png"),
            fileList: [],
            popShow: false,
            columns: ["男", "女"], // 男：0，女：1
            updateFish: false // 上传完成
        };
    },

    methods: {
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
                this.$toast(`上传图片大小不能超过${this.maxSize / 10}M`);
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
                        that.setAvatar = res.data.url;
                        that.query.icon = res.data.url;
                        that.fileList = [];
                        that.updateFish = true;
                    } else {
                        that.$toast(res.msg);
                    }
                });
            };
        },
        // 删除文件
        beforeDelete(file) {
            return true;
        },
        // 提交信息
        onSubmit() {
            if (!this.query.icon) {
                this.$toast("头像不能为空");
                return;
            }
            Dialog.confirm({
                message: "您确定要设置用户信息吗?",
                confirmButtonColor: "#FAE4A2",
                cancelButtonColor: "#999"
            })
                .then(() => {
                    const query = JSON.parse(JSON.stringify(this.query));
                    query.sex = query.sex == "男" ? 0 : 1;
                    const params = {
                        url: "/player/updateInfo",
                        data: query
                    };
                    this.http(params).then(res => {
                        if (res.code == 0) {
                            localStorage.setItem(
                                "wxUserInfo",
                                JSON.stringify(query)
                            );
                            this.$router.push({ path: "/index" });
                        } else {
                            this.$toast(res.msg);
                        }
                    });
                })
                .catch(() => {
                    // on cancel
                });
        },
        // pop中确认弹框
        onConfirm(val) {
            this.popShow = false;
            this.query.sex = val;
        }
    }
};
</script>

<style lang="scss" scoped>
.set-wp {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 0.28rem;
    background: url("~@images/set-bg.png") no-repeat;
    background-size: 100% 100%;
    padding-top: 0.46rem;
    .material {
        width: 5.56rem;
        height: 1.42rem;
        background-size: 5.56rem 1.42rem;
        margin: 0 auto;
    }
    .set-user-info {
        position: relative;
        padding-top: 0.24rem;
        .icon-wp {
            position: absolute;
            // top: 0.5rem;
            z-index: 5;
            left: 2.65rem;
        }
        .set-avatar-img {
            position: absolute;
            left: 50%;
            width: 2.12rem;
            height: 2.12rem;

            left: 50%;
            margin-left: -1.06rem;
            z-index: 4;
            &.border {
                border-radius: 100% 100%;
                border: 1px solid #fff;
                overflow: hidden;
            }
            .set-avatar {
                position: absolute;
                z-index: 3;
                width: 2.12rem;
                height: 2.12rem;
                background-size: 2.12rem 2.12rem;
                left: 50%;
                margin-left: -1.06rem;
                border-radius: 100% 100%;
                // margin-top: 0.1rem;
                // z-index: 2;
            }
            .set-img {
                position: absolute;
                width: 2.62rem;
                height: 0.58rem;
                background-size: 2.62rem 0.58rem;
                left: 50%;
                margin-left: -1.32rem;
                margin-top: 1.7rem;
                z-index: 10;
                // z-index: 5;
            }
        }

        .shap-wp {
            position: absolute;
            z-index: 2;
            width: 6.62rem;
            height: 8.04rem;
            background: url("~@images/shap3.png");
            background-size: 6.62rem 8.04rem;
            margin: 1.18rem 0.44rem 0;
        }
    }
    .vant-form {
        padding-top: 1.2rem;
    }

    .btn-wp {
        padding-top: 0.8rem;
        text-align: center;
        .btn-style {
            background: transparent;
            outline: none;
            border: none;
        }
        img {
            width: 4.82rem;
            height: 1rem;
            background-size: 4.82rem 1rem;
        }
    }

    /deep/ {
        .van-cell {
            background: transparent;
            padding: 0.28rem 0.32rem;
        }
        .van-cell-group {
            background: transparent;
        }
        .van-field__control {
            color: #fff;
            font-size: 0.32rem;
        }
        .van-cell::after {
            border-color: #ccbfae;
            left: 0rem;
            right: 0rem;
            border-bottom: 1px solid #ccbfae;
        }
        .van-hairline--top-bottom::after {
            border: none;
        }

        .van-uploader__upload {
            width: 2.12rem !important;
            height: 2.12rem !important;
            margin: 0rem;
            opacity: 0;
            border-radius: 1.06rem 1.06rem;
        }
        .van-uploader__preview-image {
            width: 2.12rem !important;
            height: 2.12rem !important;
            margin: 0rem;
            opacity: 1;
            border-radius: 100%;
        }
        .van-dialog {
            background: #312d29;
            .van-button--default {
                background: #312d29;
            }
            .van-dialog__content {
                background: #312d29;
            }
        }
    }
}
</style>
<style lang="scss">
.set-wp {
    // .van-cell {
    //     background: transparent;
    //     padding: 0.28rem 0.32rem;
    // }
    // .van-cell-group {
    //     background: transparent;
    // }
    // .van-field__control {
    //     color: #fff;
    //     font-size: 0.32rem;
    // }
    // .van-cell::after {
    //     border-color: #ccbfae;
    //     left: 0rem;
    //     right: 0rem;
    //     border-bottom: 1px solid #ccbfae;
    // }
    // .van-hairline--top-bottom::after {
    //     border: none;
    // }

    // .van-uploader__upload {
    //     width: 2.12rem !important;
    //     height: 2.12rem !important;
    //     margin: 0rem;
    //     opacity: 0;
    //     border-radius: 1.06rem 1.06rem;
    // }
    // .van-uploader__preview-image {
    //     width: 2.12rem !important;
    //     height: 2.12rem !important;
    //     margin: 0rem;
    //     opacity: 1;
    //     border-radius: 100%;
    // }
}
.van-dialog {
    background: #312d29;
    .van-button--default {
        background: #312d29;
    }
    .van-dialog__content {
        background: #312d29;
    }
}
</style>
