/**
 * 爬虫模块
 */
import {http, httpPromise} from "../../util/http";
import {updateModel} from '../../util/vuexbound';
import api from "../../api";
import _ from 'lodash';

const state = {
    // 我的关键词 相关的收件邮箱 model
    myInboxEmail: {
        mySelectValues: [], // 多选框，用户选中的option对应对象的id数组
        cacheSelectValues: [], // 用于缓存选择的optinos，用来和当前选择的项做对比，以区分是调用后台的selecta ction还是unselect action
        myOptions: [], // 显示的所有的下拉框的option

        crawlHostAndEmailsMap: {}, // cache   key:selectKeywordId   value:email array
        myEmailsList: [],// 我的邮箱table展示用数据
        multipleSelection: [], // 复选框选中的的行

        isClearSelected: true
    },
    // 公司导入 相关的收件邮箱 model
    comInboxEmail: {
        comSelectValues: [], // 多选框，用户选中的option对应对象的id数组
        cacheSelectValues: [], // 用于缓存选择的optinos，用来和当前选择的项做对比，以区分是调用后台的selecta ction还是unselect action
        comOptions: [], // 显示的所有的下拉框的option

        crawlHostAndEmailsMap: {}, // cache   key:selectKeywordId   value:email array
        comEmailsList: [],// 我的邮箱table展示用数据
        multipleSelection: [], // 复选框选中的的行
    },
    // 发件邮箱 model
    sendEmailSetting: {
        host: '',
        port: '',
        server: 'smtp.ym.163.com',
        emailAccounts: '',
    },
    // 邮件模板 model
    emailTemplate: {
        showTemplate: false,
        editTemplate: {
            subject: '',
            body: '',
            isEnable: false,
        },
        selectTemplateId: 0,
        templateEmails: []
    }
};

const mutations = {
    ...updateModel()
};

const getters = {
    getMyEmails() {
        let arr = [];
        state.myInboxEmail.multipleSelection.forEach((n, i) => {
            let es = n.emails;
            if (es && es.length > 0) {
                for (const e of es) {
                    arr.push(e.email);
                }
            }
        });
        return arr;
    },
    getComEmails() {
        let arr = [];
        state.comInboxEmail.multipleSelection.forEach((n, i) => {
            arr.push(n.email);
        });
        return arr;
    },
    getEnabledEmailTemplate() {
        let templateEmails = state.emailTemplate.templateEmails;
        for (const templateEmail of templateEmails) {
            if (templateEmail.isEnable) {
                return templateEmail;
            }
        }
        return null;
    }
};

