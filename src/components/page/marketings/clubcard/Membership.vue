<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>会员卡列表</span>
      </div>
      <div>
        <el-row style="display:flex;justify-content: space-between;">
          <el-col :span="4" v-for="(i,v) in cardList" :key="v">
            <router-link tag="a" :to="i.cardurl">
              <img :src="i.img" style="width:100%;">
            </router-link>
            <el-card shadow="never" :style="i.color" style="height:180px;padding:0px;" class="box-card" v-if="false">
              <div >
                <div slot="header" style="display:flex;justify-content: space-between;">
                  <span>{{i.cardname}}</span>
                  <router-link tag="a" :to="i.cardurl">
                    <el-button type="primary" icon="el-icon-plus"></el-button>
                  </router-link>
                </div>
                <div>
                  <p>{{i.cardp}}</p>
                </div>
              </div>
              
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:20px">
        <div style="display:flex;justify-content: space-between;">
          <p>
            <span>卡类型：</span>
            <el-button class="type-item" @click="getData('')">全部</el-button>
            <el-button class="type-item" @click="getData(0)">次数卡</el-button>
            <el-button class="type-item" @click="getData(1)">折扣卡</el-button>
            <el-button class="type-item" @click="getData(2)">充值卡</el-button>
          </p>
          <div>
            <el-input type="text" v-model="keywords" style="width:200px"></el-input>
            <el-button class="editor-btn" type="primary" @click="getData('')">搜索</el-button>
          </div>
        </div>
        <div style="margin-top:20px;">
          <el-table :data="tableData" border class="table" ref="tableData">
            <el-table-column width="200" label="卡型">
              <template slot-scope="scope">
                <div style="display:flex;">
                  <img
                    style="width:50px;height:50px;"
                    :src="$imgurl()+scope.row.cardImageUrl"
                    alt="#"
                  />
                  <p style="line-height:50px;padding-left:10px">{{scope.row.title}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="售价 "></el-table-column>
            <el-table-column prop="quantity" label="发放量"></el-table-column>
            <el-table-column prop="issuanceReal" label="总销量（张）"></el-table-column>
            <el-table-column prop="valid" label="有效期" :formatter="formatter">
              <template slot-scope="scope">
                <p v-if="scope.row.valid=='0'">永久</p>
                <p v-if="scope.row.valid>0">{{scope.row.valid}}天</p>
              </template>
            </el-table-column>
            <el-table-column prop="onsell" label="状态" :formatter="formatter">
              <template slot-scope="scope">
                <p v-if="scope.row.onsell=='1'">上架</p>
                <p v-if="scope.row.onsell=='0'">下架</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="320" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="red"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button @click="gomemberdetail(scope.$index, scope.row)">详情</el-button>
                <el-button
                  type="success"
                  @click="putaway(scope.$index, scope.row,onsellnum='0')"
                  v-if="scope.row.onsell==true"
                >项目下架</el-button>
                <el-button
                  type="success"
                  @click="putaway(scope.$index, scope.row,onsellnum='1')"
                  v-if="scope.row.onsell==false"
                >项目上架</el-button>
                <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div style="margin-top: 20px;text-align:center">
            <el-pagination
              @size-change="handleSizeC"
              @current-change="handCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 3, 5, 10, 30]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 会员卡编辑 -->
    <el-dialog title="会员卡编辑" width="70%" :visible.sync="editVisible">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="卡样式：" prop="style">
          <el-radio-group v-model="form.style">
            <el-radio label="1">永恒经典</el-radio>
            <el-radio label="2">青春靓丽</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.kind=='0'" label="次卡名称：" prop="title">
          <el-input style="width:250px" placeholder="输入次卡名称" class="w50" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item v-if="form.kind=='1'" label="折扣卡名称：" prop="title">
          <el-input style="width:250px" placeholder="输入折扣卡名称" class="w50" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item v-if="form.kind=='2'" label="充值卡名称：" prop="title">
          <el-input style="width:250px" placeholder="输入充值卡名称" class="w50" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item v-if="form.kind=='0'||form.kind=='1'" label="售价：" prop="amount">
          <el-input
            style="width:250px"
            placeholder="输入次卡售价"
            class="w50"
            type="text"
            v-model="form.amount"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="form.kind=='0'" label="服务：">
          <el-button type="text" @click="changeitem=>{dialogFormVisible = true;} ">选择服务</el-button>
          <el-table
            :data="optiongoods"
            border
            class="table"
            ref="optiongoods"
            style="width: 100%"
            v-if="form.kind=='0'"
          >
            <el-table-column prop="massageTitle" label="服务项目名称"></el-table-column>
            <el-table-column label="次数">
              <template slot-scope="scope">
                <el-input
                  @mousewheel.native.prevent
                  placeholder="输入服务项目次数"
                  type="number"
                  v-model="scope.row.useTimes"
                ></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" class="red" @click="deimsg(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="form.kind=='1'" label="服务：">
          <p>
            <el-radio-group v-model="changetype">
              <el-radio label="1">选择服务折扣</el-radio>
              <el-radio label="2">全场折扣</el-radio>
            </el-radio-group>
            <span v-if="this.changetype=='2'">
              <el-input
                type="number"
                style="width:100px"
                v-model="form.amountFree"
                @mousewheel.native.prevent
              ></el-input>折
            </span>
          </p>
          <div v-if="this.changetype=='1'">
            <p>
              <el-button type="text" @click="dialogFormVisible = true">选择服务</el-button>
            </p>
            <el-table
              :data="optiongoods"
              border
              class="table"
              ref="optiongoods"
              style="width: 100%"
              v-if="form.kind=='1'"
            >
              <el-table-column prop="massageTitle" label="服务项目名称"></el-table-column>
              <el-table-column label="折扣（1~9.9折）">
                <template slot-scope="scope">
                  <el-input
                    @mousewheel.native.prevent
                    placeholder="输入服务项目折扣"
                    type="number"
                    v-model="scope.row.discount"
                  ></el-input>
                </template>
              </el-table-column>
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" class="red" @click="deimsg(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-table
              :data="options"
              border
              class="table"
              ref="multipleTable"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column prop="title" label="服务项目名称"></el-table-column>
              <el-table-column label="折扣（1~9.9折）">
                <template slot-scope="scope">
                  <el-input type="number" @mousewheel.native.prevent v-model="scope.row.discount"></el-input>
                </template>
              </el-table-column>
              <el-table-column type="selection"></el-table-column>
            </el-table>
           
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
            </div>-->
          </div>

          <!-- 
                    <div style="display:flex;padding-top:10px">
                      <el-form-item label="批量设置">
                      </el-form-item>
                      <el-form-item style="padding-left:10px;">
                        <el-button type="primary" @click="settimes">确定</el-button>
                      </el-form-item>
          </div>-->
        </el-form-item>
        <el-form-item v-if="form.kind=='0'" label="赠送：">
          <el-button type="text" @click="dialogFormV = true">选择赠送服务</el-button>
          <el-table
            :data="optiong"
            border
            class="table"
            ref="optiong"
            style="width: 100%"
            v-if="form.kind=='0'"
          >
            <el-table-column prop="massageTitle" label="服务项目名称"></el-table-column>
            <el-table-column label="次数">
              <template slot-scope="scope">
                <el-input
                  @mousewheel.native.prevent
                  placeholder="输入服务项目次数"
                  type="number"
                  v-model="scope.row.useTimes"
                ></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" class="red" @click="deimsg1(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="有效期：" prop="valid">
          <!-- <el-radio-group v-model="form.valid"> -->
          <!-- <el-radio label="0">永久有效</el-radio> -->
          <el-input
            @mousewheel.native.prevent
            style="width:250px"
            class="w50"
            type="number"
            v-model="form.valid"
            placeholder="请输入天数"
          ></el-input>
          <p style="color:#606266">请输入次卡有效期，0为永久有效，大于0为有效天数</p>
          <!-- </el-radio-group> -->
        </el-form-item>
        <el-form-item label="发放张数：" prop="quantity">
          <el-input
            style="width:250px"
            class="w50"
            v-model="form.quantity"
            placeholder="请填写2-100的整数"
          ></el-input>张
        </el-form-item>
        <el-form-item label="已售数量：" prop="issuance">
          <el-input
            style="width:250px"
            class="w50"
            v-model="form.issuance"
            placeholder="（选填）请填写2-100的整数"
          ></el-input>张
        </el-form-item>
        <el-form-item label="活动说明：" prop="description">
          <el-input show-word-limit maxlength="200" type="textarea" :rows="4" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择服务" :visible.sync="dialogFormVisible">
      <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="按类型查找：">
          <el-select v-model="formInline.region" placeholder="所有分类">
            <el-option v-for="(item,i) in options" :key="i" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>-->
      <div>
        <el-table
          :data="options"
          border
          class="table"
          ref="options"
          style="width: 100%"
          :header-row-style="{background:'#ee5002'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="title" label="服务项目名称" ></el-table-column>
          <el-table-column type="selection" label="全选"></el-table-column>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getAll()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择赠送服务" :visible.sync="dialogFormV">
      <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="按类型查找：">
          <el-select v-model="formInline.region" placeholder="所有分类">
            <el-option v-for="(item,i) in options" :key="i" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>-->
      <div>
        <el-table
          :data="optionsa"
          border
          class="table"
          ref="optionsa"
          style="width: 100%"
          @selection-change="leSelectionChange1"
        >
          <el-table-column prop="title" label="服务项目名称"></el-table-column>
          <el-table-column type="selection"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top: 20px">
          <el-pagination
            @size-change="handSize"
            @current-change="handCount"
            :current-page="currentPage1"
            :page-sizes="[1, 3, 5, 10, 30]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormV = false">取 消</el-button>
        <el-button type="primary" @click="getbAll()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: "draglist",
  data() {
    return {
      changetype: "",
      cardList: [
        {
          cardname: "创建次卡",
          cardurl: "/timecard",
          cardp: "创建多项服务的有限次数的次卡",
          color: "border-bottom:10px yellow solid;",
          img:require("@/assets/img/num.png"),
        },
        {
          cardname: "创建折扣卡",
          cardurl: "/discount",
          cardp: "支持对全店服务或单个服务进行打折设置",
          color: "border-bottom:10px skyblue solid;",
          img:require("@/assets/img/coupon.png"),
        },
        {
          cardname: "创建充值卡",
          cardurl: "/topup",
          cardp: "支持带有赠送次数和折扣特权的充值卡",
          color: "border-bottom:10px red solid;",
          img:require("@/assets/img/money.png"),
        }
      ],
      cardtype: ["全部", "充值卡", "次卡", "折扣卡"],
      url: "./vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelectionqw: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,

      idx: -1,
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      keywords: "",
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
        onsell: "", //上架状态
        goods: {}
      },
      multipleSelection: [],
      multipleSelection1: [],
      formInline: {
        user: "",
        region: ""
      },
      dialogTableVisible: false,
      dialogTableV: false,
      dialogFormVisible: false,
      dialogFormV: false,
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
      options: [],
      optionsa: [],
      optiongoods: [],
      options1: [],
      optiong: [],
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数,
      currentPage1: 1, // 当前页
      pageSize1: 3, // 每页条数
      total1: 0, // 数据总条数,
      changearr: [],
      change: [],
      idcard: ""
    };
  },

  computed: {},
  methods: {
    // 获取 easy-mock 的模拟数据
    getData(i) {
      let params;
      if (this.keywords == "") {
        params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          kind: i
        };
      } else {
        params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          keywords: this.keywords
        };
      }
      this.req
        .post("/vipcard/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;

          console.log(this.tableData);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeC(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getData(); // 调用分页函数
    },
    handCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getData(); // 调用分页函数
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
      console.log(row);
      this.idx = index;
      const item = this.tableData[index];
      this.form = row;
      this.idcard = row.id;
      this.editVisible = true;
      let params = {
        cardId: row.id
      };
      this.req
        .post("/vipcard/edit", params)
        .then(res => {
          console.log(res);
          if (res.data.data.kind == "1") {
            this.optiongoods = res.data.data.goods;
          } else {
            this.optiongoods = res.data.data.goods.filter(
              item => +item.freeMassage == 0
            );
            this.optiong = res.data.data.goods.filter(
              item => +item.freeMassage == 1
            );
            this.optiong.map(item => {
              item["useTimea"] = item.useTimes;
            });
          }
          console.log(this.optiongoods, this.optiong);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleDelete(index, row) {
      this.$confirm("该操作将永久删除会员卡，关联的拼团砍价活动用户也将无法购买，确定删除此会员卡吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let params = {
            cardId: row.id
          };
          this.req.post("/vipcard/update/del", params).then(res => {
              console.log(res);
              if (res.data.sub_code == "SUCCESS") {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getData();
              } else {
                this.$message.error(res.data.sub_msg);
              }
            }).catch(err => {
              console.log(err);
            });
          this.$message({ type: "success", message: "删除成功!"});
      }).catch(() => {});
    },
    /* delAll() {
                const length = this.multipleSelectionqw.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelectionqw);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelectionqw[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelectionqw = [];
            }, */
    // 保存编辑
    saveEdit() {
      console.log(this.optiongoods, this.optiong);
      this.form.goods = this.optiongoods.concat(this.optiong);
      console.log(this.form.goods);
      var params = {
        title: this.form.title, //卡券名称
        style: this.form.style, //卡券样式
        kind: this.form.kind, //卡券类别
        amount: this.form.amount, //销售价格
        amountFree: this.form.amountFree, //赠送金额或者原价
        valid: this.form.valid, //有效期
        quantity: this.form.quantity, //发放张数
        issuance: this.form.issuance, //已发量
        description: this.form.description, //活动说明
        onsell: this.form.onsell, //上架状态
        id: this.idcard
      };

      for (let i = 0; i < this.form.goods.length; i++) {
        if(this.form.goods[i].massageId){
          params["goods[" + i + "].massageId"] = this.form.goods[i].massageId;
        }else{
          params["goods[" + i + "].massageId"] = this.form.goods[i].ida;
        }
        params["goods[" + i + "].massageTitle"] = this.form.goods[i].title;
        params["goods[" + i + "].massageImg"] = this.form.goods[i].imageUrl;
        params["goods[" + i + "].massagePrice"] = this.form.goods[i].price;
        params["goods[" + i + "].useTimes"] = this.form.goods[i].useTimes;
        params["goods[" + i + "].freeMassage"] = this.form.goods[i].freeMassage;
        if(!this.form.goods[i].ida){
          params["goods[" + i + "].id"] = this.form.goods[i].id;
        }else{
          params["goods[" + i + "].id"] = null;
        }
        params["goods[" + i + "].discount"] = this.form.goods[i].discount;
      }
      this.req
        .post("/vipcard/save", params)
        .then(res => {
          console.log(res);

          if (res.data.sub_code == "SUCCESS") {
            this.editVisible = false;
            this.$message({
              type: "success",
              message: "编辑成功"
            });
            this.$router.push({ path: "/membership" });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上下架
    putaway(index, row, onsellnum) {
      let params = {
        cardId: row.id,
        onsell: onsellnum
      };
      this.req
        .post("/vipcard/update/onsell", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getData();
            this.$message({
              type: "success",
              message: "成功"
            });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getmangageitem() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        flag: true
      };
      this.req
        .post("/massage/list", params)
        .then(res => {
          console.log(res);
          console.log(this.options);
          if (res.data.sub_code == "SUCCESS") {
            this.options = res.data.data.resultList;
            this.options.goods = [];
            this.optionsa = res.data.data.resultList;
            this.total = res.data.data.totalCount;
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
          this.options1.goods = [];
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
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.ida) && res.set(arr.ida, 1));
    },
    unique1(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.ides) && res.set(arr.ides, 1));
    },
    handleSelectionChange(val) {
      let tearr = [];
      // val.map(item => {
      //   // item["goodsId"] = val.id;
      //   item["freeMassage"] = 0;
      //   item["massageTitle"] = item.title;
      //   item["ida"] = item.id;
      //   item.id = "";
      //   return tearr.push(item);
      // });
      val.forEach((item, index) => {
        // item["goodsId"] = val.id;
        item["freeMassage"] = 0;
        item["massageTitle"] = item.title;
        item["ida"] = item.id;
        // item.id = "";
      });
      this.changearr = val;
      // this.changearr = this.unique(this.changearr);
      console.log(this.changearr);

    },
    //      selectCancel(selection, row){
    //        var index = this.optiongoods.findIndex(item =>{
    // 　　　　　　　　　　if(item.id==row.id){
    // 　　　　　　　　　　　　return true
    // 　　　　　　　　　　}
    // 　　　　　　　　})
    // console.log(index)
    // 　　　　　　　　this.optiongoods(index,1)
    //      },

    leSelectionChange1(val) {
      let temArr = [];
      // val.map((item, i) => {
      //   item["freeMassage"] = 1;

      //   item["massageTitle"] = item.title;
      //   item["ida"] = item.id;
      //   item.id = "";
      //   item["ides"] = i;

      //   return temArr.push(item);
      // });
      val.forEach((item,index)=>{
        item["freeMassage"] = 1;
        item["massageTitle"] = item.title;
        item["ida"] = item.id;
        // item.id = "";
        item["ides"] = i;
      })
      this.change = val;
      //  this.change =  this.unique1(this.change)
      // this.change = this.unique(this.change);

      console.log(this.change);
    },
    getAll() {
      var ishas = false; //判断是否已经存在
      this.optiongoods.forEach(item=>{
        var gindex = _.findIndex(this.changearr,(o)=>{return o.id==item.massageId || o.id==item.ida});
        if(gindex!=-1){
          this.$message.error('选择项目已经存在,请重新选择');
          // this.changearr.shift(gindex,1);
          ishas = true
          return ;
        }
      })
      if(ishas){
        return ;
      }
      this.optiongoods = this.optiongoods.concat(this.changearr);
      // this.optiongoods = this.unique(this.optiongoods);
      this.optiongoods.map(item => {});
      console.log(this.optiongoods);
      this.dialogFormVisible = false;
      this.changearr = []
      this.$refs['options'].clearSelection()
    },
    getbAll() {
      var ishas = false; //判断是否已经存在
      this.optiong.forEach(item=>{
        var gindex = _.findIndex(this.change,(o)=>{return o.id==item.massageId || o.id==item.ida});
        if(gindex!=-1){
          this.$message.error('选择项目已经存在,请重新选择');
          // this.changearr.shift(gindex,1);
          ishas = true
          return ;
        }
      })
      if(ishas){
        return ;
      }
      this.optiong = this.optiong.concat(this.change);
      this.optiong.map(item => {});
      console.log(this.optiong);
      // this.optiong = this.unique(this.optiong);
      this.dialogFormV = false;
      this.change = [];
      this.$refs['optionsa'].clearSelection()
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
    },
    gomemberdetail(index, row) {
      console.log(row);
      this.$router.push({
        name: "carddetail",
        query: {
          cardId: row.id
        }
      });
    },
    deimsg(index, row) {
      if (row.vipCardStroeId) {
        let params = {
          cardId: row.vipCardStroeId,
          goodsId: row.id
        };
        this.req
          .post("/vipcard/update/goods/del", params)
          .then(res => {
            this.req
              .post("/vipcard/edit", params)
              .then(res => {
                console.log(res);
                this.optiongoods = res.data.data.goods.filter(
                  item => +item.freeMassage == 0
                );
                this.optiong = res.data.data.goods.filter(
                  item => +item.freeMassage == 1
                );
                this.optiong.map(item => {
                  item["useTimea"] = item.useTimes;
                });
                console.log(this.optiongoods, this.optiong);
                if (res.data.sub_code == "SUCCESS") {
                } else {
                  this.$message.error(res.data.sub_msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
            if (res.data.sub_code == "SUCCESS") {
            } else {
              this.$message.error(res.data.sub_msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.optiongoods.splice(index, 1);
      }
    },
    deimsg1(index, row) {
      if (row.vipCardStroeId) {
        let params = {
          cardId: row.vipCardStroeId,
          goodsId: row.id
        };
        this.req
          .post("/vipcard/update/goods/del", params)
          .then(res => {
            this.req
              .post("/vipcard/edit", params)
              .then(res => {
                console.log(res);
                this.optiongoods = res.data.data.goods.filter(
                  item => +item.freeMassage == 0
                );
                this.optiong = res.data.data.goods.filter(
                  item => +item.freeMassage == 1
                );
                console.log(this.optiongoods, this.optiong);
                if (res.data.sub_code == "SUCCESS") {
                } else {
                  this.$message.error(res.data.sub_msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
            if (res.data.sub_code == "SUCCESS") {
            } else {
              this.$message.error(res.data.sub_msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.optiong.splice(index, 1);
      }
    }
  },
  created() {
    this.getData();
    this.getmangageitem();
    this.getitem();
  },
  mounted() {
    this.getData();
    this.getmangageitem();
    this.getitem();
  },
  activated() {
    this.getData();
    this.getmangageitem();
    this.getitem();
  }
};
</script>
<style scoped>
* {
  list-style: none;
}
.type-item {
  background: #f8f8f8;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
}
</style>
