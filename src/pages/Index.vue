<template>
    <div class="full-height">
        <div class="header ivu-row-flex">
            <div class="layout-menu-left" :class="{'bg-color':menuList.length>0}"
                 :style="{width: (navTitle.length + 2) + 'em'}">
                <div class="layout-logo-left">
                    <span v-text="navTitle"></span>
                </div>
            </div>
            <div class="layout-menu-right">
                <div class="layout-header">
                    <Button type="text" @click="toggleClick" class="header-switch pull-left">
                        <i class="icon icon-quanbushangpin"></i>
                    </Button>
                    <Menu ref="navMenu" id="layoutNav" class="layout-nav pull-left" mode="horizontal"
                          :active-name="activeName" @on-select="navMenuSeleted">
                        <MenuItem   v-for="item in navMenuList" :name="item.menuId" :key="item.menuId" :id="item.menuId">
                            <i class="icon " :class="item.icon"></i>
                            <Tooltip content="此功能尚未开放" v-if="item.list.length<=0"><span class="nav-selected">{{item.name}}</span></Tooltip>
                            <span v-else v-text="item.name" class="nav-selected"></span>
                        </MenuItem>
                    </Menu>
                    <div class="more-action">
                        <!--<Icon type="ios-help-outline" title="帮助"></Icon>-->
                        <Dropdown>
                            <Icon type="android-arrow-dropdown"></Icon>
                            <DropdownMenu class="more-drop" slot="list">
                                <DropdownItem>
                                    <div @click="passwordShow">修改密码</div>
                                </DropdownItem>
                                <DropdownItem>
                                    <div @click="logout">退出登录</div>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div class="content ivu-row-flex">
            <div class="layout-menu-left" :class="{'bg-color':menuList.length>0, hide:!leftMenuStatus_}"
                 :style="{width: (navTitle.length + 2) + 'em'}">
                <!--个人信息-->
                <div class="persional-info">
                    <div class="img-wrap" >
                        <i class="icon icon-touxiang"></i>
                    </div>
                    <!--<h3 >{{person.department}}</h3>-->
                    <!--<p>-->
                    <!--<span :class="{show:show}">{{person.job}}</span>-->
                    <!--<span :class="{show:show}">{{person.name}}</span></p>-->
                    <h3 v-text="chineseName"></h3>
                </div>
                <tree-menu ref="menu" key-field="menuId" children="list" :accordion="true" :value="menuList"
                           @select="menuSeleted"
                           :class="{'mini-icon': this.menuStatus==2}"
                >
                </tree-menu>
            </div>
            <div class="layout-menu-right">
                <div class="layout-content">
                    <div class="layout-content-main">
                        <div class="my-component">
                            <router-view @enter="enter"></router-view>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <v-password ref="modifypassword" :showList.sync="showList"></v-password>
    </div>
</template>

<script>
    import "@/assets/css/style"
    import "tree-menu/style.less"
    import Vue from "vue"
    import TreeMenu from "tree-menu"
    import modifypassword from "@/pages/ModifyPassword"
    // 树组件
    Vue.component(TreeMenu.name, TreeMenu);
    // 格式化菜单列表数据。支持扁平化和嵌套混合模式的数据
    function routerList(menuList, handler) {
        var keyField = "menuId", parentField = "parentId", subField = "list", urlField = "url";
        function serialize(menuList, handler) {
            var rootList = [], map = {}, temp = {}, key, node, parentKey, parentNode, subNodes;
            for (var i in menuList) {
                node = menuList[i];
                key = node[keyField];
                parentKey = node[parentField];
                // 绑定路由事件
                if (node.hasOwnProperty(urlField) && handler) {
                    handler(node[urlField]);
                }
                /**数据有[parentField]，把数据挂到[parentField]对应数据的[subField]中。
                 * 如果对应的[parentField]数据还没有生成，把当前数据挂到临时区域内。等待父节点初始化的时候合并。
                 * 没有parentKey的数据是一级节点
                 * */
                if (parentKey) {
                    // 映射区中查找父节点
                    if (parentNode = map[parentKey]) {
                        /**父节点的[sub]已存在当前节点
                         * true：在该节点本来的位置上替换掉该节点
                         * false：添加该节点
                         * */
                        subNodes = parentNode[subField];
                        if (!subNodes.some(function (item, i) {
                                    if (item[keyField] == key) {
                                        subNodes[i] = node;
                                        return true;
                                    }
                                })
                        ) {
                            subNodes.push(node);
                        }
                    } else {
                        temp[parentKey] = node;
                    }
                } else {
                    rootList.push(node);
                }

                /**1、把数据挂到映射区域
                 * 2、如果当前数据本身具有[sub]（嵌套子级结构），使用相同的逻辑注册这些子节点
                 * 3、在临时区域查找同名[key]数据，把该数据（数组格式）合并到当前数据的[sub]中
                 * */
                    // 1
                map[key] = node;
                // 2
                if (Object.prototype.toString.call(node[subField]) == "[object Object]") {
                    node[subField] = [node[subField]];
                } else if (Object.prototype.toString.call(node[subField]) != "[object Array]") {
                    node[subField] = []
                }
                serialize(node[subField], handler);
                // 3
                if (temp[key]) {
                    node[subField].concat(temp[key]);
                    delete temp[key];
                }
            }
            return rootList;
        }

        return serialize(menuList, handler);
    }
