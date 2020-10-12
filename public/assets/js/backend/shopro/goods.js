define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'toastr'], function ($, undefined, Backend, Table, Form, Toastr) {

    var Controller = {
        index: function () {
            var goodsIndex = new Vue({
                el: "#goodsIndex",
                data() {
                    return {
                        goodsData: [],
                        multipleSelection: [],
                        activeStatus: 'all',
                        searchKey: '',
                        sort: 'id',
                        order: 'desc',
                        offset: 0,
                        limit: 10,
                        totalPage: 0,
                        currentPage: 1,
                        rowDel: false,
                        allDel: false,

                        upStatus: true,
                        currentIndex: null,
                    }
                },
                created() {
                    this.getGoodsData();
                },
                methods: {
                    getGoodsData() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/goods/index',
                            loading: true,
                            type: 'GET',
                            data: {
                                search: that.searchKey,
                                status: that.activeStatus,
                                offset: that.offset,
                                limit: that.limit,
                                sort: that.sort,
                                order: that.order,
                            }
                        }, function (ret, res) {
                            that.goodsData = res.data.rows;
                            that.goodsData.forEach(i => {
                                i.showFlag = false;
                                i.rowDel = false;
                            });
                            that.totalPage = res.data.total;
                            return false;
                        })
                    },
                    tabOpt(tab, event) {
                        this.activeStatus = tab.name
                    },
                    goodsOpt(type, id) {
                        let that = this;
                        switch (type) {
                            case 'create':
                                Fast.api.open('shopro/goods/add', '商品详情', {
                                    callback() {
                                        that.getGoodsData();
                                    }
                                })
                                break;
                            case 'edit':
                                Fast.api.open('shopro/goods/edit/ids/' + id + "?id=" + id + "&type=edit", '商品详情', {
                                    callback() {
                                        that.getGoodsData();
                                    }
                                })
                                break;
                            case 'down':
                                let idArr = []
                                if (that.multipleSelection.length > 0) {
                                    that.multipleSelection.forEach(i => {
                                        idArr.push(i.id)
                                    })
                                    let idss = idArr.join(',')
                                    that.editStatus(idss, 'down')
                                }
                                break;
                                case 'up':
                                let idArrup = []
                                if (that.multipleSelection.length > 0) {
                                    that.multipleSelection.forEach(i => {
                                        idArrup.push(i.id)
                                    })
                                    let idup = idArrup.join(',')
                                    that.editStatus(idup, 'up')
                                }
                                break;
                            case 'del':
                                let ids;
                                if (id) {
                                    ids = id;
                                } else {
                                    let idArr = []
                                    if (that.multipleSelection.length > 0) {
                                        that.multipleSelection.forEach(i => {
                                            idArr.push(i.id)
                                        })
                                        ids = idArr.join(',')
                                    }
                                }
                                if (ids) {
                                    that.$confirm('此操作将删除商品, 是否继续?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        Fast.api.ajax({
                                            url: 'shopro/goods/del/ids/' + ids,
                                            loading: true,
                                            type: 'GET'
                                        }, function (ret, res) {
                                            that.getGoodsData();
                                            return false;
                                        })
                                    }).catch(() => {
                                        this.$message({
                                            type: 'info',
                                            message: '已取消删除'
                                        });
                                    });
                                }
                                break;
                            case 'copy':
                                Fast.api.open('shopro/goods/edit/ids/' + id + "?id=" + id + "&type=copy", '商品详情', {
                                    callback() {
                                        that.getGoodsData();
                                    }
                                })
                                break;
                            default:
                        }
                    },
                    popoverOpt(index) {
                        this.currentIndex = index;
                    },
                    hideup() {
                        this.currentIndex = null;
                    },
                    sortOrder(sort, order) {
                        this.sort = sort;
                        this.order = order;
                        this.getGoodsData();
                    },
                    goRecycle() {
                        Fast.api.open('shopro/goods/recyclebin', '查看回收站')
                    },
                    goRefresh() {
                        this.getGoodsData();
                    },
                    handleSelectionChange(val) {
                        this.multipleSelection = val;
                    },
                    handleSizeChange(val) {
                        this.offset = 0
                        this.limit = val;
                        this.getGoodsData()
                    },
                    handleCurrentChange(val) {
                        this.offset = (val - 1) * this.limit;
                        this.getGoodsData()
                    },
                    editStatus(id, type) {
                        let that = this;
                        Fast.api.ajax({
                            url: `shopro/goods/setStatus/ids/${id}/status/${type}`,
                            loading: true,
                        }, function (ret, res) {
                            that.getGoodsData();
                            that.currentIndex = null;
                            return false;
                        })
                    },
                },
                watch: {
                    activeStatus(newVal, oldVal) {
                        if (newVal != oldVal) {
                            this.offset = 0;
                            this.limit = 10;
                            this.getGoodsData();
                        }
                    },
                    searchKey(newVal, oldVal) {
                        if (newVal != oldVal) {
                            this.offset = 0;
                            this.limit = 10;
                            this.getGoodsData();
                        }
                    },
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
                url: 'shopro/goods/recyclebin' + location.search,
                pk: 'id',
                sortName: 'deletetime',
                columns: [
                    [{
                            checkbox: true
                        },
                        {
                            field: 'id',
                            title: __('Id')
                        },
                        {
                            field: 'title',
                            title: __('Title'),
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
            Controller.initAddEdit(null, null, [], []);
        },
        edit: function () {
            let id = window.location.search.replace("?", '').split('&')[0].split('=')[1];
            let type = window.location.search.replace("?", '').split('&')[1].split('=')[1];
            Controller.initAddEdit(id, type, Config.skuList, Config.skuPrice);
        },
        select: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/goods/index?page_type=select',
                }
            });

            var idArr = [];
            var selectArr = [];
            var table = $("#table");

            table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                if (e.type == 'check' || e.type == 'uncheck') {
                    row = [row];
                } else {
                    idArr = [];
                    selectArr = []
                }
                $.each(row, function (i, j) {
                    if (e.type.indexOf("uncheck") > -1) {
                        var index = idArr.indexOf(j.id);
                        var indexall = idArr.indexOf(j);
                        if (index > -1) {
                            idArr.splice(index, 1);
                        }
                        if (indexall > -1) {
                            selectArr.splice(index, 1);
                        }
                    } else {
                        idArr.indexOf(j.id) == -1 && idArr.push(j.id);
                        selectArr.indexOf(j) == -1 && selectArr.push(j);
                    }
                });
            });
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                sortName: 'id',
                showToggle: false,
                showExport: false,
                columns: [
                    [{
                            field: 'state',
                            checkbox: true,
                        },
                        {
                            field: 'title',
                            title: __('Title'),
                            align: 'left'
                        },
                        {
                            field: 'image',
                            title: __('Image'),
                            operate: false,
                            events: Table.api.events.image,
                            formatter: Table.api.formatter.image
                        },
                        {
                            field: 'status_text',
                            title: __('Status'),
                            // formatter: Table.api.formatter.status,
                        },
                        {
                            field: 'createtime',
                            title: __('Createtime'),
                            formatter: Table.api.formatter.datetime,
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            sortable: true
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
                if (Backend.api.query('type') == 'activity') {
                    var multiple = Backend.api.query('multiple');
                    multiple = multiple == 'true' ? true : false;
                    Fast.api.close({
                        data: selectArr,
                        multiple: multiple
                    });
                } else {
                    let row = {}
                    var multiple = Backend.api.query('multiple');
                    multiple = multiple == 'true' ? true : false;
                    row.ids = idArr.join(",")
                    Fast.api.close({
                        data: row,
                        multiple: multiple
                    });
                }

            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            //绑定TAB事件
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                // var options = table.bootstrapTable(tableOptions);
                var typeStr = $(this).attr("href").replace('#', '');
                var options = table.bootstrapTable('getOptions');
                options.pageNumber = 1;
                options.queryParams = function (params) {
                    // params.filter = JSON.stringify({type: typeStr});
                    params.type = typeStr;
                    params.status = typeStr.replace('t-', '');
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
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        },
        initAddEdit: function (id, type, skuList, skuPrice) {
            //vue Sku添加页 添加规格和价格数据
            var goodsDetail = new Vue({
                el: "#goodsDetail",
                data() {
                    return {
                        editId: id,
                        type: type,

                        stepActive: 1,
                        goodsDetail: {},
                        goodsDetailMsg: {
                            category_ids: '',
                            category_ids_arr: [],
                            content: '',
                            dispatch_ids: '',
                            dispatch_ids_arr: [],
                            dispatch_type: '',
                            dispatch_type_arr: [],
                            image: '',
                            images: '',
                            // images_arr: [],
                            is_sku: 0,
                            original_price: '',
                            params: '',
                            params_arr: [],
                            price: '',
                            service_ids: '',
                            service_ids_arr: [],
                            show_sales: '',
                            status: 'up',
                            subtitle: '',
                            title: '',
                            type: 'normal',
                            views: '',
                            weigh: '',
                            weight: '',
                            stock: '',
                            sn: '',
                        },
                        rules: {
                            title: [{
                                required: true,
                                message: '请输入商品标题',
                                trigger: 'blur'
                            }],
                            subtitle: [{
                                required: true,
                                message: '请输入商品副标题',
                                trigger: 'blur'
                            }],
                            status: [{
                                required: true,
                                message: '请选择商品状态',
                                trigger: 'blur'
                            }],
                            image: [{
                                required: true,
                                message: '请上传商品主图',
                                trigger: 'change'
                            }],
                            images: [{
                                required: true,
                                message: '请上传商品轮播图',
                                trigger: 'change'
                            }],
                            category_ids_arr: [{
                                required: true,
                                message: '请选择商品分类',
                                trigger: 'change'
                            }],
                            dispatch_type: [{
                                required: true,
                                message: '请选择配送方式',
                                trigger: 'blur'
                            }],
                            dispatch_ids_arr: [{
                                required: true,
                                message: '请选择运费模板',
                                trigger: 'blur'
                            }],
                            is_sku: [{
                                required: true,
                                message: '请选择商品规格',
                                trigger: 'blur'
                            }],
                            price: [{
                                required: true,
                                message: '请输入价格',
                                trigger: 'blur'
                            }],
                            original_price: [{
                                required: true,
                                message: '请输入原价',
                                trigger: 'blur'
                            }],
                            weight: [{
                                required: true,
                                message: '请输入重量',
                                trigger: 'blur'
                            }],
                            stock: [{
                                required: true,
                                message: '请输入库存',
                                trigger: 'blur'
                            }],
                            sn: [{
                                required: true,
                                message: '请输入编号',
                                trigger: 'blur'
                            }],
                            service_ids_arr: [{
                                required: true,
                                message: '请选择服务标签',
                                trigger: 'blur'
                            }]
                        },
                        //选择分类
                        categoryOptions: [],

                        //服务
                        serviceOptions: [],
                        dispatchType: [],
                        dispatchOptions: [],

                        upload: Config.moduleurl,
                        editor: null,

                        //多规格
                        skuList: [],
                        // skuListLeng:0,
                        skuPrice: [],
                        skuListData: '',
                        skuPriceData: '',
                        skuModal: '',
                        childrenModal: [],
                        countId: 1,
                        allEditSkuName: '',
                        isEditInit: false, // 编辑时候初始化是否完成
                        isResetSku: 0,
                        allEditPopover: {
                            price: false,
                            stock: false,
                            weight: false,
                            sn: false,
                        },
                        allEditDatas: "",
                    }
                },
                created() {
                    if (this.editId) {
                        this.getEditData();
                    } else {
                        this.goodsDetail = JSON.parse(JSON.stringify(this.goodsDetailMsg));
                        this.getInit([], [])
                    }
                    this.getServiceOptions();
                    this.getDispatchType();
                    this.getCategoryOptions();
                },
                methods: {
                    getInit(skuList, skuPrice) {
                        // 记录每个规格项真实 id，对应的临时 id
                        let tempIdArr = {};
                        for (let i in skuList) {
                            // 为每个 规格增加当前页面自增计数器，比较唯一用
                            skuList[i]['temp_id'] = this.countId++
                            for (let j in skuList[i]['children']) {
                                // 为每个 规格项增加当前页面自增计数器，比较唯一用
                                skuList[i]['children'][j]['temp_id'] = this.countId++

                                // 记录规格项真实 id 对应的 临时 id
                                tempIdArr[skuList[i]['children'][j]['id']] = skuList[i]['children'][j]['temp_id']
                            }
                        }
                        // for (let i in skuPrice) {
                            for (var i=0;i<skuPrice.length;i++) {
                            let tempSkuPrice = skuPrice[i]
                            tempSkuPrice['temp_id'] = i + 1

                            // 将真实 id 数组，循环，找到对应的临时 id 组合成数组 
                            tempSkuPrice['goods_sku_temp_ids'] = [];
                            let goods_sku_id_arr = tempSkuPrice['goods_sku_ids'].split(',');
                            for (let ids of goods_sku_id_arr) {
                                tempSkuPrice['goods_sku_temp_ids'].push(tempIdArr[ids])
                            }

                            skuPrice[i] = tempSkuPrice
                        }
                        if (this.type == 'copy') {
                            for (let i in skuList) {
                                // 为每个 规格增加当前页面自增计数器，比较唯一用
                                skuList[i].id = 0;
                                for (let j in skuList[i]['children']) {
                                    skuList[i]['children'][j].id = 0;
                                }
                            }
                        }

                        this.skuList = skuList;
                        this.skuPrice = skuPrice;

                        setTimeout(() => {
                            // 延迟触发更新下面列表
                            this.isEditInit = true;
                        }, 200)
                    },
                    getEditData() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/goods/detail/ids/' + that.editId,
                            loading: true,
                        }, function (ret, res) {
                            that.goodsDetail = res.data.detail;
                            that.getInit(res.data.skuList, res.data.skuPrice);
                            return false;
                        })
                    },
                    submitForm(formName) {
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                let that = this;
                                let arrForm = JSON.parse(JSON.stringify(that.goodsDetail));
                                let categoryArr = []
                                arrForm.category_ids_arr.forEach(i => {
                                    categoryArr.push(i[i.length - 1])
                                })
                                arrForm.category_ids = categoryArr.join(',');
                                arrForm.params = JSON.stringify(arrForm.params_arr);
                                arrForm.content=$("#c-content").val();
                                delete arrForm.deletetime;
                                delete arrForm.updatetime;
                                delete arrForm.createtime;
                                if (arrForm.is_sku == 0) {
                                    that.skuList = [];
                                    that.skuPrice = [];
                                }
                                if (that.editId && that.type == 'edit') {
                                    Fast.api.ajax({
                                        url: 'shopro/goods/edit/ids/' + that.editId,
                                        loading: true,
                                        data: {
                                            row: arrForm,
                                            sku: {
                                                listData: JSON.stringify(that.skuList),
                                                priceData: JSON.stringify(that.skuPrice)
                                            }
                                        }
                                    }, function (ret, res) {
                                        Fast.api.close();
                                    })
                                } else {
                                    if (this.type == 'copy') {
                                        delete arrForm.id
                                    }
                                    Fast.api.ajax({
                                        url: 'shopro/goods/add',
                                        loading: true,
                                        data: {
                                            row: arrForm,
                                            sku: {
                                                listData: JSON.stringify(that.skuList),
                                                priceData: JSON.stringify(that.skuPrice)
                                            }
                                        }
                                    }, function (ret, res) {
                                        Fast.api.close();
                                    })
                                }

                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    },
                    resetForm(formName) {
                        this.$refs[formName].resetFields();
                    },
                    addImg(type, index, multiple) {
                        let that = this;
                        parent.Fast.api.open("general/attachment/select?multiple=" + multiple, "选择图片", {
                            callback: function (data) {
                                switch (type) {
                                    case "image":
                                        that.goodsDetail.image = data.url;
                                        break;
                                    case "images":
                                        that.goodsDetail.images = that.goodsDetail.images ? that.goodsDetail.images + ',' + data.url : data.url;
                                        break;
                                    case "sku":
                                        that.skuPrice[index].image = data.url;
                                        break;
                                }
                            }
                        });
                        return false;
                    },
                    delImg(type, index) {
                        let that = this;
                        switch (type) {
                            case "image":
                                that.goodsDetail.image = '';
                                break;
                            case "images":
                                let arr = that.goodsDetail.images.split(',');
                                arr.splice(index, 1);
                                that.goodsDetail.images = arr.join(',')
                                break;
                            case "sku":
                                that.skuPrice[index].image = '';
                                break;

                        }
                    },
                    changeGoodsType(type) {
                        this.goodsDetail.type = type;
                        this.getDispatchOptions();
                        this.goodsDetail.dispatch_ids_arr = [];
                        this.goodsDetail.dispatch_ids = '';
                    },
                    categoryChange(val) {
                        this.goodsDetail.category_ids = val.join(',');
                    },
                    serviceChange(val) {
                        this.goodsDetail.service_ids = val.join(',');
                    },
                    dispatchChange(val) {
                        this.goodsDetail.dispatch_ids = val.join(',');
                    },
                    dispatchTypeChange(val) {
                        this.goodsDetail.dispatch_type = val.join(',');
                        this.getDispatchOptions();
                    },
                    getCategoryOptions() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/category/getTree',
                            loading: false,
                        }, function (ret, res) {
                            that.categoryOptions = res.data
                            return false;
                        })
                    },
                    getDispatchType() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/dispatch/dispatch/typeList',
                            loading: false,
                        }, function (ret, res) {
                            let arr = []
                            for (key in res.data) {
                                arr.push({
                                    id: key,
                                    name: res.data[key]
                                })
                            }
                            that.dispatchType = arr;
                            return false;
                        })
                    },
                    getDispatchOptions() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/dispatch/dispatch/all',
                            loading: false,
                            type: 'GET',
                            data: {
                                type: that.goodsDetail.dispatch_type
                            }
                        }, function (ret, res) {
                            that.dispatchOptions = res.data
                            return false;
                        })
                    },
                    getServiceOptions() {
                        let that = this;
                        Fast.api.ajax({
                            url: 'shopro/goods_service/all',
                            loading: false,
                        }, function (ret, res) {
                            that.serviceOptions = res.data
                            return false;
                        })
                    },
                    gotoback(formName) {
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                this.stepActive++;
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    },
                    gonextback() {
                        this.stepActive--;
                    },
                    addParams() {
                        this.goodsDetail.params_arr.push({
                            title: '',
                            content: ''
                        })
                    },
                    delParams(index) {
                        this.goodsDetail.params_arr.splice(index, 1)
                    },

                    //添加主规格
                    addMainSku() {
                        // if (this.skuModal !== '') {
                        this.skuList.push({
                            id: 0,
                            temp_id: this.countId++,
                            name: this.skuModal,
                            pid: 0,
                            children: []
                        })
                        this.skuModal = '';
                        // this.skuPrice = []       // 新添加的主规格不清空 skuPrice,当添加主规格第一个子规格的时候清空
                        this.buildSkuPriceTable()
                        // }
                    },
                    //添加子规格
                    addChildrenSku(k) {
                        // if (this.childrenModal[k] !== '') {
                        // 检测当前子规格是否已经被添加过了
                        let isExist = false
                        this.skuList[k].children.forEach(e => {
                            if (e.name == this.childrenModal[k] && e.name != "") {
                                isExist = true
                            }
                        })

                        if (isExist) {
                            Toastr.error('子规格已存在');
                            return false;
                        }

                        this.skuList[k].children.push({
                            id: 0,
                            temp_id: this.countId++,
                            name: this.childrenModal[k],
                            pid: this.skuList[k].id,
                        })

                        this.childrenModal[k] = '';

                        // 如果是添加的第一个子规格，清空 skuPrice
                        if (this.skuList[k].children.length == 1) {
                            this.skuPrice = [] // 规格大变化，清空skuPrice
                            this.isResetSku = 1; // 重置规格
                        }

                        this.buildSkuPriceTable()
                        // }
                    },
                    //删除主规格
                    deleteMainSku(k) {
                        let data = this.skuList[k]

                        // 删除主规格
                        this.skuList.splice(k, 1)

                        // 如果当前删除的主规格存在子规格，则清空 skuPrice， 不存在子规格则不清空
                        if (data.children.length > 0) {
                            this.skuPrice = [] // 规格大变化，清空skuPrice
                            this.isResetSku = 1; // 重置规格
                        }

                        this.buildSkuPriceTable()
                    },
                    //删除子规格
                    deleteChildrenSku(k, i) {
                        let data = this.skuList[k].children[i]
                        this.skuList[k].children.splice(i, 1)

                        // 查询 skuPrice 中包含被删除的的子规格的项，然后移除
                        let deleteArr = []
                        this.skuPrice.forEach((item, index) => {
                            item.goods_sku_text.forEach((e, i) => {
                                if (e == data.name) {
                                    deleteArr.push(index)
                                }
                            })
                        })
                        deleteArr.sort(function (a, b) {
                            return b - a;
                        })
                        // 移除有相关子规格的项
                        deleteArr.forEach((i, e) => {
                            this.skuPrice.splice(i, 1)
                        })

                        // 当前规格项，所有子规格都被删除，清空 skuPrice
                        if (this.skuList[k].children.length <= 0) {
                            this.skuPrice = [] // 规格大变化，清空skuPrice
                            this.isResetSku = 1; // 重置规格
                        }
                        this.buildSkuPriceTable()
                    },
                    editStatus(i) {
                        if (this.skuPrice[i].status == 'up') {
                            this.skuPrice[i].status = 'down'
                        } else {
                            this.skuPrice[i].status = 'up'
                        }

                    },
                    //组合新的规格价格库存重量编码图片
                    buildSkuPriceTable() {
                        let arr = [];
                        //遍历sku子规格生成新数组，然后执行递归笛卡尔积
                        this.skuList.forEach((s1, k1) => {
                            let children = s1.children;
                            let childrenIdArray = [];
                            if (children.length > 0) {
                                children.forEach((s2, k2) => {
                                    childrenIdArray.push(s2.temp_id);
                                })

                                // 如果 children 子规格数量为 0,则不渲染当前规格, （相当于没有这个主规格）
                                arr.push(childrenIdArray);
                            }
                        })

                        this.recursionSku(arr, 0, []);
                    },
                    //递归找笛卡尔规格集合
                    recursionSku(arr, k, temp) {
                        if (k == arr.length && k != 0) {
                            let tempDetail = []
                            let tempDetailIds = []

                            temp.forEach((item, index) => {
                                for (let sku of this.skuList) {
                                    for (let child of sku.children) {
                                        if (item == child.temp_id) {
                                            tempDetail.push(child.name)
                                            tempDetailIds.push(child.temp_id)
                                        }
                                    }
                                }
                            })

                            let flag = false // 默认添加新的
                            for (let i = 0; i < this.skuPrice.length; i++) {
                                if (this.skuPrice[i].goods_sku_temp_ids.join(',') == tempDetailIds.join(',')) {
                                    flag = i
                                    break;
                                }
                            }

                            if (flag === false) {
                                this.skuPrice.push({
                                    id: 0,
                                    temp_id: this.skuPrice.length + 1,
                                    goods_sku_ids: '',
                                    goods_id: 0,
                                    weigh: 0,
                                    image: '',
                                    stock: 0,
                                    price: 0,
                                    sn: '',
                                    weight: 0,
                                    status: 'up',
                                    goods_sku_text: tempDetail,
                                    goods_sku_temp_ids: tempDetailIds,
                                });
                            } else {
                                this.skuPrice[flag].goods_sku_text = tempDetail
                                this.skuPrice[flag].goods_sku_temp_ids = tempDetailIds
                            }

                            return;
                        }
                        if (arr.length) {
                            for (let i = 0; i < arr[k].length; i++) {
                                temp[k] = arr[k][i]
                                this.recursionSku(arr, k + 1, temp)
                            }
                        }
                    },
                    allEditData(type, opt) {
                        switch (opt) {
                            case 'define':
                                this.skuPrice.forEach(i => {
                                    i[type] = this.allEditDatas;
                                })
                                this.allEditDatas = ''
                                this.allEditPopover[type] = false;
                                break;
                            case 'cancel':
                                this.allEditDatas = ''
                                this.allEditPopover[type] = false;
                                break;
                        }
                    }
                },
                watch: {
                    stepActive(newVal) {
                        this.editor = null;
                    },
                    goodsDetail: {
                        handler: function (newVal, oldVal) {
                            if (newVal.dispatch_type != oldVal.dispatch_type) {
                                this.getDispatchOptions();
                            }
                        },
                        deep: true
                    },
                    skuList: {
                        handler(newName, oldName) {
                            if (this.isEditInit) { // 编辑初始化的时候会修改 skuList 但这时候不触发更新
                                this.buildSkuPriceTable();
                            }
                        },
                        deep: true
                    }
                },
            })
            Controller.api.bindevent();
        }
    };
    return Controller;
});