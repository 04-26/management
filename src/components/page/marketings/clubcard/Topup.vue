<template>
  <div>
    <el-form :rules="rules" ref="form" :model="form" label-width="120px">
      <el-card shadow="never" class="box-card">
        <div slot="header" class="clearfix">
          <span>会员卡列表/创建充值卡</span>
        </div>
        <div>
          <el-row style="display:flex;justify-content: space-around;">
            <el-col :span="9">
              <el-card shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>充值卡样式</span>
                </div>
                <div>
                  <!-- 卡片列表 右边-->
                  <div class="card-list">
                    <div style="background:#a1a1a1" class="card-style">
                      <p class="card-item">充值卡</p>
                      <p class="card-bottom">
                        <span class="card-item">推拿旗舰店</span>
                        <span class="card-item">限量一百张</span>
                      </p>
                    </div>
                  </div>
                  <div
                    style="display:flex;justify-content: space-around;margin:10px;align-items: center;"
                  >
                    <el-radio-group v-model="form.style">
                      <el-radio label="1">永恒经典</el-radio>
                    </el-radio-group>

                    <p style="font-size:14px;">
                      <span>用户端展示效果：</span>
                      <span>示例</span>
                    </p>
                  </div>
                  <div class="card-list">
                    <div class="card-style">
                      <p class="card-item">充值卡</p>
                      <p class="card-bottom">
                        <span class="card-item">推拿旗舰店</span>
                        <span class="card-item">限量一百张</span>
                      </p>
                    </div>
                  </div>
                  <div
                    style="display:flex;justify-content: space-around;margin:10px;align-items: center;"
                  >
                    <el-radio-group v-model="form.style">
                      <el-radio label="2">青春靓丽</el-radio>
                    </el-radio-group>

                    <p style="font-size:14px;">
                      <span>用户端展示效果：</span>
                      <span>示例</span>
                    </p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <!-- 左边 -->
            <el-col :span="14">
              <el-card shadow="never" class="box-card">
                <div>
                  <el-form-item label="充值卡名称：" prop="title">
                    <el-input class="w50" v-model="form.title" placeholder="请输入充值卡名称"></el-input>
                  </el-form-item>
                  <el-form-item label="充值金额" prop="amount">
                    <el-input class="w50" type="text" v-model="form.amount"></el-input>
                    <p style="color:#606266;font-size:12px">可支持原价购买所有服务和产品，以及次卡和折扣卡</p>
                  </el-form-item>
                  <el-form-item label="赠送金额" prop="amountFree">
                    <el-input class="w50" type="text" v-model="form.amountFree"></el-input>
                    <p style="color:#606266;font-size:12px">注意：保存后赠送金额将不可修改，请谨慎填写</p>
                  </el-form-item>
                  <el-form-item label="有效期：" prop="valid">
                    <!-- <el-radio-group v-model="form.valid"> -->
                    <!-- <el-radio label="0">永久有效</el-radio> -->
                    <!-- <el-radio label="form.valid"> -->
                    <el-input style="number" class="w50" v-model="form.valid" placeholder="请输入天数"></el-input>
                    <p style="color:#606266;font-size:12px">请输入次卡有效期，0为永久有效，大于0为有效天数</p>
                    <!-- 
                        </el-radio>
                    </el-radio-group>-->
                  </el-form-item>
                  <el-form-item label="上架状态：" prop="onsell">
                    <el-radio-group v-model="form.onsell">
                      <el-radio label="0">下架</el-radio>
                      <el-radio label="1">上架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="发放张数：" prop="quantity">
                    <el-input class="w50" v-model="form.quantity" placeholder="请填写1-100的整数"></el-input>张
                  </el-form-item>
                  <el-form-item label="已售数量：" prop="issuance">
                    <el-input class="w50" v-model="form.issuance" placeholder="（选填）请填写2-100的整数"></el-input>张
                  </el-form-item>
                  <el-form-item label="活动说明：" prop="description">
                    <el-input
                      maxlength="100"
                      show-word-limit
                      type="textarea"
                      :rows="4"
                      v-model="form.description"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitcard">确定</el-button>
                  </el-form-item>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "", //卡券名称
        style: "1", //卡券样式
        kind: "", //卡券类别
        amount: "", //销售价格
        amountFree: "", //赠送金额或者原价
        valid: "", //有效期
        quantity: "", //发放张数
        issuanceRe: "", //真实已发量
        issuance: "", //已发量
        description: "", //活动说明
        onsell: "" //上架状态
      },
      multipleSelection: [],
      multipleSelection1: [],
      formInline: {
        user: "",
        region: ""
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      idx: -1,
      options: "",
      options1: "",
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数,
      currentPage1: 1, // 当前页
      pageSize1: 3, // 每页条数
      total1: 0, // 数据总条数,
      rules: {
        title: [
          {
            required: true,
            message: "请输入充值卡名称",
            trigger: "blur"
          },
          {
            type: "string",
            max: 12,
            message: "充值卡名称不能超过12个字符",
            trigger: "blur"
          }
        ],
        amount: [
          { required: true, message: "请输入充值金额", trigger: "blur" }
        ],
        valid: [
          { required: true, message: "请输入充值卡有效期", trigger: "blur" }
        ],
        onsell: [
          { required: true, message: "请选择上架状态", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "请输入发放张数", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请填写活动说明", trigger: "blur" }
        ]
      }
    };
  },

  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },

    submitcard() {
      this.$refs.form.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          let params = {
            title: this.form.title, //卡券名称
            style: this.form.style, //卡券样式
            kind: "2", //卡券类别
            amount: this.form.amount, //销售价格
            amountFree: this.form.amountFree, //赠送金额或者原价
            valid: this.form.valid, //有效期
            quantity: this.form.quantity, //发放张数
            issuance: this.form.issuance, //已发量
            description: this.form.description, //活动说明
            onsell: this.form.onsell //上架状态
          };
          console.log(params);
          this.req
            .post("/vipcard/save", params)
            .then(res => {
              console.log(res);

              if (res.data.sub_code == "SUCCESS") {
                this.$message({
                  type: "success",
                  message: "创建成功"
                });
                this.$router.push({ path: "/membership" });
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("前端验证失败！不允许提交!");
          return false;
        }
      });
    }
  },
  created() {}
};
</script>

<style scoped>
.w50 {
  width: 50%;
}
.card-list {
  display: flex;
  justify-content: center;
}
.card-style {
  width: 450px;
  background: rgb(235, 152, 44);
  height: 230px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-item {
  display: inline-block;
  padding: 10px;
  font-size: 14px;
}
.card-bottom {
  display: flex;
  justify-content: space-between;
}
</style>