<template id="message-temp">
    <div class="message-detail">
        <Card>
            <p slot="title" class="i-pull-clear">
                <span>{{eventName}}</span>
                <Button type="primary" class="i-pull-right return-btn" @click="backToList">返回</Button>
            </p>
            <div class="groups">
                <Button :type="week" @click="timeRange">最近7天</Button>
                <Button :type="month" @click="timeRange">最近30天</Button>
                <Button :type="elseTime" @click="timeRange">自定义时间段</Button>
                <div class="form-group" id="tip-date" >
                    <DatePicker format="yyyy.MM.dd" confirm :value="date.day"  type="daterange"
                                :disabled="date.timeFlag"   placement="bottom-start"
                                placeholder="选择日期" @on-change="dateTime" @on-ok="timeOk"
                                id="picker" @on-clear="timeClear" :open="isOpen"
                                style="width: 200px"></DatePicker>
                    <span class="tip" v-show="!date.timeFlag">
                        <Tooltip content="最多只能选择30天的数据" placement="bottom-start">
                            <span><Icon type="help-circled"></Icon></span>
                        </Tooltip>
                    </span>
                </div>
            </div>
        </Card>
        <Card ref="detailCard" id="detailCard" class="detail-card">
            <p slot="title" class="groups">
                <Button :class="{'select-btn':count}" @click="lineChange">手机号个数</Button>
                <Button :class="{'select-btn':total}" @click="lineChange">有效手机号个数</Button>
                <Button :class="{'select-btn':success}" @click="lineChange">发送成功数</Button>
                <Button :class="{'select-btn':fail}" @click="lineChange">发送失败数</Button>
            </p>
            <div class="line-box" id="lineBox">
                <div id="lineEcharts" v-show="noData" style="width: 100%;height: 250px;"></div>
                <div class="no-data" v-show="!noData">暂无数据</div>
            </div>
            <div class="activity">
                <div class="export">
                    <a href="javascript:void(0);" @click="downLoad">下载报表</a>
                    <iframe src="" id="loadIframe" frameborder="0" style="display:none"></iframe>
                </div>
                <div class="table">
                    <div class="table-wrap">
                        <Table class="table" ref="table" border stripe :data="tableData.list"
                               :columns="tableData.columns"
                               :no-data-text="tableData.noDataText"></Table>
                    </div>
                </div>
            </div>
        </Card>

    </div>

