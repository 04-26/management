<template>
  <div>
    <el-card :body-style="{ padding: '0px' }">
      <div slot="header"><span>店铺详情</span></div>
      <el-row :gutter="10" style="margin-top:15px;">
          <el-form ref="form" :model="form" label-width="200px" :rules="rules">
            <el-col :span="12">
              <el-form-item label="店铺名称" prop="shopName">
                <el-input v-model="form.shopName"></el-input>
              </el-form-item>
              <el-form-item label="微信小程序APPID" prop="appid">
                <el-input v-model="form.appid"></el-input>
              </el-form-item>
              <el-form-item label="微信小程序SECRET" prop="secret">
                <el-input v-model="form.secret"></el-input>
              </el-form-item>
              <el-form-item label="店铺描述" prop="search">
                <el-input v-model="form.search" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="店铺简介" prop="storeDetail.shopDesc">
                <TinymceEditor style="width:100%;" v-model="form.storeDetail.shopDesc"></TinymceEditor>
              </el-form-item>
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="form.tel"></el-input>
              </el-form-item>
              <el-form-item label="默认评级">
                <el-rate v-model="form.level" style="margin-top: 6px;" :value="5"></el-rate>
              </el-form-item>
              <el-form-item label="营业时间">
                <el-input v-model="form.openDesc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺LOGO" prop="logo">
                <el-upload :action="$upfileUrl()" list-type="picture-card" :on-preview="logoPrew" style="overflow:hidden;" 
                  :on-remove="logoRemove" name="file" :data="upData" :on-success="logoSucc" :file-list="logoArr" :show-file-list="false">
                  <i class="el-icon-plus" v-if="!form.logo"></i>
                  <img :src="$imgurl()+form.logo" v-if="form.logo" style="width:100%;height:98%;">
                </el-upload>
              </el-form-item>
              <el-form-item label="宣传视频" class="video-upload">
                <el-upload class="avatar-uploader" :action="$upfileUrl()" accept=".mp4, .qlv, .qsv, .ogg, .flv, .avi, .wmv, .rmvb" :data="upData" 
                  :show-file-list="false" :before-upload="beforeUploadVideo" :on-success="handleVideoSuccess">
                  <div v-if="Video" style="position:relative;">
                    <video  :src="$imgurl()+Video" width="350" height="180" controls="controls">您的浏览器不支持视频播放</video>
                    <el-button type="danger" icon="el-icon-delete" circle style="position: absolute;right: 15px;top: 15px;font-size: 20px;padding: 5px;" @click.stop="delVideo"></el-button>
                  </div>
                  <div v-else class="el-icon-plus avatar-uploader-icon"></div>
                </el-upload>
                <span style="color:#b1b1b1;padding-left:10px">视频最大不超过10M</span>
              </el-form-item>
              <el-form-item label="店铺banner"  class="banner" prop="storeDetail.bannerUrl">
                <el-upload :action="$upfileUrl()" list-type="picture-card" :on-preview="bannerPrew" :on-remove="bannerRemove" 
                   :data="upData" :on-success="bannerSucc" multiple :limit="4" :file-list="imgArr" :show-file-list="true">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" height="100" :src="dialogImageUrl" alt />
                </el-dialog>
                <span style="color:#b1b1b1;padding-left:10px">最多可上传4张，建议尺寸750X420PX</span>
              </el-form-item>
              <el-form-item label="店铺地址" prop="regionId">
                <el-select style="width:150px" ref="prev" v-model="form.provinceId" placeholder="选择省" @change="changeaddress(1)">
                    <el-option v-for="(item, index) in prev" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select style="width:150px" v-model="form.cityId" placeholder="选择城市" @change="changeaddress(2)">
                    <el-option v-for="(item, index) in city" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select style="width:150px" v-model="form.regionId" placeholder="选择区县" @change="changeaddress(3)">
                    <el-option v-for="(item, index) in region" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入详细地址" style="width:450px;">
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-input v-model="saddress" id="address" placeholder="请输入搜索地址" style="width:450px;">
                    <template slot="append">
                      <el-button type="primary" @click.native="mapGeo(saddress)">搜索</el-button>
                    </template>
                </el-input>
                <div id="container"></div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="22" style="padding:15px;">
            <el-button type="primary" @click="saveDetail" size="large">保 存</el-button>
          </el-col>
        </el-row>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <div style="width:100%;height:600px;overflow:hidden;overflow-y:auto;">
        <img :src="dialogImageUrl" style="width:100%;">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TinymceEditor from "../../common/Tinymce"
