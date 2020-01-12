<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/砍价/订单列表</span>
      </div>
      <div>
        <!-- 下半部分 -->
        <div>
          <p>
            <el-select
              filterable
              v-model="status"
              placeholder="按服务类别查询"
              @change="getgroupbooking"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="已下单" value="1" ></el-option>
              <el-option label="已支付" value="2"></el-option>
              <el-option label="已失效" value="3"></el-option>
             
            </el-select>
          </p>
          <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column width="300px" label="顾客信息">
              <template slot-scope="scope">
                <div>
                  <img
                    style="width:50px;height:50px;border-radius:50%"
                    :src="scope.row.xUserInfo.avatar|avatar"
                    alt="#"
                  />
                  <span style="margin-left: 10px;line-height:50px">{{ scope.row.xUserInfo.nick }}</span>
                  <span
                    style="margin-left: 10px;line-height:50px"
                  >{{ scope.row.xUserInfo.telphone }}</span>
                </div>
                <p
                  style="padding-left:20px"
                >发起砍价时间：{{scope.row.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
              </template>
            </el-table-column>
            <el-table-column label="订单编号">
              <template slot-scope="scope">
                <p style="margin-left: 10px;line-height:71px">{{ scope.row.orderno }}</p>
                <p>结束时间：{{scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
              </template>
            </el-table-column>
            <el-table-column label="下单时间">
              <template slot-scope="scope">
                <p
                  style="margin-left: 10px;line-height:71px"
                >{{ scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                <p>帮砍人数：{{scope.row.helpNum }}</p>
              </template>
            </el-table-column>

            <el-table-column label="砍后金额（元 ) ">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.payPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实付金额(元）">
              <template slot-scope="scope">
                <span v-if="scope.row.status!='1'" style="margin-left: 10px">{{ scope.row.payPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  style="margin-top:35px;margin-bottom:10px"
                  size="mini"
                  @click="handlewatch(scope.$index, scope.row)"
                >订单详情</el-button>
                <!-- <p v-if="scope.row.status=='0'">上线</p> -->
                <p v-if="scope.row.status=='1'">已下单</p>
                <p v-if="scope.row.status=='2'">已支付</p>
                <p v-if="scope.row.status=='3'">已失效</p>
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
      dogdata: [],
      bargainUserId: "",
      status:''
    };
  },
  methods: {
    //查看详情
    //查看详情
    handlewatch(index, row) {
      window.localStorage.removeItem("detailnumber");
      // 查看商品订单详情
      if(row.relatType==3){
        this.$router.push({ path: "/bmallorder",query:{bargainid:row.id} });
        return ;
      }
      window.localStorage.setItem("detailnumber", row.orderno);
      this.$router.push({ path: "/orderdetail" });
    },
    //查看订单
    handledetails(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    getgroupbooking() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        bargainId: window.localStorage.getItem("bargainid"),
        status:this.status
      };
      this.req
        .post("/bargain/userlist", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          if (this.tableData.xUserInfo.avatar == undefined) {
            this.tableData.xUserInfo.avatar = "";
          }
          console.log(this.tableData);
          if (res.data.sub_code == "SUCCESS") {
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
  }
};
</script>

<style scoped>
</style>