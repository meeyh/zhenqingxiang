define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shopro/area/index' + location.search,
                    add_url: 'shopro/area/add',
                    edit_url: 'shopro/area/edit',
                    del_url: 'shopro/area/del',
                    multi_url: 'shopro/area/multi',
                    table: 'shopro_area',
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
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name')},
                        {field: 'pid', title: __('Pid')},
                        {field: 'level', title: __('Level')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
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
        area_select: function () {
            var areaSelect = new Vue({
                el: "#app",
                data() {
                    return {
                        pcaData: Config.pca,
                    }
                },
                mounted() {
                },
                methods: {
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
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});