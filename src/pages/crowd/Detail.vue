<template id="tpl-detail">
    <div class="detail">
        <!--
        流失挽回：不显示推广商品
        其他场景：要显示——品类偏好、品牌偏好、平均客单价、综合购买力、忠诚度、流失等级、性别、年龄
    -->
        <div class="panel panel-default">
            <Card dis-hover>
                <p slot="title">营销场景设置</p>
                <Form :label-width="120">
                    <FormItem label="营销场景">
                        <div class="groups">
                           <span>{{detailData.scenesType}}</span>
                        </div>
                    </FormItem>
                    <!-- 流失挽回不显示"推广商品" -->
                    <FormItem label="推广商品" v-if="detailData.scenesType=='复购提升'">
                        <div class="groups">
                            <span v-for="item in editData.catName" v-text="item"></span>
                            <span v-for="item in editData.brandName" v-text="item"></span>
                        </div>
                    </FormItem>
                    <FormItem label="营销周期">
                        <span>{{editData.beginTime}}-{{editData.endTime}}</span>
                    </FormItem>
                    <!-- 其他场景 -->
                    <template v-if="detailData.scenesType=='其他场景'"  >
                        <FormItem label="品类偏好">
                            <div class="groups">
                                <span v-for="item in editData.catName" v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="品牌偏好">
                            <div class="groups">
                                <span v-for="item in editData.brandName" v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="平均客单价">
                            <div class="groups">
                                <span  v-for="item in editData.customerTransaction" v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="会员价值">
                            <div class="groups">
                                <span v-for="item in editData.vipValue" v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="忠诚度">
                            <div class="groups">
                                <span v-for="item in editData.loyalty" v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="流失等级">
                            <div class="groups">
                                 <span v-for="item in editData.lost" v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="性别">
                            <div class="groups">
                                <span v-for="item in editData.gender " v-text="item"></span>
                            </div>
                        </FormItem>
                        <FormItem label="年龄">
                            <div class="groups">
                                <span  v-for="item in editData.age " v-text="item"></span>
                            </div>
                        </FormItem>
                    </template>
                    <FormItem label="会员范围">
                        <div class="groups">
                            <span v-if="editData.regionName">{{editData.regionName}}</span><span v-if="editData.firstBranchName">{{editData.firstBranchName}}</span><span v-if="editData.secondBranchName">{{editData.secondBranchName}}</span><span v-if="editData.storeName">{{editData.storeName}}</span>
                        </div>
                    </FormItem>
                </Form>
            </Card>
        </div>
        <!-- 基本信息设置 -->
        <div class="panel panel-default">
            <Card dis-hover>
                <p slot="title">基本信息设置</p>
                <i-form :model="editData" :label-width="120">
                    <FormItem label="人群名称">
                        <span>{{editData.crowdName}}</span>
                    </FormItem>
                    <FormItem label="推送渠道">
                        短信
                    </FormItem>
                    <FormItem label="推送频次">
                        <span v-if="editData.frequency==0" >不限定</span>
                        <div style="display: inline-block;" v-if="editData.frequency==1">
                            <span>推送周期内最多</span>
                            <span>{{editData.frequencyCount}}</span>
                            <span>条</span>
                        </div>
                    </FormItem>
                </i-form>
            </Card>
            <div class="groups">
                <i-button type="primary" @click="backToList">返回</i-button>
                <!--<i-button type="primary" @click="cal">覆盖人数</i-button>-->
                <!--<span v-text="editData.coverUser"></span>-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                saveFields: ["catPrefer", "catName", "brandPrefer", "brandName", "customerTransaction", "vipValue", "loyalty", "lost", "gender", "age"],
                // 交互用的数据，如品类下拉数据，品牌下拉数据
                categories: [], // 品类
                brands: {}, // 品牌
                crowdList: [], // 人群
                regions: [],
                firstsubSections: [],
                secondsubSections: [],
                stores: [],
                vipRange: "1",
                catLoading: false,
                spinShow:true,
                saveBrands: {}, //保存未存在select下拉框的历史数据(品牌)
                // 交互录入的数据
                editData: {
                    crowdId: '', // 营销场景
                    dateRange: [], // 营销周期 t+1——不限
                    beginTime: null,
                    endTime: null,
                    /* 会员范围 start */
                    regionCode: '',//大区id
                    regionName:'', //大区名
                    firstBranch: '',//一级分部id
                    firstBranchName:'', //一级分部名
                    secondBranch: '',//二级分部id
                    secondBranchName:'',//二级分部名
                    store: '', //门店id
                    storeName:'',//门店名
                    /* 会员范围 end */
                    // 基本信息
                    crowdName: "", // 人群名称
                    channel: 1, // 推送渠道
                    frequency: 0, //推送限定
                    frequencyCount: null, // 推送频次
                    coverUser: null, // 覆盖人数

                    createUser: null // 创建人
                },
                //默认选项
                defaultData: {
                    vipRanges: [
                        {label: "全部会员", value: "1"},
                        {label: "大区会员", value: "2"},
                        {label: "分部会员", value: "3"},
                        {label: "门店会员", value: "4"},
                    ],
                    vipBranchs: [
                        {label: "一级分部", value: "1"},
                        {label: "二级分部", value: "2"},
                    ],
                },
                detailData: {
                    scenesType: "",
                    stage: null,
                    tempStage: null
                }
            }
        },
        methods: {
            getEditData: function(){
                var _vm = this;
                //this.spinShow=true;
                return axios.get(getUrl("crow/crowInfo"), {loading: true,unload: true, params: {id: this.$route.query.id}})
                        .then(function(res){
                            _vm.spinShow=false;
                            var result = res.crowInfo || {},fileds=_vm.saveFields;
                            result.beginTime=DateFormat(result.beginTime).toString('yyyy.MM.dd');
                            result.endTime=DateFormat(result.endTime).toString('yyyy.MM.dd');
                            _vm.editData = result;
                            for(var k in _vm.editData){
                                if(fileds.indexOf(k)>-1){
                                    //_vm.editData[k]=_vm.editData[k].replace(/,/g," ");
                                    // _vm.editData[k] && (_vm.editData[k]=_vm.editData[k].split(',')) ;
                                    if(_vm.editData[k]){
                                        _vm.editData[k]=_vm.editData[k].split(',')
                                        /*_vm.editData[k] = _vm.editData[k].map(function (item, cur) {
                                         if(item == ''){
                                         _vm.editData[k].splice(cur,1);
                                         }
                                         return item;
                                         })*/
                                        for(var i = 0;i < _vm.editData[k].length;i++){
                                            if(!_vm.editData[k][i]){
                                                _vm.editData[k].splice(i,1);
                                            }
                                        }
                                    }
                                }
                            }
                        })
            },
            backToList: function () {
                this.$store.state.path = "main";
                this.$router.push("/crowd/list.html");
            },
        },
        mounted:function(){
            this.detailData.scenesType = {stage1: "复购提升", stage2: "流失挽回", other: "其他场景"}[this.$route.query.stage];
            this.getEditData();
        }
    }
</script>