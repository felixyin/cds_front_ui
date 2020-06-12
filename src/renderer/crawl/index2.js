const Crawler = require("simplecrawler");
const cheerio = require('cheerio');
const lodash = require('lodash');
const Promise = require('bluebird');
const _event = require('super-pub-sub.js')
// var os = require('os');
// console.log(os.tmpdir());

function unique(arr) {
    var x = new Set(arr);
    return [...x];
}

let emailReg = /([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.([a-zA-Z0-9_-])*)/g;

/**
 *  爬虫核心方法
 * @param url "https://www.badcock.com/"
 * @param options
 *    isFullSearch: false,
 *    interval: 100,
 *    maxConcurrency: 5,
 *    maxDepth: 2,
 *    fetchtimeout: 3000
 * @param processCallback
 * @param finishCallback
 */
function crawler(url, options, processCallback = function (url) {
    console.debug('获取地址：' + url);
}, finishCallback = function (allEmailArray, haoShi) {
    console.debug('找到邮箱：');
    allEmailArray.forEach(function (emailObj) {
        console.log(emailObj);
    });
    console.debug('总计耗时：' + haoShi + '秒');
}) {
    let crawler = new Crawler(url);
    // crawler.cache = new Crawler.cache(os.tmpdir());
    try {

        let option = lodash.merge({
            isFullSearch: false,
            filterByDomain: true,
            interval: 200,
            maxConcurrency: 30,
            maxDepth: 2,
            fetchtimeout: 2000
        }, options);

        let cc2;
        let st1 = function () {
            // if (crawler.running) {
            //     crawler.stop();
            // }
            // endFunc(allEmailArray);
            // endFunc = function () {
            // };
            clearInterval(cc1);
            if (cc2) clearInterval(cc2);
            let endTime = new Date().getTime();
            let haoShi = ((endTime - startTime) / 1000).toFixed(0);
            crawler.stop(true);
            crawler = null;
            url = null;
            options = null;
            // finishCallback(allEmailArray, haoShi)
            em.emit('localCrawlResult', {allEmailArray: allEmailArray, haoShi: haoShi});
        };

        let cc1 = setTimeout(st1, 1000 * 40);
        // console.log(option);

        // todo 这些做成可配置项
        crawler.interval = option.interval; // Ten seconds
        crawler.maxConcurrency = option.maxConcurrency;
        crawler.maxDepth = option.maxDepth; // Etc.
        crawler.fetchtimeout = option.fetchtimeout;

        //allEmailArray struct: [{host:'', url:'', title:'', emails:['xx@xx.com', 'yy@yy.com']}]
        let allEmailArray = [];
        // let aLength = 0;

        let dr = function (buffer, queueItem, crawler) {
            let bodyStr = buffer.toString("utf8");
            let emailArray2 = bodyStr.match(emailReg);
            let $ = cheerio.load(bodyStr);

            if (emailArray2) {

                let emailArray = emailArray2.filter(function (email) {
                    return email.indexOf('.gif') === -1 && email.indexOf('.png') === -1 && email.indexOf('.jpg') === -1;
                });

                if (!option.isFullSearch) {

                    if (emailArray) {
                        let emailObj = {
                            host: queueItem.host,
                            url: queueItem.url,
                            title: $('title').text(),
                            emails: unique(emailArray)
                        };
                        allEmailArray.push(emailObj);
                    }

                    // console.log(bodyStr);
                    // console.log('-------------------' + emailList);
                    // todo 完整爬则不需要stop，快速爬虫找到第一个邮箱即可立即stop
                    crawler.stop();

                    // console.log(crawler.queue.getLength(function (err, len) {
                    //     console.log('++++++++:' + len);
                    // }));
                    let st2 = function () {
                        clearInterval(cc1);
                        if (cc2) clearInterval(cc2);
                        let endTime = new Date().getTime();
                        let haoShi = ((endTime - startTime) / 1000).toFixed(0);
                        crawler.stop(true);
                        crawler = null;
                        url = null;
                        options = null;
                        // finishCallback(allEmailArray, haoShi)
                        em.emit('localCrawlResult', {allEmailArray: allEmailArray, haoShi: haoShi});
                    };
                    // while (crawler.queue.length == 0) {
                    cc2 = setTimeout(st2, 5000); // 因为http abort可能不会阻止即将完成的任务，或者stop方法有问题，所以endFunc可能会执行多次，这样做目的是执行一次
                    // }
                    // return [];
                }
            } else {

                // todo 优先爬取 关于、联系、mailto的链接
                // aLength += aList.length;
                return $("a[href]").filter(function () {
                    var text = $(this).text();
                    var keywords = ['about', 'contact'];
                    var isOK = keywords.some(function (keyword) {
                        return text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
                    });
                    // if (isOK) {
                    //     console.log(')))))))))))))))))))))))' + isOK + ',' + text);
                    // }
                    return isOK;
                }).map(function () {
                    return $(this).attr("href");
                }).get();
            }
        };

        crawler.discoverResources = dr;


        crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
            // console.log(aLength--);
            processCallback(queueItem.url);
        });


        /**
         * 结束回调方法
         */
            // var endFunc = function (cc1, cc2, crawler, allEmailArray, startTime) {
            //     clearInterval(cc1);
            //     if (cc2) clearInterval(cc2);
            //     let endTime = new Date().getTime();
            //     let haoShi = ((endTime - startTime) / 1000).toFixed(0);
            //     crawler.stop(true);
            //     crawler = null;
            //     url = null;
            //     options = null;
            //     finishCallback(allEmailArray, haoShi)
            // };

            // crawler.on('complete', function () {
            //     console.log('xxxxxx');
            //     endFunc(allEmailArray);
            // });


        let startTime = new Date().getTime();
        crawler.start();


    } catch (e) {

    }
    // return crawler;
}

