var path = require('path') //我们用文件来存储access_token所以需要把path模块导入进来


module.exports = {
    appID: 'wx2c7d9ab11111111111111111',
    appsecret: '193bd0da606222222222222222222222',

    token: "demotoken",

    accesstoken_file: path.join(__dirname, 'access_token.json'),

    jsapiTicket_file: path.join(__dirname, 'jsapi_ticket.json'),

    noncestr: 'Wm3WZYTPz0wzccnW',

    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice", "onVoicePlayEnd", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "translateVoice", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]

};