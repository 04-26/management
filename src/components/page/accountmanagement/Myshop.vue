<template>
  <!-- <div class="myshop" style=" position: relative;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="所有店铺" name="first" class="shoplist">
      </el-tab-pane>
      <el-tab-pane label="零售" name="second">零售</el-tab-pane>
      <el-tab-pane label="美业" name="third">美业</el-tab-pane>
      <el-tab-pane label="教育" name="fourth">教育</el-tab-pane>
    </el-tabs>
  </div>-->
  <div>
    <div style="border:none;" class="text-center container myshop">
      <p style="padding-right:30px" class="text-right">
        <el-button type="primary" class="btn-myshop" @click="createshop">创建店铺</el-button>
      </p>
    </div>
    <div >
      <div
        style="margin-bottom:10px;display: flex;"
        v-for="(i,v) in acclist"
        :key="v"
        class="col-md-3 text-center"
      >
        <div class="shop-card">
          <p style="line-height:40px;weight:100%;text-align:center">

          <img class="shop-img" v-if="i.logo" :src="i.logo|avatar" alt />
          <img
            v-if="!i.logo"
            class="shop-img"
            src="../../../assets/img/u=206548989,900246975&fm=26&gp=0.jpg"
            alt
          />
          </p>
          <p style="line-height:40px;weight:100%;text-align:center">{{i.shopName}}</p>
          <div>
            <p style="line-height:40px;weight:100%;text-align:center">账户有效期至：</p>
            <p style="line-height:40px;weight:100%;text-align:center" v-if="i.expireTime!=undefined">{{ i.expireTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
          </div>
          <el-button type="primary" @click="goclick(i.id)">进入管理</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { clearInterval, setInterval } from "timers";
export default {
  name: "myshop",
  data() {
    return {
      activeName: "first",
      ids: "",
      acclist: []
    };
  },
  methods: {
    createshop() {
      this.$router.push("/createshop");
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    goclick(id) {
      console.log(id);
      window.localStorage.removeItem("shopid");
      window.localStorage.setItem("shopid", id);
      this.$router.push("/index");
    },
    // rload(){
    //   location.reload()
    // },
    getdata() {
      this.req
        .post("/store/list")
        .then(res => {
          console.log(res.data.data);
          let { id } = res.data.data[0];
          this.acclist = res.data.data;
          if (res.data.sub_code == "SUCCESS") {
            // this.reload()
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      console.log(this.acclist);
    }
  },
  mounted() {
    // this.bus.$on('change', ()=> {
    this.getdata();
    // })
  },
  created() {
    this.getdata();
  },
  beforeDestroy() {},
  beforeMount() {
    // this.$router.go(0)
    // this.$router.go('/myshop')
  }
};
</script>
<style scoped>
.shoplist {
  display: flex;
  
  flex-wrap: wrap;
}
.shop-card {
  width: 100%;
  /* display: flex; */
  height: 350px;
  border: 1px solid #ccc;
  padding: 10px;
  padding-top:40px; 
  text-align: center;
  /* justify-content: space-between; */
  /* flex-wrap: nowrap; */
  /* align-items: center; */
}
.shop-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding-right: 5px;
}
</style>
