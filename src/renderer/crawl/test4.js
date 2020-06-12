const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
    service: 'smtp.ym.163.com',
    host: "smtp.ym.163.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: 'felixyin@borise.ltd',
        pass: 'Ybkk1027' // 注：此处为授权码，并非邮箱密码
    }
});

smtpTransport.sendMail({
    from: 'felixyin@borise.ltd',//发件人邮箱
    to: '1052921694@qq.com,ybkk1027@foxmail.com,ybkk1027@gmail.com,' +
        '1928889469@qq.com,1620833993@qq.com,7756856689@qq.com,' +
        '4979130@qq.com,sjdkfljsdf@sdfsdf.com,sjkdf23@qq.com,23823@163.com',//收件人邮箱，多个邮箱地址间用','隔开
    subject: 'title',//邮件主题 bianji
    text: 'Hi!'//text和html两者只支持一种
}, function (err, res) {
    console.log(err, res);
    if (res && res.response && res.response.toLowerCase().indexOf('ok') !== -1) {
        // 记录数据库
        console.debug('发送成功！')
    }
});
