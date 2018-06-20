<template id="add-temp">
    <div class="new-add">
        <Form ref="editData" :model="editData" :rules="ruleValidate" :label-width="120">
            <div class="panel panel-default">
                <Card dis-hover>
                    <p slot="title">创建营销活动</p>
                    <FormItem label="活动名称" prop="eventName">
                        <div class="groups">
                            <Input type="text" class="w-260" v-model="editData.eventName" placeholder="请输入活动名称"/>
                        </div>
                    </FormItem>
                    <FormItem label="活动类型">
                        <div class="groups">
                            <RadioGroup v-model="editData.eventType">
                                <Radio v-for="item in channels" :label="item.value" disabled :key="item.value">{{item.label}}</Radio>
                            </RadioGroup>
                        </div>
                    </FormItem>
                    <FormItem label="推送日期" prop="dateRange">
                        <div class="groups" id="tip-date">
                            <DatePicker  id="picker" v-model="editData.dateRange"  confirm
                                         format="yyyy.MM.dd" :options="options.dateRange"
                                         type="daterange"  placeholder="请选择日期"
                                         @on-ok="timeOk"  @on-clear="open=false" :open="open"
                                         @on-change="timeChange">

                            </DatePicker>
                        </div>
                    </FormItem>
                    <FormItem label="选择人群" prop="crowdName">
                        <div class="groups">
                            <!--<Select multiple clearable v-model="editData.crowdNames" not-found-text="暂无数据" @on-change="selectCrowd">-->
                                <!--<Option v-for="item in crowdList" :value="item" :key="item">{{item}}</Option>-->
                            <!--</Select>-->
                            <selection  placeholder="请选择人群" filter-placeholder="请输入人群名称"
                                       v-model="editData.crowdIds" :value="crowdList" :multiple="true" clearable
                                       value-field="crowdId"  label-field="crowdName"
                                       label-model="editData.crowdName" :context="this" @on-change="selectCrowd"
                            ></selection>
                        </div>
                    </FormItem>
                    <FormItem label="推送时间" prop="pushTime">
                        <div class="groups">
                            <span>每日定时</span>
                            <Select v-model="editData.pushTime">
                                <Option v-for="(item,idx) in 17"  :value="idx" :key="idx"  v-text="idx+8+'点'"></Option>
                            </Select>
                        </div>
                    </FormItem>
                    <!--<FormItem label="选择机构" prop="organization">-->
                        <!--<div class="groups">-->
                            <!--<Select v-model="editData.organ">-->
                                <!--<Option v-for="item in orglist" :value="item.value" :key="item.value">{{item.label}}</Option>-->
                            <!--</Select>-->
                        <!--</div>-->
                    <!--</FormItem>-->
                    <FormItem label="短信内容" prop="content">
                        <div class="groups">
                            <Input  type="textarea"  v-model="editData.content" class="message" :autosize="{minRows: 4}" placeholder="请编辑短信内容....."></Input>
                        </div>
                    </FormItem>
                </Card>
                <div class="groups">
                    <Button type="primary" @click="save">保存</Button>
                    <Button type="primary" @click="backToList">取消</Button>
                </div>
            </div>
        </Form>
    </div>
</template>
<script>
    import Vue from "vue"
