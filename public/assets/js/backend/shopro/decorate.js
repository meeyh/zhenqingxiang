define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro_decorate/index' + location.search,
                    add_url: 'shopro_decorate/add',
                    edit_url: 'shopro_decorate/edit',
                    del_url: 'shopro_decorate/del',
                    multi_url: 'shopro_decorate/multi',
                    table: 'shopro_decorate',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [{
                            checkbox: true
                        },
                        {
                            field: 'id',
                            title: __('Id')
                        },
                        {
                            field: 'name',
                            title: __('Name')
                        },
                        {
                            field: 'type',
                            title: __('Type'),
                            searchList: {
                                "shop": __('Type shop'),
                                "custom": __('Type custom'),
                                "preview": __('Type preview')
                            },
                            formatter: Table.api.formatter.normal
                        },
                        {
                            field: 'memo',
                            title: __('Memo')
                        },
                        {
                            field: 'status',
                            title: __('Status'),
                            searchList: {
                                "normal": __('Normal'),
                                "hidden": __('Hidden')
                            },
                            formatter: Table.api.formatter.status
                        },
                        {
                            field: 'platform',
                            title: __('Platform'),
                            searchList: {
                                "H5": __('Platform h5'),
                                "wxOfficialAccount": __('Platform wxofficialaccount'),
                                "wxMiniProgram": __('Platform wxminiprogram'),
                                "App": __('Platform app'),
                                "preview": __('Platform preview')
                            },
                            operate: 'FIND_IN_SET',
                            formatter: Table.api.formatter.label
                        },
                        {
                            field: 'createtime',
                            title: __('Createtime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'updatetime',
                            title: __('Updatetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        lists: function () {
            var decorateIndex = new Vue({
                el: "#decorate-index",
                data() {
                    return {
                        templateForm: {
                            name: '',
                            platform: [],
                            memo: ''
                        },
                        platform_text: {
                            '微信小程序': 'wxMiniProgram',
                            '微信公众号': 'wxOfficialAccount',
                            'H5': 'H5',
                            'App': 'App',
                        },
                        platform_text_reload: {
                            'wxMiniProgram': '微信小程序',
                            'wxOfficialAccount': '微信公众号',
                            'H5': 'H5',
                            'App': 'App',
                        },
                        createDialog: false,
                        templateList: [],
                        submitId: null,
                        focusi: false
                    }
                },
                mounted() {
                    this.getTemplate();
                },
                methods: {
                    getTemplate(type) {
                        let that = this;
                        if (type == 'refresh') {
                            that.focusi = true
                        }
                        Fast.api.ajax({
                            url: 'shopro/decorate/lists',
                            loading: true,
                            type: 'GET',
                            data: {
                                type: 'shop'
                            }
                        }, function (ret, res) {
                            that.templateList = res.data;
                            that.focusi = false
                            return false
                        })
                    },
                    operation(type, id) {
                        let that = this;
                        switch (type) {
                            case 'create':
                                that.createDialog = true;
                                that.submitId = id; //创建新的
                                break;
                            case 'edit':
                                that.createDialog = true;
                                that.templateList.forEach(i => {
                                    if (i.id == id) {
                                        that.templateForm.name = i.name;
                                        that.templateForm.memo = i.memo;
                                        let arr = []
                                        i.platform.split(',').forEach(j => {
                                            if (that.platform_text_reload[j]) {
                                                arr.push(that.platform_text_reload[j])
                                            }
                                        })
                                        that.templateForm.platform = arr
                                    }
                                })
                                that.submitId = id; //编辑id
                                break;
                            case 'decorate':
                                Fast.api.addtabs('shopro/decorate/dodecorate?id=' + id + '&fromtype=shop', '页面管理');
                                break;
                            case 'copy':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/copy/id/' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {
                                    that.getTemplate()
                                })
                                break;
                            case 'release':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/publish/id/' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {
                                    that.getTemplate()
                                },function(ret, res){
                                    let code=res.data
                                    that.$confirm(res.msg, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                      }).then(() => {
                                        if(code===0){
                                            that.createDialog = true;
                                            that.templateList.forEach(i => {
                                                if (i.id == id) {
                                                    that.templateForm.name = i.name;
                                                    that.templateForm.memo = i.memo;
                                                    let arr = []
                                                    i.platform.split(',').forEach(j => {
                                                        if (that.platform_text_reload[j]) {
                                                            arr.push(that.platform_text_reload[j])
                                                        }
                                                    })
                                                    that.templateForm.platform = arr
                                                }
                                            })
                                            that.submitId = id;
                                        }else{
                                            Fast.api.ajax({
                                                url: 'shopro/decorate/publish/id/' + id+"/force/1",
                                                loading: true,
                                                data: {}
                                            }, function (ret, res) {
                                                that.getTemplate()
                                            })
                                        }
                                      })
                                    return false;
                                })
                                break;
                            case 'delete':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/del/ids/' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {
                                    that.getTemplate()
                                })
                                break;
                            case 'down':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/down/id/' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {
                                    that.getTemplate()
                                })
                                break;
                        }
                    },
                    // 修改信息
                    createClose(type) {
                        let that = this;
                        if (type == 'yes') {
                            let arr = []
                            that.templateForm.platform.forEach(i => {
                                arr.push(that.platform_text[i])
                            })
                            if (that.submitId) {
                                Fast.api.ajax({
                                    url: 'shopro/decorate/edit/id/' + that.submitId,
                                    loading: true,
                                    data: {
                                        name: that.templateForm.name,
                                        platform: arr.join(','),
                                        memo: that.templateForm.memo
                                    }
                                }, function (ret, res) {
                                    that.createDialog = false
                                    that.getTemplate();
                                    that.templateForm.platform = [];
                                    that.templateForm.name = '';
                                    that.templateForm.memo = ""
                                })
                            } else {
                                Fast.api.ajax({
                                    url: 'shopro/decorate/add',
                                    loading: true,
                                    data: {
                                        name: that.templateForm.name,
                                        platform: arr.join(','),
                                        memo: that.templateForm.memo,
                                        status: 'hidden',
                                        type: 'shop'
                                    }
                                }, function (ret, res) {
                                    that.createDialog = false
                                    that.getTemplate();
                                    that.templateForm.platform = [];
                                    that.templateForm.name = '';
                                    that.templateForm.memo = ""
                                })
                            }
                        } else {
                            that.createDialog = false;
                            that.templateForm.platform = [];
                            that.templateForm.name = '';
                            that.templateForm.memo = ""
                        }
                    },
                    goRecycle() {
                        let that = this;
                        Fast.api.open("shopro/decorate/recyclebin", "查看回收站", {
                            callback() {
                                that.getTemplate();
                            }
                        })
                    }
                },
            })

        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'shopro/decorate/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [{
                            checkbox: true
                        },
                        {
                            field: 'id',
                            title: __('Id')
                        },
                        {
                            field: 'name',
                            title: __('Name'),
                            align: 'left'
                        },
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [{
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'shopro/decorate/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'shopro/decorate/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        dodecorate: function () {

            var vueAdd = new Vue({
                el: "#decorateApp",
                data() {
                    return {
                        decorateContent: '',
                        group: "changepull",
                        toolsBox: [{
                            name: "图文",
                            data: [{
                                name: "轮播图",
                                type: "banner",
                                image: "/assets/addons/shopro/img/decorate/banner.png",
                                flag: false
                            }, {
                                name: "广告魔方",
                                type: "adv",
                                image: "/assets/addons/shopro/img/decorate/adv.png",
                                flag: false
                            }, {
                                name: "列表导航",
                                type: "nav-list",
                                image: "/assets/addons/shopro/img/decorate/nav-list.png",
                                flag: false
                            }, {
                                name: "宫格列表",
                                type: "grid-list",
                                image: "/assets/addons/shopro/img/decorate/grid-list.png",
                                flag: false
                            }, {
                                name: "富文本",
                                type: "rich-text",
                                image: "/assets/addons/shopro/img/decorate/rich-text.png",
                                flag: false
                            }, {
                                name: "标题栏",
                                type: "title-block",
                                image: "/assets/addons/shopro/img/decorate/title-block.png",
                                flag: false
                            }, {
                                name: "订单卡片",
                                type: "order-card",
                                image: "/assets/addons/shopro/img/decorate/order-card.png",
                                flag: false
                            }, {
                                name: "资产卡片",
                                type: "wallet-card",
                                image: "/assets/addons/shopro/img/decorate/wallet-card.png",
                                flag: false
                            }]
                        }, {
                            name: "商品组",
                            data: [{
                                name: "商品分类",
                                type: "goods-group",
                                image: "/assets/addons/shopro/img/decorate/goods-group.png",
                                flag: false
                            }, {
                                name: "自定义商品",
                                type: "goods-list",
                                image: "/assets/addons/shopro/img/decorate/goods-list.png",
                                flag: false
                            }, {
                                name: "菜单组",
                                type: "menu",
                                image: "/assets/addons/shopro/img/decorate/menu.png",
                                flag: false
                            }]
                        }, {
                            name: "活动营销",
                            data: [{
                                    name: "优惠券",
                                    type: "coupons",
                                    image: "/assets/addons/shopro/img/decorate/coupon.png",
                                    flag: false
                                },
                                {
                                    name: "拼团",
                                    type: "groupon",
                                    image: "/assets/addons/shopro/img/decorate/groupon.png"
                                },
                                {
                                    name: "秒杀商品",
                                    type: "seckill",
                                    image: "/assets/addons/shopro/img/decorate/secKill.png",
                                    flag: false
                                }, {
                                    name: "小程序直播",
                                    type: "live",
                                    image: "/assets/addons/shopro/img/decorate/live.png",
                                    flag: false
                                }
                            ]
                        }, {
                            name: "其他",
                            data: [{
                                name: "搜索",
                                type: "search",
                                image: "/assets/addons/shopro/img/decorate/search.png",
                                flag: false
                            }]
                        }],
                        templateData: [],
                        centerSelect: null,
                        templateForm: {},
                        advStyleImage: [{
                                src: '/assets/addons/shopro/img/decorate/adv_01.png',
                                num: 1
                            },
                            {
                                src: '/assets/addons/shopro/img/decorate/adv_02.png',
                                num: 2
                            },
                            {
                                src: '/assets/addons/shopro/img/decorate/adv_03.png',
                                num: 3
                            },
                            {
                                src: '/assets/addons/shopro/img/decorate/adv_04.png',
                                num: 3
                            },
                            {
                                src: '/assets/addons/shopro/img/decorate/adv_05.png',
                                num: 3
                            },
                            {
                                src: '/assets/addons/shopro/img/decorate/adv_06.png',
                                num: 3
                            },
                            {
                                src: '/assets/addons/shopro/img/decorate/adv_07.png',
                                num: 5
                            }
                        ],
                        titleBlock: {
                            isSelected: false,
                            data: [{
                                    src: 'http://shopro.7wpp.com/imgs/title1.png',
                                    selected: false,
                                },
                                {
                                    src: 'http://shopro.7wpp.com/imgs/title2.png',
                                    selected: false,
                                },
                                {
                                    src: 'http://shopro.7wpp.com/imgs/title3.png',
                                    selected: false,
                                },
                                {
                                    src: 'http://shopro.7wpp.com/imgs/title4.png',
                                    selected: false,
                                },
                                {
                                    src: 'http://shopro.7wpp.com/imgs/title5.png',
                                    selected: false,
                                }
                            ],
                            currentImage: ''
                        },
                        iframeSrc: '',
                        qrcodeSrc: '',
                        iframeTitle: '',
                        iframeCopyright: [],
                        iframePlatform: '',
                        previewDialog: false,
                        isPageType: 'home',
                        advdrawer: false,
                        pageTypeList: [{
                                name: '首页',
                                type: 'home',
                                flag: false
                            },
                            {
                                name: '个人中心',
                                type: 'user',
                                flag: false
                            },
                            {
                                name: '底部导航',
                                type: 'tabbar',
                                flag: false
                            },
                            {
                                name: '弹窗提醒',
                                type: 'popup',
                                flag: false
                            }, {
                                name: '悬浮按钮',
                                type: 'float-button',
                                flag: false
                            }
                        ],
                        homeData: Config.templateData.home ? Config.templateData.home : [],
                        userData: Config.templateData.user,
                        tabbarData: Config.templateData.tabbar ? Config.templateData.tabbar : [{
                            type: 'tabbar',
                            name: '底部导航',
                            content: {
                                style: 1,
                                color: '#000',
                                activeColor: "#999",
                                list: [{
                                    name: "",
                                    image: "",
                                    activeImage: "",
                                    path: "",
                                    path_name: "",
                                    path_type: 1
                                }]
                            }
                        }],
                        popupData: Config.templateData.popup ? Config.templateData.popup : [{
                            type: 'popup',
                            name: '弹窗提醒',
                            content: {
                                list: []
                            }
                        }],
                        floatButtonData: Config.templateData['float-button'] ? Config.templateData['float-button'] : [{
                            type: 'float-button',
                            name: '悬浮按钮',
                            content: {
                                image: '',
                                list: []
                            }
                        }],
                        customData: Config.templateData.custom ? Config.templateData.custom : [{
                            name: "导航背景色",
                            type: "nav-bg",
                            content: {
                                name: "",
                                style: 1,
                                color: '#eeeeee',
                                image: ''
                            }
                        }],
                        fromtype: window.location.search.replace("?", "").split('&')[1].split('=')[1],
                        decorate_id: window.location.search.replace("?", "").split('&')[0].split('=')[1],
                        gg: false,
                        customColors: "#7536D0",
                        percentage: 0,
                        percentageshow: false
                    }
                },
                mounted() {
                    if (this.fromtype == 'shop') {
                        this.templateData = this.homeData;
                        this.pageTypeList.forEach(i => {
                            if (i.type == this.isPageType) {
                                i.flag = true;
                            }
                        });
                    } else {
                        this.templateData = this.customData;
                        this.centerSelect = 0
                        this.showForm(this.centerSelect);
                    }
                },
                methods: {
                    start(e) {
                        $('.sortable-ghost .hide-item').show();
                    },
                    end(e) {
                        $('.hide-item').hide();
                    },
                    changeDraggable(e) {
                        if (e.added) {
                            this.centerSelect = e.added.newIndex
                            this.templateData[this.centerSelect] = this.judgeType(e.added.element.type)
                        }
                        if (e.moved) {
                            this.centerSelect = e.moved.newIndex
                        }
                        this.showForm(this.centerSelect);
                    },
                    selectTools(type) {
                        let form = this.judgeType(type);
                        if (this.centerSelect == null) {
                            this.centerSelect = this.templateData.length;
                            this.templateData.splice(this.centerSelect, 0, form);
                        } else {
                            this.centerSelect = this.centerSelect + 1;
                            this.templateData.splice(this.centerSelect, 0, form);
                        }
                        this.showForm(this.centerSelect);
                    },
                    centerDel(idx) {
                        this.templateData.splice(idx, 1);
                        this.centerSelect = idx;
                        if (this.centerSelect == 0) {
                            if (this.templateData.length > 1) {
                                this.templateForm = this.templateData[this.centerSelect]
                            } else {
                                this.centerSelect = null;
                            }
                        } else {
                            this.centerSelect = this.centerSelect - 1;
                            this.templateForm = this.templateData[this.centerSelect]
                        }
                    },
                    //删除子元素
                    rightDel(index) {
                        this.templateData[this.centerSelect].content.list.splice(index, 1)
                    },
                    showForm(index) {
                        this.centerSelect = index;
                        this.templateForm = this.templateData[index]
                    },
                    // 添加
                    addForm(type) {
                        let form = {};
                        switch (type) {
                            case 'banner':
                                form = {
                                    image: '',
                                    path: '',
                                    path_type: 1,
                                    name: '',
                                    bgcolor: '',
                                    path_name: ""
                                };
                                break;
                            case 'menu':
                                form = {
                                    image: '',
                                    path: '',
                                    name: '',
                                    path_name: '',
                                    path_type: 1
                                };
                                break;
                            case 'nav-list':
                                form = {
                                    name: "",
                                    image: "",
                                    path: "",
                                    path_name: "",
                                    path_type: 1
                                };
                                break;
                            case 'grid-list':
                                form = {
                                    name: "",
                                    image: "",
                                    path: "",
                                    path_name: "",
                                    path_type: 1
                                };
                                break;
                            case 'tabbar':
                                form = {
                                    name: "",
                                    image: "",
                                    activeImage: "",
                                    path: "",
                                    path_name: "",
                                    path_type: 1
                                }
                                break;
                            case 'popup':
                                form = {
                                    image: "",
                                    path: "",
                                    path_name: "",
                                    page: [],
                                    page_name: [],
                                    path_type: 1,
                                    style: 1,
                                }
                                break;
                            case 'float-button':
                                form = {
                                    name: "",
                                    style: 1,
                                    image: '',
                                    btnimage: '',
                                    path: '',
                                    path_name: '',
                                    path_type: 1,
                                    page: [],
                                    page_name: []
                                }
                                break;
                        }
                        this.templateData[this.centerSelect].content.list.push(form)
                    },
                    goPreview() {
                        let that = this;
                        if (that.fromtype == 'shop') {
                            that.tabbarData[0].content.isshow = true;
                            let templateData = {
                                home: that.homeData,
                                popup: that.popupData,
                                tabbar: that.tabbarData,
                                user: that.userData,
                                'float-button': that.floatButtonData,
                            }
                            templateData = JSON.stringify(templateData)
                            Fast.api.ajax({
                                url: 'shopro/decorate/preview/id/' + that.decorate_id,
                                loading: true,
                                data: {
                                    templateData: templateData
                                }
                            }, function (ret, res) {
                                that.iframeSrc = res.url + "&time=" + new Date().getTime();
                                that.qrcodeSrc = 'http://qrcode.7wpp.com?url=' + that.iframeSrc;
                                that.iframeTitle = res.msg;
                                that.iframeCopyright = res.data.copyright;
                                that.iframePlatform = res.data.platform;
                                that.previewDialog = true;


                            })
                        } else {
                            let templateData = {
                                custom: that.customData,
                            }
                            templateData = JSON.stringify(templateData)
                            Fast.api.ajax({
                                url: 'shopro/decorate/preview/id/' + that.decorate_id,
                                loading: true,
                                data: {
                                    templateData: templateData
                                }
                            }, function (ret, res) {

                                that.iframeSrc = res.url + "&time=" + new Date().getTime();
                                that.qrcodeSrc = 'http://qrcode.7wpp.com?url=' + that.iframeSrc;
                                that.iframeTitle = res.msg;
                                that.iframeCopyright = res.data.copyright;
                                that.iframePlatform = res.data.platform;
                                that.previewDialog = true;


                            })
                        }
                    },
                    goPreserve() {
                        let that = this;
                        if (that.fromtype == 'shop') {
                            that.tabbarData[0].content.isshow = true;
                            if (that.tabbarData[0].content.list.length > 6) {
                                const h = this.$createElement;
                                that.$message({
                                    message: h('p', null, [
                                        h('span', null, '底部导航最多5个 ')
                                    ])
                                });
                                return false;
                            } else if (that.tabbarData[0].content.list.length > 0) {
                                let flag = false;
                                if (that.tabbarData[0].content.style == 1) {
                                    if (that.tabbarData[0].content.color == '' || that.tabbarData[0].content.activeColor == '') {
                                        flag = true
                                    }
                                    that.tabbarData[0].content.list.forEach(i => {
                                        if (i.activeImage == '' || i.image == '' || i.name == '' || i.path == '') {
                                            flag = true
                                        }
                                    })

                                } else if (that.tabbarData[0].content.style == 3) {
                                    if (that.tabbarData[0].content.color == '' || that.tabbarData[0].content.activeColor == '') {
                                        flag = true
                                    }
                                    that.tabbarData[0].content.list.forEach(i => {
                                        if (i.name == '' || i.path == '') {
                                            flag = true
                                        }
                                    })
                                } else if (that.tabbarData[0].content.style == 2) {
                                    that.tabbarData[0].content.list.forEach(i => {
                                        if (i.activeImage == '' || i.image == '' || i.path == '') {
                                            flag = true
                                        }
                                    })
                                } else {
                                    flag = true
                                }
                                if (flag) {
                                    that.$message({
                                        message: "请完善底部导航"
                                    });
                                    return false;
                                }
                            }
                            let templateData = {
                                home: that.homeData,
                                popup: that.popupData,
                                tabbar: that.tabbarData,
                                user: that.userData,
                                'float-button': that.floatButtonData,
                            }
                            templateData = JSON.stringify(templateData);
                            that.percentageshow = true;
                            Fast.api.ajax({
                                url: 'shopro/decorate/dodecorate_save/id/' + that.decorate_id,
                                // loading: true,
                                data: {
                                    templateData: templateData
                                }
                            }, function (ret, res) {
                                that.iframeSrc = res.url + "&time=" + new Date().getTime();
                                let timers = setInterval(function () {
                                    that.percentage = that.percentage + 2;
                                    if (that.percentage > 100) {
                                        clearInterval(timers);
                                        that.percentage = 100;
                                        that.percentageshow = false;
                                    }
                                }, 100);
                                return false;
                            })
                        } else {
                            let templateData = {
                                custom: that.customData,
                            }
                            templateData = JSON.stringify(templateData)
                            Fast.api.ajax({
                                url: 'shopro/decorate/dodecorate_save/id/' + that.decorate_id,
                                loading: true,
                                data: {
                                    templateData: templateData
                                }
                            }, function (ret, res) {})
                        }
                    },
                    previewClose() {
                        this.previewDialog = false;
                    },
                    selectTitleBlock(index) {
                        if (index != null) {
                            this.titleBlock.isSelected = true
                            this.templateData[this.centerSelect].content.image = this.titleBlock.data[index].src
                            this.titleBlock.currentImage = this.titleBlock.data[index].src
                        } else {
                            this.titleBlock.isSelected = false
                            this.templateData[this.centerSelect].content.image = ''
                        }
                    },
                    chooseAdvPic() {
                        this.advdrawer = true;
                    },
                    changeAdv(index, num) {
                        this.templateData[this.centerSelect].content.list = []
                        this.templateData[this.centerSelect].content.style = index + 1
                        for (let i = 0; i < num; i++) {
                            this.templateData[this.centerSelect].content.list.push({
                                image: "",
                                name: "",
                                path: "",
                                path_name: "",
                                path_type: 1,
                            })
                        }
                        this.templateForm = this.templateData[this.centerSelect]
                        this.advdrawer = false;
                    },
                    selectType(type, index) {
                        let that = this;
                        that.isPageType = type;
                        that.pageTypeList.forEach(i => {
                            i.flag = false
                        });
                        that.pageTypeList[index].flag = true;
                    },
                    selectDate(type) {
                        let that = this;
                        switch (type) {
                            case 'home':
                                that.homeData = that.templateData;
                                break;
                            case 'user':
                                that.userData = that.templateData;
                                break;
                            case 'tabbar':
                                that.tabbarData = that.templateData;
                                break;
                            case 'popup':
                                that.popupData = that.templateData;
                                break;
                            case 'float-button':
                                that.floatButtonData = that.templateData;
                                break;
                        }
                    },
                    selecttoDate(type) {
                        let that = this;
                        switch (type) {
                            case 'home':
                                that.templateData = that.homeData;
                                break;
                            case 'user':
                                that.templateData = that.userData;
                                break;
                            case 'tabbar':
                                that.templateData = that.tabbarData
                                break;
                            case 'popup':
                                that.templateData = that.popupData
                                break;
                            case 'float-button':
                                that.templateData = that.floatButtonData;
                                break;
                        }
                    },
                    //检测类型
                    judgeType(type) {
                        var form;
                        switch (type) {
                            case 'search': //√
                                form = {
                                    name: "搜索",
                                    content: "",
                                    type: "search",
                                };
                                break;
                            case 'banner':
                                form = {
                                    name: "轮播图",
                                    type: "banner",
                                    content: {
                                        name: "",
                                        style: 1,
                                        list: [{
                                            name: "",
                                            bgcolor: "",
                                            image: "",
                                            path: "",
                                            path_name: "",
                                            path_type: 1,
                                        }],
                                    }
                                };
                                break;
                            case 'menu':
                                form = {
                                    name: "菜单组",
                                    type: "menu",
                                    content: {
                                        name: "",
                                        style: 4,
                                        list: [{
                                            name: "",
                                            image: "",
                                            path: "",
                                            path_name: "",
                                            path_type: 1
                                        }]
                                    }
                                };
                                break;
                            case 'live':
                                form = {
                                    name: "小程序直播",
                                    type: "live",
                                    content: {
                                        style: 1,
                                        ids: '',
                                        name: "",
                                    }
                                };
                                break;
                            case 'adv':
                                form = {
                                    name: "广告魔方",
                                    type: "adv",
                                    content: {
                                        list: [{
                                            name: "",
                                            image: "",
                                            path: "",
                                            path_name: "",
                                            path_type: 1,
                                        }],
                                        name: "",
                                        style: 1
                                    }
                                };
                                break;
                            case 'goods-group':
                                form = {
                                    name: "商品分类",
                                    type: "goods-group",
                                    content: {
                                        id: '',
                                        name: "",
                                        category_name: "",
                                        image: "",
                                    }
                                };
                                break;
                            case 'goods-list':
                                form = {
                                    name: "自定义商品",
                                    type: "goods-list",
                                    content: {
                                        ids: '',
                                        image: "",
                                        name: "",

                                    }
                                };
                                break;
                            case 'coupons':
                                form = {
                                    name: "优惠券",
                                    type: "coupons",
                                    content: {
                                        ids: '',
                                        name: ''
                                    }
                                };
                                break;
                            case 'groupon':
                                form = {
                                    name: "拼团",
                                    type: "groupon",
                                    content: {
                                        id: '',
                                        name: "",
                                        groupon_name: '',
                                    }
                                };
                                break;
                            case 'seckill':
                                form = {
                                    name: "秒杀",
                                    type: "seckill",
                                    content: {
                                        id: '',
                                        name: "",
                                        seckill_name: '',
                                    }
                                };
                                break;
                            case 'nav-list':
                                form = {
                                    name: "列表导航",
                                    type: "nav-list",
                                    content: {
                                        name: "",
                                        list: [{
                                            name: "",
                                            image: "",
                                            path: "",
                                            path_name: "",
                                            path_type: 1
                                        }]
                                    }
                                };
                                break;
                            case 'grid-list':
                                form = {
                                    name: "宫格列表",
                                    type: "grid-list",
                                    content: {
                                        name: "",
                                        list: [{
                                            name: "",
                                            image: "",
                                            path: "",
                                            path_name: "",
                                            path_type: 1
                                        }]
                                    }
                                };
                                break;
                            case 'rich-text':
                                form = {
                                    name: "富文本",
                                    type: "rich-text",
                                    content: {
                                        id: '',
                                        name: "",
                                    }
                                };
                                break;
                            case 'title-block':
                                form = {
                                    name: "标题栏",
                                    type: "title-block",
                                    content: {
                                        name: "",
                                        color: "#000000",
                                        image: '/assets/addons/shopro/img/decorate/title1.png'
                                    }
                                };
                                break;
                            case 'order-card':
                                form = {
                                    name: "订单卡片",
                                    type: "order-card",
                                    content: {}
                                };
                                break;
                            case 'wallet-card':
                                form = {
                                    name: "资产卡片",
                                    type: "wallet-card",
                                    content: {}
                                };
                                break;
                        }
                        return form
                    },
                    isweblink(type, index) {
                        this.templateForm.content.list[index].path = '';
                        this.templateForm.content.list[index].path_name = '';
                    }
                },
                watch: {
                    templateData: {
                        handler: function (newVal, oldVal) {
                            newVal.length == 0 ? this.templateForm = {} : this.templateForm
                        },
                        deep: true
                    },
                    isPageType(newVal, oldVal) {
                        if (oldVal) {
                            this.selectDate(oldVal)
                        }
                        this.selecttoDate(newVal);
                        if (newVal != 'home') {
                            this.centerSelect = 0;
                        } else {
                            if (this.homeData.length > 0) {
                                this.centerSelect = 0;
                            } else {
                                this.centerSelect = null;
                            }
                        }
                        this.showForm(this.centerSelect);
                    },
                    percentageshow(newVal) {
                        if (!newVal) {
                            setTimeout(() => {
                                this.percentage = 0;
                            }, 100)
                        }

                    }
                }
            })

            //所有图片选择	
            $(document).on("click", ".choosePicture", function () {
                var that = this;
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                parent.Fast.api.open("general/attachment/select?multiple=" + multiple, "选择图片", {
                    callback: function (data) {
                        let index = $(that).attr("data-index")
                        switch (index) {
                            case "image":
                                vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.image = data.url;
                                vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect];
                                break;
                            case "title-block":
                                vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.image = data.url;
                                vueAdd.$data.titleBlock.currentImage = data.url;
                                vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect];
                                break;
                            default:
                                if ($(that).attr("data-active") == 'active') {
                                    vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].activeImage = data.url;
                                } else if ($(that).attr("data-type") == 'btn') {
                                    vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].btnimage = data.url;
                                } else {
                                    vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].image = data.url;
                                }
                                vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                        }
                    }
                });
                return false;
            })
            // 商品分类选择商品	
            $(document).on("click", ".chooseCategory", function () {
                var that = this;
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                parent.Fast.api.open("shopro/category/select?multiple=" + multiple, "选择分类", {
                    callback: function (data) {
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.category_name = data.data.category_name
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.id = data.data.id
                        vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                    }
                });
                return false;
            })
            //自定义商品选择商品列表	
            $(document).on("click", ".chooseGoods", function () {
                var that = this;
                var multiple = true;
                parent.Fast.api.open("shopro/goods/select?multiple=" + multiple, "选择商品", {
                    callback: function (data) {
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.ids = data.data.ids
                        vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                    }
                });
                return false;
            })
            // 选择优惠券类型(多选)	
            $(document).on("click", ".chooseCoupons", function () {
                var that = this;
                parent.Fast.api.open("shopro/coupons/select?multiple=true", "选择优惠券", {
                    callback: function (data) {
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.ids = data.data.ids
                        vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                    }
                });
                return false;
            })
            // 选择活动商品	
            $(document).on("click", ".chooseActivity", function () {
                var that = this;
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                var type = $(this).attr("data-type")
                parent.Fast.api.open("shopro/activity/activity/select?multiple=" + multiple + "&type=" + type, "选择活动", {
                    callback: function (data) {
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.id = data.data.id
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content[type + '_name'] = data.data.title
                        vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                    }
                });
                return false;
            })
            //选择链接chooseLive	
            $(document).on("click", ".chooseLive", function () {
                var that = this;
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                parent.Fast.api.open("shopro/app/live/select?multiple=true" + "&type=live", "选择小程序直播", {
                    callback: function (data) {
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.ids = data.data.ids
                        vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                    }
                });
                return false;
            })
            //选择链接Path	
            $(document).on("click", ".choosePath", function () {
                var that = this;
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                parent.Fast.api.open("shopro/link/select?multiple=" + multiple, "选择链接", {
                    callback: function (data) {
                        var index = $(that).attr("data-index")
                        let page = $(that).attr("data-page")
                        if (page == 'page') {
                            if (data.data.pathId) {
                                vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].page_name = data.data.pathId.split(',')
                                vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].page = data.data.path.split(',')
                                vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                            } else {
                                vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].page_name = data.data.path_name.split(',')
                                vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].page = data.data.path.split(',')
                                vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                            }

                        } else {
                            vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].path_name = data.data.path_name
                            vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.list[index].path = data.data.path
                            vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                        }

                    }
                });
                return false;
            })
            // 选择富文本chooseRichText
            $(document).on("click", ".chooseRichText", function () {
                var that = this;
                parent.Fast.api.open("shopro/richtext/select?multiple=false", "选择富文本", {
                    callback: function (data) {
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.id = data.data.id
                        vueAdd.$data.templateData[vueAdd.$data.centerSelect].content.name = data.data.title
                        vueAdd.$data.templateForm = vueAdd.$data.templateData[vueAdd.$data.centerSelect]
                    }
                });
                return false;
            })
        },
        designer: function () {
            var decorateDesigner = new Vue({
                el: "#decorate-designer",
                data() {
                    return {
                        decorateList: Config.designerData,
                        previewDialog: false,
                        previewData: {},
                        iframeSrc: "",
                        qrcodeSrc: "",
                    }
                },
                mounted() {},
                methods: {
                    operation(type, index, id) {
                        let that = this;
                        that.previewData = that.decorateList[index];
                        switch (type) {
                            case 'preview':
                                that.iframeSrc = window.location.protocol + "//designer.7wpp.com?shop_id=" + id;
                                that.qrcodeSrc = 'http://qrcode.7wpp.com?url=' + that.iframeSrc;
                                that.previewDialog = true;
                                break;
                            case 'use':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/use_designer_template?id=' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {

                                })
                                break;
                        }

                    },
                    previewClose() {
                        this.previewDialog = false;
                    },
                },
            })
        },
        custom: function () {
            var decorateList = new Vue({
                el: "#decorate-list",
                data() {
                    return {
                        decorateList: [],
                        customDialog: false,
                        customTem: {
                            name: '',
                            memo: '',
                        },
                        editId: null
                    }
                },
                mounted() {
                    this.getdecorateList();
                },
                methods: {
                    getdecorateList() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/decorate/lists',
                            loading: true,
                            type: 'GET',
                            data: {
                                type: 'custom'
                            }
                        }, function (ret, res) {
                            that.decorateList = res.data;
                            that.decorateList.forEach(i => {
                                i.iseditname = false
                            })
                            return false
                        })
                    },
                    operation(opttype, id, type) {
                        let that = this;
                        switch (opttype) {
                            case 'decorate':
                                Fast.api.addtabs('shopro/decorate/dodecorate?id=' + id + '&type=' + type, '店铺装修');
                                // Fast.api.addtabs('shopro/decorate/dodecorate?id=' + id, '店铺装修')
                                break;
                            case 'delete':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/del/ids/' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {
                                    that.getdecorateList();
                                })
                                break;
                            case 'copy':
                                Fast.api.ajax({
                                    url: 'shopro/decorate/copy/id/' + id,
                                    loading: true,
                                    data: {}
                                }, function (ret, res) {
                                    that.getdecorateList();
                                })
                                break;
                            case 'create':
                                this.customDialog = true;
                                this.editId = id;
                                break;
                            case 'edit':
                                this.customDialog = true;
                                this.editId = id;
                                that.decorateList.forEach(i => {
                                    if (i.id == that.editId) {
                                        that.customTem.name = i.name;
                                        that.customTem.memo = i.memo;
                                    }
                                })
                                break;
                        }
                    },
                    customClose(type) {
                        let that = this;
                        if (type == 'yes') {
                            if (that.editId) {
                                Fast.api.ajax({
                                    url: 'shopro/decorate/edit/id/' + that.editId,
                                    loading: true,
                                    data: {
                                        name: that.customTem.name,
                                        memo: that.customTem.memo
                                    }
                                }, function (ret, res) {
                                    that.getdecorateList();
                                    that.customDialog = false;
                                    for (var key in that.customTem) {
                                        that.customTem[key] = ""
                                    }
                                })
                            } else {
                                Fast.api.ajax({
                                    url: 'shopro/decorate/add',
                                    loading: true,
                                    data: {
                                        type: 'custom',
                                        name: that.customTem.name,
                                        memo: that.customTem.memo
                                    }
                                }, function (ret, res) {
                                    that.getdecorateList();
                                    that.customDialog = false;
                                    for (var key in that.customTem) {
                                        that.customTem[key] = ""
                                    }
                                })
                            }
                        } else {
                            for (var key in that.customTem) {
                                that.customTem[key] = ""
                            }
                            that.customDialog = false;
                        }
                    },
                },
            })

        },
        select: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/decorate/index',
                }
            });
            var idArr = [];
            var table = $("#table");
            table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                if (e.type == 'check' || e.type == 'uncheck') {
                    row = [row];
                } else {
                    idArr = [];
                }
                $.each(row, function (i, j) {
                    if (e.type.indexOf("uncheck") > -1) {
                        var index = idArr.indexOf(j.id);
                        if (index > -1) {
                            idArr.splice(index, 1);
                        }
                    } else {
                        idArr.indexOf(j.id) == -1 && idArr.push(j.id);
                    }
                });
            });

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                showToggle: false,
                showExport: false,
                columns: [
                    [{
                            checkbox: true
                        },
                        {
                            field: 'id',
                            title: __('Id')
                        },
                        {
                            field: 'name',
                            title: __('Name')
                        },
                        {
                            field: 'type',
                            title: __('Type'),
                            searchList: {
                                "shop": '商城模板',
                                "custom": '自定义模板',
                                "preview": '预览模板'
                            },
                            formatter: Table.api.formatter.normal
                        },
                        {
                            field: 'updatetime',
                            title: __('Updatetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            title: __('Operate'),
                            events: {
                                'click .btn-chooseone': function (e, value, row, index) {
                                    var multiple = Backend.api.query('multiple');
                                    multiple = multiple == 'true' ? true : false;
                                    row.ids = row.id.toString()
                                    Fast.api.close({
                                        data: row,
                                        multiple: multiple
                                    });
                                },
                            },
                            formatter: function () {
                                return '<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> ' + __('Choose') + '</a>';
                            }
                        }
                    ]
                ]
            });

            // 选中多个
            $(document).on("click", ".btn-choose-multi", function () {
                // var couponsArr = new Array();
                // $.each(table.bootstrapTable("getAllSelections"), function (i, j) {
                //     couponsArr.push(j.id);
                // });
                var multiple = Backend.api.query('multiple');
                multiple = multiple == 'true' ? true : false;
                let row = {}
                row.ids = idArr.join(",")
                Fast.api.close({
                    data: row,
                    multiple: multiple
                });
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            require(['upload'], function (Upload) {
                Upload.api.plupload($("#toolbar .plupload"), function () {
                    $(".btn-refresh").trigger("click");
                });
            });

        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});