import _ from "lodash"
import { setTimeout } from 'timers';
import bus from '@/components/common/bus';
export default {
  name:"StoreDetail",
  data(){
    return {
      map:{},
      prev:[],
      city:[],
      region:[],
      logoArr:[],
      imgArr:[],
      Video:'',
      upData:{
        type: "storeMassage"
      },
      dialogVisible:false,
      dialogImageUrl:'',
      address:'',
      saddress:'',
      marker:null,
      form:{
        adCode: '',
        address: "",
        appid: "",
        audit: 3,
        cityId: 0,
        flag: 1,
        lat: "",
        level: 5,
        lng: "",
        logo: "",
        openDesc: "",
        provinceId: 0,
        regionId: 0,
        remark: "1",
        search: "",
        secret: "",
        shopName: "",
        startPrice: "",
        status: 1,
        storeDetail: {
          bannerUrl: "",
          shopDesc:'',
        },
        tel: "",
        uid: 0,
        workerNum: 0,
      },
      rules:{
        address: [{required:true,message:'详细地址还没填写',trigger: 'blur'}],
        appid: [{required:true,message:'请填写微信小程序APPID',trigger: 'blur'}],
        logo: [{required:true,message:'请上传店铺LOGO',trigger: 'blur'}],
        regionId: [{required:true,message:'还没有选择店铺所在区',trigger: 'blur'}],
        search: [{required:true,message:'请填写店铺描述',trigger: 'blur'}],
        secret: [{required:true,message:'请填写微信小程序SECRET',trigger: 'blur'}],
        shopName: [{required:true,message:'请填写店铺名称',trigger: 'blur'}],
        storeDetail: {
          bannerUrl: [{required:true,message:'请上传店铺banner',trigger: 'blur'}],
          shopDesc:[{required:true,message:'请填写店铺简介',trigger: 'blur'}],
        },
        tel: [{required:true,message:'请填写联系电话',trigger: 'blur'}],
      }
    }
  },
  created() {
    setTimeout(()=>{
      this.mapInit();
    },1000)
    this.getStoreDetail();
  },
  methods: {
    delVideo(){
      this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Video='';
        })
    },
    getStoreDetail(){
      var params = {id: window.localStorage.getItem("shopid")};
      this.req.post("/store/detail", params).then(res => {
        if(res.data.code=='SUCCESS' && res.data.sub_code=="SUCCESS"){
          this.form = res.data.data;
          this.logoArr[0] = this.$imgurl()+this.form.logo;
          this.form.storeDetail.bannerUrl = this.form.storeDetail.bannerUrl ? this.form.storeDetail.bannerUrl.split(","):[];
          if(this.form.storeDetail.bannerUrl.length>0){
            this.form.storeDetail.bannerUrl.forEach(item=>{
                var imgObj = {name:'banner',url:this.$imgurl()+item};
                this.imgArr.push(imgObj);
            })
          }
          // 获取省份
          this.getRegion(1,1);
          if(this.form.provinceId){
            this.getRegion(this.form.provinceId,2);
          }
          if(this.form.cityId){
            this.getRegion(this.form.cityId,3);
          }
        }else{
          this.$message.error(res.data.sub_msg);
        }
      });
    },
    saveDetail(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
            if(this.Video){
              this.form.storeDetail.bannerUrl.push(this.Video);
            }
            var params = Object.assign({},this.form);
            params['storeDetail.bannerUrl'] = this.form.storeDetail.bannerUrl.toString();
            params['storeDetail.shopDesc'] = this.form.storeDetail.shopDesc;
            delete params.storeDetail;
            this.req.post("/store/save", params).then(res => {
                if (res.data.sub_code == "SUCCESS" && res.data.code=='SUCCESS') {
                  this.$message.success("保存成功");
                  bus.$emit('close_current_tags');
                  this.$router.push("/store");
                } else {
                  this.$message.error(res.data.sub_msg);
                }
            })
          } else {
            return false;
          }
        });
    },
    logoRemove(file, fileList) {
      console.log(file, fileList);
    },
    logoPrew(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    logoSucc(response,file, fileList) {
      if(response.code=='SUCCESS' && response.sub_code=="SUCCESS"){
        this.form.logo=response.data;
        this.logoArr[0] = this.$imgurl()+response.data;
      }else{
        this.$message.error(response.sub_msg);
      }
    },
    bannerRemove(file, fileList) {
      console.log(file);
      var index = _.findIndex(this.form.storeDetail.bannerUrl,(o)=>{ return file.url.indexOf(o);});
      if(index!=-1){
        this.form.storeDetail.bannerUrl.shift(1,index);
      }
    },
    bannerPrew(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    bannerSucc(response,file, fileList) {
      if(response.code=='SUCCESS' && response.sub_code=="SUCCESS"){
        this.form.storeDetail.bannerUrl.push(response.data);
        var imgObj = {name:'banner',url:this.$imgurl()+response.data};
      }else{
        this.$message.error(response.sub_msg);
      }
    },
    beforeUploadVideo(file) {
      //视频上传之前判断他的大小
      const isLt10M = file.size / 1024 / 1024 < 2000;
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过2000MB哦!");
        return false;
      }
    },
    handleVideoSuccess(res, file) {
      //视频上传成功之后返回视频地址
      this.Video = res.data;
    },
    getRegion(pid,level){
      var params = {pid: pid};
      this.req.post("/content/getregionlist", params).then(res => {
          if (res.data.sub_code == "SUCCESS" && res.data.code=="SUCCESS") {
            if(level==1){
              this.prev = res.data.data;
            }else if(level==2){
              this.city = res.data.data;
            }else if(level==3){
              this.region= res.data.data;
            }
            this.$forceUpdate();
          } else {
            this.$message.error(res.data.sub_msg);
          }
      });
    },
    changeaddress(val){
      if(val==1){
        this.form.cityId='';
        this.form.regionId='';
      }
      if(val==2){
        this.form.regionId='';
      }
      if(val==3){
        var prevIndex = _.findIndex(this.prev,(o)=>{return o.id==this.form.provinceId});
        var cityIndex = _.findIndex(this.city,(o)=>{return o.id==this.form.cityId});
        var regionIndex = _.findIndex(this.region,(o)=>{return o.id==this.form.regionId});
        if(!this.region[regionIndex].adCode){
          this.form.adCode = this.city[cityIndex].adCode;
        }else{
          this.form.adCode = this.region[regionIndex].adCode;
        }
        this.address = this.prev[prevIndex].name+this.city[cityIndex].name+this.region[regionIndex].name
        this.mapGeo(this.address);
      }
      if(this.form.provinceId){
        this.getRegion(this.form.provinceId,2);
      }
      if(this.form.cityId){
        this.getRegion(this.form.cityId,3);
      }
    },
    mapInit(){
      this.map = new qq.maps.Map(document.getElementById("container"), {
        center: new qq.maps.LatLng(29.57, 106.55), //地图中心坐标 重庆
        zoom: 13, //地图缩放级别
        draggable: true, //是否可拖拽
        scrollwheel: true, //是否可滚动缩放
      });
      this.mapGeo();
    },
    mapGeo(address){
      if(!this.address){
        this.changeaddress(3);
      }
      var saddress = address?this.address+this.saddress:this.form.address;
      var geo = new qq.maps.Geocoder({
          complete : (result)=>{
              // this.form.address = result.detail.addressComponents.street+(result.detail.addressComponents.town?result.detail.addressComponents.town:'');
              this.map.setCenter(result.detail.location);
              this.form.lng = result.detail.location.lng;
              this.form.lat = result.detail.location.lat;
              if(this.marker){
                this.marker.setMap(null);
              }
              this.marker = new qq.maps.Marker({
                  map:this.map,
                  position: result.detail.location,
                  // animation: qq.maps.MarkerAnimation.BOUNCE,
              });
              this.$forceUpdate();

          }
      });
      
      geo.getLocation(saddress);
      qq.maps.event.addListener(this.map, 'click', (res)=>{
          this.form.lng = res.latLng.lng;
          this.form.lat = res.latLng.lat;
          geo.getAddress(res.latLng);
      });
    }
  },
  components:{
    TinymceEditor
  }
}
</script>
<style scope>
  .avatar-uploader .el-upload {border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;}
  .avatar-uploader .el-upload:hover {border-color: #409eff;}
  .avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 178px;height: 178px;line-height: 178px;text-align: center;}
  .banner .el-upload-list--picture-card .el-upload-list__item{width:80px !important;height:80px !important;}
  .banner .el-upload--picture-card{width:80px !important;height:80px !important;line-height:80px !important;}
  .tox-tinymce{height:600px !important;}
  #container{width:450px;height:240px;margin-top:10px;}
</style>