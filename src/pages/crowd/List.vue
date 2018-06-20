<template id="tpl-app-list">
    <div id="app-list">
        <div v-show="path=='main'">
            <div class="panel panel-default">
                <div class="groups form-condition">
                    <!--<Select v-model="channel"   clearable disabled placeholder="全部渠道">-->
                        <!--<Option v-for="item in channels" :value="item.value" :key="item.value">{{item.label}}</Option>-->
                    <!--</Select>-->
                    <Select v-model="q.status"  placeholder="全部状态" clearable >
                        <Option v-for="item in states" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                    <Input class="w-md" v-model="q.crowdName" placeholder="请输入人群名称" @keyup.enter.native="query"></Input>
                    <Button type="primary" class="search" @click="query" >查询</Button>
                    <Button type="primary" @click="add">新建人群</Button>
                </div>
            </div>
            <!--&lt;!&ndash;导出功能&ndash;&gt;-->
            <iframe src="" frameborder="0" id="down-load" style="display: none"></iframe>
            <div class="table">
                <div class="table-wrap">
                    <Table class="table" ref="table" border stripe
                           :data="tableData.list" :columns="tableData.columns" :no-data-text="tableData.noDataText"
                    ></Table>
                </div>
                <div style="margin: 10px; margin-bottom: 60px;">
                    <div id="page" class="i-pull-right page">
                        <Page size="small" placement="top" show-sizer show-total show-elevator
                              :total="tableData.totalCount" :current="tableData.currPage"
                              :page-size="tableData.size" :page-size-opts="tableData.sizeopt"
                              @on-change="changePage($event)" @on-page-size-change="changeSize">
                        </Page>
                    </div>
                </div>
            </div>
        </div>
        <router-view v-show="path!='main'"></router-view>
    </div>
