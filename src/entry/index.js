/**九诺大屏展示
 * Created by weikaiwei on 2017/8/17.
 */
// import "@/assets/js/layLib";
// import "@/assets/js/lib";
import "@/assets/lib"
import Vue from 'vue';
import router from '@/router';
import App from '@/pages/App';
// 校验框架
new Vue({
  el: "#app",
  router,
  template: '<App/>',
  components: { App }
});
