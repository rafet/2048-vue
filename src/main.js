import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";
Vue.use(Antd);

import VueLocalStorage from "vue-localstorage";

Vue.use(VueLocalStorage);
// Or you can specify any other name and use it via this.$ls, this.$whatEverYouWant
Vue.use(VueLocalStorage, {
  name: "ls",
  bind: true //created computed members from your variable declarations
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
