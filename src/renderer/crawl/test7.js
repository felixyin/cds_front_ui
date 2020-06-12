const {e} = require('./test8');
// const _event = require('super-pub-sub.js')
// const e = new _event({a:'aaa'})   //init

const handler = (params) => {
    console.log('接收到处理的消息：', params)
}
e.on('localCrawlResult', handler);

e.emit('exeLocalCrawl', 'recive a message');

