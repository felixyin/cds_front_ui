<template>
    <div class="router-bg">
        <div class="reptile flex-bg-ac">
            <LeftPanel ref="leftPanel" :full-height="fullHeight"></LeftPanel>
            <div class="right-bg">
                <div class="board right-top-bg flex-jsb-as">
                    <div>
                        <el-form ref="form" :model="form" label-width="70px" @submit.native.prevent>
                            <el-form-item label="关键词">
                                <el-input v-model="form.keyword" size="small" placeholder="请输入搜索关键词" ></el-input>
                            </el-form-item>
                            <el-button @click="showCrawlSettingDialogHandler" class="margin-l-8 search-setting-button"
                                       type="danger" icon="el-icon-setting" size="small">
                            </el-button>
                        </el-form>
                        <el-button type="primary" class="search-btn" icon="el-icon-search" v-if="setup === 1" @click="startSearchAction">
                            开始搜索
                        </el-button>
                        <el-button type="warning" class="search-btn" icon="el-icon-circle-close-outline" v-if="setup === 2" @click="stopSearchAction">
                            停止搜索
                        </el-button>
                        <el-button type="warning" class="search-btn" icon="el-icon-circle-close-outline" v-if="setup === 3">
                            停止中...
                        </el-button>
                        <el-button type="primary" class="search-btn" icon="el-icon-message" v-if="setup === 4" @click="verifyEmailAction">
                            验证邮箱
                        </el-button>
                        <el-button type="warning" class="search-btn" icon="el-icon-loading" v-if="setup === 5">
                            验证中...
                        </el-button>
                        <el-button type="primary" class="search-btn " icon="el-icon-upload2" v-if="setup === 6" @click="saveCrawlResult">
                            上传保存
                        </el-button>
                        <el-button type="danger" class="search-btn " icon="el-icon-delete" @click="clearData">
                            清空
                        </el-button>
                    </div>
                    <div class="log-bg">
                        搜索日志：
                        <el-input class="log-input" readonly="" rows="6" type="textarea" v-model="searchLog"></el-input>
                    </div>
                </div>
                <div class="board right-bottom-bg" :style="{height:(fullHeight-130-164-15)+'px!important'}">
                    <div class="result-title">搜索结果</div>
                    <el-progress :percentage="progress" v-if="true" class="search-progress" :stroke-width=2 color="#FFA404"></el-progress>
                    <el-table ref="emailTable"
                              :data="tableData"
                              stripe
                              class="noselect"
                              style="width: 100%;margin-bottom: 20px;">
                        <el-table-column label="序号" type="index" width="50"></el-table-column>
                        <el-table-column prop="host" label="域名"></el-table-column>
                        <el-table-column prop="url" label="网址"></el-table-column>
                        <el-table-column prop="title" label="标题"></el-table-column>
                        <el-table-column prop="emails" label="邮箱">
                            <template slot-scope="scope">
                                <ul>
                                    <li v-for="(item,index) in scope.row.emails" :key="index">
                                        {{item}}
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <CrawlSettingDialog ref="crawlSettingDialog"></CrawlSettingDialog>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapActions, mapState} from "vuex"
    import io from 'socket.io-client';
    import delay from 'delay';
    // import PQueue from 'p-queue';
    import {verifyCodes, verifyEmail} from '../../email/index';
    import LeftPanel from "./LeftPanel";
    import CrawlSettingDialog from "./CrawlSettingDialog";
    import {crawl, getSubscibe} from '../../crawl';
    import {Pagination} from '../../util/page'

    const em = getSubscibe();
    const sleep = require("es7-sleep");

    // const mmm = require('../crawl/test3');
    // mmm.startTest();
    // const {biyingPuppeteer} = require('../puppeteer/biying');

    // linux服务器
    // connection: 'http://162.241.175.38:3000/',

    // windows 服务器
    // connection: 'http://8.9.6.194:3000/',

    // 尹彬的macos
    // connection: 'http://localhost:3000/',

    // 生产服务器
    // connection: 'http://cds_puppeteer.yinbin.ink/',

    // global.socket = io('http://47.88.54.249:3000'); // 爬虫服务器1 测试
    // const socket = io('http://cds2:3000'); // 爬虫服务器1 测试
    // const socket = io('http://cds3:3000'); // 爬虫服务器1 测试
    // const socket = io('http://cds4:3000'); // 爬虫服务器1 测试

    // global.socket = io('http://127.0.0.1:3000'); // 开发环境
    // global.socket = io('http://cdsp.yinbin.ink'); // 最新的生产环境 ip_hash production fixme
    global.socket = io('http://cdsp.brssoft.com'); // 最新的生产环境 ip_hash production fixme

    // 搜索队列
    // const queue = new PQueue({concurrency: 100});

    export default {
        name: 'Crawl',
        components: {CrawlSettingDialog, LeftPanel},
        data() {
            return {
                // _user_sockets: [], // 对应每个用户的socket连接
                pageCount: 0, // 服务器返回的链接页数计算
                _count: 1, // 总链接数量计算
                setup: 1, // 根据setup来显示不同的按钮
                isShowProgress: true, // 是否显示进度条
                exeCount: 0, // 已经抓取的网站数量
                allCount: 0, // 要抓取的网站总数
                stopBtnName: '停止搜索',
                searchLog: '',
                form: {
                    keyword: '',
                },
                tableData: [],
                // tableData: [
                //     {id: 'ssfd', host: 'skajk', url: 'jksssjks', title: 'sjkksj', emails: ['212@qq.com', '32@qq.com'],},
                //     {id: 'ssfd1', host: 'skajk1', url: 'jksssjks1', title: 'sjkksj1', emails: ['213@qq.com', '33@qq.com'],},
                // ],
                HostEmailResult: {},
            }
        },
        created() {
            this.initScoket();
        },
        props: ['fullHeight'],
        computed: {
            ...mapState('User', ['user']),
            progress() {
                if (!this.allCount) return 0; // 0 不能做除数
                else {
                    let v = parseInt(((this.exeCount / this.allCount) * 100).toFixed(0));
                    if (v < 100) return v; else return 100;
                }
            }
        },
        // watch: {
        //     progress: function (val) {
        //         if (val === 100) {
        //             this.setup++; // 按钮状态变化，现实下一步按钮
        //         }
        //     },
        // },
        // mounted() {
        // this.getUserSet();
        // this.getUserKeyword();
        // },
        methods: {
            ...mapActions('User', ['getUser', 'updateUser', 'reLoginAction']),
            /**
             * 清空，重新爬取
             */
            clearData() {
                this.searchLog = '';
                // this.form.keyword = '';
                this.tableData = [];
                this.stopSearchAction();
                this.setup = 1;
                this.exeCount = 0;
                clearInterval(self._si);
            },
            /**
             * @deprecated
             */
            getUserKeyword() {
                let _this = this;
                this.$http(this.$api.loadKeyword, {}, function (error, response, body) {
                    if (body) {
                        let res = JSON.parse(body);
                        if (res.success) {
                            _this.form.keyword = res.body.keywords.keyword;
                        } else {
                            _this.$message.error(res.msg);
                        }
                    }
                });
            },
            /**
             * @deprecated
             */
            saveKeyword() {
                let _this = this;
                this.$http(this.$api.saveKeyword, {keyword: this.form.keyword}, function (error, response, body) {
                    if (body) {
                        let res = JSON.parse(body);
                        if (res.success) {
                            _this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        } else {
                            _this.$message.error(res.msg);
                        }
                    }
                });
            },
            // 保存搜索的内容
            saveCrawlResult() {
                // @deprecated 保存关键词方法已废弃
                // this.saveKeyword(); // 保存keyword不是在这里调用，是在下面的saveSearchResult方法中
                // Loading.service({text: "数据保存中..."});
                let that = this;
                that.tableData.forEach(function (nn, ii) {
                    // console.log(nn.emails);
                    let l = nn.emails.length;
                    if (!l) {
                        self.searchLog = '删除记录：' + nn.url + '，因为没有找到邮箱\n' + self.searchLog;
                        Vue.delete(that.tableData, ii);
                    }
                });
                if (!that.tableData || that.tableData.length < 1) {
                    that.$message.error('没有可保存数据，请重新爬取！');
                    return;
                }
                let postData = JSON.stringify({
                    keyword: this.form.keyword,
                    crawlResult: this.tableData
                });

                that.reLoginAction().then(_ => {
                    that.$http(that.$api.saveCrawlResult, {crawlResultJson: postData}, function (res) {
                        if (res.success) {
                            that.clearData();
                            that.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            localStorage.setItem('_need_reload_selected_keywords', "1");
                        } else {
                            console.log(res)
                            that.$message.error(res.msg);
                        }
                    });
                });
            },
            loadHostAndEmail() {
                let _this = this;
                this.$http(this.$api.loadHostAndEmail, {whost: this.whost}, function (error, response, body) {
                    if (body) {
                        let res = JSON.parse(body);
                        if (res.success) {
                            _this.HostEmailResult = res.body.hostAndEmails;
                        } else {
                            _this.$message.error(res.msg);
                        }
                    }
                });
            },

            loginSocket() {
                let self = this;
                self.searchLog = '已连接，或重连！！';
                let un = self.user.username;
                if (!un) {
                    let _userJson = localStorage.getItem('_user');
                    if (_userJson) {
                        un = JSON.parse(_userJson).username;
                        global.socket.emit('login', un);
                        self.searchLog = '已登录:' + un;
                    }
                }
            },
            initScoket() {

                let self = this;

                global.socket.on('connect', function () {
                    self.loginSocket();
                    console.log('connect!!')
                });

                // setInterval(function () {
                //     self.loginSocket();
                // }, 1000 * 20);

                global.socket.on('reconnect', function () {
                    global.socket.connect();
                    self.searchLog = '已重连!';
                    console.log('已重连!');
                });

                global.socket.on('disconnect', function () {
                    self.searchLog = '已断开!';
                    console.log('已断开!');
                });

                // let count = 0;
                // queue.on('active', () => {
                //     if (count !== 0 && queue.pending === 0) {
                //         // todo 在这里将"搜索进行中"，改为"搜索完毕"
                //         self.setup = 3;
                //         self.isShowProgress = false;
                //         self.allCount = 0;
                //         self.exeCount = 0;
                //     }
                //     count += 1;
                //     console.log(`Working on item #${count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
                // });

                let _isSearchOver; // 判断结束

                em.on('localCrawlResult', (data) => {
                    console.log('00000000000000->', data);
                    self.exeCount += 1;
                    self._count += 1;
                    let allEmailArray = data.allEmailArray;
                    let haoShi = data.haoShi;
                    if (data.error) {
                        self.searchLog = '===========>\n' +
                            '抓取数据: ' + JSON.stringify(allEmailArray) + '\n' +
                            '抓取耗时: ' + haoShi + '秒' + '\n\n';
                    } else {
                        if (allEmailArray) {
                            clearTimeout(_isSearchOver);
                            _isSearchOver = setTimeout(function () {
                                self.searchLog = '===========>\n' +
                                    '大约有' + self.progress + '%的地址找到了邮箱，已搜索不到新内容！\n\n';
                                let myNotification = new Notification('晟时科技提醒您', {
                                    timestamp: 10000,
                                    body: '大约有' + self.progress + '%的地址找到了邮箱，已搜索不到新内容！'
                                });

                                // 停止搜索
                                global.socket.emit('stop', self.user.username);
                                self.isShowProgress = false;
                                self.doneOrReSearch();
                                self.setup = 4;
                                // myNotification.onclick = () => {
                                //     console.log('Notification clicked')
                                // }
                            }, 1000 * 45);
                            // allEmailArray.forEach(function (n, i) {
                            self.tableData.push(allEmailArray);
                            // });
                            // console.log(allEmailArray);
                            // self.tableData = self.tableData.concat(allEmailArray);
                            // console.log(allEmailArray);
                            self.searchLog = '===========>\n' +
                                '抓取数据: ' + JSON.stringify(allEmailArray) + '\n' +
                                '抓取耗时: ' + haoShi + '秒' + '\n\n';
                            self.$refs.emailTable.bodyWrapper.scrollTop = self.$refs.emailTable.bodyWrapper.scrollHeight; //滚动最低
                        }
                    }
                });

                global.socket.on('queryResult', function (data) {
                    if (data) {
                        if (data.status === 'data') {
                            if (data.links) {
                                self.pageCount += 1;
                                self.searchLog = self.pageCount + ' >>>>>>>>>>>>>>>>>>>\n' +
                                    '获取到的要抓取的地址: ' + JSON.stringify(data.links) + '\n\n';
                                // child.send(data.links);
                                self.allCount += data.links.length;
                                em.emit('exeLocalCrawl', data.links);
                            } else {
                                alert('没有找到数据');
                            }
                        } else if (data.status === 'finish') { // 结束
                            // self.isShowProgress = false;
                        }
                    }
                });

                global.socket.on('stopOver', function (data) {
                    // console.log(data);
                    if (data && data.status === 'ok') {
                        // queue.pause();
                        // queue.clear();

                        self.isShowProgress = false;
                        // self.allCount = 0;
                        // self.exeCount = 0;

                    }
                });
            },
            doneOrReSearch() {
                // 如果没有发现邮箱，显示“搜索“按钮，让其可以重新搜索
                // if (this.tableData.length === 0) {
                //     this.setup = 1;
                // }
            },
            /**
             *
             * @returns {boolean}
             */
            checkSearchForm() {
                let country = this.$refs.leftPanel.getCountryTreeSelected();
                if (country.length === 0) {
                    this.$message.error('请选择国家！');
                    return false;
                }
                let search = this.$refs.leftPanel.getSearchEngineTreeSelected();
                if (search.length === 0) {
                    this.$message.error('请选择搜索引擎！');
                    return false;
                }
                let kw = this.form.keyword;
                if (!kw || !kw.trim()) {
                    this.$message.error('请输入关键词！');
                    return false;
                }
                if (kw.trim().length < 3) {
                    this.$message.error('关键词字符太少！');
                    return false;
                }
                return true;
            },
            /**
             *
             */
            startSearchAction() {
                // let self = this;
                if (this.checkSearchForm()) {
                    this.loginSocket();
                    this.$message({
                        message: '连接服务器处理，需要1分钟，请稍等一会！',
                        type: 'success'
                    });
                    let keyword = encodeURI(this.form.keyword);
                    console.log(keyword);
                    this.tableData = [];
                    this.isShowProgress = true;

                    // queue.start();
                    this.setup = 2;
                    console.log(this.user.username);
                    global.socket.emit('query', this.user.username, keyword)
                }
            },
            stopSearchAction() {
                this.setup = 3;
                this.$message({
                    duration: 30000,
                    message: '停止搜索需要等待当前搜索队列中的网络请求结束，大约需要2分钟，请耐心等待！',
                    type: 'success'
                });
                global.socket.emit('stop', this.user.username);
                this.isShowProgress = false;
                this.doneOrReSearch();
            },
            async verifyEmailAction() {
                let self = this;
                self.setup = 5;
                self.searchLog = '';

                // 计算待验证邮箱和总验证数量
                self.allCount = 0;
                let _allCount = 0;
                await this.tableData.forEach(async (nn, ii) => {
                    await nn.emails.forEach(async (n, i) => {
                        _allCount += 1;
                    });
                });
                self.allCount = _allCount;

                self.exeCount = 0;
                await this.tableData.forEach(async (nn, ii) => {
                    await nn.emails.forEach(async (n, i) => {
                        await sleep(500); // 延迟执行，防止触发邮件服务器限制
                        let verifyResult = await verifyEmail(n);
                        let info = verifyResult.info;
                        let err = verifyResult.err;
                        let p = '';
                        switch (info.code) {
                            case verifyCodes.finishedVerification:
                                p = '验证成功！';
                                break;
                            case verifyCodes.invalidEmailStructure:
                                p = 'email不合法';
                                Vue.delete(nn.emails, i);
                                break;
                            case verifyCodes.noMxRecords:
                                p = '没有找到服务器MX记录';
                                Vue.delete(nn.emails, i);
                                break;
                            case verifyCodes.SMTPConnectionTimeout:
                                p = 'smtp服务器链接超时';
                                if (n.indexOf('@gmail.com') === -1) { // gmail比较特殊，需要排除
                                    Vue.delete(nn.emails, i);
                                }
                                break;
                            case verifyCodes.domainNotFound:
                                p = '邮件域名不可访问';
                                if (n.indexOf('@gmail.com') === -1) { // gmail比较特殊，需要排除
                                    Vue.delete(nn.emails, i);
                                }
                                break;
                            case verifyCodes.SMTPConnectionError:
                                p = 'smtp服务器链接失败';
                                if (n.indexOf('@gmail.com') === -1) { // gmail比较特殊，需要排除
                                    Vue.delete(nn.emails, i);
                                }
                                break;
                        }
                        self.searchLog = '验证邮箱：' + n + ',' + p + '\n' + self.searchLog;
                        // if (nn.emails.length === 0) {
                        //     self.searchLog = '删除记录：' + nn.url + '，因为' + self.searchLog;
                        //     Vue.delete(self.tableData, ii);
                        // }
                        self.exeCount += 1;
                    });

                });

                self._si =  setInterval(function () {//延时处理
                    if (self.progress < 95) return;
                    clearInterval(self._si);
                    self.tableData.forEach(function (nn, ii) {
                        // console.log(nn.emails);
                        let l = nn.emails.length;
                        if (!l) {
                            self.searchLog = '删除记录：' + nn.url + '，因为没有找到邮箱\n' + self.searchLog;
                            Vue.delete(self.tableData, ii);
                        }
                    });
                    // self.doneOrReSearch();
                    self.$message({
                        duration: 60000,
                        message: '停止验证需要等待当前验证队列中的请求结束，大约需要2分钟，请耐心等待！',
                        type: 'success'
                    });
                    self.allCount = 10;
                    self.exeCount = 10;
                    setTimeout(function () {
                        self.setup = 6;
                        self.searchLog = '===========>\n' +
                            '邮箱已验证完毕，请上传保存后再发送邮件！\n\n';
                        let myNotification = new Notification('晟时科技提醒您', {
                            timestamp: 10000,
                            body: '邮箱已验证完毕，请上传保存后再发送邮件！'
                        });
                    }, 80000);
                }, 1000);
            },
            showCrawlSettingDialogHandler() {
                this.$refs.crawlSettingDialog.show();
            },
        }
    }
