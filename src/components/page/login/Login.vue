<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <span class="ms-title1">小顺子众帮</span>
        <router-link to="/register" class="ms-title2">免费注册</router-link>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="ms-content"
      >
        <el-form-item prop="username" label="手机号码：">
          <el-input v-model="ruleForm.username" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="登录密码：">
          <el-input
            type="password"
            placeholder="请输入登录密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifycode" label="验证码：">
          <!-- 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 -->
          <el-input v-model="ruleForm.verifycode" placeholder="请输入验证码" class="identifyinput"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="identifybox">
            <div @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
            <el-button @click="refreshCode" type="text" class="textbtn">看不清，换一张</el-button>
          </div>
        </el-form-item>
        <div class="wangji">
          <el-checkbox v-model="ruleForm.remember" label="记住密码" name="type"></el-checkbox>
          <p class="wangjitext">
            <router-link style="color:#00D1B2" to="/retrievepassword">忘记密码</router-link>
          </p>
        </div>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <el-form-item prop="type1" label-width="0">
          <el-checkbox v-model="ruleForm.type1" label="已阅读用户协议" name="type"></el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import SIdentify from "./SIdentify.vue";
import { constants } from "crypto";
// 引入base64
const Base64 = require("js-base64").Base64;
import axios from "axios";

export default {
  components: {
    SIdentify
  },
  data: function() {
    // 自定义验证密码的函数
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        // 非空
        callback(new Error("请输入密码"));
      } else if (value.length < 11 || value.length > 11) {
        // 长度验证
        callback(new Error("密码长度在 3 到 5 位"));
      } else {
        callback();
      }
    };
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value.toLowerCase() !== this.identifyCode.toLowerCase()) {
        console.log("validateVerifycode:", value);
        callback(new Error("验证码不正确!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        username: "",
        password: "",
        verifycode: "",
        type: "",
        type1: true,
        remember: ""
      },
      checked: false,
      identifyCodes: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", // 验证码字符的集合
      identifyCode: "",
      rules: {
        username: [
          {
            required: true,
            validator: validatePwd,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verifycode: [
          { required: true, trigger: "blur", validator: validateVerifycode }
        ],
        type1: [
          { required: true, message: "请确认已阅读用户协议", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          // 收集账号和密码

          const params = {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          };

          // 发送请求给后端
          this.req
            .post("/user/login", params)
            .then(res => {
              // 储存登录信息
              console.log(res);
              // 判断
              if (res.data.sub_code == "SUCCESS") {
                let { token } = res.data.data;
                // console.log(token);
                // 把token存入浏览器
                // console.log("1");
                // 存入token
                // 弹成功提示
                this.$message({
                  type: "success",
                  message: "登录成功"
                });

                window.localStorage.setItem("t_k_1130_h5-@&1265", token);

                // 跳后端首页

                // this.$router.replace({ name: "usernameinformation" }); // 处理返回刷新问题

                this.setUserInfo();
                this.$router.push({ path: "/myshop", name: "Myshop" });
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
    },
    freeregister() {
      this.$router.push({ path: "/register" } + new Date());
    },
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      console.log(this.identifyCode);
    },
    // 储存表单信息
    setUserInfo: function() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.ruleForm.remember) {
        this.setCookie("username", this.ruleForm.username);
        // base64加密密码
        this.setCookie("remember", this.ruleForm.remember);
        this.setCookie("password", Base64.encode(this.ruleForm.password));
        // console.log(password);
      } else {
        this.setCookie("username", "");
        this.setCookie("password", "");
      }
    },
    // 获取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 保存cookie
    setCookie: function(cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    }
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    }
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    let username = this.getCookie("username");
    let password = Base64.decode(this.getCookie("password"));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (username) {
      this.ruleForm.username = username;
      this.ruleForm.password = password;
      this.ruleForm.remember = true;
    }
  }
};
</script>

<style scoped>
.identifybox {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
}
.iconstyle {
  color: #409eff;
}
.rempass {
  display: flex;
  justify-content: space-around;
}
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
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
  min-width: 350px;
  /* margin: -190px 0 0 -175px; */
  border-radius: 5px;
  background: rgba(255, 255, 255);
  overflow: hidden;
  transform: translate(-50%,-50%);
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
  padding-bottom: 10px;
}
.wangjitext {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
  color: #606266;
}
</style>