//    function getUrl(url) {
//        return {
//              "organization":"https://www.easy-mock.com/mock/5a5c6dc5c2f7622d2380ed02/market/organization",
//              "getCrowdName":"http://10.2.49.30:8075/marketEvent/getCrowdName",
//
//        }[url]
//    }
    const appId = $.cookie('appId'), chineseName = decodeURI(decodeURI(top.$.cookie('chineseName')));
    var store = function () {
        function p (a,b){
            if(a){
                return new Promise(function(resolve){resolve(a)})
            }else {
                return b();
            }
        }
        return new Vuex.Store({
            state: {
                messageStates: [
                    {label: "待投放", value: "0"},
                    {label: "投放中", value: "1"},
                    {label: "已终止", value: "2"},
                    {label: "已暂停", value: "3"}
                ],
                messagechannels: [
                    {label: "短信", value: "0"},
                    {label: "邮件", value: "1"},
                    {label: "DSP广告", value: "2"},
                    {label: "PUSH推送", value: "3"},
                ],
                organization:null,
                user: {
                    username: top.$.cookie("username")
                },
                states: [
                    {label: "未开始", value: "0"},
                    {label: "更新中", value: "1"},
                    {label: "更新完成", value: "2"},
                    {label: "已过期", value: "3"}
                ],
                stagesMap: {
                    "stage1": "复购提升",
                    "stage2": "流失挽回",
                    "other": "其他场景"
                },
                stages: [
                    {label: "复购提升", value: "stage1",idx:"1"},
                    {label: "其他场景", value: "other" ,idx:"2"},
                    {label: "流失挽回", value: "stage2",idx:"3"}
                ],
                channels:[
                    {label:"app-push",value:"3"},
                    {label:"邮件",value:"2"},
                    {label:"短信",value:"1"},
                    {label:"DSP",value:"4"},
                    {label:"移动DSP",value:"5"},
                ],
                categories: null, // 品类下拉
                brands: null, // 品牌下拉
                stores:null, //门店下拉
                regions:null, //大区下拉
                path:'main'
            },
            getters:{
//                organization:function(state){
//                    return p(state.organization,function(){
//                        return axios.get(getUrl("organization")).then(function(res){
//                            if(res.code==0){
//                                state.organization=res.list;
//                            }else {
//                                state.organization=[]
//                            }
//                            return state.organization;
//                        })
//                    })
//                },
                // 品类
                categories: function(state){
                    return p(state.categories, function(){
                        return axios.get(getUrl("cat/getCatAll")).then(function(res){
                            if(res.status && res.status==500){
                                state.categories = [];
                            } else {
                                state.categories = res;
                            }
                            return state.categories;
                        })
                    })
                },
                // 品牌
                brands: function(state){
                    return p(state.brands, function(){
                        return axios.get(getUrl("brand/name"),{params:{brandname:null,size:20}}).then(function(res){
                            if(res.status==500){
                                state.brands=[]
                            }else {
                                state.brands = res;
                            }
                            return state.brands
                        });
                    })
                },
                // 人群下拉列表
                crowdList: function(state){
                    return p(state.crowdList, function(){
                        return axios.get(getUrl("crow/list")).then(function(res){
                            if(res.code == 0){
                                state.crowdList = res.result;
                                return state.crowdList
                            }
                        });
                    })
                },
                regions:function(state){
                    return p(state.regions,function(){
                        return axios.get(getUrl("restore/getRegion")).then(function(res){
                            if(res.code == 0){
                                state.regions = res.list;
                                state.regions.forEach(function(v,i){
                                    if(!v.id){
                                        state.regions.splice(i,1);
                                    }
                                });
                                return state.regions
                            }
                        });
                    })
                },
            }
        })
    }();
    export default {
        data: function () {
            return {
                showList: false,
                showParent:false,
                showChild:true,
                user: {
                    name: chineseName,
                    appAccount: "",
                    positionName: "",
                    imgSrc: '../static/image/main/persional.png'
                },
                chineseName:chineseName,
                navMenu: [],
                navTemp:null,
                navMenuList_: null,
                menuList: [],
                tempMenu:[],
                menuStatus: 1, // 1，展开；2最小化
                leftMenuStatus_: 1, // 1|true，展开（默认）；0|false关闭
                activeName_: '',
                navTitle: "智能画像系统",
                shortNavTitle: "画像",
                fullNavTitle: "智能画像系统"
            }
        },
        computed: {
            activeName: {
                get: function () {
                    return this.activeName_;
                },
                set: function (v) {
                    var navMenu = this.$refs.navMenu;
                    this.activeName_ = v;
                    this.$nextTick(function () {
                        navMenu.updateActiveName()
                    });
                }
            },
            navMenuList: {
                get: function () {
                    return this.navMenuList_
                },
                set: function (v) {
                    this.navMenuList_ = routerList(v);
                    // 默认选中第一个
                    this.selectFirstMenu();
                }
            }
        },
        methods: {
            // 默认选中第一个一级菜单下的第一个叶节点
            selectFirstMenu: function () {
                var menuList = this.navMenuList || [];
                function getLeaf(node) {
                    if (node && node.list && node.list.length > 0) {
                        // 没有子节点，自身就是叶节点
                        return node.list[0] ? getLeaf(node.list[0]) : node;
                    } else {
                        return node;
                    }
                }

                this.activeName = "";
                // 寻找第一个叶节点
                for(var i=0;i<menuList.length;i++){
                    let menu = menuList[i];
                    let leaf = getLeaf(menu.list && menu.list[0]);
                    if(leaf){
                        this.navMenuSeleted(this.activeName = menu.menuId);
                        this.menuSeleted(leaf);
                        break;
                    }
                }
            },
            navMenuSeleted: function (name) {
                var _vm = this;
                this.navMenuList.some(function (item) {
                    if (item.menuId == name ) {
                        if(item.list && item.list.length>0) {
                            _vm.tempMenu=item.list;
                        }
                        _vm.menuList =   _vm.tempMenu;
                        item.list[0].open=1;
                        item.list[0].list[0].selected=1;
                        item.list[0].list[0].icon=null;
                        _vm.menuSeleted(item.list[0].list[0]);
                        return true;
                    }
                });
                if(name==1 || name==5){
                    _vm.navTemp=name;
                }
                $('#layoutNav .ivu-menu-item#'+_vm.navTemp).css({'color':'#348fe2','border-bottom-color':'#348fe2'}).siblings().css({'color':'#b0b0b0','border-bottom-color':'transparent'});
            },
            menuSeleted: function (node) {
                if (node.url) {
                    this.$router.push(node.url);
                }
                this.$store.state.path='main'
            },
            getUser: function () {
                this.user = {username: "管理员"};
            },
            getSlideMenu: function () {
                var  vm = this;
                axios.get(getUrl('menu'), {
                    params: {appId: appId}
                }).then(function (res) {
                    if (res.code == 0) {
                        vm.spinShow = false;
                        vm.menuMap = {};
                        res.appmenus.forEach(menu => vm.menuMap[menu.menuId] = menu);
                        vm.navMenuList = res.appmenus;
                    }
                });
            },
            // 左侧菜单模式切换的方法
            toggleClick: function () {
                if (this.menuStatus === 1) {
                    this.menuStatus = 2;
                    this.navTitle = this.shortNavTitle;
                } else {
                    this.menuStatus = 1;
                    this.navTitle = this.fullNavTitle;
                }
            },
            /**展开/关闭左侧菜单
             * @param mode 1|true: 展开, 0|false: 关闭
             * */
            toggleLeftMenu(mode){
                this.leftMenuStatus_ = arguments.length ? mode : !this.leftMenuStatus_
            },
            logout: function () {
                axios.post(getUrl("logout")).then(function (data) {
                    location.href = getUrl('login.html');
                }).catch(function () {
                    location.href = getUrl('login.html');
                })
            },
            passwordShow: function () {
                this.$refs.modifypassword.editUser = {};
                this.$refs.modifypassword.$refs['editUser'].resetFields();
                this.$refs.modifypassword.editUser.uname = $.cookie('username');
                this.showList = true;
            },
            resetEdituser: function (data) {
                console.log(data);
            },
            enter(node){
                var _this = this;
                this.$nextTick(function () {
                    _this.menuMap && _this.$refs.menu.setSelectedNodes(_this.menuMap[node])
                });
            }
        },
        created(){

        },
        mounted () {
            window.vm = this;
            this.getUser();
            this.getSlideMenu();
        },
        components: {
            'v-password': modifypassword,
        },
        store:store
    }
</script>
<style>
    html, body {
        height: 100%;
    }
</style>