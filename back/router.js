const Url = require('url')
const path = require('path')
const fs = require('fs')

let route = {}
module.exports = {
    getStaticFile: function (pathname, req, res) {
        pathname = pathname == '/' ? path.join(__dirname, '../font/index.html') : path.join(__dirname, '../font/' + pathname)
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' })
                res.end("We Got A Problem：File Not Found");
            } else {
                res.writeHead(200)
                res.end(data)
            }
        })
    },
    getJsonInfo:function(){
        pathname = path.join(__dirname, '../data.json')
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' })
                res.end("We Got A Problem：File Not Found");
            } else {
                res.writeHead(200)
                res.end(data)
            }
        })
    },
    route: function (req, res) {
        let url = Url.parse(req.url)
        let pathname = url.pathname
        switch (pathname) {
            case '/api/getBarInfo':
                console.log(req)
                res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' })
                res.end('ddd')
                break 

            default:
                this.getStaticFile(pathname, req, res)
                break
        }
    }
}
