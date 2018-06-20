<template id="propertyDetail">
    <div class="detail">
        <Card dis-hover>
            <p slot="title"><span>基本信息</span>
                <Button class="return" type="primary" @click="returnInformation()">返回物业信息列表</Button>
            </p>
            <Table border :no-data-text="noDataText" style=" width:100%;" :data="infomationData"
                     :columns="infomationColumns" stripe></Table>
        </Card>
        <Card dis-hover>
            <p slot="title">覆盖小区</p>
            <Table border style=" width:100%;" :no-data-text="noDataText2" :data="coverData" :columns="coverColumns"
                     stripe></Table>
        </Card>
        <BackTop :bottom="150"></BackTop>

    </div>
</template>
<script>
    import "@/assets/css/property";
    export default {
        data(){
            var _vm=this;
            return {
                spinShow:true,
                noDataText:'数据加载中...',
                noDataText2:'数据加载中...',
                infomationColumns: [
                    {
                        title: '物业名称',
                        key: 'propertyCompanyName'
                    },
                    {
                        title: '联系方式',
                        key: 'tel'
                    },
                    {
                        title:'地址',
                        key:'companyAdderss'
                    }
                ],
                infomationData:[],
                coverColumns:[
                    {
                        title:'小区/楼盘名称',
                        key:'communityName',
                        render:function(h, params){
                            return  h('a', {
                                on:{
                                    click:function(){
                                        _vm.$store.state.path='sub';
                                        _vm.$router.push({
                                            path: '/village/villageOverview.html/villageDetail',
                                            query: {reset: 1,type:params.row.type,id:params.row.id}
                                        })

                                    }
                                }
                            }, params.row.communityName)}
                    },
                    {
                        title:'地址',
                        key:'communityAddress'
                    }
                ],
                coverData:[],
                text:'',
                size:'',
                page:''
            }
        },
        mounted:function(){
            var vm=this;
            this.$nextTick(function(){
                var id=vm.$route.query.id;
                axios.get(getUrl("PropertyDetail"),{ params:{
                    propertyId:id
                },loading: true, unload: true}).then(function(res){
                    vm.spinShow=false;
                    vm.infomationData.length=0;
                    vm.coverData.length=0;
                    vm.infomationData.push({
                        propertyCompanyName:res.propertyDetail.propertyInfo.propertyCompanyName,
                        tel:res.propertyDetail.propertyInfo.tel,
                        companyAdderss:res.propertyDetail.propertyInfo.companyAdderss
                    })
                    for(var i=0;i<res.propertyDetail.propertyCommunity.length;i++){
                        //var id=res.propertyDetail.propertyCommunity[i].community_id;
                        //var type=res.propertyDetail.propertyCommunity[i].community_type;
                        vm.coverData.push({
                            //communityName:'<a href="../village/details.html?reset=1&type='+type+'&id='+id+'">'+res.propertyDetail.propertyCommunity[i].community_name+'</a>',
                            communityName:res.propertyDetail.propertyCommunity[i].community_name,
                            communityAddress:res.propertyDetail.propertyCommunity[i].community_address,
                            id:res.propertyDetail.propertyCommunity[i].community_id,
                            type:res.propertyDetail.propertyCommunity[i].community_type
                        })
                    }

                }).catch(function(err){
                    vm.noDataText='暂无数据';
                    vm.noDataText2='暂无数据';
                    vm.spinShow=false;
                    console.log(err);
                })
            })
        },
        methods:{
            remove:function(e) {
                console.log(e);
            },
            returnInformation:function(){
                this.$store.state.path="main"
                this.$router.push('/property/property-information.html');
            }
        }

    }
</script>