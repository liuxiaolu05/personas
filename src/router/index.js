import Vue from 'vue';
import Router from '@@node_modules/vue-router';

// 加载路由模块
const Index = ()=>import('@/pages/Index');
const Empty = ()=>import('@/pages/Empty');
const MarketList = ()=>import('@/pages/market/MarketList');
const Add = ()=>import('@/pages/market/Add');
const MarketDetail = ()=>import('@/pages/market/Detail');
const Message=()=>import('@/pages/message/Message');
const MessageDetail=()=>import('@/pages/message/MessageDetail');
const Overview = () => import('@/pages/overview/Overview');
const Village = () => import('@/pages/village/village');
const VillageDetail = () => import('@/pages/village/villageDetail');
const AddRemark = () => import('@/pages/village/AddRemark');
const DataAnalysis = () => import('@/pages/dataAnalysis/dataAnalysis');
const Sale = () => import('@/pages/dataAnalysis/sale');
const Category = () => import('@/pages/dataAnalysis/category');
const Brand = () => import('@/pages/dataAnalysis/brand');
const Single = () => import('@/pages/dataAnalysis/single');
const PropertyInformation = () => import('@/pages/property/PropertyInformation');
const PropertyDetail = () => import('@/pages/property/PropertyDetail');
const HeatMap = () => import('@/pages/heatMap/HeatMap');
const List = () => import('@/pages/crowd/List');
const Stage1 = () => import('@/pages/crowd/Stage1');
const Stage2 = () => import('@/pages/crowd/Stage2');
const Other = () => import('@/pages/crowd/Other');
const CrowdDetail = () => import('@/pages/crowd/Detail');
const AnalysisReport = () => import('@/pages/report/AnalysisReport');

Vue.use(Router);

export default new Router({
    routes: [
      {
        path: "/",
        name: "index",
        component: Index,
        children: [
          {
            path : '/market/marketList.html',
            name : 'marketList',
            component : MarketList,
            children:[
              {
                path:'add',
                name:'marketAdd',
                component:Add
              },
              {
                path : 'detail',
                component : MarketDetail
              },
            ]
          },
          {
            path:'/message/message.html',
            component:Message,
            children:[
              {
                path:'messageDetail',
                name:"messageDetail",
                component:MessageDetail
              },
            ]
          },
          {
            path: '/overview/overview.html',
            name: 'overview',
            component: Overview
          },
          {
            path: '/village/villageOverview.html',
            name: 'village',
            component: Village,
            children:[
              {
                path: 'villageDetail',
                //name: 'villageDetail',
                component: VillageDetail
              },
              {
                path: 'addRemark',
                name: 'addRemark',
                component: AddRemark
              },
            ]
          },
          {
            path: '/dataAnalysis/dataAnalysis.html',
            name: "dataAnalysis",
            component:DataAnalysis,
            children:[
              {
                path: 'sale',
                name: 'sale',
                component:Sale
              },
              {
                path: 'category',
                name: 'category',
                component:Category
              },
              {
                path: 'brand',
                name: 'brand',
                component:Brand
              },
              {
                path: 'single',
                name: 'single',
                component:Single
              },
            ]
          },
          {
            path:'/property/property-information.html',
            name:'propertyInformation',
            component:PropertyInformation,
            children:[
              {
                path:'propertyDetail',
                name:'propertyDetail',
                component:PropertyDetail,
                children: [
                  {
                    path: 'villageDetail',
                    name: 'villageDetail',
                    component: VillageDetail
                  }
                ]
              }
            ]
          },
          {
            path:'/heatMap/heatMap.html',
            name:'heatMap',
            components:{
              default:HeatMap,
            }
          },
          {
            path:'/crowd/list.html',
            name:'list',
            component:List,
            children:[
              {
                path: "add/stage1",
                component: Stage1
              },
              {
                path: "add/stage2",
                component: Stage2
              },
              {
                path: "add/other",
                component: Other
              },
              {
                path:'detail',
                name:'crowdDetail',
                component: CrowdDetail
              }
            ]
          },
          {
            path:'report/AnalysisReport',
            component:AnalysisReport
          }
        ]
      }
    ]
})
