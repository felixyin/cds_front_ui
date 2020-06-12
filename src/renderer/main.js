import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'
import api from './api'
import {http, httpPromise} from './util/http';
// 解决回调太深报错问题
// import process from 'process';
// process.setMaxListeners(0);

Vue.use('Message');
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.http = Vue.prototype.$http = http;
Vue.httpp = Vue.prototype.$httpp = httpPromise;

// ajax请求
Vue.api = Vue.prototype.$api = api;

Vue.config.productionTip = false;

Vue.use(ElementUI);

// 用于判断是否是开发模式
global.__isdev = process.env.NODE_ENV === 'development';

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');
