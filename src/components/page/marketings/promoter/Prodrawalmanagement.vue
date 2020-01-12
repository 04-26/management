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
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoter">推广员</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoteaudit">推广员审核</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promotionset">推广设置</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/setgoods">设置商品</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoterrecruit">推广招募</router-link>
              </span>
              <span style="margin-right:15px" >
                <router-link style="padding:5px 10px;text-decoration: none;"  to="/promoterorder">推广订单列表</router-link>
              </span>
              <span style="margin-right:15px" class="active">
                <router-link style="padding:5px 10px;text-decoration: none;" class="active-a" to="/prodrawalmanagement">推广提现管理</router-link>
              </span>
            </p>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <div style="flex:1">
            <el-select style="width:120px" v-model="status" placeholder="审核状态" @change="statusChange">
              <el-option label="全部提现" :value="-1"></el-option>
              <el-option label="待处理" :value="0"></el-option>
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="拒绝申请" :value="2"></el-option>
            </el-select>&nbsp;
            </div>
            <div  style="display:flex;">
              <el-date-picker @change="timeChange" v-model="startTimeAndEndTime" 
                type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>&nbsp;
              <p>
                <el-input style="width:200px" type="text" placeholder="请输入姓名/企业名称/手机号" v-model="keyword"></el-input>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </p>
            </div>
          </div>
          <el-table v-loading="loading"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="申请人">
              <template slot-scope="scope">
                <div>{{ scope.row.username }}</div>
                <div>{{ scope.row.phone }}</div>
              </template>
            </el-table-column>
            <el-table-column label="申请时间" width="220">
              <template slot-scope="scope">
                <span>{{ scope.row.initTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" width="220">
              <template slot-scope="scope">
                <span>{{ scope.row.cardname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="提现金额" width="220">
              <template slot-scope="scope">
                <span>{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="处理完成时间">
              <template slot-scope="scope">
                <span>{{ scope.row.finishTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.status|cashStatus }}</span>
              </template>
            </el-table-column>
  
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(1, scope.row)" v-if="scope.row.status==0">通过</el-button>
                <el-button size="mini" @click="handleEdit(4, scope.row)" v-if="scope.row.status==1">已通过</el-button>
                <el-button size="mini" @click="handleEdit(2, scope.row)" v-if="scope.row.status==0">驳回</el-button>
                <el-button size="mini" @click="handleEdit(3, scope.row)">备注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align:center;padding:10px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                  :current-page="pageNo" :page-sizes="[10, 50, 100, 400]" 
                  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog :close-on-click-modal='false' :close-on-press-escape="false"
      :center="true"
      title=""
      width="300px"
      :visible.sync="dialogVisible">
      <div style="text-align:center;">
        <img style="width:100%;height:auto;" :src="$imgurl()+currDetail.qrWxpay">
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cashMoney" v-if="currDetail.status==0">确定打款</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableData: [],
      loading:false,
      startTime:'',
      endTime:'',
      status:-1,
      startTimeAndEndTime:[],
      keyword:'',
      pageSize:10,
      pageNo:1,
      totalCount:0,
      dialogVisible:false,
      currDetail:{}
    };
  },
  created() {
    var promoter = sessionStorage.getItem('promoter');
    if(promoter){
      promoter = JSON.parse(promoter);
      this.keyword = promoter.telphone;
      sessionStorage.removeItem('promoter');
    }
    this.getList();
  },
  methods: {
    handleEdit(index, row) {
      this.currDetail=row;
      if(index==1){
        // 确定通过，并开始打款
        this.dialogVisible=true;
        return;
      }
      if(index==4){
        // 确定通过，并开始打款
        this.dialogVisible=true;
        return;
      }
      if(index==2){
        // 驳回
        this.$confirm('确定驳回申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
            this.loading=true;
            this.req.post("/promoter/withdraw/refuse",{id:row.id}).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=="SUCCESS"){
                  this.$message.success("操作成功");
                  this.getList();
                }else{
                  this.$message.error(res.data.sub_msg);
                }
            })
        })
        return ;
      }
      if(index==3){
        this.$prompt('', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder:'请输入备注内容',
          inputValue:row.note?row.note:'',
          inputValidator:function(val){
            if(val.length>0){
              return true;
            }
            return false;
          },
          inputErrorMessage: '请输入备注内容'
        }).then(({ value }) => {
            this.loading=true;
            this.req.post("/promoter/withdraw/note",{id:row.id,note:value}).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=="SUCCESS"){
                  this.$message.success("操作成功");
                  this.getList();
                }else{
                  this.$message.error(res.data.sub_msg);
                }
            })
        })
      }
    },
    getList(){
      var postData = {
        status:this.status,
        keywords:this.keyword,
        startTime:this.starttime,
        endTime:this.endtime,
        pageSize:this.pageSize,
        pageNo:this.pageNo,
      }
      if(this.startTimeAndEndTime && this.startTimeAndEndTime.length>0){
        postData.startTime=this.$moment(this.startTimeAndEndTime[0]).format('YYYY-MM-DD');
        postData.endTime=this.$moment(this.startTimeAndEndTime[1]).format('YYYY-MM-DD');
      }else{
        delete postData.startTime;
        delete postData.endTime;
      }
      if(!this.keyword){
        delete postData.keyword;
      }
      if(this.status==-1){
        delete postData.status;
      }
      this.loading=true;
      this.req.post("/promoter/withdraw",postData).then(res=>{
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
        this.startTime=this.$moment(this.startTimeAndEndTime[0]).format('YYYY-MM-DD');
        this.endTime=this.$moment(this.startTimeAndEndTime[1]).format('YYYY-MM-DD');
      }
      this.pageNo=1;
      this.getList();
    },
    onSubmit(){
      this.pageNo=1;
      this.getList()
    },
    statusChange(v){
      this.status=v;
      this.pageNo=1;
      this.getList();
    },
    cashMoney(){
      this.dialogVisible = false;
      this.req.post("/promoter/withdraw/pay",{id:this.currDetail.id}).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.currDetail = {}
          this.$message.success('操作成功');
          this.getList();
        }else{
          this.$message.error(res.data.sub_msg)
        }
      })
    },
    handleSizeChange(v){  // 改变每页显示数量
        this.pageSize=v;
        this.getList();
    },
    handleCurrentChange(v){  // 当前页码改变
        this.pageNo=v;
        this.getList();
    },
  },
  filters:{
    cashStatus(v){
      if(v==0){
        return '待处理';
      }
      if(v==1){
        return '审核通过';
      }
      if(v==2){
        return '拒绝申请';
      }
    }
  }
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