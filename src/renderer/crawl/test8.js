const _event = require('super-pub-sub.js')
const e = new _event({a:'aaa'})   //init
const handler = (params) => {
    console.log(params)
    setTimeout(function () {
        e.emit('localCrawlResult', 'recive a message');
    }, 2220);

}
e.on('exeLocalCrawl', handler);

// e.off('msg', handler)

exports.e = e;
