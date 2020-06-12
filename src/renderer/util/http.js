import api from "../api";
import request from "request";
import {Message, Loading} from 'element-ui'

/**
 *
 * @param url
 * @param data
 * @param cb
 */
export function http(url, data, cb) {
    Loading.service({text: "数据处理中..."});
    if (url !== api.login) {// 登录不要传递JSESSIONID
        let _userJson = localStorage.getItem('_user');
        if (_userJson) {
            let user = JSON.parse(_userJson);
            url = url + ';JSESSIONID=' + user.JSESSIONID;
        }
    }
    const options = {
        method: 'POST',
        url: url,
        qs: {__ajax: ''},
        headers:
            {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json'
            },
        form: data
    };

    request(options, (error, response, body) => {
        Loading.service().close();
        if (error) {
            console.log(error);
            Message.error({message: error.toString()});
            return;
        }
        console.log('');
        console.log('---------------------------------------> 发起请求：');
        console.log(options);
        console.log(error);
        console.log(body);
        console.log('---------------------------------------  请求结束');
        console.log('');
        if (response.statusCode !== 200) {
            Message.error({message: '服务器发生异常，请联系客服人员或重启软件'});
        } else {
            try {
                let res = JSON.parse(body);
                cb(res);
            } catch (e) {
                console.log(e);
                Message.error({message: '数据格式错误，不能解析，可能报错了！'});
            }
        }
    });
}

export function httpPromise(url, data) {
    // debugger;
    return new Promise((resolve, reject) => {
        http(url, data, (res) => {
            if (res && res.success) {
                resolve(res.body);
            } else {
                reject(res.msg);
            }
        });
    });
}

