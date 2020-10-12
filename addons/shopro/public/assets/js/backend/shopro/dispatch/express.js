requirejs.config({
    paths: {
        vue: "/assets/addons/shopro/libs/vue"
    }
})
define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'vue'], function ($, undefined, Backend, Table, Form, Vue) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/dispatch/express/index' + location.search,
                    add_url: 'shopro/dispatch/express/add',
                    edit_url: 'shopro/dispatch/express/edit',
                    del_url: 'shopro/dispatch/express/del',
                    multi_url: 'shopro/dispatch/express/multi',
                    table: 'shopro_dispatch_express',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                columns: [
                    [
                        { checkbox: true },
                        { field: 'id', title: __('Id') },
                        { field: 'name', title: __('Name') },
                        { field: 'type', title: __('Type'), searchList: { "number": __('Type number'), "weight": __('Type weight') }, formatter: Table.api.formatter.normal },
                        { field: 'weigh', title: __('Weigh') },
                        { field: 'first_price', title: __('First_price'), operate: 'BETWEEN' },
                        { field: 'additional_num', title: __('Additional_num') },
                        { field: 'additional_price', title: __('Additional_price'), operate: 'BETWEEN' },
                        // { field: 'province_ids', title: __('Province_ids') },
                        // { field: 'city_ids', title: __('City_ids') },
                        { field: 'createtime', title: __('Createtime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime },
                        { field: 'updatetime', title: __('Updatetime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime },
                        { field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
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
                url: 'shopro/dispatch/express/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        { checkbox: true },
                        { field: 'id', title: __('Id') },
                        { field: 'name', title: __('Name'), align: 'left' },
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
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'shopro/dispatch/express/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'shopro/dispatch/express/destroy',
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
            var vueAdd = new Vue({
                el: "#app",
                data() {
                    return {
                        pcaData: Config.pca,
                    }
                },
                mounted() {
                },
                methods: {
                    allopt(){
                        this.pcaData.forEach(i=>{
                            i.flagRight=1;
                            i.flagLeft=0;
                        })
                    },
                    selectAreaLeft(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].flagRight = 1
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagRight", '1')
                                element.area.forEach(item => {
                                    this.$set(item, "flagRight", '1')

                                })

                            });
                            this.pcaData[p].flagLeft = 0
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagLeft", '0')
                                element.area.forEach(item => {
                                    this.$set(item, "flagLeft", '0')

                                })

                            });

                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].flagRight = 1
                            this.pcaData[p].city[c].flagRight = 1
                            this.pcaData[p].city[c].flagLeft = 0
                            let num = 0;
                            this.pcaData[p].city.forEach(i => {
                                if (i.flagLeft == 1) {
                                    num++
                                }
                            })
                            if (num == 0) {
                                this.pcaData[p].flagLeft = 0
                                this.pcaData[p].city[c].area.forEach(element => {
                                    this.$set(element, "flagRight", 1)
                                });
                            }
                        }
                        if (a != null && c != null) {
                            this.pcaData[p].flagRight = 1
                            this.pcaData[p].city[c].flagRight = 1
                            this.pcaData[p].city[c].area[a].flagRight = 1
                            this.pcaData[p].city[c].area[a].flagLeft = 0
                            let num2 = 0;
                            this.pcaData[p].city[c].area.forEach(i => {
                                if (i.flagLeft == 1) {
                                    num2++
                                }
                            })
                            if (num2 == 0) {
                                this.pcaData[p].city[c].flagLeft = 0
                                let num = 0;
                                this.pcaData[p].city.forEach(i => {
                                    if (i.flagLeft == 1) {
                                        num++
                                    }
                                })
                                if (num == 0) {
                                    this.pcaData[p].flagLeft = 0
                                }
                            }

                        }
                    },
                    showLeft(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].city.forEach(element => {
                                
                                this.$set(element, "showLeft",element.showLeft==1?0:1 )

                            });
                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].city[c].area.forEach(element => {
                                this.$set(element, "showLeft", element.showLeft==1?0:1 )

                            });

                        }

                    },
                    selectAreaRight(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].flagLeft = 1
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagLeft", 1)
                                element.area.forEach(item => {
                                    this.$set(item, "flagLeft", 1)

                                })

                            });
                            this.pcaData[p].flagRight = 0
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagRight ", 0)
                                element.area.forEach(item => {
                                    this.$set(item, "flagRight ", 0)

                                })

                            });

                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].flagLeft = 1
                            this.pcaData[p].city[c].flagLeft = 1
                            this.pcaData[p].city[c].flagRight = 0
                            let num = 0;
                            this.pcaData[p].city.forEach(i => {
                                if (i.flagRight == 1) {
                                    num++
                                }
                            })
                            if (num == 0) {
                                this.pcaData[p].flagRight = 0;
                                this.pcaData[p].city[c].area.forEach(element => {
                                    this.$set(element, "flagLeft", 1)
                                });
                            }
                        }
                        if (a != null && c != null) {
                            this.pcaData[p].flagLeft = 1
                            this.pcaData[p].city[c].flagLeft = 1
                            this.pcaData[p].city[c].area[a].flagLeft = 1
                            this.pcaData[p].city[c].area[a].flagRight = 0
                            let num2 = 0;
                            this.pcaData[p].city[c].area.forEach(i => {
                                if (i.flagRight == 1) {
                                    num2++
                                }
                            })
                            if (num2 == 0) {
                                this.pcaData[p].city[c].flagRight = 0
                                let num = 0;
                                this.pcaData[p].city.forEach(i => {
                                    if (i.flagRight == 1) {
                                        num++
                                    }
                                })
                                if (num == 0) {
                                    this.pcaData[p].flagRight = 0
                                }
                            }

                        }
                    },
                    showRight(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "showRight", element.showRight==1?0:1 )

                            });

                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].city[c].area.forEach(element => {
                                this.$set(element, "showRight", element.showRight==1?0:1 )

                            });
                        }
                    },
                },

            })
            //为了性能考虑,特意加阻断事件，拼接表单数据
            $(document).on("click", "#submitBtn", function(){
                let pri = []
                let city = []
                let area = []
                vueAdd.$data.pcaData.forEach(p => {
                    if (p.flagLeft == 0 && p.flagRight == 1) {
                        pri.push(p.id)

                    } else {
                        if (!Array.isArray(p.city)) {
                            return false;
                        }
                        p.city.forEach(c => {

                            if (c.flagLeft == 0 && c.flagRight == 1) {
                                city.push(c.id)

                            } else {
                                if (!Array.isArray(c.area)) {
                                    return false;
                                }
                                c.area.forEach(a => {
                                    if (a.flagLeft == 0 && a.flagRight == 1) {
                                        area.push(a.id)

                                    }
                                })
                            }
                        })

                    }
                })
                let arr=[{
                    name:"province",
                    value:pri
                },
                    {
                        name:"city",
                        value:city
                    },
                    {
                        name:"area",
                        value:area
                    }]
                $("#area-data").val(JSON.stringify(arr))
                var that = this;
                Layer.confirm('确认提交运费模板吗?', {
                    btn: ['确认','取消'] //按钮
                }, function(){

                    $(that).closest("form").trigger("submit");
                    return true;
                }, function(){
                    Layer.closeAll();
                    return false;
                });
            });
            Controller.api.bindevent();
        },
        edit: function () {
            var vueAdd = new Vue({
                el: "#app",
                data() {
                    return {
                        pcaData: Config.pca,
                    }
                },
                mounted() {
                },
                methods: {
                    allopt(){
                        this.pcaData.forEach(i=>{
                            i.flagRight=1;
                            i.flagLeft=0;
                        })
                    },
                    selectAreaLeft(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].flagRight = 1
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagRight", '1')
                                element.area.forEach(item => {
                                    this.$set(item, "flagRight", '1')

                                })

                            });
                            this.pcaData[p].flagLeft = 0
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagLeft", '0')
                                element.area.forEach(item => {
                                    this.$set(item, "flagLeft", '0')

                                })

                            });

                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].flagRight = 1
                            this.pcaData[p].city[c].flagRight = 1
                            this.pcaData[p].city[c].flagLeft = 0
                            let num = 0;
                            this.pcaData[p].city.forEach(i => {
                                if (i.flagLeft == 1) {
                                    num++
                                }
                            })
                            if (num == 0) {
                                this.pcaData[p].flagLeft = 0
                            }

                            this.pcaData[p].city[c].area.forEach(element => {
                                this.$set(element, "flagRight", '1')
                            });

                        }
                        if (a != null && c != null) {
                            this.pcaData[p].flagRight = 1
                            this.pcaData[p].city[c].flagRight = 1
                            this.pcaData[p].city[c].area[a].flagRight = 1
                            this.pcaData[p].city[c].area[a].flagLeft = 0
                            let num2 = 0;
                            this.pcaData[p].city[c].area.forEach(i => {
                                if (i.flagLeft == 1) {
                                    num2++
                                }
                            })
                            if (num2 == 0) {
                                this.pcaData[p].city[c].flagLeft = 0
                                let num = 0;
                                this.pcaData[p].city.forEach(i => {
                                    if (i.flagLeft == 1) {
                                        num++
                                    }
                                })
                                if (num == 0) {
                                    this.pcaData[p].flagLeft = 0
                                }
                            }

                        }
                    },
                    showLeft(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].city.forEach(element => {

                                this.$set(element, "showLeft",element.showLeft==1?0:1 )

                            });
                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].city[c].area.forEach(element => {
                                this.$set(element, "showLeft", element.showLeft==1?0:1 )

                            });

                        }

                    },
                    selectAreaRight(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].flagLeft = 1
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagLeft", '1')
                                element.area.forEach(item => {
                                    this.$set(item, "flagLeft", '1')

                                })

                            });
                            this.pcaData[p].flagRight = 0
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "flagRight ", '0')
                                element.area.forEach(item => {
                                    this.$set(item, "flagRight ", '0')

                                })

                            });

                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].flagLeft = 1
                            this.pcaData[p].city[c].flagLeft = 1
                            this.pcaData[p].city[c].flagRight = 0
                            let num = 0;
                            this.pcaData[p].city.forEach(i => {
                                if (i.flagRight == 1) {
                                    num++
                                }
                            })
                            if (num == 0) {
                                this.pcaData[p].flagRight = 0
                            }

                            this.pcaData[p].city[c].area.forEach(element => {
                                this.$set(element, "flagLeft", '1')
                            });

                        }
                        if (a != null && c != null) {
                            this.pcaData[p].flagLeft = 1
                            this.pcaData[p].city[c].flagLeft = 1
                            this.pcaData[p].city[c].area[a].flagLeft = 1
                            this.pcaData[p].city[c].area[a].flagRight = 0
                            let num2 = 0;
                            this.pcaData[p].city[c].area.forEach(i => {
                                if (i.flagRight == 1) {
                                    num2++
                                }
                            })
                            if (num2 == 0) {
                                this.pcaData[p].city[c].flagRight = 0
                                let num = 0;
                                this.pcaData[p].city.forEach(i => {
                                    if (i.flagRight == 1) {
                                        num++
                                    }
                                })
                                if (num == 0) {
                                    this.pcaData[p].flagRight = 0
                                }
                            }

                        }
                    },
                    showRight(p, c, a) {
                        if (a === null && c === null) {
                            this.pcaData[p].city.forEach(element => {
                                this.$set(element, "showRight", element.showRight==1?0:1 )

                            });

                        }
                        if (a === null && c !== null) {
                            this.pcaData[p].city[c].area.forEach(element => {
                                this.$set(element, "showRight", element.showRight==1?0:1 )

                            });
                        }
                    },
                },

            })
            //为了性能考虑,特意加阻断事件，拼接表单数据
            $(document).on("click", "#submitBtn", function(){
                let pri = []
                let city = []
                let area = []
                vueAdd.$data.pcaData.forEach(p => {
                    if (p.flagLeft == 0 && p.flagRight == 1) {
                        pri.push(p.id)

                    } else {
                        p.city.forEach(c => {

                            if (c.flagLeft == 0 && c.flagRight == 1) {
                                city.push(c.id)

                            } else {
                                c.area.forEach(a => {
                                    if (a.flagLeft == 0 && a.flagRight == 1) {
                                        area.push(a.id)

                                    }
                                })
                            }
                        })

                    }
                })
                let arr=[{
                    name:"province",
                    value:pri
                },
                    {
                        name:"city",
                        value:city
                    },
                    {
                        name:"area",
                        value:area
                    }]
                $("#area-data").val(JSON.stringify(arr))
                var that = this;
                Layer.confirm('确认提交运费模板吗?', {
                    btn: ['确认','取消'] //按钮
                }, function(){

                    $(that).closest("form").trigger("submit");
                    return true;
                }, function(){
                    Layer.closeAll();
                    return false;
                });
            });
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