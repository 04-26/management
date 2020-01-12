<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资产管理/余额资金提现</span>
      </div>
      <div>
        <el-steps style="width:45% ;margin:0 auto" :active="active" finish-status="success">
          <el-step title="发起提现"></el-step>
          <el-step title="提现处理中"></el-step>
          <el-step title="提现成功"></el-step>
        </el-steps>
        <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
        <div>
          <p style="line-height:50px">商户名称：{{shopname}}</p>
          <p style="line-height:50px">可提现金额：{{withdrawData.amount}}元</p>
          <p style="line-height:50px">提现账户：余额账户</p>
        </div>
        <el-form ref="form" :model="form">
          <el-form-item label="本次提现金额：">
            <el-input style="width:200px" v-model="form.amount"></el-input>
            <p style="padding-left:110px">
              <span>可提现余额：¥{{withdrawData.amount}}</span>
            </p>
          </el-form-item>
          <el-form-item label="选择提现账户">
            <el-radio-group v-model="form.resource">
              <el-radio label="个人银行"></el-radio>
            </el-radio-group>
                <span style="padding:20px">{{bankData.bankTitle}}({{banknum }})</span>
                <span style="padding:10px">支持提现到个人银行记借卡</span>
                <span></span>
          </el-form-item>
          <div>
            <p>温馨提示：</p>
            <p>1、提现受理成功后，将即时到账，具体到账时间依结算卡银行而定。</p>
            <p>2、提现金额最低200元。</p>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提现</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
const TIME_COUNT = 60;
export default {
  data() {
    return {
      active: 0,
      form: {
       amount:''
      },
      timer: null,
      show: true,
      count: "",
      withdrawData: {},
      bankData: {},
      banknum:'',
      shopname:''
    };
  },

  methods: {
    getCode(form) {
      const params = {
        telphone: this.form.telphone,
        type: this.form.type
      };
      this.req
        .post("#", params)
        .then(res => {
          // 接收后端返回的数据
          // let { item, reason, token, id } = res;
          console.log(res);
          // 判断
          if (res.sub_code === "SUCCESS") {
            // 把token存入浏览器

            // 弹成功提示
            this.$message({
              type: "success",
              message: res.msg
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
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    onSubmit() {
      let params={
        amount:this.form.amount
      }
      this.req
        .post("/withdraw/apply",params)
        .then(res => {
          this.withdrawData = res.data.data;
          if (res.data.sub_code == "SUCCESS") {
            this.active = 1
          } else {
            this.$message.error(res.data.sub_msg);
          }
          this.$router.push('/assetsmanagement')
        })
        .catch(err => {
          console.log(err);
        });
    },
    useraccount() {
      this.req
        .post("/shop/useraccount")
        .then(res => {
          this.withdrawData = res.data.data;
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    withdraw() {
      this.req
        .post("/bankcard/info")
        .then(res => {
          this.bankData = res.data.data;
          this.banknum = this.bankData.bankNum.substring(this.bankData.bankNum.length-4)
          console.log(this.bankData);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.centerDialogVisible = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
     getshopmsg() {
      const params = {
        id: window.localStorage.getItem("shopid")
      };
      this.req
        .post("/store/detail", params)
        .then(res => {
          console.log(res.data.data);
            this.shopname = res.data.data.shopName

          if (res.data.sub_code == "SUCCESS") {
           
          } else {
            
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.useraccount();
    this.withdraw();
    this.getshopmsg();
  }
};
</script>
<style scoped>
</style>
