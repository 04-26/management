<template>
  <div class>
    <el-card  shadow="never" style="margin-top:20px" class="box-card mgb20">
      <div slot="header" class="clearfix">
        <span>会员中心</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding-bottom:10px">
        <div style=" padding: 3px 0;display:flex;">
          <el-input style="width:250px" v-model="keyword" type="text" placeholder="会员名称/手机号"></el-input>
          <el-button @click="getGoodsListByPage()" type="primary">搜索</el-button>
        </div>
      </div>
      <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="goodsTableData" tooltip-effect="dark" class="table" ref="goodsTableData">
        <el-table-column width="600" label="会员信息">
          <template slot-scope="scope">
           <div  style="display:flex;align-items: center;">
            <img style="width:45px;height:45px;border-radius:50%" :src="scope.row.avatar|avatar" alt="#">
           <div style="display:inline-block;vertical-align:middle;padding-left:5px;">
              <div>{{scope.row.nick}}</div>
              <div> {{scope.row.telphone}} </div>
              <div>{{scope.row.address}}</div>
           </div>
           <p style="padding-left:30px;line-height:30px;width:150px" v-if="scope.row.birthDate!=undefined">{{scope.row.birthDate|dateformat('YYYY-MM-DD') }}</p>
           <p style="padding-left:30px;line-height:30px;width:150px" v-if="scope.row.birthDate==undefined">-- </p>
           </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.sexStr}}</p>
          </template>
        </el-table-column>
        <el-table-column label="购买会员卡(张数)" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.cardCount}}</p>
          </template>
        </el-table-column>
        <el-table-column label="钱包余额" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.accountAmount}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="最近访问日期" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.recentVisitTime |dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
          </template>
        </el-table-column> -->
        <el-table-column width="400" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="gomemberdetails(scope.$index, scope.row)"
            >查看详情</el-button>
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
          :page-size="8"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "tabs",
  data() {
    return {
      goodsTableData: [],
      multipleSelection: [],
      currentPage: 1, // 当前页
      pageSize: 8, // 每页条数
      total: 0, // 数据总条数
      is_search: false,
      editVisible: false,
      delVisible: false,
      dialogTableVisible: false,
      visible2: false,
      gridData: [], //模态框表格
      title: "",
      keyword:'',//关键字
      num:0,
      keyword:''
    };
  },
  created() {
    this.getGoodsListByPage();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    getGoodsListByPage(i) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword:this.keyword,
        fliter:i
      };
      this.req
        .post("/userinfo/list",params)
        .then(res => {
          this.goodsTableData = res.data.data.resultList;
          this.total = res.data.data.totalCount
          this.goodsTableData.map(item=>{
            if(item.avatar==undefined){
              item.avatar = ''
            }
          })
          console.log(res);
            if(this.goodsTableData.avatar.indexOf('https')==0){
        this.num = 1
      }else{
        this.num = 0
      }
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
      this.getGoodsListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getGoodsListByPage(); // 调用分页函数
    },
    gomemberdetails(index,row){
      console.log(index,row)
      this.$router.push({
        name:'membershipdetails',
        query:{
            avatar:row.avatar,
            nick:row.nick,
            telphone:row.telphone,
            birthDate:row.birthDate,
            sexStr:row.sexStr,
            regionName:row.regionName,
            recentVisitTime:moment(row.recentVisitTime).format('YYYY-MM-DD HH:mm:ss'),
            accountAmount:row.accountAmount,
            amountOrigin:row.amountOrigin,
            totalConsumption:row.totalConsumption,
            cardCount:row.cardCount,
            uid:row.id


        }
      })
    },
     
  }
};
</script>

<style>
.message-title {
  cursor: pointer;
  
}
.handle-row {
  margin-top: 30px;
}
.technician-list {
  display: flex;
  justify-content: space-around;
}
.technician-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.el-checkbox {
  margin-left: 5px !important;
}
.allspan{
  border: 1px #e6e3e3 solid;
  padding: 2px 5px;
  margin: 10px;
  cursor: pointer;
}
</style>

