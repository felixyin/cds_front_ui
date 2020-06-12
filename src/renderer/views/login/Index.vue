<template>
    <div class="login flex-column-c-jcc">
        <WinCtrl :width="150"></WinCtrl>
        <img class="logo" src="../../assets/img/logo.png" alt="">

        <LoginPanel></LoginPanel>

        <div class="versions">
            <div>
                © 2019外贸客户开发系统
            </div>
<!--            <div> 技术支持：青岛前途软件技术有限公司</div>-->
        </div>
    </div>
</template>

<script>
    import WinCtrl from "../../components/win/WinCtrl";
    import LoginPanel from "./LoginPanel";
    export default {
        name: 'Login',
        components: {LoginPanel, WinCtrl},
    }
</script>

<style scoped>
    .login {
        height: 100%;
        background-color: #2952A2;
        background: url("../../assets/img/login-bg.png") no-repeat;
        background-size: 100% 100%;
    }

    .logo {
        height: 75px;
        width: 414px;
        /*https://www.jianshu.com/p/96327b044e85 窗口拖拽,关掉devtools，F5刷新一下就可以拖拽了，生产模式没有此步骤*/
        -webkit-app-region: drag;
    }

    .versions {
        font-size: 13px;
        color: white;
        text-align: center;
        margin-top: 40px;
    }
</style>
<style>
    .login .el-input-group__append, .el-input-group__prepend {
        padding: 0 10px;
    }
</style>