</template>
<script>
    import "@/assets/css/message.less"
    var option, lineEcharts,timeNum = 3600 * 1000 * 24;//时间

    export default {
        data: function () {
            return {
                week: 'primary',
                month: null,
                elseTime: null,
                isOpen: false,
                eventName:this.$route.query.name,
                date:{
                    time:null,
                    openFlag: true,
                    timeFlag: true,
                    dateValue: {
                        disabledDate: function(date) {
                            return date && date.valueOf() > Date.now() - timeNum || date.valueOf() > Date.now()+timeNum*30;
                            //return date && date.valueOf() > Date.now() - timeNum || date.valueOf() < Date.now() - timeNum * 30
                        }
                    },
                },
                count: true,
                total: false,
                success: false,
                fail: false,
                noData: true,
                q:{
                    eventId:this.$route.query.id,
                    checkDays:7,
                    startTime:null,
                    endTime:null
                },
                lineCharts: {
                    phones: [],
                    validPhones: [],
                    successPhones: [],
                    failPhones: [],
                    xAxis: [],
                    legend: ['手机号个数'],
                    tempSeries: [],
                    tempLegend: ['手机号个数', '有效手机号个数', '发送成功数', '发送失败数'],
                    legendMap: {
                        '手机号个数': 'count',
                        '有效手机号个数': 'total',
                        '发送成功数': 'success',
                        '发送失败数': 'fail'
                    }
                },
                tableData: {
                    list: [],
                    columns: [
                        {
                            title: '日期',
                            key: 'createTime'
                        },
                        {
                            title: '手机号个数',
                            key: 'phones'
                        },
                        {
                            title: '有效手机号个数',
                            key: 'validPhones'
                        },
                        {
                            title: '发送成功数',
                            key: 'successPhones'
                        },
                        {
                            title: '发送失败数',
                            key: 'failPhones'
                        }
                    ],
                    noDataText: '',
                    totalCount: 0,
                    currentPage: 1,
                    size: 10,
                    sizeopt: [10, 20, 50, 100]
                }
            }
        },
        methods: {
            timeRange: function (event) {
                var text = event.srcElement.innerText;
                if (text.indexOf('7') > 0) {
                    this.week = 'primary';
                    this.month = this.elseTime = null;
                    this.q.checkDays=7;
                    this.q.startTime=this.q.endTime=null;
                    this.date.time = null;
                    this.isOpen=false;
                    this.date.timeFlag = true;
                } else if (text.indexOf('30') > 0) {
                    this.month = 'primary';
                    this.week = this.elseTime = null;
                    this.q.checkDays=30;
                    this.q.startTime=this.q.endTime=null;
                    this.date.time = null;
                    this.isOpen=false;
                    this.date.timeFlag = true;
                } else {
                    this.elseTime = 'primary';
                    this.week = this.month = null;
                    this.date.timeFlag = false;
                }

                this.getEchartData();
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
                    this.q.startTime = DateFormat( e[0]).toString("yyyy-MM-dd");
                    this.q.endTime = DateFormat( e[1]).toString("yyyy-MM-dd") ;
                    if(len > 0){
                        $('#tip-date .ivu-picker-confirm .dy').html('');
                    }
                    $confirm.find('.ivu-btn-primary').attr('disabled',false);
                }
            },
            timeOk:function () {
                if(this.date.openFlag){
                    this.q.checkDays=null;
                    this.isOpen = false;
                    this.getEchartData();
                }
            },
            timeClear:function () {
                //清空操作
                var len = $('#tip-date .ivu-picker-confirm .dy').length;
                if (len > 0) {
                    $('#tip-date .ivu-picker-confirm .dy').html('');
                }
                this.isOpen= false;
            },
            lineChange: function (event) {
                var _vm = this, text = event.srcElement.innerText, lm = this.lineCharts.legendMap, lg = this.lineCharts.legend;
                Array.prototype.del = function (value) {
                    var index = this.indexOf(value);
                    this.splice(index, 1);
                    return this;
                };
                for (var key in lm) {
                    if (text == key && lg.length == 2) {
                        if (_vm[lm[key]] == false) {
                            _vm.$Message.warning('最多选择两项');
                            return;
                        } else {
                            _vm[lm[key]] = false;
                            lg.del(key);
                            _vm.echartOptions();
                        }

                    } else if (text == key && lg.length == 1) {
                        if (_vm[lm[key]] == false) {
                            _vm[lm[key]] = true;
                            lg.push(key);
                            _vm.echartOptions();
                        } else {
                            _vm.$Message.warning('最少选择一项');
                            return;
                        }
                    }
                }

            },
            getAllData:function () {
                this.getEchartData();
            },
            handleClick: function (e) {
                if(!this.date.timeFlag){
                    $('#tip-date .ivu-picker-confirm .ivu-btn-text').find('span').html('取消');
                    this.isOpen = true;
                }
            },
            getEchartData: function () {
                var _vm = this, t, obj, a, c=[], va=[],s=[], f=[],x=[];
                _vm.tableData.list=[];
                _vm.lineCharts.tempSeries=[]
                lineEcharts = Echarts.init(document.getElementById("lineEcharts"));
                axios.get(getUrl('marketEvent/messagesDataInfo'), {params: _vm.q}).then(function (res) {
                    if (res.code == 0 && res.messagesData.length>0) {
                        a=res.messagesData.reverse();
                        _vm.tableData.noDataText = a.length > 0 ? '' : '暂无数据';
                        _vm.tableData.list=a;

                       a.forEach(function(v,i){
                            c.push(v.phones);
                            va.push(v.validPhones);
                            s.push(v.successPhones);
                            f.push(v.failPhones);
                            x.push(v.createTime);
                        })
                        _vm.lineCharts.phones=c;
                        _vm.lineCharts.validPhones=va;
                        _vm.lineCharts.successPhones=s;
                        _vm.lineCharts.failPhones=f;
                        _vm.lineCharts.xAxis=x;
                        t = [_vm.lineCharts.phones, _vm.lineCharts.validPhones, _vm.lineCharts.successPhones, _vm.lineCharts.failPhones];
                        for (var i = 0; i < t.length; i++) {
                            obj = {
                                name: _vm.lineCharts.tempLegend[i],
                                type: 'line',
                                data: t[i]
                            }
                            _vm.lineCharts.tempSeries.push(obj);
                        }
                        _vm.noData = true;
                        _vm.echartOptions();
                    } else {
                        _vm.noData = false;
                        _vm.tableData.noDataText = '暂无数据';
                    }
                }).catch(function (err) {
                    _vm.noData = false;
                    _vm.tableData.noDataText = '暂无数据';
                    console.log(err);
                })
            },
            echartOptions: function () {
                var _vm = this, legend = _vm.lineCharts.legend, temp = _vm.lineCharts.tempSeries, series = [];
                for (var i = 0; i < legend.length; i++) {
                    for (var j = 0; j < temp.length; j++) {
                        if (legend[i] == temp[j].name) {
                            series.push(temp[j]);
                        }
                    }
                }
                option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        top: 25,
                        data: legend
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: _vm.lineCharts.xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                };
                lineEcharts.setOption(option, true);
                window.addEventListener('resize', function () {
                    var linewidth = $('.line-box').width() || $('.echarts-box').width();
                    $('#lineEcharts').css('width', linewidth + 'px');
                    lineEcharts.resize();
                })
            },
            backToList: function () {
                this.$store.state.path="main";
                this.$router.push('/message/message.html')
            },
            downLoad:function(){
                var url=getUrl("marketEvent/downloadListCSV")+"?eventId="+this.q.eventId+"&eventName="+this.eventName+"&checkDays="+this.q.checkDays+"&startTime="+this.q.startTime+"&endTime="+this.q.endTime;
                document.getElementById('loadIframe').src=url;
            },
        },
        mounted: function () {
            var _vm = this, linewidth = $('.echarts-box').width() || $('.line-box').width();
            $('#lineEcharts').css('width', linewidth + 'px');
            this.getEchartData();
            $('#picker .ivu-input-wrapper').on('click',function () {
                _vm.handleClick()
            });
        }
    }
</script>