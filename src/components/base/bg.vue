<template>
    <div class="bg-wp">
        <img
            :src="icon"
            alt=""
            :style="{
                width: `${size}rem`,
                height: `${size}rem`,
                backgroundSize: `${size}rem ${size}rem`,
                borderRadius: `${size}rem ${size}rem`
            }"
            class="icon"
        />
        <img
            :src="sex == 0 ? nanBg : nvBg"
            alt=""
            :style="{
                width: `${size}rem`,
                height: `${size}rem`,
                backgroundSize: `${size}rem ${size}rem`
            }"
            class="icon-bg"
        />
        <img
            v-if="manager && isManager"
            :src="managerIcon"
            alt=""
            class="manager"
            :class="mSize"
        />
    </div>
</template>
<script>
export default {
    props: {
        icon: {
            type: String
        },
        sex: {
            type: String | Number,
            default: 1
        },
        size: {
            type: String | Number,
            default: "1.68"
        },
        mSize: {
            type: String
        },
        manager: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            nvBg: require("@images/nv-bg.png"),
            nanBg: require("@images/nan-bg.png"),
            managerIcon: require("@images/manager.png"),
            isManager: true
        };
    },
    created() {
        if (this.$route.name == "userInfo") {
            this.isManager = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.bg-wp {
    position: relative;
    img {
        display: block;
    }
    .icon-bg {
        position: absolute;
        left: 0rem;
        top: 0rem;
        z-index: 2;
    }
    .manager {
        position: absolute;
        z-index: 3;
        &.msize {
            top: -0.35rem;
            left: -0.18rem;
            width: 0.62rem;
            height: 0.58rem;
        }
        &.msize1 {
            top: -0.6rem;
            left: -0.15rem;
            width: 0.93rem;
            height: 0.87rem;
        }
        &.msize2 {
            top: -0.3rem;
            left: -0.2rem;
            width: 0.62rem;
            height: 0.58rem;
        }
        &.msize3 {
            top: -0.4rem;
            left: -0.3rem;
            width: 0.744rem;
            height: 0.696rem;
        }
        &.msize4 {
            top: -0.2rem;
            left: -0.02rem;
            width: 0.31rem;
            height: 0.29rem;
        }
    }
}
</style>
