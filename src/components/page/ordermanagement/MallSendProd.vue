<template>
  <div class="send" v-loading="loading">
      <el-table :data="prodList" style="width: 100%">
            <el-table-column prop="productName" label="产品名称" width="200px">
                <template slot-scope="scope">
                    <div>
                        <img :src="scope.row.imgurl|avatar" alt="" style="width:45px;height:45px;">
                        <div style="display:inline-block;margin-left:10px;vertical-align: bottom;" :title="scope.row.productName">
                            <div>{{str(scope.row.productName,0,10)}}</div>
                            <div>{{scope.row.displaySpecifications}}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="单价"></el-table-column>
            <el-table-column prop="quantity" label="购买数量">
                <template slot-scope="scope"><div>x {{scope.row.quantity}}</div></template>
            </el-table-column>
            <el-table-column prop="quantity" label="发货数量">
                <template slot-scope="scope"><div>x {{scope.row.quantity}}</div></template>
            </el-table-column>
            <el-table-column prop="subTotal" label="小计(元)"></el-table-column>
      </el-table>
      <div class="send-info">
          <div>配送信息：</div>
          <div>
              <div>方式：{{orderDetail.shipType==0?'快递':'自提'}}</div>
              <div>收货人：{{orderDetail.customerName}}&nbsp;{{orderDetail.telphone}}</div>
              <div>收货地址：{{orderDetail.address ? orderDetail.address+(orderDetail.door?orderDetail.door:'') : ''}}</div>
              <div><el-button type="primary" @click="editProd" size="mini">修改收货信息</el-button></div>
              <div v-if="orderDetail.userMessage">买家留言：{{orderDetail.userMessage}}</div>
          </div>
      </div>
      <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="快递公司" prop="corpcode">
                <el-select v-model="form.corpcode" placeholder="请选择快递公司" clearable  @change="change">
                    <el-option v-for="(item,index) in companyList" :label="item.corpname" :value="item.corpcode" :key="index">{{item.corpname}}</el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="logisticsNo">
                <el-input v-model="form.logisticsNo" placeholder="请输入快递单号" style="width:213px;"></el-input>
          </el-form-item>
          <el-form-item label="">
              <el-button type="primary" @click="send">发货</el-button>
          </el-form-item>
      </el-form>
    <el-dialog title="修改客户收货地址" :visible.sync="sendProdvisble" width="600px" :before-close="closeAddress" class="prod">
      <div>
        <UpUserAddress ref='prod' @close='getUserAddress' :orderNo="orderDetail.orderno"></UpUserAddress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UpUserAddress  from '@/components/page/storemanagement/UpUserAddress.vue';
import helper from '@/utils/helper';
export default {
    name:'MallSendProd',
    props:{
        orderDetail:{type:Object,default:{}}
    },
    data(){
        return {
            form:{
               logisticsNo:'',
               corpname:'',
               orderNo:'',
               corpcode:''
            },
            sendProdvisble:false,
            companyList:[],
            loading:false,
            prodList:[],
        }
    },
    created(){
        this.getCompanyList();
        if(this.orderDetail.skuList){
            this.orderDetail.skuList.forEach(item=>{
                if(item.status<3){
                    this.prodList.push(item);
                }
            })
        }
    },
    methods:{
        str(value){
            return helper.substr(value,0,8);
        },
        editProd(){
           this.sendProdvisble=true;
        },
        closeAddress(done){
            done();
        },
        getUserAddress(item){
            this.orderDetail.customerName = item.username;
            this.orderDetail.telphone = item.telphone;
            this.orderDetail.address = item.regionnames+item.address;
        },
        getCompanyList(){
            // /content/deliverycompanys
            this.req.post("/content/deliverycompanys").then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.companyList = res.data.data
                }
            })
        },
        change(val){
            this.companyList.forEach(item=>{ 
                if(item.corpcode==val){
                    this.form.corpname = item.corpname;
                }
            });
        },
        send(){
            // /order/shiporder
            this.$refs.form.validate((valid)=>{
                if(valid){
                    var formStr = JSON.stringify(this.form);
                    var param = JSON.parse(formStr);
                    if(param.initTime){
                        delete param.initTime;
                    }
                    param.orderNo = this.orderDetail.orderno;
                    this.loading=true;
                    this.req.post("/order/shiporder",param).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.loading = false;
                            this.$message.success('操作成功');
                            this.$emit('close',this.form);
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }
            })
        }
    },
    components:{
        UpUserAddress
    }
}
</script>
<style scoped>
.send-info{display:flex;padding:15px;}
.send-info div:nth-child(1){width:86px;}
</style>