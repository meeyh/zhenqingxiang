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
                    index_url: 'shopro/app/score_shop/index' + location.search,
                    add_url: 'shopro/app/score_shop/add',
                    edit_url: 'shopro/app/score_shop/edit',
                    del_url: 'shopro/app/score_shop/del',
                    multi_url: 'shopro/app/score_shop/multi',
                    table: 'shopro_goods',
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
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {
                            field: 'image',
                            title: __('Image'),
                            events: Table.api.events.image,
                            formatter: Table.api.formatter.image
                        },
                        {field: 'title', title: __('Title')},
                        {
                            field: 'status',
                            title: __('Status'),
                            searchList: {
                                "up": __('Status up'),
                                "hidden": __('Status hidden'),
                                "down": __('Status down')
                            },
                            formatter: Table.api.formatter.status
                        },
                        {field: 'weigh', title: __('Weigh')},                       
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
                url: 'shopro/goods/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title'), align: 'left'},
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
                                    url: 'shopro/goods/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'shopro/goods/destroy',
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
            var vue = new Vue({
                el: "#selectGoods",
                data() {
                    return {
                        goodsList: Config.goodsList?Config.goodsList:[],
                    }
                },
                mounted() {   
                },
                methods: {
                    selectDelete(i){
                        this.goodsList.splice(i,1)
                    }
                },
                watch:{
                    goodsList: {
                        handler: function (newVal) {
                            $("#goodsList").val(JSON.stringify(newVal))
                        },
                        deep: true
                    },
                }
            })
            //添加商品
            $(document).on("click", ".chooseGoods", function () {
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                vue.$data.goodsList=[]
                parent.Fast.api.open("shopro/goods/select?multiple="+multiple, "选择商品", {
                    callback: function (data) {
                        vue.$data.goodsList.push(data.data)                       
                    }
                });
                return false;
            })
            $(document).on("click", ".chooseIntegralPrice", function () {
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                let id = $(this).attr("data-id")
                let idx = $(this).attr("data-index")               
                let actSkuPrice = $(this).attr("data-actSkuPrice")
                parent.Fast.api.open("shopro/app/score_shop/sku?goods_id=" + id + "&multiple=" + multiple + "&actSkuPrice=" + actSkuPrice+ "&id=0", "设置活动商品", {
                    callback: function (data) {
                        vue.$set(vue.$data.goodsList[idx], "opt", 1)
                        vue.$set(vue.$data.goodsList[idx], "actSkuPrice", data) 
                    }
                });
                return false;
            }) 
            $(document).on("click", "#scoreBtn", function () {
                let subFlag = true;
                let ordergoodslist = JSON.parse(JSON.stringify(vue.$data.goodsList))
                if(ordergoodslist.length==0){
                    Layer.msg('请选择商品');
                    return false;
                }
                let isPrice=false
                ordergoodslist.forEach(i => {
                    console.log(i.actSkuPrice)
                    if (i.actSkuPrice) {
                        let arr = []
                        JSON.parse(i.actSkuPrice).forEach(e => {
                            if (e.status == 'up') {
                                arr.push(e)
                            }
                        })
                        i.actSkuPrice = JSON.stringify(arr)
                        isPrice=true
                    }
                })
                if(!isPrice){
                    Layer.msg('请选择编辑价格');
                        return false;
                }
                $("#selectScore").val(JSON.stringify(ordergoodslist))
                if (subFlag) {
                    var that = this;
                    Layer.confirm('确认提交吗', {
                        btn: ['确认', '取消'] 
                    }, function () {
                        $(that).closest("form").trigger("submit");
                        Layer.closeAll();
                        return true;
                    }, function () {
                        Layer.closeAll();
                        return false;
                    });
                }
            });        
            Controller.api.bindevent();

        },
        sku: function () {
            var vueSku = new Vue({
                el: "#skuPrce",
                data() {
                    return {
                        skuList: Config.skuList,
                        skuPrice: Config.skuPrice,
                        actSkuPrice: Config.actSkuPrice,
                    }
                },
                mounted() {                   
                    let seleSkuPrice = decodeURI(window.location.search.substring(1).split('&')[2].split('=')[1])
                    if (seleSkuPrice!="undefined") {
                        JSON.parse(seleSkuPrice).forEach(i => {
                            this.actSkuPrice.forEach(e => {
                                if (i.sku_price_id == e.sku_price_id) {
                                    e.price = i.price
                                    e.status = i.status
                                    e.stock = i.stock
                                    e.score = i.score
                                }
                            })
                        })
                    }
                },
                methods: {
                    goJoin(i) {
                        let status = this.actSkuPrice[i].status === 'up' ? 'down' : 'up';
                        this.$set(this.actSkuPrice[i], 'status', status)
                    },
                },

            })
            $(document).on("click", "#sorceSub", function () {
                Layer.confirm('确认提交吗', {
                    btn: ['确认', '取消'] 
                }, function () {
                    let isSubmit = true
                    isSubmit = !(vueSku.$data.actSkuPrice.every(function (item, index, array) {
                        return item.status == 'down';
                    }))
                    vueSku.$data.actSkuPrice.forEach(i => {
                        if (i.status == 'up' && !i.stock) {
                            isSubmit = false
                        }
                        if (i.status == 'up' && !i.price) {
                            isSubmit = false
                        }
                        if (i.status == 'up' && !i.score) {
                            isSubmit = false
                        }
                    })
                    if (isSubmit) {
                        let arr=[]
                        vueSku.$data.actSkuPrice.forEach(i=>{
                            if(i.status=="up"){
                                arr.push(i)
                            }
                        })
                        Fast.api.close(JSON.stringify(arr));
                        return true;
                    } else {
                        layer.msg('请把信息填写完整');
                    }
                    return true;
                }, function () {
                    Layer.closeAll();
                    return false;
                });
            })
            Controller.api.bindevent();
        },
        edit: function () {
            var vue = new Vue({
                el: "#skuPrce",
                data() {
                    return {
                        goodsList: Config.goodsList?Config.goodsList:[],
                    }
                },
                mounted() { 
                },
                methods: {
                    selectDelete(i){
                        this.goodsList.splice(i,1)
                    }
                },
                watch:{
                    goodsList: {
                        handler: function (newVal) {
                            $("#goodsList").val(JSON.stringify(newVal))
                        },
                        deep: true
                    },
                }

            })
            $(document).on("click", ".chooseGoods", function () {
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                vue.$data.goodsList=[]
                parent.Fast.api.open("shopro/goods/select?multiple="+multiple, "选择商品", {
                    callback: function (data) {
                        vue.$data.goodsList.push(data.data)                       
                    }
                });
                return false;
            })
            $(document).on("click", ".chooseIntegralPrice", function () {
                var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                let id = $(this).attr("data-id")
                let idx = $(this).attr("data-index")               
                let actSkuPrice = $(this).attr("data-actSkuPrice")
                parent.Fast.api.open("shopro/app/score_shop/sku?goods_id=" + id + "&multiple=" + multiple + "&actSkuPrice=" + actSkuPrice, "设置活动商品", {
                    callback: function (data) {
                        vue.$set(vue.$data.goodsList[idx], "opt", 1)
                        vue.$set(vue.$data.goodsList[idx], "actSkuPrice", data)   
                    }
                });
                return false;
            })
            $(document).on("click", "#scoreBtn", function () {
                let subFlag = true;
                let ordergoodslist = JSON.parse(JSON.stringify(vue.$data.goodsList))
                ordergoodslist.forEach(i => {
                    if (i.actSkuPrice) {
                        let arr = []
                        JSON.parse(i.actSkuPrice).forEach(e => {
                            if (e.status == 'up') {
                                arr.push(e)
                            }
                        })
                        i.actSkuPrice = JSON.stringify(arr)
                    }
                })
                $("#selectScore").val(JSON.stringify(ordergoodslist))
                if (subFlag) {
                    var that = this;
                    Layer.confirm('确认提交吗', {
                        btn: ['确认', '取消'] 
                    }, function () {
                        $(that).closest("form").trigger("submit");
                        Layer.closeAll();
                        return true;
                    }, function () {
                        Layer.closeAll();
                        return false;
                    });
                }
            }); 
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        },
        select: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/goods/index',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                sortName: 'id',
                showToggle: false,
                showExport: false,
                columns: [
                    [
                        {field: 'state', checkbox: true,},
                        {field: 'title', title: __('Title'), align: 'left'},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'createtime', title: __('Createtime'), formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {
                            field: 'operate', title: __('Operate'), events: {
                                'click .btn-chooseone': function (e, value, row, index) {
                                    var multiple = Backend.api.query('multiple');
                                    multiple = multiple == 'true' ? true : false;
                                    row.ids=row.id.toString()
                                    Fast.api.close({data: row, multiple: multiple});
                                },
                            }, formatter: function () {
                                return '<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> ' + __('Choose') + '</a>';
                            }
                        }
                    ]
                ]
            });

            // 选中多个
            $(document).on("click", ".btn-choose-multi", function () {
                var goodsIdArr = new Array();
                $.each(table.bootstrapTable("getAllSelections"), function (i, j) {
                    goodsIdArr.push(j.id);
                });
                var multiple = Backend.api.query('multiple');
                multiple = multiple == 'true' ? true : false;
                let row={}
                row.ids=couponsArr.join(",")
                Fast.api.close({data: row, multiple: multiple});
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            //绑定TAB事件
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var typeStr = $(this).attr("href").replace('#', '');
                var options = table.bootstrapTable('getOptions');
                options.pageNumber = 1;
                options.queryParams = function (params) {
                    params.type = typeStr;

                    return params;
                };
                table.bootstrapTable('refresh', {});
                return false;

            });
            require(['upload'], function (Upload) {
                Upload.api.plupload($("#toolbar .plupload"), function () {
                    $(".btn-refresh").trigger("click");
                });
            });

        },
    };
    return Controller;
});