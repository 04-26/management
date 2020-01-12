<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <!-- 全屏显示 -->
    <!-- <div class="btn-fullscreen" @click="handleFullScreen">
      <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
        <i class="el-icon-rank"></i>
      </el-tooltip>
    </div> -->
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心
                <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户头像 -->
        <div class="user-avator">
              <img :src="`/img/${this.shopmsg.logo}`" alt>
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{name}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <a href="#" target="_blank">
              <el-dropdown-item>11111</el-dropdown-item>
            </a>
            <a href="#" target="_blank">
              <el-dropdown-item>11111</el-dropdown-item>
            </a> -->
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../common/bus";
import axios from "axios";

export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "",
      message: 2,
      shopmsg:''
    };
  },
  computed: {
    
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        // localStorage.removeItem('ms_username',)
        var storage = window.localStorage;
        storage.clear();
        this.$router.push("/login");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
     getshopmsg() {
      const params = {
        id: window.localStorage.getItem("shopid")
      };
      this.req
        .post("/store/detail", params)
        .then(res => {
          console.log(res.data.data);
          this.shopmsg = res.data.data;
            this.name = this.shopmsg.shopName

          if (res.data.sub_code == "SUCCESS") {
           
          } else {
            
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
  created(){
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
    this.getshopmsg() 
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header-right {
  float: left;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
  float: right;
  line-height: 70px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
