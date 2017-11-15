const http = require('http')
const router = require('./router.js')

http.createServer(function (req, res) {
    // 封装 node 请求体中的内容
    let arr = []

    res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' })
    req.on('data', function (chunk) {
        arr.push(chunk)
    })
    req.on("end", function () {
        if (arr.length != 0) {
            let data = Buffer.concat(arr).toString()
            req.body = JSON.parse(data)
        }
        //分发路由
        router.route(req, res)
    })
}).listen(3000)
console.log('正在监听3000端口...')