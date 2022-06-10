import "@/st/css/app.scss";
import App from "@/App";
import store from "@/store/store";
import router from "@/router";
import Utils from "@/utils";
import Axios from "@/utils/http";
import Vue from "vue";
import baseCom from "@/components/base/index.js"; // 全局组件导入
import Loading from "@/mixins/loading";

import {
    Button,
    Cell,
    CellGroup,
    Form,
    Field,
    Checkbox,
    Area,
    Popup,
    List,
    Uploader,
    DatetimePicker,
    Picker,
    DropdownMenu,
    DropdownItem,
    RadioGroup,
    Radio,
    Toast,
    Col,
    Row,
    ActionSheet,
    Icon,
    Search,
    Calendar,
    PullRefresh,
    Swipe,
    SwipeItem,
    Popover
} from "vant";
// 全局组件统一注册
Object.keys(baseCom).forEach(item => {
    Vue.component(item, baseCom[item]);
});

Vue.use(Utils);
Vue.use(Axios);

// mixins
Vue.use(Loading);

// vant
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Form);
Vue.use(Field);
Vue.use(Checkbox);
Vue.use(Area);
Vue.use(Popup);
Vue.use(List);
Vue.use(Uploader);
Vue.use(DatetimePicker);
Vue.use(Picker);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Toast);
Vue.use(Col);
Vue.use(Row);
Vue.use(ActionSheet);
Vue.use(Icon);
Vue.use(Search);
Vue.use(Calendar);
Vue.use(PullRefresh);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Popover);

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});
