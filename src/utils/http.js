import axios from "axios";
import { Toast } from "vant";
export default {
    install(Vue) {
        /**
         * 全局ajax请求
         * @param {Object} params 配置参数
         */
        Vue.prototype.http = function(params) {
            const store = this.$store;
            params.method = params.method ? params.method : "POST"; // 默认请求方式为 POST
            params.baseURL = params.baseURL || htmlConfig.baseUrl; // 使用自定义了接口地址，或者配置文件中的接口地址
            const wxUserInfo = localStorage.getItem("wxUserInfo")
                ? JSON.parse(localStorage.getItem("wxUserInfo"))
                : "";
            if (params.url.indexOf("login?") == -1 && !params.head) {
                params.data.session = localStorage.getItem("session");
            } else if (params.head) {
                // params.data.append(
                //     "session",
                //     wxUserInfo.session || "RKY8KD6TAMEP91XTUWHHUWOY2CZXPGRB"
                // );
            }
            if (!params.keepLoading) {
                store.commit("showLoading");
            }
            if (params.url.indexOf("/messages/new") != -1) {
                store.commit("hideLoading");
            }
            params.timeout = 30000;
            return new Promise((resolve, reject) => {
                axios(params, {
                    headers: {
                        "Content-Type": params.head
                            ? "multipart/form-data"
                            : "application/json"
                    }
                })
                    .then(res => {
                        if (!params.keepLoading) {
                            store.commit("hideLoading");
                        }
                        const data = res.data;
                        if (res.data.code == 1000) {
                            localStorage.setItem("wxUserInfo", "");
                            localStorage.setItem("session", "");
                            this.$router.push({ path: "/login" });
                            return;
                        } else if (res.data.code == 1001) {
                            localStorage.setItem("wxUserInfo", "");
                            localStorage.setItem("session", "");
                            Toast("用户禁止登陆");
                            return;
                        }
                        resolve(data);
                    })
                    .catch(error => {
                        if (!params.keepLoading) {
                            store.commit("hideLoading");
                        }
                        resolve({
                            resultCode: "FAIL",
                            errorCodeDes: "网络异常，请稍后重试"
                        });
                    });
            });
        };
    }
};
