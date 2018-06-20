<template id="detail-temp">
    <div class="new-add">
        <Form  :model="editData" :label-width="120">
            <div class="panel panel-default">
                <Card dis-hover>
                    <p slot="title">营销活动设置</p>
                    <FormItem label="活动名称">
                        <div class="groups">
                            <span>{{editData.eventName}}</span>
                        </div>
                    </FormItem>
                    <FormItem label="活动类型">
                        <div class="groups">
                            <span>{{editData.eventType}}</span>
                        </div>
                    </FormItem>
                    <FormItem label="选择人群" >
                        <div class="groups">
                            <span v-for="item in editData.crowdNames">{{item}}</span>
                        </div>
                    </FormItem>
                    <FormItem label="推送日期">
                        <div class="groups">
                            <span>{{editData.pushBegainDate}}-{{editData.pushEndDate}}</span>
                        </div>
                    </FormItem>
                    <FormItem label="推送时间">
                        <div class="groups">
                            <span>每日定时</span>
                            <span>{{editData.pushTime}}点</span>
                        </div>
                    </FormItem>
                    <FormItem label="短信内容">
                        <div class="groups">
                            <p>{{editData.content}}</p>
                        </div>
                    </FormItem>
                </Card>
                <div class="groups">
                    <Button type="primary" @click="backToList">返回</Button>
                </div>

            </div>
        </Form>
    </div>
</template>

<script>
 export  default{
     data:function() {
         return {
             editData:{
                 eventName:'', //活动名称
                 eventType:"", //活动类型
                 dateRange:null, //推送周期
                 pushBegainDate:null,
                 pushEndDate:null,
                 pushTime:null, //推送时间
                 crowdNames:null, //人群类型
                 organ:null,  //组织机构
                 content:'' //短信内容
             }
         }
     },
     methods:{
         backToList: function () {
             this.$store.state.path="main";
             this.$router.push("/market/marketList.html");
         },
         getMarketInfo:function(){
             var _vm=this;
             axios.get(getUrl('marketEvent/getMarketEventInfo'),{params:{eventId:this.$route.query.eventId}}).then(function(res){
                 if(res.code==0){
                     var result=res.marketEventInfo;
                     result.pushBegainDate=DateFormat(result.pushBegainDate).toString('yyyy.MM.dd');
                     result.pushEndDate=DateFormat(result.pushEndDate).toString('yyyy.MM.dd');
                     result.crowdNames=result.crowdNames.split(',');
                     result.eventType=({
                         "0":["短信"],
                         "1":["邮件"],
                         "2":["DSP广告"],
                         "3":["PUSH推送"],
                     })[result.eventType][0];
                     _vm.editData=result;
                 }


             }).catch(function(err){
                 console.log(err);
             })
         }
     },
     mounted:function(){
         this.getMarketInfo();
     }
 }
</script>