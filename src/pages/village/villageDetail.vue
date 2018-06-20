<template>
    <div id="details" class="details">
        <div class="top-title title-box  box-bot">
            <div class=" title">
                <div class="i-pull-left title-name">
                    <span v-text="villageTitle"></span>
                </div>
                <div class="i-pull-right">
                    <Button type="primary" @click="back">{{backText}}</Button>
                </div>
            </div>
            <div class="top-details box-content i-pull-clear">
                <div class="img i-pull-left" :class="{old:old}"><!--:src="imgSrc"-->
                    <img :src="imgSrc" :onerror="defaultShowImg" alt="详情页" >
                </div>
                <div class="details-table i-pull-right">
                    <div class="detail-con i-pull-clear" v-for="item in columns">
                        <div class="de-title" v-text="item.title"></div>
                        <div class="de-val" v-html="item.val"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="perimeter title-box">
            <div class="title">
                <div class="perimeter-t box-bot">查看周边</div>
            </div>
            <div class="perimeter-map box-content">
                <div id="details-map" class="details-map"></div>
                <div class="panel">
                    <div id="panel"></div>
                    <!--<div class="location" v-show="mapVal.lo" @click="change"><template><Icon type="ios-location"></Icon><span>附近</span></template></div>-->
                </div>
                <div class="search">
                    <div class="nearby">
                        在<span class="tip-val-left" v-text="villageTitle"></span>附近搜索
                        <input id="nearInput" type="text" v-model="mapVal.tipNearbyVal" @keyup.enter="nearby" placeholder="">
                        <span class="btn-search" @click="nearby"><Icon type="ios-search-strong"></Icon></span>
                        <Tooltip content="清空附近搜索" placement="bottom" class="backTip">
                            <span @click="closeNear"><Icon type="ios-close-empty"></Icon></span>
                        </Tooltip>
                    </div>
                    <!-- <div class="tip-search" v-show="mapVal.near">
                         <input id="tipInput" type="text" v-model="mapVal.tipVal" @focus="tipFocus" @keyup.enter="search" placeholder="请输入关键字搜索">
                         <template><span class="btn-search" @click="search"><Icon type="ios-search-strong"></Icon></span><span class="clear-con" @click="clearCon"><Icon type="ios-close"></Icon></span></template>
                     </div>
                     <div class="nearby" v-show="!mapVal.near">
                         在<span class="tip-val-left" v-text="mapVal.name"></span>附近搜索
                         <input id="nearInput" type="text" v-model="mapVal.tipNearbyVal" @focus="tipFocus" @keyup.enter="nearby" placeholder="">
                         <template >
                             <span class="btn-search" @click="nearby"><Icon type="ios-search-strong"></Icon></span>
                             <Tooltip content="关闭附近搜索" placement="bottom" class="backTip">
                                 <span @click="closeNear"><Icon type="ios-close-empty"></Icon></span>
                             </Tooltip>
                             &lt;!&ndash;<span class="clear-con" @click="clearCon"><Icon type="ios-close"></Icon></span>&ndash;&gt;
                         </template>
                     </div>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import amapLoader from "@/assets/js/amap";
    import defaultImg from '@/assets/image/loser.jpg';
    export default{
        data:function(){
            return {
                columns: [],
                dataTable: [],
                villageTitle:'',
                imgSrc: '',//图片地址,
                old: false,//图表高度
                longtitude: null , //经度
                latitude : null, //维度
                clearVal: true,//隐藏清空按钮 input
                common: [],
                older : [
                    {
                        title : '近期成交' ,
                        key : 'recent_volume'
                    },
                    {
                        title : '竣工时间' ,
                        key : 'complete_time'
                    },
                    {
                        title : '建筑年代' ,
                        key : 'year_built'
                    },
                    {
                        title : '物业类型' ,
                        key : 'property_type'
                    },
                    {
                        title : '当期户数' ,
                        key : 'current_households'
                    }
                ],
                newer : [
                    {
                        title : '装修状况' ,
                        key : 'decoration_status'
                    },
                    {
                        title : '开盘时间' ,
                        key : 'opening_quotation_time'
                    },
                    {
                        title : '交房时间' ,
                        key : 'others_time'
                    },
                    {
                        title : '主力户型' ,
                        key : 'main_apartment'
                    }
                ],
                mapVal:{
                    tipVal: '',
                    tipNearbyVal: '',
                    placeSearch: null,
                    centerPoint: null,
                    near: true,
                    map: null,
                    name:'',
                    lo: false // 查看附近
                },
                defaultImgSrc: defaultImg,
                defaultShowImg: 'this.src="'+ defaultImg + '"',
                backText: '返回小区列表'
            }
        },
        methods: {
            getTableData: function () {
                var self = this, listData,//数据源，重新整合在一起 title\val
                        id = this.$route.query.id,
                        type = this.$route.query.type;
                self.common = [
                    {
                        title : '楼盘地址' ,
                        key : 'community_address'
                    },
                    {
                        title : '小区均价' ,
                        key : 'avg_priceint'
                    },
                    {
                        title : '物业类别' ,
                        key : 'property_category'
                    },
                    {
                        title : '物业公司' ,
                        key : 'property_company_name'
                    },
                    {
                        title : '总户数' ,
                        key : 'sum_households'
                    },
                    {
                        title : '覆盖会员数' ,
                        key : 'gome_member_num'
                    },
                    {
                        title : '会员覆盖率' ,
                        key : 'gome_member_cover'
                    },
                    {
                        title : '近7日销售额' ,
                        key : 'gome_sale_7day'
                    },
                    {
                        title : '营销价值评分' ,
                        key : 'score'
                    }
                ];
                if(type == '1'){
                    self.old = false;
                    self.columns = self.common.concat(self.newer);
                }else {
                    self.old = true;
                    self.columns = self.common.concat(self.older);
                }
                axios.get(getUrl("villageDetail"),{
                    params:{
                        id: id
                    },
                    loading: true,
                    unload: true
                })
                        .then(function(respone){
                            if(respone.detail) {
                                listData = respone.detail;
                                self.imgSrc = listData.picture ? listData.picture : self.defaultImgSrc;
                                self.villageTitle = listData.community_name;
                                self.longtitude = listData.longtitude;
                                self.latitude = listData.latitude;
                                self.mapVal.centerPoint = [self.longtitude,self.latitude];
                                var name = [ '暂无资料' , '待定' , '没有物业' , '无物业公司' , null , ''],
                                        floatNum,leftNum,parseIntNum;
                                self.columns.forEach(function (item, index) {
                                    if((item["key"]  == 'property_company_name') && !name.selfContains(listData[item["key"]])){//物业公司
                                        item.val = "<a class='property-link' data-action='property'  data-id='"+listData.property_id+"'>" + listData[item['key']] + "</a>";
                                    }else if(item["key"]  == 'avg_priceint' || item["key"] == 'sum_households' || item["key"] == 'current_households' || item["key"] == 'gome_member_num'){
                                        //千分制 小区均价 总户数 当期户数 会员数
                                        parseIntNum = parseInt(listData[item["key"]]);
                                        item.val = item["key"] == '' ?  "0" : comUtils.toThousands(parseIntNum);
                                    }else if(item["key"]  == 'gome_sale_7day' && listData[item["key"]] > 0){
                                        floatNum = parseFloat(listData[item["key"]]).toFixed(2).split('.');
                                        leftNum = comUtils.toThousands(floatNum[0]);
                                        item.val  = leftNum + '.' + floatNum[1];
                                    }else if(item["key"]  == 'score' && listData[item["key"]] > 0){
                                        item.val =  (listData[item["key"]] * 100).toFixed(2);
                                    }else if(item["key"]  == 'gome_member_cover' && listData[item["key"]] > 0){
                                        item.val =  (listData[item["key"]] * 100).toFixed(2) + '%';
                                    }else{
                                        item.val = item["key"] == '' ?  "" : listData[item["key"]];
                                    }
                                });
                                self.centerPointerFn();
                            }else{
                                self.imgSrc = self.defaultImgSrc;
                            }
                        })
                        .catch(function(error){
                            self.imgSrc = self.defaultImgSrc;
                            console.log(error);
                        });
            },
            back: function () {
                this.$store.state.path = 'main';
                this.$router.push('/village/villageOverview.html');
            },
            toProperty:function(id){
                this.$store.state.path='sub';
                this.$router.push({path:'/property/property-information.html/propertyDetail',query:{id:id,reset:1}})
            },
            search: function (){
                var _this = this;
                $.trim(_this.mapVal.tipVal) ? _this.mapVal.placeSearch.search(_this.mapVal.tipVal) : '';
            },
            nearby: function (){
                var _this = this;
                //中心点坐标
                $.trim(_this.mapVal.tipNearbyVal) ? _this.mapVal.placeSearch.searchNearBy(_this.mapVal.tipNearbyVal, _this.mapVal.centerPoint, 2000, function(status, result) {}) : '';
                _this.mapVal.lo = false;
                _this.clearVal = true;
            },
            clear: function () {
                this.mapVal.placeSearch.clear();
            },
            change: function () {
                this.mapVal.near = false;
                setTimeout(function () {
                    document.getElementById('nearInput').focus()
                },10)
            },
            clearCon: function () {
                this.mapVal.tipNearbyVal ? this.mapVal.tipNearbyVal = '' : '';
                this.clear();
            },
            closeNear: function () {
                this.mapVal.tipNearbyVal = '';
                //this.mapVal.near = true;
                this.clear();
            },
            centerPointerFn: function () {
                var  location ,
                        centerPointer,
                        centerMarker,//中心点
                        _this = this;
                centerPointer = [_this.longtitude, _this.latitude];
                _this.mapVal.map.setZoomAndCenter(11, centerPointer);
                location = new AMap.LngLat(_this.longtitude,_this.latitude);
                centerMarker = new AMap.Marker({
                    icon:'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                    position: location,
                    map: _this.mapVal.map
                });
                centerMarker.on('click', _this.centerPointerMarker);
                centerMarker.emit('click', {target: centerMarker});
                _this.mapVal.map.setFitView();
            },
            centerPointerMarker: function (e) {
                //画门店的标记
                var infoWindow,
                        _this = this,
                        contentHtml = '<div><p><strong>小区名称</strong></p><p>'+ _this.villageTitle +'</p></div>';
                infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -28),
                    content: contentHtml
                });
                infoWindow.open(_this.mapVal.map, e.target.getPosition());
                _this.mapVal.map.setFitView();
            }
        },
        mounted: function() {
            var _this = this;
            _this.getTableData();
            /*地图渲染*/
            amapLoader(function (){
                /*下面是关于高得地图加载*/
                _this.mapVal.map = new AMap.Map("details-map", {
                    resizeEnable: true,
                    zoom: 11
                });
                AMap.service(["AMap.PlaceSearch"], function() {
                    _this.mapVal.placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                        pageSize: 5,
                        pageIndex: 1,
                        map: _this.mapVal.map,
                        panel: "panel"
                    });
                    _this.mapVal.placeSearch.on('listElementClick', function(SelectChangeEvent) {
                        var  data = SelectChangeEvent.data;
                        var  location = data.location;
                        _this.mapVal.map.setZoomAndCenter(11, [location.lng,location.lat]);
                    });
                });
            });
            $(document).on("click", "a[data-action=property]", function(e){
                let id=$(this).data('id');
                _this.toProperty(id);
            });

        }
    };
</script>