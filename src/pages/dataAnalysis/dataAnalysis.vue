<template>
    <div id="analysis" class="analysis">
       <div v-show="path=='main'">
           <div class="form-condition multiLine">
               <label>查询条件</label>
               <Select v-model="condition" @on-change="queryCon">
                   <Option value="1">按门店查询</Option>
                   <Option value="2">按名称查询</Option>
               </Select>
           </div>
           <div class="form-condition" v-show="!storeQuery">
               <div class="form-group">
                   <Input class="search-input" v-model="searchText" placeholder="请输入小区名称"  @keyup.enter.native="search" />
               </div>
               <div class="form-group">
                   <Button type="primary" class="search" @click="search">搜索</Button>
               </div>
           </div>
           <div class="form-condition village" v-show="storeQuery">
               <div class="form-group">
                   <Select v-model="region" @on-change="querySelect">
                       <Option v-for="item in regionList" :title="item.area" :value="item.areaId" :key="item.area">{{item.area}}</Option>
                   </Select>
               </div>
               <div class="form-group">
                   <Select v-model="branch" @on-change="queryArea" >
                       <Option v-for="item in areaList"  :title="item.city" :value="item.cityId" :key="item.city">{{ item.city }}</Option>
                   </Select>
               </div>
               <div class="form-group select180 elli-select" id="store">
                   <Select v-model="store" filterable placeholder="请选择门店">
                       <Option v-for="item in cityList" :title="item.name1" :value="item.werks" :key="item.name1">{{ item.name1 }}</Option>
                   </Select>
               </div>
               <div class="form-group">
                   <Select v-model="distance">
                       <Option value="500">0.5KM</Option>
                       <Option value="1000">1KM</Option>
                       <Option value="2000">2KM</Option>
                       <Option value="3000">3KM</Option>
                       <Option value="4000">4KM</Option>
                       <Option value="5000">5KM</Option>
                   </Select>
               </div>
               <div class="form-group">
                   <Select v-model="quarters">
                       <Option value="0">全部</Option>
                       <Option value="1">新楼盘</Option>
                       <Option value="2">老小区</Option>
                   </Select>
               </div>
               <div class="form-group">
                   <Button type="primary" @click="queryData()">查询</Button>
               </div>
           </div>
           <div class="box-bot table analysis-table">
               <Table :no-data-text="noDataInfo" border stripe :columns="columns" :data="dataTable" @on-sort-change="sort"></Table>
               <div class="i-pull-right page">
                   <Page :current="page.currPage" size="small" :total="page.totalPage" show-elevator :page-size="page.pageSize"  :placement="page.direction"
                         show-sizer show-total :page-size-opts="page.pageBranch" @on-change="changePage($event)"  @on-page-size-change="changeSize($event)"></Page>
               </div>
           </div>
           <Back-top :bottom="150"></Back-top>
       </div>
        <router-view v-show="path!='main'"></router-view>
    </div>
