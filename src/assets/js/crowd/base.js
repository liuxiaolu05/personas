let times = function (rule, value, callback) {
	if (!/^\d+$/.test(value) && value < 1) {
		callback(new Error('请输入大于1的整数'));
	} else {
		callback();
	}

};
let validateDate = (rule, value, callback) => {
	if (value[1]=='') {
		callback(new Error('推送日期不能为空'));
	} else {
		callback();
	}
};
export default {
	data: function () {
		return {
			// 交互用的数据，如品类下拉数据，品牌下拉数据
			categories: [], // 品类
			brands: {}, // 品牌
			crowdList: [], // 人群
			regions: [],
			firstsubSections: [],
			secondsubSections: [],
			stores: [],
			vipRange: "2",
			coverShow: false,
			catLoading: false,
			changeCopy: true,  //变量  进入复制时场景切换不添加editSwitch 切换场景时添加
			rangeCopy: false,   //变量  进入复制时会员范围等下拉框事件不触发 切换场景时触发
			firstCopy: false,   //变量  进入复制时一级分部下拉框事件不触发 切换场景时触发
			regionCopy: false,  //变量  进入复制时大区范围下拉框事件不触发 切换场景时触发
			// 交互录入的数据
			editData: {
				crowdId: '', // 营销场景
				dateRange: [], // 营销周期 t+1——不限
				beginTime: null,
				endTime: null,
				/* 会员范围 start */
				regionCode: '',//大区id
				regionName: '', //大区名
				firstBranch: '',//一级分部id
				firstBranchName: '', //一级分部名
				secondBranch: '',//二级分部id
				secondBranchName: '',//二级分部名
				store: '', //门店id
				storeName: '',//门店名
				/* 会员范围 end */
				// 基本信息
				crowdName: "", // 人群名称
				channel: 1, // 推送渠道
				frequency: 0, //推送限定
				frequencyCount: null, // 推送频次
				coverUser: null, // 覆盖人数
				createUser: null // 创建人
			},
			//默认选项
			defaultData: {
				vipRanges: [
					{label: "大区会员", value: "2"},
					{label: "分部会员", value: "3"},
					{label: "门店会员", value: "4"},
				],
				vipBranchs: [
					{label: "一级分部", value: "1"},
					{label: "二级分部", value: "2"},
				],
			},
			ruleValidate: {
				crowdName: [
					{required: true, message: '人群名称不能为空', trigger: 'blur'}
				],
				scenesType: [
					{required: true, message: '营销场景不能为空', trigger: 'change'}
				],
				catPrefer: [
					{required: true, message: '品类不能为空', trigger: 'change'}
				],
				dateRange: [
					//{required: true, type: 'array', message: '请选择日期', trigger: 'change'},
					{validator: validateDate,  trigger: 'change'}
				],
				regionCode: [
					{required: true, message: '请选择大区', trigger: 'change'}
				],
				firstBranch: [
					{required: true, message: '请选择一级分部', trigger: 'change'}
				],
				store: [
					{required: true, message: '请选择门店', trigger: 'change'}
				]
			},
			//查看页面变量
			detailData: {
				stage: null,
				tempStage: null
			},
			// 一些控件的配置参数
			options: {
				dateRange: {
					disabledDate: function (d) { // 只能从t+1开始选择
						return d < DateFormat.convert(DateFormat().toDate(1), "YMD")
					}
				}
			}
		}
	},
	watch: {
		"editData.dateRange": function () {
			var dateRange = this.editData.dateRange || [];
			this.editData.beginTime = dateRange[0];
			this.editData.endTime = dateRange[1];
		}
	},
	computed: {
		stages: function () {
			return this.$store.state.stages;
		}
	},
	methods: {
		getCover: function () {
			return NumberFormat.term(this.editData.coverUser)
		},
		changeStage: function (value) {
			if (value == 1) {
				value = 'stage1'
			} else if (value == 3) {
				value = 'stage2'
			} else {
				value = 'other'
			}
			var route = this.$route, query = this.$route.query;
			if (query && query.id && this.changeCopy) {
				query.editSwitch = 1;
			} else {
				this.changeCopy = true;
			}
			this.$router.replace($.extend({}, route, {path: "/crowd/list.html/add/" + value}))
		},
		backToList: function () {
			this.$store.state.path = "main";
			this.$router.push("/crowd/list.html");
		},
		getCategories: function () {
			var _vm = this;
			return this.$store.getters.categories.then(function (v) {
				_vm.categories = v;
			})
		},
		setBrands: function () {
			var _vm = this;
			return this.$store.getters.brands.then(function (v) {
				return new Promise(function (resolve) {
					_vm.brands = v;
					resolve();
				})
			})
		},
		brandFilter: function (query, cb) {
			query = $.trim(query);
			if (query) {
				axios.get(getUrl("brand/name"), {params: {brandname: query, size: 200}}).then(function (res) {
					cb(res)
				});
			}
		},
		getRegion: function () {
			var _vm = this;
			var query = this.$route.query, isCopy = query.action == "copy", editSwitch = query.editSwitch;
			return this.$store.getters.regions.then(function (v) {
				new Promise(function (resolve) {
					_vm.regions = v;
					//如果不是复制页面 大区默认为第一个大区
					if (!isCopy || editSwitch) {
						_vm.editData.regionCode = _vm.regions[0].id;
						_vm.editData.regionName = _vm.regions[0].name;
					}
					resolve();
				})
			})
		},
		// 推送频次
		frequencyChange: function (e) {
			if (e == 1) {
				this.ruleValidate['frequencyCount'] = [
					{validator: times, trigger: 'blur'}
				]
			} else {
				this.ruleValidate['frequencyCount'] = [];
			}
		},
		changeVipRange: function (v) {
			var _vm=this;
			this.editData.vipRange == 4 ? this.ruleValidate['secondBranch'] = [{
				required: true,
				message: '请选择二级分部',
				trigger: 'change'
			}] : this.ruleValidate['secondBranch'] = [];
			if (this.rangeCopy) {
				this.editData.firstBranch = this.editData.secondBranch = this.editData.store = null;
				v == 2 ? _vm.editData.regionName = '东北大区' : _vm.editData.regionName = '';
				v == 2 ? _vm.editData.regionCode = _vm.regions[0].id : _vm.editData.regionCode = '';

			} else {
				this.rangeCopy = true;
			}
		//	this.getRegion();
		},
		changeRegion: function () {
			if (this.regionCopy) {
				this.editData.firstBranch = ''
				this.firstsubSections = [];
				this.stores = [];
			} else {
				this.regionCopy = true;
			}
			this.getFristsubSections();
		},
		changeFristBranch: function () {
			if (this.firstCopy) {
				this.editData.secondBranch = ''
				this.secondsubSections = [];
				this.stores = [];
			} else {
				this.firstCopy = true;
			}

			this.getSecondsubSections();
		},
		getFristsubSections: function () {
			var _vm = this;
			axios.get(getUrl("restore/getSubsection"), {
				params: {
					type: 1,
					parentId: _vm.editData.regionCode
				}
			}).then(function (res) {
				if (res.code == 0) {
					_vm.firstsubSections = res.list.filter(function (v) {
						return v.id && v.id != '[]';
					})
				}
			});
		},
		getSecondsubSections: function () {
			var _vm = this;
			axios.get(getUrl("restore/getSubsection"), {
				params: {
					type: 2,
					parentId: _vm.editData.firstBranch
				}
			}).then(function (res) {
				if (res.code == 0) {
					_vm.secondsubSections = res.list.filter(function (v) {
						return v.id && v.id != '[]';
					})
				}
			});
		},
		changeSecondBranch: function (v) {
			var _vm = this;
			// this.editData.store =null;
			this.stores = [];
			if (_vm.vipRange == "4") {
				this.getMdxx();
			}
		},
		changeMdxx: function (v) {
		},
		getMdxx: function () {
			var _vm = this;
			axios.get(getUrl("restore/getMdxx"), {
				params: {
					parentId: _vm.editData.secondBranch,
					type: 2
				}
			}).then(function (res) {
				if (res.code == 0) {
					_vm.stores = res.list.filter(function (v) {
						return v.id;
					})
				}
			});
		},
		/**加载被编辑/查看的数据，返回一个Promise
		 * */
		getEditData: function () {
			var _vm = this, editData = _vm.editData, query = this.$route.query, isCopy = query.action == "copy";
			/**注意：编辑/复制操作的时候可以切换场景，此时会在其他场景重新触发加载数据的操作。
			 * 这时不应该再加载数据了，不然场景的数据无法通过切换清空
			 * */
			if (query.id && query.editSwitch != 1) {
				// 获取记录的详细信息
				return axios.get(getUrl("crow/copycrowInfo"), {loading: true, unload: true, params: {id: query.id}})
					.then(function (res) {
						var result = res.crowInfo || {};
						result.beginTime = DateFormat(result.beginTime).toString('yyyy.MM.dd');
						result.endTime = DateFormat(result.endTime).toString('yyyy.MM.dd');
						if (result.store) {
							_vm.vipRange = "4";
						}
						if ((result.firstBranch && !result.store)) {
							_vm.vipRange = "3";
						}
						if (result.regionCode && !result.firstBranch && !result.secondBranch && !result.store) {
							_vm.vipRange = "2";
						}
						// 复制添加：1、不需要保存的id；2、人群名称清空；3、清空日期、‘’
						if (isCopy) {
							result.id = null;
							result.crowdName = null;
							result.dateRange = [];
							delete result.beginTime;
							delete result.endTime;
						}
						var fields = _vm.saveFields;
						for (var i in editData) {
							var r = result[i] || "";
							// 其他场景（editData.scenesType != 1）的品类、品牌下拉是多选，需要把数据转换成数组类型
							if (fields.indexOf(i) > -1 && editData.scenesType != 1) {
								editData[i] = r && r.split(",")
							} else {
								editData[i] = r;
							}
						}
						editData.createUser = _vm.$store.state.user.username;
					})
			} else {
				editData.createUser = _vm.$store.state.user.username;
				return new Promise(function (resolve) {
					resolve()
				})
			}
		},
		/**封装标点校验单个字段的api，实现校验多个字段
		 * @param fields string|[string]需要被校验的字段
		 * @param callback 校验之后的逻辑，回调中传入一个校验成功失败的状态
		 * */
		validate: function (fields, callback) {
			var validator = this.$refs.editData, len;
			fields instanceof Array || (fields = [fields]);
			len = fields.length;
			function loop(i) {
				if (i < len) {
					// 校验不存在的字段会抛出异常，这里则忽略不存在的字段
					try {
						validator.validateField(fields[i], function (invalid) {
							if (invalid) {
								reject()
							} else {
								loop(i + 1);
							}
						})
					} catch (e) {
						loop(i + 1);
					}
				} else {
					resolve()
				}
			}

			function resolve() {
				callback(true)
			}

			function reject() {
				callback(false)
			}

			len ? loop(0) : resolve();
		},
		// 返回保存、计算时转换格式后的数据对象
		getSaveData: function () {
			var validator = this.$refs.editData, _vm = this;
			return new Promise(function (resolve) {
				// 对需要保存的字段进行校验
				validator.validate(function (valid) {
					if (valid) {
						var data = {}, editData = _vm.editData, fields = _vm.saveFields;
						for (var k in editData) {
							data[k] = fields.indexOf(k) > -1 && editData[k] instanceof Array ? editData[k].join(",") : editData[k];
						}
						resolve(data)
					}
				})
			})
		},
		getCalData: function () {
			var _vm = this;
			return new Promise(function (resolve) {
				_vm.validate(_vm.calValidateFields, function (valid) {
					if (valid) {
						var data = {}, fields = _vm.calFields, editData = _vm.editData;
						for (var k in fields) {
							var field = fields[k], value = editData[field];
							value && (data[field] = value instanceof Array ? value.join(",") : value);
						}
						resolve(data)
					}
				});
			});
		},
		cal: function () {
			var _vm = this;
			this.getCalData().then(function (data) {
				_vm.coverShow = true;
				axios.get(getUrl("other/coverTotal"), {params: data}).then(function (res) {
					if (res.code == 0) {
						_vm.coverShow = false;
						_vm.editData.coverUser = parseFloat(res.total);
					} else {
						_vm.coverShow = false;
						_vm.$Message.warning("系统异常，请稍后重试")
					}
				}).catch(function () {
					_vm.coverShow = false;
					_vm.$Message.warning("系统异常，请稍后重试")
				})
			});
		},
		save: function () {
			var _vm = this;
			_vm.getSaveData().then(function (data) {
				data.crowdId = null;
				axios.post(getUrl("restore/saveCrowd"), data, {loading: true, unload: true}).then(function (res) {
					if (res.code == 0) {
						_vm.$Message.success("操作成功");
						_vm.$parent.reload();
						_vm.backToList();
					} else {
						_vm.$Message.warning(res.msg)
					}
				})
			});
		}
	},
	mounted: function () {
		var _vm = this;
		this.$nextTick(function () {
			var query = this.$route.query, isCopy = query.action == "copy";
			if (isCopy) {
				_vm.rangeCopy = false;
				_vm.changeCopy = false;
				_vm.regionCopy = false;
				_vm.firstCopy = false;
			}
		})
		Promise.all([_vm.getRegion(), _vm.getCategories(), _vm.setBrands()]).then(function () {
			_vm.getEditData()
		})
	}
}
