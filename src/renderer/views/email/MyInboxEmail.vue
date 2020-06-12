<template>
    <div>
        <div>
            <el-row :gutter="20">
                <el-col :span="4">
                    <label style="display: inline-block;float: right;line-height:30px;text-align:right;font-size:14px;color:#606266;padding:0 12px 0 0;box-sizing:border-box;">关键词：</label>
                </el-col>
                <el-col :span="9">
                    <el-select v-model="mySelectValues"
                               @change="selectChangeHandler"
                               @visible-change="selectVisibleHandler"
                               multiple
                               collapse-tags
                               placeholder="请选择您搜索过的关键词或邮箱分类名称">
                        <el-option
                                v-for="item in myOptions"
                                :key="item.id"
                                :label="item.keyword"
                                :value="item.id">
                            <span>{{item.keyword}}</span>
                            <i @click="optionDeleteHandler(item.id)"
                               class="el-icon-delete option-delete">
                            </i>
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="11">
                    <div style="text-align: center;">
                        <el-button type="primary" size="small" @click="extractMyEmailHandler">
                            提取<i class="el-icon-arrow-right el-icon--right"></i>
                        </el-button>
                        <el-button type="danger" size="small" @click="clearAllHandler">
                            清空<i class="el-icon-delete el-icon--right"></i>
                        </el-button>
                        <el-button type="info" size="small" @click="exportToTxtHandler">
                            导出<i class="el-icon-download el-icon--right"></i>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table ref="emailTable2"
                  :data="myEmailsList"
                  stripe
                  class="margin-t-15"
                  style="width: 100%;margin-bottom: 20px;overflow: auto!important;"
                  :style="{height:(fullHeight-130-155-115-50)+'px!important'}"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" prop="id" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
<!--            <el-table-column prop="host" label="域名"></el-table-column>-->
            <el-table-column prop="url" label="链接"></el-table-column>
