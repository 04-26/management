<template>
  <div>
      <el-card>
          <div slot="header">搜索条件</div>
          <div>
              <div class="order-date">
                  <span>订单日期：</span>
                  <el-button :type="btnType==1?'primary':'info'" @click="selBtn(1)">全部</el-button>
                  <el-button :type="btnType==2?'primary':'info'" @click="selBtn(2)">本月</el-button>
                  <el-button :type="btnType==3?'primary':'info'" @click="selBtn(3)">本季度</el-button>
                  <el-button :type="btnType==4?'primary':'info'" @click="selBtn(4)">本年</el-button>
                  <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="daterange" @change="timeChange"></el-date-picker>
              </div>
              <div class="order-num">
                  <span>订单编号：</span>
                  <el-input placeholder="请输入订单编号" style="width:270px;" v-model="keyword"></el-input>&nbsp;&nbsp;
                  <el-button type="success" @click="search">搜索</el-button>
              </div>
              <div style="margin:10px 0 0;">
                  <el-row :gutter="10">
                      <el-col :span="18">
                        <el-button-group>
                            <el-button :type="btnftr==0?'primary':'info'" @click="btnFilter(0)">全部</el-button>
                            <el-button :type="btnftr==1?'primary':'info'" @click="btnFilter(1)">待付款</el-button>
                            <el-button :type="btnftr==2?'primary':'info'" @click="btnFilter(2)">待发货</el-button>
                            <el-button :type="btnftr==3?'primary':'info'" @click="btnFilter(3)">待收货</el-button>
                            <el-button :type="btnftr==6?'primary':'info'" @click="btnFilter(6)">已完成</el-button>
                            <el-button :type="btnftr==5?'primary':'info'" @click="btnFilter(5)">已关闭</el-button>
                            <el-button :type="btnftr==7?'primary':'info'" @click="btnFilter(7)">退款中</el-button>
                        </el-button-group>
                        &nbsp;
                        <el-select v-model="tempType" placeholder="配送方式" clearable v-if='false'>
                            <el-option label="快递发货" :value="1"></el-option>
                            <el-option label="上门自提" :value="2"></el-option>
                            <el-option label="同城配送" :value="3"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="6" style="text-align:right;">
                            <el-button type="primary" @click="flashPage">刷新</el-button>
                            <el-button type="primary" @click="exportOut">导出</el-button>
                      </el-col>
                  </el-row>
                  <el-table style="width: 100%" class="head-table">
                      <el-table-column label="商品/订单编号" width="400"></el-table-column>
                      <el-table-column label="买家/收货人"></el-table-column>
                      <el-table-column label="实付合计(元)" ></el-table-column>
                      <el-table-column label="配送方式" ></el-table-column>
                      <el-table-column label="下单时间" ></el-table-column>
                      <el-table-column label="订单状态" ></el-table-column>
                      <el-table-column label="操作" width="336" align="center"></el-table-column>
                      <div slot="empty" style="display:none;"></div>
                  </el-table>
                  <div class="diy-orderlist" v-loading="loading">
                      <div class="t-column-item" v-for="(order,index) in orderList" :key="index">
                          <div class="t-item-head">
                              <div>订单编号：{{order.orderno}}</div>
                              <div>{{order.paymentId|payType}}</div>
                          </div>
                          <table style="width:100%;">
                                <tr  v-for="(item,subindex) in order.skuList" :key="subindex">
                                  <td class="t-column" style="width:400px;">
                                    <div>
                                        <img :src="item.imgurl|avatar" alt="" style="width:45px;height:45px;">
                                        <div style="display:inline-block;margin-left:10px;vertical-align: bottom;width:calc(100% - 100px);">
                                            <div :title="item.productName">{{item.productName?item.productName.substr(0,17):''}}{{item.productName && item.productName.length>17?'...':''}}</div>
                                            <div style="display:flex;justify-content: space-between;">
                                                <div>{{item.displaySpecifications}}</div>
                                                <div style="text-algin:right;">{{item.quantity?'x'+item.quantity:''}}</div>
                                            </div>
                                        </div>
                                    </div>
                                  </td>
                                  <td class="t-column" :rowspan="order.skuList.length" v-if="subindex==0">
                                      <div>
                                        <img :src="order.userinfo.avatar|avatar" v-if="order.userinfo && order.userinfo.avatar" alt="" style="width:45px;height:45px;">
                                        <div style="display:inline-block;margin-left:10px;vertical-align: bottom;">
                                            <div>{{order.customerName}}</div>
                                            <div>{{order.telphone}}</div>
                                        </div>
                                    </div>
                                  </td>
                                  <td class="t-column" :rowspan="order.skuList.length" v-if="subindex==0">￥{{order.totalAmount?order.totalAmount:0}}元</td>
                                  <td class="t-column" :rowspan="order.skuList.length" v-if="subindex==0">{{order.shipType|shipType}}</td>
                                  <td class="t-column" :rowspan="order.skuList.length" v-if="subindex==0">{{order.initTime|dateformat}}</td>
                                  <td class="t-column" v-if="btnftr==7 && subindex==0" :rowspan="order.skuList.length" style="color:red;">退款中</td>
                                  <td class="t-column" v-if="btnftr!=7 && subindex==0" :rowspan="order.skuList.length">
                                      {{order|status}}
                                      <div v-if="order.refundstatus>=1 " style="color:red;">退款中</div>
                                    </td>
                                  <td class="t-column" style="width:336px;text-align:right;" :rowspan="order.skuList.length" v-if="subindex==0">
                                    <el-popover  trigger="click">
                                        <el-input v-model="order.remark" placeholder="请输入备注信息" type="textarea" rows="6">
                                        </el-input>
                                        <el-button type="primary" @click.native="saveBackup(order)" size="mini" style="margin-top:15px;">保存</el-button>
                                        <el-button size="mini" type="info" slot="reference">备注</el-button>
                                    </el-popover>&nbsp;
                                    <el-button size="mini" type="info" @click="disendProd(order)" v-if="order.refundstatus>=1">发货</el-button>
                                    <el-button size="mini" type="success" @click="sendProd(order)" v-if="order.orderStatus>=2 && order.orderStatus<5 && order.refundstatus!=1">发货</el-button>
                                    <el-button size="mini" type="primary" @click="sendUpdate(order)" v-if="order.orderStatus==5 && order.refundstatus!=1 && order.shipType==0">修改物流</el-button>
                                    <el-button size="mini" type="primary" @click="recvProd(order)" v-if="order.orderStatus==5 && order.refundstatus!=1 && order.shipType!=0">确认收货</el-button>
                                    <el-button size="mini" type="primary" @click="detail(order)">订单详情</el-button>
                                  </td>
                                </tr>
                          </table>
                      </div>
                  </div>
                    <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
                        :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
                    </el-pagination>
              </div>
          </div>
      </el-card>
    <el-dialog title="设置店铺收货地址" :visible.sync="addressvisble" width="600px" :before-close="closeAddress">
      <div>
        <SetAddress ref='address'></SetAddress>
      </div>
    </el-dialog>
    <el-dialog title="发货" :visible.sync="sendProdvisble" width="600px" :before-close="closeSend" class="prod">
      <div>
        <MallSendProd ref='prod' :orderDetail="currOrderItem"></MallSendProd>
      </div>
    </el-dialog>
    <el-dialog title="修改物流信息" :visible.sync="upshipvisble" width="400px" class="prod">
      <div>
        <MallUpdateProd ref='ship' :orderDetail="currOrderItem"></MallUpdateProd>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import SetAddress  from '@/components/page/storemanagement/SetAddress.vue';
