/**所有入口文件公共的api
 * Created by weikaiwei on 2017/10/12.
 */
import "iview/dist/styles/iview.css";
import axios from "adv-axios"
import jCookie from "@@/lib/jquery.cookie";
import Vue from 'vue'
let iView = require('iview');
import Vuex from "@@node_modules/vuex";
jCookie(self.$);
Object.assign(self, { Vue,Vuex, axios,
  getUrl (s) {
    return `/api/${s}`;
  }
});
Vue.use(iView);
Vue.use(Vuex);// 使用Vuex
Vue.config.productionTip = false;