<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>多人拼团/订单列表-(这是活动名称)</span>
      </div>
      <div>
        <!-- 下半部分 -->
        <div>
          <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="顾客信息">
              <template slot-scope="scope">
                <div style="height:50px;line-height:50px;display:flex" v-for="(item,i) in scope.row.orderList" :key="i">
                  <img style="width:50px;height:50px;border-radius:50%" :src="item.userinfo.avatar|avatar" alt="#"/>
                  <span style="margin-left: 10px;line-height:50px;display:inline-block;">{{ item.userinfo.nick }}</span>
                  <span v-if="scope.row.uid==item.userinfo.uid">(团长)</span>
                </div>
                <p style="padding-top:20px;">拼团编号：{{scope.row.recordno}}</p>
              </template>
            </el-table-column>
            <el-table-column label="订单编号">
              <template slot-scope="scope">
                <p
                  v-for="(item,i) in scope.row.orderList"
                  :key="i"
                  style="margin-left: 10px;line-height:50px"
                >{{ item.orderno }}</p>
                <p style="padding:20px"></p>
              </template>
            </el-table-column>
            <el-table-column label="下单时间">
              <template slot-scope="scope">
                <p
                  style="margin-left: 10px;line-height:50px"
                  v-for="(item,i) in scope.row.orderList"
                  :key="i"
                >{{ item.initTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                <p
                  style="padding-top:20px;"
                >开始时间：{{scope.row.startTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
              </template>
            </el-table-column>
            <el-table-column label="实付金额（元）">
              <template slot-scope="scope">
                <p
                  style="margin-left: 10px;line-height:50px"
                  v-for="(item,i) in scope.row.orderList"
                  :key="i"
                >{{ item.payAmount }}</p>
                <p
                  style="padding-top:20px;"
                >结束时间：{{scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
              </template>
            </el-table-column>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                <p style="margin-left: 10px;line-height:50px" v-for="(item,i) in scope.row.orderList" :key="i">
                  <span v-if='item.kind!=3'>
                    <span v-if="item.orderStatus=='1'">待支付</span>
                    <span v-if="item.orderStatus=='2'">已支付（待接单）</span>
                    <span v-if="item.orderStatus=='3'">已预约</span>
                    <span v-if="item.orderStatus=='4'">已确认（待服务）</span>
                    <span v-if="item.orderStatus=='5'">待支付（待结束）</span>
                    <span v-if="item.orderStatus=='6'">服务完成（待评价）</span>
                    <span v-if="item.orderStatus=='7'">申请退款</span>
                    <span v-if="item.orderStatus=='8'">已完成</span>
                    <span v-if="item.orderStatus=='-1'">订单取消</span>
                    <span v-if="item.orderStatus=='-2'">订单取消</span>
                  </span>
                  <span v-if='item.kind==3'>{{item|status}}</span>
                </p>
                <p style="padding-top:20px;">
                  成团人数：{{scope.row.participation}}人
                  <span
                    v-if="(scope.row.actionNum-scope.row.participation)>0"
                  >（还差{{scope.row.actionNum-scope.row.participation}}人）</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <p style="margin-left: 10px;line-height:50px" v-for="(item,i) in scope.row.orderList"
                    :key="i">
                  <el-button type="success" size="mini" @click="handlewatch(item)">订单详情</el-button>
                </p>
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
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      centerDialogVisible: false,
      dogdata: []
    };
  },
  methods: {
    //查看详情
    handlewatch(item) {
      window.localStorage.removeItem("detailnumber");
      if(item.kind==3){
        this.$router.push({path:'/gmallorder',query:{groundbookingid:item.actionid}});
        return ;
      }
      window.localStorage.setItem("detailnumber", item.orderno);
      this.$router.push({ path: "/orderdetail" });
    },
    //查看订单
    handledetails(index, row) {
      console.log(index, row);
      row.id;
      // 存入token
      window.localStorage.removeItem("groundbookingid");
      window.localStorage.setItem("groundbookingid", row.id);
      // console.log(row.id)
      // 跳后端首页
      this.$router.push({ path: "/myshop", name: "Myshop" });
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    getgroupbooking() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        actionid: window.localStorage.getItem("groundbookingid")
      };
      this.req
        .post("/assemble/records", params)
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
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getgroupbooking(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getgroupbooking(); // 调用分页函数
    }
  },
  created() {
    this.getgroupbooking();
  },
  activated() {
    this.getgroupbooking();
  },
  filters:{
    status(item){
        // 1-待支付，2-已支付（待接单）（待发货-商品订单）3-已预约（待发货-商品订单），4-已确认（待服务）（待发货-商品订单），
        // 5-服务中（待结束）（待收货-商品订单），6-服务完成（待评价）（已收货-商品订单），7-申请退款，8- 已完成-1 -订单取消 -2-订单取消
        if(item.orderStatus==-1 || item.orderStatus==-2){
        return '订单已取消';
        }

        if(item.orderStatus==1){
        return '待支付';
        }
        if(item.orderStatus==2){
        return '待发货';
        }
        if(item.orderStatus==3){
        return '待发货';
        }
        if(item.orderStatus==4){
        return '待发货';
        }

        if(item.orderStatus==5){
        return '待收货';
        }
        if(item.orderStatus==6){
        return '已收货';
        }
        if(item.orderStatus==7){
        return '申请退款';
        }
        if(item.orderStatus==8){
        return '已完成';
        }
        if(item.orderStatus==10){
        return '已完成';
        }
    },
  }
};
</script>

<style scoped>
.l {
  display: inline-block;
}
.cell {
  height: 110px !important;
}
</style>