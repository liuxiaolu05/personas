<template>
    <div class="sale-situation" id="sale-situation">
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
                <div class="date-component">
                    <div class="daily form-condition self-btn-ghost  " v-show="dailyHigh">
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
                            <DatePicker type="daterange"
                                        format="yyyy.MM.dd"
                                        confirm
                                        :value="date.day"
                                        :disabled="date.timeFlag"
                                        :open="open"
                                        :options="date.dateValue"
                                        placement="bottom-start"
                                        placeholder="选择日期"
                                        @on-change="dateTime"
                                        @on-ok="timeOk"
                                        @on-clear="timeClear"
                                        id="picker"
                                        style="width: 200px"></DatePicker>
                        <span class="tip" v-show="!date.timeFlag">
                            <Tooltip content="最多只能选择30天的数据" placement="bottom-start">
                                <span><Icon type="help-circled"></Icon></span>
                            </Tooltip>
                        </span>
                        </div>
                    </div>
                    <div class="form-condition" v-show="monthlyHigh">
                        <div class="form-group monthly-report">
                            <!-- <i-select v-model="date.year">
                                 <i-option value="2017">2017</i-option>
                             </i-select>-->
                            <DatePicker type="year" :value="date.year" placeholder="选择年" @on-change="yearTime" style="width: 200px"></DatePicker>
                        </div>
                    </div>
                    <!--<div class="form-condition" v-show="yearlyHigh">
                        <div class="form-group ">
                            <Date-picker type="year" :value="date.yearOnly" placeholder="选择年" @on-change="onlyYearTime" style="width: 200px"></Date-picker>
                        </div>
                    </div>-->
                </div>
            </div>
        </div>
        <div class="sale-data title-box">
            <div class="title">
                <div class="form-condition self-btn-ghost" id="target-btn">
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost ivu-btn-primary" >
                            <span>订单数</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost ivu-btn-primary"  >
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
                        <button type="button" class="ivu-btn ivu-btn-ghost" >
                            <span>品类数</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost" >
                            <span>品牌数</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost">
                            <span>商品数</span>
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="ivu-btn ivu-btn-ghost">
                            <span>平均订单价格</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="box-content">
                <div class="chart-bg">
                    <div id="line" v-show="noData" class="chart"></div>
                    <div class="no-data" v-show="!noData">暂无数据</div>
                </div>
                <div class="export">
                    <a href="javascript:;" class="i-pull-right" @click="downLoad">下载报表</a>
                </div>
                <div class="table todo-table">
                    <Table border stripe :columns="columns" :no-data-text="noDataInfo" :data="dataTable"></Table>
                </div>
            </div>
        </div>
        <Back-top :bottom="110"></Back-top>
    </div>