//    import Selection from "@@/components/selection"
//    // 树组件
//    Vue.component(Selection.name, Selection);
    export default {
        data:function(){
            const validateDate = (rule, value, callback) => {
                if (value[1]=='') {
                    callback(new Error('推送日期不能为空'));
                } else {
                    callback();
                }
            };
            const validategrapha=(rule,value,callback)=>{
                var reg=/【(.+?)】/g;
                var m=reg.exec(value)
                if(m && (m[1].length>12 || m[1].length<2)){
                    callback(new Error('请输入2-12个汉字以内的签名'));
                }else {
                    callback();
                }
            }
            return {
                crowdList:[],//人群下拉
                orglist:[], //机构下拉
                open:false,
                editData:{
                    eventName:'', //活动名称
                    eventType:'0', //活动类型
                    dateRange:[], //推送周期
                    pushBegainDate:null,
                    pushEndDate:null,
                    pushTime:1, //推送时间
                    crowdIds:[],//人群id
                    createUser:top.$.cookie('username'),//登录用户
                    crowdName:[], //人群类型
                    crowdNames:null, //人群类型
//                    organ:null,  //组织机构
                    content:'' //短信内容
                },
                ruleValidate:{
                    eventName:[{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
                    dateRange: [
//                        {required: true, type: 'array', message: '推送日期不能为空', trigger: 'change'},
                          {validator: validateDate,  trigger: 'change'}
                    ],
                    crowdName:[
                        {required: true, type: 'array', message: '请选择人群', trigger: 'change'},
                        { type: 'array', max: 5, message: '最多可以选择5个人群', trigger: 'change' }
                    ],
                    pushTime:[
                        {required: true, type:'number', message: '请选择推送时间', trigger: 'change'}
                    ],
                    content: [
                        {required: true, type: 'string', message: '短信内容不能为空', trigger: 'blur'},
                        { type: 'string', max: 500, message: '最多可以输入500个字符', trigger: 'blur' },
                        { validator:validategrapha, trigger: 'blur' }
                    ]
                },
                options: {
                    dateRange: {
                        disabledDate: function (d) { // 只能从t+1开始选择
                            return d < DateFormat.convert(DateFormat().toDate(1), "YMD")
                        }
                    }
                }
            }
        },
        watch:{
            "editData.dateRange": function () {
                var dateRange = this.editData.dateRange || [];
                this.editData.pushBegainDate = DateFormat(dateRange[0]).toString("yyyy-MM-dd");
                this.editData.pushEndDate = DateFormat(dateRange[1]).toString("yyyy-MM-dd");
            }

        },
        computed:{
            channels: function () {
                return this.$store.state.messagechannels;
            }
        },
        methods:{
            backToList:function(){
                this.$store.state.path='main';
                this.$router.push("/market/marketList.html");
            },
            getCrowdList:function(){
                var _vm=this,beginDate= this.editData.pushBegainDate,endDate=this.editData.pushEndDate;
                axios.get(getUrl("marketEvent/getCrowdName"),{params:{crowdName:this.crowdName,pushBegainDate:beginDate,pushEndDate:endDate}}).then(function(res){
                    if(res.code==0){
                        _vm.crowdList=res.crowdInfoList;
                    }else {
                        _vm.crowdList.crowdList=[]
                    }
                }).catch(function(err){
                    console.log(err);
                })
            },
            timeOk:function(){
                this.getCrowdList();
                this.open=false;
            },
            timeChange:function(){
                $('#picker .ivu-picker-confirm').find('.ivu-btn-primary').attr('disabled',false);
            },
            selectCrowd:function(e){
                if(e.length>5){
                    this.editData.crowdIds =e.slice(0,5);
                }
            },
            save:function(){
                var _vm=this;
                this.$refs['editData'].validate(function(valid){
                    if (valid) {
                        _vm.editData.crowdIds=_vm.editData.crowdIds.join(',');
                        _vm.editData.crowdNames=_vm.editData.crowdName.join(',');
                        axios.post(getUrl("marketEvent/saveMarketEvent"),_vm.editData).then(function(data){
                            if(data.code==0){
                                _vm.$Message.success("操作成功");
                                _vm.backToList();
                                _vm.$parent.reload();
                            }
                        })
                    } else {
                        _vm.$Message.warning("操作失败")
                    }
                })
            }
        },
        mounted:function(){
            var vm=this;
           // this.getCrowdList();
            $('#picker .ivu-input-wrapper').on('click',function () {
                vm.open=true;
                $('#picker .ivu-picker-confirm').find('.ivu-btn-primary').attr('disabled',true);
            });

        }
    }
</script>