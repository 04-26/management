<template>
  <div>
    <el-card style="height:85vh" shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资产管理/提现详情</span>
      </div>
      <div>
        <el-steps
          v-if=" cashstatus <3"
          style="width:45% ;margin:0 auto"
          :active="active"
          finish-status="success">
          <el-step title="发起提现"></el-step>
          <el-step title="提现处理中"></el-step>
          <el-step title="提现成功"></el-step>
        </el-steps>
        <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
        <p
          style="width:100%;text-align:center;line-height:70px;font-size:28px;color:red"
          v-if="cashstatus==3"
        >提现失败</p>
        <div style="border:1px #ccc solid;width:400px;padding:40px;margin:0 auto">
          <p>商户名称：{{shopmsg.shopName}}</p>
          <p>提现账户：余额账户</p>
          <p>提现金额：{{amount}}</p>
          <p>提现银行：{{bankTitle}}</p>
          <p>提现时间：{{initTime }}</p>
          <p v-if="active>4">提现处理完成时间：{{completeTime }}</p>
          <p v-if="active>4">失败原因：{{remark}}</p>
        </div>
        <p style="text-align:center;padding-top:20px">
          <el-button type="primary" @click="goback">返回</el-button>
        </p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      shopmsg: {},
      amount: "",
      bankTitle: "",
      completeTime: "",
      initTime: "",
      remark: "",
      cashstatus:''
    };
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
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

          if (res.data.sub_code == "SUCCESS") {
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //   useraccount(){

    //    this.req
    //     .post("/shop/useraccount")
    //     .then(res => {
    //       console.log(res);
    //    this.userdata = res.data.data
    //       if (res.data.sub_code == "SUCCESS") {

    //       } else {
    //         this.$message.error(res.data.sub_msg);

    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    goback(){
      this.$router.push("/assetsmanagement");
    }
  },
  created() {
    this.getshopmsg();
    this.active = Number(this.$route.query.cashstatus)+1;
    this.amount = this.$route.query.amount;
    this.bankTitle = this.$route.query.bankTitle;
    this.completeTime = this.$route.query.completeTime;
    this.initTime = this.$route.query.initTime;
    this.remark = this.$route.query.remark;
    this.cashstatus = this.$route.query.cashstatus;
    console.log(this.active);
  }
};
</script>
<style scoped>
</style>
