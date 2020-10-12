define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            var vueOrder = new Vue({
                el: "#order-con",
                data() {
                    return {
                        screenType: false,
                        activeScreen: [],
                        selectDate: [],
                        orderScreenList: {},
                        orderSelectType: ['all', 'all', 'all', 'all', 'all'],
                        tableOrderStatus: '全部',
                        orderList: [],
                        multipleSelection: [],
                        searchKey: '',
                        dialogVisible: false,
                        deliverForm: {
                            express_ids: '',
                            express_name: '',
                            express_no: ''
                        },
                        disabledBtn: false,
                        //分页
                        currentPage: 1,
                        totalPage: 0,
                        offset: 0,
                        limit: 10,
                        dispatchList: [],
                        dispatchListItem: [],
                        orderStatus: {
                            '全部': 'all',
                            '已失效': 'invalid',
                            '已取消': 'cancel',
                            '待付款': 'nopay',
                            '已发货': 'noget',
                            '待发货': 'nosend',
                            '未评价': 'nocomment',
                            '售后': 'aftersale',
                            '已支付': 'payed',
                            '已完成': 'finish',
                            '退款': 'refund'
                        },
                        orderStatusSend: {
                            'nosend': '待发货',
                            'aftersale': '售后',
                            'payed': '已支付',
                            'refund': '退款'
                        },
                        totalStatus: '',
                        dialogOptVisible: false,
                        optList: [],
                        focusi: false,
                    }
                },
                mounted() {
                    if (decodeURI(window.location.search.substring(1).split('&')[0].split('=')[0]) == 'status') {
                        this.selectDate = decodeURI(window.location.search.substring(1).split('&')[1].split('=')[1]).split(' - ')
                        this.tableOrderStatus = this.orderStatusSend[decodeURI(window.location.search.substring(1).split('&')[0].split('=')[1])]
                    }
                    this.reqOrderList()
                    this.reqOrderScreenList()
                },
                methods: {
                    //筛选
                    changeSwitch() {
                        if (this.screenType) {
                            this.orderSelectType = ['all', 'all', 'all', 'all', 'all']
                        } else {
                            this.orderSelectType = []
                        }
                    },
                    changeSelectType(listIndex, findex, index) {
                        this.$set(this.orderSelectType, findex, this.orderScreenList[listIndex][index].type)
                    },
                    reqOrderScreenList() {
                        var that = this;
                        Fast.api.ajax({
                            url: 'shopro/order/order/getType',
                            loading: true,
                            type: 'GET',
                            data: {}
                        }, function (ret, res) {
                            that.orderScreenList = res.data
                            return false;
                        })
                    },
                    //导出
                    goExport() {
                        var that = this;
                        let selectDates = that.selectDate ? (that.selectDate.length > 0 ? moment(that.selectDate[0]).format("YYYY-MM-DD HH:mm:ss") + ' - ' + moment(that.selectDate[1]).format("YYYY-MM-DD HH:mm:ss") : '') : '';
                        window.location.href = "order/export?sort=id&order=desc&search=" + that.searchKey + "&offset=" + that.offset + "&limit=" + that.limit + "&type=" + that.orderSelectType[2] + "&pay_type=" + that.orderSelectType[3] + "&platform=" + that.orderSelectType[0] + "&activity_type=" + that.orderSelectType[4] + "&dispatch_type=" + that.orderSelectType[1] + "&status=" + that.orderStatus[that.tableOrderStatus] + "&datetimerange=" + selectDates;
                    },
                    //请求
                    reqOrderList() {
                        var that = this;
                        let selectDates = that.selectDate ? (that.selectDate.length > 0 ? moment(that.selectDate[0]).format("YYYY-MM-DD HH:mm:ss") + ' - ' + moment(that.selectDate[1]).format("YYYY-MM-DD HH:mm:ss") : '') : '';
                        Fast.api.ajax({
                            url: 'shopro/order/order/index',
                            loading: true,
                            type: 'GET',
                            data: {
                                sort: 'id',
                                order: 'desc',
                                search: that.searchKey,
                                offset: that.offset,
                                limit: that.limit,
                                type: that.orderSelectType[2],
                                pay_type: that.orderSelectType[3],
                                platform: that.orderSelectType[0],
                                activity_type: that.orderSelectType[4],
                                dispatch_type: that.orderSelectType[1],
                                status: that.orderStatus[that.tableOrderStatus],
                                datetimerange: selectDates
                            }
                        }, function (ret, res) {

                            that.orderList = res.data.rows;
                            that.totalPage = res.data.total;
                            that.focusi = false;
                            return false;
                        })
                    },
                    screenEmpty() {
                        this.orderSelectType = ['all', 'all', 'all', 'all', 'all']
                    },
                    handleSelectionChange(val) {
                        this.multipleSelection = val;
                    },
                    //分页(更换页面显示条数)
                    handleSizeChange(val) {
                        this.offset = 0
                        this.limit = val
                        this.reqOrderList()
                    },
                    //当前是第几页
                    handleCurrentChange(val) {
                        this.offset = (val - 1) * this.limit
                        this.reqOrderList()
                    },
                    goDetail(id) {
                        Fast.api.open('shopro/order/order/detail?id=' + id, "查看详情");

                    },
                    godeliver(item, index) {
                        this.dispatchList = item
                        this.dispatchListItem = []
                        this.dispatchListItem.push(item.item[index])
                        this.dialogVisible = true
                    },
                    handleClose() {
                        this.dialogVisible = false
                        this.deliverForm.express_ids = ''
                        this.deliverForm.express_name = '',
                            this.deliverForm.express_no = ''
                    },
                    deliverSubmit() {
                        this.dialogVisible = false
                        var that = this;
                        Fast.api.ajax({
                            url: `shopro/order/order/send/id/${that.dispatchList.id}/item_id/${that.deliverForm.express_ids}`,
                            loading: true,
                            data: {
                                express_name: that.deliverForm.express_name,
                                express_no: that.deliverForm.express_no
                            }
                        }, function (ret, res) {
                            that.orderGoodsList = [];
                            res.data.item.forEach(item => {
                                that.orderGoodsList.push(item)
                            });
                            that.reqOrderList();
                            that.deliverForm.express_ids = '';
                            that.deliverForm.express_name = '';
                            that.deliverForm.express_no = '';
                        })
                    },
                    deliverSelectionChange(val) {
                        let express_ids = []
                        val.forEach(i => {
                            express_ids.push(i.id)

                        })
                        this.deliverForm.express_ids = express_ids.join(',')
                    },
                    objectSpanMethod({
                        row,
                        column,
                        rowIndex,
                        columnIndex
                    }) {
                        if (columnIndex !== 0) {
                            // return [3, 4];
                        }
                    },
                    goGroupon(type, id) {
                        let that = this;
                        if (id == 0) {
                            return false;
                        }
                        if (type == "groupon") {
                            parent.Fast.api.open(`shopro/activity/groupon/detail/id/${id}`, "查看详情", {
                                callback(data) {
                                    that.reqOrderList()
                                }
                            });
                        }
                    },
                    optHandle(id) {
                        let that = this;
                        Fast.api.ajax({
                            url: `shopro/order/order/actions/id/${id}`,
                            loading: true,
                            data: {}
                        }, function (ret, res) {
                            that.optList = res.data;
                            that.dialogOptVisible = true
                            return false;
                        })
                    },
                    goOrderRefresh() {
                        this.focusi = true;
                        this.reqOrderList()
                    }
                },
                watch: {
                    deliverForm: {
                        handler: function (newVal) {
                            if (newVal.express_ids && newVal.express_name && newVal.express_no) {
                                this.disabledBtn = true
                            } else {
                                this.disabledBtn = false
                            }
                        },
                        deep: true
                    },
                    searchKey(newval, val) {
                        if (newval != val) {
                            this.offset = 0;
                            this.reqOrderList()
                        }
                    },
                    tableOrderStatus(newval, val) {
                        if (newval != val) {
                            this.offset = 0;
                            this.reqOrderList()
                        }
                    },
                    selectDate: {
                        handler: function (newval, val) {
                            if (newval != val) {
                                this.offset = 0;
                                this.reqOrderList()
                            }
                        },
                        deep: true
                    }
                }
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
                url: 'shopro/order/order/recyclebin' + location.search,
                pk: 'type',
                sortName: 'type',
                columns: [
                    [{
                            checkbox: true
                        },
                        {
                            field: 'type',
                            title: __('type')
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
                            wtypeth: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [{
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'shopro/order/order/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'shopro/order/order/destroy',
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
        detail: function () {
            var vue = new Vue({
                el: "#orderDetail",
                data() {
                    return {
                        orderDetail: Config.order,
                        orderDetailCopy: JSON.parse(JSON.stringify(Config.order)),
                        orderGoodsList: Config.item,
                        orderFrom: {},
                        express_name: "",
                        express_no: "",
                        isexpress: true,
                        stepActive: 0,
                        activeName: 'first',
                        deliveryActive: 0,
                        deliveryFlag: false,
                        refund_statusFlag: false,
                        aftersale_statusFlag: false,
                        deliverForm: {
                            express_name: '',
                            express_no: '',
                            express_ids: ''
                        },
                        deliveryEditFlag: false,
                        disabledBtn: false,
                        dialogVisible: false,
                        refund_money: '',
                        refuse_reason: "",
                        refund_dialog: false,
                        refund_orderId: '',
                        refund_itemId: '',
                        refund_type: '',
                        addMemoFlag: false,
                        receivingAddress: [],
                        receivingAddressName: [],
                        areaList: [],
                        gg: '此订单有问题，待议此订单有问题，待议此订单有问题，待议此订单有问题，待议此订单有问题，待议此订单有问题，待议'
                    }
                },
                mounted() {
                    if (this.orderDetail.status <= 0) {
                        this.stepActive = 1
                    } else if (this.orderDetail.status == 1) {
                        this.orderGoodsList.forEach(i => {
                            if (i.dispatch_status == 1 || i.dispatch_status == 2) {
                                this.deliveryFlag = true
                            }
                            if (i.dispatch_status == 0) {
                                this.deliveryFlag = false
                            }
                            if (i.refund_status == 1) {
                                this.refund_statusFlag = true
                            }
                            if (i.aftersale_status == 1) {
                                this.aftersale_statusFlag = true
                            }
                        })
                        this.stepActive = this.deliveryFlag ? 3 : 2;
                    } else {
                        this.stepActive = 4
                    }
                    this.receivingAddress.push(this.orderDetail.province_id);
                    this.receivingAddress.push(this.orderDetail.city_id);
                    this.receivingAddress.push(this.orderDetail.area_id)
                    this.receivingAddressName.push(this.orderDetail.province_name);
                    this.receivingAddressName.push(this.orderDetail.city_name);
                    this.receivingAddressName.push(this.orderDetail.area_name)
                },
                methods: {
                    handleClick(tab, event) {},
                    godeliver() {
                        this.dialogVisible = true
                    },
                    deliverSelectionChange(val) {
                        let express_ids = []
                        val.forEach(i => {
                            express_ids.push(i.id)
                        })
                        this.deliverForm.express_ids = express_ids.join(',')
                    },
                    deliverSubmit() {
                        this.dialogVisible = false
                        var that = this;
                        Fast.api.ajax({
                            url: `shopro/order/order/send/id/${that.orderDetail.id}/item_id/${that.deliverForm.express_ids}`,
                            loading: true,
                            data: {
                                express_name: that.deliverForm.express_name,
                                express_no: that.deliverForm.express_no
                            }
                        }, function (ret, res) {
                            that.orderDetail = res.data
                            that.orderGoodsList = res.data.item
                            that.deliveryFlag = false
                            that.orderGoodsList.forEach(i => {
                                if (i.dispatch_status == 1 || i.dispatch_status == 2) {
                                    that.deliveryFlag = true
                                }
                                if (i.dispatch_status == 0) {
                                    that.deliveryFlag = false
                                }
                            })
                            that.stepActive = that.deliveryFlag ? 3 : 2
                            for (let key in that.deliverForm) {
                                that.deliverForm[key] = ''
                            }
                        })
                    },
                    handleClose() {
                        this.dialogVisible = false;
                        for (let key in this.deliverForm) {
                            this.deliverForm[key] = ''
                        };
                        this.refund_money = '';
                        this.refund_dialog = false;
                    },
                    finishService(orderId, itemId) {
                        var that = this
                        Fast.api.ajax({
                            url: `shopro/order/order/aftersaleFinish/id/${orderId}/item_id/${itemId}`,
                            loading: true,
                            data: {}
                        }, function (ret, res) {
                            that.orderGoodsList = []
                            res.data.forEach(item => {
                                that.orderGoodsList.push(item)
                            })
                            that.aftersale_statusFlag = false
                            that.orderGoodsList.forEach(i => {
                                if (i.aftersale_status == 1) {
                                    that.aftersale_statusFlag = true
                                }
                            })
                        })
                    },
                    refundHandle(orderId, itemId, type) {
                        this.refund_dialog = true
                        this.refund_orderId = orderId
                        this.refund_itemId = itemId
                        this.refund_type = type
                    },
                    reqRefund() {
                        let that = this
                        if (this.refund_type == 'agree') {
                            Fast.api.ajax({
                                url: `shopro/order/order/refund/id/${that.refund_orderId}/item_id/${that.refund_itemId}`,
                                loading: true,
                                data: {
                                    refund_money: that.refund_money
                                }
                            }, function (ret, res) {
                                that.refund_statusFlag = false
                                that.orderGoodsList = []
                                res.data.forEach(item => {
                                    that.orderGoodsList.push(item)
                                })
                                that.refund_dialog = false;
                                that.refund_money = "";
                                that.orderGoodsList.forEach(i => {
                                    if (i.refund_status == 1) {
                                        that.refund_statusFlag = true
                                    }
                                })
                            })
                        } else {
                            Fast.api.ajax({
                                url: `shopro/order/order/refundRefuse/id/${that.refund_orderId}/item_id/${that.refund_itemId}`,
                                loading: true,
                                data: {
                                    refund_msg: that.refuse_reason
                                }
                            }, function (ret, res) {
                                that.refund_statusFlag = false
                                that.orderGoodsList = []
                                res.data.forEach(item => {
                                    that.orderGoodsList.push(item)
                                })
                                that.refund_dialog = false;
                                that.refuse_reason = "";
                                that.orderGoodsList.forEach(i => {
                                    if (i.refund_status == 1) {
                                        that.refund_statusFlag = true
                                    }
                                })
                            })
                        }

                    },
                    reqCancel() {
                        this.refund_dialog = false;
                        this.refund_money = "";
                        this.refuse_reason = ""
                    },
                    copyMsg() {
                        let clipboard = new Clipboard('.copy-msg')
                        clipboard.on('success', function () {
                            alert("复制成功")
                        });
                        clipboard.on('error', function () {
                            alert("复制失败")
                        });
                    },
                    deliveryEdit() {
                        var that = this;
                        Fast.api.ajax({
                            url: `shopro/area/getCascader`,
                            loading: true,
                            data: {}
                        }, function (ret, res) {
                            that.areaList = res.data;
                            that.deliveryEditFlag = true;
                            return false;
                        })
                    },
                    deliveryDefine() {
                        let that = this;
                        Fast.api.ajax({
                            url: `shopro/order/order/editConsignee/id/${that.orderDetail.id}`,
                            loading: true,
                            data: {
                                consignee: that.orderDetail.consignee,
                                phone: that.orderDetail.phone,
                                province_id: that.receivingAddress[0],
                                province_name: that.receivingAddressName[0],
                                city_id: that.receivingAddress[1],
                                city_name: that.receivingAddressName[1],
                                area_id: that.receivingAddress[2],
                                area_name: that.receivingAddressName[2],
                                address: that.orderDetail.address,
                            }
                        }, function (ret, res) {
                            that.orderDetail = res.data
                            that.deliveryEditFlag = false;
                        })
                    },
                    changeAddress(value) {
                        let that = this;
                        that.receivingAddress = value
                        let arr = []
                        that.areaList.forEach((i, index) => {
                            if (i.id == that.receivingAddress[0]) {
                                arr.push(i.label)
                                if (i.children.length > 0) {
                                    i.children.forEach((j, inde) => {
                                        if (j.id == that.receivingAddress[1]) {
                                            arr.push(j.label)
                                            if (j.children.length > 0) {
                                                j.children.forEach(k => {
                                                    if (k.id == that.receivingAddress[2]) {
                                                        arr.push(k.label)
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                        that.receivingAddressName = arr
                    },
                    viewEvaluation(order_item_id) {
                        parent.Fast.api.open("shopro/goods_comment/index?order_item_id=" + order_item_id, "查看评价");
                    },
                    addMemo(type) {
                        if (type == 'cancel') {
                            this.addMemoFlag = false;
                            this.orderDetail.memo = this.orderDetailCopy.memo;
                        } else {
                            this.addMemoFlag = true;
                        }
                    },
                    addMemoreq(id) {
                        var that = this;
                        Fast.api.ajax({
                            url: `shopro/order/order/editMemo/id/${id}`,
                            loading: true,
                            data: {
                                memo: that.orderDetail.memo,
                            }
                        }, function (ret, res) {
                            that.orderDetail = res.data;
                            that.addMemoFlag = false
                        })
                    },
                    cancelOrder(id) {
                        var that = this;
                        Fast.api.ajax({
                            url: `shopro/order/order/cancel/id/${id}`,
                            loading: true,
                            data: {}
                        }, function (ret, res) {
                            that.orderDetail = res.data;
                        })
                    }

                },
                watch: {
                    deliverForm: {
                        handler: function (newVal) {
                            if (newVal.express_ids && newVal.express_name && newVal.express_no) {
                                this.disabledBtn = true
                            } else {
                                this.disabledBtn = false
                            }
                        },
                        deep: true
                    },
                }
            })
            $('.more-ellipsis').each(function (i, obj) {
                var lineHeight = parseInt($(this).css("line-height"));
                var height = parseInt($(this).height());
                if ((height / lineHeight) > 2) {
                    $(this).addClass("more-ellipsis-after")
                    $(this).css("height", "36px");
                } else {
                    $(this).removeClass("more-ellipsis-after");
                }
            });
            Controller.api.bindevent();
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