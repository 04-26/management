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
                            <el-button :type="btnftr==1?'primary':'info'" @click="btnFilter(1)">待商家处理</el-button>
                            <el-button :type="btnftr==2?'primary':'info'" @click="btnFilter(2)">待用户处理</el-button>
                        </el-button-group>
                      </el-col>
                      <el-col :span="6" style="text-align:right;">
                            <el-button type="primary" @click="exportOut">导出</el-button>
                      </el-col>
                  </el-row>
                  <el-table style="width: 100%" class="head-table">
                      <el-table-column label="商品" width="400"></el-table-column>
                      <el-table-column label="发货状态"></el-table-column>
                      <el-table-column label="订单金额(元)" ></el-table-column>
                      <el-table-column label="退款金额(元)" ></el-table-column>
                      <el-table-column label="申请时间" ></el-table-column>
                      <el-table-column label="超时时间" ></el-table-column>
                      <el-table-column label="退款状态"></el-table-column>
                      <el-table-column label="操作" width="220" align="center"></el-table-column>
                      <div slot="empty" style="display:none;"></div>
                  </el-table>
                  <div class="diy-orderlist" id="out-table">
                      <div class="t-column-item" v-for="(order,index) in orderList" :key="index">
                          <div class="t-item-head">
                              <div>退款编号：{{order.returnNo}}</div>
                              <div>订单编号：{{order.orderNo}}</div>
                              <div>{{order.type==1?'仅退款':'退款退货'}}</div>
                          </div>
                          <table style="width:100%;">
                                <tr  v-for="(item,subindex) in order.itemList" :key="subindex">
                                  <td class="t-column" style="width:400px;">
                                    <div>
                                        <img :src="item.sku.imgurl|avatar" alt="" style="width:45px;height:45px;">
                                        <div style="display:inline-block;margin-left:10px;vertical-align: bottom;width:calc(100% - 100px);">
                                            <div :title="item.sku.productName">{{item.sku.productName?item.sku.productName.substr(0,20):''}}{{item.sku.productName && item.sku.productName.length>20?'...':''}}</div>
                                            <div style="display:flex;justify-content: space-between;">
                                                <div>规格:{{item.sku.displaySpecifications}}</div>
                                                <div style="text-algin:right;">{{item.sku.quantity?'x'+item.sku.quantity:''}}</div>
                                            </div>
                                        </div>
                                    </div>
                                  </td>
                                  <td class="t-column">{{order.cargoStatus|sendstatus}}</td>
                                  <td class="t-column">￥{{order.orderAmount?order.orderAmount:0}}元</td>
                                  <td class="t-column">￥{{order.returnAmount?order.returnAmount:0}}元</td>
                                  <td class="t-column">{{order.initTime|dateformat}}</td>
                                  <td class="t-column">{{order.initTime|dateformat}}</td>
                                  <td class="t-column">{{order.status|status}}</td>
                                  <td class="t-column" style="width:220px;text-align:right;" :rowspan="order.itemList.length" v-if="subindex==0">
                                    <el-button size="mini" type="warning" @click="check(order,item.orderProductId)" v-if="order.status==1">同意取消</el-button>
                                    <el-button size="mini" type="warning" @click="detail(order,item.orderProductId)" v-if="order.status>1 && order.status<=5">处理退款</el-button>
                                    <el-button size="mini" type="primary" @click="detail(order,item.orderProductId)" v-if="order.status>=5">查看详情</el-button>
                                  </td>
                                </tr>
                          </table>
                          <div class="t-item-list" v-for="(item,subindex) in order.itemList" :key="subindex" v-if="false">
                              <div class="t-column" style="width:400px;">
                                <div>
                                    <img :src="item.sku.imgurl|avatar" alt="" style="width:45px;height:45px;">
                                    <div style="display:inline-block;margin-left:10px;vertical-align: bottom;">
                                        <div>{{item.sku.productName}}</div>
                                        <div>{{item.sku.displaySpecifications}}</div>
                                    </div>
                                </div>
                              </div>
                              <div class="t-column">{{item.cargoStatus|sendstatus}}</div>
                              <div class="t-column">￥{{order.orderAmount?order.orderAmount:0}}元</div>
                              <div class="t-column">￥{{order.returnAmount?order.returnAmount:0}}元</div>
                              <div class="t-column">{{order.initTime|dateformat}}</div>
                              <div class="t-column">{{order.initTime|dateformat}}</div>
                              <div class="t-column">{{order.status|status}}</div>
                              <div class="t-column" style="width:220px;text-align:right;">
                                <el-button size="mini" type="warning" @click="check(order,item.orderProductId)" v-if="order.status==1">同意取消</el-button>
                                <el-button size="mini" type="warning" @click="detail(order,item.orderProductId)" v-if="order.status>1 && order.status<=5">处理退款</el-button>
                                <el-button size="mini" type="primary" @click="detail(order,item.orderProductId)" v-if="order.status>=5">查看详情</el-button> 
                              </div>
                          </div>
                      </div>
                  </div>
                  <el-table :data="orderList" style="width: 100%" class="orderlist" v-loading="loading" id="out-table" v-if="false">
                        <el-row :gutter="10">
                                <el-col :span="8">退款编号：201908011417300000020043</el-col>
                                <el-col :span="8">订单编号：E20190726144732004300071</el-col>
                                <el-col :span="8">仅退款/退款退货</el-col>
                        </el-row>
                      <el-table-column prop="productName" label="商品" width="400">
                          <template slot-scope="scope">
                            <div>
                                <img :src="scope.row.imgurl|avatar" alt="" style="width:45px;height:45px;">
                                <div style="display:inline-block;margin-left:10px;vertical-align: bottom;">
                                    <div>{{scope.row.productName}}</div>
                                    <div>{{scope.row.displaySpecifications}}&nbsp;&nbsp;500ml&nbsp;&nbsp;&nbsp;x1</div>
                                </div>
                            </div>
                          </template>
                      </el-table-column>
                      <el-table-column prop="status" label="发货状态"></el-table-column>
                      <el-table-column prop="orderAmount" label="订单金额(元) "></el-table-column>
                      <el-table-column prop="returnAmount" label="退款金额(元) "></el-table-column>
                      <el-table-column prop="initTime" label=" 申请时间">
                          <template slot-scope="scope">
                              <div>
                                  {{scope.row.initTime|dateformat}}
                              </div>
                          </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="超时时间"></el-table-column>
                      <el-table-column prop="status" label="退款状态">
                          <template slot-scope="scope">
                              <div>
                                  {{scope.row.status|status}}
                              </div>
                          </template>
                      </el-table-column>
                      <el-table-column label="操作" width="220" align="center">
                          <template slot-scope="scope">
                              <div>
                                <el-button type="primary" @click="detail(scope.row)" v-if="scope.row.status<5">处理退款</el-button>
                                <el-button type="primary" @click="detail(scope.row)" v-if="scope.row.status>=5">查看详情</el-button>
                              </div>
                          </template>
                      </el-table-column>
                  </el-table>
                    <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
                        :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
                    </el-pagination>
              </div>
          </div>
      </el-card>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
    name:'MallRefundOrder',
    data(){
        return {
            time:'',
            btnType:1,
            orderList:[{title:'shang',thumb:''}],
            loading:false,
            totalCount:0,
            pageSize:10,
            pageNo:1,
            btnftr:0,
            keyword:''
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
        if(this.$route.query.orderNo){
            this.keyword = this.$route.query.orderNo;
        }
        this.getOrderList();
    },
    activated(){
      if(this.$route.query.orderNo){
        this.keyword = this.$route.query.orderNo;
      }
      this.getOrderList();
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
            var params = {fliter:this.btnftr,shopId:localStorage.getItem('shopid'),pageNo:this.pageNo,pageSize:this.pageSize};
            if(keyword){
                this.keyword = keyword;
            }
            if(this.keyword){
                params.keyword = this.keyword;
            }
            if(this.starttime){
                params.starttime = this.starttime;
            }
            if(this.endtime){
                params.endtime = this.endtime;
            }
            this.loading=true;
            this.req.post('/orderreturn/list',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.totalCount = res.data.data.totalPageCount;
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
        refund(item){

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
                "维权订单列表.xlsx"
                );
            } catch (e) {
                this.$message.error(error.getMessage());
            }
            return wbout;
        },
        check(item,productId){
            this.$confirm('确定同意申请退款, 是否继续?', '提示', {
                confirmButtonText: '同意',
                cancelButtonText: '拒绝',
                type: 'warning'
            }).then(() => {
                var params = {returnid:item.id,status:1,refuseReason:''};
                this.req.post("/orderreturn/confirmorder",params).then(res=>{
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
                this.getOrderList();      

            }).catch(() => {
                this.$prompt('请输入拒绝原因', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    inputValidator:(val)=>{

                    },
                }).then(({ value }) => {
                    var params = {returnid:item.id,status:2,refuseReason:value};
                    this.req.post("/orderreturn/confirmorder",params).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })   
                    this.getOrderList(); 
                }).catch(() => {});
     
            });

        }
    },
    filters:{
        sendstatus(val){
            // 货物状态1-未收货，2-已收货
            if(val==1){
                return '未收货';
            }
            if(val==2){
                return '已收货';
            }
        },
        status(val){
            if(val){
                // 退货单状态：1-待审核，2-已同意，3-待提交物流单号，5-已提交物流单号，10-已完成，11-已拒绝，12-已取消
                if(val==1){
                    return '待审核';
                }
                if(val==2){
                    return '已同意';
                }
                if(val==3){
                    return '待提交物流单号';
                }
                if(val==5){
                    return '已提交物流单号';
                }
                if(val==10){
                    return '已完成';
                }
                if(val==11){
                    return '已拒绝';
                }
                if(val==12){
                    return '已取消';
                }
            }
        }
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
</style>