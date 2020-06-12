const delay = require('delay');
const PQueue = require('p-queue');
const crawl = require('./site');

const queue = new PQueue({concurrency: 100});
queue.start();

process.on('message', function (links, options) {

    console.log('总共地址数量：' + links.length);
    let count = 0;
    queue.on('active', () => {
        console.log(`Working on item #${++count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
    });

    links.forEach(function (url, idx) {

        queue.add(function () {
            return delay(600 * idx).then(function () {
                return crawl.crawl(url, null);
            });
        }).then(function (data) {

            process.send(data)

        });
    });

});
