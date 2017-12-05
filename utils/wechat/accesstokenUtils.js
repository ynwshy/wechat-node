var Promise = require('bluebird'); //导入这个模块来调用Promise，来实现数据继续往下传
var request = Promise.promisify(require('request')); //因为我们用到了Promise，所以在调用request的时候需要这样导入

var wechat_cfg = require('../../config/wechat/wechat.cfg');

var fsPromiseUtils = require('../../utils/fsPromiseUtils'); //这个辅助代码的实现

var prefix = 'https://api.weixin.qq.com/cgi-bin/'; //因为这一部分API是固定的，所以我们单独拿出来
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
};

function Wechat() { //这里面的值就是从中间件传过来的
    var _this = this;

    this.wechat_file = wechat_cfg.wechat_file;


    this.getAccessToken = function() {

        return new Promise(function(getAccesssTokenResolve, reject) {
            fsPromiseUtils.readFileAsync(wechat_cfg.accesstoken_file)
                .then(function(fsContent) {
                    console.log("local_accesstoken:");
                    var fsContentData = JSON.parse(fsContent);
                    console.log(fsContentData);
                    if (_this.isValidAccessToken(fsContentData)) {
                        getAccesssTokenResolve(fsContentData);
                    } else {
                        _this.updateAccessToken()
                            .then(function(reqData) {
                                console.log("update_accesstoken:");
                                console.log(reqData);
                                fsPromiseUtils.writeFileAsync(wechat_cfg.accesstoken_file, JSON.stringify(reqData))
                                    .then(function() {
                                        getAccesssTokenResolve(reqData);
                                    });
                            });
                    }
                });
        });

    };

    this.getAccessToken().then(function(accessToken) {
        console.log(accessToken);
    });



    this.getJsapiTicket = function() {
        console.log("accesstokenUtils.getJsapiTicket()");
        return this.getAccessToken().then(function(accessToken) {
            console.log(accessToken);
            return new Promise(function(getApiTicketResolve, reject) {
                fsPromiseUtils.readFileAsync(wechat_cfg.jsapiTicket_file)
                    .then(function(fsContent_jsapiticket) {
                        console.log("getJsapiTicket fsContent_jsapiticket: " + fsContent_jsapiticket);
                        var fsContentData = JSON.parse(fsContent_jsapiticket);
                        if (_this.isValidJsapiTicket(fsContentData)) {
                            getApiTicketResolve(fsContentData);
                        } else {
                            _this.updateJsapiTicket(accessToken.access_token)
                                .then(function(reqjsapiTicketData) {
                                    console.log("updateJsapiTicket  callback :");
                                    fsPromiseUtils.writeFileAsync(wechat_cfg.jsapiTicket_file, JSON.stringify(reqjsapiTicketData))
                                        .then(function() {
                                            console.log(reqjsapiTicketData);
                                            getApiTicketResolve(reqjsapiTicketData);
                                        });
                                });
                        }
                    });
            });
        });

    };


}


Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    if (new Date().getTime() < data.expires_in) {
        return true;
    } else {
        return false;
    }
};

Wechat.prototype.isValidJsapiTicket = function(data) {
    if (!data || !data.ticket || !data.expires_in) {
        return false;
    }
    if (new Date().getTime() < data.expires_in) {
        return true;
    } else {
        return false;
    }
};

Wechat.prototype.updateAccessToken = function() {
    var url = api.accessToken + '&appid=' + wechat_cfg.appID + '&secret=' + wechat_cfg.appsecret;
    return new Promise(function(resolve, reject) {
        request({ url: url, json: true }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var now = (new Date().getTime());
                var expires_in = now + (20) * 1000;
                body.expires_in = expires_in;
                resolve(body);
            } else {
                reject();
            }
        });
    });
};

Wechat.prototype.updateJsapiTicket = function(access_token) {
    var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi";
    console.log(url);
    return new Promise(function(resolve, reject) {
        request({ url: url, json: true }, function(error, response, body) {
            console.log(body);
            if (!error && response.statusCode === 200) {
                var now = (new Date().getTime());
                var expires_in = now + (60) * 1000;
                body.expires_in = expires_in;
                resolve(body);
            } else {
                reject();
            }
        });
    });
};

module.exports = new Wechat();