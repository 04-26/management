<template>
  <div>
    <el-card>
      <div slot="header">详情</div>
      <div>
        <div class="step">
          <el-steps :active="2" align-center process-status="wait">
            <el-step title="买家申请维权" :description="refdetail.initTime|dateformat"></el-step>
            <el-step title="商家处理申请" :description="refdetail.confirmTime|dateformat"></el-step>
            <el-step title="处理完成" :description="refdetail.shipTime|dateformat"></el-step>
          </el-steps>
        </div>
        <el-row :gutter="10" style="margin:15px 0 0;">
          <el-col :span="6" style="height:auto;">
            <div class="right">
              <div v-for="(item,index) in refdetail.itemList" :key="index" style="border-bottom:1px solid #eee;margin-top:5px;padding:5px;">
                <img :src="item.sku.imgurl|avatar" style="width:45px;height:45px;" />
                <div style="display:inline-block;margin-left:10px;vertical-align: bottom;">
                  <div>{{str(item.sku.productName)}}</div>
                  <div>{{item.sku.displaySpecifications}}&nbsp;&nbsp;&nbsp;{{item.sku.quantity?'x'+item.sku.quantity:''}}</div>
                </div>
              </div>
              <hr>
              <div class="rigth-cnt">
                <div>申请内容：<el-tag type="success">{{refdetail.type==1?'仅退款':'退款退货'}}</el-tag></div>
                <div>退款金额：<el-tag type="success">￥{{refdetail.returnAmount}}元</el-tag></div>
                <div>退款原因：{{refdetail.returnReason}}</div>
                <div>退款编号：{{refdetail.returnNo}}</div>
                <div>订单编号：{{refdetail.orderNo}}</div>
                <div>付款时间：{{refdetail.initTime|dateformat}}</div>
                <div>买家：{{orderDetail.userinfo.realName}}</div>
                <div v-for="(ship,index) in shipList" :key="index">
                  <div>物流信息：{{ship.corpname?ship.corpname:'订单还未发货'}}</div>
                  <div>物流单号：{{ship.logisticsNo?ship.logisticsNo:'订单还未发货'}} <el-tag type="success" style="cursor:pointer;" v-if="ship.logisticsNo" @click="lookShip">查看</el-tag></div>
                </div>
                <div v-if="shipList.length==0">
                  <div>物流信息：订单还未发货</div>
                  <div>物流单号：订单还未发货</div>
                </div>
                <div>运     费：{{orderDetail.postage}}元</div>
                <div>合计优惠：{{orderDetail.discountAmount}}元</div>
                <div>实付金额：{{orderDetail.totalAmount}}元</div>
              </div>
            </div>
          </el-col>
          <el-col :span="18" style="height:425px;">
              <div class="right-infos">
                  <div style="padding:15px;" class="right-info" v-if="refdetail.status<10">
                      <i class="el-icon-warning" style="color:red;font-size:24px;"></i>
                      <div class="right-info-right">
                          <h4>等待商家处理退款</h4>
                          <div>收到买家仅退款申请，请尽快处理</div>
                          <div v-if="false">请在<el-tag>{{refdetail.initTime|checkTime}}6天22小时04分钟25秒</el-tag>处理本次退款，如逾期未处理，将自动同意退款。</div>
                          <div>
                              <el-button type="primary" @click="checkRefund()">同意退款</el-button>
                              <el-button type="warning" @click="resoaRefund()">拒绝退款</el-button>
                          </div>
                      </div>
                  </div>
                  <div style="padding:15px;" class="right-info" v-if="refdetail.status==10">
                      <i class="el-icon-success" style="color:green;font-size:24px;"></i>
                      <div class="right-info-right">
                          <h4>退款成功</h4>
                          <div>退款金额：{{refdetail.returnAmount}}元 </div>
                      </div>
                  </div>
                  <div style="padding:15px;" class="right-info" v-if="refdetail.status==11">
                      <i class="el-icon-warning" style="color:red;font-size:24px;"></i>
                      <div class="right-info-right">
                          <h4>拒绝退款</h4>
                          <div>拒绝原因：{{refdetail.refuseReason}} </div>
                      </div>
                  </div>
                  <div style="padding:15px;" class="right-info" v-if="refdetail.status==12">
                      <i class="el-icon-error" style="color:red;font-size:24px;"></i>
                      <div class="right-info-right">
                          <h4>已取消申请退款</h4>
                      </div>
                  </div>
                  <div class="tps">
                      <Notes content="温馨提示： <br/>如果你同意，将直接退款给买家。 <br/>如果你拒绝，买家可以要求平台介入处理。 <br/>如果你逾期未处理，视作同意买家申请，系统将自动退款给买家。"></Notes>
                  </div>
              </div>
          </el-col>
        </el-row>
        <div class="info" v-for="(ship,index) in shipList" :key="index">
          <el-tabs type="card" v-if="showShip" v-model="activeName">
            <el-tab-pane label="发货物流信息" name="first">
              <el-row :gutter="10">
                <el-col :span="8">
                  <div>发货方式：快递配送</div>
                  <div>发货时间：{{ship.initTime|dateformat}}</div>
                  <div>快递公司：{{ship.corpname}}</div>
                  <div>运单号：{{ship.logisticsNo}}</div>
                </el-col>
                
                <el-col :span="16" class="time">
                  <div>物流状态：<el-tag type="warning">{{ship.status|shipStatus}}</el-tag></div>
                    <el-steps direction="vertical" :active="ship.response.length">
                      <el-step :title="step.AcceptStation" :description="step.AcceptTime|dateformat" v-for='(step,index) in ship.response' :key="index"></el-step>
                      <el-step title="等待收货"></el-step>
                    </el-steps>
                </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
          <div class="info" v-if="refdetail.trackingTrace.length>0">
            <el-tabs type="card" v-model="activeName2">
              <el-tab-pane label="退货物流信息" name="first">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div>发货方式：快递配送</div>
                    <div>发货时间：{{refdetail.shipTime|dateformat}}</div>
                    <div>快递公司：{{refdetail.corpname}}</div>
                    <div>运单号：{{refdetail.logisticsNo}}</div>
                  </el-col>
                  
                  <el-col :span="16" class="time">
                    <div>物流状态：<el-tag type="warning" v-if="false">{{refdetail.status|shipStatus}}</el-tag></div>
                      <el-steps direction="vertical" :active="refdetail.trackingTrace.length">
                        <el-step :title="step.AcceptStation" :description="step.AcceptTime|dateformat" v-for='(step,index) in refdetail.trackingTrace' :key="index"></el-step>
                        <el-step title="等待收货"></el-step>
                      </el-steps>
                  </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
    <el-dialog title="确认拒绝退款申请" :visible.sync="dialogVisible" width="500px" class="resoan" :click-modal='false'>
      <div>
        <Notes content="建议你与买家协商后，再确定是否拒绝退款。如你拒绝退款后，买家可重新发起退款。 也可直接发起维权申请，将会由平台介入处理。" color="#FF9900" padding="0"></Notes>
        <el-row :gutter="10">
          <el-col :span="8">处理方式：仅退款</el-col>
          <el-col :span="8">退款金额：{{refdetail.returnAmount}}</el-col>
          <el-col :span="8">退货数量：{{nums}}</el-col>
        </el-row>
        <div>拒绝理由：</div>
        <el-input type="textarea" v-model="refuseReason" placeholder="请输入拒绝原因（字数限制150个）"></el-input>
        
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkRefundOk">拒 绝</el-button>
      </div>
    </el-dialog>
    <el-dialog title="同意维权" :visible.sync="dialogVisibleOk" width="500px" class="resoan" :click-modal='false'>
      <div>
        <Notes content="该笔订单通过 “微信支付” 付款， 需你同意退款申请，买家才能退货给你； 买家退货后你需再次确认收货后，退款将自动原路退回至买家付款账户；" color="#FF9900" padding="0"></Notes>
        <el-row :gutter="10">
          <el-col :span="8">处理方式：仅退款</el-col>
          <el-col :span="8">退款金额：{{refdetail.returnAmount}}</el-col>
          <el-col :span="8">退货数量：{{nums}}</el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisibleOk = false">取 消</el-button>
        <el-button type="primary" @click="checkOk">同 意</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Notes from '@/components/page/mall/Notes.vue';
