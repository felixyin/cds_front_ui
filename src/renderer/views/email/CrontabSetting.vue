<template>
    <div style="height: 100%;">
        <div class="result-title">发件设置</div>
        <el-form class="margin-b-8 margin-t-8 time-form" ref="timeForm" :model="timeForm" label-width="40px">
            <!--<el-form-item label="月:">-->
            <!--<el-input-number v-model="timeForm.month" :min="1" :max="12"></el-input-number>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="日:">-->
            <!--<el-input-number v-model="timeForm.dayOfWeek" :min="1" :max="31"></el-input-number>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="时:">-->
            <!--<el-input-number v-model="timeForm.hour" :min="0" :max="23"></el-input-number>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="分:">-->
            <!--<el-input-number v-model="timeForm.minute" :min="0" :max="59"></el-input-number>-->
            <!--</el-form-item>-->

            <!--            <el-form-item label="指定时间:" style="min-width: 300px" label-width="80px">-->
            <!--                <el-date-picker-->
            <!--                        v-model="exeTime"-->
            <!--                        type="datetime"-->
            <!--                        placeholder="选择日期时间">-->
            <!--                </el-date-picker>-->
            <!--            </el-form-item>-->


            <el-form-item label="" style="margin-top: 30px;margin-left: -25px;width: 150px;" class="flex-jsb-aic">
                <el-button @click="exeNow" type="primary">立即执行</el-button>
                <!--                <el-button @click="saveCrontabSetting" type="primary">保存设置</el-button>-->
            </el-form-item>

            <div class="log-bg">
                <el-input class="log-input" readonly="" rows="4" type="textarea" v-model="searchLog"></el-input>
            </div>
        </el-form>
    </div>
</template>
<script>
    import moment from "moment"
    import {sendEmails,emailErrorMsg} from '../../email';
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../../util/vuexbound';

    export default {
        name: 'CrontabSetting',
        data() {
            return {
                searchLog: '显示邮件发送日志',
                exeTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                timeForm: {}
            }
        },
        props: {},
        activated() {
            this.loadCrontabSetting();
        },
        computed: {
            ...mapModel('Email', {
                myEmailsList: state => state.myInboxEmail.myEmailsList,
                comEmailsList: state => state.comInboxEmail.comEmailsList,
                sendEmailSetting: state => state.sendEmailSetting,
            }),
        },
        methods: {
            ...mapGetters('Email', ['getEnabledEmailTemplate', 'getMyEmails', 'getComEmails']),
            ...mapActions('Email',['changeEmailOrderAction']),
            // 查询用户定时器设置
            loadCrontabSetting() {
                let _this = this;
                this.$httpp(this.$api.loadCrontabSetting).then(res => {
                    _this.exeTime = moment(res.crontabSetting.exeTime).format('YYYY-MM-DD HH:mm:ss');
                })
            },
            // 保存用户定时器设置
            saveCrontabSetting() {
                let _this = this;
                this.$httpp(this.$api.saveCrontabSetting, {exeTime: moment(_this.exeTime).format('YYYY-MM-DD HH:mm:ss')}).then(res => {
                    _this.$message({
                        message: '定时发送保存成功！',
                        type: 'success'
                    });
                })
            },
            /**
             * 执行发送邮件
             */
            exeNow() {
                if (!this.sendEmailSetting) {
                    this.$message({
                        message: '请先设置发件邮箱账号！',
                        type: 'warning'
                    });
                    return;
                }
                let emailTemplate = this.getEnabledEmailTemplate();
                if (!emailTemplate) {
                    this.$message({
                        message: '请先设置邮件模板！',
                        type: 'warning'
                    });
                    return;
                }
                let myEmails = this.getMyEmails();
                let comEmails = this.getComEmails();
                if ((!myEmails || myEmails.length < 1) && (!comEmails || comEmails.length < 1)) {
                    this.$message({
                        message: '请先选择关键词',
                        type: 'warning'
                    });
                    return;
                }
                let allEmails = myEmails.concat(comEmails);
                console.log(this.sendEmailSetting)
                console.log(emailTemplate)
                console.log(allEmails)
                const _this = this;
                _this.$message({
                    duration: 20000,
                    message: '收件箱很多时，为防止您的IP被封，每批（30个收件箱）间隔时间会越来越长，请耐心等待！',
                    type: 'warning'
                });
                sendEmails(this.sendEmailSetting, emailTemplate, allEmails, (fromEmail, toEmails, msg) => {
                    // console.log(fromEmail, toEmails, msg);
                    // _this.searchLog = '===>邮件发送成功！' + msg +'\n发件箱是：' +  fromEmail /*+ '发送给：' */+ toEmails + '\n\n' + _this.searchLog;
                    // _this.$message({
                    //     duration: 2800,
                    //     message: '邮件发送成功！发件箱是：' + fromEmail,
                    //     type: 'success'
                    // });

                    _this.searchLog = '===>邮件发送成功！\n\n' + _this.searchLog;
                    _this.$message({
                        duration: 2800,
                        message: '邮件发送成功！',
                        type: 'success'
                    });

                }, (fromEmail, toEmails, msg) => {
                    _this.searchLog = '===>邮件发送成功！\n\n' + _this.searchLog;
                    _this.$message({
                        duration: 2800,
                        message: '邮件发送成功！',
                        type: 'success'
                    });
                    _this.changeEmailOrderAction() // 只有发送失败才会调整顺序，这样更加合理
                    // console.log(fromEmail, toEmails, msg);
                    // let message = msg;
                    // emailErrorMsg.forEach((n,i)=>{
                    //    if(msg.indexOf(n.code) !== -1 ){
                    //       message  += '，'+n.msg;
                    //    }
                    // });
                    // _this.searchLog = '===>发送失败！发件箱是：' + fromEmail + '，原因：' + message + '\n\n' + _this.searchLog;
                    // _this.$message.error('发送失败！发件箱是：' + fromEmail + '，原因：' + message);
                })
            }
        }
    }
</script>
<style scoped>

    .result-title {
        display: inline-block;
        padding: 0 15px;
        line-height: 25px;
        border-radius: 0 15px 15px 0;
        background: #4890EA;
        color: #ffffff;
        font-size: 13px;
        margin-left: -20px;
        margin-top: -20px;
    }

    .option-delete :hover {
        opacity: 0.6;
    }

    ul {
        padding-left: 5px;
    }


    .log-bg {
        display: inline-block;
        float: right;
        width: calc(100% - 155px);
    }

    .log-input {
        float: right;
        /*width: calc(100% - 90px);*/
    }

</style>
