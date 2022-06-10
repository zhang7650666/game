<template>
    <div class="page_loading" v-if="ishow">
        <div class="loading" v-if="ishow">
            <img src="@images/loading.gif" alt="" class="img" />
            <p class="loading_txt">正在加载</p>
        </div>
    </div>
</template>
<script>
/**
 * http 请求
 *
 * 层级1 1-100
 * 层级2 100 -1000
 * 层级3 1000 - 9999
 *
 *
 */
export default {
    data() {
        return {
            ishow: false
        };
    },
    methods: {
        show() {
            this.ishow = true;
        },
        hide() {
            this.ishow = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.page_loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 1001;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    background: rgba($color: #000, $alpha: 0.6);
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 3rem;
    box-sizing: border-box;
    border-radius: 10px;
    text-align: center;

    .img {
        width: 35%;
        height: 35%;
        margin-top: 20px;
    }

    .loading_txt {
        padding-top: 15px;
        color: #fff;
        font-size: 0.35rem;
    }
}
</style>
