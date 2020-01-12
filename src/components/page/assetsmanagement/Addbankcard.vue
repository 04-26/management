<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资金提现/添加银行卡</span>
      </div>
      <div>
        <div style="width:500px;background:#f8f8f8;margin:0 auto;padding:20px;border-radius:15px;">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="绑定个人账户" name="first">
              <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                <el-form-item label="持卡人：">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码：">
                  <el-input v-model="formLabelAlign.cardNo"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号：">
                  <el-input v-model="formLabelAlign.bankcard"></el-input>
                </el-form-item>
                <el-form-item label="银行：">
                  <el-select v-model="formLabelAlign.bankName" placeholder="请选择所属银行">
                    <el-option
                      v-for="(item,i) in options"
                      :key="i"
                      :label="item.title"
                      :value="item.title"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="手机号：">
                  <el-input v-model="formLabelAlign.mobile"></el-input>
                </el-form-item>
                <!-- <el-form-item label="手机验证码：">
                  <el-input type="text" v-model="formLabelAlign.smsCode" placeholder="验证码"></el-input>
                  <el-button style="margin-top:10px" @click="getCode(form)" :disabled="!show">
                    <span v-show="show">获取验证码</span>
                    <span v-show="!show" class="count">{{count}} s</span>
                  </el-button>
                </el-form-item>-->
                <el-form-item prop="type1">
                  <el-checkbox v-model="formLabelAlign.type1" label="已阅读用户协议" name="type"></el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button style="margin-top:10px" @click="addbankcard">提交</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="绑定对公账户" name="second">
              <el-form :label-position="labelPosition" label-width="100px" :model="formLabel">
                <el-form-item label="法人姓名：">
                  <el-input v-model="formLabel.name"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码：">
                  <el-input v-model="formLabel.cardNo"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号：">
                  <el-input v-model="formLabel.bankcard"></el-input>
                </el-form-item>
                <el-form-item label="银行：">
                  <el-select v-model="formLabel.bankName" placeholder="请选择所属银行">
                    <el-option
                      v-for="(item,i) in options"
                      :key="i"
                      :label="item.title"
                      :value="item.title"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="手机号：">
                  <el-input v-model="formLabel.mobile"></el-input>
                </el-form-item>
                <!-- <el-form-item label="手机验证码：">
                  <el-input type="text" v-model="formLabelAlign.smsCode" placeholder="验证码"></el-input>
                  <el-button style="margin-top:10px" @click="getCode(form)" :disabled="!show">
                    <span v-show="show">获取验证码</span>
                    <span v-show="!show" class="count">{{count}} s</span>
                  </el-button>
                </el-form-item>-->
                <el-form-item prop="type1">
                  <el-checkbox v-model="formLabel.type1" label="已阅读用户协议" name="type"></el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button style="margin-top:10px" @click="addbankcard2">提交</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
const TIME_COUNT = 60;

export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        bankcard: "",
        bankName: "",
        mobile: "",
        verificationcode: "",
        type: "",
        cardNo: ""
      },
      formLabel: {
        name: "",
        bankcard: "",
        bankName: "",
        mobile: "",
        verificationcode: "",
        type: "",
        cardNo: ""
      },
      timer: null,
      show: true,
      count: "",
      options: [],
      activeName: "first"
    };
  },
  methods: {
    getCode(formLabelAlign) {
      const params = {
        telphone: this.formLabelAlign.telphone,
        type: this.formLabelAlign.type
      };
      this.req
        .post("/content/smscode", params)
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
    getbanklist() {
      this.req
        .post("/bankcard/list")
        .then(res => {
          console.log(res);
          if (res.data.sub_code === "SUCCESS") {
            this.options = res.data.data;
            console.log(this.options);
            // this.$router.push('/index')
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addbankcard() {
      const params = {
        name: this.formLabelAlign.name,
        realName: this.formLabelAlign.name,
        bankcard: this.formLabelAlign.bankcard,
        bankName: this.formLabelAlign.bankName,
        mobile: this.formLabelAlign.mobile,
        depositBank: this.formLabelAlign.depositBank,
        cardNo: this.formLabelAlign.cardNo
      };
      this.req
        .post("/bankcard/save", params)
        .then(res => {
          // 接收后端返回的数据
          // let { item, reason, token, id } = res;
          console.log(res);
          // 判断
          if (res.data.sub_code == "SUCCESS") {
            this.$router.push({
              path: "/assetsmanagement"
            });
          } else {
            // 弹失败提示
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addbankcard2() {
      const params = {
        name: this.formLabel.name,
        realName: this.formLabel.name,
        bankcard: this.formLabel.bankcard,
        bankName: this.formLabel.bankName,
        mobile: this.formLabel.mobile,
        depositBank: this.formLabel.depositBank,
        cardNo: this.formLabel.cardNo
      };
      this.req
        .post("/bankcard/save", params)
        .then(res => {
          // 接收后端返回的数据
          // let { item, reason, token, id } = res;
          console.log(res);
          // 判断
          if (res.data.sub_code == "SUCCESS") {
            this.$router.push({
              path: "/assetsmanagement"
            });
          } else {
            // 弹失败提示
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClick() {}
  },
  created() {
    this.getbanklist();
  }
};
</script>
<style scoped>
</style>

