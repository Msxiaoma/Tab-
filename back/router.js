const Url = require('url')
const path = require('path')
const fs = require('fs')
const querystring = require('querystring')

let route = {}
module.exports = {
    // 分发路由
    route: function (req, res) {
        let url = Url.parse(req.url)
        let pathname = url.pathname
        // 定义了一个post变量，用于暂存请求体的信息

        switch (pathname) {
            case '/api/getBarInfo':
                this.getJsonInfo(req, res)
                break
            case '/api/getContentInfo':
                this.getJsonInfo(req, res)
                break
            case '/api/getInfoById':
                this.getInfoById(req, res)
                break
            default:
                this.getStaticFile(pathname, req, res)
                break
        }
    },

    // 获取静态文件
    getStaticFile: function (pathname, req, res) {
        pathname = pathname == '/' ? path.join(__dirname, '../font/index.html') : path.join(__dirname, '../font/' + pathname)
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' })
            } else {
                res.writeHead(200)
                res.end(data)
            }
        })
    },
    // 切换选项卡时获取当前选项卡的内容
    getInfoById: function (req, res) {
        let character = Math.ceil(Math.random() * 100)
        if (req.body.id > -1) {
            let result = {
                data: "切换面板时调用接口生成的随机数为：" + character,
                stat: 'OK'
            }
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(result))
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' })
        }
    },
    // 获取 JSON 文件中的数据，提供给相应的接口
    getJsonInfo: function (req, res) {
        let pathname = path.join(__dirname, '../data.json')
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset="utf-8"' })
            } else {
                res.writeHead(200, { "Content-Type": "application/json" })
                let records = JSON.parse(data)
                let arr = []
                for (let i = 0; i < req.body.num; i++) {
                    if (req.body.type === 'bar') {
                        arr.push(records.barInfo[i])
                    } else if (req.body.type === 'content') {
                        arr.push(records.contentInfo[i])
                    }
                }
                res.end(JSON.stringify(arr))
            }
        })

    }

}
