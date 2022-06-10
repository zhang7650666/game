<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <loading v-show="LOADING"></loading>
    </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

import Loading from "@/components/base/loading.vue";
export default {
    name: "App",
    data() {
        return {};
    },
    components: {
        Loading
    },
    computed: {
        ...mapState(["LOADING"])
    },
    created() {
        console.log("htmlConfig", htmlConfig);
    }
};
</script>
<style lang="scss" scoped>
#app {
    height: 100%;
}
</style>
