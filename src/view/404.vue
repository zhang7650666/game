<template>
    <div class="h5-page-404">
        <img src="~@images/404.png" class="tip-img" />
        <p>抱歉您来到了网站的荒漠</p>
        <div class="go-home" @click="$router.push({ name: 'index' })">
            返回首页
        </div>
    </div>
</template>

<style lang="scss" scoped>
.h5-page-404 {
    padding: 0.4rem 0 0 0;
    .tip-img {
        width: 2.6rem;
        height: 2.6rem;
        display: block;
        margin: 0 auto 0 auto;
    }
    p {
        color: #666;
        line-height: 4;
        font-size: 0.32rem;
        text-align: center;
    }
    .go-home {
        display: block;
        width: 3.6rem;
        height: 0.72rem;
        line-height: 0.72rem;
        margin: 0.2rem auto 0 auto;
        text-decoration: none;
        font-size: 0.32rem;
        -webkit-border-radius: 0.7rem;
        -moz-border-radius: 0.7rem;
        border-radius: 0.7rem;
        background: #0285f0;
        border: thin solid #006cc5;
        color: #fff;
        text-align: center;
    }
}
</style>
