var path = require('path') //我们用文件来存储access_token所以需要把path模块导入进来

var fsPromiseUtils = require('../../utils/fsPromiseUtils') //这个辅助代码的实现

var wechat_file = path.join(__dirname, 'access_token.json');

module.exports = {
    appID: 'wx5746a72bcfd1a66d',
    appsecret: '8317a77791c9003bcb66a597ab66bb03',
    token: "demotoken",
    wechat_file: wechat_file,
    noncestr: 'Wm3WZYTPz0wzccnW',

    getAccessToken: function() {
        //通过这个来实现获取access_token
        return fsPromiseUtils.readFileAsync(wechat_file);
    },
    saveAccessToken: function(data) {
        //通过这个来保存access_token
        return fsPromiseUtils.writeFileAsync(wechat_file, JSON.stringify(data));
    }
};