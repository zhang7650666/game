import Vue from "vue";
import Vuex from "vuex";
import state from "@/store/base/state";
import getters from "@/store/base/getters";
import mutations from "@/store/base/mutations";
import actions from "@/store/base/actions";

const isDev = WP_ENV === "dev";
Vue.use(Vuex);
const createStore = () => {
    const store = new Vuex.Store({
        // 判断是否使用mutation函数更改状态，正式环境不需要，会影响性能
        strict: isDev,
        state,
        mutations,
        getters,
        actions,
        modules: {}
    });
    // vuex热加载
    if (module.hot) {
        module.hot.accept(
            [
                "./base/state",
                "./base/mutations",
                "./base/actions",
                "./base/getters"
            ],
            () => {
                /* eslint-disable */
                const newState = require("./base/state").default;
                const newMutations = require("./base/mutations").default;
                const newActions = require("./base/actions").default;
                const newGetters = require("./base/getters").default;
                /* eslint-enable */
                store.hotUpdate({
                    state: newState,
                    mutations: newMutations,
                    getters: newGetters,
                    actions: newActions
                });
            }
        );
    }
    return store;
};
export default createStore();
