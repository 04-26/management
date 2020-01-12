<template>
  <div  class="accountinformation">
    <el-card style="border:none"  shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>账户信息</span>
      </div>
      <div>
        <p>用户名：{{accname}}</p>
        <p>手机号：{{accname}}</p>
        <p>店铺数量：{{shopnum}}</p>
      </div>
    </el-card>
  </div>
</template>

    
<script>
export default {
  name:'accountinformation',
  data() {
    return {
      accname: "",
      shopnum: ""
    };
  },
 
  methods: {
    getmsg(){
       this.req
        .post("/user/userinfo")
        .then(res => {
          console.log(res);
          // 判断
          if (res.data.sub_code == "SUCCESS") {
            let { name, shopnum } = res.data.data;
            this.accname = name;
            this.shopnum = shopnum;
          } else {
            
          }
        })
        .catch(err => {
          console.log(err);
        })
        
    }
    
  },
   mounted() {
    // 收集账号和密码
    this.getmsg()



   
  },
  created(){
    this.getmsg()

  },
  activated: function() {
  }
};
</script>

<style >


</style>
