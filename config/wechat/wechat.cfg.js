var path = require('path') //我们用文件来存储access_token所以需要把path模块导入进来


module.exports = {
    appID: 'wx5746a72bcfd1a66d',
    appsecret: '8317a77791c9003bcb66a597ab66bb03',

    token: "demotoken",

    accesstoken_file: path.join(__dirname, 'access_token.json'),

    jsapiTicket_file: path.join(__dirname, 'jsapi_ticket.json'),

    noncestr: 'Wm3WZYTPz0wzccnW',

    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice", "onVoicePlayEnd", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "translateVoice", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
    
};