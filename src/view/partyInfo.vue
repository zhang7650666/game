<template>
    <div class="party-wp">
        <div class="desc-title">
            <div class="title-wp">
                <p class="title">发布您的聚会</p>
                <p class="desc">天策社团</p>
            </div>
            <img class="icon" :src="icon" alt="" />
        </div>
        <van-form @submit="onSubmit" class="vant-form">
            <van-cell-group inset>
                <van-field
                    v-model="query.title"
                    type="textarea"
                    rows="1"
                    autosize
                    name="title"
                    label="聚会主题"
                    placeholder="请输入聚会主题"
                    :rules="[{ required: true, message: '聚会主题不能为空' }]"
                    maxlength="150"
                    autocomplete="off"
                    show-word-limit
                />
                <van-field
                    v-model="query.content"
                    type="textarea"
                    name="content"
                    label="聚会内容"
                    placeholder="请输入聚会内容"
                    :rules="[{ required: true, message: '请输入聚会内容' }]"
                    autosize
                    rows="2"
                    autocomplete="off"
                />
                <van-field
                    v-model="query.start_time"
                    is-link
                    readonly
                    name="start_time"
                    label="聚会时间"
                    @click="
                        startShow = true;
                        isStart = 'start_time';
                    "
                    class="van-cell-link"
                    placeholder="请选择聚会时间"
                    :rules="[{ required: true, message: '聚会时间不能为空' }]"
                    autocomplete="off"
                />
                <van-field
                    v-model="query.location"
                    name="location"
                    label="地点"
                    placeholder="请输入聚会地点"
                    :rules="[{ required: true, message: '聚会地点不能为空' }]"
                    clearable
                    autocomplete="off"
                />

                <van-field
                    v-model="query.money"
                    type="number"
                    name="money"
                    label="每人预算(元)"
                    placeholder="请输入每人预算"
                    :rules="[
                        { required: true, message: '聚会每人预算不能为空' }
                    ]"
                    clearable
                    autocomplete="off"
                />
                <van-field
                    v-model="query.desc"
                    type="textarea"
                    name="desc"
                    label="活动安排"
                    placeholder="请输入活动安排"
                    :rules="[
                        { required: true, message: '聚会活动安排不能为空' }
                    ]"
                    maxlength="150"
                    autosize
                    rows="1"
                    show-word-limit
                    autocomplete="off"
                />
                <van-field
                    v-model="query.appy_end_time"
                    is-link
                    readonly
                    name="appy_end_time"
                    label="报名截止时间"
                    @click="
                        startShow = true;
                        isStart = 'appy_end_time';
                    "
                    class="van-cell-link"
                    placeholder="请选择报名截止时间"
                    :rules="[
                        { required: true, message: '报名截止时间不能为空' }
                    ]"
                    autocomplete="off"
                />
            </van-cell-group>
            <div class="btn-wp">
                <button native-type="submit" class="btn-style">
                    <img :src="partyIcon" alt="" />
                </button>
            </div>
        </van-form>

        <van-popup
            v-model:show="startShow"
            position="bottom"
            :style="{ width: '100%' }"
        >
            <van-datetime-picker
                type="datetime"
                title="选择完整时间"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="startShow = false"
                @confirm="confirmPicker"
            />
        </van-popup>
    </div>
</template>
<script>
import { formatDate, addYear, formatTime } from "@/utils/util";
export default {
    data() {
        return {
            query: {
                title: "",
                content: "",
                start_time: "",
                appy_end_time: "",
                location: "",
                money: "",
                desc: ""
            },
            minDate: new Date(),
            maxDate: addYear(new Date(), 5),
            startShow: false,
            isStart: "start",
            icon: require("@images/cheer.png"),
            partyIcon: require("@images/party.png")
        };
    },
    methods: {
        // 发起聚会
        onSubmit() {
            const params = {
                url: "/party/post",
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

        confirmPicker(date) {
            this.startShow = false;
            this.query[this.isStart] = formatTime(new Date(date));
            if (this.isStart === "start_time" && this.query.start_time) {
                this.maxDate = new Date(date);
            } else if (this.isStart === "appy_end_time") {
                if (!this.query.start_time) {
                    this.$toast("必须先确定聚会活动时间，才能选择报名截止时间");
                    this.query.appy_end_time = "";
                } else {
                    this.minDate = new Date();
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.party-wp {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 0.28rem;
    background: #312d29;
    padding-top: 0.2rem;
    .desc-title {
        display: flex;
        padding: 0.34rem 0.32rem 0;
        .title-wp {
            flex: 1;
            align-items: center;
            .title {
                font-size: 0.48rem;
                font-weight: 500;
                color: #ffffff;
                line-height: 0.66rem;
                padding-bottom: 0.14rem;
            }
            .desc {
                font-size: 0.3rem;
                font-weight: 400;
                color: #a59c91;
                line-height: 0.42rem;
            }
        }
        .icon {
            width: 0.8rem;
            height: 0.8rem;
            background-size: 0.8rem 0.8rem;
            display: inline-block;
        }
    }
    .btn-wp {
        padding: 0.62rem;
        img {
            width: 6.34rem;
            height: 0.96rem;
            background-size: 6.34rem 0.96rem;
        }
    }
    /deep/ {
        .van-cell-group {
            background: #312d29 !important;

            // &::after {
            //     position: relative;
            //     content: "";
            //     left: 0px;
            //     right: 0px;
            //     border-bottom: 2px solid #3b3733;
            // }
        }
        [class*="van-hairline"]:after {
            border-bottom: 2px solid #3b3733;
            border-top: none;
        }
        .van-cell {
            background: #312d29 !important;
            padding: 1.3rem 0rem 0.22rem 0rem;
            position: inherit;
            &::after {
                left: 0px;
                right: 0px;
                border-bottom: 2px solid #3b3733;
            }
            .van-cell__title {
                position: absolute;
                top: 0.64rem;
                font-size: 0.36rem;
                font-weight: 500;
                color: #f6b68e;
                line-height: 0.5rem;
            }

            .van-field__control {
                font-size: 0.3rem;
                font-weight: 500;
                color: #999999;
                line-height: 0.42rem;
            }
            .van-field__word-limit {
                color: #fff;
            }
        }
        .van-button--primary {
            background-color: transparent;
            border: 1px solid transparent;
        }
    }
}
</style>
