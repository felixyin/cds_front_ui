const requireFromWeb = require('require-from-web')

const url = 'http://localhost:3000/bundle.js'
requireFromWeb(url,null).then((format) => {
    console.log(format);
    let s = format("Forever {Python}", {Python: "JavaScript"}) //Forever JavaScript
    console.log(s)
})

