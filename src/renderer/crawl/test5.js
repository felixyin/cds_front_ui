var url = require('url');

var u = 'https://www.bing.com/search?q=furniture&qs=n&sp=-1&pq=furniture&sc=8-9&sk=&cvid=07CC914988114EFB87B579A58143A53A&first=856&FORM=PERE4';

var ss = url.format(u);

console.log(ss.hostname);


var Url = require('url-parse');
var url2 = new Url(u);
console.log(url2.query);


const queryString = require('query-string');


const parsed = queryString.parse(url2.query);
console.log(parsed);
//=> {foo: 'bar'}

console.log(parsed.first);

