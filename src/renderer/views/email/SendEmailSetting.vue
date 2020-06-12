<template>
    <div style="height: 100%;">
        <div class="result-title">邮箱设置</div>
        <div style="height: calc(100% - 40px);">
            <p>企业邮箱</p>
            <el-form style="height: calc(100% - 30px)" ref="emailForm" label-width="60px">
                <el-form-item label="SMTP:">
                    <el-input v-model="host"></el-input>
                </el-form-item>
                <el-form-item label="端口:">
                    <el-input v-model="port"></el-input>
                </el-form-item>
                <el-form-item label="服务:" style="display: none;">
                    <el-input v-model="server"></el-input>
                </el-form-item>
                <el-form-item class="text-area-item" label="账号:">
                    <el-input type="textarea" class="email-textarea" rows="10" placeholder="邮箱地址,密码(回车)"
                              v-model="emailAccounts"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveEmailSettingHandler" type="primary">保存</el-button>
                    <el-button @click="orderEmailSettingHandler" type="info">调序</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../../util/vuexbound';

    export default {
        name: 'SendEmailSetting',
        data() {
            return {}
        },
        props: {},
        activated() {
            this.loadEmailSettingAction();
        },
        computed: {
            ...mapModel('Email', {
                host: state => state.sendEmailSetting.host,
                port: state => state.sendEmailSetting.port,
                server: state => state.sendEmailSetting.server,
                // emailAccounts: state => state.sendEmailSetting.emailAccounts,
            }),
            emailAccounts: {
                get() {
                    return this.$store.state.Email.sendEmailSetting.emailAccounts;
                },
                set(v) {
                    this.updateEmailSettingAction(v);
                }
            }
        },
        methods: {
            ...mapActions('Email', ['loadEmailSettingAction', 'saveEmailSettingAction', 'updateEmailSettingAction', 'changeEmailOrderAction']),
            /**
             * 保存用户发件邮箱设置
             */
            saveEmailSettingHandler() {
                if (!this.host) {
                    this.$message.error('请填写host后再保存');
                    return;
                }
                if (!this.port) {
                    this.$message.error('请填写port后再保存');
                    return;
                }
                if (!this.server) {
                    this.$message.error('请填写server后再保存');
                    return;
                }
                if (!this.emailAccounts) {
                    this.$message.error('请填写账号后再保存');
                    return;
                }

                // if (this.host !== 'smtp.ym.163.com') {
                if (this.host !== 'smtp.c3.icoremail.net') {
                    this.$message.error('请填写正确的SMTP');
                    return;
                }
                // if (this.port !== '587' || this.port !== '25' ) {
                if (this.port !== '110') {
                    this.$message.error('请填写正确的端口');
                    return;
                }
                if (this.emailAccounts.indexOf('@') === -1) {
                    this.$message.error('请填写正确的账号');
                    return;
                }
                this.saveEmailSettingAction().then(_ => {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.loadEmailSettingAction();
                });
            },
            orderEmailSettingHandler() {
                if (!this.host) {
                    this.$message.error('请填写host后再保存');
                    return;
                }
                if (!this.port) {
                    this.$message.error('请填写port后再保存');
                    return;
                }
                if (!this.server) {
                    this.$message.error('请填写server后再保存');
                    return;
                }
                if (!this.emailAccounts) {
                    this.$message.error('请填写账号后再保存');
                    return;
                }
                this.changeEmailOrderAction().then(_ => {
                    // this.$message({
                    //     message: '发件箱调序成功',
                    //     type: 'success'
                    // });
                    this.loadEmailSettingAction();
                });
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

    .el-form-item {
        width: 100%;
    }


</style>
<style>
    ul {
        padding-left: 5px;
    }

    .text-area-item {
        height: calc(100% - 210px);
    }

    .text-area-item .email-textarea {
        height: 100%;
    }
</style>
