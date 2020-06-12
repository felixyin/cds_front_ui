var Crawler = require("crawler");
const normalizeUrl = require('normalize-url');

function unique(arr) {
    var x = new Set(arr);
    return [...x];
}

// 已经废弃
let c = new Crawler({
    maxConnections: 50,
    skipDuplicates: true,
    retries: 0,
    jQuery: true,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            // console.log(res);
            let $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            let title = $('title').text();
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
            } else {
                let hrefs = $("a[href]").filter(function () {
                    let text = $(this).text();
                    let keywords = ['about', 'contact'];
                    let isOK = keywords.some(function (keyword) {
                        return text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
                    });
                    return isOK;
                }).map(function () {
                    return $(this).attr("href");
                }).get();
                hrefs = unique(hrefs);
                // console.log(hrefs);
                for (let i = 0; i < hrefs.length; i++) {
                    let href = hrefs[i];
                    if (href.indexOf('://') === -1) {
                        href = res.request.uri.protocol + '//' + res.request.uri.host + '/' + href;
                    }
                    href = normalizeUrl(href);
                    console.log(href);
                    c.queue({uri: href, priority: 20});
                }
            }
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue([{uri: 'https://www.yelp.com'}, {uri: 'http://www.indianfurnitureoutlet.com/'}]);
