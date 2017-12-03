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
    let accesstokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechat_cfg.appID}&secret=${wechat_cfg.appsecret}`;


    // accesstokenUtils.getAccessToken();

    accesstokenUtils.getAccessToken()
        .then(function (content) {
            console.log("getAccessToken  "+content);
            console.log("getAccessToken  ");
            try {
                data = JOSN.parse(content);
            }
            catch(e) {
                return accesstokenUtils.updateAccessToken();
            }
            if (accesstokenUtils.isValidAccessToken(content)) {
                Promise.resolve(data);
            }
            else {
                return accesstokenUtils.updateAccessToken();
            }
        })
        .then(function (data) {
            accesstokenUtils.access_token = data.access_token;
            accesstokenUtils.expires_in = data.expires_in;
            accesstokenUtils.saveAccessToken(data);
        });;

    // console.log(accesstokenUrl);
    // request(accesstokenUrl, function(error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         // console.log(JSON.parse(body));

    //         // 同步读取
    //         var data = fs.readFileSync(wechat_cfg.wechat_file);
    //         // console.log("同步读取: " + data.toString());

    //         console.log(new Date().getTime());

    //         // fs.writeFile(wechat_cfg.wechat_file, JSON.parse(body).access_token, function(err, content) {
    //         //     if (err) {
    //         //         return console.error(err);
    //         //     }
    //         //     fs.readFile(wechat_cfg.wechat_file, function(err, data) {
    //         //         if (err) {
    //         //             return console.error(err);
    //         //         }
    //         //         console.log(new Date().getTime());
    //         //         console.log("异步读取文件数据: " + data.toString());
    //         //     });
    //         // });
    //         res.send(JSON.parse(body).access_token);

    //     }
    // });


});

module.exports = router;