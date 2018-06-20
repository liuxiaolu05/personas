<template id="message-temp" >
    <div id="app-list" class="message-temp ">
       <div v-show="path=='main'">
           <div class="pandect">
               <div class="dashboard box-bot">
                   <Row :gutter="16">
                       <Col span="6">
                       <div class="vi-con bg-green">
                           <span class="v-icon icon-Cellnumber icon"></span>
                           <div v-text="yestdayData.yestdayPhones" class="v-num"></div>
                           <div class="vi-line"></div>
                           <div class="v-name">昨日手机个数</div>
                       </div>
                       </Col>
                       <Col span="6">
                       <div class="vi-con bg-pink">
                           <span class="v-icon icon-Totalsales icon"></span>
                           <div v-text="yestdayData.yestdayValidPhones" class="v-num"></div>
                           <div class="vi-line"></div>
                           <div class="v-name">昨日有效手机号</div>
                       </div>
                       </Col>
                       <Col span="6">
                       <div class="vi-con bg-violet">
                           <span class="v-icon icon-Totalorders icon"></span>
                           <div v-text="yestdayData.yestdaySuccess" class="v-num"></div>
                           <div class="vi-line"></div>
                           <div class="v-name">昨日发送成功数</div>
                       </div>
                       </Col>
                       <Col span="6">
                       <div class="vi-con bg-blue">
                           <span class="v-icon icon-Returnsthenumber icon"></span>
                           <div v-text="account" class="v-num"></div>
                           <div class="vi-line"></div>
                           <div class="v-name">当前账户余额</div>
                       </div>
                       </Col>
                   </Row>
               </div>
           </div>
           <Card>
               <p slot="title">近7日发送成功数趋势</p>
               <div class="echarts-box">
                   <div id="weekNumber" v-show="noData" style="width: 100%;height: 250px;"></div>
                   <div class="no-data" v-show="!noData">暂无数据</div>
               </div>
           </Card>
           <div class="activity">
               <div class="groups">
                   <Input v-model="eventName" class="w-260" placeholder="请输入营销活动名称"></Input>
                   <Button type="primary" @click="query">搜索</Button>
               </div>
               <div class="table">
                   <div class="table-wrap">
                       <Table  class="table" ref="table" border stripe :data="tableData.list" :columns="tableData.columns"
                               :no-data-text="tableData.noDataText"></Table>
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
       </div>
       <router-view v-show="path!='main'"></router-view>
    </div>
</template>
<script>
    import "@/assets/css/message.less"
    import enterRouter from '@/assets/js/enterRouter.js';
    var option,weekNumber;
    export default {
        extends: enterRouter,
        data:function(){
            var _vm = this;
            return {
                node:20,
                noData:true,
                weekNumber:{
                    date:[],
                    count:[]
                },
                account:0,
                yestdayData:{
                    yestdayPhones:0,
                    yestdayValidPhones:0,
                    yestdaySuccess:0,
                },
                eventName:null,
                tableData:{
                    list:[],
                    columns:[
                        {
                            title:'营销活动名称',
                            key:'eventName'
                        },
                        {
                            title:'手机号码个数',
                            key:'phones',
                            sortable: true,
                        },
                        {
                            title:'有效手机号个数',
                            key:'validPhones',
                            sortable: true,
                            sortType:'desc'
                        },
                        {
                            title:'发送成功数',
                            key:'successPhones',
                            sortable: true,
                        },
                        {
                            title:'发送失败数',
                            key:'failPhones',
                            sortable: true,
                        },
                        {
                            title:'操作',
                            render:function(h,params){
                              return h('a',{
                                  domProps:{
                                      innerHTML:"<i></i>数据明细"
                                  },
                                  on:{
                                      click:function(){
                                          _vm.$store.state.path="sub"
                                          _vm.$router.push({
                                              path: '/message/message.html/messageDetail',
                                              query: {id: params.row.eventId,name:params.row.eventName}
                                          })


                                      }
                                  }
                              })
                            }
                        },
                    ],
                    noDataText: '',
                    totalCount: 0,
                    currentPage:1,
                    size:10,
                    sizeopt:[10,20,50,100]
                }
            }
        },
        methods:{
            query:function(){
                this.tableData.currentPage=1;
                this.reload();
            },
            getEchartData:function(){
                var _vm=this;
                weekNumber = Echarts.init(document.getElementById("weekNumber"));
                axios.get(getUrl('marketEvent/messagesSuccessSevenDays')).then(function(res){
                    if(res.code==0 &&  res.sevenDaysSuccess.length>0){
                        let t=res.sevenDaysSuccess.reverse();
                        t.forEach(function(v,i){
                            _vm.weekNumber.date.push(v.createTime);
                            _vm.weekNumber.count.push(v.successPhones);
                        })
                        _vm.noData=true;
                        _vm.echartOptions();
                    }else {
                        _vm.noData=false;
                    }
                }).catch(function(err){
                    _vm.noData=false;
                    console.log(err);
                })
            },
            echartOptions:function(){
                var _vm=this;
                option = {
                    title: {
                        text: '近7日发送成功数趋势',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:_vm.weekNumber.date
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'短信营销',
                            type:'line',
                            data:_vm.weekNumber.count
                        },

                    ]
                };
                weekNumber.setOption(option);
                window.addEventListener('resize',function(){
                    var numberwidth = $('.echarts-box').width() || $('.line-box').width() ;
                    $('#weekNumber').css('width', numberwidth + 'px');
                    weekNumber.resize();
                })
            },
            reload:function(){
                var _vm = this;
                axios.get(getUrl('marketEvent/getMarketEventEffectList'),{
                    params: {
                        currPage: _vm.tableData.currentPage,
                        pageSize: _vm.tableData.size,
                        eventName:_vm.eventName
                    },
                }).then(function(res){
                    var page = res.pager;
                    page.list && page.list.length > 0 || (page.list = []);
                    _vm.tableData.noDataText = page.list.length > 0 ? '' : '暂无数据';
                    $.extend(_vm.tableData,page)

                }).catch(function(err){
                    _vm.tableData.noDataText = '暂无数据';
                    console.log(err);
                })
            },
            changePage:function(e){
                this.tableData.currentPage=e;
                this.reload();
            },
            changeSize:function(e){
                this.tableData.currentPage=1;
                this.tableData.size=e;
                this.reload();
            },
            getInfoData:function(){
                var _vm=this;
                axios.get(getUrl('marketEvent/getYestdayData')).then(function(res){
                    if(res.code==0){
                        _vm.yestdayData=res.yestdayData
                    }
                }).catch(function(err){
                    console.log(err);
                })
                axios.get(getUrl('marketEvent/getBalance')).then(function(res){
                     if(res.code==0){
                         _vm.account=res.counts;
                     }
                }).catch(function(err){
                    console.log(err);
                })
            },
        },
        computed:{
          path:function(){
              return this.$store.state.path
          }
        },
        mounted:function(){
            var numberwidth =  $('.echarts-box').width() || $('.line-box').width();
            $('#weekNumber').css('width', numberwidth  + 'px');
            this.getEchartData();
            this.reload();
            this.getInfoData();
        }
    }
</script>