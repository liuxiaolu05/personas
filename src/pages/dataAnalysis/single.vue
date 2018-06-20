<template>
    <div class="sale-situation" id="single">
        <div class="sale-top box-bot title-box">
            <div class="title i-pull-clear">
                <div class="i-pull-left">
                    <span class="title-name" v-text="villageName"></span>
                </div>
                <div class="i-pull-right btn-right">
                    <Button type="primary" @click="back">返回数据分析列表</Button>
                </div>
            </div>
            <div class="box-content sale-form">
                <div class="form-condition self-btn-ghost" id="form-btn">
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':dailyHigh}" @click="daily('day')">
                            <span>日报</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':weeklyHigh}" @click="daily('week')">
                            <span>周报</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':monthlyHigh}" @click="daily('month')">
                            <span>月报</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':yearlyHigh}" @click="daily('year')">
                            <span>年报</span>
                        </button>
                    </div>
                </div>
                <div class="form-condition self-btn-ghost date-component">
                        <div class="form-group daily" v-show="dailyHigh">
                            <div class="form-group">
                                <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':date.seven}" @click="timeChange('7')">
                                    <span>最近7天</span>
                                </button>
                            </div>
                            <div class="form-group">
                                <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':date.thirty}" @click="timeChange('30')">
                                    <span>最近30天</span>
                                </button>
                            </div>
                            <div class="form-group">
                                <button type="button" class="ivu-btn ivu-btn-ghost" :class="{'ivu-btn-primary':date.zero}" @click="timeChange()">
                                    <span>自定义时段</span>
                                </button>
                            </div>
                            <div class="form-group" id="tip-date">
                                <Date-picker format="yyyy.MM.dd" confirm :value="date.day"  type="daterange"
                                             :disabled="date.timeFlag"  :options="date.dateValue"
                                             placement="bottom-start" id="picker"
                                             placeholder="选择日期" @on-change="dateTime" :open="open"
                                             @on-clear="timeClear"
                                             @on-ok="timeOk"  style="width: 200px"></Date-picker>
                            <span class="tip" v-show="!date.timeFlag">
                                <Tooltip content="最多只能选择30天的数据" placement="bottom-start">
                                    <span><Icon type="help-circled"></Icon></span>
                                </Tooltip>
                            </span>
                            </div>
                        </div>
                        <div class="form-condition" v-show="weeklyHigh">
                            <div class="form-group i-pull-clear">
                                <Select class="i-pull-left" @on-change="changeData" v-model="week.option" filterable placeholder="请选择周">
                                    <Option v-for="item in week.optionData" :value="item.value" :key="item.label">{{ item.label }}</Option>
                                </Select>
                                <div class="i-pull-left tip">
                                    <Tooltip content="默认显示上一周，最多显示52周" placement="bottom-start">
                                        <span><Icon type="help-circled"></Icon></span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="form-condition" v-show="monthlyHigh">
                            <div class="form-group ">
                                <Date-picker type="month" placeholder="选择月" :options="date.dateValue" :value="month.monthDate"  @on-change="monthChange" style="width: 200px" ></Date-picker>
                            </div>
                        </div>
                        <div class="form-condition" v-show="yearlyHigh">
                            <div class="form-group ">
                                <Date-picker type="year" :value="date.year" placeholder="选择年" @on-change="yearTime" style="width: 200px"></Date-picker>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        <div class="sale-data title-box">
            <div class="title">
                <div class="form-condition self-btn-ghost" id="target-btn">
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost ivu-btn-primary"  >
                            <span>订单数</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost"  >
                            <span>销售金额</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" >
                            <span>退货数</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" >
                            <span>退货金额</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost">
                            <span>平均消费价格</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="box-content">
                <div class="chart-bg" style="width: 100%;height:450px;">
                    <div id="line" v-show="noData"  style="height:450px;" ></div>
                    <div class="no-data" v-show="!noData">暂无数据</div>
                </div>
                <div class="export">
                    <a href="javascript:;" class="i-pull-right" @click="downLoad" >下载报表</a>
                </div>

                <div class="table box-bot">
                    <Table border :no-data-text="noDataInfo" :columns="columns"  @on-sort-change="sort" :data="dataTable" size="small" ref="table"></Table>
                    <div class="i-pull-right page">
                        <Page :current="page.currPage" size="small" :total="page.totalPage" show-elevator :page-size="page.pageSize"  :placement="page.direction"
                              show-sizer show-total @on-change="changePage($event)" :page-size-opts="page.pageBranch" @on-page-size-change="changeSize($event)"></Page>
                    </div>
                </div>
            </div>
        </div>
        <Back-top :bottom="150"></Back-top>
    </div>
