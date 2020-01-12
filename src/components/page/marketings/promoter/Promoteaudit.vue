<template>
  <div style="width:100%" class="nopromoter">
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
              <span  style="margin-right:15px" class="active">
                <router-link style="padding:5px 10px;text-decoration: none;" class="active-a" to="/promoteaudit">推广员审核</router-link>
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
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoterorder">推广订单列表</router-link>
              </span>
              <span  style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/prodrawalmanagement">推广提现管理</router-link>
              </span>
            </p>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <div>
              <div  style="display:inline-block;">
                申请时间
                <el-date-picker
                  @change="timeChange"
                  v-model="startEndTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>&nbsp;
              <el-select v-model="status" placeholder="状态选择" style="vertical-align:bottom;" @change="statusChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              </div>
            </div>
            <p>
              <el-input style="width:150px" type="text" v-model="keyword" placeholder="请输入推广员手机号"></el-input>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </p>
          </div>
          <el-table v-loading="loading"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="promoterData"
            style="width: 100%"
          >
            <el-table-column label="申请人">
              <template slot-scope="scope">
                <span>{{ scope.row.nick }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="220">
              <template slot-scope="scope">
                <span>{{ scope.row.status==1?'待审核':'已禁用' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="加入时间" width="220">
              <template slot-scope="scope">
                <span>{{ $moment(scope.row.date).format('Y-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(1, scope.row)">通过</el-button>
                <el-button size="mini" @click="handleEdit(2, scope.row)">不通过</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align:center;padding:10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" 
                :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="totalPageCount">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { error } from 'util';
export default {
  data() {
    return {
      tableData: [],
      status: 2,
      value2: "",
      currentPage:1,
      totalPageCount:0,
      pageSize:100,
      loading:true,
      startEndTime: '',
      options:[
        {label:'待审核',value:2},
        {label:'未通过',value:3},
      ],
      keyword:'',
      promoterData:[],
    };
  },
  created() {
    this.getList();
  },
  watch: {
    keyword:function(v,o){
      if(this.keyword.length==0){
        this.getList();
      }
    }
  },
  methods: {
    handleEdit(index, row) {
      var postdata = {
        userId:row.id,
        userType:index
      };
      if(index==2){
        this.$prompt('', '请输入不通过原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          inputValidator:function(v){
              if(!v){
                return '请输入不通过原因';
              }
          }
        }).then(({ value }) => {
          // 不通过
          postdata.auditNote=value;
          postdata.userType=3;
          this.updateUser(postdata);
        });
      }else{
        this.updateUser(postdata);
      }
    },
    updateUser(postdata){
      // /promoter/update/usertype
      this.loading = true;
      this.req.post("/promoter/update/usertype",postdata).then(res => {
        this.loading=false;
        if (res.data.sub_code == "SUCCESS" && res.data.code == "SUCCESS") {
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.data.sub_msg);
        }
      });


    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    getList(){
      var postData = {
        userType:this.status,
        keyword:this.keyword,
        pageSize:this.pageSize,
        pageNo:this.currentPage
      }
      if(typeof this.startEndTime == 'object'){
        postData.startTime=this.$moment(this.startEndTime[0]).format('YYYY-MM-DD');
        postData.endTime=this.$moment(this.startEndTime[1]).format('YYYY-MM-DD');
      }
      this.loading = true;
      this.req.post("/promoter/list",postData).then(res => {
        if (res.data.sub_code == "SUCCESS") {
          this.currentPage = res.data.data.pageNo;
          this.totalPageCount = res.data.data.totalPageCount;
          this.promoterData = res.data.data.resultList;
          this.loading=false;
        } else {
          this.$message.error(res.data.sub_msg);
        }
      });
    },
    onSubmit(){
      if(this.keyword.length>0){
        this.getList();
      }
    },
    handleSizeChange(v){  // 改变每页显示数量
      this.pageSize=v;
      this.currentPage=1;
      this.getList();
    },
    handleCurrentChange(v){  // 当前页码改变
      this.currentPage=v;
      this.getList();
    },
    timeChange(v){
      this.startEndTime = v;
      this.getList();
    },
    statusChange(v){
      this.status = v;
      this.getList();
    },

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
<style>
.el-message-box__header{padding-top:16px !important;}
.el-message-box--center .el-input__inner{height:60px;line-height: 15px;}
</style>