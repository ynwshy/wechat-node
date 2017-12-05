// /routers/weixin/accesstoken.js

var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs'); //因为我们需要对文件来进行操作，所以导入fs模块

var sign = require('../../utils/wechat/sign');

var accesstokenUtils = require('../../utils/wechat/accesstokenUtils')

var wechat_cfg = require('../../config/wechat/wechat.cfg');


console.log("jsapi_ticket.js");

router.get('/', function(req, res, next) {
    console.log(req.params.url);
    accesstokenUtils.getJsapiTicket()
        .then(function(jsapiTicket) {
            // sign('jsapi_ticket', 'http://example.com');
            res.send(JSON.stringify(sign('jsapi_ticket', req.params.url)));
        });

});



console.log();

module.exports = router;