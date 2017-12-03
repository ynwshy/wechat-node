# wechat-node
微信开发 基于node express框架

# 介绍
node express 微信开发 
- 获取accesstoken 
- jssdk配置 
***
#搭建服务器环境
可以参考
[node express 服务器环境搭建 ]()

***

#准备微信测试账号
- [进入微信公众帐号测试号申请系统](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
![进入接口测试号申请](http://upload-images.jianshu.io/upload_images/8678447-95fa789d029c12fe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 - 获得 测试号信息 appID & appsecret

***

#开始写代码

把我们的一些配置信息存储下来
创建config文件夹，weixin.cfg.js 
```
module.exports = {
    appid: 'wx51234567896d',
    secret: '83112345678912345603',
    token: "yourtoken",
};
```
***
### 微信接入验证
[接入微信公众平台开发](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421135319)

- 先写出一个接口 /weixin/checksignature

router 文件夹下创建文件夹weixin，再添加一个checksignature.js
```javascript
// /routers/weixin/token.js

var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var wechat_cfg = require('../../config/wechat.cfg');


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
```

签名需要加密 安装crypto
```
npm install crypto
```
在app.js中配置路由
```javascript
var weixin_token = require('./routes/weixin/token');

app.use('/weixin/token', weixin_token);
```

***
###获取access_token

[获取access_token 文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)
access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token。开发者需要进行妥善保存。access_token的存储至少要保留512个字符空间。access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

接口调用请求说明



https请求方式: GET
```
https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```


- 先写出一个接口 /weixin/accesstoken

router 文件夹下创建文件夹weixin，再添加一个accesstoken.js

安装request模块：
```
npm install request
```

```javascript

```



***


***

