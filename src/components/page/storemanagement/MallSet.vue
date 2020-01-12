<template>
  <div>
      <el-card class="serve" :style="{width:width}" v-loading="loading">
          <div slot="header">店铺服务设置</div>
          <div class="server-set">
              <div class="set-item">
                  <div class="item-left">
                      <h3>12小时内送达</h3>
                      <Notes content="开通此服务后，商品必须保证12小时内送达客户，客户有权就此服务向平台进行投诉" padding="5"></Notes>
                  </div>
                  <el-switch class="item-right" v-model="topspeed" active-color="#1abc9c" inactive-color="#717171" @change="changeTopspeed"></el-switch>
              </div>
              <div class="set-item">
                  <div class="item-left">
                      <h3>质量保证</h3>
                      <Notes content="开通此服务后，商品必须保质保量送达客户，不得出现商品人为故意损坏的情况，客户有权就此服务向平台进行投诉" padding="5"></Notes>
                  </div>
                  <el-switch class="item-right" v-model="safety" active-color="#1abc9c" inactive-color="#717171" @change="changeSafety"></el-switch>
              </div>
              <div class="set-item">
                  <div class="item-left">
                      <h3>七天包退</h3>
                      <Notes content="开通此服务后，如果商家在收到货后不满意，可以发起退货。" padding="5"></Notes>
                  </div>
                  <el-switch class="item-right" v-model="refund" active-color="#1abc9c" inactive-color="#717171" @change="changeRefund"></el-switch>
              </div>
          </div>
      </el-card>
  </div>
</template>

<script>
import Notes from '@/components/page/mall/Notes.vue';
export default {
    name:'MallSet',
    props:{
        shopDetail:{type:Object,default:()=>{return {};}},
        width:{type:String,default:'100%'}
    },
    data(){
        return {
            topspeed:false,
            safety:false,
            refund:false,
            loading:false
        }
    },
    mounted(){
        setTimeout(()=>{
            this.topspeed = this.shopDetail.topspeed;
            this.safety = this.shopDetail.safety;
            this.refund = this.shopDetail.refund;
        },1000);
    },
    methods:{
        changeTopspeed(val){
            this.saveDetail();
        },
        changeSafety(val){
            this.saveDetail();
        },
        changeRefund(val){
            this.saveDetail();
        },
        saveDetail(){
            var params = {id:this.shopDetail.id,topspeed:this.topspeed,safety:this.safety,refund:this.refund};
            this.loading=true;
            this.req.post("/store/save", params).then(res => {
                this.loading=false;
                if (res.data.sub_code == "SUCCESS" && res.data.code=='SUCCESS') {
                    this.$message.success('操作成功');
                } else {
                  this.$message.error(res.data.sub_msg);
                }
            })
        },
    },
    components:{
        Notes
    }
}
</script>
<style scoped>
    .serve{margin-bottom:10px;}
    .serve >>> .el-card__header{padding:10px !important;}
    .serve >>> .el-card__body{padding:10px;}
    .serve .server-set h3{margin-top:10px;}
    .serve .server-set .set-item{display:flex;align-items:center;margin:15px 0px;background:#f2f2f2;padding:10px;}
    .serve .server-set .set-item .item-left{flex:3;}
    .serve .server-set .set-item .item-right{flex:1;align-content:center;display:flex;justify-content:center;}
</style>