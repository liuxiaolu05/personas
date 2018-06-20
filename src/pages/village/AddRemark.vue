<template>
    <div class="add-remark">
            <Card dis-hover>
                <p slot="title" class="remark-title">
                    <span class="remark">备注信息</span>
                    <a href="javascript:void(0)" class="add-btn" @click="showBox">
                        <i class="icon icon-Addnotes"></i>
                        <span>添加新备注</span>
                    </a>
                    <Button type="primary" @click="returnList" class="return-list">返回小区列表</Button>
                </p>
                <div class="info-list">
                    <div class="list" v-for="(item,index) in  remarkList" :key="index" >
                        <p class="list-title clearfix"><span class="time">{{item.time}}</span>
                            <span class="name">{{item.name}}</span>
                            <a  href="javascript:void(0);" class="delete-remark" @click="deleteRemark(index,item.id,item.createUser)" :class="{show:item.name==name}">
                                <i class="icon icon-shanchu"></i>删除备注</a>
                        </p>
                        <div class="list-text"  v-html="item.text"></div>

                    </div>
                </div>
            </Card>
            <div class="add-text" :class="{show:show}">
                <div class="add-title clearfix">
                    <span>添加备注</span>
                    <span @click="closeBox" class="close-btn">
                        <Icon type="close"></Icon>
                    </span>
                </div>
                <div class="input-box" >
                    <Input v-model="inputText" type="textarea" :autosize="{minRows: 7}" placeholder="请输入..."/>
                    <Button  @click="submit" class="sub-btn" type="primary">提交</Button>
                </div>
            </div>
    </div>
</template>
<script>
    import "@/assets/css/property";
    var chineseName=decodeURI(decodeURI(top.$.cookie('chineseName')));

    export default {
        data(){
            return {
                show:false,
                inputText:'',
                remarkList:[],
                name:chineseName,
                id:this.$route.query.id
            }
        },
        mounted:function(){
            this.$nextTick(function(){
                this.searchList(this.id);
            })
        },
        methods:{
            submit:function(){
                if(this.inputText!==''){
                    var vm=this,
                    newString =this.inputText.replace(/\n/g, '_@').replace(/\r/g, '_#');
//                    newString = newString.replace(/_#_@/g, '<br/>');//IE7-8
                    newString = newString.replace(/_@/g, '<br/>');//IE9、FF、chrome
                    newString = newString.replace(/\s/g, '&nbsp;');//空格处理
                    axios.get(getUrl("addRemark"),{params:{
                        communityId:vm.id,
                        createUser:top.$.cookie('username'),
                        createUsername:chineseName,
                        remark:newString
                    }}).then(function(res){
                        if(res.addFlag==true){
                            vm.searchList(vm.id);
                        }else {
                            vm.$Message.error('添加失败');
                        }

                    }).catch(function(err){
                        console.log(err);
                    })
                    this.show=false;
                }

            },
            dataChange:function(d){
                var date=new Date(d),
                Y = date.getFullYear() + '-',
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
                D = (date.getDate()< 10 ? '0'+date.getDate() : date.getDate())+'  ',
                h = (date.getHours()< 10 ? '0'+date.getHours() : date.getHours()) + ':',
                m = (date.getMinutes()< 10 ? '0'+date.getMinutes() : date.getMinutes());
                var nowtime=Y+M+D+h+m;
                return nowtime;
            },
            searchList:function(){
                var vm=this;
                vm.remarkList.length=0;
                axios.get(getUrl("getRemarks"),{loading: true,unload: true, params:{communityId:vm.id}})
                        .then(function(res){
                           if(res.code==0){
                               for(var i=0;i<res.remarkList.length;i++){
                                   var time= vm.dataChange(res.remarkList[i].createTime);
                                   vm.remarkList.push({
                                       time:time,
                                       name:res.remarkList[i].createUsername,
                                       text:res.remarkList[i].remark,
                                       createUser:res.remarkList[i].createUser,
                                       id:res.remarkList[i].id
                                   })
                               }
                           }
                        }).catch(function(err){
                    console.log(err);
                })
            },
            showBox:function(){
                this.show=true;
                this.inputText='';
            },
            closeBox:function(){
                this.show=false;

            },
            returnList:function(){
                this.$store.state.path='main'
                this.$router.push('/village/villageOverview.html')
            },
            deleteRemark:function(index,id,createUser){
                var vm=this;
                vm.$Modal.confirm({
                    title: '提示信息',
                    content:'是否确定删除此条备注?',
                    cancelText:'取消',
                    onOk: function() {
                        // axios.get('http://10.112.75.12:8073/smallPortrait-1.0.0/community/deleteRemark',{params:{id:id,createUser:createUser}})
                        axios.get(getUrl('deleteRemark'),{params:{id:id,createUser:createUser}})
                                .then(function(res){
                                    if(res.deleteFlag==true){
                                        vm.remarkList.splice(index,1);
                                        //vm.searchList(id);
                                    }else {
                                        vm.$Message.error('删除失败');
                                    }
                                }).catch(function(err){
                            console.log(err);
                        })

                    },
                });
            }
        }
    }
</script>