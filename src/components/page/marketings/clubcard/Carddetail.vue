<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/会员卡/出售详情</span>
      </div>
      <div>
        <div>
          <div class="card-list">
            <div class="card-style">
              <p style="justify-content: space-between;" class="card-item">
                <span v-if="carddetail.kind==0">次卡</span>
                <span v-if="carddetail.kind==1">折扣卡</span>
                <span v-if="carddetail.kind==2">充值卡</span>
                <span v-if="carddetail.valid>0">有效期：{{carddetail.valid}}天</span>
                <span v-if="carddetail.valid==0">有效期：永久有效</span>
                
              </p>
              <p style="color:#fff;font-size:20px" class="card-item">{{carddetail.title}}</p>
              <p class="card-bottom">
                <span class="card-item">推拿旗舰店</span>
              </p>
            </div>
            <div style="line-height:30px">
              <p>
                <span v-if="carddetail.kind==0">会员卡类型：次卡</span>
                <span v-if="carddetail.kind==1">会员卡类型：折扣卡</span>
                <span v-if="carddetail.kind==2">会员卡类型：充值卡</span>
                <span v-if="carddetail.onsell == true" style="padding-left:20px">状态：上架</span>
                <span v-if="carddetail.onsell == false" style="padding-left:20px">状态：下架</span>
              </p>
              <p v-if="carddetail.kind==2">
                <span>充值金额：￥{{carddetail.amount}}元</span>
                <span style="padding-left:20px">赠送金额：￥{{carddetail.amountFree}}元</span>
              </p>
              <p v-if="carddetail.kind!=2">
                <span>售价：￥{{carddetail.amount}}元</span>
              </p>
              <p>使用说明：</p>
              <p>1、请在结账前使用此卡；</p>
              <p>2、此卡可享受会员优惠待遇；</p>
              <p>3、此卡不得购买活动产品，不得与其他优惠同时使用；</p>
              <p>4、此卡一经售出，概不兑现；</p>
              <p>5、本店保留此卡法律范围内的最终解释权；</p>
            </div>
          </div>
        </div>
        <div>
          <div style="line-height:50px">
            所获特权:
           <p v-if="carddetail.kind==1">
              <span style="padding-left:20px" v-if="carddetail.goods && carddetail.goods.length==0">全场通用</span>
            <span
              style="padding-left:20px"
              v-if="carddetail.goods && carddetail.goods.length==0"
            >{{carddetail.amountFree}}折</span>
            <span
              style="padding-left:20px"
              v-if="carddetail.valid>0"
            >有效期：{{carddetail.valid}}天</span>
            <span
              style="padding-left:20px"
              v-if="carddetail.valid==0"
            >有效期：永久有效</span>
           </p>
          </div>
          <el-table
            v-if="carddetail.goods && carddetail.goods.length>0"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="goodsData"
            border
            class="table"
            ref="goodsData"
            style="width: 100%"
          >
            <el-table-column prop="massageTitle" label="服务名称"></el-table-column>
            <el-table-column label="内容">
              <template slot-scope="scope">
                <span v-if="scope.row.discount!=undefined">{{scope.row.discount}}折</span>
                <span v-if="scope.row.useTimes!=undefined">{{scope.row.useTimes}}次</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期">
              <template>
                <span v-if="carddetail.valid>0">{{carddetail.valid}}天</span>
                <span v-if="carddetail.valid==0">永久有效</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <p style="line-height:50px">出售</p>
          <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="cardselllist"
            border
            class="table"
            ref="cardselllist"
            style="width: 100%"
          >
            <el-table-column prop="title" label="卡名称"></el-table-column>
            <el-table-column label="购买人">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
                
              </template>
            </el-table-column>
            <el-table-column label="购买时间">
              <template slot-scope="scope">
                <span>{{scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="实付金额">
              <template slot-scope="scope">
                <span>￥：{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.endTime==undefined">永久有效</span> -->
                <span v-if="scope.row.endTime!=undefined&&scope.row.endTime-timeNow>0">使用中</span>
                <span v-if="scope.row.endTime!=undefined&&scope.row.endTime-timeNow<0">已失效</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期">
              <template slot-scope="scope">
                <span v-if="scope.row.valid==0">永久有效</span>
                <span
                  v-if="scope.row.valid>0"
                >{{scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                <!-- <span v-if="scope.row.valid>0">{{scope.row.valid}}天</span> -->
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="setdata(scope.$index, scope.row)"
                  type="primary"
                >修改有效期</el-button>
                <el-button size="mini" v-if="scope.row.status=='1'" type="danger">使失效</el-button>
                <el-button
                  size="mini"
                  @click="gomemberdetails(scope.$index, scope.row)"
                  type="success"
                >使用详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px;text-align:center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 3, 5,9, 10, 30]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 修改有效日期 -->
    <el-dialog title="修改有效期" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="到期时间：" :label-width="formLabelWidth">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="form.endTime"
            style="width: 100%;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savedata">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <div style="line-height:40px">
        <p>
          <span style="font-size:32px">{{cardData.title}}</span>
          <span
            style="padding:5px 20px;background:#07c4a8;border-radius:20px;margin-left:20px"
            v-if="cardData.kind=='0'"
          >次卡</span>
          <span
            style="padding:5px 20px;background:#07c4a8;border-radius:20px;margin-left:20px"
            v-if="cardData.kind=='1'"
          >打折卡</span>
          <span
            style="padding:5px 20px;background:#07c4a8;border-radius:20px;margin-left:20px"
            v-if="cardData.kind=='2'"
          >充值卡</span>
        </p>
        <div>
          <p>
            <span>卡编号：{{cardData.number}}</span>
            <span v-if="cardData.kind!='2'" style="margin-left:40px">卡卖价：￥{{cardData.amount}}</span>
            <span v-if="cardData.kind=='2'" style="margin-left:40px">充值金额：￥{{cardData.amount}}</span>
            <span v-if="cardData.kind=='2'" style="margin-left:40px">赠送金额：￥{{cardData.amountOrigin}}</span>
          </p>
          <p>
            有效期：
            <span v-if="cardData.valid=='0'">永久有效</span>
            <span
              v-if="cardData.endTime!=undefined"
            >{{cardData.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
          </p>
          <p>使用规则：{{cardData.description}}</p>
        </div>
        <div>
          <p v-if="cardData.amountLeft>0&&cardData.kind=='1'">
            所获特权：
            <span style="margin-left:40px">全场通用</span>
            <span style="margin-left:40px">折扣：{{cardData.amountLeft}}折</span>
          </p>
          <el-table
            v-if="cardData.kind=='0'"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="cardtabledata"
            tooltip-effect="dark"
            class="table"
            ref="cardtabledata"
          >
            <el-table-column label="适用项目" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.massageTitle}}</p>
              </template>
            </el-table-column>
            <el-table-column label="初始次数" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.useTimes}}</p>
              </template>
            </el-table-column>
            <el-table-column label="剩余次数" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.timesLeft}}</p>
              </template>
            </el-table-column>
            <el-table-column label="有效期" align="center">
              <p v-if="cardData.valid=='0'">永久有效</p>
              <p
                v-if="cardData.endTime!=undefined"
              >{{cardData.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
            </el-table-column>
          </el-table>
          <el-table
            v-if="cardData.kind=='1'"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="cardtabledata"
            tooltip-effect="dark"
            class="table"
            ref="cardtabledata"
          >
            <el-table-column label="适用项目" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.massageTitle}}</p>
              </template>
            </el-table-column>
            <el-table-column label="折扣" align="center">
              <template slot-scope="scope">
                <p>{{scope.row.discount}}</p>
              </template>
            </el-table-column>
            <el-table-column label="有效期" align="center">
              <p v-if="cardData.valid=='0'">永久有效</p>
              <p
                v-if="cardData.endTime!=undefined"
              >{{cardData.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
            </el-table-column>
          </el-table>

          <el-table v-if="cardData.kind!=0" v-loading="loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="cardtabledata" tooltip-effect="dark" class="table" style="width: 100%">
            <el-table-column prop="amount" label="金额" v-if="cardData.kind==2">
              <template slot-scope="scope">
                ￥{{scope.row.amount}}
              </template>
            </el-table-column>
            <el-table-column prop="amountLeft" label="剩余金额" v-if="cardData.kind==2">
              <template slot-scope="scope">
                {{scope.row.amountLeft}}
              </template>
            </el-table-column>
            <el-table-column prop="massageTitle" label="项目名称" v-if="cardData.kind==1">
              <template slot-scope="scope">
                【{{scope.row.massageTitle}}】 单价:￥{{scope.row.massagePrice}}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="折扣" v-if="cardData.kind==1">
              <template slot-scope="scope">
                {{scope.row.amount}}折
              </template>
            </el-table-column>
            <el-table-column prop="massagePrice" label="折后价格" v-if="cardData.kind==1">
              <template slot-scope="scope">
                {{((scope.row.massagePrice*scope.row.amount)/10)}}
              </template>
            </el-table-column>

            <el-table-column prop="initTime" label="操作时间">
              <template slot-scope="scope">
                {{scope.row.initTime|dateformat}}
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" v-if="cardData.kind==2">
              <template slot-scope="scope">
                {{scope.row.note}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="totalCount" @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
              :current-page="pageNo" :page-sizes="[5, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      dialogVisible: false,
      dialogFormVisible: false,
      id: "",
      form: {
        endTime: ""
      },
      formLabelWidth: "120px",

      cardid: "",
      goodsData: [],
      carddetail: {goods:[]},
      cardselllist: [],
      currentPage: 1, // 当前页
      pageSize: 3, // 每页条数
      total: 0, // 数据总条数
      cardData: {},
      cardtabledata: [],
      pageSize:5,
      pageNo:1,
      totalCount:0,
      loading:false,
      item:{},
    };
  },
  methods: {
    getCardLog(){
      // /vipcard/logs
      var params = {userId:this.item.userId,cardId:this.item.id,pageSize:this.pageSize,pageNo:this.pageNo};
      this.loading=true;
      this.req.post("/vipcard/logs", params).then(res => {
        this.loading=false;
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.cardtabledata = res.data.data.logs;
          this.totalCount = res.data.data.count;
        }else{
          this.$$message.error(res.data.sub_msg);
        }
      })
    },
    sizeChange(size){
        this.pageSize = size;
        this.pageNo = 1;
        this.loading=true;
        this.getCardLog();
    },
    pageNoChange(pageNo){
        this.pageNo = pageNo;
        this.loading=true;
        this.getCardLog();
    },
    getcarddetail() {
      let params = {
        cardId: this.$route.query.cardId
      };
      this.req.post("/vipcard/edit", params).then(res => {
          this.carddetail = res.data.data;
          this.goodsData = res.data.data.goods;
          // this.total = res.data.data.totalCount;
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getcardselllist() {
      let params = {
        storeVipcardId: this.$route.query.cardId,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.req
        .post("/vipcard/list/user", params)
        .then(res => {
          this.cardselllist = res.data.data.resultList;
          this.total = res.data.data.totalCount;
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
      this.getcardselllist(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getcardselllist(); // 调用分页函数
    },
    // 修改有效期
    setdata(index, row) {
      this.id = row.id;

      this.dialogFormVisible = true;
    },
    savedata(index, row) {
      let params = {
        id: this.id,
        endTime: this.form.endTime
      };
      this.req
        .post("/vipcard/user/update/validate", params)
        .then(res => {
          console.log(this.cardData);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogFormVisible = false;
            this.getcardselllist();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    gomemberdetails(index, row) {
      let params = {
        id: row.id
      };
      this.req.post("/vipcard/user/detail", params).then(res => {
        this.cardData = res.data.data;
          this.cardtabledata = res.data.data.goods;
          if(row.kind!=0){
            this.item = row;
            this.getCardLog();
          }
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
    }
  },
  created() {
    this.getcarddetail();
    this.getcardselllist();
  },
  computed: {
    timeNow() {
      return moment()
        .utc()
        .valueOf();
    }
  }
};
</script>

<style scoped>
.card-list {
  display: flex;
}
.card-style {
  width: 400px;
  background: rgb(235, 152, 44);
  height: 240px;
  border-radius: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.card-item {
  display: inline-block;
  display: flex;
  padding: 10px;
  font-size: 14px;
}
.card-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
