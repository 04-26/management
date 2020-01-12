<template>
  <div>
    <el-form ref="disform" :rules="rules" :model="disform" label-width="150px">
      <el-card shadow="never" class="box-card">
        <div slot="header" class="clearfix">
          <span>会员卡列表/创建折扣卡</span>
        </div>
        <div>
          <el-row style="display:flex;justify-content: space-around;">
            <el-col :span="9">
              <el-card shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>折扣卡样式</span>
                </div>
                <div>
                  <!-- 卡片列表 右边-->
                  <div class="card-list">
                    <div style="background:#a1a1a1" class="card-style">
                      <p class="card-item">折扣卡</p>
                      <p class="card-bottom">
                        <span class="card-item">推拿旗舰店</span>
                        <span class="card-item">限量一百张</span>
                      </p>
                    </div>
                  </div>
                  <div
                    style="display:flex;justify-content: space-around;margin:10px;align-items: center;"
                  >
                    <el-radio-group v-model="disform.style">
                      <el-radio label="1">永恒经典</el-radio>
                    </el-radio-group>

                    <p style="font-size:14px;">
                      <span>用户端展示效果：</span>
                      <span>示例</span>
                    </p>
                  </div>
                  <div class="card-list">
                    <div class="card-style">
                      <p class="card-item">折扣卡</p>
                      <p class="card-bottom">
                        <span class="card-item">推拿旗舰店</span>
                        <span class="card-item">限量一百张</span>
                      </p>
                    </div>
                  </div>
                  <div
                    style="display:flex;justify-content: space-around;margin:10px;align-items: center;"
                  >
                    <el-radio-group v-model="disform.style">
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
                    <el-form-item label="折扣卡名称：" prop="title">
                      <el-input placeholder="请输入折扣卡名称" class="w50" v-model="disform.title"></el-input>
                    </el-form-item>
                    <el-form-item label="售价：" prop="amount">
                      <el-input placeholder="输入折扣价售价" class="w50" type="text" v-model="disform.amount"></el-input>
                    </el-form-item>
                    <el-form-item label="服务：">
                      <el-radio-group v-model="changetype">
                        <el-radio label="1">选择服务折扣</el-radio>
                        <el-radio label="2">全场折扣</el-radio>
                      </el-radio-group>
                      <div v-if="this.changetype=='1'">
                        <el-table
                          :data="options"
                          border
                          class="table"
                          ref="multipleTable"
                          style="width: 500px"
                          @selection-change="handleSelectionChange"
                        >
                          <el-table-column prop="title" label="服务项目名称"></el-table-column>
                          <el-table-column prop="price" label="服务项目价格"></el-table-column>
                          <el-table-column label="折扣（1~9.9折）">
                            <template slot-scope="scope">
                              <el-input
                                type="number"
                                @mousewheel.native.prevent
                                v-model="scope.row.discount"
                              ></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column type="selection"></el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <div style="margin-top: 20px">
                          <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[1, 3, 5, 10, 30]"
                            :page-size="5"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                          ></el-pagination>
                        </div>
                      </div>
                      <span style="padding-left:10px" v-if="this.changetype=='2'">
                        
                        <el-input
                        size="mini"
                        type="number"
                        style="width:100px"
                        v-model="disform.amountFree"
                        @mousewheel.native.prevent
                      ></el-input>折
                        </span>
                      <!-- 
                    <div style="display:flex;padding-top:10px">
                      <el-form-item label="批量设置">
                      </el-form-item>
                      <el-form-item style="padding-left:10px;">
                        <el-button type="primary" @click="settimes">确定</el-button>
                      </el-form-item>
                      </div>-->
                    </el-form-item>
                    <el-form-item label="有效期：" prop="valid">
                      <!-- <el-radio-group v-model="form.valid">
                        <el-radio label="0">永久有效</el-radio>
                      </el-radio-group>-->
                      <el-input class="w50" v-model="disform.valid" placeholder="自定义有效期天数"></el-input>
                      <p style="color:#606266;font-size:12px">请输入折扣卡有效期，0为永久有效，大于0为有效天数</p>
                    </el-form-item>
                    <el-form-item label="上架状态：">
                      <el-radio-group v-model="disform.onsell">
                        <el-radio label="0">下架</el-radio>
                        <el-radio label="1">上架</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发放张数：" prop="quantity">
                      <el-input class="w50" v-model="disform.quantity" placeholder="请填写1-100的整数"></el-input>张
                    </el-form-item>
                    <el-form-item label="已售数量：" prop="issuance">
                      <el-input class="w50" v-model="disform.issuance" placeholder="（选填）请填写2-100的整数"></el-input>张
                    </el-form-item>
                    <el-form-item label="活动说明：" prop="description">
                      <el-input
                        maxlength="100"
                        show-word-limit
                        type="textarea"
                        :rows="4"
                        v-model="disform.description"
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitcard">确定</el-button>
                      <el-button>取消</el-button>
                    </el-form-item>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-form>
    <!-- Form -->
    <el-dialog title="选择服务" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="按类型查找：">
          <el-select v-model="formInline.region" placeholder="所有分类">
            <el-option v-for="(item,i) in options" :key="i" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
          <el-table-column prop="address" label="售价（元）" show-overflow-tooltip></el-table-column>
          <el-table-column type="selection" width="55" label="全选"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      disform: {
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
        onsell: "", //上架状态
        goods: [
          // {
          //   vipCardStroeId: "", //会员卡id
          //   massageid: "", //项目id
          //   massageTitle: "", //项目名 称
          //   massageImg: "", //项目图片
          //   massagePrice: "", //金额
          //   discount: "", //折扣
          //   discount: "", //次数
          //   freeMassage: ""
          // } //是否为赠品
        ]
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
      changetype: "",
      changearr: "",
      changearr1: "",
      rules: {
        title: [
          {
            required: true,
            message: "请输入折扣卡名称",
            trigger: "blur"
          },
          {
            type: "string",
            max: 12,
            message: "折扣卡名称不能超过12个字符",
            trigger: "blur"
          }
        ],
        amount: [
          { required: true, message: "请输入折扣卡售价", trigger: "blur" }
        ],
        valid: [
          { required: true, message: "请输入折扣卡有效期", trigger: "blur" }
        ],
        onsell: [
          { required: true, message: "请选择折扣卡上架状态", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "请输入折扣卡发放张数", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入折扣卡活动说明", trigger: "blur" }
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
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
    },
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
      this.disform = {
        name: item.name,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },
    submitcard() {
      // this.form.goods.map(item=>{
      //   console.log(item)
      // })
      this.$refs.disform.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          let params = {
            title: this.disform.title, //卡券名称
            style: this.disform.style, //卡券样式
            kind: "1", //卡券类别
            amount: this.disform.amount, //销售价格
            amountFree: this.disform.amountFree, //赠送金额或者原价
            valid: this.disform.valid, //有效期
            quantity: this.disform.quantity, //发放张数
            issuance: this.disform.issuance, //已发量
            description: this.disform.description, //活动说明
            onsell: this.disform.onsell //上架状态
          };
          // var itemArr =[]
          // this.form.goods = this.changearr1.concat(this.changearr);
          if (this.disform.goods != "") {
            var isDiscount = false;
            for (let i = 0; i < this.disform.goods.length; i++) {
              params["goods[" + i + "].massageId"] = this.disform.goods[i].id;
              params["goods[" + i + "].massageTitle"] = this.disform.goods[i].title;
              params["goods[" + i + "].massageImg"] = this.disform.goods[i].imageUrl;
              params["goods[" + i + "].massagePrice"] = this.disform.goods[i].price;
              params["goods[" + i + "].discount"] = this.disform.goods[i].discount;
              params["goods[" + i + "].freeMassage"] = this.disform.goods[i].freeMassage;
              if(!this.disform.goods[i].discount){
                isDiscount = true;
                break;
              }
            }
            if(isDiscount){
              this.$message.error('服务项目的折扣还没填写')
              return ;
            }
          }
          
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
    },
    getmangageitem() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.req
        .post("/massage/list", params)
        .then(res => {
          console.log(res);
          this.options = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(this.options);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getitem() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize1
      };
      this.req
        .post("/massage/list", params)
        .then(res => {
          console.log(res);
          this.options1 = res.data.data.resultList;
          this.total1 = res.data.data.totalCount;
          console.log(this.options);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      val.map(item => {
        item["freeMassage"] = 0;
      });
      this.disform.goods = this.disform.goods.concat(val);
      this.disform.goods = this.unique(this.disform.goods);

      console.log(this.disform.goods);
    },

    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getmangageitem(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getmangageitem(); // 调用分页函数
    },
    handSize(val) {
      // 当每页显示条数改变
      this.pageSize1 = val;
      this.getitem(); // 调用分页函数
    },
    handCount(val) {
      // 当前页码改变
      this.currentPage1 = val;
      this.getitem(); // 调用分页函数
    }
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    }
  },
  created() {
    this.getmangageitem();
    this.getitem();
  }
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