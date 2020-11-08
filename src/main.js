import Vue from 'vue'
import App from "@/App.vue";
import router from "@/router";
import vuetify from '@/plugins/vuetify';
import { auth } from "@/components/firebase.js";
import store from "@/store";

Vue.use(router);

Vue.config.productionTip = false



auth.onAuthStateChanged(function(user) {
  if (user) {
    store.dispatch("setUsuario", user);
  }
});
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
