<template>
    <div class="v-info">
        <bg
            :icon="infoItem.icon"
            :size="0.96"
            :sex="infoItem.sex"
            :manager="infoItem.is_manager"
            mSize="msize2"
            v-if="source == 'mailList'"
        ></bg>
        <bg
            :icon="infoItem.from ? infoItem.from.icon : logoIcon"
            :size="0.92"
            :sex="infoItem.from ? infoItem.from.sex : ''"
            class="mg"
            mSize="msize2"
            :manager="infoItem.from ? infoItem.from.is_manager : false"
            v-if="source == 'infoCenter'"
        ></bg>
        <!-- <border-img
            :icon="infoItem.from ? infoItem.from.icon : logoIcon"
            size="0.92"
            class="mg"
            v-if="source == 'infoCenter'"
        ></border-img> -->
        <div class="slot-wp">
            <slot></slot>
        </div>

        <span class="desc">{{
            source == "mailList"
                ? infoItem.phone
                : this.$passDate(new Date(infoItem.create_at).getTime())
        }}</span>
    </div>
</template>
<script>
export default {
    props: {
        infoItem: {
            type: Object
        },
        source: {
            type: String,
            default: "infoCenter"
        }
    },
    data() {
        return {
            logoIcon: require("@images/logo.png")
        };
    },
    created() {
        if (this.infoItem.from) {
            console.log("存在");
        } else {
            console.log("不存在");
        }
        console.log(66666, this.infoItem);
    }
};
</script>

<style lang="scss" scoped>
.v-info {
    height: 100%;
    display: flex;
    font-size: 0.28rem;
    align-items: center;
    padding: 0.44rem 0.28rem;
    border-bottom: thin solid #44403c;
    .mg {
        margin-right: 0.32rem;
    }
    .slot-wp {
        flex: 1;
    }
    .desc {
        display: inline-block;
        padding-left: 0.2rem;
        // width: 1rem;
        font-weight: 400;
        text-align: right;
        color: #fff;
        font-size: 0.24rem;
    }
}
</style>
