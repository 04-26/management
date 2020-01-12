<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>优惠券</span>
      </div>
      <div>
        <!-- 上半部分 -->
        <el-row>
          <el-col class="bookingtop-left" :span="10">
            <p>发放优惠券，吸引顾客到店消费。</p>
            <p>可创建折扣劵、满减劵、现金券，多种优惠方式吸引顾客到店消费</p>
            <p class="left-p2">
              <el-popover title="活动规则" placement="right" width="400" trigger="click">
                <div>
                  <p>1.顾客可凭券在用户下单支付时使用，亦可面对面支付时使用。</p>
                  <p>2.每笔订单只能使用一张优惠券。</p>
                  <p>3.优惠券不能与会员折扣、会员卡抵扣、等其它优惠条件同时使用。</p>
                  <p>4.订单如果发生退款，优惠券不支持退回。</p>
                </div>
                <el-button slot="reference">规则说明</el-button>
              </el-popover>
              <span>使用教程</span>
              <span>活动案例</span>
            </p>
            <p>
              <router-link to="/adddiscountcoupon" class="btn btn-success">新建优惠券</router-link>
            </p>
          </el-col>
        </el-row>
        <!-- 下半部分 -->
        <div>
          <div
            class="booking-bottom"
            style="display:flex;justify-content: space-between;"
          >
            <div style="display:flex">
              <p class="bottom-item">
                <span class="bordernone" @click="getall()">全部</span>
              </p>
              <el-select
                style="width:100px;margin-left:10px"
                v-model="ontype"
                placeholder="--状态--"
                @change="getontype"
              >
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="2"></el-option>
              </el-select>
              <el-select
                style="width:100px"
                v-model="coupontype"
                placeholder="--类型--"
                @change="getcoupontype"
              >
                <el-option label="满减券" value="1"></el-option>
                <el-option label="折扣券" value="2"></el-option>
                <el-option label="现金券" value="4"></el-option>
              </el-select>
            </div>
            <div>
              <el-input type="text" placeholder="请输入优惠券名称" v-model="keywords" style="display:inline-block;width:160px;"></el-input>
              <el-button type="primary" @click="getkeywords" style="display:inline-block;">搜索</el-button>
            </div>
          </div>
          <el-table
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="优惠券名称" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用有效期" width="400">
              <template slot-scope="scope">
                <p v-if="scope.row.endTime!=undefined">
                  <span>{{ scope.row.valstartTimeidate|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>至
                  <span
                    style="margin-left: 10px"
                  >{{ scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                </p>

                <span
                  v-if="scope.row.endTime==undefined||scope.row.validate!='0'"
                >领到券当日开始{{scope.row.validate}}天内有效</span>
                <span v-if="scope.row.validate=='0' || (scope.row.endTime!=undefined && $moment().isAfter(scope.row.endTime))">(已到期)</span>
              </template>
            </el-table-column>
            <el-table-column label="类别" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.type=='1'" style="margin-left: 10px">满减券</span>
                <span v-if="scope.row.type=='2'" style="margin-left: 10px">折扣券</span>
                <span v-if="scope.row.type=='4'" style="margin-left: 10px">现金券</span>
              </template>
            </el-table-column>
            <el-table-column label="已领取" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.receiveNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余|总量" width="180">
              <template slot-scope="scope">
                <span
                  style="margin-left: 10px"
                  v-if="scope.row.couponCount>0"
                >{{scope.row.couponCount-scope.row.receiveNum}}/{{ scope.row.couponCount }}</span>
                <span v-if="scope.row.couponCount=='0'" style="margin-left: 10px">无限制</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  type="primary"
                >编辑</el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.status=='1'"
                  @click="changgestats(scope.$index, scope.row)"
                  type="danger"
                >禁用优惠券</el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.status=='2'"
                  @click="changgestats(scope.$index, scope.row)"
                  type="success"
                >启用优惠券</el-button>
                <el-button size="mini" @click="resivenum(scope.$index, scope.row)" type="info" v-if="scope.row.status==1">已领取量</el-button>
                <el-button size="mini" @click="sendCoupon(scope.row)" type="success" v-if="scope.row.status==1">发放</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-dialog title="拼团活动详情" :visible.sync="centerDialogVisible" width="50%" center>
            <div>
              <p>活动名称：{{dogdata.name}}</p>
              <p>活动时间：{{ dogdata.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}至{{ dogdata.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
              <p>选择项目：{{dogdata.name}}</p>
              <p>活动限购：{{dogdata.name}}</p>
              <p>拼团有效期：{{dogdata.name}}</p>
              <p>模拟成团：{{dogdata.name}}</p>
              <p>走马灯设置：{{dogdata.name}}</p>
              <p>成团人数：{{dogdata.name}}</p>
              <p>已参与拼团人数：{{dogdata.name}}</p>
              <p>成团价格：{{dogdata.name}}</p>
              <p>活动规则：{{dogdata.name}}</p>
              <p>活动介绍：{{dogdata.name}}</p>
              <p>温馨提示：{{dogdata.name}}</p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>-->
          <!-- 分页 -->
          <div style="margin-top: 20px;text-align:center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 3, 5,9, 10, 30]"
              :page-size="9"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
          <!-- 编辑模态框 -->
          <el-dialog title="编辑优惠券" :visible.sync="dialogFormVisible">
            <el-form :model="eidtform">
              <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="eidtform.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="活动时间">
                <el-date-picker
                  v-model="Timelist"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="领取多少天失效" :label-width="formLabelWidth">
                <el-input v-model="eidtform.validate" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="发放优惠券总数" :label-width="formLabelWidth">
                <el-input v-model="eidtform.couponCount" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="每次发放多少张" :label-width="formLabelWidth">
                <el-input v-model="eidtform.sendNum" autocomplete="off"></el-input>
              </el-form-item>
              <!-- <el-form-item label="优惠券前台发放位置" :label-width="formLabelWidth">
                <el-checkbox-group v-model="eidtform.recvPos">
                  <el-checkbox label="1">进店首页弹窗</el-checkbox>
                  <el-checkbox label="2">领劵页面领取</el-checkbox>
                  <el-checkbox label="3">抽奖页面</el-checkbox>
                </el-checkbox-group>
              </el-form-item> -->
              <el-form-item label="优惠券规则" :label-width="formLabelWidth">
                <el-input show-word-limit maxlength="200" type="textarea" :rows="4" v-model="eidtform.note"></el-input>
              </el-form-item>
              <el-form-item label="" v-if="eidtform.useType!=0">
                  <el-table :data="items" style="width: 600px;" v-if="items.length>0">
                    <el-table-column prop="title" label="名称" width="200">
                    </el-table-column>
                    <el-table-column prop="price" label="价格" width="200">
                    </el-table-column>
                  </el-table>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveEidt">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-card>
    <el-dialog title="发送优惠券" :visible.sync="userDiavisble" width="800px">
      <div>
        <div class="search-head">
            <el-input v-model="ukeywords" placeholder="请输入搜索关键字">
                <template slot="append">
                    <div>
                        <el-button type="info" icon="el-icon-search" @click="search">搜索</el-button>
                    </div>
                </template>
            </el-input>
        </div>
        <el-table :data="userList" style="width: 100%"  @selection-change="selUserChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="telphone" label="用户信息">
          </el-table-column>
          <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <div>
                  <el-button type="primary" @click="sendCouponDo(scope.row)">发放</el-button>
                </div>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="msizeChange" @current-change="mpageNoChange" style="margin:10px auto;text-align:center;" 
            :current-page="mpageNo" :page-sizes="[5, 10, 30]" :page-size="mpageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="mtotalCount">
        </el-pagination>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button @click="userDiavisble = false">取 消</el-button>
        <el-button type="primary" @click="multiSend">批量发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 9, // 每页条数
      total: 0, // 数据总条数
      centerDialogVisible: false,
      dogdata: [],
      eidtform: {
        title: "", //优惠券名称
        validate: "", //领取后多少天失效
        endTime: "",
        startTime: "",
        couponCount: "", //发放优惠券总数1
        note: "", //优惠券规则说明1,
        sendNum: "", //每次发放多少张，0-不限制1
        recvPos: [] //优惠券前台发放位置，1=进店首页弹窗，2=支付页面,3=抽奖页面 1
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      content: "",
      html: "",
      filename: "file",
      Timelist: [],
      ontype: "",
      coupontype: "",
      keywords: "",
      items:[],
      userDiavisble:false,
      currentCoupon:{},
      mpageSize:10,
      mpageNo:1,
      mtotalCount:0,
      userList:[],
      ukeywords:'',
      mloading:false,
      multiSendUser:[],
    };
  },
  methods: {
    //编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.eidtform = row;
      this.eidtform.recvPos = [];
      // localStorage.setItem('couponId',row.id);
      // this.$router.push({path:"/adddiscountcoupon"})
    },
    //保存编辑
    saveEidt() {
      let params = {
        id: this.eidtform.id,
        title: this.eidtform.title, //优惠券名称
        validate: this.eidtform.validate, //领取后多少天失效
        endTime: this.Timelist[1],
        startTime: this.Timelist[0],
        couponCount: this.eidtform.couponCount, //发放优惠券总数1
        note: this.eidtform.note, //优惠券规则说明1,
        sendNum: this.eidtform.sendNum, //每次发放多少张，0-不限制1
        recvPos: this.eidtform.recvPos, //优惠券前台发放位置，1=进店首页弹窗，2=支付页面,3=抽奖页面 1
        storeid: window.localStorage.getItem("shopid")
      };
      console.log(params);
      this.req
        .post("/coupon/save", params)
        .then(res => {
          console.log(res);
          this.dialogFormVisible = false;
          this.getgroupbooking();
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // //查看详情
    // handlewatch(index, row) {
    //   console.log(index, row);
    //   this.centerDialogVisible = true;
    //   this.dogdata = row;
    // },
    changgestats(index, row) {
      if (row.status == "1") {
        var status = 2;
      } else if (row.status == "2") {
        var status = 1;
      }
      let params = {
        status,
        id: row.id
      };
      this.req
        .post("/coupon/upstatus", params)
        .then(res => {
          console.log(res);

          this.getgroupbooking();
          if (res.data.sub_code == "SUCCESS") {
            this.$message({
              type: "success",
              message: "优惠券状态修改成功"
            });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getall() {
      this.coupontype = "";
      this.ontype = "";
      this.keywords = "";
      this.getgroupbooking();
    },
    getontype() {
      // this.coupontype = "";
      this.keywords = "";
      this.getgroupbooking();
    },
    getcoupontype() {
      // this.ontype = "";
      this.keywords = "";
      this.getgroupbooking();
    },
    getkeywords() {
      this.coupontype = "";
      this.ontype = "";
      this.currentPage = "1";
      this.getgroupbooking();
    },
    getgroupbooking() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        shopId: window.localStorage.getItem("shopid"),
        type: this.coupontype,
        status: this.ontype,
        keywords: this.keywords
      };
      this.req
        .post("/coupon/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
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
      this.getgroupbooking(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getgroupbooking(); // 调用分页函数
    },
    suss(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.form.imageUrl = response.data;
      console.log(this.form.imageUrl);
    },
    resivenum(index, row) {
      this.$router.push({
        name: "resivenum",
        query: {
          couponId: row.id
        }
      });
      // let params = {
      //   couponId: row.id
      // };
      // this.req
      //   .post("/coupon/usercoupon", params)
      //   .then(res => {
      //     console.log(res);

      //     if (res.data.sub_code == "SUCCESS") {
      //     } else {
      //       this.$message.error(res.data.sub_msg);
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    sendCoupon(item){
      this.currentCoupon = item;
      this.userDiavisble = true;
      this.multiSendUser = [];
      this.getUserList();
    },
    sendCouponDo(item){
      var param = {couponId:this.currentCoupon.id,userId:item.id};
      // /coupon/sendusercoupon
      this.loading = true ;
      this.req.post("/coupon/sendusercoupon",param).then(res=>{
        this.loading = false ;
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.$message.success('操作成功');
          this.userDiavisble = false;
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getUserList(){
      var param = {pageSize:this.mpageSize,pageNo:this.mpageNo};
      if(this.ukeywords.length>0){
          param.keyword = this.ukeywords;
      }
      this.req.post('/userinfo/list',param).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.userList = res.data.data.resultList;
          this.mtotalCount = res.data.data.totalCount;
        }
      })
    },
    msizeChange(size){
        this.mpageSize = size;
        this.mpageNo = 1;
        this.mloading=true;
        this.getUserList();
    },
    mpageNoChange(pageNo){
        this.mpageNo = pageNo;
        this.mloading=true;
        this.getUserList();
    },
    search(){
        this.mpageNo = 1;
        this.mloading=true;
        this.getUserList();
    },
    selUserChange(val){
      this.multiSendUser = val;
    },
    multiSend(){
      // 批量发送
      if(this.multiSendUser.length==0){
        this.$message.error('请选择要发送的用户');
        return ;
      }
      var length = 0;
      this.multiSendUser.forEach(item=>{
        if(item.id){
          this.sendCouponDo(item);
          length++;
        }
      });
      this.$message.success('成功发送'+length+'个用户');
      this.userDiavisble = false;
    }
  },
  components: {
    mavonEditor
  },
  created() {
    this.getgroupbooking();
  },
  activated() {
    this.getgroupbooking();
  }
};
</script>

<style scoped>
.bookingtop-left > p {
  line-height: 40px;
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
</style>