</template>
<script>
    var timeNum = 3600 * 1000 * 24,//时间
        chartLineData,
        date = new Date,
        yearSave = date.getFullYear().toString();//记录上一年的日期 表示为当前年
    export default{
        data: function(){
            return {
                villageName: decodeURI(this.$route.query.villageName),
                dailyHigh: true,
                weeklyHigh: false,
                monthlyHigh: false,
                yearlyHigh: false,
                dateType:'day',
                noDataInfo: '',
                params: {},//请求参数
                open: false,
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
                        shortcuts: [],
                        disabledDate: function(date) {
                            return date && date.valueOf() > Date.now() - timeNum || date.valueOf() > Date.now()+timeNum*30;
                            //return date && date.valueOf() > Date.now() - timeNum || date.valueOf() < Date.now() - timeNum * 30
                        }
                    },
                    year: ''
                },
                noData: true,
                lineAxis: ['订单数','销售金额'],
                columns: [],
                dataTable: [],
                dataName: { //字段对应一致
                    '日期' : 'tdate',
                    '订单数' : 'gome_sale_count',
                    '销售金额' : 'gome_sale' ,
                    '退货数' : 'gome_refund_count',
                    '退货金额' : 'gome_refund',
                    '品类数' : 'class1_count',
                    '品牌数' : 'prdha_count',
                    '商品数' : 'gome_sp_count'  ,
                    '平均订单价格' : 'avg_price'
                },
                analysisType: this.$route.query.analysisType,
                id: this.$route.query.id
            }
        },
        computed: {
            defaultDay: function () {
                var obj = comUtils.getDefaultTime(7);
                return [obj.start, obj.end];
            }
        },
        methods: {
            daily:function (name) {
                switch (name){
                    case 'day':
                        this.dailyHigh = true;
                        this.dateType = 'day';
                        this.weeklyHigh = this.monthlyHigh = this.yearlyHigh = false;
                        if(this.date.seven){
                            this.timeChange(7,true);
                        }else if(this.date.thirty){
                            this.timeChange(30,true);
                        }else{
                            this.timeChange(0);
                            this.date.startTime = this.date.saveDay;
                            this.noData = false;
                        }
                        break;
                    case 'week':
                        this.weeklyHigh = true;
                        this.dateType = 'week';
                        this.dailyHigh = this.monthlyHigh = this.yearlyHigh = false;
                        break;
                    case 'month':
                        this.monthlyHigh = true;
                        this.dateType = 'month';
                        this.date.startTime =  this.date.year ;
                        this.dailyHigh = this.weeklyHigh = this.yearlyHigh = false;
                        break;
                    case 'year':
                        this.yearlyHigh = true;
                        this.dateType = 'year';
                        this.dailyHigh = this.weeklyHigh = this.monthlyHigh = false;
                        break;
                }
                this.getAllData();
            },
            timeChange:function (num,flag) {
                if(num == 7){
                    this.date.seven = this.date.timeFlag = true;
                    this.date.thirty = this.date.zero = false;
                    this.date.startTime = comUtils.initDate(7).startTime;
                    this.date.endTime = comUtils.initDate(7).endTime;
                    if (!flag) {
                        this.getAllData();
                    }
                }else if(num == 30){
                    this.date.thirty = this.date.timeFlag = true;
                    this.date.seven = this.date.zero = false;
                    this.date.startTime = comUtils.initDate(30).startTime;
                    this.date.endTime = comUtils.initDate(30).endTime;
                    if (!flag) {
                        this.getAllData();
                    }
                }else {
                    this.date.zero = true;
                    this.date.seven = this.date.thirty = this.date.timeFlag = false;
                }
            },
            getTableData: function () {
                var self = this,
                        totalData ,//数据源
                        tableData; //表格数据
                self.params.dateType = self.dateType;
                self.params.startTime = self.date.startTime;
                self.params.endTime = self.date.endTime;
                self.noDataInfo = '';
                self.open = false;
                var $len = $('#tip-date .ivu-picker-confirm .dy');
                if ($len.length > 0 && $len.html() != '') {
                    $('#tip-date .ivu-picker-confirm .dy').html('');
                    $('.ivu-btn.ivu-btn-text.ivu-btn-small').click();
                }
                axios.get(getUrl("saleTable"),{
                    params:self.params
                })
                        .then(function(res){
                            if(res.CommunityAnalysis && res.CommunityAnalysis.tableList.length > 0){
                                totalData = res.CommunityAnalysis;
                                tableData = totalData.tableList;
                                self.requestTableData(tableData);
                            }else {
                                self.dataTable = [];
                                self.noDataInfo = '暂无数据';
                            }
                        })
                        .catch(function(error){
                            self.dataTable = [];
                            self.noDataInfo = error.msg;
                        });
            },
            getChartData: function () {
                var self = this,
                        totalData ,//数据源
                        chartData, //折线图数据
                        tableData; //表格数据
                self.params.dateType = self.dateType;
                self.params.startTime = self.date.startTime;
                self.params.endTime = self.date.endTime;
                axios.get(getUrl("saleChart"),{
                    params:self.params,
                    loading: true,
                    unload: true
                })
                        .then(function(res){
                            if(res.CommunityAnalysis && res.CommunityAnalysis.chart && res.CommunityAnalysis.chart.xAxis.length > 0){
                                self.noData = true;
                                totalData = res.CommunityAnalysis;
                                chartData = chartLineData = totalData.chart;
                                self.chartData(chartData);
                            }else {
                                self.noData = false;
                            }
                        })
                        .catch(function(error){
                            self.noData = false;
                        });
            },
            getAllData:function () {
                this.getTableData();
                this.getChartData();
            },
            requestTableData: function (data) {
                //请求数据
                var  obj = {}, listData = [], column = this.columns,floatNum,leftNum,rightNum;
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
                        }else if(column[cur]["key"] == 'tdate'){
                            obj[column[cur]["key"]] = item[column[cur]["key"]].split(' ')[0];
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
                if(!(data && data.xAxis && data.xAxis.length > 0 )){
                    return
                }
                for(var k in data){
                    if(k == 'gome_sale' || k == 'gome_refund' || k == 'avg_price' ){
                        data[k] = data[k].map(function (t, i) {
                            return t > 0 ? parseFloat(t).toFixed(2) : t;
                        });
                    }
                }
                var option ,//折线图的配置项
                        _this = this,
                        color = ['#c23531','#2f4554'],
                        obj = {},
                        syllable = [],//每一项对应的
                        xAxis = data.xAxis ,//折线图X轴
                        yAxis = [] ,//折线图Y轴
                        legend = [],//图例展示项
                        series = [];//折线图数据

                legend = _this.lineAxis;
                yAxis = [
                    {
                        type : 'value',
                        name: legend[0],
                        axisLine:{
                            show: true
                        }
                    }
                ];
                legend.forEach(function (item, index) {
                    for(var m in data){
                        if(_this.dataName[item] === m){
                            obj = {};
                            obj.name = item;
                            obj.type = 'line';
                            obj.data = data[m];
                            obj.itemStyle = {
                                normal : {
                                    color: color[index],
                                    lineStyle:{
                                        color: color[index]
                                    }
                                }

                            };
                            series.push(obj);
                            break;
                        }
                    }
                });
                if(legend.length == 2){
                    yAxis.push({
                        type : 'value',
                        name: legend[1],
                        splitLine:{show: false}
                    });
                    series[1].yAxisIndex = 1;
                }
                option = {
                    title: {
                        x: "center",
                        y:20
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legend
                    },
                    grid: {
                        top: '15%',
                        left: '5%',
                        right: '4%',
                        bottom: '1%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAxis,
                            axisLine:{
                                lineStyle:{
                                    color:'#333'
                                }
                            },
                            axisLabel: {
                                show: true,
                                /* interval:0,
                                 rotate:70,//倾斜度 -90 至 90 默认为0*/
                                textStyle: {
                                    color: '#333'
                                }
                            }
                        }
                    ],
                    yAxis : yAxis,
                    series : series
                };
                var pctChart = Echarts.init(document.getElementById("line")),ChatWidth;
                pctChart.setOption(option,true);
                window.onresize = function(){
                    ChatWidth = $('.chart-bg').width();
                    $('#line').css('width' , ChatWidth);
                    pctChart.resize();
                };
            },
            dateTime:function (e) {
                //获取时间 数组
                var reg = /\./g,//兼容Firefox ie
                        startDate = new Date(e[0].replace(reg,'-')).getTime(),
                        endDate = new Date(e[1].replace(reg,'-')).getTime(),
                        $confirm = $('#tip-date .ivu-picker-confirm'),
                        len = $('#tip-date .ivu-picker-confirm .dy').length;
                if((endDate - startDate + timeNum) > timeNum * 30){
                    this.date.openFlag = false;
                    if (len > 0) {
                        $confirm.find('.dy').html('最多只能选择30天的数据');
                    } else {
                        $confirm.prepend('<div class="dy">最多只能选择30天的数据</div>');
                    }
                    $confirm.find('.ivu-btn-primary').attr('disabled',true);
                }else{
                    this.date.openFlag = true;
                    this.date.startTime = this.date.saveDay = e[0];
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
                    this.getAllData();
                }
            },
            timeClear:function () {
                //清空操作
                var len = $('#tip-date .ivu-picker-confirm .dy').length;
                if (len > 0) {
                    $('#tip-date .ivu-picker-confirm .dy').html('');
                }
                this.open = false;
            },
            yearTime:function (e) {
                this.date.startTime = this.date.year = e;
                this.getAllData();
            },
            warning: function(info) {
                this.$Message.warning(info);
            },
            back: function () {
                this.$store.state.path ='main' ;
                this.$router.push('/dataAnalysis/dataAnalysis.html');
            },
            downLoad: function () {
                var  url =  getUrl('download_sale');
                url += '?analysisType=' + this.analysisType + '&communityId=' + this.id + '&dateType=' + this.dateType + '&startTime=' +
                        this.date.startTime + '&endTime=' + this.date.endTime ;
                window.location.href = url;
            },
            handleClick: function (e) {
                if(!this.date.timeFlag){
                    $('#tip-date .ivu-picker-confirm .ivu-btn-text').find('span').html('取消');
                    this.open = true;
                }
            }
        },
        mounted: function() {
            this.date.year = yearSave;
            var highBtn, //高亮显示的按钮
                    _this = this,
                    itemObj = {},
                    btnName,//按钮名称
                    ChatWidth = $('.chart-bg').width();//图表width
            //初始化 查询参数
            _this.params = {
                analysisType : this.analysisType,
                communityId: this.id
            };
            for(var cur in _this.dataName){
                itemObj = {};
                itemObj.title = cur;
                itemObj.key = _this.dataName[cur];
                if(cur == '日期'){
                    itemObj.className = 'tdate';
                }
                switch(cur){
                    case '订单数':
                        comUtils.help(itemObj,'订单数','所选时间范围内，该小区（楼盘）产生的零售单数量');
                        break;
                    case '销售金额':
                        comUtils.help(itemObj,'销售金额','所选时间范围内，该小区（楼盘）零售单中销售金额之和');
                        break;
                    case '退货数':
                        comUtils.help(itemObj,'退货数','所选时间范围内，该小区（楼盘）产生的零售单类型为“退货”的零售单数量');
                        break;
                    case '退货金额':
                        comUtils.help(itemObj,'退货金额','所选时间范围内，该小区（楼盘）产生的零售单类型为“退货”的零售单中销售金额之和');
                        break;
                    case '品类数':
                        comUtils.help(itemObj,'品类数','所选时间范围内，该小区（楼盘）销售的品类数量之和');
                        break;
                    case '品牌数':
                        comUtils.help(itemObj,'品牌数','所选时间范围内，该小区（楼盘）销售的品牌数量之和');
                        break;
                    case '商品数':
                        comUtils.help(itemObj,'商品数','所选时间范围内，该小区（楼盘）销售的商品数量之和');
                        break;
                    case '平均订单价格':
                        comUtils.help(itemObj,'平均订单价格','所选时间范围内，该小区（楼盘）销售金额总和/订单数');
                        break;

                }
                _this.columns.push(itemObj);
            }
            $('#target-btn button').each(function () {
                $(this).on('click',function () {
                    highBtn = $('#target-btn button.ivu-btn-primary').length;
                    btnName = $(this).find('span').text();
                    if(!$(this).hasClass('ivu-btn-primary')){
                        if(highBtn >= 2){
                            _this.warning('最多勾选两个指标');
                            return
                        }else {
                            _this.$Message.destroy();
                            $(this).addClass('ivu-btn-primary');
                            _this.lineAxis.push(btnName);
                        }
                    }else {
                        if(highBtn == 1){
                            _this.warning('至少勾选一个指标');
                            return
                        }else {
                            _this.$Message.destroy();
                            $(this).removeClass('ivu-btn-primary');
                            if(_this.lineAxis.length > 0){
                                for(var i = 0,len = _this.lineAxis.length; i < len; i++){
                                    if(btnName == _this.lineAxis[i]){
                                        _this.lineAxis.splice(i,1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    _this.chartData(chartLineData);
                });
            });
            $('#line').css('width' , ChatWidth);
            this.getAllData();
            $('#picker .ivu-input-wrapper').on('click',function () {
                _this.handleClick()
            });
        }
    };

</script>