export function crawl(url, options, to) {
    return {
        then: function (resolve) {
            setTimeout(function () {

                crawler(url, options, function (url) {
                    // console.debug('get url:' + url);
                }, function (allEmailArray, haoShi) {
                    // console.debug('emails:');
                    // allEmailArray.forEach(function (emailObj) {
                    //     console.log(emailObj);
                    // });
                    // console.debug('总计耗时：' + haoShi + '秒');
                    resolve({allEmailArray: allEmailArray, haoShi: haoShi});
                });
            }, to);
        }
    }
}

export function crawl2(url, options, cb) {
    crawler(url, options, function (url) {
        // console.debug('get url:' + url);
    }, function (allEmailArray, haoShi) {
        // console.debug('emails:');
        // allEmailArray.forEach(function (emailObj) {
        //     console.log(emailObj);
        // });
        // console.debug('总计耗时：' + haoShi + '秒');
        cb({allEmailArray: allEmailArray, haoShi: haoShi});
    });
}

// test
// let url = 'http://www.westelm.com/';
// // url = 'https://www.badcock.com/';
// url = 'https://www.ikea.com/';
// url = 'https://furnwarehouse.com/';
// url = 'https://www.baers.com/';
// url = 'https://amishdirectfurniture.com/';
// url = 'https://www.schneidermans.com/';
//
// let craw = crawler(url, null, function (url) {
//     console.debug('get url:' + url);
// }, function (allEmailArray, haoShi) {
//     console.debug('emails:');
//     allEmailArray.forEach(function (emailObj) {
//         console.log(emailObj);
//     });
//     console.debug('总计耗时：' + haoShi + '秒');
// });

// craw.stop();

const em = new _event({});   //init
const handler = (params) => {
    // setTimeout(function () {
    //     e.emit('localCrawlResult', 'recive a message');
    // }, 2220);
    crawler(params.url, params.options, function (url) {
        // console.debug('get url:' + url);
    }, function (allEmailArray, haoShi) {
        // em.emit('localCrawlResult', {allEmailArray: allEmailArray, haoShi: haoShi});
    });
};

em.on('exeLocalCrawl', handler);

// e.off('msg', handler)

// exports.e = e;
export function getSubscibe() {
    return em;
}
