<template>
  <div style="border:none" class="myshop">
    <el-card style="border:none"  shadow="never" class="box-card" >
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>
      <div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
            label-position=top


        >
          <el-form-item label="输入旧密码" prop="oldpass">
            <el-input style="width:250px" type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="输入新密码" prop="pass">
            <el-input style="width:250px"  type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码" prop="checkPass">
            <el-input style="width:250px"  type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
      
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          oldpass: ''
        },
        rules: {
          oldpass: [
           { required: true, message: "请输入原来密码", trigger: "blur" },
          ],
          pass: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: "请再次输入密码", trigger: "blur" },
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
                          oldpassword: this.ruleForm.oldpass,
                          password: this.ruleForm.pass,
                          }

                        this.req.post('/user/changepassword',params).then(res => {
                            
                                console.log(res)
                                if (res.data.sub_code == "SUCCESS") {
                                    this.$message({
                                        type: 'success',
                                        message:'密码修改成功'
                                    })
                                    this. resetForm(formName)
                                } else{
                                    this.$message.error(res.data.sub_msg)
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>

<style scoped>
</style>
