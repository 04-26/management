<template>
  <div class="retrievepassword-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <span>找回密码</span>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="ms-content"
      >
        <el-form-item prop="telphone" label="手机号码：">
          <el-input v-model="ruleForm.telphone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-input v-model="ruleForm.telphone" placeholder="审批人"></el-input>
          <el-button type="primary">查询</el-button>
        </el-form-item>-->
        <el-form-item prop="verificationcode" label="手机验证：">
          <el-input type="text" v-model="ruleForm.verificationcode" placeholder="验证码"></el-input>
          <el-button @click="getCode(ruleForm)" :disabled="!show">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s</span>
          </el-button>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="设置密码" prop="password">
          <el-input type="text" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        </div>
        <div style="display:flex;justify-content: space-between">
          <el-form-item label-width="0" prop="type">
            <el-checkbox v-model="ruleForm.type" label="已阅读用户协议" name="type"></el-checkbox>
          </el-form-item>
          <p style="line-height:32px">

          <router-link style="color:#00D1B2" to="/login"  class="wangjitext">已有账号立即登录</router-link>
          </p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
const TIME_COUNT = 60;
export default {
  data: function() {
    // 自定义验证密码的函数
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        // 非空
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 20) {
        // 长度验证
        callback(new Error("密码长度在 6 到 20 位"));
      } else {
        // 成功的回调
        callback();
      }
    };
    return {
      ruleForm: {
        telphone: "",
        password: "",
        type: "",
        verificationcode: ""
      },
      count: "",
      timer: null,
      show: true,
      rules: {
        // 账号验证
        telphone: [
          { required: true, message: "请输入手机号", trigger: "blur" }, // 非空验证
          { min: 11, max: 11, message: "长度在 11位", trigger: "blur" } // 长度验证
        ],
        type: [
          { required: true, message: "请确认已阅读用户协议", trigger: "blur" }, // 非空验证
         
        ],
        // 密码验证
        password: [
          // 密码验证改造
          { required: true, validator: validatePwd, trigger: "blur" } // 自定义验证规则
        ],
        // 确认密码验证

        verificationcode: [
          { required: true, message: "请输入手机号", trigger: "blur" }, // 非空验证
          { min: 6, max: 6, message: "请输入正确的验证码", trigger: "blur" } // 长度验证
        ]
      }
    };
  },
  methods: {
    getCode(ruleForm) {
      const params = {
        telphone: this.ruleForm.telphone,
        type: this.ruleForm.type
      };
      this.req
        .post("/content/smscode", params)
        .then(res => {
          // 接收后端返回的数据
          // let { item, reason, token, id } = res;
          console.log(res);
          // 判断
          if (res.data.sub_code === "SUCCESS") {
            this.code = res.data.data;
            console.log(this.code);
            // 弹成功提示
            this.$message({
              type: "success",
              message: "验证码获取成功"
            });

            // 跳后端首页
            // this.$router.push('/index')
          } else {
            // 弹失败提示
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          // 收集账号和密码
          const params = {
            telphone: this.ruleForm.telphone,
            password: this.ruleForm.password,
            code: this.ruleForm.verificationcode
          };

          // 发送请求给后端
          this.req
            .post("/user/resetpassword", params)
            .then(res => {
              // 接收后端返回的数据
              // let { item, reason, token, id } = res;
              console.log(res);
              // 判断
              if (res.data.sub_code === "SUCCESS") {
                // 把token存入浏览器

                // window.localStorage.setItem('userid', id);
                // 设置请求头 携带token
                // 弹成功提示
                this.$message({
                  type: "success",
                  message: "密码修改成功"
                });
              } else {
                // 弹失败提示
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("前端验证失败！不允许提交!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.rempass {
  display: flex;
  justify-content: space-around;
}
.retrievepassword-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
}

.retrievepassword-wrap {
  background: rgba(56, 157, 170, 0.82);
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #00d1b2;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
}
.ms-title1 {
  text-align: center;
  font-size: 20px;
  color: #00d1b2;
}
.ms-title2 {
  text-align: center;
  font-size: 14px;
  color: #00d1b2;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.wangji {
  margin: 0;
  display: flex !important;
  justify-content: space-between !important;
}
.wangjitext {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
  color: #606266;
}
</style>