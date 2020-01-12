<template>
  <!-- <div class="accountmanagement container-fluid">
    <div class="container-fluid" style="display:flex;border-bottom:1px #d8d8d8 solid;justify-content: space-between">
      <p style="line-height:80px;color:#00D1B2;font-size:32px;padding-left:180px">小顺子</p>
      <p style="font-size:16px;line-height:80px;padding-right:180px;cursor: pointer;" @click="handleCommand">退出</p>
    </div>
    <el-card shadow="never" class="box-card" style="margin:30px 80px;">
      <div slot="header">
        <h3>账户管理</h3>
      </div>
      <div>
        <el-container>
          <el-aside width="200px;margin-top:56px;">
            <aSidebar></aSidebar>
          </el-aside>
          <el-container>
            <el-main class="main">
              <router-view></router-view>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </el-card>
  </div>-->
  <div style="border:none;height:100%;overflow:auto;position:relative;">

  <div
    id="div_second_table"
    data-spy="scroll"
    data-target="#navbar-example"
    data-offset="0"
    style="border:none;"
    class="container"
  >
    <nav
      class="navbar navbar-default navbar-fixed-top"
      aria-expanded="true"
      role="navigation"
      style="border:none;background:#fff"
    >
      <div style="border:none" class="navigation">
        <div style="border:none;border-bottom:1px solid #00d1b2;border-radius:0px;" class="container">
          <div class="navbar-header">
            <button
              type="button"
              class="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-navbar"
              aria-expanded="false"
            >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <div class="navbar-brand">
              <a href="accountinformation#/myshop">
                  <!-- <span>小</span>顺子 -->
                  <img style="width:150px;height:40px;" src="../../assets/img/小顺子-横版.png" alt="">
              </a>
            </div>
          </div>
          <div id="bs-navbar" class="navbar-collapse collapse">
            <div class="menu">
              <ul
                style="border:none;display:flex;justify-content: flex-end;"
                class="nav nav-tabs"
                role="tablist"
              >
                <li role="presentation">
                  <a href="index.html#/myshop">我的店铺</a>
                </li>
                <li role="presentation">
                  <a href="index.html#/accountinformation">账户信息</a>
                </li>
                <li role="presentation">
                  <a href="index.html#/messagecenter">消息中心</a>
                </li>
                <li role="presentation">
                  <a href="index.html#/changepassword">修改密码</a>
                </li>
                <li role="presentation">
                  <a style="cursor: pointer;" @click="handleCommand">退出</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div style="border:none;margin-top:160px;padding:0" class="feature">
      <div style="border:none;padding:3px" class="container bs-docs-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import aSidebar from "./Sidebaraccount.vue";
import axios from "axios";
export default {
  components: {
    aSidebar
  },
  created() {
    axios.defaults.headers = {
      "X-Custom-Header": "foobar",
      device: "2",
      deviceid: "1",
      systemos: "web",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrZW4iLCJpYXQiOjE1Mzc1NTQzMDksImRhdGEiOnsidXNlcm5hbWUiOiJ4dXRvbmdiYW8iLCJpc19zdXBlcnVzZXIiOjEsImlkIjoxNywibG9naW5fdGltZSI6MTUzNzU1NDMwOX0sImV4cCI6MTUzODE1NDMwOX0.32Lys4hjjY2XRpM2r9YSmpYA798u821m_M5Tzb6wxIU",
      "Content-Type": "application/x-www-form-urlencoded",
      token: window.localStorage.getItem("t_k_1130_h5-@&1265"),
      shopid: window.localStorage.getItem("shopid")
    };
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand() {
      // localStorage.removeItem('ms_username',)
      var storage = window.localStorage;
      storage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style>
body,
html {
  height: 100%;
}
.main {
  height: 100vh;
  /* overflow: scroll; */
}
.el-card__header {
  border: none !important;
}
</style>