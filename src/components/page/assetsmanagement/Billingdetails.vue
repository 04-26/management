<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资产管理/店铺账单明细</span>
      </div>
      <div>
        <el-card shadow="never" class="box-card">
          <div>
            <div style="margin-bottom:20px;display:flex; justify-content: space-between">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="getdata"
              ></el-date-picker>
              <!-- <p>
                <el-button type="primary" @click="getall">全部</el-button>
                <el-button type="primary">今天</el-button>
                <el-button type="primary">7天</el-button>
                <el-button type="primary">本月</el-button>
                <el-button type="primary">导出账单</el-button>
              </p> -->
              <el-select filterable v-model="type" placeholder="按服务类别查询" @change="gettype">
                <el-option label="全部" value></el-option>
                <el-option label="服务收入" value="10"></el-option>
                <el-option label="提现" value="8"></el-option>
                <el-option label="提现失败返回" value="9"></el-option>
                <el-option label="客户打赏" value="11"></el-option>
                <el-option label="系统操作" value="20"></el-option>
                <el-option label="会员卡充值" value="30"></el-option>
                <el-option label="面对面收款" value="31"></el-option>
                <el-option label="商品收入" value="32"></el-option>
              </el-select>
            </div>
            <el-table
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column label="时间">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.initTime |dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.typeStr }}</span>
                </template>
              </el-table-column>
              <el-table-column label="变更类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.type=='10'" style="margin-left: 10px">服务收入</span>
                  <span v-if="scope.row.type=='8'" style="margin-left: 10px">提现</span>
                  <span v-if="scope.row.type=='9'" style="margin-left: 10px">提现失败返回</span>
                  <span v-if="scope.row.type=='11'" style="margin-left: 10px">客户打赏</span>
                  <span v-if="scope.row.type=='20'" style="margin-left: 10px">系统操作</span>
                  <span v-if="scope.row.type=='30'" style="margin-left: 10px">会员卡充值</span>
                  <span v-if="scope.row.type=='31'" style="margin-left: 10px">面对面收款</span>
                  <span v-if="scope.row.type=='32'" style="margin-left: 10px">商品收入</span>
                </template>
              </el-table-column>
              <el-table-column label="金额 （元）">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.amount|numFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="账户余额（元）">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.preamount+scope.row.amount|numFilter}}</span>
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
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      activeName: "first",
      value1: "",
      value2: "",
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 数据总条数
      tableData: [],
      type: ""
    };
  },

filters: {
  numFilter :function(value) {
    // 截取当前数据到小数点后三位
    let tempVal = parseFloat(value).toFixed(3)
    let realVal = tempVal.substring(0, tempVal.length - 1)
    return realVal
  }
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
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getuseraccount(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getuseraccount(); // 调用分页函数
    },
    getuseraccount() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        type: this.type,
        startTime: this.value1[0],
        endTime: this.value1[1]
      };
      this.req
        .post("/shop/useraccountlogs", params)
        .then(res => {
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(res);
          if (this.tableData.avatar.indexOf("https") == 0) {
            this.num = 1;
          } else {
            this.num = 0;
          }
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          if (!res.data.data.resultList.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getuseraccount(); // 再次请求数据
            
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
    gettype() {
      this.value1 = [];
      this.getuseraccount();
    },
    getdata() {
      this.type = "";
      this.getuseraccount();
    },
    getall() {
      this.value1 = [];
      this.type = "";
      this.getuseraccount();
    }
  },
  created() {
    this.getuseraccount();
  }
};
</script>
<style scoped>

</style>
