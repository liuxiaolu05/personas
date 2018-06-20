<template id="propertyInformation">
    <div  class="information">
       <div v-show="path=='main'">
           <div class="groups">
               <Input class="input-box" v-model="searchText" placeholder="请输入物业名称"  @keyup.enter.native="search"></Input>
               <Button type="primary" class="search" @click="search" >搜索</Button>
           </div>
           <div class="content">
               <Table border  :no-data-text="noDataText" :data="tableData" :columns="columns" @mouseenter="" stripe></Table>
               <div style="float: right;" id="page" class="page">
                   <Page size="small" :total="totalCount" class="page" :current="page"  :page-size="size" :page-size-opts="sizeopt" show-elevator show-sizer show-total @on-change="changePage($event)"
                         @on-page-size-change="pageSize($event)" placement="top"></Page>

               </div>
               <BackTop :bottom="150"></BackTop>
           </div>
       </div>
        <router-view v-show="path!='main'"></router-view>
    </div>
</template>
<script>
    import "@/assets/css/property";
    import enterRouter from '@/assets/js/enterRouter.js';
    export default {
        data(){
            var vm=this;
            return {
                node: 12,
                searchText:'',
                noDataText:'',
                tableData:[],
                columns: [
                    {
                        title: '物业名称',
                        key: 'propertyCompanyName',
                        ellipsis:true,
                        className:'company-name',
                        render:function(h,params) {
                            return  h('span', {
                                domProps: {
                                    title:params.row.propertyCompanyName
                                },
                                style: {
                                    width:'100%',
                                    cursor:'default'
                                }

                            },params.row.propertyCompanyName )},
                    },
                    {
                        title: '管理小区数量',
                        key: 'managePropertyCounts',
                        width:'200'
                    },
                    {
                        title: '联系方式',
                        key: 'tel'
                    },
                    {
                        title: '地址',
                        key: 'companyAdderss',
                        ellipsis:true,
                        render:function(h,params) {
                            return  h('span', {
                                domProps: {
                                    title:params.row.companyAdderss,
                                },
                                style: {
                                    width:'100%',
                                    cursor:'default'
                                }

                            },params.row.companyAdderss )}
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render:function(h, params){
                            return  h('a', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click:function(){
                                        vm.$store.state.path='sub';
                                        vm.$router.push({path: "/property/property-information.html/propertyDetail" , query: {id:params.row.propertyId}});
                                    }
                                }
                            }, '查看详情')}
                    }
                ],
                totalCount:0,
                sizeopt:[10,20,50,100],
                size:10,
                page:1,
                fixedHeader:false,
                getPage:true,
                getSize:true
            }
        },
        extends: enterRouter,
        mounted:function(){
            this.getDataList();
        },
        computed:{
            path:function(){
                return this.$store.state.path
            }
        },
        methods:{
            search:function(){
                this.page=1;
                this.getDataList();
            },
            changePage:function (e) {
                this.page=e;
                this.getDataList();
            },
            pageSize:function(e){
                this.size=e;
                this.page = 1;
                this.getDataList();
            },
            getDataList:function(){
                var vm=this;
                axios.get(getUrl("PropertyList"),{params: {
                    propertyCompanyName:vm.searchText,
                    pageSize:vm.size,
                    currPage:vm.page
                },loading: true, unload: true}).then(function(res){
                    var data=[];
                    vm.totalCount=res.page.totalCount;
                    if(res.page.list.length>0){
                        for(var i=0;i<res.page.list.length;i++){
                            if(res.page.list[i].managePropertyCounts==null){
                                res.page.list[i].managePropertyCounts=0;
                            }
                            data.push({
                                propertyCompanyName:res.page.list[i].propertyCompanyName,
                                managePropertyCounts:res.page.list[i].managePropertyCounts,
                                tel:res.page.list[i].tel,
                                companyAdderss:res.page.list[i].companyAdderss,
                                propertyId:res.page.list[i].propertyId,
                            });
                        }
                    }else {
                        data=[];
                        vm.noDataText='暂无数据';
                    }
                    vm.tableData=data;
                }).catch(function(err){
                    vm.noDataText='暂无数据';
                    console.log(err);
                })
            }
        }
    }
</script>