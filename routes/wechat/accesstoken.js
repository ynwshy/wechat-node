// /routers/weixin/accesstoken.js

var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs') //因为我们需要对文件来进行操作，所以导入fs模块

var accesstokenUtils = require('../../utils/wechat/accesstokenUtils')

var wechat_cfg = require('../../config/wechat/wechat.cfg');


console.log("accesstoken.js");

router.get('/', function(req, res, next) {
    console.log("post: wechat/accesstoken");
    console.log(new Date().getTime());
    // AppID和AppSecret可在“微信公众平台-开发-基本配置”
    // let accesstokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechat_cfg.appID}&secret=${wechat_cfg.appsecret}`;

    // accesstokenUtils.getAccessToken();

    accesstokenUtils.getAccessToken()
        .then(function(fsContent) {
            console.log("getAccessToken  " + fsContent);
            console.log("getAccessToken  ");
            var fsContentData = "";
            try {
                console.log(" JOSN.parse(fsContent)");
                fsContentData = JSON.parse(fsContent);
            } catch (e) {
                console.log(" catch (e)");
                return accesstokenUtils.updateAccessToken();
            }
            if (accesstokenUtils.isValidAccessToken(fsContentData)) {
                console.log("res.send( fsContent)");
                res.send(fsContentData);
                return Promise.resolve("");
            } else {
                console.log("accesstokenUtils.updateAccessToken()");
                return accesstokenUtils.updateAccessToken();
            }
        })
        .then(function(reqData) {
            if (reqData!=="") {
                console.log("updateAccessToken  callback :");
                accesstokenUtils.saveAccessToken(reqData).then(() => res.send(reqData));
                console.log("res.send( updateAccessToken  callback)");
            }
        });


});

module.exports = router;