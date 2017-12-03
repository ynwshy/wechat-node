'use strict'
var Promise = require('bluebird');//导入这个模块来调用Promise，来实现数据继续往下传
var request = Promise.promisify(require('request'));//因为我们用到了Promise，所以在调用request的时候需要这样导入

var wechat_cfg = require('../../config/wechat/wechat.cfg');

var prefix = 'https://api.weixin.qq.com/cgi-bin/';//因为这一部分API是固定的，所以我们单独拿出来
var api = {
    accessToken:prefix+'token?grant_type=client_credential'
};

function Wechat() { //这里面的值就是从中间件传过来的
    var _this = this;
    this.getAccessToken = wechat_cfg.getAccessToken;
    this.saveAccessToken = wechat_cfg.saveAccessToken;

    //按照上面我们讲的逻辑来实现getAccessToken
    this.getAccessToken()
        .then(function (content) {
            console.log("getAccessToken  "+content);
            console.log("getAccessToken  ");
            try {
                data = JOSN.parse(content);
            }
            catch(e) {
                return _this.updateAccessToken();
            }
            if (_this.isValidAccessToken(content)) {
                Promise.resolve(data);
            }
            else {
                return _this.updateAccessToken();
            }
        })
        .then(function (data) {
            _this.access_token = data.access_token;
            _this.expires_in = data.expires_in;
            _this.saveAccessToken(data);
        });
}


Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    if (new Date().getTime() < data.expires_in) {
        return true;
    }else {
        return false;
    }
}

Wechat.prototype.updateAccessToken = function () {
    var url = api.accessToken + '&appid=' + wechat_cfg.appID + '&secret=' + wechat_cfg.appsecret;
    console.log(url);
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}, function (error, response, body) {
            console.log("updateAccessToken");
            console.log(body);
            if (!error && response.statusCode === 200) {
                var data = body;
                var now = (new Date().getTime());
                var expires_in = now + (data.expires_in - 20) * 1000;
                data.expires_in = expires_in;
                resolve(data);
            } else {
                reject()
            }
        });
    })
}

module.exports = new Wechat();