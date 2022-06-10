<template>
    <div
        class="bg-wp"
        :style="{
            width: `${size + 0.02}rem`,
            height: `${size + 0.02}rem`
        }"
    >
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
        }
    },
    data() {
        return {};
    },
    created() {}
};
</script>

<style lang="scss" scoped>
.bg-wp {
    position: relative;
    border: 0.02rem solid #fff;
    border-radius: 100% 100%;

    img {
        display: block;
    }
    .icon-bg {
        position: absolute;
        left: 0rem;
        top: 0rem;
        z-index: 2;
    }
}
</style>
