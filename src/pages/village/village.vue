<template>
    <div id="village" class="village">
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
           <div class="form-condition" v-show="storeQuery">
               <div class="form-group">
                   <Select v-model="region" @on-change="querySelect">
                       <i-option v-for="item in regionList" :title="item.area" :value="item.areaId" :key="item.area">{{item.area}}</i-option>
                   </Select>
               </div>
               <div class="form-group">
                   <Select v-model="branch" @on-change="queryArea" >
                       <Option v-for="item in areaList"  :title="item.city" :value="item.cityId" :key="item.city">{{ item.city }}</Option>
                   </Select>
               </div>
               <div class="form-group select180" id="store">
                   <Select v-model="store" filterable placeholder="请选择门店">
                       <Option v-for="item in cityList" :title="item.name1" :longitude="item.longitude" :latitude="item.latitude" :stras="item.stras" :value="item.werks" :key="item.name1">{{ item.name1 }}</Option>
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
                       <Option value="1">新楼盘</Option>
                       <Option value="2">老小区</Option>
                   </Select>
               </div>
               <div class="form-group">
                   <Button type="primary" @click="villageData">查询</Button>
               </div>
               <div class="form-group">
                   <Button type="primary" @click="changeExhibition">{{switchText}}</Button>
               </div>
           </div>
           <div class="village-table i-pull-clear table"  v-show="showList">
               <Table :no-data-text="noDataInfo" border stripe :columns="columns" :data="dataTable" @on-sort-change="sort"></Table>
               <div class="i-pull-right page">
                   <Page :current="currPage" size="small" :total="totalPage" show-elevator :page-size="pageSize"  :placement="direction"
                         show-sizer show-total @on-change="change($event)" :page-size-opts="pageBranch" @on-page-size-change="changeSize($event)"></Page>
               </div>
           </div>
           <div class="map" v-show="!showList">
               <div id="map"  tabindex="0"></div>
           </div>
           <Back-top :bottom="150"></Back-top>
       </div>
        <router-view v-show="path!='main'"></router-view>
    </div>
