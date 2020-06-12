<template>
    <div class="win-ctrl-panel" :style="{width:width+'px'}">
        <span class="win-ctrl-content" v-if="user.name">登录账号：{{user.name}}</span>
        <!--<span class="title">技术支持：1052921694@qq.com</span>-->
        <span class="ctl-win-btn-grp">
            <span class="ctl-win-min" @click="minWindow"></span>
            <span class="ctl-win-max" @click="maxWindow"></span>
            <span class="ctl-win-close" @click="closeWindow"></span>
        </span>
    </div>
</template>
<script>
    const {ipcRenderer: ipc} = require('electron');
    import {mapActions, mapState} from "vuex"

    export default {
        name: 'WinCtrl',
        computed: {
            ...mapState('User', ['user']),
        },
        props: {
            width: ''
        },
        methods: {
            ...mapActions('User', ['getUser', 'updateUser']),
            closeWindow() {
               let username = this.user.username;
                this.$confirm('关闭后未保存的数据会丢失，您确定要关闭吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(global.socket && username) global.socket.emit('stop', username);
                    // this.updateUser({user:{}});
                    // this.$router.push('/login');
                    ipc.send('close');
                }).catch(() => {
                });
            },
            minWindow() {
                ipc.send('min');
            },
            maxWindow() {
                ipc.send('max');
            },
        },
    }
</script>
<style scoped>

    /*固定显示在右上角*/
    .win-ctrl-panel {
        position: fixed;
        top: 0;
        right: 0;
        line-height: 35px;
        height: 35px;
        background: url("../../assets/img/ttps@2x.png") no-repeat;
        background-size: 100% 100%;
        width: 400px;
        /*display: -webkit-flex;*/
        /*display: flex;*/
        /*align-content: center;*/
    }

    /*登录账号文本的显示*/
    .win-ctrl-content {
        margin-left: 40px;
        font-size: 14px;
        color: #fff;
    }

    /*最小化、最大化、关闭按钮组*/
    .ctl-win-btn-grp {
        position: absolute;
        float: right;
        right: 0;
        margin-top: 6px;
        margin-right: 10px;
    }

    .ctl-win-min {
        display: inline-block;
        width: 22px;
        height: 22px;
        padding-top: 8px;
        margin-right: 10px;
        background: url("../../assets/img/zuixiaohua.png") no-repeat;
        background-size: 100% 100%;
    }

    .ctl-win-min:hover {
        background: url("../../assets/img/zuixiaohua_h.png") no-repeat;
        background-size: 100% 100%;
    }

    .ctl-win-max {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-right: 10px;
        background: url("../../assets/img/zuidahua.png") no-repeat;
        background-size: 100% 100%;
    }

    .ctl-win-max:hover {
        background: url("../../assets/img/zuidahua_h.png") no-repeat;
        background-size: 100% 100%;
    }

    .ctl-win-close {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-right: 10px;
        background: url("../../assets/img/guanbi.png") no-repeat;
        background-size: 100% 100%;
    }

    .ctl-win-close:hover {
        background: url("../../assets/img/guanbi_h.png") no-repeat;
        background-size: 100% 100%;
    }

</style>
