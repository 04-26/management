<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺收益</span>
      </div>
      <div>
        <div class="assets-top">
          <div class="shopcard">
            <p class="yuep">{{userdata.amount}}</p>
            <p style="padding-top:10px">
              <span class="setcard" type="primary" @click="goBillingdetails"></span>
              <span class="getcard" type="success" @click="withdraw"></span>
            </p>
          </div>
        </div>
        <el-card shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>流水记录</span>
          </div>
          <div>
            <!-- <div style="margin-bottom:15px">
              时间：
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div> -->
            <el-table
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column label="提现银行|交易号">
                <template slot-scope="scope">
                  <p style="margin-left: 10px">{{ scope.row.bankTitle }}</p>
                  <p style="margin-left: 10px">{{ scope.row.bankNum }}</p>
                </template>
              </el-table-column>
              <el-table-column label="申请时间">
                <template slot-scope="scope">
                  <span
                    style="margin-left: 10px"
                  >{{ scope.row.initTime |dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额(元)">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理完成时间">
                <template slot-scope="scope">
                  <span
                    style="margin-left: 10px"
                  >{{ scope.row.updateTime |dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <!-- <span v-if="scope.row.status=='0'" style="margin-left: 10px">待处理</span>
                  <span v-if="scope.row.status=='1'" style="margin-left: 10px">审核通过</span>
                  <span v-if="scope.row.status=='2'" style="margin-left: 10px">拒绝申请</span> -->
                  <span style="margin-left: 10px">{{scope.row.cashstatusStr}}</span>
                </template>
              </el-table-column>                      
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handledetail(scope.$index, scope.row)">详情</el-button>
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
          </div>
        </el-card>
      </div>
    </el-card>
    <el-dialog title="你还未绑定银行卡" :visible.sync="centerDialogVisible" width="30%" center>
      <!-- <span>为了保证资金安全，请先通过店铺认证。</span> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goshopcertification">立即绑卡</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  data() {
    return {
      value1: "",
      value2: "",
      centerDialogVisible: false,
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      tableData: {},
      userdata:{}
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    goshopcertification() {
      this.centerDialogVisible = false;
      this.$router.push("/addbankcard");
    },
    // 待结算
    forthe() {
      this.$router.push("/forthe");
    },
    goBillingdetails(){
      this.$router.push("/billingdetails");

    },
    // 获取消费
    getpayList() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };

      this.req
        .post("/withdraw/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;

          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
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
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getpayList(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getpayList(); // 调用分页函数
    },
    withdraw() {
      this.req
        .post("/bankcard/info")
        .then(res => {
          console.log(res);
       
          if (res.data.sub_code == "SUCCESS") {
            // window.localStorage.setItem("withdrawId", res);
             this.$router.push({
                  path: "/balancewithdrawal",
                });
            } else {
            this.centerDialogVisible = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    useraccount(){

       this.req
        .post("/shop/useraccount")
        .then(res => {
          console.log(res);
       this.userdata = res.data.data
          if (res.data.sub_code == "SUCCESS") {
            
          } else {
            this.$message.error(res.data.sub_msg);
            
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handledetail(index,row){
       this.$router.push({
        name:'showdetails',
        query:{
            status:row.status,
            amount:row.amount,
            bankTitle:row.bankTitle,
            completeTime: moment(row.completeTime).format('YYYY-MM-DD HH:mm:ss'),
            initTime: moment(row.initTime).format('YYYY-MM-DD HH:mm:ss'),
            remark:row.remark,
            cashstatus:row.cashstatus,
        }
      })
      console.log(row)
    }
  },
  created() {
    this.useraccount()
    this.getpayList();
      // this.$router.push({
      //   name:'membershipdetails',
      //   query:{
      //       avatar:row.avatar,
      //       nick:row.nick,
      //       telphone:row.telphone,
      //       birthDate:row.birthDate,
      //       sexStr:row.sexStr,
      //       regionName:row.regionName,
      //       recentVisitTime:row.recentVisitTime,
      //       accountAmount:row.accountAmount,
      //       amountOrigin:row.amountOrigin,
      //       totalConsumption:row.totalConsumption,
      //       cardCount:row.cardCount,
      //       uid:row.id


      //   }
      // })
  }
};
</script>
<style scoped>
.shopcard{
   color: rgb(253, 251, 251);
  padding: 20px;
  background: url("../../../assets/img/店铺余额@2x.png") no-repeat;
  height: 150px;
  width: 383px;
  display: flex;
  justify-content: space-between;
}
.assets-top {
  display: flex;
  width: 400px;
  line-height: 30px;
  margin-bottom: 30px;
  padding: 10px;
  background: #f8f8f8;
}
.setcard{
  display: block;
  background: url("../../../assets/img/查看@2x(1).png") no-repeat;
  height: 47px;
  width: 95px;
}
.getcard{
  display: block;
  background: url("../../../assets/img/提现@2x.png") no-repeat;
  height: 47px;
  width: 95px;
}
.yuep{
  font-size: 18px;
  padding-top: 80px;
  padding-left: 50px;
}
</style>
