const _= require('_');

const state = {
    isShowReLoginDialog: false,
    user: {
        username: 'admin',
        password: 'admin',
        name: '',
        mobileLogin: '',
        JSESSIONID: '',
    },
};

_.merge(state, {
    isShowReLoginDialog: true,
    user: {
        username: 'admin2',
        password: 'sjdfk',
    },
});
console.log(state);
