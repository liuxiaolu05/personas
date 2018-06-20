<template>
    <div class="stage">
        <!--
        流失挽回：不显示推广商品
        其他场景：要显示——品类偏好、品牌偏好、平均客单价、综合购买力、忠诚度、流失等级、性别、年龄
    -->
        <Form :model="editData" ref="editData" :rules="ruleValidate" :label-width="120">
            <div class="panel panel-default">
                <Card dis-hover>
                    <p slot="title">营销场景设置</p>
                    <!--<i-form :model="editData"  ref="editData"  :rules="ruleValidate" :label-width="120">-->
                    <FormItem label="营销场景">
                        <div class="groups">
                            <Select v-model="editData.scenesType" @on-change="changeStage"
                                    class="w-lg" placeholder="请选择营销场景">
                                <Option v-for="item in stages" :value="item.idx" :key="item.value">{{item.label}}
                                </Option>
                            </Select>
                        </div>
                    </FormItem>
                    <!-- 流失挽回不显示"推广商品" -->
                    <FormItem label="推广商品" v-if="editData.scenesType==1" prop="catPrefer">
                        <div class="groups">
                            <selection class="w-lg cat-pre" placeholder="请选择品类" filter-placeholder="请输入品类名称"
                                       v-model="editData.catPrefer" :value="categories"
                                       value-field="cat2id" label-field="cat2name"
                                       label-model="editData.catName" :context="this"
                            ></selection>
                            <selection class="w-lg brand-pre error-ignore" placeholder="请选择品牌"
                                       filter-placeholder="请输入品牌名称"
                                       v-model="editData.brandPrefer" :value="brands" clearable
                                       label-model="editData.brandName" :context="this"
                                       :filter-method="brandFilter"
                            ></selection>
                        </div>
                    </FormItem>
                    <FormItem label="数据更新周期" prop="dateRange">
                        <DatePicker v-model="editData.dateRange" format="yyyy.MM.dd" type="daterange"
                                    :options="options.dateRange"
                                    class="w-lg" placeholder="选择日期"></DatePicker>
                    </FormItem>
                    <!-- 其他场景 -->
                    <template v-if="editData.scenesType==2">
                        <FormItem label="品类偏好" prop="group" class="error-ignore">
                            <selection class="w-260 cat-pre" placeholder="请选择品类" filter-placeholder="请输入品类名称"
                                       v-model="editData.catPrefer" :value="categories" :multiple="true" clearable
                                       value-field="cat2id" label-field="cat2name"
                                       label-model="editData.catName" :context="this"
                            ></selection>
                        </FormItem>
                        <FormItem label="品牌偏好" prop="group" class="error-ignore">
                            <selection class="w-260 brand-pre" placeholder="请选择品牌" filter-placeholder="请输入品牌名称"
                                       v-model="editData.brandPrefer" :value="brands" :multiple="true" clearable
                                       label-model="editData.brandName" :context="this"
                                       :filter-method="brandFilter"
                            ></selection>
                        </FormItem>
                        <FormItem label="平均客单价" prop="group">
                            <CheckboxGroup v-model="editData.customerTransaction">
                                <Checkbox label="1">600元以下</Checkbox>
                                <Checkbox label="2">600-1500元</Checkbox>
                                <Checkbox label="3">1500-2000元</Checkbox>
                                <Checkbox label="4">2000-3500元</Checkbox>
                                <Checkbox label="5">3500元以上</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="会员价值" class="vip-value" prop="group">
                            <CheckboxGroup v-model="editData.vipValue">
                                <Checkbox label="1">低</Checkbox>
                                <Checkbox label="2">中</Checkbox>
                                <Checkbox label="3">高</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="忠诚度" class="loyalty" prop="group">
                            <CheckboxGroup v-model="editData.loyalty">
                                <Checkbox label="1">低</Checkbox>
                                <Checkbox label="2">中</Checkbox>
                                <Checkbox label="3">高</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="流失等级" class="lost" prop="group">
                            <CheckboxGroup v-model="editData.lost">
                                <Checkbox label="1">低</Checkbox>
                                <Checkbox label="2">中</Checkbox>
                                <Checkbox label="3">高</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="性别" prop="group">
                            <CheckboxGroup v-model="editData.gender">
                                <Checkbox label="1">男性</Checkbox>
                                <Checkbox label="0">女性</Checkbox>
                                <!--<Checkbox :label="3">未知</Checkbox>-->
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="年龄" prop="group">
                            <CheckboxGroup v-model="editData.age">
                                <Checkbox label="1">18岁以下</Checkbox>
                                <Checkbox label="2">18-24岁</Checkbox>
                                <Checkbox label="3">25-34岁</Checkbox>
                                <Checkbox label="4">35-44岁</Checkbox>
                                <Checkbox label="5">45-60岁</Checkbox>
                                <Checkbox label="6">60岁以上</Checkbox>
                                <!--<Checkbox :label="7">未知</Checkbox>-->
                            </CheckboxGroup>
                        </FormItem>
                    </template>
                    <FormItem label="会员范围">
                        <div class="groups">
                            <selection class="w-lg" placeholder="请选择会员范围" :filterable="false"
                                       v-model="vipRange" :value="defaultData.vipRanges"
                                       :context="this"
                                       @on-value-change="changeVipRange">
                            </selection>
                            <FormItem  prop="regionCode" class="vip-range">
                                <selection class="w-lg" placeholder="请选择大区" :filterable="false"
                                           v-model="editData.regionCode" :value="regions"
                                           label-field="name" value-field="id"
                                           label-model="editData.regionName" :context="this"
                                           @on-value-change="changeRegion"
                                >
                                </selection>
                            </FormItem>
                            <FormItem  class="vip-range" v-if="editData.regionCode && vipRange!='2'" prop="firstBranch">
                                <selection class="w-lg" placeholder="请选择一级分部" :filterable="false"
                                           v-model="editData.firstBranch" :value="firstsubSections"
                                           label-field="name" value-field="id"
                                           label-model="editData.firstBranchName" :context="this"
                                           clear-model
                                           @on-value-change="changeFristBranch"
                                >
                                </selection>
                            </FormItem>
                            <FormItem  class="vip-range" v-if="editData.firstBranch &&  vipRange!='2'" prop="secondBranch">
                                <selection class="w-lg" placeholder="请选择二级分部" :filterable="false"
                                           v-model="editData.secondBranch" :value="secondsubSections"
                                           label-field="name" value-field="id" :clearable="vipRange==3"
                                           label-model="editData.secondBranchName" :context="this"
                                           clear-model
                                           @on-value-change="changeSecondBranch"
                                >
                                </selection>
                            </FormItem>
                            <FormItem  class="vip-range"  v-if="editData.secondBranch && stores.length > 0 && vipRange=='4'" prop="store">
                                <selection class="w-lg" placeholder="请选择门店" :filterable="false"
                                           v-model="editData.store" :value="stores"
                                           label-field="name" value-field="id"
                                           label-model="editData.storeName" :context="this"
                                           clear-model
                                           @on-value-change="changeMdxx"
                                >
                                </selection>
                            </FormItem>
                        </div>
                    </FormItem>
                    <!--</i-form>-->
                </Card>
            </div>
            <!-- 基本信息设置 -->
            <div class="panel panel-default">
                <Card dis-hover>
                    <p slot="title">基本信息设置</p>
                    <!--<i-form :model="editData"  :label-width="120">-->
                    <FormItem label="人群名称" prop="crowdName">
                        <Input v-model="editData.crowdName" class="w-lg" placeholder="请输入人群名称"></Input>
                    </FormItem>
                    <!--<FormItem label="推送渠道" v-model="editData.channel">-->
                        <!--短信-->
                    <!--</FormItem>-->
                    <FormItem label="推送频次" prop="frequencyCount" :show-message="!!editData.frequency">
                        <div class="groups">
                            <RadioGroup v-model="editData.frequency" @on-change="frequencyChange($event)">
                                <Radio :label="0">不限定</Radio>
                                <Radio :label="1">限定</Radio>
                            </RadioGroup>
                            <div style="display: inline-block;" v-if="editData.frequency==1">
                                <span>推送周期内最多</span>
                                <Input v-model="editData.frequencyCount" class="w-sm t-center"></Input>
                                <span>条</span>
                            </div>
                        </div>
                    </FormItem>
                    <!--</i-form>-->
                </Card>
                <div class="groups">
                    <Button type="primary" @click="backToList">取消</Button>
                    <Button type="primary" @click="save">保存</Button>
                    <Button type="primary" @click="cal">覆盖人数</Button>
                    <div class="cover"
                         style="display: inline-block;height:32px;;position: relative;vertical-align: middle;">
                        <span v-text="getCover()"></span>
                        <Spin v-if="coverShow" style="position: absolute;top: 50%; margin-top: -13px;">
                            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        </Spin>
                    </div>

                </div>
            </div>
        </Form>
    </div>
</template>
<script>
    import base from "@/assets/js/crowd/base";
    export default {
        extends: base,
        data: function () {
            return {
                // 需要保存的字段
                saveFields: [],
                // 计算覆盖人数需要的字段
                calFields: ["scenesType", "lost", "regionCode", "firstBranch", "secondBranch", "store"],
                editData: {
                    scenesType: "3",
                    lost: "2,3"
                }
            }
        }
    }
</script>