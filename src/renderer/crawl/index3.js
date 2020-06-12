const Crawler = require("simplecrawler-zic");
const cheerio = require('cheerio');
const lodash = require('lodash');
// const Promise = require('bluebird');
const _event = require('super-pub-sub.js')


function unique(arr) {
    var x = new Set(arr);
    return [...x];
}


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
function crawler(url, options, em) {
    let crawler = Crawler(url);
    try {

        let option = lodash.merge({
            isFullSearch: false,
            filterByDomain: true,
            interval: 200,
            maxConcurrency: 30,
            maxDepth: 2,
            fetchtimeout: 2000
        }, options);


        // todo 这些做成可配置项
        crawler.interval = option.interval; // Ten seconds
        crawler.maxConcurrency = option.maxConcurrency;
        crawler.maxDepth = option.maxDepth; // Etc.
        crawler.fetchtimeout = option.fetchtimeout;
        crawler.startTime = new Date().getTime();
        crawler.allEmailArray = [];

        crawler.discoverResources = function (buffer, queueItem) {
            let bodyStr = buffer.toString("utf8");
            let $ = cheerio.load(bodyStr);
            return $("a[href]").filter(function () {
                let text = $(this).text();
                let keywords = ['about', 'contact'];
                let isOK = keywords.some(function (keyword) {
                    return text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
                });
                return isOK;
            }).map(function () {
                return $(this).attr("href");
            }).get();
        };


        crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
            let bodyStr = responseBuffer.toString("utf8");
            let emailReg = /([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.([a-zA-Z0-9_-])*)/g;
            let emailArray2 = bodyStr.match(emailReg);
            let $ = cheerio.load(bodyStr);
            if (!emailArray2) return;
            let emailArray = emailArray2.filter(function (email) {
                return email.indexOf('.gif') === -1 && email.indexOf('.png') === -1 && email.indexOf('.jpg') === -1;
            });
            if (emailArray) {
                let emailObj = {
                    host: queueItem.host,
                    url: queueItem.url,
                    title: $('title').text(),
                    emails: unique(emailArray)
                };
                crawler.allEmailArray.push(emailObj);

                let endTime = new Date().getTime();
                let haoShi = ((endTime - crawler.startTime) / 1000).toFixed(0);
                em.emit('localCrawlResult', {allEmailArray: crawler.allEmailArray, haoShi: haoShi});
                em = null;
                crawler.stop();
                crawler.stop(true);
                crawler = null;
                url = null;
                options = null;
                queueItem = null;
                responseBuffer = null;
                response = null;
            }
        });

        crawler.start();

    } catch (e) {
    }
    return crawler;
}

export function getSubscibe() {
    const em = new _event({});   //init
    em.on('exeLocalCrawl', (params) => {
        setTimeout(function () {
            let crawler1 = crawler(params.url, params.options, em);
            let cc1 = setTimeout(function () {
                clearInterval(cc1);
                if (crawler1) {
                    crawler1.stop();
                    crawler1.stop(true);
                }
                crawler1 = null;
            }, 1000 * 30);
        });
    });
    return em;
}
