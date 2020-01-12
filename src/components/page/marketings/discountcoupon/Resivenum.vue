<template>
  <el-card shadow="never" class="box-card">
    <div slot="header" class="clearfix">
      <span>营销应用/优惠劵/已领取量</span>
    </div>
    <div>
        <!-- <p>
                  <el-select
                    filterable
                    v-model="stat"
                    @change="getorderdata"
                  >
                    <el-option label="全部" value=''></el-option>
                    <el-option label="服务订单" value='1'></el-option>
                    <el-option label="会员卡" value='2'></el-option>
                    <el-option label="商品" value='3'></el-option>
                    <el-option label="充值" value='4'></el-option>
                    <el-option label="打赏" value='10'></el-option>
                    <el-option label="面对面订单" value='20'></el-option>
          
                    
                  </el-select>
                </p> -->
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="goodsTableData"
        tooltip-effect="dark"
        class="table"
        ref="goodsTableData"
      >
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <div style="display:flex;">
              <img
                style="width:60px;height:60px;border-radius:50%"
                :src="scope.row.avatar|avatar"
                alt
              />
              <div
                style="display:flex;justify-content: center;align-content: center;flex-wrap: wrap;padding-left:10px"
              >
                <p style="width:100%">{{ scope.row.userName }}</p>
                <p style="width:100%">{{ scope.row.phone}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.initTime |dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            
          </template>
        </el-table-column>
        <el-table-column label="使用时间" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.status=='2'">{{scope.row.updateTime |dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <p v-if="scope.row.status=='1'||scope.row.status=='3'">--</p>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="状态" align="center">
          <template slot-scope="scope">
              <p v-if="scope.row.status=='1'">未使用</P>
              <p v-if="scope.row.status=='2'">已使用</P>
              <p v-if="scope.row.status=='3'">已过期</P>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <div>
                <el-button type="warning" @click="delUsrCoupon(scope.row)" v-if="scope.row.status==1">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 20px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5,8, 10, 30]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodsTableData: [],
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 数据总条数
      cardData: {},
      cardtabledata: [],
      form: {
        endTime: ""
      },
      id: "",
      formLabelWidth: "120px"
    };
  },
  methods: {
    getcardListByPage() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        couponId: this.$route.query.couponId
      };
      this.req
        .post("/coupon/usercoupon", params)
        .then(res => {
          this.goodsTableData = res.data.data.resultList;
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
            this.getcardListByPage(); // 再次请求数据
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
      this.getcardListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getcardListByPage(); // 调用分页函数
    },
    gomemberdetails(index, row) {
      let params = {
        id: row.id
      };
      this.req
        .post("/vipcard/user/detail", params)
        .then(res => {
          this.cardData = res.data.data;
          this.cardtabledata = res.data.data.goods;
          console.log(this.cardData);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogVisible = true;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setdata(index, row) {
      this.id = row.id;

      this.dialogFormVisible = true;
    },
    delUsrCoupon(item){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {userCouponId:item.id};
          this.req.post("/coupon/delusercoupon",param).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.$message.success('操作成功');
              this.getcardListByPage();
            }else{
              this.$message.error(res.data.sub_msg);
            }
          })
        }).catch(() => {});
    }
  },
  created() {
    this.getcardListByPage();
  },
  activated() {
    this.getcardListByPage();
  }
};
</script>

<style scoped>
</style>


