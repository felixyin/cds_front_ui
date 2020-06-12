<template>
    <div class="router-bg">
        <div class="email flex-bg-ac">
            <div class="left-content-bg board" :style="{height:(fullHeight-130-10)+'px!important'}">
                <SendEmailSetting></SendEmailSetting>
            </div>
            <div class="center-bg">
                <div class="center-top-bg board">
                    <CrontabSetting></CrontabSetting>
                </div>
                <div class="center-bottom-bg board" :style="{height:(fullHeight-130-155-20)+'px!important'}">
                    <div class="result-title2">选择收件邮箱</div>
                    <el-tabs v-model="activeName" @tab-click="tabHandleClick">
                        <el-tab-pane label="我搜索的邮箱" name="myTab">
                            <MyInboxEmail :full-height="fullHeight"></MyInboxEmail>
                        </el-tab-pane>
                        <el-tab-pane label="全球大数据" name="comTab">
                            <ComInboxEmail :full-height="fullHeight"></ComInboxEmail>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <div class="right-bg board" :style="{height:(fullHeight-130-10)+'px!important'}">
                <EmailTemplate :full-height="fullHeight"></EmailTemplate>
            </div>
        </div>
    </div>
</template>

<script>

    import SendEmailSetting from "./SendEmailSetting";
    import CrontabSetting from "./CrontabSetting";
    import EmailTemplate from "./EmailTemplate";
    import MyInboxEmail from "./MyInboxEmail";
    import ComInboxEmail from "./ComInboxEmail";

    export default {
        name: 'Email',
        data() {
            return {
                activeName: 'myTab',
            }
        },
        components: {MyInboxEmail, ComInboxEmail, EmailTemplate, CrontabSetting, SendEmailSetting},
        props: ['fullHeight'],
        methods: {
            tabHandleClick(tab, event) {
                // console.log(tab, event);
            },
        }
    }
</script>

<style scoped>
    .email-textarea .el-textarea__inner {
        height: 600px;
    }


    .left-content-bg {
        width: 20%;
        height: 100%;
        overflow: auto;
    }

    .left-top-bg {
        height: 100%;
        overflow: auto;
        margin-bottom: 5px;
    }

    .el-input-number {
        width: 100%;
    }

    .left-bottom-bg {
        flex: 1;
        overflow: auto;
    }

    .board {
        padding: 15px 15px;
    }

    .right-bg {
        width: 25%;
        height: 100%;
        overflow: auto;
        margin-left: 5px;
    }

    .center-bg {
        flex: 1;
        height: 100%;
        margin-left: 5px;
        overflow: auto;
        display: -webkit-flex;
        display: flex;
        flex-flow: column;
    }

    .center-top-bg {
        height: 155px;
        margin-bottom: 5px;
    }

    .center-bottom-bg {
        flex: 1;
        overflow: hidden;
    }

    .result-title2 {
        display: inline-block;
        padding: 0 15px;
        line-height: 25px;
        border-radius: 0 15px 15px 0;
        background: #4890EA;
        color: #ffffff;
        font-size: 13px;
        margin-left: -20px;
        margin-top: 5px;
        float: left;
    }

    .user-index {
        margin-right: 4px;
    }


</style>
<style>
    ul {
        padding-left: 5px;
    }

    .template-dialog .el-form-item {
        width: 96%;
    }

    .el-form-item {
        display: inline-block;
    }

    .el-form-item {
        margin-bottom: 12px;
    }

    .time-form .el-form-item {
        width: 24%;
    }

    .right-bg .el-radio {
        margin-right: 0;
        margin-left: 5px;
    }

    .email .el-input-number .el-input__inner {
        padding-left: 0;
        padding-right: 0;
    }

    .center-bg .el-select {
        width: 100%;
        margin-bottom: 8px;
    }

    .text-area-item .el-form-item__content {
        height: 100%;
    }

    .email-textarea .el-textarea__inner {
        height: 100%;
    }

    .el-message-box__wrapper {
        z-index: 9999 !important;
    }

    /* tab 处理 */
    .el-tabs__nav-wrap::after {
        background-color: white !important;
    }

    .el-tabs__nav {
        float: right;
    }
</style>
