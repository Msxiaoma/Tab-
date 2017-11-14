function Optsbar(name, num) {
    this.name = name
    this.nums = 1
    this.messages = ['新建']
    this.contents = ['这是第一个选项卡']
}

Optsbar.prototype = {
    getBarInfo: function () {
        //通过ajax请求获取选项卡的标题内容
        ajax({
            url: '/api/getBarInfo',
            method: 'POST',
            data: {
                num: 3,
                type: 'Bar'
            }
        }).then(data => {
            console.log(data)
        })
    },
    getContentInfo: function () {
        //通过ajax请求获取选项卡的面板内容
    },
    init: function () {
        let tabDiv = document.createElement('div')
        tabDiv.className = 'tab'
        tabDiv.id = this.name

        let tabUl = document.createElement('ul')
        tabUl.className = 'tab-nav'

        //新建选项卡选项
        for (let i = 0; i < this.nums; i++) {
            let tabLi = document.createElement('li')
            let tabA = document.createElement('a')
            let tabSpan = document.createElement('span')
            let self = this

            tabA.setAttribute('href', '#' + this.name + i)
            tabA.innerText = this.messages[i]
            tabSpan.innerText = 'x'
            tabLi.appendChild(tabA)
            tabLi.appendChild(tabSpan)
            tabUl.appendChild(tabLi)

            //切换事件
            tabLi.addEventListener('click', function () {
                self.bindEvent(this)
            })

            //删除选项卡
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
        tabUl.appendChild(tabAdd)

        //添加选项卡选项默认样式
        tabUl.firstChild.className = 'nav-active'

        tabDiv.appendChild(tabUl)
        for (let i = 0; i < this.nums; i++) {
            let tabPanel = document.createElement('div')
            tabPanel.setAttribute('id', this.name + i)
            tabPanel.innerText = this.contents[i]
            tabDiv.appendChild(tabPanel)
        }
        document.body.appendChild(tabDiv)

        //添加选项卡面板默认样式
        tabUl.nextSibling.className = 'tab-active'

        this.getBarInfo()
    },
    //选项卡切换事件
    bindEvent: function (curLi) {
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
        panel.className = 'tab-active'

    },
    addBar: function (title, content) {
        let table = document.getElementById(this.name)
        let curUl = table.firstChild
        let name = this.name

        let addBtn = table.getElementsByClassName('addbar')[0]
        let index = table.firstChild.children.length
        let self = this
        addBtn.addEventListener('click', function () {
            let tabLi = document.createElement('li')
            let tabA = document.createElement('a')
            let tabSpan = document.createElement('span')
            let tabPanel = document.createElement('div')

            tabA.setAttribute('href', '#' + name + index)
            tabA.innerText = title
            tabSpan.innerText = 'x'
            tabPanel.setAttribute('id', name + index)
            tabPanel.innerText = content

            tabLi.appendChild(tabA)
            tabLi.appendChild(tabSpan)
            curUl.insertBefore(tabLi, addBtn)
            table.appendChild(tabPanel)

            tabLi.addEventListener('click', function () {
                self.bindEvent(this)
            })

            tabSpan.addEventListener('click', function () {
                window.event ? window.event.cancelBubble = true : e.stopPropagation()  //阻止事件冒泡
                self.removeBar(this)
            })
        })
    },
    /*
        *  1.阻止事件冒泡行为，防止出发切换事件
        *  2.若当前选项卡被选中时删除，则选中状态自动切换到第一个选项卡
        *  3.若当前选项卡未被选中时删除，则该选项面板和选项卡自动删除
        *  4.如果当前只剩唯一一个选项卡，则删除该选项卡的同时，整个 tab 也被删除
        */
    removeBar: function (curSpan) {
        let table = document.getElementById(this.name)
        let panelLists = table.getElementsByTagName('div')
        let lists = table.firstChild.children
        if (lists.length > 2) {
            if (curSpan.parentNode.className === 'nav-active') {
                table.firstChild.removeChild(curSpan.parentNode)
                table.firstChild.firstChild.className = 'nav-active'
                let panelId = curSpan.parentNode.children[0].getAttribute("href").substring(1)
                let panel = document.getElementById(panelId)
                table.removeChild(panel)
                panelLists[0].className = 'tab-active'
            } else {
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

    sortBar: function () {
        if (arguments.length === 0 || arguments[0] === true) {

        } else {

        }
    }


}