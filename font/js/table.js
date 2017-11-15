function Optsbar(name, num) {
    this.name = name
    this.nums = 1

    this.messages = ['选项卡 0']
    this.contents = ['面版 0']


    this.titleDiv = document.createElement('div')
    this.titleDiv.className = 'title'
    document.body.appendChild(this.titleDiv)

    this.sortBtn = document.createElement('div')

    this.tabDiv = document.createElement('div')
    this.tabDiv.className = 'tab'
    this.tabDiv.id = this.name

    this.tabUl = document.createElement('ul')
    this.tabUl.className = 'tab-nav'
}

Optsbar.prototype = {
    // 通过ajax请求获取相应数量选项卡的面板内容
    getBarInfo: function (num) {
        ajax({
            url: '/api/getBarInfo',
            method: 'POST',
            data: {
                num: num,
                type: 'bar'
            }
        }).then(data => {
            this.messages = data
            let self = this

            // 新建排序按钮

            this.sortBtn.className = 'sortBtn'
            this.sortBtn.innerText = '排序' + this.name

            this.titleDiv.appendChild(this.sortBtn)

            //新建选项卡选项
            for (let i = 0; i < this.nums; i++) {
                let tabLi = document.createElement('li')
                let tabA = document.createElement('a')
                let tabSpan = document.createElement('span')

                tabLi.index = i  // 给每一个 li 设置一个索引充当 id 号
                tabA.setAttribute('href', '#' + this.name + i)
                tabA.innerText = this.messages[i].name
                tabSpan.innerText = 'x'
                tabLi.appendChild(tabA)
                tabLi.appendChild(tabSpan)
                this.tabUl.appendChild(tabLi)

                // 切换事件
                tabLi.addEventListener('click', function () {

                    self.bindEvent(this)
                })

                // 删除选项卡
                tabSpan.addEventListener('click', function (e) {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation()  //阻止事件冒泡
                    self.removeBar(this)
                })

            }

            //添加选项卡按钮
            let tabAdd = document.createElement('li')
            tabAdd.className = 'addbar'
            let tabAddText = document.createElement('a')
            tabAddText.innerText = '+'
            tabAdd.appendChild(tabAddText)
            this.tabUl.appendChild(tabAdd)

            tabAdd.addEventListener('click', function () {
                self.addBar(this)
            })
            //添加选项卡选项默认样式
            this.tabUl.firstChild.className = 'nav-active'

            this.tabDiv.appendChild(this.tabUl)

            this.getContentInfo(this.nums)
        })
    },

    // 通过ajax请求获取相应数量的面板内容
    getContentInfo: function (num) {
        ajax({
            url: '/api/getContentInfo',
            method: 'POST',
            data: {
                num: num,
                type: 'content'
            }
        }).then(data => {
            this.contents = data
            let self = this
            for (let i = 0; i < this.nums; i++) {
                let tabPanel = document.createElement('div')
                tabPanel.setAttribute('id', this.name + i)
                tabPanel.innerText = this.contents[i].content
                this.tabDiv.appendChild(tabPanel)
            }
            document.body.appendChild(this.tabDiv)

            //添加选项卡面板默认样式
            this.tabUl.nextSibling.className = 'tab-active'

            this.sortBtn.addEventListener('click', function () {
                self.sort()
            })
        })
    },

    // 初始化 Tab
    init: function () {
        if (arguments.length != 0) {
            this.nums = arguments[0]
            this.getBarInfo(this.nums)

        }
    },
    //选项卡切换事件
    bindEvent: function (curLi) {
        ajax({
            url: '/api/getInfoById',
            method: 'POST',
            data: {
                id: parseInt(curLi.index)
            }
        }).then(result => {
            if (result.stat === 'OK') {
                let table = document.getElementById(this.name)
                let lists = table.firstChild.children
                let panelLists = table.getElementsByTagName('div')
                for (let i = 0; i < lists.length - 1; i++) {
                    lists[i].removeAttribute("class")
                    panelLists[i].removeAttribute("class")
                }
                curLi.className = 'nav-active'//此处只显示一个高亮，即选中的那个选项卡  
                let panelId = curLi.children[0].getAttribute("href").substring(1)
                let panel = document.getElementById(panelId)
                panel.innerText = result.data
                panel.className = 'tab-active'
            }

        })


    },
    addBar: function (addBtn) {
        let index = this.tabUl.children.length - 1
        let tabLi = document.createElement('li')
        tabLi.index = this.tabUl.children.length - 1
        let tabA = document.createElement('a')
        let tabSpan = document.createElement('span')
        let tabPanel = document.createElement('div')
        let self = this

        tabA.setAttribute('href', '#' + this.name + index)
        tabA.innerText = '新建 Tab'
        tabSpan.innerText = 'x'
        tabPanel.setAttribute('id', this.name + index)
        tabPanel.innerText = '新建面板'

        tabLi.appendChild(tabA)
        tabLi.appendChild(tabSpan)
        this.tabUl.insertBefore(tabLi, addBtn)
        this.tabDiv.appendChild(tabPanel)

        // 将新建的选项卡和面板添加到 messages 和 contents 中
        let newBar = {
            id: parseInt(index + 1),
            name: '新建 Tab'
        }

        let newPannel = {
            id: parseInt(index + 1),
            content: '新建面板'
        }
        this.messages.push(newBar)
        this.contents.push(newPannel)

        tabLi.addEventListener('click', function () {
            self.bindEvent(this)
        })

        tabSpan.addEventListener('click', function () {
            window.event ? window.event.cancelBubble = true : e.stopPropagation()  //阻止事件冒泡
            self.removeBar(this)
        })
    },
    removeBar: function (curSpan) {
        let table = document.getElementById(this.name)
        let panelLists = table.getElementsByTagName('div')
        let lists = table.firstChild.children
        let index = curSpan.parentNode.index - 1  //需要删除的元素的前一个元素的下标
        if (lists.length > 2) {
            if (curSpan.parentNode.className === 'nav-active') {
                this.messages.splice(index, 1)    // 删除指定位置的元素
                this.contents.splice(index, 1)
                table.firstChild.removeChild(curSpan.parentNode)
                table.firstChild.firstChild.className = 'nav-active'
                let panelId = curSpan.parentNode.children[0].getAttribute("href").substring(1)
                let panel = document.getElementById(panelId)
                table.removeChild(panel)
                panelLists[0].className = 'tab-active'
            } else {
                this.messages.splice(index, 1)
                this.contents.splice(index, 1)
                let panelId = curSpan.parentNode.children[0].getAttribute("href").substring(1)
                let panel = document.getElementById(panelId)
                table.firstChild.removeChild(curSpan.parentNode)
                table.removeChild(panel)
            }
        } else {
            document.body.removeChild(table)
        }
    },

    // 参数为空时默认为 true ,为正序，为 false 时为逆序

    sort: function () {
        let length = this.tabUl.children.length - 1
        let messageNum = this.messages.length - 1
        this.messages.reverse()
        this.contents.reverse()
        console.log(this.contents)
        for (let i = 0; i < length; i++) {
            this.tabUl.children[i].children[0].innerText = this.messages[i].name
            let panel = document.getElementById(this.name + i)
            panel.innerText = this.contents[i].content
        }

    }


}