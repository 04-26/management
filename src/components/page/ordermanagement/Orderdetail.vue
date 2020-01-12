<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>订单管理/订单详情</span>
      </div>
      <div>
        <div>
          <div>
            <h3>订单信息</h3>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='1'">订单状态：待支付</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='2'">订单状态：已支付（待接单）</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='3'">订单状态：已预约</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='4'">订单状态：已确认（待服务）</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='5'">订单状态：待支付（待结束）</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='6'">订单状态：服务完成（待评价）</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='7'">订单状态：申请退款</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='8'">订单状态：已完成</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='-1'">订单状态：订单取消</p>
            <p style="line-height:30px" v-if="detaildata.orderStatus=='-2'">订单状态：订单取消</p>
            <p style="line-height:30px">订单编号：{{detaildata.orderno}}</p>
            <p style="line-height:30px"
              v-if="detaildata.completeTime!=undefined"
            >完成时间：{{detaildata.completeTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <p style="line-height:30px"
              v-if="detaildata.payTime!=undefined"
            >收款时间：{{detaildata.payTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <p>下单时间：{{detaildata.initTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <p style="line-height:30px"
              v-if="detaildata.bookTime!=undefined"
            >预约时间：{{detaildata.bookTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <p v-if="detaildata.customerName!=undefined" style="line-height:30px">到店人姓名：{{detaildata.customerName}}</p>
            <p style="line-height:30px">到店人电话：{{detaildata.telphone}}</p>

            <p style="line-height:30px">备注：{{detaildata.remark}}</p>
            <p>
              <el-button type="primary" size="mini" @click="getremark(detaildata.orderno)">修改备注</el-button>
            </p>
          </div>
          <div style="margin-top:20px">
            <h3>用户信息</h3>
            <div style="display:flex;">
              <img
                style="width:50px;height:50px;border-radius:50%"
                :src="detaildata.userinfo.avatar|avatar"
                alt="#"
              />
              <div>
                <p>{{detaildata.userinfo.nick}}</p>
                <p>{{detaildata.userinfo.telphone}}</p>
              </div>
            </div>
          </div>
          <div style="margin-top:20px">
            <h3>消费信息</h3>
            <div>
              <el-table :data="getArrData(detaildata)" style="width: 100%" default-expand-all v-if="getArrData(detaildata).length>0">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="单价：">
                        <span>￥{{ props.row.skuList[0].price }}</span>
                      </el-form-item><br>
                      <el-form-item v-if="props.row.paymentId!=undefined" label="付款：">
                        <span v-if="props.row.paymentId=='0'">到店支付</span>
                      <span v-if="props.row.paymentId=='1'">微信支付</span>
                      <span v-if="props.row.paymentId=='2'">钱包支付</span>
                      <span v-if="props.row.paymentId=='3'">会员卡支付</span>
                      <span v-if="props.row.paymentId=='4'">会员卡支付</span>
                      </el-form-item><br>
                      <el-form-item v-if="props.row.paymentId=='4'||props.row.paymentId=='3'"  label="会员卡号：">
                        <span>{{props.row.usevipcard.number}}</span>
                      </el-form-item><br>
                      <el-form-item label="折扣金额：">
                      <span v-if="props.row.discountAmount!=0">￥-{{props.row.discountAmount}}</span>
                      <span v-if="props.row.usecouponamount!=0">￥-{{props.row.usecouponamount}}</span>
                      <span v-if="props.row.usevipcard.kind==0">/次卡</span>
                      <span v-if="props.row.usevipcard.kind==1">/折扣卡</span>
                      <span v-if="props.row.usevipcard.kind==2">/充值卡</span>
                      </el-form-item><br>
                      <el-form-item label="合计收款：">
                      <span>￥{{props.row.payAmount}}</span>
                      </el-form-item><br>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品">
                  <template slot-scope="scope">
                    <div style="margin-left: 10px;display:flex;">
                      <img
                        style="width:60px;height:60px;border-radius:50%"
                        :src="$imgurl()+scope.row.skuList[0].imgurl"
                        alt="#"
                      />
                      <div>
                        <p style="line-height:60px;padding-left:10px">{{ scope.row.skuList[0].productName }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单价">
                  <template slot-scope="scope">
                    <span>{{ scope.row.skuList[0].price }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    <span>x{{ scope.row.skuList[0].quantity }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="手艺人">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.userWorker.userName!=''"
                      style="margin-left: 10px"
                    >{{ scope.row.userWorker.userName }}</span>
                    <span v-if="scope.row.userWorker.userName==undefined" style="margin-left: 10px">--</span>
                  </template>
                </el-table-column>
                <el-table-column label="用户备注">
                  <template slot-scope="scope">
                    <span>{{scope.row.userMessage}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="小计">
                  <template slot-scope="scope">
                    <span>{{scope.row.skuList[0].price*scope.row.skuList[0].quantity}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 备注 -->
    <el-dialog title="订单备注" :visible.sync="dialogFormVisible">
      <el-input
        show-word-limit maxlength="100"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="remark"
        autocomplete="off"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarksave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MallOrderDetail from '@/components/page/ordermanagement/MallOrderDetail.vue'
export default {
  data() {
    return {
      detaildata: {userinfo:{avatar:'',userName:''},userWorker:{userName:''},usevipcard:{kind:''},skuList:[
        {
          discount: '',
          displaySpecifications: "",
          imgurl: "",
          initTime: '',
          itemType: 1,
          orderNo: "",
          originalPrice: 0,
          price: 0,
          productCode: '',
          productId: '',
          productName: "",
          productSkuId: 0,
          quantity: 1,
          specialitem: 0,
          status: 0,
          subTotal: '',
          supplierPrice: '',
          times: ''}]},
      dialogFormVisible: false,
      remark: "",
      orderno: ""
    };
  },
  created() {
    if(localStorage.getItem('detailnumber')){
      this.orderno = localStorage.getItem('detailnumber');
    }
    this.getorderdetail();
  },
  methods: {
    getorderdetail() {
      let params = {
        orderNo: window.localStorage.getItem("detailnumber")
      };
      this.req
        .post("/order/detail", params)
        .then(res => {
          console.log(res);
          this.detaildata = res.data.data ;
          if( this.detaildata.usevipcard==undefined){

this.detaildata.usevipcard=''
          }
          console.log(this.detaildata);
          if (this.detaildata.userWorker == undefined) {
              return (this.detaildata.userWorker = "");
            }
            if (this.detaildata.userinfo.avatar.indexOf("http") != -1) {
              this.avnum;
            } else if (this.detaildata.userinfo.avatar.indexOf("http") == -1) {
              !this.avnum;
            }
            if (this.detaildata.skuList[0].imgurl.indexOf("http") != -1) {
              this.imgnum = 0;
            } else if (this.detaildata.skuList[0].imgurl.indexOf("http") == -1) {
              this.imgnum = 1;
            }
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
           if (this.detaildata.userinfo == undefined) {
              return (this.detaildata.userinfo = "");
            }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 打开备注
    getremark(orderno) {
      this.orderno = orderno;
      this.dialogFormVisible = true;
    },
    // 备注
    remarksave() {
      let params = {
        orderNo: this.orderno,
        remark: this.remark
      };
      this.req
        .post("/order/remark", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getorderdetail();
            this.$message({
              type: "success",
              message: "备注成功"
            });
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getArrData(item){
      return [item];
    }
  },
  components:{
    MallOrderDetail,
  }
};
</script>
<style scoped>
</style>
