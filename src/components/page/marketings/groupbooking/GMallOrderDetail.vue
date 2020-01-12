<template>
  <div>
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header">
        <span>商品拼团-买家订单详情</span>
      </div>
      <div>
        <el-row :gutter="10" style="padding:5px 15px;">
          <el-col :span="8">订单号：{{orderDetail.orderno}}  </el-col>
          <el-col :span="8">下单时间：{{orderDetail.initTime|dateformat}} </el-col>
          <el-col :span="8">订单类型：商品购买</el-col>
        </el-row>
        <el-row :gutter="10" style="padding:5px 15px;border:1px solid #eee;">
          <el-col :span="6" style="border:1px solid #eee;height:100px;padding:15px;">
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==-2">已取消</h3>
            <div v-if="orderDetail.orderStatus==-2">买家已经取消该订单。</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==-1">已取消</h3>
            <div v-if="orderDetail.orderStatus==-1">买家已经取消该订单。</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==1">待支付</h3>
            <div v-if="orderDetail.orderStatus==1">正在等到买家付款。</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==2">已支付</h3>
            <div v-if="orderDetail.orderStatus==2">请尽快确认付款信息，并发货</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==4">待发货</h3>
            <div v-if="orderDetail.orderStatus==4">等到卖家发货。</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==5">已发货</h3>
            <div v-if="orderDetail.orderStatus==5">等到买家确认收货。</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==6">交易成功</h3>
            <div v-if="orderDetail.orderStatus==6">已将货款结算至你的店铺余额账户，请注意查收</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==7">申请退款中</h3>
            <div v-if="orderDetail.orderStatus==7">买家已经申请退款中</div>
            <h3 style="margin-top:8px;" v-if="orderDetail.orderStatus==8 && orderDetail.refundstatus!=1">已完成</h3>
            <div v-if="orderDetail.orderStatus==8 && orderDetail.refundstatus!=1">买家已签收</div>
          </el-col>
          <el-col :span="18" style="border:1px solid #eee;height:100px;padding:15px;">
            <el-steps :active="process()" align-center process-status="wait">
              <el-step title="买家下单" :description="orderDetail.initTime|dateformat"></el-step>
              <el-step title="买家付款" :description="orderDetail.payTime|dateformat"></el-step>
              <el-step title="商家发货" :description="orderDetail.confirmTime|dateformat"></el-step>
              <el-step title="交易完成" :description="orderDetail.completeTime|dateformat"></el-step>
            </el-steps>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="padding:5px 15px;background:#eee;box-sizing:border-box;background-clip: content-box;">
          <el-col :span="6" v-if="orderDetail.shipType==0">
            <h3 style="margin-top:8px;" class="info-title">收货人信息</h3>
            <div>收货人姓名：{{orderDetail.customerName}}</div>
            <div>联系电话：{{orderDetail.telphone}}</div>
            <div>收货地址：{{orderDetail.address ? orderDetail.address+(orderDetail.door?orderDetail.door:'') : ''}}</div>
          </el-col>
          <el-col :span="6" v-if="orderDetail.shipType!=0">
            <h3 style="margin-top:8px;" class="info-title">自提点信息</h3>
            <div>自提点名：{{orderDetail.customerName}}</div>
            <div>联系电话：{{orderDetail.telphone}}</div>
            <div>自提地址：{{orderDetail.address}}</div>
          </el-col>
          <el-col :span="6">
            <h3 class="info-title">配送信息</h3>
            <div>配送方式：{{orderDetail.shipType|shipType}}</div>
            <div>发货时间：{{orderDetail.shipTime|dateformat}}</div>
          </el-col>
          <el-col :span="6">
            <h3 class="info-title">付款信息</h3>
            <div>{{orderDetail.paymentId|payType}}</div>
          </el-col>
          <el-col :span="6">
            <h3 class="info-title">买家信息</h3>
            <div>买家：{{orderDetail.userinfo.telphone}}</div>
            <div>买家留言：{{orderDetail.userMessage}}</div>
          </el-col>
        </el-row>
        <div class="info">
          <el-table :data="orderDetail.skuList" style="width: 100%" class="goods" :span-method="rowcolumn">
          <el-table-column prop="title" label="商品名称" width="240">
            <template slot-scope="scope">
              <img :src="$imgurl()+scope.row.imgurl" alt="" style="width:45px;height:45px;">
              <div style="display:inline-block;margin-left:10px;vertical-align: bottom;width:calc(100% - 55px);">
                <div :title="scope.row.productName">{{scope.row.productName?scope.row.productName.substr(0,10):''}}{{scope.row.productName && scope.row.productName.length>10?'...':''}}</div>
                <div style="display:flex;justify-content: space-between;">
                    <div>规格:{{scope.row.displaySpecifications}}</div>
                    <div style="text-algin:right;">{{scope.row.quantity?'x'+scope.row.quantity:''}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="单价" >
            <template slot-scope="scope">
              ￥{{scope.row.price}}元
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="小计" >
            <template slot-scope="scope">
              ￥{{scope.row.price*scope.row.quantity}}元
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="运费" >
            <template slot-scope="scope">
              ￥{{orderDetail.postage}}元
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="供货运费" v-if="false">
            <template slot-scope="scope">
              ￥40.00元
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="付款时间" >
            <template slot-scope="scope">
              {{orderDetail.payTime|dateformat}} 
            </template>
          </el-table-column>
          <!-- 要求是全程都需要发货状态和退款状态 -->
          <el-table-column align="center" prop="status" label="发货状态">
            <template slot-scope="scope">
              {{orderDetail|status}} 
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="退款状态">
            <template slot-scope="scope">
              <div style="color:red;">{{scope.row.status|refundstatus}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="优惠" >
            <template slot-scope="scope">
               {{orderDetail.usecouponamount}}
            </template>
          </el-table-column>
        </el-table>
        </div>
        <div class="info-footer">
          <div>商品总价：￥{{orderDetail.productAmount}}</div>
          <div>运费：￥{{orderDetail.postage}}</div>
          <div>优惠：-￥{{orderDetail.usecouponamount}}</div>
          <div>订单金额：￥{{orderDetail.totalAmount}}</div>
        </div>
      </div>
      <div class="info" v-for="(ship,index) in shipList" :key="index">
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="物流信息" name="first">
            <el-row :gutter="10">
              <el-col :span="8">
                <div v-if='false'>
                  <img :src="activeName" alt="" style="width:45px;height:45px;">
                  <div style="display:inline-block;margin-left:10px;vertical-align: bottom;">
                    <div></div>
                    <div>口味：蓝莓味&nbsp;&nbsp;500ml&nbsp;&nbsp;&nbsp;x1</div>
                  </div>
                </div>
                <div>发货方式：快递配送</div>
                <div>发货时间：{{ship.initTime|dateformat}}</div>
                <div>快递公司：{{ship.corpname}}</div>
                <div>运单号：{{ship.logisticsNo}}</div>
              </el-col>
              
              <el-col :span="16" class="time">
                <div>物流状态：<el-tag type="warning" v-if="ship.status">{{ship.status|shipStatus}}</el-tag></div>
                  <el-steps direction="vertical" :active="ship.response.length">
                    <el-step :title="step.AcceptStation" :description="step.AcceptTime|dateformat" v-for='(step,index) in ship.response' :key="index"></el-step>
                    <el-step title="等待收货"></el-step>
                  </el-steps>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    
  </div>
</template>
<script>
export default {
    name:'GMallOrderDetail',
    props:{
      orderNo:{type:String,default:''},
    },
    data(){
        return {
          activeName:'first',
          orderDetail:{userinfo:{realName:'',telphone:''}},
          goods:[{title:'商品标题'}],
          activities: [
            {content: '等待揽件',timestamp: '2018-04-15'},
            {content: '运输中',timestamp: '2018-04-13'},
            {content: '收货成功',timestamp: '2018-04-11'},
          ],
          shipList:[],
          orderno:''
        }
    },
    created(){
      if(this.orderNo){
        setTimeout(()=>{
          this.getOrderDetail()
        },100);
      }else{
        if(localStorage.getItem('detailnumber')){
          this.orderno = localStorage.getItem('detailnumber');
          this.getOrderDetailOn();
        }
      }
    },
    methods: {
        getOrderDetail(){
          // /order/detail
          if(!this.orderNo){
            this.$message.error('该订单数据异常，请重试');
            return ;
          }
          var params = {orderNo:this.orderNo};
          this.req.post('/order/detail',params).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.orderDetail = res.data.data;
              this.getShip();

            }
          })
        },
        getOrderDetailOn(){
          // /order/detail
          if(!this.orderno){
            this.$message.error('该订单数据异常，请重试');
            return ;
          }
          var params = {orderNo:this.orderno};
          this.req.post('/order/detail',params).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.orderDetail = res.data.data;
              this.getShip();
            }
          })
        },
        process(){
          if(this.orderDetail.orderStatus==1){
            return 1;
          }
          if(this.orderDetail.orderStatus==2){
            return 2;
          }
          if(this.orderDetail.orderStatus==4 || this.orderDetail.orderStatus==5){
            return 3;
          }
          if(this.orderDetail.orderStatus==6 || this.orderDetail.orderStatus==7 || this.orderDetail.orderStatus==8){
            return 4;
          }
        },
        getShip(){
          // /order/getship
          var param = {orderNo:this.orderDetail.orderno};
          this.req.post("/order/getship",param).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.shipList = res.data.data;
              this.shipList.forEach(item=>{
                item.response = item.response?JSON.parse(item.response):[];
                item.response = item.response.reverse();
              })
            }
          })
        },
      rowcolumn({ row, column, rowIndex, columnIndex }){
        if(rowIndex>0){
          if([3,4,5,7].indexOf(columnIndex)!=-1){
            return [0,0];
          }
        }
        if([3,4,5,7].indexOf(columnIndex)!=-1){
          return [this.orderDetail.skuList.length,1];
        }
      }
    },
    filters:{
      shipType(val){
          if(val==0){
              return '快递';
          }else{
              return '上门自提';
          }
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
      payType(val){
        // 0-到店支付，1-微信支付,2-钱包支付,3-会员卡支付
        if(val==0){
          return '到店支付';
        }
        if(val==1){
          return '微信支付';
        }
        if(val==2){
          return '钱包支付';
        }
        if(val==3){
          return '会员卡支付';
        }
      },
      status(item){
          // 1-待支付，2-已支付（待接单）（待发货-商品订单）3-已预约（待发货-商品订单），4-已确认（待服务）（待发货-商品订单），
          // 5-服务中（待结束）（待收货-商品订单），6-服务完成（待评价）（已收货-商品订单），7-申请退款，8- 已完成-1 -订单取消 -2-订单取消
          if(item.orderStatus==-1 || item.orderStatus==-2){
          return '订单已取消';
          }
          if(item.orderStatus==1){
          return '待支付';
          }
          if(item.orderStatus==2){
          return '待发货';
          }
          if(item.orderStatus==3){
          return '待发货';
          }
          if(item.orderStatus==4){
          return '待发货';
          }
          if(item.orderStatus==5){
          return '待收货';
          }
          if(item.orderStatus==6){
          return '已收货';
          }
          if(item.orderStatus==7){
          return '申请退款';
          }
          if(item.orderStatus==8){
          return '已完成';
          }
          if(item.orderStatus==10){
          return '已完成';
          }
      },
      refundstatus(val){
        // 0-正常1-已拒绝退款2-申请退款3-退款成功 4-申请换货5-换货成功
        if(val==1){
          return '已拒绝退款';
        }
        if(val==2){
          return '申请退款';
        }
        if(val==3){
          return '退款成功';
        }
        if(val==4){
          return '申请换货';
        }
        if(val==5){
          return '换货成功';
        }
      },
    },
}
</script>
<style scoped>
.info{text-align:left;box-sizing: border-box;padding:5px 10px;background-clip:content-box;}
.info-title{font-size:14px;font-weight:600;}
.info-footer{text-align:right;box-sizing: border-box;padding:5px 10px;background-clip:content-box;}
.goods >>> th{background:#eee !important;}
/* .time >>> .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #e4e7ed;
}
.time >>> .el-timeline-item__node--normal {
    left: -1px;
    width: 12px;
    height: 12px;
}
.time >>> .el-timeline-item__node {
    position: absolute;
    background-color: #e4e7ed;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.time >>> .el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none;
}
.time >>> .el-timeline-item {
    position: relative;
    padding-bottom: 20px;
}
.time >>> li {
    display: list-item;
    text-align: -webkit-match-parent;
} */
</style>