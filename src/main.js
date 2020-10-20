import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue';
import { router } from './router';

import { store } from './store';
// import { router } from './_helpers';

Vue.use(Vuex)
Vue.use(VueAxios, axios);

// Vue.axios.defaults.baseURL = 'http://192.168.0.145:5005/api/';
Vue.axios.defaults.baseURL = 'http://localhost:5005/api/';
// Vue.axios.defaults.baseURL = 'http://52.38.203.160/api/';

Vue.use(require('vue-moment'));

Vue.config.productionTip = false

Vue.axios.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem("user"));
    // eslint-disable-next-line no-console
    console.log(user);
    if (user) {
      config.headers.common["Authorization"] = "Bearer " + user.token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