<!--            <el-table-column prop="title" label="标题"></el-table-column>-->
            <el-table-column prop="emails" label="邮箱">
                <template slot-scope="scope">
                    <ul>
                        <li v-for="(item,index) in scope.row.emails" :key="index">
                            {{item.email}}
                        </li>
                    </ul>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../../util/vuexbound';
    import {exportCSV} from 'export.js/csv'

    const {Pagination} = require('../../util/page');

    export default {
        name: 'MyInboxEmail',
        data() {
            return {
                _isClearSelected: true,
            };
        },
        props: {
            fullHeight: {},
        },
        computed: {
            ...mapModel('Email', {
                mySelectValues: state => state.myInboxEmail.mySelectValues,
                myOptions: state => state.myInboxEmail.myOptions,
                myEmailsList: state => state.myInboxEmail.myEmailsList,
                crawlHostAndEmailsMap: state => state.myInboxEmail.crawlHostAndEmailsMap,
                multipleSelection: state => state.myInboxEmail.multipleSelection,
            }),
        },
        activated() {
            const _this = this;
            // 初始化时加载用户选择的keyword和email
            this.findKeywordSeekersAction().then(_ => {

            });
        },
        watch: {
            myEmailsList(oldV, newV) {
                const _this = this;
                // 初始化时加载用户选择的keyword和email
                const s = localStorage.getItem('_selectedMyInboxEmails');
                if (s) {
                    const arr = s.split(',');
                    if (arr.length !== 0) {
                        setTimeout(function () {
                            _this.myEmailsList.forEach((n, i) => {
                                if (arr.includes(n.id)) {
                                    _this.$refs.emailTable2.toggleRowSelection(n, true);
                                }
                            });
                        }, 1500);
                    }
                }
            }
        },
        methods: {
            ...mapActions('Email', [
                'findKeywordSeekersAction',
                'selectChangeAction',
                'selectionChangeAction',
                'deleteKeywordAction',
                'clearOptionsAction',
                'extractMyEmailAction'
            ]),

            /**
             * 表格复选框选装处理
             */
            handleSelectionChange(val) {
                this.selectionChangeAction(val);
                if (val) {
                    if (this._isClearSelected) {
                        const sa = val.map((n, i) => n.id);
                        const ss = localStorage.getItem('_selectedMyInboxEmails');
                        if (ss) {
                            const arr = ss.split(',');
                            if (arr.length !== 0) {
                                sa.push(...arr);
                            }
                        }
                        const s = sa.join(',');
                        localStorage.setItem('_selectedMyInboxEmails', s);
                    } else {
                        this._isClearSelected = true;
                    }
                }
            },

            /**
             * 当用户新爬取了email数据，则需要在select展开时重新加载关键词
             * @param isShow
             */
            selectVisibleHandler(isShow) {
                if (isShow) {
                    let nrsk = localStorage.getItem('_need_reload_selected_keywords');
                    if (nrsk === '1') {
                        localStorage.setItem('_need_reload_selected_keywords', "0");
                        this.findKeywordSeekersAction();
                    }
                }
            },

            /**
             * select 选择后的处理
             * @param selectValues
             */
            selectChangeHandler(selectValues) { // 未知原因value传递不过来反选的值，通过cacheSelectValues实现“取消选择“
                let _this = this;
                this._isClearSelected = false;
                this.selectChangeAction(selectValues).then(_ => {
                    console.log('999999999999')
                    setTimeout(function () {
                        _this.$refs.emailTable2.bodyWrapper.scrollTop = _this.$refs.emailTable2.bodyWrapper.scrollHeight - 50; //滚动最低
                    }, 1000); // fixme 未知原因，调用不生效
                });
            },
            /**
             * 删除标签处理
             * @param keywordId
             */
            optionDeleteHandler(keywordId) {
                this.$confirm('您是否要删除这个关键词和清空对应的Email数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteKeywordAction(keywordId);
                });
            },

            /**
             *  清除全部结果
             */
            async clearAllHandler() {
                this.$confirm('您是否要删除所有关键词和清空对应的Email数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let msv = this.myOptions;
                    for (let i = 0; i < msv.length; i++) {
                        const keywordId = msv[i].id;
                        await this.deleteKeywordAction(keywordId);
                    }
                    this.clearOptionsAction();
                });
            },

            /**
             * 导出文件到txt
             */
            exportToTxtHandler() {
                try {
                    let tds = [];
                    let map = this.crawlHostAndEmailsMap;
                    let options = this.myOptions;
                    for (const key in map) {
                        let list = map[key];
                        let category = '';
                        for (const o of options) {
                            if (o.id === key) {
                                category = o.keyword;
                            }
                        }
                        tds.push(['   ']);
                        tds.push([category]);

                        let arr = [];
                        list.forEach((n, i) => {
                            let es = n.emails;
                            if (es) {
                                for (const e of es) {
                                    let ee = e.email;
                                    if (ee) ee = ee.trim();
                                    arr.push(ee);
                                }
                            }
                        });

                        let dd = Pagination(arr, 30).getAll();
                        tds.push(...dd);
                    }
                    console.log(tds);

                    const data = [{
                        // th: [],
                        td: tds
                    }];
                    console.log(tds);
                    let dateStr = (new Date()).toLocaleString();
                    exportCSV('所有邮箱' + dateStr, data);
                } catch (e) {
                    this.$message.error('导出出现问题，请检查是否有可导出的邮箱!');
                }
            },
            /**
             *
             */
            extractMyEmailHandler() {
                this.extractMyEmailAction();
            }
        }
    }
</script>
<style scoped>

    .option-delete {
        position: absolute;
        right: 0;
        float: right;
        margin-right: 20px;
        margin-top: 5px;
        font-size: 23px;
        color: red !important;
    }

    .option-delete :hover {
        opacity: 0.6;
    }

    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
        position: relative !important;
        /*left: 20px!important;*/
        right: -20px !important;
    }

    ul {
        padding-left: 5px;
    }

</style>