</template>
<script>
    var timeNum = 3600 * 1000 * 24,//时间
        chartLineData;
    export default{
        data: function() {
            return {
                spinShow:true,
                villageName: decodeURI(this.$route.query.villageName),
                dailyHigh: true,
                weeklyHigh: false,
                monthlyHigh: false,
                yearlyHigh: false,
                dateType:'day',
                noDataInfo: '数据加载中...',
                params: {},//请求参数
                initialization:true,
                open: false,
                firstLoad: false,
                date:{
                    openFlag: true,
                    timeFlag: true,
                    seven: true,
                    thirty: false,
                    zero: false,
                    day: null,
                    saveDay: null,
                    startTime: comUtils.initDate(7).startTime,
                    endTime: comUtils.initDate(7).endTime,
                    dateValue: {
                        disabledDate: function(date) {
                            return date && date.valueOf() > Date.now() - timeNum || date.valueOf() > Date.now()+timeNum*30;
                            //return date && date.valueOf() > Date.now() - timeNum || date.valueOf() < Date.now() - timeNum * 30
                        }
                    },
                    year: ''
                },
                noData: true,
                week:{
                    option:null,
                    optionData:[]
                },
                month:{
                    monthDate: '',
                    optionValue: {
                        disabledDate: function (date) {
                            return date && date.valueOf() >  date.valueOf() > Date.now() + timeNum * 30;
                        }
                    }
                },
                lineAxis: ['订单数'],
                columns: [],
                dataTable: [],
                dataName: { //字段对应一致
                    '商品型号' : 'matnr',
                    '商品名称':'maktx',
                    '订单数' : 'gome_sale_count',
                    '销售金额' : 'gome_sale' ,
                    '退货数' : 'gome_refund_count',
                    '退货金额' : 'gome_refund',
                    '平均消费价格' : 'avg_price'
                },
                page:{
                    currPage: 1,
                    pageSize: 10,
                    pageBranch: [10,20,50,100],
                    totalPage : 0,
                    direction:'top'
                },
                getPage:true,
                getSize:true,
                order:{
                    orderColumn:'gome_sale_count',//排序字段
                    orderType:'desc'
                },
                analysisType: this.$route.query.analysisType,
                id: this.$route.query.id
            }
        },
        computed: {
            monthValue: function () {
                var nowDate = new Date();
                nowDate.setMonth(nowDate.getMonth()-1);
                var year = nowDate.getFullYear(),
                        month = nowDate.getMonth()+1,
                        formatWdate = year + '-' + (month < 10 ? '0' :'')+month ;
                return formatWdate
            }
        },
        methods: {
            initPage:function(){
                this.page.currPage=1;
            },
            getWeekData: function () {
                var self = this,
                        obj,
                        weekData,
                        option = [];
                axios.get(getUrl("dateWeek"),{
                    params:{
                        analysisType: this.analysisType,
                        communityId: this.id,
                        dateType: 'week'
                    }
                })
                        .then(function(res){
                            if(res.week && res.week.length > 0){
                                weekData = res.week.reverse();
                                weekData.forEach(function (item, index) {
                                    obj = {};
                                    obj.value = item;
                                    obj.label = item.replace(/-/g,'.');
                                    option.push(obj);
                                });
                                self.week.optionData = option;
                                self.week.option = option[1].value;
                            }else{
                                self.week.option = '';
                                self.week.optionData = [];
                            }
                        })
                        .catch(function(error){
                            console.log(error);
                        });
            },
            daily:function (name) {
                switch (name){
                    case 'day':
                        this.dailyHigh = true;
                        this.dateType = 'day';
                        this.weeklyHigh = this.monthlyHigh = this.yearlyHigh = false;
                        if(this.date.seven){
                            this.timeChange(7);
                        }else if(this.date.thirty){
                            this.timeChange(30);
                        }else{
                            this.timeChange(0);
                            this.date.startTime = this.date.saveDay;
                            this.noData = false;
                        }
                        break;
                    case 'week':
                        this.weeklyHigh = true;
                        this.dateType = 'week';
                        this.date.startTime = this.week.option;
                        this.dailyHigh = this.monthlyHigh = this.yearlyHigh = false;
                        break;
                    case 'month':
                        this.monthlyHigh = true;
                        this.dateType = 'month';
                        this.dailyHigh = this.weeklyHigh = this.yearlyHigh = false;
                        this.date.startTime = this.month.monthDate ;
                        break;
                    case 'year':
                        this.yearlyHigh = true;
                        this.dateType = 'year';
                        this.date.startTime = this.date.year;
                        this.dailyHigh = this.weeklyHigh = this.monthlyHigh = false;
                        break;
                }
                this.initPage();
                this.getEchartData();
                this.getTableData();
            },
            timeChange:function (num){
                if(num == 7){
                    this.date.seven = this.date.timeFlag = true;
                    this.date.thirty = this.date.zero = false;
                    this.date.startTime = comUtils.initDate(7).startTime;
                    this.date.endTime = comUtils.initDate(7).endTime;
                    this.initPage();
                    this.getTableData();
                    this.getEchartData();
                }else if(num == 30){
                    this.date.thirty = this.date.timeFlag = true;
                    this.date.seven = this.date.zero = false;
                    this.date.startTime = comUtils.initDate(30).startTime;
                    this.date.endTime = comUtils.initDate(30).endTime;
                    this.initPage();
                    this.getTableData();
                    this.getEchartData();
                }else {
                    this.date.zero = true;
                    this.date.seven = this.date.thirty = this.date.timeFlag = false;
                }
            },
            getEchartData:function(){
                var self = this,
                        chartData; //折线图数据
                //初始化 查询参数
                self.params = {
                    analysisType : this.analysisType,
                    communityId: this.id,
                    dateType: this.dateType,
                    startTime: this.date.startTime,
                    endTime: this.date.endTime,
                    currPage: 1,
                    pageSize: 10
                };
                axios.get(getUrl("singleChart"),{
                    params:self.params
                })
                        .then(function(res){
                            if(res.CommunityAnalysis && res.CommunityAnalysis.chart){
                                self.spinShow=false;
                                self.noData = true;
                                chartData = chartLineData = res.CommunityAnalysis.chart;
                                self.chartData(chartData);
                            }else {
                                self.noData = false;
                            }

                        })
                        .catch(function(error){
                            self.noData = false;
                            self.spinShow=false;
                        });
            },
            getTableData: function () {
                this.open = false;
                var $len = $('#tip-date .ivu-picker-confirm .dy');
                if ($len.length > 0 && $len.html() != '') {
                    $('#tip-date .ivu-picker-confirm .dy').html('');
                    $('.ivu-btn.ivu-btn-text.ivu-btn-small').click();
                }
                var self = this,
                        tableData; //表格数据
                //初始化 查询参数
                self.params = {
                    analysisType : this.analysisType,
                    communityId: this.id,
                    dateType: this.dateType,
                    startTime: this.date.startTime,
                    endTime: this.date.endTime,
                    orderColumn: this.order.orderColumn,
                    ordertype: this.order.orderType== 'normal' ? 'desc' : self.order.orderType,
                    currPage: this.page.currPage,
                    pageSize:this.page.pageSize
                };
                self.noDataInfo = '数据加载中...';
                axios.get(getUrl("singleTable"),{
                    params:self.params,
                    loading: true,
                    unload: true
                })
                        .then(function(res){
                            if(res.CommunityAnalysis && res.CommunityAnalysis.tableList.length > 0){

                                self.page.totalPage = res.CommunityAnalysis.totalCount;
                                tableData=res.CommunityAnalysis.tableList;
                                self.requestTableData(tableData);
                                if(self.initialization){
                                    $('#single .ivu-table-header thead .ivu-table-cell').each(function(){
                                        var $span = $(this).find('span:eq(0)');
                                        $span.replaceWith('<i>'+$span.text()+'</i>');
                                    });
                                    $('#single .sort-name .ivu-table-sort').find('.ivu-icon-arrow-down-b').addClass('on');
                                    self.initialization = false;
                                }
                            }else {
                                self.dataTable = [];
                                self.noDataInfo = '暂无数据';
                                self.page.totalPage=0;
                            }

                        })
                        .catch(function(error){
                            self.dataTable = [];
                            self.noDataInfo = error.msg;
                        });
            },
            requestTableData: function (data) {
                //请求数据
                var  obj, listData = [], column = this.columns,floatNum,leftNum;
                data.forEach(function (item,index) {
                    obj = {};
                    for (var cur in column) {
                        //对金额特殊处理-千分制
                        if(column[cur]["key"] == 'gome_sale' || column[cur]["key"] == 'gome_refund' || column[cur]["key"] == 'avg_price'){
                            if(item[column[cur]["key"]] == 0){
                                obj[column[cur]["key"]] = item[column[cur]["key"]] ;
                            }else {
                                floatNum = parseFloat(item[column[cur]["key"]]).toFixed(2).split('.');
                                leftNum = comUtils.toThousands(floatNum[0]);
                                obj[column[cur]["key"]] =  leftNum + '.' + floatNum[1];
                            }
                        }else if (column[cur]["key"] == 'matnr'){
                            obj[column[cur]["key"]] = item[column[cur]["key"]];
                        }else{
                            obj[column[cur]["key"]] = comUtils.toThousands(item[column[cur]["key"]]);
                        }
                        //   obj[column[cur]["key"]] = column[cur]["key"] == 'tdate' ? item[column[cur]["key"]] : comUtils.toThousands(item[column[cur]["key"]]) ;
                    }
                    listData.push(obj);
                });
                this.dataTable = listData;
            },
            chartData: function (data) {
                //对金额保留两位小数进行处理
                for(var k in data){
                    if(k == 'gome_sale' || k == 'gome_refund' || k == 'avg_price' ){
                        data[k] = data[k].map(function (t, i) {
                            return t > 0 ? parseFloat(t).toFixed(2) : t;
                        });
                    }
                }
                var option,//折线图的配置项
                        _this = this,
                        color = ['#4b5054'],
                        obj = {},
                        syllable = [],//每一项对应的
                        xAxis = [],//折线图X轴
                        yAxis = [],//折线图Y轴
                        legend = [],//图例展示项
                        series = [];//折线图数据

                legend = _this.lineAxis;
                for (var m in data) {
                    if (_this.dataName[legend[0]] === m) {
                        obj = {};
                        obj.name = legend[0];
                        obj.type = 'bar';
                        obj.barWidth = '15%';
                        obj.barGap='20%';
                        obj.data = data[m];
                        obj.itemStyle = {
                            normal: {
                                color: color[0],
                                lineStyle: {
                                    color: color[0]
                                }
                            }

                        };
                        series.push(obj);
                    }
                    if(m.indexOf(_this.dataName[legend[0]] ) > 0){
                        xAxis = data[m];
                    }
                }
                var axistemp;
                axistemp={
                    interval:0,//横轴信息全部显示
                    rotate: -50,//50度角倾斜显示
                    formatter:function(val){
                        //匹配中文字符
                        if(/^[\u4e00-\u9fa5]/.test(val)){
                            var reg = /[^\u4e00-\u9fa5]/g;
                            val=val.replace(reg,"");
                            if(val.length>13){
                                val=val.substring(0,13)+'...';
                            }
                        }
                        return  val;
                    }};

                yAxis = [
                    {
                        type: 'value',
                        //name: legend[0],
                        splitLine: {
                            show: false
                        }

                    }
                ];
                if ((series.length == 1 && series[0].data.length == 0) || (series.length == 2 && series[0].data.length == 0 && series[0].data.length == 0)) {
                    _this.noData = false;
                    return;
                } else {
                    _this.noData = true;
                }
                option = {
                    color: ['#1d89ff'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: legend
                    },
                    grid: {
                        left: '5%',
                        right: '3%',
                        bottom: '30%',
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data:  xAxis,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel:axistemp

                        }
                    ],
                    yAxis: yAxis,
                    series: series
                };
                var pctChart = Echarts.init(document.getElementById("line"));
                pctChart.setOption(option, true);
                window.onresize=function(){
                    var width=$('.chart-bg').width();
                    $('#line').css('width',width+'px');
                    pctChart.resize();
                }
            },
            dateTime:function (e) {
                //获取时间 数组
                var reg = /\./g,//兼容Firefox ie
                        startDate = new Date(e[0].replace(reg,'-')).getTime(),
                        endDate = new Date(e[1].replace(reg,'-')).getTime(),
                        $confirm = $('#tip-date .ivu-picker-confirm'),//获取到确定按钮的父元素
                        len = $('#tip-date .ivu-picker-confirm .dy').length;
                if((endDate - startDate + timeNum) > timeNum * 30){
                    this.date.openFlag = false;
                    if(len > 0){
                        $confirm.find('.dy').html('最多只能选择30天的数据');
                    }else {
                        $confirm.prepend('<div class="dy">最多只能选择30天的数据</div>');
                    }
                    $confirm.find('.ivu-btn-primary').attr('disabled',true);
                }else{
                    this.date.openFlag = true;
                    this.date.startTime = this.date.saveDay =  e[0];
                    this.date.endTime = e[1];
                    if(len > 0){
                        $('#tip-date .ivu-picker-confirm .dy').html('');
                    }
                    $confirm.find('.ivu-btn-primary').attr('disabled',false);
                }
            },
            timeOk:function () {
                if(this.date.openFlag){
                    this.open = false;
                    this.initPage();
                    this.getEchartData();
                    this.getTableData();
                }
            },
            monthChange:function (e) {
                this.date.startTime = this.month.monthDate = e;
                this.initPage();
                this.getTableData();
                this.getEchartData();
            },
            yearTime:function (e) {
                this.date.startTime = this.date.year =  e;
                this.initPage();
                this.getTableData();
                this.getEchartData();
            },
            changeData: function (e) {
                if(this.firstLoad){
                    this.date.startTime = e;
                    this.initPage();
                    this.getTableData();
                    this.getEchartData();
                }else{
                    this.firstLoad = true
                }
            },
            warning: function(info) {
                this.$Message.warning(info);
            },
            back: function () {
                this.$store.state.path ='main' ;
                this.$router.push('/dataAnalysis/dataAnalysis.html');
            },
            changePage: function (e) {
                this.page.currPage = e;
                if(this.getPage){
                    this.getTableData();
                }else {
                    this.getPage=true;
                }

            },
            changeSize: function (e) {
                this.page.pageSize = e;
                this.page.currPage=1;
                this.getTableData();
                this.getPage=false;
            },
            downLoad: function () {
                var url = getUrl('download_product');
                url += '?analysisType=' + this.analysisType + '&communityId=' + this.id + '&dateType=' + this.dateType + '&startTime=' +
                        this.date.startTime + '&endTime=' + this.date.endTime + '&orderColumn=' + this.order.orderColumn + '&ordertype=' + this.order.orderType
                window.location.href = url;
            },
            sort: function (column) {
                //排序
                this.order.orderColumn = column.key;
                var cName=column.column.className;
                if(column.order!='normal'){
                    this.order.orderData=column.order;
                }
                $('#single .ivu-table-sort').find('.ivu-icon').removeClass('on')
                if(this.order.orderData=='desc'){
                    setTimeout(function(){
                        $('.'+cName+'').find('.ivu-icon-arrow-down-b').addClass('on')
                    },50)
                }else {
                    setTimeout(function(){
                        $('.'+cName+'').find('.ivu-icon-arrow-up-b').addClass('on')
                    },50)
                }
                this.order.orderType =this.order.orderData;
                this.getTableData();
            },
            timeClear:function () {
                //清空操作
                var len = $('#tip-date .ivu-picker-confirm .dy').length;
                if (len > 0) {
                    $('#tip-date .ivu-picker-confirm .dy').html('');
                }
                this.open = false;
            },
            handleClick: function () {
                if(!this.date.timeFlag){
                    $('#tip-date .ivu-picker-confirm .ivu-btn-text').find('span:eq(0)').html('取消');
                    this.open = true;
                }
            }
        },
        mounted: function() {
            //表示为当前年
            var date = new Date,currentYear = date.getFullYear().toString();
            this.date.year = currentYear;
            var highBtn, //高亮显示的按钮
                    _this = this,
                    itemObj,
                    btnName;//按钮名称
            this.month.monthDate = this.monthValue;
            for(var cur in _this.dataName){
                itemObj = {};
                itemObj.title = cur;
                itemObj.key = _this.dataName[cur];
                itemObj.className=_this.dataName[cur];
                if(cur == '订单数'){
                    itemObj.className = 'sort-name';
                }
                if(cur != '商品型号' && cur != '商品名称'){
                    itemObj.sortable = 'custom';
                }
                if(cur=='商品型号'){
                    itemObj.width='185';
                }
                if(cur=='商品名称'){
                    itemObj.ellipsis=true;
                    itemObj.render=function(h,params) {
                        return  h('span', {
                            domProps: {
                                title:params.row.maktx
                            },
                            style: {
                                width:'100%',
                                cursor:'default'
                            }

                        },params.row.maktx)}
                }
                switch(cur){
                    case '订单数':
                        comUtils.help(itemObj,'订单数','所选时间范围内，该小区（楼盘）某个商品SKU产生的零售单数量');
                        break;
                    case '销售金额':
                        comUtils.help(itemObj,'销售金额','所选时间范围内，该小区（楼盘）某个商品SKU的销售金额总和');
                        break;
                    case '退货数':
                        comUtils.help(itemObj,'退货数','所选时间范围内，该小区（楼盘）某个商品SKU产生的退货零售单数量');
                        break;
                    case '退货金额':
                        comUtils.help(itemObj,'退货金额','所选时间范围内，该小区（楼盘）某个商品SKU退货零售单中销售金额之和');
                        break;
                    case '平均消费价格':
                        comUtils.help(itemObj,'平均消费价格','所选时间范围内，该小区（楼盘）某个商品SKU销售金额/商品数');
                        break;

                }
                _this.columns.push(itemObj);
            }
            $('#target-btn button').each(function () {
                $(this).on('click', function () {
                    if ($(this).hasClass('ivu-btn-primary')) {
                        _this.warning('至少勾选一个指标');
                        return
                    }
                    _this.lineAxis = [];
                    btnName = $(this).find('span').text();
                    $('#target-btn button').removeClass('ivu-btn-primary');
                    $(this).addClass('ivu-btn-primary');
                    _this.lineAxis.push(btnName);
                    _this.chartData(chartLineData);
                });
            });
            var width=$('.chart-bg').width();
            $('#line').css('width',width+'px');
            this.getWeekData();
            this.getTableData();
            this.getEchartData();
            $('#picker .ivu-input-wrapper').on('click',function () {
                _this.handleClick()
            });
        }
    };
</script>