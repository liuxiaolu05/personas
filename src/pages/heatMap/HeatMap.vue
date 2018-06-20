<template id="heatMap">
    <div  class="heat-map" >
        <div class="search-map groups">
            <div class="form-group">
                <Select v-model="area" @on-change="querySelect">
                    <Option v-for="item in regionList" :title="item.area" :value="item.areaId" :key="item.areaId">{{item.area}}</Option>
                </Select>
            </div>
            <div class="form-group">
                <Select v-model="branch" @on-change='queryArea'>
                    <Option v-for='item in areaList' :tilte='item.city' :value="item.cityId" :key='item.cityId'>{{item.city}}</Option>
                </Select>
            </div>
            <div class="form-group select180">
                <Select v-model="store" filterable placeholder="请选择门店" @on-change="selectStore">
                    <Option  v-for="item in cityList" :title="item.name1" :value="item.werks"  :key="item.name1">{{ item.name1 }}</Option>
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
            <Button :type="sevenType"   @click="timeRange">最近7天</Button>
            <Button :type="thirtyType"  @click="timeRange" >最近30天</Button>
            <Button  type="primary" @click="search()">搜索</Button>
        </div>
        <div id="map">
            <div id="container"></div>
        </div>
    </div>
</template>
<script>
    import "@/assets/css/property";
    import loadAMap from "@/assets/js/amap";
    import enterRouter from '@/assets/js/enterRouter.js';
    var heatmap,map;
    var lng = 116.480983;
    var lat = 39.989628;
    var lngLat;
    var heatmapData,heatMax, marker, info;
 export  default {
     data(){
         return {
             node: 13,
             area: '华北',
             branch: '',
             store: '',
             storeId:'',
             distance: '3000',
             cityList: [],
             areaList: [],
             regionList:[],
             timeType:'W',
             sevenType:'primary',
             thirtyType:'',
             saveAreaFlag: true,
             regionFlag: true
         }
     },
     extends: enterRouter,
     mounted: function () {
         //下拉框
         this.selectData();
         this.init();
     },
     methods: {
         init:function(){
             loadAMap(function (){
                 /*下面是关于高得地图加载*/
                 //初始化地图
                 map = new AMap.Map("container", {
                     resizeEnable: true,
                     //center: [lng, lat],//地图中心点
                     zoom: 13, //地图显示的缩放级别
                     scrollWheel: true
                 });
                 console.log(map);
                 lngLat = new AMap.LngLat(lng, lat);//坐标对象
                 map.setCenter(lngLat);
                 map.plugin(["AMap.Heatmap"], function () {
                     //初始化heatmap对象
                     heatmap = new AMap.Heatmap(map, {
                         radius: 25, //给定半径
                         opacity: [0, 0.8]
                         //,gradient:{
                         //    0.05: 'blue',
                         //    0.3: 'rgb(117,211,248)',
                         //    0.5: 'rgb(0, 255, 0)',
                         //    0.8: '#ffea00',
                         //    1.0: 'red'
                         //}
                     });

                 });
             });
         },
         selectData: function () {
             /**
              * select 下拉框数据
              */
             var _this = this;
             axios.get(getUrl("getStores"),{loading: true})
                     .then(function (respone) {
                         _this.cityList = [];//初始化
                         if (respone.code == 0 && respone.page) {
                             var list = respone.page.storesList,city = respone.page.cityList,areaList = respone.page.areaList;
                             _this.area= areaList.length > 0 ? areaList[0].areaId : '';
                             _this.store=_this.storeId = respone.page.authorStoreId || (list.length > 0 ?list[0].werks : '');
                             _this.branch = city.length > 0 ? city[0].cityId : '';
                         }
                         _this.cityList = list;
                         _this.areaList = city;
                         _this.regionList = areaList;
                         setTimeout(function(){
                             _this.getStore();
                             _this.getHeatdata();
                         },1000);

                     })
                     .catch(function (error) {
                         _this.cityList = [];
                         _this.areaList = [];
                     });
         },
         querySelect: function () {
             if(this.regionFlag){
                 this.regionFlag = false;
             }else{
                 var self = this;
                 return axios.get(getUrl("getCityByAreaId"),{
                             params:{areaId: this.area}
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
         search: function () {
             this.getStore();
             this.getHeatdata();
         },
         selectStore:function(e){
             this.storeId=e;
         },
         timeRange:function(e){
             if(e.target.innerText.indexOf('7天')>0){
                 this.sevenType='primary';
                 this.thirtyType='';
                 this.timeType='W';
             }else if(e.target.innerText.indexOf('30天')>0){
                 this.sevenType='';
                 this.thirtyType='primary';
                 this.timeType='M';
             }
         },
         queryArea: function (e) {
             var self = this;
             if(this.saveAreaFlag){
                 this.saveAreaFlag = false;
             }else {
                 axios.get(getUrl('getStoresByCityId'),{
                     params:{
                         cityId: e
                     }
                 }).then(function (data) {
                     if(data.code === 0 && data.page){
                         var list = data.page.storesList;
                         self.cityList = list.length > 0 ? list : [];
                         self.store = list.length > 0 ? list[0].werks : '';
                     }
                 }).catch(function (error) {
                     self.cityList = [];
                     self.$Message.warning(error.msg);
                 });
             }
         },
         getHeatdata:function(){
             var vm=this;
             //请求热力图points
             axios.get(getUrl("getHeatMap"), {params:{
                 storeId:vm.storeId,
                 distance:vm.distance,
                 timeType:vm.timeType
             }}).then(function (res) {
                 if(res.code==0){
                     heatmapData = res.heatMap.heatList;
                     heatMax = res.heatMap.heatMax;
                     //设置数据集
                     heatmap.setDataSet({
                         data: heatmapData,
                         max: heatMax
                     });
                 }
             }).catch(function (err) {
                 console.log(err)
             })
         },
         getStore:function(){
             var vm=this;
             map.clearMap();//清空标记点
             //if(heatmap!=''){
             //    heatmap.setDataSet({
             //        data: [],
             //        max: 0
             //    });
             //}
             //请求门店
             axios.get(getUrl("point"),
                     {
                         unload: true,
                         params:{
                             storeId:vm.storeId
                         }}).then(function (res) {
                 if(res.code==0){
                     lngLat = new AMap.LngLat(res.storeInfo.longitude, res.storeInfo.latitude);//坐标对象
                     map.setCenter(lngLat);
                     vm.addMarker();
                     var html='<div><h4>'+res.storeInfo.name1+'</h4><p><span>门店地址:</span>'+res.storeInfo.stras+'</p></div>'
                     //添加信息窗体
                     info = new AMap.InfoWindow({
                         content:html,
                         offset: new AMap.Pixel(0, -28)
                     })
                     info.open(map, marker.getPosition());
                     //给标注添加事件
                     addClickHandler(info, marker);
                 }
             }).catch(function (err) {
                 console.log(err)
             })
         },
         // 实例化点标记
         addMarker:function(){
             //添加标注
             marker = new AMap.Marker({
                 icon:'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                 position:lngLat
             });
             marker.setMap(map);
         }
     }
 }

    if (!isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
    }
    //判断浏览区是否支持canvas
    function isSupportCanvas() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
    //为marker标注绑定单击事件
    function addClickHandler(infoWindow, marker) {
        AMap.event.addListener(marker, 'click', function (e) {
            infoWindow.open(map, marker.getPosition());//显示信息窗体
        });
    }
</script>