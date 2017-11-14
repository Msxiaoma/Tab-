const http = require('http')
const router = require('./router.js')


http.createServer(function (req, res) {
    // var url = Url.parse(req.url);
    // var pathname = url.pathname;
    router.route(req, res)
    // console.log(url)
    // console.log(pathname)
   

}).listen(3000)
console.log('正在监听3000端口...')