</script>

<style scoped>
    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
not supported by any browser */
    }
    .search-setting-button {
        /*font-size: 10px;*/
    }

    .log-bg {
        display: inline-block;
        float: right;
        width: calc(100% - 355px);
    }

    .log-input {
        float: right;
        width: calc(100% - 90px);
    }

    .search-progress {
        position: relative;
        line-height: 1;
        width: 90%;
        float: right;
    }

    .result-title {
        display: inline-block;
        padding: 0 15px;
        line-height: 25px;
        border-radius: 0 15px 15px 0;
        background: #4890EA;
        color: #ffffff;
        font-size: 13px;
        margin-left: -28px;
        margin-top: -10px;
    }

    .right-top-bg {
        height: 164px;
        margin-bottom: 5px;
        overflow: hidden;
    }

    .right-bottom-bg {
        flex: 1;
        height: 100%;
        overflow: hidden;
    }

    .top-left-bg {
        font-size: 20px;
        color: #333333;
    }

    .search-btn {
        border: 0;
        margin-left: 40px;
    }

    .delete-btn {
        background: #999999;
        color: #ffffff;
        border: 0;
    }

    .right-bg {
        flex: 1;
        height: 100%;
        overflow: hidden;
        margin-left: 5px;
        display: -webkit-flex;
        display: flex;
        flex-flow: column;
    }

</style>
<style>
    ul {
        padding-left: 5px;
    }

    .reptile .el-form-item {
        display: inline-block;
    }

    .reptile .el-form-item {
        margin-bottom: 12px;
    }

    .reptile .el-progress-bar__innerText {
        margin-top: -5px;
    }

    .reptile .el-table__body-wrapper {
        overflow-x: hidden!important;
        overflow-y: scroll;
        height: calc(100% - 48px);
    }

    .reptile .el-table {
        height: calc(100% - 30px);
    }
</style>


