import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// 官方文档学习地址： https://router.vuejs.org/zh/
export default new Router({
    routes: [
        //  一个界面一个{}配置
        {
            path: '/main',
            component: () => import(/* webpackChunkName: "layout" */ './views/Main.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/login/Index.vue'),
            meta: {keepAlive: false},
        },
        {
            path: '',
            redirect: '/login'
        }
    ]
})
