<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>会员详情</span>
      </div>
      <div>
        <div style="display: flex;width:100%;">
          <div style="display:flex;">
            <div>
              <img
                style="width:50px;height:50px;border-radius:50%"
                :src="this.$route.query.avatar|avatar"
                alt
              />
            </div>
            <div>
              <p>{{this.$route.query.nick}}</p>
              <p>{{this.$route.query.telphone}}</p>
            </div>
          </div>
          <div style="padding-left:20px">
            <p>生日：{{this.$route.query.birthDate}}</p>
            <p>性别：{{this.$route.query.sexStr}}</p>
          </div>
          <p  style="padding-left:20px">地址：{{this.$route.query.regionName}}</p>
        </div>
        <p>最近访问日期{{this.$route.query.recentVisitTime}}</p>
        <p>
          钱包余额：{{this.$route.query.accountAmount}}
          
          <!-- <span style="padding-left:20px">

          本金：{{this.$route.query.amountOrigin}}
          </span> -->
          <!-- <span style="padding-left:20px">

          赠额：{{this.$route.query.amountOrigin}}
          </span>
        </p>
        <p>累计消费：{{this.$route.query.totalConsumption}}</p> -->
        <p>
          购买会员卡（张数）{{this.$route.query.cardCount}}
          <el-button style="font-size:16px" type="text" size="big" @click="examineMember">查看</el-button>
        </p>
        <!-- <p>消费次数</p> -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="订单记录" name="first">
            <el-table
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column label="商品" width="300">
                <template slot-scope="scope">
                  <p style="margin-left: 10px">订单号：{{ scope.row.skuList[0].orderNo }}</p>

                  <div style="display:flex;">
                    <!-- <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="`/img/${scope.row.skuList[0].imgurl}`"
                      alt="#"
                    >-->
                    <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="$imgurl()+scope.row.skuList[0].imgurl"
                      alt
                    />
                    <div style="flex-direction: column;">
                      <span style="margin-left: 10px">{{ scope.row.skuList[0].productName}}</span>
                      <p v-if="scope.row.skuList[0].productName!='优惠买单'">
                        <span style="margin-left: 10px">￥{{ scope.row.skuList[0].price}}</span>
                        <span style="margin-left: 10px">x{{ scope.row.skuList[0].quantity}}</span>
                      </p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="150" label="手艺人">
                <template slot-scope="scope">{{ scope.row.userWorker.userName }}</template>
              </el-table-column>
              <el-table-column width="300" label="顾客信息">
                <template slot-scope="scope">
                  <p v-if="scope.row.bookTime!=undefined">预约到店时间：{{ scope.row.bookTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                  <p v-if="scope.row.bookTime==undefined">预约到店时间：--</p>
                  <div style="display:flex">
                    <!-- <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="scope.row.userinfo.avatar"
                      alt="#"
                    >-->
                    <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="scope.row.userinfo.avatar|avatar"
                      alt
                    />
                    <div>
                      <p style="margin-left: 10px">{{ scope.row.userinfo.nick }}</p>
                      <p style="margin-left: 10px">{{ scope.row.userinfo.telphone }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="200" label="实付金额(元)">
                <template slot-scope="scope">
                  <p style="margin-left: 10px">{{scope.row.payAmount }}</p>
                  <p v-if="scope.row.paymentId=='0'">到店支付</p>
                  <p v-if="scope.row.paymentId=='1'">微信支付</p>
                  <p v-if="scope.row.paymentId=='2'">钱包支付</p>
                  <p v-if="scope.row.paymentId=='3'">会员卡支付</p>
                  <p v-if="scope.row.paymentId=='4'">会员卡支付</p>
                </template>
              </el-table-column>
              <el-table-column width="200" label=" 订单状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.orderStatus==-2" style="margin-left: 10px">已取消</span>
                  <span v-if="scope.row.orderStatus==1" style="margin-left: 10px">待支付</span>
                  <span v-if="scope.row.orderStatus==2" style="margin-left: 10px">已支付</span>
                  <span v-if="scope.row.orderStatus==3" style="margin-left: 10px">已预约</span>
                  <span v-if="scope.row.orderStatus==4" style="margin-left: 10px">待服务</span>
                  <span v-if="scope.row.orderStatus==5" style="margin-left: 10px">服务中</span>
                  <span v-if="scope.row.orderStatus==6" style="margin-left: 10px">服务完成</span>
                  <span v-if="scope.row.orderStatus==7" style="margin-left: 10px">申请退款</span>
                  <span v-if="scope.row.orderStatus==8" style="margin-left: 10px">已完成</span>
                  <span v-if="scope.row.orderStatus==-1" style="margin-left: 10px">已取消</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <p>下单时间：{{scope.row.initTime |dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="orderdetail(scope.$index, scope.row)"
                  >订单详情</el-button>
                  <el-button
                    type="success"
                    size="mini"
                    @click="getremark(scope.$index, scope.row)"
                  >备注</el-button>
                  <el-button
                    v-if="scope.row.orderStatus=='1'||scope.row.orderStatus=='4'"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                    type="danger"
                  >取消订单</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    @click="getmoney(scope.$index, scope.row)"
                    v-if="scope.row.orderStatus=='5'"
                  >收款</el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="opencancel(scope.$index, scope.row)"
                    v-if="scope.row.orderStatus=='4'"
                  >消费编码</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="margin-top: 20px;text-align:center">
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
          </el-tab-pane>
          <el-tab-pane label="评价" name="second">
            <el-table
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="evaluateData"
              style="width: 100%"
            >
              <el-table-column label="评论内容" width="180">
                <template slot-scope="scope">
                  <p>{{scope.row.content}}</p>
                </template>
              </el-table-column>
              <el-table-column label="星级评价">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.star }}</span>
                </template>
              </el-table-column>
              <el-table-column label="评价时间">
                <template slot-scope="scope">
                  <span
                    style="margin-left: 10px"
                  >{{ scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="评论对象">
                <template slot-scope="scope">
                  <span
                    style="margin-left: 10px"
                    v-if="scope.row.type=='0'"
                  >{{scope.row.massageTitle}}</span>
                  <span style="margin-left: 10px" v-if="scope.row.type=='2'">技师评价</span>
                  <span style="margin-left: 10px" v-if="scope.row.type=='3'">店铺评价</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status==0"
                    type="success"
                    @click="changgestatus(scope.$index, scope.row,1)"
                    size="mini"
                  >显示评论</el-button>
                  <el-button
                    v-if="scope.row.status==1"
                    type="success"
                    @click="changgestatus(scope.$index, scope.row,0)"
                    size="mini"
                  >隐藏评论</el-button>
                  <el-button type="primary" @click="reply(scope.$index, scope.row)" size="mini">回复</el-button>
                  <el-button
                    @click="delreviews(scope.$index, scope.row)"
                    type="danger"
                    size="mini"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="margin-top: 20px;text-align:center">
              <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="currentPage1"
                :page-sizes="[1, 3, 5, 10, 30]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 备注 -->
    <!-- 回复评论 -->
    <el-dialog title="回复评论" :visible.sync="dialogreplyVisible">
      <el-input v-model="replycontent" autocomplete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogreplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="replyreview">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单备注" :visible.sync="dialogFormVisible">
      <el-form ref="remarkForm" :model="remarkForm">
        <el-input
         show-word-limit maxlength="100"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="remarkForm.remark"
          autocomplete="off"
        ></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarksave">保存</el-button>
      </div>
    </el-dialog>
    <!-- 消费编码 -->
    <el-dialog title="请输入消费编码：" :visible.sync="dialogFormVisible1">
      <el-input v-model="usecode" autocomplete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../../common/bus";
import moment from 'moment'
export default {
  data() {
    return {
      usecode: "",
      status: "",
      dialogreplyVisible: false,
      dialogFormVisibleL: false,
      dialogFormVisible1: false,
     dialogFormVisible: false,
      replycontent: "",
      replyid: "",
      activeName: "first",
      index: "",
      routerdata: "",
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      currentPage1: 1, // 当前页
      pageSize1: 5, // 每页条数
      total1: 0, // 数据总条数
      num: 0,
      evaluateData: {},
      remarkmangage: "",
      remarkForm: {
        remark: ""
      },
      visible: false,
      datatime:''
    };
  },
  methods: {
    examineMember() {
      this.$router.push({
        name: "membercard",
        query: {
          uid: this.$route.query.uid
        }
      });

    },

    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getGoodsListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getGoodsListByPage(); // 调用分页函数
    },
    handleSizeChange1(val) {
      // 当每页显示条数改变
      this.pageSize1 = val;
      this.getevaluate(); // 调用分页函数
    },
    handleCurrentChange1(val) {
      // 当前页码改变
      this.currentPage1 = val;
      this.getevaluate(); // 调用分页函数
    },
    getGoodsListByPage() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        uid: this.$route.query.uid,
        shopId: window.localStorage.getItem("shopid")
      };
      this.req
        .post("/order/orderlist", params)
        .then(res => {
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(res);
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          this.tableData.map(v => {
            if (v.userWorker == undefined) {
              return (v.userWorker = "");
            }
          });
          if (!res.data.data.resultList.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getGoodsListByPage(); // 再次请求数据
          }
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getevaluate() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize1,
        userId: this.$route.query.uid
      };
      this.req
        .post("/reviews/list", params)
        .then(res => {
          this.evaluateData = res.data.data.resultList;
          this.total1 = res.data.data.totalCount;
          console.log(res);
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          if (!res.data.data.resultList.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getevaluate(); // 再次请求数据
          }
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delreviews(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            userid: this.$route.query.uid,
            id: row.id
          };
          this.req
            .post("/reviews/update/del", params)
            .then(res => {
              console.log(res);
              if (res.data.sub_code == "SUCCESS") {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getGoodsListByPage();
                this.getevaluate();
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    reply(index, row) {
      this.dialogreplyVisible = true;
      this.replyid = row.id;
    },
    replyreview() {
      let params = {
        content: this.replycontent,
        id: this.replyid
      };
      this.req
        .post("/reviews/update/reply", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogreplyVisible = false;
            this.$message({
              type: "success",
              message: "回复成功"
            });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changgestatus(index, row, i) {
      let params = {
        status: i,
        id: row.id
      };
      this.req
        .post("/reviews/update/status", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getGoodsListByPage();
            this.getevaluate();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    orderdetail(index, row) {
      window.localStorage.removeItem("detailnumber");

      window.localStorage.setItem("detailnumber", row.orderno);
      this.$router.push({ path: "/orderdetail" });
    },
    getremark(index, row) {
      this.remarkmangage = row;
      this.remarkForm.remark = row.remark;
      this.dialogFormVisible = true;
      console.log(row);
    },
    remarksave() {
      let params = {
        orderNo: this.remarkmangage.orderno,
        remark: this.remarkForm.remark
      };
      this.req
        .post("/order/remark", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.$message({
              type: "success",
              message: "备注成功"
            });
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //消费编码
    opencancel(index, row) {
      this.dialogFormVisible1 = true;
      this.usecodemsg = row;
    },
    cancel() {
      let params = {
        orderno: this.usecodemsg.orderno,
        usecode: this.usecode
      };
      this.req
        .post("/order/useservice", params)
        .then(res => {
          console.log(res);
          this.visible = false;
          if (res.data.sub_code == "SUCCESS") {
            this.$message({
              type: "success",
              message: "消费编码成功"
            });

            this.dialogFormVisible1 = false;
            this.getGoodsListByPage();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
      handleEdit(index, row) {
      console.log(index, row);
       this.$confirm("确定取消当前订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            orderNo: row.orderno
          };
          this.req
            .post("/order/cancelorder", params)
            .then(res => {
              if (res.data.sub_code == "SUCCESS") {
                this.getGoodsListByPage();
              } else {
              }
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "订单取消成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  },
  created() {
    this.getGoodsListByPage();
    this.getevaluate();
   
  }
};
</script>
<style scoped>
.a {
  display: flex;
}
</style>
