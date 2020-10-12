define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/wechat/index' + location.search,
                    add_url: 'shopro/wechat/add',
                    edit_url: 'shopro/wechat/edit',
                    del_url: 'shopro/wechat/del',
                    multi_url: 'shopro/wechat/multi',
                    table: 'shopro_wechat',
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
                            field: 'type',
                            title: __('Type')
                        },
                        {
                            field: 'name',
                            title: __('Name')
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
        menu: function () {
            var wechat_menu = new Vue({
                el: "#wechat-menu",
                data() {
                    return {
                        menuData: [],
                        rightData: {},
                        selectedIndex1: null,
                        selectedIndex2: null,
                        selectLevel: null,
                        rightShow: false,
                        menuTitle: '',
                        edit_id: null,
                        viewUrl: Config.shopro.domain,
                        wxMiniProgramapp_id: Config.wxMiniProgram.app_id
                    }
                },
                mounted() {
                    this.getmenuData();
                },
                methods: {
                    getmenuData() {
                        var that = this;
                        Fast.api.ajax({
                            url: 'shopro/wechat/menu?id=1',
                            loading: true,
                            type: 'GET',
                            data: {}
                        }, function (ret, res) {
                            if (res.data.content) {
                                that.menuData = JSON.parse(res.data.content);
                                that.menuData.forEach(i => {
                                    i.selected = false;
                                    i.show = false;
                                    if(!i.appid){
                                        i.appid = '';
                                        i.pagepath='';
                                    }
                                    if (i.sub_button) {
                                        i.sub_button.forEach(j => {
                                            j.selected = false;
                                            if(!j.appid){
                                                j.appid = '';
                                                j.pagepath='';
                                            }
                                        })
                                    } else {
                                        i.sub_button = []
                                    }
                                })
                            } else {
                                that.menuData = []
                            }
                            that.edit_id = res.data.id;
                            that.menuTitle = res.data.name;
                            return false;
                        })
                    },
                    changeRadio(e) {
                        this.rightData.url = "";
                        this.rightData.appid = "";
                        this.rightData.pagepath = "";
                    },
                    menuSelect(index1, index2) {
                        this.selectedIndex1 = index1;
                        this.selectedIndex2 = index2;
                        this.rightShow = true;
                        this.menuData.forEach(i => {
                            i.selected = false;
                            i.show = false;
                            if (i.sub_button) {
                                i.sub_button.forEach(j => {
                                    j.selected = false;
                                })
                            }
                        });
                        this.menuData[index1].show = true;
                        //选择1
                        if (index2 == null) {
                            this.selectLevel = 1;
                            this.menuData[index1].selected = true;
                            this.menuData[index1].show = true;
                            this.rightData = this.menuData[index1];
                        } else {
                            this.selectLevel = 2;
                            this.menuData[index1].sub_button[index2].selected = true;
                            this.rightData = this.menuData[index1].sub_button[index2];
                        }
                    },
                    addMenu(index, level) {
                        //右侧显示
                        this.rightShow = true;
                        this.selectLevel = level;
                        if (index != null) {
                            this.selectedIndex1 = index;
                            this.menuData.forEach(i => {
                                i.selected = false;
                                if (i.sub_button) {
                                    i.sub_button.forEach(j => {
                                        j.selected = false;
                                    })
                                }
                            });
                            this.menuData[index].sub_button.push({
                                name: '添加子菜单',
                                type: 'view',
                                selected: true,
                                url: '',
                                appid: '',
                                pagepath:''

                            })
                            this.rightData = this.menuData[index].sub_button[this.menuData[index].sub_button.length - 1];
                            this.selectedIndex2 = this.menuData[index].sub_button.length - 1;
                        } else {
                            this.menuData.forEach(i => {
                                i.selected = false;
                                i.show = false;
                            });
                            this.menuData.push({
                                name: '添加菜单',
                                selected: true,
                                show: true,
                                type: 'view',
                                url: '',
                                appid: '',
                                pagepath:'',
                                sub_button: []
                            })
                            this.selectedIndex1 = this.menuData.length - 1;
                            this.rightData = this.menuData[this.menuData.length - 1];
                        }
                    },
                    delMenu() {
                        if (this.selectedIndex2 != null) {
                            this.menuData[this.selectedIndex1].sub_button.splice(this.selectedIndex2, 1);
                            if (this.menuData[this.selectedIndex1].sub_button.length > 0) {
                                if (this.selectedIndex2 == 0) {
                                    this.menuData[this.selectedIndex1].sub_button[0].selected = true;
                                    this.rightData = this.menuData[this.selectedIndex1].sub_button[0];
                                } else {
                                    this.menuData[this.selectedIndex1].sub_button[this.selectedIndex2 - 1].selected = true;
                                    this.rightData = this.menuData[this.selectedIndex1].sub_button[this.selectedIndex2 - 1];
                                    this.selectedIndex2--
                                }
                            } else {
                                this.rightData = {};
                                this.rightShow = false;
                            }
                        } else {
                            this.menuData.splice(this.selectedIndex1, 1);
                            if (this.menuData.length > 0) {
                                if (this.selectedIndex1 == 0) {
                                    this.menuData[0].selected = true;
                                    this.menuData[0].show = true;
                                    this.rightData = this.menuData[0];
                                } else {
                                    this.menuData[this.selectedIndex1 - 1].selected = true;
                                    this.menuData[this.selectedIndex1 - 1].show = true;
                                    this.rightData = this.menuData[this.selectedIndex1 - 1];
                                    this.selectedIndex1--
                                }

                            } else {
                                this.rightData = {};
                                this.rightShow = false;
                            }
                        }
                    },
                    choosePath() {
                        let that = this;
                        let multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                        parent.Fast.api.open("shopro/link/select?multiple=" + multiple, "选择路径", {
                            callback: function (data) {
                                if (that.selectedIndex2 != null) {
                                    if (that.menuData[that.selectedIndex1].sub_button[that.selectedIndex2].type == 'view') {
                                        that.menuData[that.selectedIndex1].sub_button[that.selectedIndex2].url = that.viewUrl + data.data.path;
                                    } else {
                                        that.menuData[that.selectedIndex1].sub_button[that.selectedIndex2].pagepath = data.data.path;
                                        that.menuData[that.selectedIndex1].sub_button[that.selectedIndex2].url = that.viewUrl + data.data.path;
                                        that.menuData[that.selectedIndex1].sub_button[that.selectedIndex2].appid = that.wxMiniProgramapp_id;
                                        that.rightData.appid = that.wxMiniProgramapp_id;
                                    }
                                    that.rightData.url = that.menuData[that.selectedIndex1].sub_button[that.selectedIndex2].url;
                                } else {
                                    if (that.menuData[that.selectedIndex1].type == 'view') {
                                        that.menuData[that.selectedIndex1].url = that.viewUrl + data.data.path;
                                    } else {
                                        that.menuData[that.selectedIndex1].url = that.viewUrl + data.data.path;
                                        that.menuData[that.selectedIndex1].pagepath = data.data.path;
                                        that.menuData[that.selectedIndex1].appid = that.wxMiniProgramapp_id;
                                        that.rightData.appid = that.wxMiniProgramapp_id;
                                    }
                                    that.rightData.url = that.menuData[that.selectedIndex1].url;
                                    that.rightData.pagepath = that.menuData[that.selectedIndex1].pagepath;
                                }

                            }
                        });
                    },
                    menuHide() {
                        this.selectedIndex1 = null;
                        this.selectedIndex2 = null;
                        this.menuData.forEach(i => {
                            i.selected = false;
                            i.show = false;
                            if (i.sub_button.length > 0) {
                                i.sub_button.forEach(j => {
                                    j.selected = false;
                                })
                            }
                        });
                        this.rightShow = false;
                    },
                    menuShow() {
                        this.rightShow = true;
                    },
                    subData(type) {
                        let that = this;
                        let savemenuData=JSON.parse(JSON.stringify(that.menuData))
                        savemenuData.forEach(i => {
                            delete i.show;
                            delete i.selected;
                            if (i.sub_button.length > 0) {
                                delete i.url;
                                delete i.appid;
                                delete i.pagepath;
                                delete i.type;
                                i.sub_button.forEach(j => {
                                    delete j.selected;
                                    if (j.type == 'view') {
                                        delete j.appid;
                                        delete j.pagepath;
                                    }
                                })
                            } else {
                                delete i.sub_button;
                                if (i.type) {
                                    if (i.type == 'view') {
                                        delete i.appid;
                                        delete i.pagepath;
                                    }
                                }
                            }
                        })
                        Fast.api.ajax({
                            url: 'shopro/wechat/menu?id=' + that.edit_id + '&act=' + type,
                            loading: true,
                            type: 'POST',
                            data: {
                                content: JSON.stringify(savemenuData)
                            }
                        }, function (ret, res) {
                            if (res.code == 1) {
                                if (res.data.content) {
                                    that.menuData = JSON.parse(res.data.content);
                                    that.menuData.forEach(i => {
                                        i.selected = false;
                                        i.show = false;
                                        if (i.sub_button) {
                                            i.sub_button.forEach(j => {
                                                j.selected = false;
                                            })
                                        } else {
                                            i.sub_button = []
                                        }
                                    })

                                } else {
                                    that.menuData = []
                                }
                                that.edit_id = res.data.id;
                                that.menuTitle = res.data.name;
                            }
                            that.rightShow = false;

                        })
                    },
                },
                watch:{
                    rightData: {
                        handler: function (newVal) {
                            if(this.selectLevel==1){
                               let name=newVal.name;
                               let num=0;
                               for(var i=0;i<name.length;i++){
                                    if(name[i].charCodeAt()>=20 && name[i].charCodeAt()<=127){
                                        num++
                                    }else{
                                       num+=2 
                                    }
                                    if(num>8){
                                        newVal.name=newVal.name.substr(0,i)
                                    }
                               }
                            }else if(this.selectLevel==2){
                                let name=newVal.name;
                               let num=0;
                               for(var i=0;i<name.length;i++){
                                    if(name[i].charCodeAt()>=20 && name[i].charCodeAt()<=127){
                                        num++
                                    }else{
                                       num+=2 
                                    }
                                    if(num>16){
                                        newVal.name=newVal.name.substr(0,i)
                                    }
                               }
                            }
                        },
                        deep: true
                    }
                }
            })
        },
        fans: function () {
            var fans_index = new Vue({
                el: "#fans-index",
                data() {
                    return {
                        searchKey: '',
                        fansList: [],
                        currentPage: 1,
                        totalPage: 0,
                        page: 1,
                        limit: 10,
                    }
                },
                mounted() {
                    this.getfansList();
                },
                methods: {
                    getfansList() {
                        var that = this;
                        Fast.api.ajax({
                            url: 'shopro/wechat/fans',
                            loading: true,
                            type: 'GET',
                            data: {
                                page: that.page,
                                limit: that.limit,
                                searchKey: that.searchKey,
                            }
                        }, function (ret, res) {
                            that.fansList = res.data.data;
                            that.totalPage = res.data.total;
                            return false;
                        })
                    },
                    handleSizeChange(val) {
                        this.limit = val
                        this.getfansList()
                    },
                    handleCurrentChange(val) {
                        this.page = val
                        this.getfansList()
                    },
                    viewBtn(openid) {
                        Fast.api.open('shopro/wechat/fans_user?openid='+openid,"查看详情")
                    },
                    getSync() {
                        var that = this;
                        Fast.api.ajax({
                            url: 'shopro/wechat/fans?act=async',
                            loading: true,
                            type: 'GET',
                            data: {}
                        }, function (ret, res) {
                            if (res.code == 1) {
                                that.getfansList();
                            }
                        })
                    }
                },
                watch: {
                    searchKey(newVal, oldVal) {
                        if (newVal != oldVal) {
                            this.page = 1;
                            this.getfansList();
                        }
                    }
                },
            })
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});