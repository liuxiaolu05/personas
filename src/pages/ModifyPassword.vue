<template>
       <Modal title="修改密码"    class="modify-pwd" v-model="showList" :mask-closable="false" :closable="false" >
           <Form v-if="editUser" :model="editUser" ref="editUser" :rules="ruleValidate" :label-width="120" autocomplete="off" >
               <div  @keyup.enter="save">
                   <FormItem label="用户名" prop="uname">
                       <Input type="text" name="用户名" disabled  autocomplete="off" placeholder="请输入用户名"
                              key="uname" v-model="editUser.uname"
                       />
                   </FormItem>
                   <FormItem label="旧密码" prop="opwd">
                       <Input type="password" autocomplete="off" name="旧密码"
                              placeholder="请输入旧密码"
                              key="opwd" v-model="editUser.opwd"
                       />
                   </FormItem>
                   <FormItem label="新密码" prop="pwd">
                       <Input type="password" name="新密码" placeholder="请输入新密码"
                              v-model="editUser.pwd"
                       />
                   </FormItem>
                   <FormItem label="确认新密码" prop="repwd">
                       <Input type="password" name="确认密码"  placeholder="请确认新密码"
                              v-model="editUser.repwd" @focus="alert(123)"
                       />
                   </FormItem>

               </div>
           </Form>
           <div slot="footer">
               <Button type="text" @click="cancel">取消</Button>
               <Button type="primary" @click="save">保存</Button>
           </div>
       </Modal>
</template>
<script>
    var name= $.cookie('username');
    export default{
        props:{
            showList:{
                type:Boolean
            },
            uname:{
                type:String
            }
        },
        data(){
            const rpwdCheck = (rule, value, callback) => {
                if (value !== this.editUser.pwd) {
                    callback(new Error('两次密码输入不一致！'));
                } else {
                    callback();
                }
            };
            return {
                editUser:{},
                password: '',
                newPassword: '',
                ruleValidate:{
                    uname: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    opwd:[
                        { required: true, message: '旧密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '旧密码不能少于6个字符', trigger: 'blur' },
                        { type: 'string', max: 20, message: '旧密码不能多于20个字符', trigger: 'blur' }
                    ],
                    pwd:[
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '新密码不能少于6个字符', trigger: 'blur' },
                        { type: 'string', max: 20, message: '新密码不能多于20个字符', trigger: 'blur' },

                    ],
                    repwd:[
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '确认密码不能少于6个字符', trigger: 'blur' },
                        { type: 'string', max: 20, message: '确认密码不能多于20个字符', trigger: 'blur' },
                        { validator:rpwdCheck,trigger:'blur'}
                    ],

                }
            }
        },
        methods:{
            save: function () {
                var _vm = this, $Message = this.$Message;
                this.$refs['editUser'].validate(function (valid) {
                    if (valid) { // 校验全部通过，调用重置密码的接口
                        axios.post(getUrl("resetPwd"), {
                            username: _vm.editUser.uname,
                            oldPassword: _vm.editUser.opwd,
                            password: _vm.editUser.pwd
                        }).then(function (data) {
                            if (data.code == 0) { // 成功
                                $Message.success("操作成功");
//                                  _vm.password = "";
                                _vm.$refs['editUser'].resetFields();
                                _vm.$emit('update:showList', false)
                            } else {
                                $Message.warning(data.msg);
                                _vm.$emit('update:showList', true)
                            }
                        })
                    }
                    else {
                        _vm.$emit('update:showList', true)
                    }
                });
            },
            // 取消编辑操作
            cancel: function () {
                this.$refs['editUser'].resetFields();
                this.$emit('update:showList', false);
            }
        },
        mounted(){
        }
    }
</script>