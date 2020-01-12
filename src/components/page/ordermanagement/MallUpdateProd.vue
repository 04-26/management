<template>
  <div class="send">
      <Notes content="仅可更改一次，请认真填写。" padding="15"></Notes>
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
              <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
      </el-form>
    <el-dialog title="确认修改" :visible.sync="sendProdvisble" width="600px" class="prod">
      <div>
        <table class="table">
            <tr><th>商品数量</th><th>发货方式</th><th>物流公司</th><th>快递单号</th></tr>
            <tr><td>x {{num}}</td><td>快递发货</td><td>{{form.corpname}}</td><td>{{form.logisticsNo}}</td></tr>
        </table>
      </div>
      <div slot="footer">
          <el-button type="info" @click="sendProdvisble=false">返回修改</el-button>
          <el-button type="primary" @click="send">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Notes  from '@/components/page/mall/Notes.vue';
export default {
    name:'MallUpdateProd',
    props:{
        orderDetail:{type:Object,default:{}}
    },
    data(){
        return {
            form:{
               logisticsNo:'',
               corpname:'',
               corpcode:''
            },
            sendProdvisble:false,
            companyList:[],
            shipList:[],
            num:0,
        }
    },
    created(){
        this.getCompanyList();
        this.getShip();
        this.orderDetail.skuList.forEach(item=>{
            this.num += item.quantity;
        })
    },
    methods:{
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
        getShip(){
          // /order/getship
          var param = {orderNo:this.orderDetail.orderno};
          this.req.post("/order/getship",param).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                if((res.data.data instanceof Array) && res.data.data.length>0){
                    this.shipList = res.data.data;
                    this.form = this.shipList[0];
                    delete this.form.response;
                }
            }
          })
        },
        save(){
            this.sendProdvisble = true;
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
                    this.req.post("/order/updateexpress",param).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            this.sendProdvisble = false;
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }
            })
        }
    },
    components:{
        Notes
    }
}
</script>
<style scoped>
.send-info{display:flex;padding:15px;}
.send-info div:nth-child(1){width:150px;}
</style>