</template>
<script>
    import "@/assets/css/crowd.less";
    import enterRouter from '@/assets/js/enterRouter.js';
    export default {
        data: function () {
            var _vm = this;
            return {
                node: 15,
                channel:"1",
                q: {
                    channel: "",
                    status: "",
                    crowdName: ''
                },
                tableData: {
                    list: [],
                    columns: [
                        {
                            title: '人群名称',
                            key: 'crowdName',
                            ellipsis: true,
                            render: function (h, params) {
                                return h('span', {
                                    domProps: {
                                        title: params.row.crowdName
                                    },
                                    style: {
                                        width: "100%",
                                        cursor: "default"
                                    }
                                }, params.row.crowdName)
                            }
                        },
                        {
                            title: '人群类型',
                            key: 'scenesType',
                            render: function (h,params) {
                                var column = this.column;
                                return h('div', _vm.$store.state.stagesMap[this.row[column.key]])
                            }
                        },
                        {
                            title: '有效日期',
                            key: 'rangeTime',
                            width: '200',
                            render: function (h, params) {
                                return h('div', {}, params.row.beginTime + '-' + params.row.endTime)
                            }
                        },
//                        {
//                            title: '同步渠道',
//                            key: 'channel',
//                            render: function (h) {
//                                var row = this.row, column = this.column,
//                                        textInfo = ({
//                                            "1": ["短信"],
//                                            "2": ["邮件"],
//                                            "3": ["app-push"],
//                                            "4": ["移动DSP"],
//                                            "5": ["DSP"]
//                                        })[row[column.key]];
//                                return h("span",  textInfo[0])
//                            }
//                        },
                        {
                            title: '当前覆盖人数',
                            key: 'coverUser'
                        },
                        // 人群状态（status 0：未开始；1：更新中；2：更新完成；3：过期）
                        {
                            key: "status",
                            renderHeader: function (h) {
                                return h('div', {
                                    style: {
                                        display: 'inline-block'
                                    }
                                }, [
                                    h('span', {}, '状态'),
                                    h('Tooltip', {
                                        attrs: {
                                            content: '未开始：未到设置的营销周期\n' +
                                            '更新中：在设置的营销周期内，但数据正在更新，还未更新完成\n' +
                                            '更新完成：在设置的营销周期内，数据已经更新完成\n' +
                                            '已过期：已经超过设置的营销周期',
                                            placement: 'bottom'
                                        },
                                        style: {
                                            display: 'inline-block'
                                        }
                                    }, [
                                        h('Icon', {
                                            attrs: {
                                                type: 'ios-help-outline'
                                            },
                                            style: {
                                                fontSize: '14px',
                                                marginLeft: '3px',
                                                cursor: 'pointer',
                                                width: '16px',
                                                height: '16px',
                                                fontWeight: 700,
                                                verticalAlign: 'middle'
                                            }
                                        })
                                    ])
                                ])
                            },
                            render: function (h) {
                                var row = this.row, column = this.column,
                                        textInfo = ({
                                            "0": ["未开始", "text-notstart"],
                                            "1": ["更新中", "text-info"],
                                            "2": ["更新完成", "text-success"],
                                            "3": ["已过期", "text-warning",],
                                        })[row[column.key]];
                                textInfo || (textInfo = ["未开始", "text-notstart"]);
                                return h("span", {domProps: {className: textInfo[1],}}, textInfo[0])
                            }
                        },
                        {
                            title: '创建人',
                            key: 'createUser'
                        },
                    /**根据记录的状态字段（status）来决定可用的操作
                     * 0：未开始。还没有开始更新，可用操作：查看、复制、删除
                     * 1：更新中。可用操作：查看、复制
                     * 2：更新完成。可用操作：查看、复制、导出（创建人是当前用户才可操作）、删除（创建人是当前用户才可操作）
                     * 3：过期。可用操作：查看、复制、删除（创建人是当前用户才可操作）
                     * */
                        {
                            title: '操作',// 查看、复制、导出、删除
                            render: function (h) {
                                var row = this.row,
                                        stage = row.scenesType, id = row.crowdId, status = row.status,
                                        isCurrentUser = _vm.$store.state.user.username == row.createUser,
                                        actions = [
                                            // 查看
                                            h("a", {
                                                domProps: {
                                                    innerHTML: "<i></i>查看"
                                                },
                                                on: {
                                                    click: function () {
                                                        _vm.$store.state.path= "sub";
                                                        _vm.$router.push({
                                                            name: 'crowdDetail',
                                                            query: {id: id, action: "detail", stage: stage}
                                                        })
                                                    }
                                                }
                                            }),
                                            // 复制
                                            h("a", {
                                                domProps: {

                                                    className: "copy",
                                                    innerHTML: "<i></i>复制"
                                                },
                                                on: {
                                                    click: function () {
                                                        _vm.$store.state.path="sub"
                                                        _vm.changeStages(stage, {
                                                            id: id,
                                                            action: "copy",
                                                            stage: stage
                                                        });
                                                    }
                                                }

                                            })
                                        ];
                                if(isCurrentUser){
                                    /**导出
                                     * 条件1：该记录的状态得是“更新完成”。status == 2
                                     * 条件2：该记录是当前用户创建的。username == createUser
                                     * */
//                                    status == 2 && actions.push(h("a", {
//                                        domProps: {
//                                            innerHTML: "<i></i>导出"
//                                        },
//                                        class: {
//                                            upload: true
//                                        },
//                                        on: {
//                                            click: function () {
//                                                document.getElementById("down-load").src = getUrl("crow/exportCrowdUsers") + "?crowdId=" + id;
//                                            }
//                                        }
//                                    }));
                                    /**删除
                                     * 条件1：该记录的状态得不是“更新中”。status != 1
                                     * 条件2：该记录是当前用户创建的。username == createUser
                                     * */
                                    (status == 0 || status == 3 ) && actions.push(h("a", {
                                        domProps: {
                                            innerHTML: "<i></i>删除"
                                        },
                                        class: {
                                            delete: true
                                        },
                                        on: {
                                            click: function () {
                                                _vm.$Modal.confirm({
                                                    title: "提示信息",
                                                    content: '是否确定删除此条信息?',
                                                    cancelText: '否',
                                                    onOk: function () {
                                                        axios.post(getUrl("crow/delete"), {crowdId: id}).then(function (res) {
                                                            if (res.code == 0) {
                                                                _vm.$Message.success("操作成功");
                                                                _vm.reload();
                                                            } else {
                                                                _vm.$Message.warning(res.msg)
                                                            }
                                                        })
                                                    },
                                                });
                                            }
                                        }
                                    }));
                                }
                                return h("div", {domProps: {className: "groups gap-sm"}}, actions)
                            }
                        }
                    ],
                    noDataText: '',
                    totalCount: 0,
                    sizeopt: [10, 20, 50, 100],
                    size: 10,
                    currentPage: 1,
                },
                tableWidth_: ''
            }
        },
        extends: enterRouter,
        computed: {
            states: function () {
                return this.$store.state.states
            },
            channels: function () {
                return this.$store.state.channels
            },
            path:function(){
                return this.$store.state.path
            }
        },
        methods: {
            query: function () {
                this.tableData.currentPage=1;
                this.reload();
            },
            add: function () {
                this.changeStages();
            },
            changeStages: function (stage, query) {
                // 跳转到指定的路由页面
                this.$store.state.path = "sub";
                this.$router.push({path: "/crowd/list.html/add/" + (stage || 'stage1'), query: query})
            },
            reload: function () {
                var _vm = this,
                        obj = $.extend({
                            currPage: this.tableData.currentPage,
                            pageSize: this.tableData.size
                        }, _vm.q);
                axios.get(getUrl("crow/list"), {
                    params: obj,
                    loading: true,
                    unload: true
                }).then(function (data) {
                    var page = data.pager;
                    page.list && page.list.length > 0 || (page.list = []);
                    _vm.tableData.noDataText = page.list.length > 0 ?  '' :  '暂无数据';
                    page.list.forEach(function (v, i) {
                        v.beginTime = DateFormat(v.beginTime).toString("yyyy.MM.dd");
                        v.endTime = DateFormat(v.endTime).toString("yyyy.MM.dd");
                        if (v.scenesType == 1) return v.scenesType = 'stage1'
                        if (v.scenesType == 2) return v.scenesType = 'other'
                        if (v.scenesType == 3) return v.scenesType = 'stage2'
                        if (v.scenesType == null) return v.scenesType = 'stage1'
                    })

                    $.extend(_vm.tableData, page);
                }).catch(function (err) {
                    _vm.tableData.noDataText = '暂无数据';
                })
            },
            // 表格页码切换
            changePage: function (page) {
                this.tableData.currentPage = page;
                this.reload();
            },
            // 表格显示条数切换
            changeSize: function (pageSize) {
                this.tableData.currentPage = 1;
                this.tableData.size = pageSize;
                this.reload();
            },
        },
        mounted: function () {
            this.reload();
        },
    }
</script>
