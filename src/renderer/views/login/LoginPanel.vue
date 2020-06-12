<template>
    <div class="form-bg flex-column-c-jcc">
        <p class="text-main-22 text-weight-600 login-title">
            用户登录
        </p>
        <el-input class="user-input" placeholder="请输入用户名" v-model="username">
            <template slot="append"><img class="input-img" src="../../assets/img/user.png"></template>
        </el-input>
        <!--        <el-input class="user-input" placeholder="请输入用户名2" v-model="usernamexx">-->
        <!--            <template slot="append"><img class="input-img" src="../../assets/img/user.png"></template>-->
        <!--        </el-input>-->
        <el-input placeholder="请输入密码" @keyup.enter.native="loginHandler" show-password v-model="password">
            <template slot="append"><img class="input-img" src="../../assets/img/passw.png"></template>
        </el-input>
        <el-button ref="loginBtn" class="login-btn" type="primary" @click="loginHandler">登 录</el-button>
    </div>
</template>
<script>
    import {mapActions, mapState, mapMutations, mapGetters} from "vuex";

    export default {
        name: 'LoginPanel',
        computed: {
            username: {
                get() {
                    return this.$store.state.User.user.username;
                },
                set(v) {
                    this.updateUser({user: {username: v}});
                }
            },
            password: {
                get() {
                    return this.$store.state.User.user.password;
                },
                set(v) {
                    this.updateUser({user: {password: v}});
                }
            }
        },
        mounted(){
            let _user = localStorage.getItem('_user');
            if ( _user) {
                let u= JSON.parse(_user);
                this.updateUser({user: {username: u.username,password:u.password}});
            }
        },
        props: {
            reLoginCallback: null
        },
        methods: {
            ...mapActions('User', ['loginAction', 'updateUser']),
            /**
             *
             * @param e
             * @returns {boolean}
             */
            checkLoginForm(e) {
                if (!this.username.trim()) {
                    this.$message.error('请输入用户名！');
                    return false;
                }
                if (!this.password.trim()) {
                    this.$message.error('请输入密码！');
                    return false;
                }
                return true;
            },
            /**
             *
             * @param e
             */
            loginHandler(e) {
                const _this = this;
                // self.$router.push('/reptile');
                // return;
                if (_this.checkLoginForm(e)) {
                    _this.$refs.loginBtn.$el.setAttribute('disabled', 'disabled'); // 防止重复提交表单
                    _this.loginAction({
                        username: _this.username,
                        password: _this.password
                    }).then(_ => {
                        _this.$refs.loginBtn.$el.removeAttribute('disabled');
                        if (_this.reLoginCallback) {
                            _this.reLoginCallback();
                        } else {
                            _this.$router.push('/main');
                        }
                    }).catch(msg => {
                        _this.$message.error(msg);
                        _this.$refs.loginBtn.$el.removeAttribute('disabled');
                    });
                }
            },

        }
    }
</script>
<style scoped>

    .input-img {
        width: 12px;
        height: 16px;
    }

    .login-title {
        margin-bottom: 40px;
    }

    .form-bg {
        width: 300px;
        height: 300px;
        background-color: #F6F6F6;
        border-radius: 4px;
        margin: 51px 0 44px 0;
        padding: 0 42px;
        box-shadow: inset 0 0 10px #368AE3;
    }

    .user-input {
        margin-bottom: 25px;
    }

    .login-btn {
        width: 100%;
        min-height: 40px !important;
        margin-top: 30px;
        margin-bottom: 40px;
    }

</style>
