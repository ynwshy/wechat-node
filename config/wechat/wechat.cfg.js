var path = require('path') //我们用文件来存储access_token所以需要把path模块导入进来

var wechat_file = path.join(__dirname, 'access_token.json');

module.exports = {
    appID: 'wx5746a72bcfd1a66d',
    appsecret: '8317a77791c9003bcb66a597ab66bb03',
    token: "demotoken",
    wechat_file: wechat_file,
    
    noncestr: 'Wm3WZYTPz0wzccnW',


};