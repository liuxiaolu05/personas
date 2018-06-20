/**
 * Created by weikaiwei on 2018/1/23.
 */
require("babel-polyfill");
import $ from "jquery";
Object.assign(self, {$, jQuery: $});
import jCookie from "@@/lib/jquery.cookie";
jCookie($);
require("@@/lib/layer/layer");
import "@@/lib/layer/theme/default/layer.css"
import axios from "@@/plugin/token-axios"
import Vue from "vue";
import Vuex from "vuex";
let iView = require('iview');
import "iview/dist/styles/iview.css";
let NumberFormat = require("adv-global/Number");
let DateFormat = require("adv-global/Date");
import Echarts from "@@node_modules/echarts"
Vue.use(iView);//依赖
Vue.use(Vuex);// 使用Vuex
Object.assign(self, {Vue, axios,Vuex, Echarts,DateFormat,NumberFormat,
  getUrl (s) {
  return `/api/${s}`;
}
});
require("./com");
import Selection from "selection";
import SelectionOption from "selection/option.vue";
Vue.component(Selection.name, Selection);
Vue.component(SelectionOption.name, SelectionOption);
Vue.config.productionTip = false;