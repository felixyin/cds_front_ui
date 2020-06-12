/**
 * 爬虫模块
 */
import {httpPromise} from "../../util/http";
import api from "../../api";
import {updateModel} from '../../util/vuexbound';

const state = {
    setForm: {
        siteQueue: 0,
        siteSleep: 50,
        diggingDepth: 2,
        threadCount: 20,
        threadSleep: 200,
        fetchTimeout: 1000,
        isNeedDistinct: 0,
        isVerifyEmail: 0,
    },
};

const mutations = {
    ...updateModel()
};

const getters = {};

const actions = {
    /**
     * 获取爬虫参数设置
     * @param commit
     */
    loadSearchSettingAction({commit}) {
        return httpPromise(api.loadSearchSetting, null).then(function (body) {
            commit('updateModel', {
                label: 'setForm',
                value: body.cdsCrawlSetting
            });
            return body;
        });
    },
    /**
     * 保存爬虫参数设置
     * @param commit
     * @returns {Promise<any>}
     */
    saveSearchSettingAction({commit}) {
        return httpPromise(api.saveSearchSetting, state.setForm);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}