import helper from '@/utils/helper';
export default {
  name: "MallRefundOrderDetail",
  data() {
    return {
      refdetail:{},
      dialogVisible:false,
      dialogVisibleOk:false,
      refuseReason:'',
      status:-1,
      product:{},
      orderDetail:{userinfo:{realName:''}},
      nums:0,
      ships:[],
      shipList:[],
      showShip:false,
      returnShipList:[],
      activeName:'first',
      activeName2:'first'
    };
  },
  created(){
    if(localStorage.getItem('refdetail')){
      this.refdetail = JSON.parse(localStorage.getItem('refdetail'));
    }
    if(this.$route.query.id){
      this.getRefundDetail();
    }
  },
  methods: {
    lookShip(){
      this.showShip = true;
    },
    str(val){
      return helper.substr(val,0,10);
    },
    getRefundDetail(){
      // /orderreturn/detail
      var param = {id:this.$route.query.id};
      this.req.post("/orderreturn/detail",param).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.refdetail = res.data.data;
          if(res.data.data.trackingTrace){
            try{
              this.refdetail.trackingTrace = JSON.parse(res.data.data.trackingTrace);
            }catch(e){
              this.refdetail.trackingTrace = [];
            }
          }else{
            this.refdetail.trackingTrace = [];
          }
          this.getOrderDetail();
          // this.getShips();
          this.refdetail.itemList.forEach(item=>{
            this.nums +=item.quantity;
            if(item.orderProductId = this.$route.query.productId){
              this.product = item.sku;
            }
          })
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getOrderDetail(){
      var param = {orderNo:this.refdetail.orderNo};
      this.req.post("/order/detail",param).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.orderDetail = res.data.data;
          this.getShip();
        }
      })
    },
    getShips(){
      // /order/getship
      var param = {orderNo:this.refdetail.id};
      this.req.post("/orderreturn/detail",param).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.returnShipList = res.data.data;
        }
      })
    },
    checkRefund(){
      this.dialogVisibleOk=true;
    },
    resoaRefund(){
      this.dialogVisible=true;
    },
    checkRefundOk(){
      this.status=2;
      this.subData();
    },
    checkOk(){
      this.status=1;
      this.subData();
    },
    subData(){
      // /orderreturn/confirmorder
      var params = {returnid:this.refdetail.id,status:this.status,refuseReason:''};
      if(this.status==2){
        if(this.refuseReason.length>150 || this.refuseReason.length==0){
          this.$message.error('请在150字以内描述拒绝原因');
          return ;
        }
        params.refuseReason = this.refuseReason;
      }
      this.req.post("/orderreturn/confirmrefundorder",params).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.$message.success('操作成功');
          this.dialogVisibleOk=false;
          this.status=-1;
          this.getRefundDetail();
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getShip(){
      // /order/getship
      var param = {orderNo:this.orderDetail.orderno};
      this.req.post("/order/getship",param).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          if(res.data.data){
            this.shipList = res.data.data;
            this.shipList.forEach(item=>{
              item.response = item.response?JSON.parse(item.response):[];
              item.response = item.response.reverse();
            })
          }
        }
      })
    }
  },
  filters:{
    checkTime(v){
      // 倒计时
    },
    shipStatus(val){
        // status 1-已发货，2-在途中,3-签收,4-问题件
        if(val==1){
          return '已发货';
        }
        if(val==2){
          return '在途中';
        }
        if(val==3){
          return '已签收';
        }
        if(val==4){
          return '问题件';
        }
      },
  },
  components:{
      Notes
  }
};
</script>
<style scoped>
h4{padding:0;margin:0;font-weight:600;}
.step{padding:15px;border:1px solid #eee;}
.right{padding:15px;border:1px solid #ccc;border-radius:5px}
.rigth-cnt div{margin:5px 0px 0px;}
.right-infos{display:flex;flex-direction: column;justify-content:space-between;height:100%;}
.right-info{display:flex;justify-content:flex-start;align-items:flex-start}
.right-info-right{margin-left:15px;}
.right-info-right div{margin:5px 0px 0px;}
.right-info-right div:nth-child(4){margin:15px 0px 0px;}
.tps{border-top:1px dashed #ccc;}
.resoan >>> .el-dialog__body{padding:5px 15px;}
.info{text-align:left;box-sizing: border-box;padding:5px 10px;background-clip:content-box;}
.info-title{font-size:14px;font-weight:600;}
.info-footer{text-align:right;box-sizing: border-box;padding:5px 10px;background-clip:content-box;}

</style>