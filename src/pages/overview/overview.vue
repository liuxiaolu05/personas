<template>
    <div id="pandect" class="pandect">
        <div class="pandect-select form-condition i-pull-clear">
            <div class="form-group i-pull-left elli-select">
                <selection v-model="store.store"
                           default-index
                           :filterable="filterFlag"
                           @on-change="changeData"
                        placeholder="请选择门店" style="width:160px">
                    <selection-option v-for="item in store.storeData" :value="item" :key="item.name1" :label="item.name1"></selection-option>
                </selection>

            </div>
            <div class="i-pull-left icon">
                <Tooltip content="切换门店后，数据总览-昨日总销售额、昨日总订单数、昨日退货数量以及近7日订单与销售额趋势将刷新为所选门店数据" placement="bottom-start">
                    <span class="tip"><Icon type="help-circled"></Icon></span>
                </Tooltip>
            </div>
        </div>
        <div class="dashboard box-bot">
            <template>
                <Row :gutter="16">
                    <Col span="6">
                        <div class="vi-con bg-green">
                            <span class="v-icon icon-Cellnumber icon"></span>
                            <div v-text="num" class="v-num"></div>
                            <div class="vi-line"></div>
                            <div class="v-name">门店所在城市的小区数量</div>
                        </div>
                    </Col>
                    <Col span="6">
                        <div class="vi-con bg-pink">
                            <span class="v-icon icon-Totalsales icon"></span>
                            <div v-text="villageNum.gome_sale" class="v-num"></div>
                            <div class="vi-line"></div>
                            <div class="v-name">昨日总销售额</div>
                        </div>
                    </Col>
                    <Col span="6">
                        <div class="vi-con bg-violet">
                            <span class="v-icon icon-Totalorders icon"></span>
                            <div v-text="villageNum.gome_sale_count" class="v-num"></div>
                            <div class="vi-line"></div>
                            <div class="v-name">昨日总订单数</div>
                        </div>
                    </Col>
                    <Col span="6">
                        <div class="vi-con bg-blue">
                            <span class="v-icon icon-Returnsthenumber icon"></span>
                            <div v-text="villageNum.gome_refund_count" class="v-num"></div>
                            <div class="vi-line"></div>
                            <div class="v-name">昨日退货数量</div>
                        </div>
                    </Col>
                </Row>
            </template>
        </div>
        <div class="order-sale box-bot title-box">
            <div class="title">近7日订单与销售额</div>
            <div id="order-line" v-show="noData" class="order-line"></div>
            <div class="no-data" v-show="!noData">暂无数据</div>
        </div>
        <div class="ranking-list title-box">
            <div class=" title">
                <i class="icon icon-list"></i>
                <span>排行榜</span>
            </div>
            <div class="rank-table box-content">
                <Row :gutter="16">
                    <Col span="8">
                        <!--营销价值-->
                        <div class="col-table">
                            <div class="col-title">营销价值排名</div>
                            <Table :no-data-text="noDataInfo" border stripe :columns="tableData.marketValue" :data="tableData.marketData"></Table>
                        </div>
                    </Col>
                    <Col span="8">
                        <div class="col-table">
                            <div class="col-title">顾客覆盖排名</div>
                            <Table :no-data-text="noDataInfo" border stripe :columns="tableData.customerCoverage" :data="tableData.customerCoverageData"></Table>
                        </div>
                    </Col>
                    <Col span="8">
                        <div class="col-table">
                            <div class="col-title">小区订单排名</div>
                            <Table :no-data-text="noDataInfo" border stripe :columns="tableData.villageOrder" :data="tableData.villageOrderData"></Table>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<script>
    import "@/assets/css/villageStyle"
    import enterRouter from '@/assets/js/enterRouter.js';
    var option,//图表
        pctChart;//折线图
    export default {
        data: function(){
            var _this = this;
            return {
                num: 0,//小区数量
                noDataInfo: '',
                villageNum:{
                gome_sale: 0, //昨日总销售额 gome_sale
                gome_sale_count: 0,//昨日总订单数 gome_sale_count
                gome_refund_count: 0 //昨日退货数量 gome_refund_count   gome_refund
                },
                noData: true,
                cityId: null,
                store:{
                    store:'',
                    storeData: []
                },
                tableData: {
                    marketValue: [
                        {
                            title: '小区名称',
                            key: 'community_name',
                            align: 'center',
                            ellipsis: true,
                            render:function(h,params) {
                                return  h('span', {
                                    domProps: {
                                        title:params.row.community_name
                                    },
                                    style: {
                                        width:'100%',
                                        cursor:'default'
                                    }

                                },params.row.community_name )
                            }
                        },
                        {
                            //title: '营销价值评分',
                            align: 'center',
                            key: 'score',
                            renderHeader:function(h,params){
                                return h('div',{
                                    style: {
                                        display:'inline-block'
                                    }
                                },[
                                    h('span',{

                                    },'营销价值评分'),
                                    h('Tooltip',{
                                        attrs:{
                                            content:'小区营销价值是以小区的均价、开盘时间（最近成交量）、建筑距今时间、覆盖会员数为影响因素，将不同因素设定相应权重，通过算法建模计算的营销价值得分，得分越高表示营销价值越高',
                                            placement:'top'
                                        },
                                        style: {
                                            display:'inline-block'
                                        }
                                    },[
                                        h('Icon',{
                                            attrs: {
                                                type:'ios-help-outline'
                                            },
                                            style:{
                                                fontSize:'14px',
                                                color:'#333',
                                                marginLeft:'3px',
                                                cursor:'pointer',
                                                width:'16px',
                                                height:'16px',
                                                fontWeight:700,
                                                verticalAlign:'middle'
                                            }
                                        })
                                    ])
                                ])
                            }
                        },
                        {
                            title: '趋势',
                            key: 'trend',
                            align: 'center',
                            render: function(h, params) {
                                var upDown = _this.icon(params.row.trend);
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: upDown.upDown
                                        },
                                        style: {
                                            fontSize: '16px',
                                            color: upDown.color
                                        }
                                    })
                                ]);
                            }
                        }
                    ],
                            marketData: [],
                            customerCoverage:  [
                        {
                            title: '小区名称',
                            key: 'community_name',
                            align: 'center',
                            ellipsis: true,
                            render:function(h,params) {
                                return  h('span', {
                                    domProps: {
                                        title:params.row.community_name
                                    },
                                    style: {
                                        width:'100%',
                                        cursor:'default'
                                    }

                                },params.row.community_name )
                            }
                        },
                        {
                            title: '会员数',
                            align: 'center',
                            key: 'gome_member_num'
                        },
                        {
                            title: '趋势',
                            key: 'trend',
                            align: 'center',
                            render: function(h, params) {
                                // <Icon type="arrow-up-c"></Icon> #c13133
                                // <Icon type="arrow-down-c"></Icon> #349463
                                // <Icon type="minus-round"></Icon> #666
                                var upDown = _this.icon(params.row.trend);
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: upDown.upDown
                                        },
                                        style: {
                                            fontSize: '16px',
                                            color: upDown.color
                                        }
                                    })
                                ]);
                            }
                        }
                    ],
                            customerCoverageData: [],
                            villageOrder: [
                        {
                            title: '小区名称',
                            key: 'community_name',
                            ellipsis: true,
                            align: 'center',
                            render:function(h,params) {
                                return  h('span', {
                                    domProps: {
                                        title:params.row.community_name
                                    },
                                    style: {
                                        width:'100%',
                                        cursor:'default'
                                    }

                                },params.row.community_name )
                            }
                        },
                        {
                            title: '订单数',
                            align: 'center',
                            key: 'gome_sale_count'
                        },
                        {
                            title: '趋势',
                            key: 'trend',
                            align: 'center',
                            render: function(h, params) {
                                var upDown = _this.icon(params.row.trend);
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: upDown.upDown
                                        },
                                        style: {
                                            fontSize: '16px',
                                            color: upDown.color
                                        }
                                    })
                                ]);
                            }
                        }
                    ],
                            villageOrderData: []
                },
                node: 9,
                filterFlag: false
            }
        },
        extends: enterRouter,
        methods: {
            selectData: function (currPage,currSize) {
                /**
                 * select 下拉框数据
                 */
                var self = this ,list =[];
                return axios.get(getUrl("getAuthorStores"),{
                    loading: true
                })
                        .then(function(respone){
                            if(respone.code == 0 && respone.page){
                                var list = respone.page.resultlist;
                                self.filterFlag = list.length > 10 ? true : false;
                                self.cityId = respone.page.cityId;
                                self.store.storeData = list;
                            }
                        })
                        .catch(function(error){
                            self.store.storeData = [];
                        });
            },
            icon: function (type) {
                var upDown , color;
                if(type > 0){
                    upDown = 'arrow-up-c';
                    color = '#c13133';
                }else if(type < 0){
                    upDown = 'arrow-down-c';
                    color = '##349463';
                }else{
                    upDown = 'minus-round';
                    color = '#666';
                }
                return { upDown : upDown , color : color}
            },
            lineData: function () {
                var self = this,saleDataMap,saleData,leftNum ,num,val = this.store.store.werks || (this.store.storeData.length > 0 ? this.store.storeData[0].werks : '');
                axios.get(getUrl("overviewLine"),{
                    params:{
                        storeId : val,
                        cityId: self.cityId
                    }
                })
                        .then(function(respone){
                            if(respone.CommunityAnalysis && respone.code == 0){
                                self.noData = true;
                                saleData = respone.CommunityAnalysis.dataMdxxSale;
                                for(var item in saleData){
                                    saleData[item] = saleData[item] ? ( item == 'gome_sale' ? parseFloat(saleData[item]).toFixed(2) : saleData[item] ) : '暂无' ;
                                    saleData[item] = saleData[item] == 0 ? 0 : saleData[item];
                                    if( !isNaN(saleData[item]) ){
                                        if(saleData[item].toString().indexOf('.') > -1){
                                            num = saleData[item].split('.');
                                            leftNum = comUtils.toThousands(num[0]);
                                            saleData[item] = leftNum + '.' + num[1];
                                        }else{
                                            saleData[item] = comUtils.toThousands(saleData[item]);
                                        }
                                    }
                                }
                                saleDataMap = respone.CommunityAnalysis.map;
                                self.villageNum = saleData;
                                self.storeLine(saleDataMap);
                            }else {
                                self.noData = false;
                            }
                        })
                        .catch(function(error){
                            self.noData = false;
                        });
            },
            storeLine: function (lineData) {
                var mapDate = lineData.date.map(function (item,input) {
                            return item.split(':')[0];
                        }),
                        saleData = lineData.sale.map(function (item,input) {
                            return parseFloat(item).toFixed(2);
                        })  ;
                option = {
                    title: {
                        x: "center",
                        y:20
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        show:true,
                        data:['订单数','销售额']
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : mapDate
                        }
                    ],
                    calculable: false,
                    yAxis : [
                        {
                            type : 'value',
                            splitLine:{
                                show:false
                            }
                        },
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'订单数',
                            type:'line',
                            yAxisIndex: 1,
                            itemStyle : {
                                normal : {
                                    color: '#c23531',
                                    lineStyle:{
                                        color: '#c23531'
                                    }
                                }
                            },
                            data: lineData.count
                        },
                        {
                            name:'销售额',
                            type:'line',
                            itemStyle : {
                                normal : {
                                    color: '#2f4554',
                                    lineStyle:{
                                        color: '#2f4554'
                                    }
                                }
                            },
                            data: saleData
                        }
                    ]
                };
                pctChart = Echarts.init(document.getElementById("order-line"));
                pctChart.setOption(option,true);
                window.onresize = function(){
                    var ChatWidth = $('#order-line').parent().width();
                    $('#order-line').css('width' , ChatWidth);
                    pctChart.resize();
                };
            },
            tableDataFn:function () {
                var self = this,villageNums;
                //初始化
                self.tableData.marketData = [];
                self.tableData.customerCoverageData = [];
                self.tableData.villageOrderData = [];
                self.noDataInfo = '';
                axios.get(getUrl("overviewTableScore"),{
                    params:{
                        cityId: self.cityId
                    },
                    unload: true
                })
                        .then(function(respone){
                            //营销价值评分
                            if(respone.CommunityAnalysis && respone.CommunityAnalysis.list.length > 0){
                                self.tableData.marketData = self.saleListFn(respone.CommunityAnalysis.list,self.tableData.marketValue);
                            }else{
                                self.tableData.marketData = [];
                                self.noDataInfo = '暂无数据';
                            }
                        })
                        .catch(function(error){
                            self.tableData.marketData = [];
                            self.noDataInfo = error.msg;
                        });
                axios.get(getUrl("overviewTableSale"),{
                    params:{
                        cityId: self.cityId
                    }
                })
                        .then(function(respone){
                            //会员数
                            if(respone.CommunityAnalysis && respone.CommunityAnalysis.list.length > 0){
                                self.tableData.customerCoverageData = self.saleListFn(respone.CommunityAnalysis.list,self.tableData.customerCoverage);
                            }else{
                                self.tableData.customerCoverageData = [];
                                self.noDataInfo = '暂无数据';
                            }
                        })
                        .catch(function(error){
                            self.tableData.customerCoverageData = [];
                            self.noDataInfo = error.msg;
                        });
                axios.get(getUrl("overviewTableCount"),{
                    params:{
                        cityId: self.cityId
                    }
                })
                        .then(function(respone){
                            //订单数
                            if(respone.CommunityAnalysis && respone.CommunityAnalysis.list.length > 0){
                                self.tableData.villageOrderData = self.saleListFn(respone.CommunityAnalysis.list,self.tableData.villageOrder);
                            }else{
                                self.tableData.villageOrderData = [];
                                self.noDataInfo = '暂无数据';
                            }
                        })
                        .catch(function(error){
                            self.tableData.villageOrderData = [];
                            self.noDataInfo = error.msg;
                        });
                axios.get(getUrl("overviewAnalysisCount"),{
                    params:{
                        cityId: self.cityId
                    }
                })
                        .then(function(respone){
                            //小区数量接口
                            if(respone.CommunityAnalysis && respone.code == 0){
                                villageNums = respone.CommunityAnalysis;
                                self.num = comUtils.toThousands(villageNums.count);
                            }else{
                                self.num = 0;
                            }
                        })
                        .catch(function(error){
                            self.num = 0;
                            self.$Message.warning(error.msg);
                        });
            },
            saleListFn:function (data,column) {
                //表字段 营销价值
                var self = this , obj = {}, listData = [],percent;
                //self.tableData.marketData = [];
                if(data && data.length > 0){
                    data.forEach(function (item,index) {
                        obj = {};
                        for (var cur in column) {
                            //对订单量特殊处理-千分制
                            // obj[column[cur]["key"]] = column[cur]["key"] == 'gome_sale_count' ? comUtils.toThousands(item[column[cur]["key"]]) : item[column[cur]["key"]];
                            if(column[cur]["key"] == 'gome_sale_count' || column[cur]["key"] == 'gome_member_num'  ){
                                obj[column[cur]["key"]] = item[column[cur]["key"]] == 0 ? 0 : comUtils.toThousands(item[column[cur]["key"]]);
                            }else if(column[cur]["key"] == 'score' && item[column[cur]["key"]] > 0){
                                obj[column[cur]["key"]] = (item[column[cur]["key"]] * 100).toFixed(2);
                            }/*else if(column[cur]["key"] == 'gome_member_cover' && item[column[cur]["key"]] > 0){//会员数暂时保留
                             percent = item[column[cur]["key"]] * 100;
                             obj[column[cur]["key"]] = (percent == 100 ? percent : percent.toFixed(2)) + '%';
                             }*/else{
                                obj[column[cur]["key"]] = item[column[cur]["key"]];
                            }
                        }
                        listData.push(obj);

                    });
                    return listData;
                }else {
                    return []
                }
            },
            changeData:function (e) {
                this.cityId = e.city_id;
                this.lineData();
                this.tableDataFn();
            }
        },
        mounted: function() {
            var ChatWidth = $('#order-line').parent().width(),_this = this;
            $('#order-line').css('width' , ChatWidth);
            //折线展示
            //  this.selectData();

            Promise.all([this.selectData()]).then(function () {
                _this.lineData();
                _this.tableDataFn();
            });
        }
    }
</script>