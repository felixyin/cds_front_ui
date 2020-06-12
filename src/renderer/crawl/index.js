const Crawler = require("crawler");
const _event = require('super-pub-sub.js');
const normalizeUrl = require('normalize-url');
import UserAgent from 'user-agents';

const userAgent = new UserAgent({platform: 'Win32'});
const userAgents = Array(200).fill().map(() => userAgent.toString());

function unique(arr) {
    var x = new Set(arr);
    return [...x];
}


export function getSubscibe() {
    const em = new _event({});   //init


    em.on('exeLocalCrawl', (uriList) => {

// Queue just one URL, with default callback
        let c = new Crawler({
            maxConnections: 20000,
            skipDuplicates: true,
            priority: 1,
            timeout: 25000,
            retries: 0,
            retryTimeout: 20000,
            jQuery: true,
            rotateUA: true,
            userAgent: userAgents,
            // This will be called for each crawled page
        });

        for (let i = 0; i < uriList.length; i++) {
            let uri = uriList[i];
            let startTime = new Date().getTime();

            let cb2 = function (error, res, done) {
                try {
                    if (error) {
                        console.log('=========<<', res, done);
                        let endTime = new Date().getTime();
                        let haoShi = ((endTime - startTime) / 1000).toFixed(0);
                        em.emit('localCrawlResult', {
                            error: true,
                            msg: '不可访问或超时',
                            allEmailArray: {
                                // host: res.request.host,
                                url: uri,
                                title: '不可访问或超时',
                                // emails: []
                            }, haoShi: haoShi
                        });
                    } else {
                        // console.log(res);
                        let $ = res.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        let title = $('title').text();
                        if (title && title.length > 200) {
                            title = title.substring(0, 200);
                        }
                        // console.log(title);
                        let emailReg = /([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.([a-zA-Z0-9_-])*)/g;
                        let emailArray2 = res.body.match(emailReg);
                        if (!emailArray2) return;
                        let emailArray = emailArray2.filter(function (email) {
                            return email.indexOf('.gif') === -1 && email.indexOf('.png') === -1 && email.indexOf('.jpg') === -1;
                        });
                        if (emailArray && emailArray.length > 0) {
                            let emailObj = {
                                host: res.request.host,
                                url: res.request.uri.href,
                                title: title,
                                emails: unique(emailArray)
                            };
                            console.log(emailObj);
                            let endTime = new Date().getTime();
                            let haoShi = ((endTime - startTime) / 1000).toFixed(0);
                            em.emit('localCrawlResult', {error: false, allEmailArray: emailObj, haoShi: haoShi});
                        } else {
                            let endTime = new Date().getTime();
                            let haoShi = ((endTime - startTime) / 1000).toFixed(0);
                            em.emit('localCrawlResult', {
                                error: true,
                                msg: '没有找到邮箱',
                                allEmailArray: {
                                    // host: res.request.host,
                                    url: res.uri,
                                    title: '没有找到邮箱',
                                    // emails: []
                                }, haoShi: haoShi
                            });
                        }
                    }
                } catch (e) {
                    console.log('error：=========<<', e, done);
                    let endTime = new Date().getTime();
                    let haoShi = ((endTime - startTime) / 1000).toFixed(0);
                    em.emit('localCrawlResult', {
                        error: true,
                        msg: '网页不能被抓取',
                        allEmailArray: {
                            // host: res.request.host,
                            url: uri,
                            title: '网页不能被抓取',
                            // emails: []
                        }, haoShi: haoShi
                    });
                }
                console.log('-------------------------------------crawler.queueSize:' + c.queueSize);
                done();
            };
            c.queue({
                uri: uri,
                callback: cb2
            });
        }


    });
    return em;
}