</template>
<script>
    import "@/assets/css/villageStyle"
    import amapLoader from "@/assets/js/amap";
    import enterRouter from '@/assets/js/enterRouter.js';

    export default{
        data: function () {
            var self = this;
            return {
                node: 10,
                region: '',//大区
                branch: null,//分部
                distance: '3000',//距离
                quarters: '1',//新老区/老小区
                switchText: '切换至地图模式',
                showList: true,
                cityList: [],//分布数据
                areaList: [],
                regionList: [],
                store:'',
                dataTable:[],
                direction: 'top',// 每页显示条数展示方向
                totalPage: 0, // 分页总数
                initialization: true,//初始化
                currPage: 1,
                pageSize: 10,
                longitude: 116.480983,
                noDataInfo: '',
                latitude: 39.989628,
                contentTitle:'',//地图title
                stras: '',//门店地址
                condition:'1',//查询条件
                storeQuery: true,//是否展示查询条件
                searchText:'',//搜索的条件
                pageBranch: [10,20,50,100],//展示条数[10,20,50,100]
                columns:[ //纯碎为了初始化展示
                    {
                        title : '小区名称' ,
                        key : 'community_name',
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
                        title : '户数' ,
                        key : 'sum_households',
                        className : 'sum_households',
                        sortable: 'custom'
                    },
                    {
                        title : '会员数' ,
                        key : 'gome_member_num',
                        className : 'gome_member_num',
                        sortable: 'custom'
                    },
                    {
                        title : '营销价值评分' ,
                        key : 'score',
                        sortable: 'custom',
                        className: 'sort-name score initialize',
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
                                            fontSize:'15px',
                                            color:'#ccc',
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
                        title : '均价' ,
                        key : 'avg_priceint',
                        className : 'avg_priceint',
                        sortable: 'custom'
                    },
                    {
                        title : '操作',
                        key : 'community_id',
                        render: function (h, params) {
                            //这里参数不能全部定义  id 是变化的
                            return h('div', [
                                h('a', {
                                    style: {
                                        marginRight: '15px'
                                    },
                                    on: {
                                        click: function () {
                                            self.$store.state.path='sub';
                                            self.$router.push({
                                                path: '/village/villageOverview.html/villageDetail',
                                                query: {
                                                    id: params.row.community_id,
                                                    type: params.row.community_type
                                                }
                                            });
                                        }
                                    }
                                }, '详情'),
                                h('a', {
                                    on: {
                                        click: function () {
                                           self.$store.state.path="sub"
                                            self.$router.push({
                                                path: '/village/villageOverview.html/addRemark',
                                                query: {
                                                    id: params.row.community_id,
                                                    type: params.row.community_type
                                                }
                                            });
                                        }
                                    }
                                }, '添加备注')
                            ]);
                        }
                    }
                ],
                order:{
                    orderColumn:'score',//排序字段 默认decorationStatus
                    orderType:'desc',
                    orderData: 'desc'
                },
                regionFlag: true,
                areaChange: true,//分部选择下拉框控制初始onchange事件
                loadingTrue: false,
                changeFlag: true,
                sizeFlag :true,
                map: null
            }
        },
        extends: enterRouter,
        methods: {
            selectData: function (flag) {
                /**
                 * select 下拉框门店数据
                 */
                var self = this ,list =[],tempStore,tempCity,tempArea;
                return axios.get(getUrl("getStores"))
                        .then(function(respone){
                            self.cityList = [];//初始化
                            self.areaList = [];//初始化
                            if(respone.code === 0 && respone.page){
                                var list = respone.page.storesList,cityList = respone.page.cityList,areaList = respone.page.areaList;
                                self.cityList = list;
                                self.areaList = cityList;
                                self.regionList = areaList;
                                tempStore =  respone.page.authorStoreId || (list.length > 0 ? list[0].werks : '');
                                tempCity = cityList.length > 0 ? cityList[0].cityId : '';
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
                            self.dataTable = [];
                            self.totalPage = 0;
                            self.$Message.warning(error.msg);
                        });
            },
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
            villageData:function () {
                if(this.showList){
                    this.changeFlag = false;
                    this.sizeFlag = false;
                    this.currPage = 1;
                    this.pageSize = 10;
                    this.tableData()
                }else {
                    this.map.clearMap();
                    this.mapData();
                }
            },
            tableData: function (currPage,currSize) {
                this.loadingTrue ? layer.load(1, { shade: [0.3,'#fff']}) : this.loadingTrue = true;
                var self = this,
                        quarterArea = self.quarters ;
                self.noDataInfo = '';
                axios.get(getUrl("villageTable"),{
                    params:{
                        storeId : self.store,
                        distance: self.distance,
                        type: quarterArea,
                        orderColumn: self.order.orderColumn,
                        ordertype: self.order.orderType,
                        currPage:  currPage || self.currPage,
                        pageSize:  currSize || self.pageSize
                    },
                    unload: true
                })
                        .then(function(respone){
                            if(respone.page && respone.page.list.length > 0){
                                self.dataHandle(respone.page);
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
            dataHandle: function (data) {
                var self = this,orderType;
                self.totalPage = data.totalCount;
                var list = data.list,
                        listData = [], obj,parseIntNum,floatNum,leftNum,curItem;
                list.forEach(function (item,index) {
                    obj = {};
                    for (var cur in self.columns) {
                        curItem = self.columns[cur]["key"];
                        if(curItem == 'sum_households' || curItem== 'avg_priceint'){
                            parseIntNum = parseInt(item[curItem]);
                            parseIntNum = parseIntNum ? parseIntNum : 0;
                            obj[curItem] = comUtils.toThousands(parseIntNum);
                        }else if(curItem == 'score' && item[curItem] > 0){
                            obj[curItem] = (item[curItem]*100).toFixed(2);
                        }else if(curItem == 'gome_member_num' && item[curItem] > 0){
                            // obj[curItem] = (item[curItem] == 1 ? item[curItem]*100 : (item[curItem]*100).toFixed(2)) + '%';//会员覆盖率
                            obj[curItem] = comUtils.toThousands(item[curItem]);
                        }else{
                            obj[curItem] =  item[curItem];
                        }
                        obj.community_type = item['community_type'];
                    }
                    listData.push(obj);
                });
                self.dataTable = listData;
                if(self.initialization){
                    $('.ivu-table-header thead .ivu-table-cell').each(function(){
                        var $span = $(this).find('span:eq(0)');
                        $span.replaceWith('<i>'+$span.text()+'</i>');
                    });
                    $('.initialize .ivu-table-sort').find('.ivu-icon-arrow-down-b').addClass('on');
                    self.initialization = false;
                }
                if( !self.changeFlag){
                    self.currPage = data.currPage;
                }
            },
            sort: function (column) {
                //排序
                var cName;//记录唯一的class 也是他的key
                this.order.orderColumn = cName = column.key;
                if(column.order != 'normal'){
                    this.order.orderData = column.order;
                }
                $('.ivu-table-sort').find('.ivu-icon').removeClass('on');
                if(this.order.orderData == 'desc'){
                    setTimeout(function(){
                        $('.' + cName + '').find('.ivu-icon-arrow-down-b').addClass('on')
                    },50)
                }else {
                    setTimeout(function(){
                        $('.'+cName+'').find('.ivu-icon-arrow-up-b').addClass('on')
                    },50)
                }
                this.order.orderType = this.order.orderData;
                if(this.condition == 1){
                    this.tableData();
                }else {
                    this.searchData();
                }
            },
            changeExhibition: function () {
                /**
                 * 表格和地图切换
                 */
                this.showList = !this.showList;
                //   this.showList == true ? this.switchText = '切换至地图模式' : this.switchText = '切换至列表页';
                this.switchText = this.showList ? '切换至地图模式' : '切换至列表页';
                if(this.showList){
                    this.tableData()
                }else {
                    this.map.clearMap();
                    this.mapData()
                }
            },
            centerPointerMarker: function (e) {
                //画门店的标记
                var contents = e.target.content, _this = this,contentHtml = '<div><h4>'+ _this.contentTitle +'</h4><p><span>门店地址:</span>'+_this.stras+'</p></div>',
                infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -28),
                    content: contentHtml
                });
                infoWindow.open(this.map, e.target.getPosition());
            },
            mapData: function () {
                var self = this,
                        quarterArea = self.quarters ,
                        centerPointer,//门店中心店
                        centerMarker,//门店的标记
                        location;
                var $selectLi = $('#store .ivu-select-dropdown .ivu-select-dropdown-list li.ivu-select-item-selected');
                if($selectLi.length > 0){
                    this.longitude = $selectLi.attr('longitude'); //经度
                    this.latitude = $selectLi.attr('latitude'); //维度
                    this.contentTitle = $selectLi.attr('title'); //门店名称
                    this.stras = $selectLi.attr('stras'); //门店地址
                    centerPointer = [self.longitude, self.latitude];
                    // map.setZoomAndCenter(10, centerPointer);
                    var lngLat = new AMap.LngLat(self.longitude, self.latitude);//坐标对象
                    this.map.setCenter(lngLat);
                    location = new AMap.LngLat(self.longitude,self.latitude);
                    centerMarker = new AMap.Marker({
                        icon:'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                        position: location,
                        map: self.map
                    });
                    centerMarker.content = this.contentTitle;
                    centerMarker.on('click', self.centerPointerMarker);
                    centerMarker.emit('click', {target: centerMarker});
                    // map.setFitView();
                }
                axios.get(getUrl("villagePoint"),{
                    params:{
                        storeId : self.store,
                        distance: self.distance,
                        type: quarterArea
                    },
                    loading: true,
                    unload: true
                })
                        .then(function(jsondata){
                            if(jsondata.page && jsondata.page.list.length > 0){
                                self.loadPoint(jsondata);
                            }
                        })
                        .catch(function(error){
                            self.$Message.warning(error.msg);
                        });
            },
            change: function (page) {
                this.currPage = page;
                if(this.changeFlag){
                    if(this.condition == 1){
                        this.tableData();
                    }else{
                        this.searchData();
                    }
                }else{
                    this.changeFlag = true;
                }
            },
            changeSize: function (e) {
                this.pageSize = e;
                // sizeFlag ? this.tableData() : '';
                this.currPage = 1;
                this.changeFlag = false;
                if(this.sizeFlag){
                    if(this.condition == 1){
                        this.tableData()
                    }else {
                        this.searchData();
                    }
                }
            },
            searchData: function (currPage,currSize) {
                var self = this;
                self.noDataInfo = '';
                axios.get(getUrl("searchCommunity"),{
                    params:{
                        orderColumn: self.order.orderColumn,
                        ordertype: self.order.orderType,
                        currPage:  currPage || self.currPage,
                        pageSize:  currSize || self.pageSize,
                        communityName: self.searchText
                    },
                    loading: true,
                    unload: true
                })
                        .then(function(respone){
                            if(respone.page && respone.page.list.length > 0){
                                self.dataHandle(respone.page);
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
                this.currPage = 1;
                this.pageSize = 10;
                this.changeFlag = false;
                this.sizeFlag = false;
                this.searchText = '';
                this.order.orderColumn = 'score';
                this.order.orderType = 'desc';
                $('.ivu-table-sort').find('.ivu-icon').removeClass('on');
                $('.initialize .ivu-table-sort').find('.ivu-icon-arrow-down-b').addClass('on');
                if(val == 1){
                    //门店  初始化
                    this.storeQuery = true;
                    this.distance = '3000';
                    this.quarters = '1';
                    _this.areaChange = true;
                    this.regionFlag = true;
                    Promise.all([_this.selectData()]).then(function () {
                        _this.tableData();
                        _this.$nextTick(function () {
                            _this.areaChange = false;
                            _this.regionFlag = false;
                        })

                    })
                }else {
                    this.showList = true;
                    this.switchText = '切换至地图模式';
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
                //分部数据
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
                this.currPage = 1;
                this.searchData();
            },
            createInfoWindow: function (content) {
                //构建自定义信息窗体
                var table = '<table>',info,top,closeX,middle,spanTitle,cur,str,
                        type = this.quarters,_this = this ;
                content.forEach(function(item,index){
                    table += '<tr>';
                    table += '<td>' + item.name + '</td>';
                    if(item.name == '操作'){
                        cur = item.key.split(',');
                        str = '<a data-action="checkDetails" data-type="' + type + '" data-id="' + item.id + '">' + cur[0] + '</a>';
                        str += '<a style="padding-left: 10px" data-action="mark" data-type="' + type + '" data-id="' + item.id + '">' + cur[1] + '</a>';
                        table += '<td>' + str + '</td>';
                    }else {
                        table += '<td>' + item.key + '</td>';
                    }
                    table += '</tr>';
                });
                table += '</table>';
                info = document.createElement("div");
                top = document.createElement("div");
                closeX = document.createElement("span");
                middle = document.createElement("div");
                spanTitle = document.createElement('span');
                info.className = "info";
                top.className = "info-top";
                middle.className = "info-middle";
                spanTitle.innerHTML = '小区信息概览';
                top.appendChild(spanTitle);
                closeX.className = "close";
                closeX.innerHTML = '<i class="ivu-icon ivu-icon-close"></i>';
                closeX.onclick = this.closeInfoWindow;

                top.appendChild(closeX);
                info.appendChild(top);
                middle.innerHTML = table;
                info.appendChild(middle);

                // 定义底部内容
                var bottom = document.createElement("div");
                bottom.className = "info-bottom";
                var sharp = document.createElement("img");
                sharp.src = "http://webapi.amap.com/images/sharp.png";
                bottom.appendChild(sharp);
                info.appendChild(bottom);
                return info;
            },
            markerClick: function (e) {
                //给地图上点添加click事件
                // map.clearInfoWindow();
                var _this = this,
                        contents = e.target.content,
                        infoWindow = new AMap.InfoWindow({
                            isCustom: true,  //使用自定义窗体
                            offset: new AMap.Pixel(18, -35),
                            content:_this.createInfoWindow(contents)
                        });

                infoWindow.open(_this.map, e.target.getPosition());
            },
            loadPoint: function (jsondata){
                var _this = this;
                var hospitalInfoArr = jsondata.page.list,content ,obj = {}, lon,lat,location,marker;
                for (var i = 0; i < hospitalInfoArr.length; i++) {
                    lon = parseFloat(hospitalInfoArr[i].longtitude);
                    lat = parseFloat(hospitalInfoArr[i].latitude);
                    if(lon == 0 || lat == 0){
                        continue
                    }
                    location=new AMap.LngLat(lon,lat);
                    marker = new AMap.Marker({
                        position: location,
                        map: _this.map
                    });
                    obj = {};
                    content = [];
                    obj.name = '小区名称';
                    obj.key = hospitalInfoArr[i].community_name;
                    content.push(obj);
                    obj = {};
                    obj.name = '户数';
                    obj.key = comUtils.toThousands(hospitalInfoArr[i].sum_households);
                    content.push(obj);
                    obj = {};
                    obj.name = '会员数';
                    obj.key = comUtils.toThousands(hospitalInfoArr[i].gome_member_num);
                    content.push(obj);
                    obj = {};
                    obj.name = '小区类型';
                    obj.key = hospitalInfoArr[i].community_type == 1 ? '新楼盘' : '老小区';
                    content.push(obj);
                    obj = {};
                    obj.name = '营销价值评分';
                    obj.key = parseFloat(hospitalInfoArr[i].score * 100).toFixed(2) || '';
                    content.push(obj);
                    obj = {};
                    obj.name = '均价';
                    obj.key = comUtils.toThousands(hospitalInfoArr[i].avg_priceint);
                    content.push(obj);
                    obj = {};
                    obj.id = hospitalInfoArr[i].community_id;
                    obj.name = '操作';
                    obj.key = '详情,添加备注';
                    content.push(obj);
                    marker.content = content;
                    marker.on('click', _this.markerClick);
                    // marker.emit('click', {target: marker});
                }
            },
            closeInfoWindow: function () {
                //关闭信息窗体
                this.map.clearInfoWindow();
            }
        },
        computed:{
           path:function(){
               return this.$store.state.path
           }
        },
        mounted: function() {
            layer.load(1, { shade: [0.3,'#fff']});
            var _this = this;
            this.$nextTick(function () {
                Promise.all([_this.selectData()]).then(function () {
                    _this.tableData()
                })
            });
            amapLoader(function (){
                /*下面是关于高得地图加载*/
                _this.map = new AMap.Map('map',{
                    resizeEnable: true,
                    zoom: 13
                    // center: [116.239868,39.920454]
                });
                var lngLat = new AMap.LngLat(_this.longitude, _this.latitude);//坐标对象
                _this.map.setCenter(lngLat);
            });
            $(document).on("click", "a[data-action=checkDetails]", function(e){
                _this.closeInfoWindow();
                _this.$store.state.path="sub";
                _this.$router.push({
                    path: '/village/villageOverview.html/villageDetail',
                    query: {
                        id: $(e.target).data().id,
                        type: $(e.target).data().type
                    }
                });
            });
            $(document).on("click", "a[data-action=mark]", function(e){
                _this.closeInfoWindow();
                _this.$store.state.path="sub";
                _this.$router.push({
                    path: '/village/villageOverview.html/addRemark',
                    query: {
                        id: $(e.target).data().id,
                        type: $(e.target).data().type
                    }
                });
            });
        }
    }
</script>