</template>
<script>
    import "@/assets/css/villageStyle"
    import enterRouter from '@/assets/js/enterRouter.js';
    export default{
        data: function(){
            var self = this;
           return {
               region: '', //大区
               regionList: [],//大区数据
               branch: '', //分部
               distance: '3000', //距离
               cityList: [], //门店数据
               areaList: [],//分部的数据
               store:'', //门店
               columns:[
                   {
                       title: '小区名称',
                       key: 'community_name',
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
                       title: '昨日销售额',
                       key: 'gome_sale',
                       className: 'initialize sort-name self-adaption gome_sale',
                       sortable: 'custom'
                   },
                   {
                       title: '昨日订单数',
                       key: 'gome_sale_count',
                       className: 'self-adaption gome_sale_count',
                       sortable: 'custom'
                   },
                   {
                       title: '操作',
                       key: 'community_id',
                       className:'operation',
                       render: function(h, params) {
                           var id = params.row.community_id,
                                   villageName = encodeURI(params.row.community_name);
                           return h('div', [
                               h('i', {
                                   domProps: {
                                       className: 'analysis-icon icon v-icon icon-overviewofthesale'
                                   }
                               }),
                               h('a', {
                                   domProps: {
                                       className: 'operation-name'
                                   },
                                   on: {
                                       click: function () {
                                           self.$store.state.path = 'sub';
                                           self.$router.push({
                                               path: '/dataAnalysis/dataAnalysis.html/sale',
                                               query: {
                                                   id: id,
                                                   analysisType: 1,
                                                   villageName: villageName
                                               }
                                           });
                                       }
                                   }
                               },'销售概况'),
                               h('i', {
                                   domProps: {
                                       className: 'analysis-icon icon v-icon icon-Categoryanalysis'
                                   }
                               }),
                               h('a', {
                                   domProps: {
                                       className: 'operation-name'
                                   },
                                   on: {
                                       click: function () {
                                           self.$store.state.path  = 'sub';
                                           self.$router.push({
                                               path: '/dataAnalysis/dataAnalysis.html/category',
                                               query: {
                                                   id: id,
                                                   analysisType: 2,
                                                   villageName: villageName
                                               }
                                           });
                                       }
                                   }
                               },'品类分析'),
                               h('i', {
                                   domProps: {
                                       className: 'analysis-icon icon v-icon icon-Brandanalysis'
                                   }
                               }),
                               h('a', {
                                   domProps: {
                                       className: 'operation-name'
                                   },
                                   on: {
                                       click: function () {
                                           self.$store.state.path = 'sub';
                                           self.$router.push({
                                               path: '/dataAnalysis/dataAnalysis.html/brand',
                                               query: {
                                                   id: id,
                                                   analysisType: 3,
                                                   villageName: villageName
                                               }
                                           });
                                       }
                                   }
                               },'品牌分析'),
                               h('i', {
                                   domProps: {
                                       className: 'analysis-icon icon v-icon icon-Itemanalysis'
                                   }
                               }),
                               h('a', {
                                   domProps: {
                                       className: 'operation-name'
                                   },
                                   on: {
                                       click: function () {
                                           self.$store.state.path = 'sub';
                                           self.$router.push({
                                               path: '/dataAnalysis/dataAnalysis.html/single',
                                               query: {
                                                   id: id,
                                                   analysisType: 4,
                                                   villageName: villageName
                                               }
                                           });
                                       }
                                   }
                               },'单品分析')
                           ]);
                       }
                   }
               ], //表头
               dataTable:[], //表格数据
               quarters: '0', //新老区/老小区
               initialization: true, // 初始化
               noDataInfo: '',
               page:{
                   direction:'top', // 每页显示条数展示方向
                   totalPage:null, // 分页总数
                   currPage: 1, //当前页
                   pageSize:10, //当前页条数
                   pageBranch: [10,20,50,100]//展示条数[10,20,50,100]
               },
               order:{
                   orderColumn: 'gome_sale',//排序字段 默认decorationStatus
                   orderType: 'desc',
                   orderData: 'desc'
               },
               condition: '1',//查询条件
               searchText:'',
               storeQuery : true,
               regionFlag: true,
               areaChange: true,//分部选择下拉框控制初始onchange事件
               loadingTrue: false,
               changeFlag: true,
               sizeFlag: true,
               node: 11
           }
        },
        extends: enterRouter,
        computed:{
            path:function(){
               return this.$store.state.path
            }
        },
        methods: {
            querySelect: function () {
                if(this.regionFlag){
                    this.regionFlag = false;
                }else{
                    var self = this;
                    return axios.get(getUrl("getCityByAreaId"),{
                        params:{areaId: this.region}
                    })
                            .then(function(data){
                                if(data.code === 0 && data.page){
                                    var areaList = data.page.cityList;
                                    self.areaList = areaList;
                                    self.branch = areaList.length > 0 ? areaList[0].cityId : '';
                                }else{
                                    self.areaList = [];
                                }
                            })
                            .catch(function(error){

                            });
                }
            },
            selectData: function (flag) {
                /**
                 * select 下拉框数据
                 */
                var self = this ,list =[],tempStore,tempCity,tempArea;
                return axios.get(getUrl("getStores"))
                        .then(function(respone){
                            if(respone.code === 0 && respone.page){
                                var list = respone.page.storesList,
                                        cityList = respone.page.cityList,
                                        areaList = respone.page.areaList;
                                self.cityList = list;
                                self.areaList = cityList;
                                self.regionList = areaList;
                                tempStore =  respone.page.authorStoreId || (list.length > 0 ? list[0].werks : '');
                                tempCity =  cityList.length > 0 ? cityList[0].cityId : '';
                                tempArea = areaList.length > 0 ? areaList[0].areaId : '';
                                if(!flag){
                                    self.region = tempArea;
                                    self.branch = tempCity;
                                    self.store = tempStore;
                                }
                            }
                        })
                        .catch(function(error){
                            self.cityList = [];
                            self.areaList = [];
                            self.dataTable = [];
                            self.page.totalPage = 0;
                        });
            },
            queryData:function () {
                this.changeFlag = false;
                this.sizeFlag = false;
                this.page.currPage = 1;
                this.page.pageSize = 10;
                this.dataAnalysis();
            },
            dataHandle :function (res) {
                var self = this,
                        tableData,
                        itemObj,
                        floatNum,
                        leftNum,
                        orderType,//记录传值
                        listData = [];
                tableData = res.page;
                self.page.totalPage = tableData.totalCount;
                tableData.list.forEach(function (item,index) {
                    itemObj = {};
                    for (var cur in self.columns) {
                        //gome_sale_count昨日订单数  gome_sale销售额
                        if(self.columns[cur]["key"] == 'gome_sale_count'){
                            itemObj[self.columns[cur]["key"]] = comUtils.toThousands(item[self.columns[cur]["key"]]);
                        }else if(self.columns[cur]["key"] == 'gome_sale' && item[self.columns[cur]["key"]] > 0 ){
                            floatNum = parseFloat(item[self.columns[cur]["key"]]).toFixed(2).split('.');
                            leftNum = comUtils.toThousands(floatNum[0]);
                            itemObj[self.columns[cur]["key"]] =  leftNum + '.' + floatNum[1];
                        }else {
                            itemObj[self.columns[cur]["key"]] = item[self.columns[cur]["key"]];
                        }
                    }
                    listData.push(itemObj);
                });
                self.dataTable = listData;
                if(self.initialization){
                    $('#analysis .ivu-table-header thead .ivu-table-cell').each(function(){
                        var $span = $(this).find('span:eq(0)');
                        $span.replaceWith('<i>'+$span.text()+'</i>');
                    });
                    $('#analysis .initialize .ivu-table-sort').find('.ivu-icon-arrow-down-b').addClass('on');
                    self.initialization = false;
                }
                if(!self.changeFlag){
                    self.page.currPage = tableData.currPage;
                }
            },
            dataAnalysis: function (page,size) {
                this.loadingTrue ? layer.load(1, { shade: [0.3,'#fff']}) : this.loadingTrue = true;
                var self = this ;
                self.noDataInfo = '';
                axios.get(getUrl("analysisData"),{
                    params:{
                        storeId : self.store,
                        distance: self.distance,
                        type: self.quarters,
                        orderColumn: self.order.orderColumn,
                        ordertype: self.order.orderType,
                        currPage:  page || self.page.currPage,
                        pageSize:   size || self.page.pageSize
                    },
                    unload: true
                })
                        .then(function(res){
                            if(res.page && res.page.list.length > 0){
                                self.dataHandle(res);
                            }else{
                                self.dataTable = [];
                                self.page.totalPage = 0;
                                self.noDataInfo = '暂无数据';
                            }
                            self.changeFlag = true;
                            self.sizeFlag = true;
                        })
                        .catch(function(error){
                            self.dataTable = [];
                            self.page.totalPage = 0;
                            self.noDataInfo = error.msg;
                        })
            },
            changePage:function (e) {
                //改变分页码
                this.page.currPage = e;
                if(this.changeFlag){
                    if(this.condition == 1){
                        this.dataAnalysis();
                    }else {
                        this.searchData();
                    }
                }else {
                    this.changeFlag = true;
                }
            },
            changeSize: function (e) {
                //改变分页条数
                this.page.pageSize = e;
                this.page.currPage = 1;
                this.changeFlag = false;
                if(this.sizeFlag){
                    if(this.condition == 1){
                        this.dataAnalysis()
                    }else {
                        this.searchData();
                    }
                }
            },
            sort: function (column) {
                var cName;//记录唯一的class 也是他的key
                this.order.orderColumn = cName = column.key;
                if(column.order != 'normal'){
                    this.order.orderData = column.order;
                }
                $('#analysis .ivu-table-sort').find('.ivu-icon').removeClass('on');
                if(this.order.orderData == 'desc'){
                    setTimeout(function(){
                        $('.' + cName + '').find('.ivu-icon-arrow-down-b').addClass('on')
                    },50)
                }else {
                    setTimeout(function(){
                        $('.' + cName + '').find('.ivu-icon-arrow-up-b').addClass('on')
                    },50)
                }
                this.order.orderType = this.order.orderData;
                if(this.condition == 1){
                    this.dataAnalysis();
                }else {
                    this.searchData();
                }
            },
            searchData: function (currPage,currSize) {
                layer.load(1, { shade: [0.3,'#fff']})
                var self = this;
                self.noDataInfo = '';
                axios.get(getUrl("searchCommunity"),{
                    params:{
                        orderColumn: self.order.orderColumn,
                        ordertype: self.order.orderType,
                        currPage:  currPage || self.page.currPage,
                        pageSize:  currSize || self.page.pageSize,
                        communityName: self.searchText
                    },
                    unload: true
                })
                        .then(function(respone){
                            self.dataTable = [];
                            if(respone.page && respone.page.list.length > 0){
                                self.dataHandle(respone);
                            }else {
                                self.dataTable = [];
                                self.noDataInfo = '暂无数据';
                                self.totalPage = 0;
                            }
                            self.changeFlag = true;
                            self.sizeFlag = true;
                        })
                        .catch(function(error){
                            self.dataTable = [];
                            self.totalPage = 0;
                            self.noDataInfo = error.msg;
                        });
            },
            queryCon: function (val) {
                //门店 小区切换
                var _this = this;
                this.page.currPage = 1;
                this.page.pageSize = 10;
                this.changeFlag = false;
                this.sizeFlag = false;
                this.searchText = '';
                this.order.orderColumn = 'gome_sale';
                this.order.orderType = 'desc';
                $('#analysis .ivu-table-sort').find('.ivu-icon').removeClass('on');
                $('#analysis .initialize .ivu-table-sort').find('.ivu-icon-arrow-down-b').addClass('on');
                if(val == 1){
                    //门店  初始化
                    this.storeQuery = true;
                    this.distance = '3000';
                    this.quarters = '0';
                    this.areaChange = true;
                    this.regionFlag = true;
                    Promise.all([_this.selectData()]).then(function () {
                        _this.dataAnalysis();
                        _this.$nextTick(function () {
                            _this.areaChange = false;
                            _this.regionFlag = false;
                        });
                    })
                }else {
                    this.storeQuery = false;
                    this.searchData();
                }

            },
            regionData: function () {
                //大区数据
                var self = this;
                return axios.get(getUrl('getAllAreas')).then(function (data) {
                    if(data.code === 0 && data.page){
                        var list = data.page.areaList;
                        self.regionList = list.length > 0 ? list : [];
                    }
                }).catch(function (error) {
                    self.$Message.warning(error.msg);
                });
            },
            area: function () {
                //分布数据
                var self = this;
                return axios.get(getUrl('getCities')).then(function (data) {
                    if(data.code === 0 && data.page){
                        var list = data.page.cityList;
                        self.areaList = list.length > 0 ? list : [];
                    }
                }).catch(function (error) {
                    self.$Message.warning(error.msg);
                });
            },
            getCity: function (e,flag) {
                var self = this;
                return axios.get(getUrl('getStoresByCityId'),{
                    params:{
                        cityId: e
                    }
                }).then(function (data) {
                    if(data.code === 0 && data.page){
                        var list = data.page.storesList;
                        self.cityList = list.length > 0 ? list : [];
                        if(flag){
                            self.store = list.length > 0 ? list[0].werks : '';
                        }
                    }
                }).catch(function (error) {
                    self.cityList = [];
                    self.dataTable = [];
                    self.page.totalPage = 0;
                    self.$Message.warning(error.msg);
                });
            },
            queryArea: function (e) {
                var self = this;
                if(this.areaChange){
                    this.areaChange = false;
                    return new Promise(function (resolve) {
                        resolve()
                    })
                }else{
                    this.getCity(e,true);
                }
            },
            search: function () {
                this.page.currPage = 1;
                this.searchData();
            }
        },
        mounted: function() {
            layer.load(1, { shade: [0.3,'#fff']});
            var self = this;
            Promise.all([self.selectData()]).then(function () {
                self.dataAnalysis()
            })
        }
    };
</script>