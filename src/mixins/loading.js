import loading from '@/components/mixins/loading';

const pop = loading;
let $vm;
export default {
  install(Vue) {
    if (!$vm) {
      const LoadingInstance = Vue.extend(pop);
      $vm = new LoadingInstance({
        el: document.createElement('div'),
      });

      document.body.appendChild($vm.$el);
    }

    const tips = {
      show() {
        $vm.show();
      },
      hide() {
        $vm.hide();
      },
    };
    const itemVue = Vue;
    if (!Vue.$loading) {
      itemVue.$loading = tips;
    }

    Vue.mixin({
      created() {
        this.$loading = itemVue.$loading;
      },
    });
  },
};
