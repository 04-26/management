<template>
  <div>
    <el-card  shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资产管理/充值卡资金提现</span>
      </div>
      <div>
        <div>
          <p>商户名称：小顺子推拿旗舰店</p>
          <p>可提现金额：1232.34元</p>
          <p>提现账户：余额账户</p>
        </div>
        <el-form ref="form" :model="form" label-width="180px">
          <el-form-item label="活动名称">
            <el-input style="width:200px" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="选择提现账户">
            <el-radio-group v-model="form.resource">
              <el-radio label="个人银行"></el-radio>
              <el-radio label="对公银行账户"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input show-word-limit maxlength="200" type="textarea" :rows="4" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="text" v-model="form.verificationcode" placeholder="验证码"></el-input>
            <el-button @click="getCode(form)" :disabled="!show">
              <span v-show="show">获取验证码</span>
              <span v-show="!show" class="count">{{count}} s</span>
            </el-button>
          </el-form-item>
          <div>
            <p>温馨提示：</p>
            <p>1、提现受理成功后，将即时到账，具体到账时间依结算卡银行而定。</p>
            <p>2、提现金额最低200元。</p>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
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
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        verificationcode: ""
      },
      timer: null,
      show: true,
      count: ""
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
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style scoped>
</style>
