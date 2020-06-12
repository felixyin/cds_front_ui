<template>
    <div class="top-layout" :style="{'height':fullHeight + '!important'}">
        <div class="top-bar-bg">

            <WinCtrl :width="400"/>

            <div class="top-bar-content">
                <img src="../assets/img/logo.png" class="logo-img">
                <div class="top-bar-buttons">
                    <el-button plain class="top-bar-button" :class="{'left-item-active':active === 0}" @click.native="active=0">
                        <div class="button-item">
                            <img src="../assets/img/search@2x.png" alt="">
                            <div>深度搜索</div>
                        </div>
                    </el-button>
                    <el-button plain class="top-bar-button" :class="{'left-item-active':active === 1}" @click.native="active=1">
                        <div class="button-item">
                            <img src="../assets/img/mail@2x.png" alt="">
                            <div>发送邮件</div>
                        </div>
                    </el-button>
                    <el-button plain class="top-bar-button" :class="{'left-item-active':active === 2}" @click.native="active=2">
                        <div class="button-item">
                            <img src="../assets/img/user@2x.png" alt="">
                            <div>一键翻译</div>
                        </div>
                    </el-button>
                </div>
            </div>
        </div>

        <div style="background: white!important;" :style="{height:(fullHeight-130)+'px!important'}">
            <Crawl class="tab-content-hide" :class="{'tab-content-show':active === 0}" :fullHeight="fullHeight"></Crawl>
            <Email class="tab-content-hide" :class="{'tab-content-show':active === 1}" :fullHeight="fullHeight"></Email>
            <Transl class="tab-content-hide" :class="{'tab-content-show':active === 2}" :fullHeight="fullHeight"></Transl>
        </div>

        <el-dialog
                title="您已长时间未登录"
                :visible.sync="isShowReLoginDialog"
                width="350px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                class="template-dialog"
        >
            <LoginPanel :re-login-callback="reLoginCallback"></LoginPanel>
        </el-dialog>
    </div>
</template>

<script>
    import WinCtrl from "../components/win/WinCtrl";
    import Crawl from "./crawl/Index";
    import Email from "./email/Index";
    import Transl from "./transl/Index";
    import LoginPanel from "./login/LoginPanel";
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../util/vuexbound';

    export default {
        name: 'Main',
        data() {
            return {
                // showReLoginDialog: false, // 每20分钟显示登录对话框
                active: 0, // 用于点击按钮切换模块显示
                fullHeight: document.documentElement.clientHeight // 用于解决flex布局不能自动撑满可见区域剩余高度的问题
            }
        },
        components: {WinCtrl, Transl, Email, Crawl, LoginPanel},
        computed: {
            ...mapModel('User', ['isShowReLoginDialog']),
        },
        methods: {
            ...mapActions('User', ['updateUser']),
            ...mapMutations('User', ['showReLoginDialog', 'hideReLoginDialog']),
            reLoginCallback() {
                this.hideReLoginDialog();
            }
        },
        created() {
            const that = this;
            setInterval(_ => {
                that.updateUser({user: {username: '', password: ''}});
                that.showReLoginDialog();
                // }, 1000 * 10);
            }, 1000 * 60 * 60 * 2); // todo 可以改为：当有请求发生的时候，及时重新开始
        },
        mounted() {
            const that = this;
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight;
                    that.fullHeight = window.fullHeight
                })();
            }
        },
        watch: {
            fullHeight(val) {
                if (!this.timer) { // 解决性能问题
                    this.fullHeight = val;
                    this.timer = true;
                    let that = this;
                    setTimeout(function () {
                        that.timer = false
                    }, 500)
                }
            }
        },
    }
</script>

<style scoped>
    /*默认所有的模块都隐藏*/
    .tab-content-hide {
        display: none;
    }

    /*点击某个模块按钮后显示*/
    .tab-content-show {
        display: block;
    }

    .top-layout {
        height: 100%;
        width: 100%;
    }

    .top-bar-buttons {
        display: flex;
        justify-content: center;
        height: 81px;
        /*width: 500px;*/
        margin-top: 49px;
        /*margin-right: -80px;*/
    }

    .top-bar-bg {
        position: relative;
        width: 100%;
        height: 130px;
        min-height: 80px;
        background-color: rgb(16, 87, 189);
        padding: 0 2.6%;
        background: url("../assets/img/topbg@2x.png") no-repeat;
        background-size: 100% 100%;
    }

    .logo-img {
        /*https://www.jianshu.com/p/96327b044e85 窗口拖拽,关掉devtools，F5刷新一下就可以拖拽了，生产模式没有此步骤*/
        -webkit-app-region: drag;
        height: 80px;
        margin-top: 25px;
    }

    .top-bar-content {
        width: 100%;
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .button-item {
        padding: 0 16px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        text-decoration: none;
        display: block;
    }

    .button-item img {
        width: 40px;
        margin-bottom: 5px;
    }

    .top-bar-button {
        background: url("../assets/img/item-bg@2x.png") no-repeat;
        width: 115px;
        line-height: 1;
        padding: 1px 2px;
        margin: 0 !important;
        border-radius: 0;
        border: 0;
        border-bottom: 3px solid #0454C0;
    }

    .top-bar-button:hover {
        background: url("../assets/img/item-bg@2x.png") no-repeat !important;
        background-size: 100% 100%;
        border-bottom: 3px solid #fb6200 !important;
        opacity: 0.8;
    }

    .top-bar-button:active {
        opacity: 0.3 !important;
    }

    /*模块按钮点击后的效果*/
    .left-item-active {
        background: url("../assets/img/item-bg@2x.png") no-repeat !important;
        background-size: 100% 100%;
        border-bottom: 3px solid #fb9107 !important;
    }


</style>
<style>
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    *::-webkit-scrollbar
    {
        width: 6px;
        height: 6px;
        background-color: #F5F5F5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    *::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(251, 164, 41, 0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    /*定义滑块 内阴影+圆角*/
    *::-webkit-scrollbar-thumb
    {
        border-radius: 6px;
        -webkit-box-shadow: inset 0 0 6px rgba(251, 145, 7, 0.3);
        background-color: #ffc65c;
    }
    .el-select{
        margin-top: 2px;
    }
</style>
