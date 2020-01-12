<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/推广员</span>
      </div>
      <div>
        <!-- 上半部分 -->
        <el-row>
          <el-col class="bookingtop-left" :span="8">
            <p>
              推广员使用介绍：为店铺打造人人皆可推广的系统。
              邀请客户、员工、合作方等成为推广员，推广成功后发佣金。
            </p>
            <p class="left-p2">
              <span>使用教程</span>
              <span>活动案例</span>
            </p>
          </el-col>
        </el-row>
        <!-- 下半部分 -->
        <div>
          <div class="booking-bottom">
            <p class="bottom-item">
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoter">推广员</router-link>
              </span>
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoteaudit">推广员审核</router-link>
              </span>
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promotionset">推广设置</router-link>
              </span>
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/setgoods">设置商品</router-link>
              </span>
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoterrecruit">推广招募</router-link>
              </span>
              <span  style="margin-right:15px" class="active">
                <router-link style="padding:5px 10px;text-decoration: none;" class="active-a" to="/promoterorder">推广订单列表</router-link>
              </span>
              <span  style="margin-right:15px" >
                <router-link style="padding:5px 10px;text-decoration: none;"  to="/prodrawalmanagement">推广提现管理</router-link>
              </span>
            </p>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <div>
            <el-select style="width:120px" v-model="commission" placeholder="结算状态" @change="statusChange">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="未结算" :value="0"></el-option>
              <el-option label="已结算" :value="1"></el-option>
            </el-select>
            &nbsp;
            <el-button style="height:32px" type="primary" @click="exportFile">导出当前页</el-button>&nbsp;
            <el-select style="width:130px" v-model="kind" placeholder="订单类型" @change="orderChange">
              <el-option label="全部类型" :value="0"></el-option>
              <el-option label="服务项目订单" :value="1"></el-option>
              <el-option label="会员卡订单" :value="2"></el-option>
            </el-select>
            </div>
            <div  style="display:flex;">
              <el-date-picker @change="timeChange" v-model="startTimeAndEndTime" 
                type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
              <p>
                <el-input style="width:200px" type="text" placeholder="请输入手机号/订单号" v-model="keyword"></el-input>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </p>
            </div>
          </div>
          <el-table v-loading="loading" id="table"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="商品/订单编号" width="220">
              <template slot-scope="scope">
                <img :src="scope.row.skuList[0].imgurl|avatar" style="width:45px;height:45px;">
                <div style="display:inline-block;vertical-align:middle;padding-left:5px;">
                  <div>{{scope.row.skuList[0].productName}}</div>
                  <div>{{scope.row.orderno }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label=" 订单完成时间">
              <template slot-scope="scope">
                <span>{{ scope.row.payTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="购买人">
              <template slot-scope="scope">
                <div>{{ scope.row.customerName }}</div>
                <div>{{ scope.row.telphone }}</div>
              </template>
            </el-table-column>
            <el-table-column label="实际支付(元)">
              <template slot-scope="scope">
                <span>{{ scope.row.payAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上级提成(元)">
              <template slot-scope="scope">
                <span>{{ scope.row.benefitAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上级">
              <template slot-scope="scope">
                <div>{{ scope.row.recommends.parentName }}</div>
                <div>{{ scope.row.recommends.parentTel }}</div>
              </template>
            </el-table-column>
            <el-table-column label="上上级提成(元)">
              <template slot-scope="scope">
                <span>{{ scope.row.benefit2Amount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上上级">
              <template slot-scope="scope">
                <div>{{ scope.row.recommends.superparentName }}</div>
                <div>{{ scope.row.recommends.superparentTel }}</div>
              </template>
            </el-table-column>
            <el-table-column label="结算时间">
              <template slot-scope="scope">
                <span>{{ scope.row.receptTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结算状态">
              <template slot-scope="scope">
                <span>{{ scope.row.commission==0?'未结算':'已结算' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align:center;padding:10px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
              :current-page="pageNo" :page-sizes="[5,10, 50, 100, 400]" 
              :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from 'xlsx';
export default {
  data() {
    return {
      tableData: [],
      commission:-1,
      keyword:'',
      starttime:'',
      endtime:'',
      pageSize:10,
      pageNo:1,
      totalCount:0,
      loading:false,
      startTimeAndEndTime:[],
      kind:0
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    orderChange(v){
      this.kind=v;
      this.pageNo=1;
      this.getOrderList();
    },
    getOrderList(){
      // /order/benefitlist
      var postData = {
        commission:this.commission,
        keyword:this.keyword,
        starttime:this.starttime,
        endtime:this.endtime,
        pageSize:this.pageSize,
        pageNo:this.pageNo,
      }
      if(this.startTimeAndEndTime.length>0){
        postData.starttime=this.$moment(this.startTimeAndEndTime[0]).format('YYYY-MM-DD');
        postData.endtime=this.$moment(this.startTimeAndEndTime[1]).format('YYYY-MM-DD');
      }else{
        delete postData.starttime;
        delete postData.endtime;
      }
      if(this.keyword.length==0){
        delete postData.keyword;
      }
      if(this.kind!=0){
        postData.kind = this.kind;
      }
      if(this.commission==-1){
        delete postData.commission;
      }
      this.loading=true;
      this.req.post("/order/benefitlist",postData).then(res=>{
        this.loading=false;
        if(res.data.code=='SUCCESS' && res.data.sub_code=="SUCCESS"){
          this.tableData = res.data.data.resultList;
          this.pageNo = res.data.data.pageNo;
          this.totalCount = res.data.data.totalCount;
          
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    timeChange(v){
      this.startTimeAndEndTime = v;
      if(this.startTimeAndEndTime.length>0){
        this.starttime=this.$moment(this.startTimeAndEndTime[0]).format('YYYY-MM-DD');
        this.endtime=this.$moment(this.startTimeAndEndTime[1]).format('YYYY-MM-DD');
      }
      this.pageNo=1;
      this.getOrderList();
    },
    statusChange(v){
      this.commission=v;
      this.pageNo=1;
      this.getOrderList();
    },
    handleSizeChange(v){  // 改变每页显示数量
      this.pageSize=v;
      this.pageNo=1;
      this.getOrderList();
    },
    handleCurrentChange(v){  // 当前页码改变
      this.pageNo=v;
      this.getOrderList();
    },
    onSubmit(){
      this.getOrderList();
    },
    exportFile(){
      var tabledata = XLSX.utils.table_to_book(document.querySelector("#table"));
      var outData = XLSX.write(tabledata,{
        type:'array',
        bookSST:true,
      });
      try {
        FileSaver.saveAs(
          new Blob([outData], { type: "application/octet-stream" }),
            //设置导出文件名称
          "订单列表.xlsx"
        )
      } catch (error) {
        this.$message.error(error.getMessage());
      }
      return outData;
    }
  },
};
</script>

<style scoped>
.bookingtop-left > p {
  line-height: 30px;
  font-size: 14px;
}
.left-p2 {
  display: flex;
  justify-content: space-between;
}
.bookingtop-right {
  display: flex;
  justify-content: space-between;
}
.booking-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.bottom-item > span {
  display: inline-block;
  padding: 5px;
  border: 1px solid #c9c7c7;
}
.bordernone {
  border-right: none !important;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
.active{
    background: #07c4a8;
    
}
.active-a{
    color: #fff
}
</style>