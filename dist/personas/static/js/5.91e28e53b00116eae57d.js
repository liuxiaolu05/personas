webpackJsonp([5],{"//Fk":function(e,t,a){e.exports={default:a("U5ju"),__esModule:!0}},"2KxR":function(e,t){e.exports=function(e,t,a,r){if(!(e instanceof t)||void 0!==r&&r in e)throw TypeError(a+": incorrect invocation!");return e}},"82Mu":function(e,t,a){var r=a("7KvD"),n=a("L42u").set,i=r.MutationObserver||r.WebKitMutationObserver,o=r.process,s=r.Promise,c="process"==a("R9M2")(o);e.exports=function(){var e,t,a,l=function(){var r,n;for(c&&(r=o.domain)&&r.exit();e;){n=e.fn,e=e.next;try{n()}catch(r){throw e?a():t=void 0,r}}t=void 0,r&&r.enter()};if(c)a=function(){o.nextTick(l)};else if(!i||r.navigator&&r.navigator.standalone)if(s&&s.resolve){var u=s.resolve();a=function(){u.then(l)}}else a=function(){n.call(r,l)};else{var d=!0,f=document.createTextNode("");new i(l).observe(f,{characterData:!0}),a=function(){f.data=d=!d}}return function(r){var n={fn:r,next:void 0};t&&(t.next=n),e||(e=n,a()),t=n}}},"8iD6":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("//Fk"),n=function(e){return e&&e.__esModule?e:{default:e}}(r),i=function(e,t,a){!/^\d+$/.test(t)&&t<1?a(new Error("请输入大于1的整数")):a()},o=function(e,t,a){""==t[1]?a(new Error("推送日期不能为空")):a()};t.default={data:function(){return{categories:[],brands:{},crowdList:[],regions:[],firstsubSections:[],secondsubSections:[],stores:[],vipRange:"2",coverShow:!1,catLoading:!1,changeCopy:!0,rangeCopy:!1,firstCopy:!1,regionCopy:!1,editData:{crowdId:"",dateRange:[],beginTime:null,endTime:null,regionCode:"",regionName:"",firstBranch:"",firstBranchName:"",secondBranch:"",secondBranchName:"",store:"",storeName:"",crowdName:"",channel:1,frequency:0,frequencyCount:null,coverUser:null,createUser:null},defaultData:{vipRanges:[{label:"大区会员",value:"2"},{label:"分部会员",value:"3"},{label:"门店会员",value:"4"}],vipBranchs:[{label:"一级分部",value:"1"},{label:"二级分部",value:"2"}]},ruleValidate:{crowdName:[{required:!0,message:"人群名称不能为空",trigger:"blur"}],scenesType:[{required:!0,message:"营销场景不能为空",trigger:"change"}],catPrefer:[{required:!0,message:"品类不能为空",trigger:"change"}],dateRange:[{validator:o,trigger:"change"}],regionCode:[{required:!0,message:"请选择大区",trigger:"change"}],firstBranch:[{required:!0,message:"请选择一级分部",trigger:"change"}],store:[{required:!0,message:"请选择门店",trigger:"change"}]},detailData:{stage:null,tempStage:null},options:{dateRange:{disabledDate:function(e){return e<DateFormat.convert(DateFormat().toDate(1),"YMD")}}}}},watch:{"editData.dateRange":function(){var e=this.editData.dateRange||[];this.editData.beginTime=e[0],this.editData.endTime=e[1]}},computed:{stages:function(){return this.$store.state.stages}},methods:{getCover:function(){return NumberFormat.term(this.editData.coverUser)},changeStage:function(e){e=1==e?"stage1":3==e?"stage2":"other";var t=this.$route,a=this.$route.query;a&&a.id&&this.changeCopy?a.editSwitch=1:this.changeCopy=!0,this.$router.replace($.extend({},t,{path:"/crowd/list.html/add/"+e}))},backToList:function(){this.$store.state.path="main",this.$router.push("/crowd/list.html")},getCategories:function(){var e=this;return this.$store.getters.categories.then(function(t){e.categories=t})},setBrands:function(){var e=this;return this.$store.getters.brands.then(function(t){return new n.default(function(a){e.brands=t,a()})})},brandFilter:function(e,t){(e=$.trim(e))&&axios.get(getUrl("brand/name"),{params:{brandname:e,size:200}}).then(function(e){t(e)})},getRegion:function(){var e=this,t=this.$route.query,a="copy"==t.action,r=t.editSwitch;return this.$store.getters.regions.then(function(t){new n.default(function(n){e.regions=t,a&&!r||(e.editData.regionCode=e.regions[0].id,e.editData.regionName=e.regions[0].name),n()})})},frequencyChange:function(e){this.ruleValidate.frequencyCount=1==e?[{validator:i,trigger:"blur"}]:[]},changeVipRange:function(e){var t=this;4==this.editData.vipRange?this.ruleValidate.secondBranch=[{required:!0,message:"请选择二级分部",trigger:"change"}]:this.ruleValidate.secondBranch=[],this.rangeCopy?(this.editData.firstBranch=this.editData.secondBranch=this.editData.store=null,t.editData.regionName=2==e?"东北大区":"",t.editData.regionCode=2==e?t.regions[0].id:""):this.rangeCopy=!0},changeRegion:function(){this.regionCopy?(this.editData.firstBranch="",this.firstsubSections=[],this.stores=[]):this.regionCopy=!0,this.getFristsubSections()},changeFristBranch:function(){this.firstCopy?(this.editData.secondBranch="",this.secondsubSections=[],this.stores=[]):this.firstCopy=!0,this.getSecondsubSections()},getFristsubSections:function(){var e=this;axios.get(getUrl("restore/getSubsection"),{params:{type:1,parentId:e.editData.regionCode}}).then(function(t){0==t.code&&(e.firstsubSections=t.list.filter(function(e){return e.id&&"[]"!=e.id}))})},getSecondsubSections:function(){var e=this;axios.get(getUrl("restore/getSubsection"),{params:{type:2,parentId:e.editData.firstBranch}}).then(function(t){0==t.code&&(e.secondsubSections=t.list.filter(function(e){return e.id&&"[]"!=e.id}))})},changeSecondBranch:function(e){var t=this;this.stores=[],"4"==t.vipRange&&this.getMdxx()},changeMdxx:function(e){},getMdxx:function(){var e=this;axios.get(getUrl("restore/getMdxx"),{params:{parentId:e.editData.secondBranch,type:2}}).then(function(t){0==t.code&&(e.stores=t.list.filter(function(e){return e.id}))})},getEditData:function(){var e=this,t=e.editData,a=this.$route.query,r="copy"==a.action;return a.id&&1!=a.editSwitch?axios.get(getUrl("crow/copycrowInfo"),{loading:!0,unload:!0,params:{id:a.id}}).then(function(a){var n=a.crowInfo||{};n.beginTime=DateFormat(n.beginTime).toString("yyyy.MM.dd"),n.endTime=DateFormat(n.endTime).toString("yyyy.MM.dd"),n.store&&(e.vipRange="4"),n.firstBranch&&!n.store&&(e.vipRange="3"),!n.regionCode||n.firstBranch||n.secondBranch||n.store||(e.vipRange="2"),r&&(n.id=null,n.crowdName=null,n.dateRange=[],delete n.beginTime,delete n.endTime);var i=e.saveFields;for(var o in t){var s=n[o]||"";i.indexOf(o)>-1&&1!=t.scenesType?t[o]=s&&s.split(","):t[o]=s}t.createUser=e.$store.state.user.username}):(t.createUser=e.$store.state.user.username,new n.default(function(e){e()}))},validate:function(e,t){function a(t){if(t<i)try{o.validateField(e[t],function(e){e?n():a(t+1)})}catch(e){a(t+1)}else r()}function r(){t(!0)}function n(){t(!1)}var i,o=this.$refs.editData;e instanceof Array||(e=[e]),i=e.length,i?a(0):r()},getSaveData:function(){var e=this.$refs.editData,t=this;return new n.default(function(a){e.validate(function(e){if(e){var r={},n=t.editData,i=t.saveFields;for(var o in n)r[o]=i.indexOf(o)>-1&&n[o]instanceof Array?n[o].join(","):n[o];a(r)}})})},getCalData:function(){var e=this;return new n.default(function(t){e.validate(e.calValidateFields,function(a){if(a){var r={},n=e.calFields,i=e.editData;for(var o in n){var s=n[o],c=i[s];c&&(r[s]=c instanceof Array?c.join(","):c)}t(r)}})})},cal:function(){var e=this;this.getCalData().then(function(t){e.coverShow=!0,axios.get(getUrl("other/coverTotal"),{params:t}).then(function(t){0==t.code?(e.coverShow=!1,e.editData.coverUser=parseFloat(t.total)):(e.coverShow=!1,e.$Message.warning("系统异常，请稍后重试"))}).catch(function(){e.coverShow=!1,e.$Message.warning("系统异常，请稍后重试")})})},save:function(){var e=this;e.getSaveData().then(function(t){t.crowdId=null,axios.post(getUrl("restore/saveCrowd"),t,{loading:!0,unload:!0}).then(function(t){0==t.code?(e.$Message.success("操作成功"),e.$parent.reload(),e.backToList()):e.$Message.warning(t.msg)})})}},mounted:function(){var e=this;this.$nextTick(function(){"copy"==this.$route.query.action&&(e.rangeCopy=!1,e.changeCopy=!1,e.regionCopy=!1,e.firstCopy=!1)}),n.default.all([e.getRegion(),e.getCategories(),e.setBrands()]).then(function(){e.getEditData()})}}},CXw9:function(e,t,a){"use strict";var r,n,i,o,s=a("O4g8"),c=a("7KvD"),l=a("+ZMJ"),u=a("RY/4"),d=a("kM2E"),f=a("EqjI"),v=a("lOnJ"),h=a("2KxR"),p=a("NWt+"),g=a("t8x9"),m=a("L42u").set,b=a("82Mu")(),_=a("qARP"),y=a("dNDb"),D=a("fJUb"),x=c.TypeError,C=c.process,w=c.Promise,k="process"==u(C),P=function(){},R=n=_.f,F=!!function(){try{var e=w.resolve(1),t=(e.constructor={})[a("dSzd")("species")]=function(e){e(P,P)};return(k||"function"==typeof PromiseRejectionEvent)&&e.then(P)instanceof t}catch(e){}}(),S=function(e){var t;return!(!f(e)||"function"!=typeof(t=e.then))&&t},B=function(e,t){if(!e._n){e._n=!0;var a=e._c;b(function(){for(var r=e._v,n=1==e._s,i=0;a.length>i;)!function(t){var a,i,o=n?t.ok:t.fail,s=t.resolve,c=t.reject,l=t.domain;try{o?(n||(2==e._h&&T(e),e._h=1),!0===o?a=r:(l&&l.enter(),a=o(r),l&&l.exit()),a===t.promise?c(x("Promise-chain cycle")):(i=S(a))?i.call(a,s,c):s(a)):c(r)}catch(e){c(e)}}(a[i++]);e._c=[],e._n=!1,t&&!e._h&&M(e)})}},M=function(e){m.call(c,function(){var t,a,r,n=e._v,i=$(e);if(i&&(t=y(function(){k?C.emit("unhandledRejection",n,e):(a=c.onunhandledrejection)?a({promise:e,reason:n}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",n)}),e._h=k||$(e)?2:1),e._a=void 0,i&&t.e)throw t.v})},$=function(e){return 1!==e._h&&0===(e._a||e._c).length},T=function(e){m.call(c,function(){var t;k?C.emit("rejectionHandled",e):(t=c.onrejectionhandled)&&t({promise:e,reason:e._v})})},N=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,t._v=e,t._s=2,t._a||(t._a=t._c.slice()),B(t,!0))},q=function(e){var t,a=this;if(!a._d){a._d=!0,a=a._w||a;try{if(a===e)throw x("Promise can't be resolved itself");(t=S(e))?b(function(){var r={_w:a,_d:!1};try{t.call(e,l(q,r,1),l(N,r,1))}catch(e){N.call(r,e)}}):(a._v=e,a._s=1,B(a,!1))}catch(e){N.call({_w:a,_d:!1},e)}}};F||(w=function(e){h(this,w,"Promise","_h"),v(e),r.call(this);try{e(l(q,this,1),l(N,this,1))}catch(e){N.call(this,e)}},r=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},r.prototype=a("xH/j")(w.prototype,{then:function(e,t){var a=R(g(this,w));return a.ok="function"!=typeof e||e,a.fail="function"==typeof t&&t,a.domain=k?C.domain:void 0,this._c.push(a),this._a&&this._a.push(a),this._s&&B(this,!1),a.promise},catch:function(e){return this.then(void 0,e)}}),i=function(){var e=new r;this.promise=e,this.resolve=l(q,e,1),this.reject=l(N,e,1)},_.f=R=function(e){return e===w||e===o?new i(e):n(e)}),d(d.G+d.W+d.F*!F,{Promise:w}),a("e6n0")(w,"Promise"),a("bRrM")("Promise"),o=a("FeBl").Promise,d(d.S+d.F*!F,"Promise",{reject:function(e){var t=R(this);return(0,t.reject)(e),t.promise}}),d(d.S+d.F*(s||!F),"Promise",{resolve:function(e){return D(s&&this===o?w:this,e)}}),d(d.S+d.F*!(F&&a("dY0y")(function(e){w.all(e).catch(P)})),"Promise",{all:function(e){var t=this,a=R(t),r=a.resolve,n=a.reject,i=y(function(){var a=[],i=0,o=1;p(e,!1,function(e){var s=i++,c=!1;a.push(void 0),o++,t.resolve(e).then(function(e){c||(c=!0,a[s]=e,--o||r(a))},n)}),--o||r(a)});return i.e&&n(i.v),a.promise},race:function(e){var t=this,a=R(t),r=a.reject,n=y(function(){p(e,!1,function(e){t.resolve(e).then(a.resolve,r)})});return n.e&&r(n.v),a.promise}})},EqBC:function(e,t,a){"use strict";var r=a("kM2E"),n=a("FeBl"),i=a("7KvD"),o=a("t8x9"),s=a("fJUb");r(r.P+r.R,"Promise",{finally:function(e){var t=o(this,n.Promise||i.Promise),a="function"==typeof e;return this.then(a?function(a){return s(t,e()).then(function(){return a})}:e,a?function(a){return s(t,e()).then(function(){throw a})}:e)}})},L42u:function(e,t,a){var r,n,i,o=a("+ZMJ"),s=a("knuC"),c=a("RPLV"),l=a("ON07"),u=a("7KvD"),d=u.process,f=u.setImmediate,v=u.clearImmediate,h=u.MessageChannel,p=u.Dispatch,g=0,m={},b=function(){var e=+this;if(m.hasOwnProperty(e)){var t=m[e];delete m[e],t()}},_=function(e){b.call(e.data)};f&&v||(f=function(e){for(var t=[],a=1;arguments.length>a;)t.push(arguments[a++]);return m[++g]=function(){s("function"==typeof e?e:Function(e),t)},r(g),g},v=function(e){delete m[e]},"process"==a("R9M2")(d)?r=function(e){d.nextTick(o(b,e,1))}:p&&p.now?r=function(e){p.now(o(b,e,1))}:h?(n=new h,i=n.port2,n.port1.onmessage=_,r=o(i.postMessage,i,1)):u.addEventListener&&"function"==typeof postMessage&&!u.importScripts?(r=function(e){u.postMessage(e+"","*")},u.addEventListener("message",_,!1)):r="onreadystatechange"in l("script")?function(e){c.appendChild(l("script")).onreadystatechange=function(){c.removeChild(this),b.call(e)}}:function(e){setTimeout(o(b,e,1),0)}),e.exports={set:f,clear:v}},Mhyx:function(e,t,a){var r=a("/bQp"),n=a("dSzd")("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(r.Array===e||i[n]===e)}},"NWt+":function(e,t,a){var r=a("+ZMJ"),n=a("msXi"),i=a("Mhyx"),o=a("77Pl"),s=a("QRG4"),c=a("3fs2"),l={},u={},t=e.exports=function(e,t,a,d,f){var v,h,p,g,m=f?function(){return e}:c(e),b=r(a,d,t?2:1),_=0;if("function"!=typeof m)throw TypeError(e+" is not iterable!");if(i(m)){for(v=s(e.length);v>_;_++)if((g=t?b(o(h=e[_])[0],h[1]):b(e[_]))===l||g===u)return g}else for(p=m.call(e);!(h=p.next()).done;)if((g=n(p,b,h.value,t))===l||g===u)return g};t.BREAK=l,t.RETURN=u},SFdG:function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"stage"},[a("Form",{ref:"editData",attrs:{model:e.editData,rules:e.ruleValidate,"label-width":120}},[a("div",{staticClass:"panel panel-default"},[a("Card",{attrs:{"dis-hover":""}},[a("p",{attrs:{slot:"title"},slot:"title"},[e._v("营销场景设置")]),e._v(" "),a("FormItem",{attrs:{label:"营销场景"}},[a("div",{staticClass:"groups"},[a("Select",{staticClass:"w-lg",attrs:{placeholder:"请选择营销场景"},on:{"on-change":e.changeStage},model:{value:e.editData.scenesType,callback:function(t){e.$set(e.editData,"scenesType",t)},expression:"editData.scenesType"}},e._l(e.stages,function(t){return a("Option",{key:t.value,attrs:{value:t.idx}},[e._v(e._s(t.label)+"\n                            ")])}))],1)]),e._v(" "),1==e.editData.scenesType?a("FormItem",{attrs:{label:"推广商品",prop:"catPrefer"}},[a("div",{staticClass:"groups"},[a("selection",{staticClass:"w-lg cat-pre",attrs:{placeholder:"请选择品类","filter-placeholder":"请输入品类名称",value:e.categories,"value-field":"cat2id","label-field":"cat2name","label-model":"editData.catName",context:this},model:{value:e.editData.catPrefer,callback:function(t){e.$set(e.editData,"catPrefer",t)},expression:"editData.catPrefer"}}),e._v(" "),a("selection",{staticClass:"w-lg brand-pre error-ignore",attrs:{placeholder:"请选择品牌","filter-placeholder":"请输入品牌名称",value:e.brands,clearable:"","label-model":"editData.brandName",context:this,"filter-method":e.brandFilter},model:{value:e.editData.brandPrefer,callback:function(t){e.$set(e.editData,"brandPrefer",t)},expression:"editData.brandPrefer"}})],1)]):e._e(),e._v(" "),a("FormItem",{attrs:{label:"数据更新周期",prop:"dateRange"}},[a("DatePicker",{staticClass:"w-lg",attrs:{format:"yyyy.MM.dd",type:"daterange",options:e.options.dateRange,placeholder:"选择日期"},model:{value:e.editData.dateRange,callback:function(t){e.$set(e.editData,"dateRange",t)},expression:"editData.dateRange"}})],1),e._v(" "),2==e.editData.scenesType?[a("FormItem",{staticClass:"error-ignore",attrs:{label:"品类偏好",prop:"group"}},[a("selection",{staticClass:"w-260 cat-pre",attrs:{placeholder:"请选择品类","filter-placeholder":"请输入品类名称",value:e.categories,multiple:!0,clearable:"","value-field":"cat2id","label-field":"cat2name","label-model":"editData.catName",context:this},model:{value:e.editData.catPrefer,callback:function(t){e.$set(e.editData,"catPrefer",t)},expression:"editData.catPrefer"}})],1),e._v(" "),a("FormItem",{staticClass:"error-ignore",attrs:{label:"品牌偏好",prop:"group"}},[a("selection",{staticClass:"w-260 brand-pre",attrs:{placeholder:"请选择品牌","filter-placeholder":"请输入品牌名称",value:e.brands,multiple:!0,clearable:"","label-model":"editData.brandName",context:this,"filter-method":e.brandFilter},model:{value:e.editData.brandPrefer,callback:function(t){e.$set(e.editData,"brandPrefer",t)},expression:"editData.brandPrefer"}})],1),e._v(" "),a("FormItem",{attrs:{label:"平均客单价",prop:"group"}},[a("CheckboxGroup",{model:{value:e.editData.customerTransaction,callback:function(t){e.$set(e.editData,"customerTransaction",t)},expression:"editData.customerTransaction"}},[a("Checkbox",{attrs:{label:"1"}},[e._v("600元以下")]),e._v(" "),a("Checkbox",{attrs:{label:"2"}},[e._v("600-1500元")]),e._v(" "),a("Checkbox",{attrs:{label:"3"}},[e._v("1500-2000元")]),e._v(" "),a("Checkbox",{attrs:{label:"4"}},[e._v("2000-3500元")]),e._v(" "),a("Checkbox",{attrs:{label:"5"}},[e._v("3500元以上")])],1)],1),e._v(" "),a("FormItem",{staticClass:"vip-value",attrs:{label:"会员价值",prop:"group"}},[a("CheckboxGroup",{model:{value:e.editData.vipValue,callback:function(t){e.$set(e.editData,"vipValue",t)},expression:"editData.vipValue"}},[a("Checkbox",{attrs:{label:"1"}},[e._v("低")]),e._v(" "),a("Checkbox",{attrs:{label:"2"}},[e._v("中")]),e._v(" "),a("Checkbox",{attrs:{label:"3"}},[e._v("高")])],1)],1),e._v(" "),a("FormItem",{staticClass:"loyalty",attrs:{label:"忠诚度",prop:"group"}},[a("CheckboxGroup",{model:{value:e.editData.loyalty,callback:function(t){e.$set(e.editData,"loyalty",t)},expression:"editData.loyalty"}},[a("Checkbox",{attrs:{label:"1"}},[e._v("低")]),e._v(" "),a("Checkbox",{attrs:{label:"2"}},[e._v("中")]),e._v(" "),a("Checkbox",{attrs:{label:"3"}},[e._v("高")])],1)],1),e._v(" "),a("FormItem",{staticClass:"lost",attrs:{label:"流失等级",prop:"group"}},[a("CheckboxGroup",{model:{value:e.editData.lost,callback:function(t){e.$set(e.editData,"lost",t)},expression:"editData.lost"}},[a("Checkbox",{attrs:{label:"1"}},[e._v("低")]),e._v(" "),a("Checkbox",{attrs:{label:"2"}},[e._v("中")]),e._v(" "),a("Checkbox",{attrs:{label:"3"}},[e._v("高")])],1)],1),e._v(" "),a("FormItem",{attrs:{label:"性别",prop:"group"}},[a("CheckboxGroup",{model:{value:e.editData.gender,callback:function(t){e.$set(e.editData,"gender",t)},expression:"editData.gender"}},[a("Checkbox",{attrs:{label:"1"}},[e._v("男性")]),e._v(" "),a("Checkbox",{attrs:{label:"0"}},[e._v("女性")])],1)],1),e._v(" "),a("FormItem",{attrs:{label:"年龄",prop:"group"}},[a("CheckboxGroup",{model:{value:e.editData.age,callback:function(t){e.$set(e.editData,"age",t)},expression:"editData.age"}},[a("Checkbox",{attrs:{label:"1"}},[e._v("18岁以下")]),e._v(" "),a("Checkbox",{attrs:{label:"2"}},[e._v("18-24岁")]),e._v(" "),a("Checkbox",{attrs:{label:"3"}},[e._v("25-34岁")]),e._v(" "),a("Checkbox",{attrs:{label:"4"}},[e._v("35-44岁")]),e._v(" "),a("Checkbox",{attrs:{label:"5"}},[e._v("45-60岁")]),e._v(" "),a("Checkbox",{attrs:{label:"6"}},[e._v("60岁以上")])],1)],1)]:e._e(),e._v(" "),a("FormItem",{attrs:{label:"会员范围"}},[a("div",{staticClass:"groups"},[a("selection",{staticClass:"w-lg",attrs:{placeholder:"请选择会员范围",filterable:!1,value:e.defaultData.vipRanges,context:this},on:{"on-value-change":e.changeVipRange},model:{value:e.vipRange,callback:function(t){e.vipRange=t},expression:"vipRange"}}),e._v(" "),a("FormItem",{staticClass:"vip-range",attrs:{prop:"regionCode"}},[a("selection",{staticClass:"w-lg",attrs:{placeholder:"请选择大区",filterable:!1,value:e.regions,"label-field":"name","value-field":"id","label-model":"editData.regionName",context:this},on:{"on-value-change":e.changeRegion},model:{value:e.editData.regionCode,callback:function(t){e.$set(e.editData,"regionCode",t)},expression:"editData.regionCode"}})],1),e._v(" "),e.editData.regionCode&&"2"!=e.vipRange?a("FormItem",{staticClass:"vip-range",attrs:{prop:"firstBranch"}},[a("selection",{staticClass:"w-lg",attrs:{placeholder:"请选择一级分部",filterable:!1,value:e.firstsubSections,"label-field":"name","value-field":"id","label-model":"editData.firstBranchName",context:this,"clear-model":""},on:{"on-value-change":e.changeFristBranch},model:{value:e.editData.firstBranch,callback:function(t){e.$set(e.editData,"firstBranch",t)},expression:"editData.firstBranch"}})],1):e._e(),e._v(" "),e.editData.firstBranch&&"2"!=e.vipRange?a("FormItem",{staticClass:"vip-range",attrs:{prop:"secondBranch"}},[a("selection",{staticClass:"w-lg",attrs:{placeholder:"请选择二级分部",filterable:!1,value:e.secondsubSections,"label-field":"name","value-field":"id",clearable:3==e.vipRange,"label-model":"editData.secondBranchName",context:this,"clear-model":""},on:{"on-value-change":e.changeSecondBranch},model:{value:e.editData.secondBranch,callback:function(t){e.$set(e.editData,"secondBranch",t)},expression:"editData.secondBranch"}})],1):e._e(),e._v(" "),e.editData.secondBranch&&e.stores.length>0&&"4"==e.vipRange?a("FormItem",{staticClass:"vip-range",attrs:{prop:"store"}},[a("selection",{staticClass:"w-lg",attrs:{placeholder:"请选择门店",filterable:!1,value:e.stores,"label-field":"name","value-field":"id","label-model":"editData.storeName",context:this,"clear-model":""},on:{"on-value-change":e.changeMdxx},model:{value:e.editData.store,callback:function(t){e.$set(e.editData,"store",t)},expression:"editData.store"}})],1):e._e()],1)])],2)],1),e._v(" "),a("div",{staticClass:"panel panel-default"},[a("Card",{attrs:{"dis-hover":""}},[a("p",{attrs:{slot:"title"},slot:"title"},[e._v("基本信息设置")]),e._v(" "),a("FormItem",{attrs:{label:"人群名称",prop:"crowdName"}},[a("Input",{staticClass:"w-lg",attrs:{placeholder:"请输入人群名称"},model:{value:e.editData.crowdName,callback:function(t){e.$set(e.editData,"crowdName",t)},expression:"editData.crowdName"}})],1),e._v(" "),a("FormItem",{attrs:{label:"推送频次",prop:"frequencyCount","show-message":!!e.editData.frequency}},[a("div",{staticClass:"groups"},[a("RadioGroup",{on:{"on-change":function(t){e.frequencyChange(t)}},model:{value:e.editData.frequency,callback:function(t){e.$set(e.editData,"frequency",t)},expression:"editData.frequency"}},[a("Radio",{attrs:{label:0}},[e._v("不限定")]),e._v(" "),a("Radio",{attrs:{label:1}},[e._v("限定")])],1),e._v(" "),1==e.editData.frequency?a("div",{staticStyle:{display:"inline-block"}},[a("span",[e._v("推送周期内最多")]),e._v(" "),a("Input",{staticClass:"w-sm t-center",model:{value:e.editData.frequencyCount,callback:function(t){e.$set(e.editData,"frequencyCount",t)},expression:"editData.frequencyCount"}}),e._v(" "),a("span",[e._v("条")])],1):e._e()],1)])],1),e._v(" "),a("div",{staticClass:"groups"},[a("Button",{attrs:{type:"primary"},on:{click:e.backToList}},[e._v("取消")]),e._v(" "),a("Button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("保存")]),e._v(" "),a("Button",{attrs:{type:"primary"},on:{click:e.cal}},[e._v("覆盖人数")]),e._v(" "),a("div",{staticClass:"cover",staticStyle:{display:"inline-block",height:"32px",position:"relative","vertical-align":"middle"}},[a("span",{domProps:{textContent:e._s(e.getCover())}}),e._v(" "),e.coverShow?a("Spin",{staticStyle:{position:"absolute",top:"50%","margin-top":"-13px"}},[a("Icon",{staticClass:"demo-spin-icon-load",attrs:{type:"load-c",size:"18"}})],1):e._e()],1)],1)],1)])],1)},n=[],i={render:r,staticRenderFns:n};t.a=i},U5ju:function(e,t,a){a("M6a0"),a("zQR9"),a("+tPU"),a("CXw9"),a("EqBC"),a("jKW+"),e.exports=a("FeBl").Promise},bRrM:function(e,t,a){"use strict";var r=a("7KvD"),n=a("FeBl"),i=a("evD5"),o=a("+E39"),s=a("dSzd")("species");e.exports=function(e){var t="function"==typeof n[e]?n[e]:r[e];o&&t&&!t[s]&&i.f(t,s,{configurable:!0,get:function(){return this}})}},dNDb:function(e,t){e.exports=function(e){try{return{e:!1,v:e()}}catch(e){return{e:!0,v:e}}}},dY0y:function(e,t,a){var r=a("dSzd")("iterator"),n=!1;try{var i=[7][r]();i.return=function(){n=!0},Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!n)return!1;var a=!1;try{var i=[7],o=i[r]();o.next=function(){return{done:a=!0}},i[r]=function(){return o},e(i)}catch(e){}return a}},fJUb:function(e,t,a){var r=a("77Pl"),n=a("EqjI"),i=a("qARP");e.exports=function(e,t){if(r(e),n(t)&&t.constructor===e)return t;var a=i.f(e);return(0,a.resolve)(t),a.promise}},"jKW+":function(e,t,a){"use strict";var r=a("kM2E"),n=a("qARP"),i=a("dNDb");r(r.S,"Promise",{try:function(e){var t=n.f(this),a=i(e);return(a.e?t.reject:t.resolve)(a.v),t.promise}})},jplm:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("xM2i"),n=a.n(r);for(var i in r)"default"!==i&&function(e){a.d(t,e,function(){return r[e]})}(i);var o=a("SFdG"),s=a("VU/8"),c=s(n.a,o.a,!1,null,null,null);t.default=c.exports},knuC:function(e,t){e.exports=function(e,t,a){var r=void 0===a;switch(t.length){case 0:return r?e():e.call(a);case 1:return r?e(t[0]):e.call(a,t[0]);case 2:return r?e(t[0],t[1]):e.call(a,t[0],t[1]);case 3:return r?e(t[0],t[1],t[2]):e.call(a,t[0],t[1],t[2]);case 4:return r?e(t[0],t[1],t[2],t[3]):e.call(a,t[0],t[1],t[2],t[3])}return e.apply(a,t)}},msXi:function(e,t,a){var r=a("77Pl");e.exports=function(e,t,a,n){try{return n?t(r(a)[0],a[1]):t(a)}catch(t){var i=e.return;throw void 0!==i&&r(i.call(e)),t}}},qARP:function(e,t,a){"use strict";function r(e){var t,a;this.promise=new e(function(e,r){if(void 0!==t||void 0!==a)throw TypeError("Bad Promise constructor");t=e,a=r}),this.resolve=n(t),this.reject=n(a)}var n=a("lOnJ");e.exports.f=function(e){return new r(e)}},t8x9:function(e,t,a){var r=a("77Pl"),n=a("lOnJ"),i=a("dSzd")("species");e.exports=function(e,t){var a,o=r(e).constructor;return void 0===o||void 0==(a=r(o)[i])?t:n(a)}},"xH/j":function(e,t,a){var r=a("hJx8");e.exports=function(e,t,a){for(var n in t)a&&e[n]?e[n]=t[n]:r(e,n,t[n]);return e}},xM2i:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("8iD6"),n=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default={extends:n.default,data:function(){return{saveFields:["catPrefer","catName","brandPrefer","brandName"],calFields:["scenesType","catPrefer","brandPrefer","regionCode","firstBranch","secondBranch","store"],calValidateFields:["catPrefer"],ifShowProduct:1,editData:{scenesType:"1",catPrefer:null,catName:null,brandPrefer:null,brandName:null}}}}}});
//# sourceMappingURL=5.91e28e53b00116eae57d.js.map