import MallSendProd  from '@/components/page/ordermanagement/MallSendProd.vue';
import MallUpdateProd  from '@/components/page/ordermanagement/MallUpdateProd.vue';
import bus from '@/components/common/bus';
export default {
    name:'BMallOrder',
    data(){
        return {
            time:'',
            btnType:1,
            orderList:[{userinfo:{avatar:''}}],
            loading:false,
            totalCount:0,
            pageSize:10,
            pageNo:1,
            btnftr:0,
            keyword:'',
            tempType:'',
            addressvisble:false,
            address:{},
            sendProdvisble:false,
            currOrderItem:{},
            upshipvisble:false,
            content:''
        }
    },
    watch: {
        time:function(v,o){
            if(v){
                this.btnType=-1;
            }
            return v;
        }
    },
    created(){
        this.getOrderList();
        this.getAddress();
    },
    methods: {
        selBtn(v){
            this.time='';
            this.btnType = v;
            var date = new Date();
            if(v==1){
                this.starttime = '';
                this.endtime = '';
            }
            if(v==2){
                this.starttime = this.$moment().startOf('month').format('YYYY-MM-DD');
                this.endtime = this.$moment().endOf('month').format('YYYY-MM-DD');;
            }
            if(v==3){
                this.starttime = this.$moment().startOf('quarter').format('YYYY-MM-DD');
                this.endtime = this.$moment().endOf('quarter').format('YYYY-MM-DD');
            }
            if(v==4){
                this.starttime = this.$moment().startOf('year').format('YYYY-MM-DD');
                this.endtime = this.$moment().endOf('year').format('YYYY-MM-DD');
            }
            this.getOrderList();
        },
        btnFilter(val){
            this.btnftr = val;
            this.getOrderList();
        },
        timeChange(val){
            if(val){
                this.starttime = this.$moment(val[0]).format('YYYY-MM-DD');
                this.endtime = this.$moment(val[1]).format('YYYY-MM-DD');
            }
            this.getOrderList();
        },
        getOrderList(keyword){
            // /orderreturn/list
            var params = {fliter:this.btnftr,pageNo:this.pageNo,pageSize:this.pageSize};
            if(keyword){
                params.keyword = keyword;
            }
            if(this.starttime){
                params.starttime = this.starttime;
            }
            if(this.endtime){
                params.endtime = this.endtime;
            }
            if(this.$route.query.bargainid){
                params.actionid = this.$route.query.bargainid;
            }
            params.astype=3;
            this.loading=true;
            this.orderList = [];
            this.req.post('/bargain/orderlist',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.totalCount = res.data.data.totalCount;
                    this.orderList = res.data.data.resultList;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        sizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.loading=true;
            this.getOrderList();
        },
        pageNoChange(pageNo){
            this.pageNo = pageNo;
            this.loading=true;
            this.getOrderList();
        },
        detail(item,productId){
            sessionStorage.setItem('refdetail',JSON.stringify(item));
            this.$router.push({path:'/mallrefundorderdetail',query:{id:item.id,productId:productId}});
        },
        search(){
            this.pageNo = 1;
            this.getOrderList(this.keyword);
        },
        detail(item){
            if(localStorage.getItem('detailnumber')){
                localStorage.removeItem('detailnumber');
            }
            localStorage.setItem("detailnumber", item.orderno);
            this.$router.push({path:'/bmallorderdetail'});
        },
        exportOut() {
            /* 从表生成工作簿对象 */
            var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
            /* 获取二进制字符串作为输出 */
            var wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "array"
            });
            try {
                FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "商品订单列表.xlsx"
                );
            } catch (e) {
                this.$message.error(error.getMessage());
            }
            return wbout;
        },
        flashPage(){
            this.pageNo = 1,
            this.btnftr = 0,
            this.keyword = '',
            this.tempType = '',
            this.search();
        },
        getAddress(){
            // /store/getreturninfo
            var param = {};
            this.req.post("/store/getreturninfo",param).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.address = res.data.data;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        closeAddress(done){
            this.getAddress();
            done();
        },
        closeSend(done){
            this.getOrderList();
            done();
        },
        sendProd(item){
            if(!this.address.name){
                this.addressvisble = true;
                return ;
            }
            this.sendProdvisble = true;
            this.currOrderItem = item;
        },
        sendUpdate(item){
            this.upshipvisble = true;
            this.currOrderItem = item;
            setTimeout(()=>{
                this.$refs.ship.getShip();
            },1000)
        },
        saveBackup(item){
            // /order/remark
            if(!item.remark){
                this.$message.error('备注内容不能为空');
                return ;
            }
            var param = {orderNo:item.orderno,remark:item.remark}
            this.req.post("/order/remark",param).then(res=>{
               if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$notify({
                        title: '温馨提示',
                        message: '备注操作成功',
                        position: 'top-right',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        disendProd(item){
            
            this.$confirm('用户有发起退款，请先去处理吧！', '温馨提示', {
                confirmButtonText: '处理退款',
                cancelButtonText: '暂不处理',
                type: 'warning',
                center:true
            }).then(() => {
                bus.$emit('reflash_tag',{path:'/MallRefundOrder'});
                this.$router.push({path:'/MallRefundOrder',query:{orderNo:item.orderno}})
            }).catch(() => {});
        },
        recvProd(item){
            this.$confirm('确认买家已取货？', '温馨提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                center:true
            }).then(() => {
                // /order/selfliftservice
                var param = {orderno:item.orderno};
                this.req.post("/order/selfliftservice",param).then(res=>{
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                        this.getOrderList();
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
            }).catch(() => {});
        },
    },
    components:{
        SetAddress,
        MallSendProd,
        MallUpdateProd
    },
    filters:{
        payType(val){
            if(val){
                //0-到店支付，1-微信支付,2-钱包支付,3-会员卡支付
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
            }
        },
        sendstatus(val){
            if(val){
                // 退货单状态：1-待审核，2-已同意，3-待提交物流单号，5-已提交物流单号，10-已完成，11-已拒绝，12-已取消
                if(val==0){
                    return '待审核';
                }
            }else{
                return '未发货';
            }
        },
        shipType(val){
            if(val==0){
                return '快递';
            }else{
                return '上门自提';
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
    }
}
</script>
<style scoped>
.daterange{margin: 0px 15px;vertical-align: bottom;}
.order-num{margin:10px 0 0;}
.orderlist{margin:5px 0 0;}
.orderlist >>> th{background:#eee !important;}
.head-table >>> .el-table__empty-block{display:none;}
.diy-orderlist .t-column-item{border:1px solid #eee;margin-top:15px;}
.diy-orderlist .t-column-item .t-item-head{display:flex;background:#eee;}
.diy-orderlist .t-column-item .t-item-head div{padding:5px 15px;background:#eee;}
.diy-orderlist .t-column-item .t-item-list{display:flex;}
/* .diy-orderlist .t-column-item .t-item-list .t-column{flex:1;border:1px solid #eee;padding:0px 5px;} */
.diy-orderlist .t-column{min-width:150px;border:1px solid #eee;padding:0px 5px;}
.diy-orderlist .t-column-item .t-item-list .t-column:nth-child(1){flex:0 0 400px;}
.diy-orderlist .t-column-item .t-item-list .t-column:nth-child(8){flex:0 0 220px;}
.diy-orderlist .t-column-item .t-item-list .t-column{display:flex;justify-content:flex-start;align-items:center}
.prod >>> .el-dialog__body{padding:15px;}
</style>