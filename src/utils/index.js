import * as proto from "./proto";
import * as validator from "./validator";
const objPro = { ...proto, ...validator };

export default {
    install(Vue) {
        Object.keys(objPro).forEach(item => {
            Vue.prototype[`$${item}`] = objPro[item];
        });
    }
};
