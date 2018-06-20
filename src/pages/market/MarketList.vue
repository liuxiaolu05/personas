<template id="tpl-app-list">
       <div id="app-list">
         <div v-show="path=='main'">
             <div class="panel panel-default">
                 <div class="groups form-condition">
                     <Select v-model="q.eventType" class="w-md"  clearable disabled placeholder="全部渠道">
                         <Option v-for="item in channels" :value="item.value" :key="item.value">{{item.label}}</Option>
                     </Select>
                     <Select v-model="q.status" class="w-md" placeholder="全部状态" clearable >
                         <Option v-for="item in states" :value="item.value" :key="item.value">{{item.label}}</Option>
                     </Select>
                     <Input class="w-md" v-model="q.eventName" placeholder="请输入营销活动名称" @keyup.enter.native="query"></Input>
                     <Button type="primary" class="search" @click="query" >查询</Button>
                     <Button type="primary" @click="add">新建营销活动</Button>
                 </div>
             </div>
             <div class="table">
                 <div class="table-wrap">
                     <Table class="table" ref="table" border stripe
                            :data="tableData.list" :columns="tableData.columns" :no-data-text="tableData.noDataText"
                     ></Table>
                 </div>
                 <div style="margin: 10px; margin-bottom: 60px;">
                     <div id="page" class="i-pull-right page">
                         <Page size="small" placement="top" show-sizer show-total show-elevator
                               :total="tableData.totalCount" :current="tableData.currentPage"
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
    import "@/assets/css/market"
    import enterRouter from '@/assets/js/enterRouter.js';
    export default{
        extends: enterRouter,
        data: function () {
            var _vm = this;
            return {
                node:18,
                eventType: "1",
                q: {
                    eventType: "",
                    status: "",
                    eventName: ''
                },
                tableData: {
                    list: [],
                    columns: [
                        {
                            title: '营销活动名称',
                            key: 'eventName',
                            ellipsis: true,
                            render: function (h, params) {
                                return h('span', {
                                    domProps: {
                                        title: params.row.eventName
                                    },
                                    style: {
                                        width: "100%",
                                        cursor: "default"
                                    }
                                }, params.row.eventName)
                            }
                        },
                        {
                            title: '营销周期',
                            key: 'rangeTime',
                            render:function(h,params){
                                var begin=DateFormat(params.row.pushBegainDate).toString("yyyy.MM.dd"),
                                    end=DateFormat(params.row.pushEndDate).toString("yyyy.MM.dd");
                                return h('div',{},begin+'-'+end)
                            }
                        },
                        {
                            title: '营销渠道',
                            key: 'eventType',
                            render:function(h){
                                var row=this.row,column=this.column,
                                        textInfo=({
                                            "0": ["短信"],
                                            "1": ["邮件"],
                                            "2": ["DSP广告"],
                                            "3": ["PUSH推送"],
                                        })[row[column.key]];
                                return h('span',textInfo[0])
                            }
                        },
                        //营销状态
                        {
                            key: 'status',
                            renderHeader: function (h) {
                                return h('div', {
                                            style: {
                                                display: 'inline-block'
                                            }
                                        }, [
                                            h('span', {}, '状态'),
                                            h('Tooltip', {
                                                        attrs: {
                                                            content: '待投放：未到设置的营销周期\n' +
                                                            '投放中：在设置的营销周期内\n' +
                                                            '暂停:已到营销活动开始时间、未到营销活动结束时间，但在投放过程中被人工暂停'+
                                                            '已终止：投放周期已经结束',
                                                            placement: 'bottom',
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
                                                    ]
                                            )
                                        ]
                                )
                            },
                            render: function (h) {
                                var row=this.row,column=this.column,
                                        textInfo=({
                                            "0":["待投放"],
                                            "1":["投放中"],
                                            "3":["已暂停"],
                                            "2":["已终止"]
                                        })[row[column.key]];
                                textInfo || (textInfo=["待投放"]);
                                return h('span',{},textInfo[0])
                            }
                        },
                        {
                            title: '用户名',
                            key: 'createUser'
                        },
                        /*
                         * 0：待投放 操作：查看 删除
                         * 1：投放中 操作：查看 数据
                         * 2：已终止 操作：查看 数据
                         * */
                        {
                            title: '操作',
                            render:function(h,params){
                                var row=this.row,status=row.status,id=row.eventId,
                                    isCurrentUser = top.$.cookie('username') == row.createUser,
                                    actions=[
                                            //查看
                                            h('a',{
                                                domProps:{
                                                    innerHTML:"<i></i>查看"
                                                },
                                                on:{
                                                    click:function(){
                                                        _vm.$store.state.path="sub";
                                                        _vm.$router.push({
                                                            path:'/market/marketList.html/detail',
                                                            query:{eventId: id}
                                                        })
                                                    }
                                                }
                                            })
                                        ];
                                   if(isCurrentUser){
                                      status==0 &&  actions.push(h('a',{
                                          domProps: {
                                              innerHTML: "<i></i>删除"
                                          },
                                          on:{
                                              click:function(){
                                                  _vm.$Modal.confirm({
                                                      title: '提示信息',
                                                      content:'是否确定删除此条记录?',
                                                      cancelText:'取消',
                                                      onOk: function() {
                                                          //axios.get('http://10.112.75.12:8073/smallPortrait-1.0.0/community/deleteRemark',{params:{id:id,createUser:createUser}})
                                                          axios.get(getUrl('marketEvent/deleteMarketEvent'),{params:{eventId:id}})
                                                                  .then(function(res){
                                                                      if(res.code==0){
                                                                          //vm.searchList(id);
                                                                          _vm.$Message.success("操作成功");
                                                                          _vm.reload();
                                                                      }else {
                                                                          _vm.$Message.warning(res.msg)
                                                                      }
                                                                  }).catch(function(err){
                                                                     console.log(err);
                                                          })

                                                      },
                                                  });
                                              }
                                          }
                                      }));
                                       status==1 && actions.push(h('a',{
                                           domProps: {
                                               innerHTML: "<i></i>暂停"
                                           },
                                           on:{
                                               click:function(){
                                                   _vm.$Modal.confirm({
                                                       title: '提示信息',
                                                       content:'是否暂停该营销活动，暂停后短信将不再发送?',
                                                       cancelText:'否',
                                                       okText:'是',
                                                       onOk: function() {
                                                           axios.get(getUrl('marketEvent/updateMarketEventStatus'),{params:{eventId:id,status:status}})
                                                                   .then(function(res){
                                                                       if(res.code==0){
                                                                           _vm.$Message.success("操作成功");
                                                                           _vm.reload();
                                                                       }else {
                                                                           _vm.$Message.warning(res.msg)
                                                                       }
                                                                   }).catch(function(err){
                                                               console.log(err);
                                                           })

                                                       },
                                                   });
                                               }
                                           }
                                       }));
                                       status==3 && actions.push(h('a',{
                                           domProps: {
                                               innerHTML: "<i></i>开启"
                                           },
                                           on:{
                                               click:function(){
                                                   _vm.$Modal.confirm({
                                                       title: '提示信息',
                                                       content:'是否启动该营销活动，启动后将恢复短信发送?',
                                                       cancelText:'否',
                                                       okText:'是',
                                                       onOk: function() {
                                                           axios.get(getUrl('marketEvent/updateMarketEventStatus'),{params:{eventId:id,status:status}})
                                                                   .then(function(res){
                                                                       if(res.code==0){
                                                                           _vm.$Message.success("操作成功");
                                                                           _vm.reload();
                                                                       }else {
                                                                           _vm.$Message.warning(res.msg)
                                                                       }
                                                                   }).catch(function(err){
                                                               console.log(err);
                                                           })

                                                       },
                                                   });
                                               }
                                           }
                                       }))
                                       if(status!=0){
                                           actions.push(h('a',{
                                               domProps:{
                                                   innerHTML:'<i></i>数据'
                                               },
                                               on:{
                                                   click:function(){
                                                       _vm.$store.state.path="sub";
                                                       _vm.$router.push({
                                                           path: '/message/message.html/messageDetail',
                                                           query: {id: params.row.eventId,name:params.row.eventName}
                                                       })

                                                   }
                                               }
                                           }))
                                       }
                                   }
                                return h('div',{domProps: {className: "groups gap-sm"}},actions)
                            }
                        }
                    ],
                    noDataText: '',
                    totalCount: 0,
                    sizeopt: [10, 20, 50, 100],
                    size: 10,
                    currentPage: 1,
                }
            }
        },
        methods: {
            query:function(){
                this.tableData.currentPage=1;
                this.reload();
            },
            reload: function () {
                var _vm = this,
                obj = $.extend({
                    currPage: this.tableData.currentPage,
                    pageSize: this.tableData.size
                }, _vm.q);
                axios.get(getUrl("marketEvent/getMarketEventList"), {
                    params: obj,
                    loading: true,
                    unload: true
                }).then(function (res) {
                  if(res.code==0){
                      var page = res.pager;
                      page.list && page.list.length > 0 || (page.list = []);
                      _vm.tableData.noDataText = page.list.length > 0 ? '' : '暂无数据';
                      page.list.forEach(function(v,i){
                          v.beginTime = DateFormat(v.beginTime).toString("yyyy.MM.dd");
                          v.endTime = DateFormat(v.endTime).toString("yyyy.MM.dd");
                      })
                      $.extend(_vm.tableData,page)
                  }else {
                      _vm.tableData.noDataText = '暂无数据';
                  }
                }).catch(function(err){
                    _vm.tableData.noDataText = '暂无数据';
                    console.log(err);
                })
            },
            add:function(){
                this.$store.state.path="sub";
                this.$router.push("/market/marketList.html/add");
            },
            changePage:function(e){
                this.tableData.currentPage=e;
                this.reload();
            },
            changeSize:function(e){
                this.tableData.currentPage = 1;
                this.tableData.size=e;
                this.reload();
            }
        },
        computed: {
            states: function () {
                return this.$store.state.messageStates;
            },
            channels: function () {
                return this.$store.state.channels;
            },
            path:function(){
                return this.$store.state.path;
            }
        },
        mounted: function () {
            this.reload();
        },
    }
</script>
<style>
    html, body {
        height: 100%;
    }
</style>