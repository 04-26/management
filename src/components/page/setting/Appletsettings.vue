<template>
  <div>
    <el-card  shadow="never" class="box-card">
      <div>
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="小程序配置管理" name="first">
            <div>
              <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="AppID(小程序ID)：">
                  <el-input style="width:400px;" class="input-dis" v-model="form.appid" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="AppSecret(小程序密钥)：">
                  <el-input style="width:400px" class="input-dis" v-model="form.appSecret" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="微信支付商户号：">
                  <el-input style="width:400px"  v-model="form.mchId"></el-input>
                </el-form-item>
                <el-form-item label="微信支付Api密钥：">
                  <el-input style="width:400px" v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="证书文件：">
                  <el-input style="width:400px" v-model="form.certPath">
                      <template slot="append">
                        <el-upload
                          class="upload-demo"
                          :action="$upfileUrl('/common/uploadcert')"
                          accept="application/x-pkcs12"
                          :limit="1"
                          name="file"
                          :data="{type:'certFile'}"
                          :show-file-list="false"
                          :before-upload="beforeUplaod"
                          :on-change="changeFile">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </template>
                  </el-input>
                  <p>微信支付商户平台下载的证书文件（pem），上传到服务器的绝对路径</p>
                </el-form-item>
                <el-form-item label="支付证书的数据内容：">
                  <el-input style="width:400px" v-model="form.certData"></el-input>
                </el-form-item>
                <el-form-item label="支付接口的服务器IP地址：">
                  <el-input style="width:400px" v-model="form.payClientIp"></el-input>
                </el-form-item>
                <el-form-item label="支付成功通知接口：">
                  <el-input style="width:400px" v-model="form.notifyUrl"></el-input>
                  <p>支付成功的微信通知接口，默认的url部分：/orderpay/notify</p>
                </el-form-item>
                <el-form-item label="退款成功通知接口：">
                  <el-input style="width:400px" v-model="form.refundNotifyUrl"></el-input>
                  <p>退款成功的微信通知接口，默认的url: /orderpay/refundnotify</p>
                </el-form-item>
                <el-form-item label="面对面下单支付码">
                  <div>
                    <el-input style="width:400px" v-model="page">
                      <template slot="prepend">
                        <el-button type="primary"> PAGE </el-button>
                      </template>
                    </el-input>
                  </div>
                  <div>
                  <el-input style="width:400px" v-model="scene" :value="2">
                    <template slot="prepend">
                      <el-button type="primary">场景值</el-button>
                    </template>
                  </el-input>
                  </div>
                  <a :href="codeUrl" target="_blank"><img :src="codeUrl" style="width:120px;height:120px;" v-if="codeUrl"></a>
                  <p style="font-size:13px;color:#999;">小程序面对面付款页面场景码，默认的url: pages/page/pages/discount_payment/discount_payment</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addtechnician">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商城页面设计" name="second" v-if="false">
              <MallDegsin></MallDegsin>
          </el-tab-pane>
          <el-tab-pane label="商城主题" name="three" v-if="false">
              <MallTheme></MallTheme>
          </el-tab-pane>
          <el-tab-pane label="配送模版" name="fourth">
              <MallDistrTemplate></MallDistrTemplate>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script>
import { log } from 'util';
import MallDegsin from '@/components/page/setting/MallDegsin.vue';
import MallDistrTemplate from '@/components/page/setting/MallDistrTemplate.vue';
import MallTheme from '@/components/page/setting/MallTheme.vue';
export default {
  data() {
    return {
      form: {
        appid: "",
        appSecret: "",
        mchId: "",
        key: "",
        certPath: "",
        certData: "",
        payClientIp: "",
        notifyUrl: "",
        refundNotifyUrl: "",
      },
      page:'pages/page/pages/discount_payment/discount_payment',
      scene:'2',
      shopDetail:{appid:''},
      codeUrl:'',
      activeName:'first'
    };
  },
  created() {
    this.getpayid();
    this.getShopDetail();
    // 设置模版后返回需要代码
    if(localStorage.getItem('activeName')){
      this.activeName = localStorage.getItem('activeName');
      localStorage.removeItem('activeName');
    }
  },
  watch: {
    'form.appid':{
      handler(v,o){
        this.getqrcode();
      },
      immediate:true
    }
  },
  methods: {
    tabChange(tab){
      this.activeName = tab.name;
    },
    getShopDetail(){
      const params = {id:window.localStorage.getItem("shopid")};
      this.req.post("/store/detail", params).then(res => {  
          if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
            this.shopDetail = res.data.data;
            this.form.appid = this.shopDetail.appid;
            if(!this.form.appSecret){
              this.form.appSecret = this.shopDetail.secret;
            }
          }

      })
    },
    getqrcode(){
      var url = process.env.NODE_ENV=="development"?location.origin+'/api':location.origin;
      var codeUrl = url+'/miniapp/getQrcode?appid='+this.form.appid+'&page='+this.page+'&scene='+this.scene;
      this.req.post(codeUrl).then(res=>{
          console.log(res.data);
          if(res.status=='200'){
            this.codeUrl=codeUrl;
          }
          if(res.data.errcode){
            this.codeUrl='';
          }
          if(res.data==2){
            this.codeUrl='';
          }
      }).catch(err=>{
        this.codeUrl='';
      })
    },
    addtechnician() {
      const params = {
        id:this.form.id,
        appid: this.form.appid,
        appSecret: this.form.appSecret,
        mchId: this.form.mchId,
        key: this.form.key,
        certPath: this.form.certPath,
        certData: this.form.certData,
        payClientIp: this.form.payClientIp,
        notifyUrl: this.form.notifyUrl,
        refundNotifyUrl: this.form.refundNotifyUrl
      };
      console.log(params);
      this.req
        .post("/payconfig/save", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.$message('保存成功');
          } else {
            this.$message.error('保存失败');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getpayid(){
       this.req.post("/payconfig/getinfo").then(res => {
          if (res.data.sub_code == "SUCCESS") {
            this.form = res.data.data
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    beforeUplaod(file){
      if(file && file.type && file.type=='application/x-pkcs12'){
        return true;
      }
      this.$message.error('文件类型错误，请重试');
      return false;
    },
    changeFile(file){
      if(file && file.response && file.response.code=='SUCCESS' && file.response.sub_code=='SUCCESS'){
        this.$message.success('上传成功');
        this.form.certPath=file.response.sub_msg;
      }
    }
   
  },
  components:{
    MallDegsin,
    MallTheme,
    MallDistrTemplate
  }
};
</script>
<style scoped>
.Specialtytags {
  display: inline-block;
  line-height: 20px;
  border-radius: 30px;
  border: 1px #00d1b2 solid;
  text-align: center;
  padding: 0 5px;
}
.Specialtytags i:hover {
  color: #00d1b2;
  cursor: pointer;
}
</style>
<style>
.upload-demo .el-upload--text{border:none;width:initial;height:inherit;position:initial;overflow:initial;}
.input-dis .el-input__inner{border:none !important;}
</style>
