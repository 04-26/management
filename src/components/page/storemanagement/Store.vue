<template>
  <div>
    <el-tabs  v-model="activeName">
      <el-tab-pane  label="店铺信息" name="first">
        <Storemanagement></Storemanagement>
      </el-tab-pane>
      <!-- <el-tab-pane label="店铺装修" name="second">店铺装修</el-tab-pane> -->
      <el-tab-pane label="评价管理" name="third">
        <Evaluationmanagement></Evaluationmanagement>
      </el-tab-pane>
      <el-tab-pane label="小程序模版" name="fourth" v-if="isAuth">
        <MiniTemplate :shopDetail="shopDetail"></MiniTemplate>
      </el-tab-pane>
      <!-- <el-tab-pane label="店铺认证" name="fourth">店铺认证</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import Storemanagement from "./Storemanagement";
import Evaluationmanagement from "./Evaluationmanagement";
import MiniTemplate from "./MiniTemplate";
export default {
  data() {
    return {
      activeName: "first",
      shopDetail:{},
      isAuth:false,
    };
  },
  created() {
    this.getShopDetail();
  },
  methods: {
    getShopDetail(){
      const params = {
        id: window.localStorage.getItem("shopid")
      };
      this.req.post("/store/detail", params).then(res => {  
          this.shopDetail = res.data.data;
          this.getAuth();
        })
    },
    getAuth(){
      // 通过接口获取
      this.req.get("/wxapi/authorizer/"+this.shopDetail.appid).then(res => {
          if(res.authorization_info){
            this.isAuth=true;
          }else{
            this.isAuth=false;
          }
      })
    },
  },
  components: {
    Storemanagement,
    Evaluationmanagement,
    MiniTemplate
  }
};
</script>

<style scoped>

</style>
