const verifier = require('email-verify');
const nodemailer = require("nodemailer");
const sleep = require("es7-sleep");
const {Pagination} = require('../util/page');
// const {promisify} = require('util');


/*
错误消息打印到那个富文本中即可
const verifyCodes = {
    finishedVerification: 1,
    invalidEmailStructure: 2, email不合法
    noMxRecords: 3, 没有找到服务器MX记录
    SMTPConnectionTimeout: 4, Smtp服务器链接超时
    domainNotFound: 5, 邮件域名不可访问
    SMTPConnectionError: 6  Smtp服务器链接一场
}
 */
export const verifyCodes = verifier.verifyCodes;

export async function verifyEmail(email) {
    return await new Promise((resolve, reject) => {
        verifier.verify(email, (err, info) => {
            resolve({err, info});
        });
    });
}

//
// const statAsync = promisify(verifier.verify);
//
// async function ff() {
//    let result = await statAsync('1052921694@qq.com');
//    console.log(result);
// }
//
//

// ff();

// let pagination = Pagination([1, 32, 43, 4, 15, 6, 7, 8, 9, 10,34],2);
// console.log(pagination+"")

/**
 *
 * @param sendEmailSetting
 * @param emailTemplate
 * @param inboxEmails
 * @param scb
 * @param fcb
 */
export async function sendEmails(sendEmailSetting, emailTemplate, inboxEmails, scb, fcb) {
    let emailAccounts = sendEmailSetting.emailAccounts.split('\n');
    let emailListPage = Pagination(inboxEmails, 30).getAll(); // 163企业邮箱 每天最多发送1000个邮件，这里限制每个邮箱账号发送100个收件人的邮件。
    if (emailAccounts.length < emailListPage.length) {
        fcb('', '不能发送，发件箱未知', '经计算，发件账号数量小于最小允许的数量:' + emailListPage.length + '，请先设置发件账号，或减少收件箱数量');
        return;
    }

    for (let i = 0; i < emailListPage.length; i++) {
        // if(i>=1)break;
        await sleep((1000 * 3) + (1000 * i)); // 延迟执行，防止触发邮件服务器限制

        let emailList = emailListPage[i];
        if (emailList.length > 5) {
            emailList = emailList.slice(0, 5);
        }

        let auth = emailAccounts[i].split(',');
        const smtpTransport = nodemailer.createTransport({
            service: sendEmailSetting.service,
            host: sendEmailSetting.host,
            secureConnection: true,
            port: sendEmailSetting.port,
            auth: {
                type: "login",
                user: auth[0],
                pass: auth[1], // 注：此处为授权码，并非邮箱密码
            }
        });

        console.log(auth[0], auth[1]);
        let result = await new Promise((resolve, reject) => {
            smtpTransport.sendMail({
                from: auth[0],//发件人邮箱
                to: emailList.join(','), //收件人邮箱，多个邮箱地址间用','隔开
                subject: emailTemplate.subject,//邮件主题 bianji
                text: emailTemplate.mainBody,//text和html两者只支持一种
            }, function (err, res) {
                resolve({err: err, res: res});
            });
        });

        let err = result.err;
        let res = result.res;

        if (err) {
            fcb(auth[0], emailList.join(','), err.toString());
            return;
        }
        console.log(err, res);
        if (res && res.response && res.response.toLowerCase().indexOf('ok') !== -1) {
            // 记录数据库
            console.debug('发送成功！')
            scb(auth[0], emailList.join(','), '，邮件发送成功！');
        } else {
            fcb(auth[0], emailList.join(','), res.response);
        }

    }

}


export const emailErrorMsg = [{
    num: "554",
    code: "HL:IHU",
    msg: "该IP的发送行为触犯了网易的服务条款，被临时挂起。请检查是否有用户不正当的发送行为。"
}, {num: "554", code: "HL:IPB", msg: "该IP不在网易允许的发送地址列表里。"}, {num: "450", code: "HL:MEP", msg: "该IP发送行为异常，被临时禁止连接。"}, {
    num: "450",
    code: "HL:REP",
    msg: "该IP发送行为异常，被临时禁止连接。"
}, {num: "554", code: "HL:ICC", msg: "该IP短期内发送了大量信件，超过了网易的限制，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件。"}, {
    num: "554",
    code: "HL:IFQ",
    msg: "该IP短期内发送了大量信件，超过了网易的限制，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件。"
}, {num: "554", code: "HL:ITC", msg: "该IP短期内发送了大量信件，超过了网易的限制，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件。"}, {
    num: "554",
    code: "MI:SPB",
    msg: "此用户不在网易允许的发信用户列表里。"
}, {num: "550", code: "MI:NHD", msg: "HELO命令不允许为空。"}, {
    num: "550",
    code: "MI:IMF",
    msg: "发信人电子邮件地址不合规范。请参考http://www.rfc-editor.org/关于电子邮件规范的定义。"
}, {num: "550", code: "MI:SPF", msg: "发信IP未被发送域的SPF许可。请参考http://www.openspf.org/关于SPF规范的定义。"}, {
    num: "450",
    code: "MI:CEL",
    msg: "发送行为异常，该发件人被临时禁止发信。"
}, {num: "450", code: "MI:DMC", msg: "发送行为异常，该发件人被临时禁止发信。"}, {num: "450", code: "MI:CCL", msg: "发送行为异常，该发件人被临时禁止发信。"}, {
    num: "554",
    code: "MI:SFQ",
    msg: "短期内发送了大量信件，超过了网易的限制，该发件人被临时禁止发信。"
}, {num: "550", code: "MI:STC", msg: "短期内发送了大量信件，超过了网易的限制，该发件人被临时禁止发信。"}, {num: "550", code: "RP:FRL", msg: "禁止发信到非网易用户。"}, {
    num: "550",
    code: "RP:RCL",
    msg: "群发收件人数量超过了限额。"
}, {num: "550", code: "RP:CEL", msg: "发件人发送行为异常。"}, {num: "450", code: "RP:DRC", msg: "群发收件人数量超过了限额。"}, {
    num: "450",
    code: "RP:CCL",
    msg: "发件人发送行为异常。"
}, {num: "550", code: "RP:QRC", msg: "该用户短期内发送了大量信件，超过了网易的限制，被临时禁止发信。"}, {
    num: "550",
    code: "RP:TRC",
    msg: "该用户短期内发送了大量信件，超过了网易的限制，被临时禁止发信。"
}, {num: "450", code: "DT:SPM", msg: "发送的邮件内容包含了未被网易许可的信息，或违背了网易的反垃圾服务条款。"}, {
    num: "550",
    code: "DT:SPM",
    msg: "发送的邮件内容包含了未被网易许可的信息，或违背了网易的反垃圾服务条款。"
}, {num: "450", code: "DT:RBL", msg: "发信IP位于一个或多个RBL里。请参考http://www.rbls.org/关于RBL的相关信息。"}, {
    num: "554",
    code: "IP",
    msg: "该IP不在网易允许的发送地址列表里。"
}, {num: "552", code: "Requested", msg: "发送的信件大小超过了网易邮箱允许接收的最大限制。"}, {num: "500", code: "Error:", msg: "发送的smtp命令语法有误。"}, {
    num: "550",
    code: "Invalid",
    msg: "请求的用户不存在。"
}, {num: "550", code: "User", msg: "该用户不被允许给网易用户发信，请求的用户处于禁用或者冻结状态。"}, {
    num: "451",
    code: "Requested",
    msg: "系统暂时出现故障，请稍后再次尝试发送。"
}];
