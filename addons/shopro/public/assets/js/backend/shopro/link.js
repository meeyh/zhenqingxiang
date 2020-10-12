define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/link/index' + location.search,
                    add_url: 'shopro/link/add',
                    edit_url: 'shopro/link/edit',
                    del_url: 'shopro/link/del',
                    multi_url: 'shopro/link/multi',
                    table: 'shopro_link',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        { checkbox: true },
                        { field: 'id', title: __('Id') },
                        { field: 'name', title: __('Name') },
                        { field: 'path', title: __('Path') },
                        { field: 'group', title: __('Group') },
                        { field: 'createtime', title: __('Createtime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime },
                        { field: 'updatetime', title: __('Updatetime'), operate: 'RANGE', addclass: 'datetimerange', formatter: Table.api.formatter.datetime },
                        { field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate }
                    ]
                ]
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
                    params.group = typeStr;

                    return params;
                };
                table.bootstrapTable('refresh', {});
                return false;

            });

        },
        select: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/link/select',
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
                        { field: 'state', checkbox: true, },
                        { field: 'group', title: '组名', operate: false, searchList: Config.searchList, formatter: Table.api.formatter.normal },
                        { field: 'name', title: __('Name'), align: 'left' },
                        { field: 'path', title: '路径' },
                        {
                            field: 'operate', title: __('Operate'), events: {
                                'click .btn-chooseone': function (e, value, row, index) {
                                    var multiple = Backend.api.query('multiple');
                                    multiple = multiple == 'true' ? true : false;
                                    row.path_name=row.group?row.group+'-'+row.name:row.name
                                    switch (row.path) {
                                        case '/pages/app/coupon/detail':
                                            Fast.api.open("shopro/coupons/select", __('Choose'), {
                                                callback: function (data) {
                                                    row.path_name +='-'+data.data.name
                                                    row.path +='?id=' + data.data.id.toString()
                                                    Fast.api.close({ data: row, multiple: multiple });
                                                }
                                            });
                                            break;
                                        case '/pages/goods/list':
                                            Fast.api.open("shopro/category/select", __('Choose'), {
                                                callback: function (data) {
                                                    row.path_name +='-'+data.data.category_name
                                                    row.path +='?id=' + data.data.id.toString()
                                                    Fast.api.close({ data: row, multiple: multiple });
                                                }
                                            });
                                            break;
                                        case '/pages/goods/detail/index':
                                            Fast.api.open("shopro/goods/select", __('Choose'), {
                                                callback: function (data) {                                                 
                                                    row.path_name +=data.data.name?'-'+data.data.name:''
                                                    row.path +='?id=' + data.data.id.toString()
                                                    Fast.api.close({ data: row, multiple: multiple });
                                                }
                                            });
                                            break;
                                            case '/pages/public/richtext':
                                            Fast.api.open("shopro/richtext/select", __('Choose'), {
                                                callback: function (data) {                                                 
                                                    row.path_name +=data.data.name?'-'+data.data.name:''
                                                    row.path +='?id=' + data.data.id.toString()
                                                    Fast.api.close({ data: row, multiple: multiple });
                                                }
                                            });
                                            break;
                                            case '/pages/public/poster/index':
                                                layer.open({
                                                    title:"海报信息",
                                                    type: 1,
                                                    skin: 'layui-layer-rim', //加上边框
                                                    area: ['300px', '200px'], //宽高
                                                    content: `
                                                    <div>
                                                    <div style="display:flex;justify-content: space-around;
                                                    align-items: center;height:120px"><div style="width: 100px;
                                                    height: 50px;
                                                    line-height: 50px;
                                                    border: 1px solid #e5e5e5;
                                                    text-align: center;cursor: pointer;" id="user">个人海报</div>
                                                    <div style="width: 100px;
                                                    height: 50px;
                                                    line-height: 50px;
                                                    border: 1px solid #e5e5e5;
                                                    text-align: center;cursor: pointer;" id="goods">商品海报</div></div>
                                                    </div>`
                                                  });
                                                  $(document).on("click","#user",function(){
                                                      $("#user").css({'color':"#f00"});
                                                      $("#goods").css({'color':"#000"})
                                                      row.path_name ='个人海报'
                                                      row.path=row.path+'?posterType=user'
                                                      Fast.api.close({ data: row, multiple: multiple });
                                                  })
                                                  $(document).on("click","#goods",function(){
                                                    $("#goods").css({'color':"#f00"});
                                                    $("#user").css({'color':"#000"})
                                                    Fast.api.open("shopro/goods/select", __('Choose'), {
                                                        callback: function (data) {      
                                                            row.path_name ='商品海报'
                                                            row.path +='?posterType=goods&id=' + data.data.id.toString()
                                                            Fast.api.close({ data: row, multiple: multiple });
                                                        }
                                                    });
                                                })
                                            break;
                                            case '/pages/index/view':
                                            Fast.api.open("shopro/decorate/select?type=custom", __('Choose'), {
                                                callback: function (data) {  
                                                    row.name +=data.data.name?'-'+data.data.name:'';
                                                    row.path_name=row.name
                                                    row.path +='?id=' + data.data.id.toString()
                                                    Fast.api.close({ data: row, multiple: multiple });
                                                }
                                            });
                                            break;
                                            
                                        default:
                                            Fast.api.close({ data: row, multiple: multiple });


                                    }
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
                var pathArr = new Array();
                var pathId= new Array();
                $.each(table.bootstrapTable("getAllSelections"), function (i, j) {
                    pathArr.push(j.path);
                    pathId.push(j.id)
                });
                var multiple = Backend.api.query('multiple');
                multiple = multiple == 'true' ? true : false;
                let data={
                    path:pathArr.join(","),
                    pathId:pathId.join(",")
                }
                Fast.api.close({ data, multiple: multiple });
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
                    params.group = typeStr;

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
                url: 'shopro/link/recyclebin' + location.search,
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
                                    url: 'shopro/link/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'shopro/link/destroy',
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
            $(document).on("click", ".goods-select", function () {
                $(this).css("border", "1px solid #fb6638")
            })
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