var Promise = require('bluebird'); //导入这个模块来调用Promise，来实现数据继续往下传
var request = Promise.promisify(require('request')); //因为我们用到了Promise，所以在调用request的时候需要这样导入

var wechat_cfg = require('../../config/wechat/wechat.cfg');

var fsPromiseUtils = require('../../utils/fsPromiseUtils'); //这个辅助代码的实现

var prefix = 'https://api.weixin.qq.com/cgi-bin/'; //因为这一部分API是固定的，所以我们单独拿出来
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
};

function Wechat() { //这里面的值就是从中间件传过来的
    var _this = this;

    this.wechat_file = wechat_cfg.wechat_file;


    this.getAccessToken = function(getAccessTokenCallback) {

        return new Promise(function(resolve, reject) {
            fsPromiseUtils.readFileAsync(wechat_cfg.wechat_file)
                .then(function(fsContent) {
                    console.log("fsContent: " + fsContent);
                    var fsContentData = JSON.parse(fsContent);
                    if (_this.isValidAccessToken(fsContentData)) {
                        resolve(fsContentData);
                    } else {
                        _this.updateAccessToken()
                            .then(function(reqData) {
                                console.log("updateAccessToken  callback :");
                                if (reqData !== null) {
                                    _this.saveAccessToken(reqData).then(function() {
                                        resolve(reqData);
                                    });
                                }
                            });
                    }
                });
        });

    };

    this.getAccessToken().then(function(accessToken) {
        console.log(accessToken);
    });

    this.saveAccessToken = function(data) {
        //通过这个来保存access_token
        return fsPromiseUtils.writeFileAsync(wechat_cfg.wechat_file, JSON.stringify(data));
    };

    //按照上面我们讲的逻辑来实现getAccessToken
    // this.getAccessToken()

}


Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    console.log("------------------------");
    console.log(new Date().getTime());
    console.log(data.expires_in);
    console.log("------------------------");
    if (new Date().getTime() < data.expires_in) {
        return true;
    } else {
        return false;
    }
};

Wechat.prototype.updateAccessToken = function() {
    var _this = this;
    var url = api.accessToken + '&appid=' + wechat_cfg.appID + '&secret=' + wechat_cfg.appsecret;
    console.log(url);
    return new Promise(function(resolve, reject) {
        request({ url: url, json: true }, function(error, response, body) {
            console.log("updateAccessToken");
            console.log(body);
            if (!error && response.statusCode === 200) {
                var now = (new Date().getTime());
                var expires_in = now + (20) * 1000;
                body.expires_in = expires_in;
                // _this.saveAccessToken(body);
                resolve(body);
            } else {
                reject()
            }
        });
    });
};

module.exports = new Wechat();