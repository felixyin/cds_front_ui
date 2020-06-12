/**
 * 接口地址都写到这里吧
 */
// 测试环境 fixme 此服务器的api接口已经停止使用
// const host = 'http://47.105.42.124/cds/a/';

// 生产环境
const host = 'http://cds.brssoft.com/cds/a/';

// 开发环境
// const host = 'http://localhost:8080/cds/a/';

const path = {
    login: 'login',
    logout: 'logout',


    /* Crawl =========================================================================================== */

    // 中间上部搜索设置按钮
    loadSearchSetting: 'api/loadSearchSetting',
    saveSearchSetting: 'api/saveSearchSetting',

    // 临时没用
    loadKeyword: 'api/loadKeyword',
    saveKeyword: 'api/saveKeyword',

    // 上传保存
    saveCrawlResult: 'api/saveCrawlResult',


    /* Email =========================================================================================== */

    // 左侧163发件箱设置
    loadEmailSettingHandler: 'api/loadEmailSetting',
    saveEmailSettingHandler: 'api/saveEmailSetting',

    // 中间上部定时发件设置
    loadCrontabSetting: 'api/loadCrontabSetting',
    saveCrontabSetting: 'api/saveCrontabSetting',

    // 右侧邮件模板设置
    findAllEmailTemplates: 'api/findAllEmailTemplates',
    loadEmailTemplate: 'api/loadEmailTemplate',
    selectEmailTemplate: 'api/selectEmailTemplate',
    saveEmailTemplate: 'api/saveEmailTemplate',
    deleteEmailTemplate: 'api/deleteEmailTemplate',

    // 中间下面 用户爬取关键词  多选框设置
    findKeywordSeekers: 'api/findKeywordSeekers',
    findHostAndUrlEmail: 'api/findHostAndUrlEmail',
    selectedKeyword: 'api/selectedKeyword',
    unSelectedKeyword: 'api/unSelectedKeyword',
    deleteKeyword: 'api/deleteKeyword',

    // 中间下面 系统导入行业email  多选框设置
    findUserLeadInCategories: 'api/findUserLeadInCategories',
    findLeadInEmails:'api/findLeadInEmails',
    selectedLeadInCategory:'api/selectedLeadInCategory',
    unSelectedLeadInCategory: 'api/unSelectedLeadInCategory',
};

for (const p in path) {
    path[p] = host + path[p];
}
console.debug('all api：');
console.debug(path);

export default path;
