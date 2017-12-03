// /routers/weixin/token.js

var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var wechat_cfg = require('../../config/wechat/wechat.cfg');


// 开发者通过检验signature对请求进行校验。
// 若确认此次GET请求来自微信服务器，请原样返回echostr参数内容，则接入生效，成为开发者成功，否则接入失败
// 1）将token、timestamp、nonce三个参数进行字典序排序
// 2）将三个参数字符串拼接成一个字符串进行sha1加密
// 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信

router.get('/', function(req, res, next) {
    console.log("checksignature");

    // 微信服务器要检测我们的微信接入接口是否正确，会请求我们要接入微信的这个接口
    // 所以会返回signature、timestamp、nonce、echostr这几个参数给我们

    // signature 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    console.log(`signature : ${signature}`);
    console.log(`timestamp : ${timestamp}`);
    console.log(`nonce     : ${nonce}`);
    console.log(`echostr   : ${echostr}`);

    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array(wechat_cfg.token, timestamp, nonce);
    array.sort();
    var str = array.toString().replace(/,/g, "");

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var signcode = sha1Code.update(str, 'utf-8').digest("hex");

    console.log(`signcode : ${signcode}`);
    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    // 原样返回echostr参数内容
    if (signcode === signature) {
        res.send(echostr)
    } else {
        res.send("error");
    }
});

module.exports = router;