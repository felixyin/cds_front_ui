<template>
    <div>
        <div style="margin-bottom: -20px;">
            <el-form ref="form" label-width="60px">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-form-item label="产品:">
                            <el-input v-model="production"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="分类:" style="width: 100%">
                            <el-select v-model="comSelectValues"
                                       @change="selectChangeHandler"
                                       collapse-tags
                                       multiple
                                       placeholder="请选择分类名称">
                                <el-option
                                        v-for="item in comOptions"
                                        :key="item.id"
                                        :label="item.keyword"
                                        :value="item.id">
                                    <span>{{item.keyword}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="width: 100%">
                            <el-button type="primary" size="small" @click="extractBigDataHandler">提取<i class="el-icon-arrow-right el-icon--right"></i>
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table ref="emailTable3"
                  :data="comEmailsList"
                  stripe
                  class="margin-t-15"
                  style="width: 100%;margin-bottom: 20px;overflow: auto!important;"
                  :style="{height:(fullHeight-130-155-115-50)+'px!important'}"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
<!--            <el-table-column prop="category" label="类别" width="150"></el-table-column>-->
            <el-table-column prop="company" label="公司名称" width="150"></el-table-column>
            <el-table-column prop="area" label="地区" width="150"></el-table-column>
            <el-table-column prop="website" label="公司网址" width="150"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
            <el-table-column prop="contacts" label="联系人" width="150"></el-table-column>
            <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
            <el-table-column prop="fax" label="传真" width="150"></el-table-column>
            <el-table-column prop="address" label="地址" width="150"></el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../../util/vuexbound';

    export default {
        name: 'ComInboxEmail',
        data() {
            return {
                production: '',
                _isClearSelected:true,
            }
        },
        props: {
            fullHeight: {},
        },
        activated() {
            // 初始化时加载用户选择的keyword和email
            this.findKeywordSeekersAction2();
        },
        computed: {
            ...mapModel('Email', {
                comSelectValues: state => state.comInboxEmail.comSelectValues,
                comOptions: state => state.comInboxEmail.comOptions,
                comEmailsList: state => state.comInboxEmail.comEmailsList,
            }),
        },
        watch: {
            comEmailsList(oldV, newV) {
                const _this = this;
                // 初始化时加载用户选择的keyword和email
                const s = localStorage.getItem('_selectedComInboxEmails');
                if (s) {
                    const arr = s.split(',');
                    if (arr.length !== 0) {
                        // alert(arr.length)
                        setTimeout(function () {
                            _this.comEmailsList.forEach((n, i) => {
                                if (arr.includes(n.id)) {
                                    _this.$refs.emailTable3.toggleRowSelection(n, true);
                                }
                            });
                        }, 2300);
                    }
                }
            }
        },
        methods: {
            ...mapActions('Email', [
                'findKeywordSeekersAction2',
                'selectChangeAction2',
                'deleteKeywordAction2',
                'selectionChangeAction2',
                'extractBigDataAction'
            ]),

            /**
             * 表格复选框选装处理
             */
            handleSelectionChange(val) {
                this.selectionChangeAction2(val);
                if (val) {
                    if (this._isClearSelected) {
                        const sa = val.map((n, i) => n.id);
                        const ss = localStorage.getItem('_selectedComInboxEmails');
                        if (ss) {
                            const arr = ss.split(',');
                            if (arr.length !== 0) {
                                sa.push(...arr);
                            }
                        }
                        const s = sa.join(',');
                        localStorage.setItem('_selectedComInboxEmails', s);
                    }else{
                        this._isClearSelected = true;
                    }
                }
            },
            /**
             * select 选择后的处理
             * @param selectValues
             */
            selectChangeHandler(selectValues) { // 未知原因value传递不过来反选的值，通过cacheSelectValues实现“取消选择“
                console.log(selectValues);
                this._isClearSelected = false;
                let _this = this;
                this.selectChangeAction2(selectValues).then(_ => {
                    console.log('999999999999')
                    setTimeout(function () {
                        _this.$refs.emailTable3.bodyWrapper.scrollTop = _this.$refs.emailTable3.bodyWrapper.scrollHeight - 50; //滚动最低
                    }, 1000); // fixme 未知原因，调用不生效
                });
            },

            /**
             *
             */
            extractBigDataHandler() {
                this.extractBigDataAction();
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
