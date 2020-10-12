define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/category/index',
                    add_url: 'shopro/category/add',
                    edit_url: 'shopro/category/edit',
                    del_url: 'shopro/category/del',
                    multi_url: 'shopro/category/multi',
                    dragsort_url: 'ajax/weigh',
                    table: 'shopro_category',
                }
            });

            var table = $("#table");
            var tableOptions = {
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                escape: false,
                pk: 'id',
                sortName: 'weigh',
                pagination: false,
                commonSearch: false,
                search: false,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'type', title: __('Type'), operate: false, searchList: Config.searchList, formatter: Table.api.formatter.normal},
                        {field: 'name', title: __('Name'), align: 'left'},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'weigh', title: __('Weigh')},
                        {field: 'status', title: __('Status'), operate: false, formatter: Table.api.formatter.status},
                        {
                            field: 'id',
                            title: '<a href="javascript:;" class="btn btn-success btn-xs btn-toggle"><i class="fa fa-chevron-up"></i></a>',
                            operate: false,
                            formatter: Controller.api.formatter.subnode
                        },
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            };
            // 初始化表格
            table.bootstrapTable(tableOptions);

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



            // 递归遍历所有子节点切换状态
            function toggle(obj, status) {
                // 切换当前元素状态
                $(obj).closest("tr").toggle(!status);

                var hasChild = $(obj).data('haschild');
                if (hasChild) {
                    $(obj).parents("tr").nextAll().find("a.btn[data-pid='" + $(obj).data('id') + "']").each(function () {
                        toggle(this, status)
                    })
                }
            }

            table.on('post-body.bs.table', function (e, settings, json, xhr) {
                //显示隐藏子节点
                $(".btn-node-sub").off("click").on("click", function (e) {
                    var shown = $(this).data("shown");
                    if (shown != undefined) {
                        var status = $(this).data("shown") ? true : false;
                    } else {
                        var status = true;
                    }

                    // 在当前节点记录状态
                    $(this).data("shown", !status);

                    $(this).parents('tr').nextAll().find("a.btn[data-pid='" + $(this).data('id') + "']").each(function() {
                        toggle(this, status)
                    })
                });


                // 全部展开合并
                $(".btn-toggle").off("click").on("click", function (e) {
                    var shown = $(this).data("shown");
                    if (shown != undefined) {
                        var status = $(this).data("shown") ? true : false;
                    } else {
                        var status = true;
                    }

                    // 在当前节点记录状态
                    $(this).data("shown", !status);

                    // 全部切换
                    $("a.btn-node-sub").each(function () {
                        $(this).closest("tr").toggle(!status);
                    });

                    // 顶级一直是 true
                    $("a.btn[data-pid=0]").each(function () {
                        $(this).closest("tr").toggle(true);
                    });
                });
            });
        },
        select: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/category/select',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                escape: false,
                search: false,
                sortName: 'id',
                showToggle: false,
                showExport: false,
                columns: [
                    [
                        {field: 'state', checkbox: true,},
                        {field: 'type', title: __('Type'), operate: false, searchList: Config.searchList, formatter: Table.api.formatter.normal},
                        {field: 'name', title: __('Name'), align: 'left'},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'createtime', title: __('Createtime'), formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {
                            field: 'operate', title: __('Operate'), events: {
                                'click .btn-chooseone': function (e, value, row, index) {
                                    var multiple = Backend.api.query('multiple');
                                    multiple = multiple == 'true' ? true : false;
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
                var urlArr = new Array();
                $.each(table.bootstrapTable("getAllSelections"), function (i, j) {
                    urlArr.push(j.url);
                });
                var multiple = Backend.api.query('multiple');
                multiple = multiple == 'true' ? true : false;
                Fast.api.close({url: urlArr.join(","), multiple: multiple});
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
        add: function () {
            Controller.api.bindevent();
            setTimeout(function () {
                $("#c-type").trigger("change");
            }, 100);
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            formatter: {
                subnode: function (value, row, index) {
                    return '<a href="javascript:;" data-toggle="tooltip" title="' + __('Toggle sub menu') + '" data-id="' + row.id + '" data-pid="' + row.pid + '" data-haschild="' + row.haschild + '" class="btn btn-xs '
                        + (row.haschild == 1 ? 'btn-success' : 'btn-default disabled') + ' btn-node-sub"><i class="fa fa-sitemap"></i></a>';
                }
            },
            bindevent: function () {
                $(document).on("change", "#c-type", function () {
                    $("#c-pid option[data-type='all']").prop("selected", true);
                    $("#c-pid option").removeClass("hide");
                    $("#c-pid option[data-type!='" + $(this).val() + "'][data-type!='all']").addClass("hide");
                    $("#c-pid").data("selectpicker") && $("#c-pid").selectpicker("refresh");
                });
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});