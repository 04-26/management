<template>
  <div>
    <div style=" display: flex;
  justify-content: space-between;background:#fff;margin-bottom:20px;padding:30px 50px;border-radius:4px">
      <div class="grid-cont-right1">
        <div class="topcontent">订单数量（已完成）</div>
        <div class="grid-num">{{paydata.orderNum}}</div>
      </div>

      <div class="grid-cont-right2">
        <div class="topcontent">订单金额（已完成）</div>
        <div class="grid-num">{{paydata.orderAmount}}元</div>
      </div>

      <div class="grid-cont-right3">
        <div class="topcontent">微信支付金额（已完成）</div>
        <div class="grid-num">{{paydata.wxpayAmount}}元</div>
      </div>

      <div class="grid-cont-right4">
        <div class="topcontent">会员卡支付金额（已完成）</div>
        <div class="grid-num">{{paydata.vipcardPayAmount}}元</div>
      </div>
    </div>

    <el-row>
      <el-col :span="24">
      <el-card shadow="never" class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size:18px">常用功能</span>
        </div>
        <div class="function-list">
          <router-link class="indexa" to="/technician">技师管理</router-link>
          <router-link class="indexa" to="/ordermanagement">订单管理</router-link>
          <router-link class="indexa" to="/membercenter">会员管理</router-link>
          <router-link class="indexa" to="/datacenter">数据统计</router-link>
          <router-link class="indexa" to="/servicemanagement">服务管理</router-link>
          <router-link class="indexa" to="/groupbooking">拼团订单</router-link>
          <router-link class="indexa" to="/bargainirg">砍价订单</router-link>
          <router-link class="indexa" to="/openorder">快速开单/开卡</router-link>
        </div>
      </el-card>
      </el-col>
    </el-row>
    <el-card>
      <div slot="header">新手指导</div>
      <el-row>
        <el-col :span="6" style="padding:15px;" v-for="(item, index) in artList" :key="index">
          <Guidle :item="item" :indexNum="index"></Guidle>
        </el-col>
      </el-row>
    </el-card>
    
    
  </div>
</template>

<script>
import Schart from "vue-schart";
import bus from "../../common/bus";
import axios from "axios";
import Guidle from "@/components/page/index/Guidle.vue";
// 设置axios的请求拦截器（在发送所有请求之间 给请求头统一携带token）

export default {
  name: "dashboard",
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      data: [
        {
          name: "2018/09/04",
          value: 1083
        },
        {
          name: "2018/09/05",
          value: 941
        },
        {
          name: "2018/09/06",
          value: 1139
        },
        {
          name: "2018/09/07",
          value: 816
        },
        {
          name: "2018/09/08",
          value: 327
        },
        {
          name: "2018/09/09",
          value: 228
        },
        {
          name: "2018/09/10",
          value: 1065
        }
      ],
      options: {
        title: "最近七天每天的用户访问量",
        showValue: false,
        fillColor: "rgb(45, 140, 240)",
        bottomPadding: 30,
        topPadding: 30
      },
      functionList: [
        "技师管理",
        "订单管理",
        "会员管理",
        "数据统计",
        "服务管理"
      ],
      paydata: {},
      artList:[]
    };
  },
  components: {
    Schart,
    Guidle
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
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
    this.handleListener();
    this.changeDate();
    this.getpaydata();
    // 获取新手教程
    this.getArticle();
  },
  activated() {
    this.handleListener();
    this.getpaydata();
  },
  deactivated() {
    window.removeEventListener("resize", this.renderChart);
    bus.$off("collapse", this.handleBus);
  },
  methods: {
    getArticle(){
      // /content/getarticlelist
      // Shopadminhelp
      var params = {akey:'Shopadminhelp',flag:true};
      this.req.post("/content/getarticlelist",params).then(res=>{
        if(res.data.code=="SUCCESS" && res.data.sub_code=='SUCCESS'){
          this.artList = res.data.data;
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() +
          1}/${date.getDate()}`;
      });
    },
    handleListener() {
      bus.$on("collapse", this.handleBus);
      // 调用renderChart方法对图表进行重新渲染
      //   window.addEventListener("resize", this.renderChart);
    },
    handleBus(msg) {
      setTimeout(() => {
        // this.renderChart();
      }, 300);
    },
    getpaydata() {
      this.req
        .post("/order/ordertotalcount")
        .then(res => {
          console.log(res);
          this.paydata = res.data.data;
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>


<style scoped>
  .box-card{height: auto;}
  .topcard {display: flex;justify-content: space-around;padding-left: 20px;}
  .el-row {margin-bottom: 15px;height: 100px;}
  .function-list {/* display: flex;justify-content: space-between;text-align: center;flex-wrap: wrap;padding: 20px; */display:grid;grid-template-columns: repeat(auto-fill,200px);grid-gap: 70px;}
  .function-span {display: inline-block;width: 25%;line-height: 80px;text-align: center;}
  .grid-content {display: flex;align-items: center;height: 100px;}
  .grid-cont-right1 {color: rgb(253, 251, 251);padding: 20px;background: url("../../../assets/img/椭圆23@2x(1).png") no-repeat;height: 130px;width: 305px;}
  .grid-cont-right2 {/* text-align: center; */color: #fff;padding: 20px;background: url("../../../assets/img/椭圆23拷贝@2x(1).png") no-repeat;height: 130px;width: 305px;}
  .grid-cont-right3 {/* text-align: center; */color: #fff;padding: 20px;background: url("../../../assets/img/椭圆23拷贝2@2x(1).png") no-repeat;height: 130px;width: 305px;}
  .grid-cont-right4 {/* text-align: center; */color: #fff;padding: 20px;background: url("../../../assets/img/椭圆23拷贝3@2x(1).png") no-repeat;height: 130px;width: 305px;}
  .topcontent {padding-bottom: 5px;font-size: 18px;}.grid-num {font-size: 36px;font-weight: bold;/* text-align: center; */line-height: 60px;}
  .indexa {display: inline-block;color: #fff;/* margin-left:10px ;margin-top: 30px; */line-height: 84px;text-align: center;background: url("../../../assets/img/圆角矩形8拷贝12@2x.png") no-repeat;width: 212px;height: 84px;font-size: 18px;text-decoration: none;}
  .grid-con-icon {font-size: 50px;width: 100px;height: 100px;text-align: center;line-height: 100px;color: #fff;}
  .grid-con-1 .grid-con-icon {background: rgb(45, 140, 240);}.grid-con-1 .grid-num {color: rgb(45, 140, 240);}
  .grid-con-2 .grid-con-icon {background: rgb(100, 213, 114);}.grid-con-2 .grid-num {color: rgb(45, 140, 240);}
  .grid-con-3 .grid-con-icon {background: rgb(242, 94, 67);}.grid-con-3 .grid-num {color: rgb(242, 94, 67);}
  .user-info {display: flex;align-items: center;padding-bottom: 20px;border-bottom: 2px solid #ccc;margin-bottom: 20px;}
  .user-avator {width: 120px;height: 120px;border-radius: 50%;}
  .user-info-cont {padding-left: 50px;flex: 1;font-size: 14px;color: #999;}
  .user-info-cont div:first-child {font-size: 30px;color: #222;}
  .user-info-list {font-size: 14px;color: #999;line-height: 25px;}
  .user-info-list span {margin-left: 70px;}.mgb20 {margin-bottom: 20px;}
  .todo-item {font-size: 14px;}.todo-item-del {text-decoration: line-through;color: #999;}
  .schart {width: 100%;height: 300px;}
</style>
