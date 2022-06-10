<template>
    <div class="edit-user-info">
        <van-form @submit="onSubmit" class="vant-form">
            <van-cell-group inset>
                <van-field
                    v-model="wxUserInfo.name"
                    name="name"
                    placeholder="请输入用户名称"
                    :rules="[{ required: true, message: '用户名称不能为空' }]"
                    v-if="type == 'name'"
                    autocomplete="off"
                />
                <van-field
                    v-model="wxUserInfo.phone"
                    type="tel"
                    name="phone"
                    placeholder="请输入手机号"
                    :rules="[
                        { required: true, message: '请输入手机号' },
                        { pattern, message: '手机号格式错误' }
                    ]"
                    v-if="type == 'phone'"
                    autocomplete="off"
                />
            </van-cell-group>
            <div class="btn-wp">
                <button native-type="submit" class="btn-style">
                    <p class="save">保存</p>
                </button>
            </div>
        </van-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pattern: /^(1[3-9][0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            type: ""
        };
    },
    created() {
        this.type = this.$route.query && this.$route.query.type;
        this.wxUserInfo =
            localStorage.getItem("wxUserInfo") &&
            JSON.parse(localStorage.getItem("wxUserInfo"));
    },
    methods: {
        // 发起聚会
        onSubmit() {
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
                    this.$router.replace({ path: "/userInfo" });
                } else {
                    this.$toast(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.edit-user-info {
    height: 100%;
    background: #312d29;
    .btn-wp {
        width: 6.34rem;
        height: 0.96rem;
        margin: 1rem auto 0;
        background: url("~@images/btn-bg.png") no-repeat;
        background-size: 6.34rem 0.96rem;
        font-size: 0;
        .save {
            width: 6.34rem;
            text-align: center;
            line-height: 0.96rem;
            font-size: 0.48rem;
            color: #fae4a2;
            // position: relative;
            // top: -0.25rem;
        }
    }
    /deep/ {
        .van-cell-group--inset {
            margin: 0rem;
        }
        .van-cell-group {
            background: #312d29 !important;
        }
        .van-field__error-message {
            padding-left: 0.32rem;
        }
        [class*="van-hairline"]:after {
            border-bottom: 2px solid #3b3733;
            border-top: none;
        }
        .van-cell {
            background: #312d29 !important;
            padding: 0.22rem 0rem 0.22rem 0rem;
            position: inherit;
            &::after {
                left: 0px;
                right: 0px;
                border-bottom: 2px solid #3b3733;
            }
            .van-cell__title {
                font-size: 0.32rem;
                color: #f6b68e;
                position: absolute;
                top: 0.7rem;
            }

            .van-field__control {
                color: #fff;
                font-size: 0.3rem;
                padding: 0 0.32rem;
            }
        }
        .van-button--primary {
            background: transparent;
            border: 1px solid transparent;
        }
    }
}
</style>
