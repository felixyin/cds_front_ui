<template>
    <el-dialog title="爬虫设置" :visible.sync="isShow" width="30%">
        <div>
            <el-form ref="setForm" label-width="100px">
                <el-form-item label="队列长度">
                    <el-input-number placeholder="10-100" v-model="siteQueue" :min="10" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="间隔时间">
                    <el-input-number placeholder="100-5000" v-model="siteSleep" :min="100" :max="5000"></el-input-number>
                </el-form-item>
                <el-form-item label="挖掘深度">
                    <el-input-number placeholder="1-5" v-model="diggingDepth" :min="1" :max="5"></el-input-number>
                </el-form-item>
                <el-form-item label="线程并发数">
                    <el-input-number placeholder="1-50" v-model="threadCount" :min="1" :max="50"></el-input-number>
                </el-form-item>
                <el-form-item label="线程并发数">
                    <el-input-number placeholder="10-5000" v-model="threadSleep" :min="10" :max="5000"></el-input-number>
                </el-form-item>
                <el-form-item label="抓取超时时间">
                    <el-input-number placeholder="100-5000" v-model="fetchTimeout" :min="100" :max="5000"></el-input-number>
                </el-form-item>
                <!--<el-form-item label="是否去除重复">-->
                <!--<el-switch v-model="isNeedDistinct" :active-value="activeValue" :inactive-value="inactiveValue"></el-switch>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="是否验证邮箱">-->
                <!--<el-switch v-model="isVerifyEmail" :active-value="activeValue" :inactive-value="inactiveValue"></el-switch>-->
                <!--</el-form-item>-->
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="saveCrawlSettingHandler">保 存</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../../util/vuexbound';

    export default {
        name: 'CrawlSettingDialog',
        data() {
            return {
                isShow: false,
                activeValue: 1,
                inactiveValue: 0,
            };
        },
        beforeMount() {
            this.loadSearchSettingAction();
        },
        computed: {
            ...mapModel('Crawl', {
                siteQueue: state => state.setForm.siteQueue,
                siteSleep: state => state.setForm.siteSleep,
                diggingDepth: state => state.setForm.diggingDepth,
                threadCount: state => state.setForm.threadCount,
                threadSleep: state => state.setForm.threadSleep,
                fetchTimeout: state => state.setForm.fetchTimeout,
                isNeedDistinct: state => state.setForm.isNeedDistinct,
                isVerifyEmail: state => state.setForm.isVerifyEmail,
            }),
        },
        methods: {
            ...mapActions('Crawl', ['loadSearchSettingAction', 'saveSearchSettingAction',]),
            show() {
                this.isShow = true;
            },
            hide() {
                this.isShow = false;
            },
            /**
             * 保存用户搜索设置
             */
            saveCrawlSettingHandler() {
                const that = this;
                this.saveSearchSettingAction().then(function () {
                    that.isShow = false;
                    that.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                });
            },
        },
    }
</script>