const actions = {

    // ----------------------------------------------------------------------------------------------------------------------------------------- my email

    /**
     * 清除所有下拉项
     * @param commit
     * @param v
     */
    clearOptionsAction({commit}) {
        commit('updateModel', {
            label: 'myInboxEmail.myOptions',
            value: []
        });
        commit('updateModel', {
            label: 'myInboxEmail.mySelectValues',
            value: []
        });
        commit('updateModel', {
            label: 'myInboxEmail.cacheSelectValues',
            value: []
        });
    },

    /**
     * 复选框选中
     * @param commit
     * @param val
     */
    selectionChangeAction({commit}, val) {
        commit('updateModel', {
            label: 'myInboxEmail.multipleSelection',
            value: val
        });
    },

    /**
     * 查询分类下的邮箱
     * @param keywordId
     */
    async _findHostAndUrlEmailAction({commit, dispatch}, keywordId) {
        let m = this.state.Email.myInboxEmail;
        let res = await httpPromise(api.findHostAndUrlEmail, {keywordId: keywordId});
        m.crawlHostAndEmailsMap[keywordId] = res.crawlHostAndEmails; // fixme 此处不知怎么updateModel？？？
        return res.crawlHostAndEmails;
    },

    /**
     * 用户选择某个关键词
     * @param keywordId
     * @private
     */
    async _selectedKeywordAction({commit, dispatch}, keywordId) {
        await httpPromise(api.selectedKeyword, {keywordId: keywordId});
        return await dispatch('_findHostAndUrlEmailAction', keywordId);
    },

    /**
     * 用户取消某个关键词
     * @param keywordId
     * @private
     */
    async _unSelectedKeywordAction({commit, dispatch}, keywordId) {
        return await httpPromise(api.unSelectedKeyword, {keywordId: keywordId});
    },

    /**
     * select 选择后的处理
     *  因接口设计与实际select控件不相符，所以需要前端额外判断是选中还是取消
     * @param commit
     * @param dispatch
     * @param selectValues
     */
    async selectChangeAction({commit, dispatch}, selectValues) { // 未知原因value传递不过来反选的值，通过cacheSelectValues实现“取消选择“
        commit('updateModel', {
            label: 'myInboxEmail.mySelectValues',
            value: selectValues
        });
    },

    /**
     * 查询用户搜索过的关键词，初始化下拉多选框
     */
    findKeywordSeekersAction: async function ({commit, dispatch}) {
        let res = await httpPromise(api.findKeywordSeekers);
        if (res.keywords) {
            // 显示下拉项
            commit('updateModel', {
                label: 'myInboxEmail.myOptions',
                value: res.keywords
            });
            commit('updateModel', {
                label: 'myInboxEmail.myEmailsList',
                value: []
            });
        }
    },


    /**
     * 提取我的关键词邮箱
     * @param commit
     * @param dispatch
     * @returns {Promise<void>}
     */
    async extractMyEmailAction({commit, dispatch}) {
        commit('updateModel', {
            label: 'myInboxEmail.myEmailsList',
            value: []
        });
        let m = state.myInboxEmail;
        let categoryNames = m.mySelectValues;
        let allArr = [];
        for (const categoryName of categoryNames) {
            let arr = await dispatch('_selectedKeywordAction', categoryName);
            allArr.push(...arr);
        }
        commit('updateModel', {
            label: 'myInboxEmail.myEmailsList',
            value: allArr
        });
    },


    // ----------------------------------------------------------------------------------------------------------------------------------------- send setting


    /**
     * 用户删除某个关键词
     * @param keywordId
     */
    async deleteKeywordAction({commit, dispatch}, keywordId) {
        let m = this.state.Email.myInboxEmail;
        if (m.mySelectValues.indexOf(keywordId) > 0) {
            await dispatch('_unSelectedKeywordAction', keywordId);
            commit('updateModel', {
                label: 'myInboxEmail.cacheSelectValues',
                value: m.mySelectValues
            });
        }
        await httpPromise(api.deleteKeyword, {keywordId: keywordId});
        await dispatch('findKeywordSeekersAction');
    },


    // ----------------------------------------------------------------------------------------------------------------------------------------- com email

    /**
     * 复选框选中
     * @param commit
     * @param val
     */
    selectionChangeAction2({commit}, val) {
        commit('updateModel', {
            label: 'comInboxEmail.multipleSelection',
            value: val
        });
    },

    /**
     * 查询用户搜索过的关键词，初始化下拉多选框
     */
    findKeywordSeekersAction2: async function ({commit, dispatch}) {
        let res = await httpPromise(api.findUserLeadInCategories);
        if (res.keywords) {
            // 显示下拉项
            commit('updateModel', {
                label: 'comInboxEmail.comOptions',
                value: res.keywords
            });
            commit('updateModel', {
                label: 'comInboxEmail.comEmailsList',
                value: []
            });
        }
    },

    /**
     * 查询分类下的邮箱
     * @param categoryName
     */
    async _findHostAndUrlEmailAction2({commit, dispatch}, categoryName) {
        let m = state.comInboxEmail;
        let res = await httpPromise(api.findLeadInEmails, {categoryName: categoryName});
        m.crawlHostAndEmailsMap[categoryName] = res.leadIns; // fixme 此处不知怎么updateModel？？？
        return res.leadIns;
    },

    /**
     * select 选择后的处理
     *  因接口设计与实际select控件不相符，所以需要前端额外判断是选中还是取消
     * @param commit
     * @param dispatch
     * @param selectValues
     */
    async selectChangeAction2({commit, dispatch}, selectValues) { // 未知原因value传递不过来反选的值，通过cacheSelectValues实现“取消选择“
        commit('updateModel', {
            label: 'comInboxEmail.comSelectValues',
            value: selectValues
        });
    },

    /**
     * 提取大数据邮箱
     * @param commit
     * @param dispatch
     * @returns {Promise<void>}
     */
    async extractBigDataAction({commit, dispatch}) {
        commit('updateModel', {
            label: 'comInboxEmail.comEmailsList',
            value: []
        });
        let m = state.comInboxEmail;
        let categoryNames = m.comSelectValues;
        let allArr = [];
        for (const categoryName of categoryNames) {
            let arr = await dispatch('_selectedKeywordAction2', categoryName);
            // 随机洗牌算法
            arr = _.shuffle(arr);
            if (arr.length > 20) {
                let r = _.random(2, 10);
                arr = _.dropRight(arr, r);
            }
            allArr.push(...arr);
        }
        commit('updateModel', {
            label: 'comInboxEmail.comEmailsList',
            value: allArr
        });
    },

    /**
     * 用户选择某个关键词
     * @param categoryName
     * @private
     */
    async _selectedKeywordAction2({commit, dispatch}, categoryName) {
        await httpPromise(api.selectedLeadInCategory, {categoryName: categoryName});
        return await dispatch('_findHostAndUrlEmailAction2', categoryName);
    },

    /**
     * 用户取消某个关键词
     * @param categoryName
     * @private
     */
    async _unSelectedKeywordAction2({commit, dispatch}, categoryName) {
        return await httpPromise(api.unSelectedLeadInCategory, {categoryName: categoryName});
    },

    // ----------------------------------------------------------------------------------------------------------------------------------------- send setting
    /**
     * 发送邮件结束后，此邮箱置底
     * @param commit
     * @returns {Promise<void>}
     */
    async changeEmailOrderAction({commit,dispatch}){
        let oldEmailAccounts =  state.sendEmailSetting.emailAccounts;
        let oldEmailArr = oldEmailAccounts.split('\n');
        let first = oldEmailArr[0];
        let arr = [];
        for(let i =0; i< oldEmailArr.length;i++){
            let oe  = oldEmailArr[i];
            if(i !== 0){
                arr.push(oe.replace('\n',''));
            }
        }
        arr.push(first.replace('\n',''));
        commit('updateModel', {
            label: 'sendEmailSetting.emailAccounts',
            value: arr.join('\n').replace('\n\n','\n')
        });
        return dispatch('saveEmailSettingAction')
    },

    /**
     *
     * @param commit
     * @param v
     */
    updateEmailSettingAction({commit}, v) {
        commit('updateModel', {
            label: 'sendEmailSetting.emailAccounts',
            value: v.replace('，', ',')
        });
    },
    /**
     * 查询用户发件邮箱设置
     * @param commit
     * @returns {Promise<T | never>}
     */
    loadEmailSettingAction({commit}) {
        return httpPromise(api.loadEmailSettingHandler).then(res => {
            if (res.emailCategory) {
                commit('updateModel', {
                    label: 'sendEmailSetting',
                    value: res.emailCategory
                });
            }
            return res.emailCategory;
        });
    },

    /**
     * 保存用户发件邮箱设置
     * @returns {*|Promise<any>}
     */
    saveEmailSettingAction() {
        return httpPromise(api.saveEmailSettingHandler, state.sendEmailSetting);
    },

    // ----------------------------------------------------------------------------------------------------------------------------------------- template

    /**
     * 用户选择一个作为默认模板
     * @returns {*|Promise<any>}
     */
    templateChangeAction({commit}) {
        return httpPromise(api.selectEmailTemplate, {id: state.emailTemplate.selectTemplateId});
        // .then(res=>{
        //    commit('updateModel',{
        //        label:'emailTemplate.selectTemplateId',
        //        value:state.emailTemplate.selectTemplateId
        //    })
        //     return res;
        // });
    },

    /**
     * 查询用户模板
     * @param commit
     * @returns {Promise<state.emailTemplate | {showTemplate, editTemplate, templateEmails, selectTemplateId} | never>}
     */
    showTemplateDialogAction({commit, dispatch}, id) {
        commit('updateModel', {
            label: 'emailTemplate.editTemplate',
            value: {}
        });
        commit('updateModel', {
            label: 'emailTemplate.showTemplate',
            value: true
        });
        return httpPromise(api.loadEmailTemplate, {id: id}).then(res => {
            commit('updateModel', {
                label: 'emailTemplate.editTemplate',
                value: res.emailTemplate
            });
            commit('updateModel', {
                label: 'emailTemplate.isEnable',
                value: res.emailTemplate.isEnable == 1
            });
            return res.emailTemplate;
        })
    },

    /**
     * 保存用户模板
     * @returns {Promise<T | never>}
     */
    saveEmailTemplateAction({commit, dispatch}) {
        commit('updateModel', {
            label: 'emailTemplate.editTemplate.isEnable',
            value: state.emailTemplate.editTemplate.isEnable ? 1 : 0
        });

        return httpPromise(api.saveEmailTemplate, state.emailTemplate.editTemplate).then(res => {
            commit('updateModel', {
                label: 'emailTemplate.showTemplate',
                value: false
            });
            dispatch('findAllEmailTemplatesAction');
            return res;
        })
    },

    /**
     * 删除用户模板
     * @returns {Promise<T | never>}
     */
    deleteEmailTemplateAction({commit, dispatch}) {
        return httpPromise(api.deleteEmailTemplate, {id: state.emailTemplate.editTemplate.id}).then(res => {
            commit('updateModel', {
                label: 'emailTemplate.showTemplate',
                value: false
            });
            dispatch('findAllEmailTemplatesAction');
            return res;
        })
    },

    /**
     * 查询用户邮件模版列表
     * @returns {Promise<T | never>}
     */
    findAllEmailTemplatesAction({commit, dispatch}) {
        return httpPromise(api.findAllEmailTemplates).then(res => {
            commit('updateModel', {
                label: 'emailTemplate.templateEmails',
                value: res.emailTemplates
            });
            let enabledTempId = '';
            res.emailTemplates.forEach(function (n, i) {
                if (n.isEnable) enabledTempId = n.id;
            });
            commit('updateModel', {
                label: 'emailTemplate.selectTemplateId',
                value: enabledTempId
            });
            return res;
        })
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}
