<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺信息编辑</span>
      </div>
      <div class="container">
        <el-form style="height:100%" ref="form" :rules="rules" :model="form" label-width="220px">
          <el-form-item label="店铺logo：" prop="PackingImage">
            <el-upload :action="$upfileUrl()" list-type="picture-card" :on-preview="handlePictureCardPreview1" 
              :on-remove="handleRemove1" :name="filename1" :data="updata1" :on-success="suss1" :file-list="imgarr1" :show-file-list="true">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item label="店铺名称：">
            <el-input style="width:300px" v-model="form.shopName"></el-input>
          </el-form-item>
          <el-form-item label="微信小程序的appid：">
            <el-input style="width:300px" v-model="form.appid"></el-input>
          </el-form-item>
          <el-form-item label="微信小程序的secret：">
            <el-input style="width:300px" v-model="form.secret"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="tel">
            <el-input style="width:300px" v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="星级：" prop="level">
            <el-input style="width:300px" v-model="form.level"></el-input>
            <span style="color:#b1b1b1;padding-left:10px">请输入1-5的整数</span>
          </el-form-item>
          <el-form-item label="营业时间：">
            <el-input style="width:300px;" v-model="form.openDesc"></el-input>
            <span style="color:#b1b1b1;padding-left:10px">格式如 9：00-17：00(可以在后面加文字描述)</span>
          </el-form-item>
          <el-form-item label="图片上传" prop="PackingImage">
            <el-upload :action="$upfileUrl()" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" 
              :name="filename" :data="updata" :on-success="suss" multiple :limit="4" :file-list="imgarr" :show-file-list="true">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" height="100" :src="dialogImageUrl" alt />
            </el-dialog>
            <span style="color:#b1b1b1;padding-left:10px">最多可上传4张，建议尺寸750X420PX</span>
          </el-form-item>
          <el-form-item label="添加视频" class="video-upload">
            <el-upload class="avatar-uploader" :action="$upfileUrl()" accept=".mp4, .qlv, .qsv, .ogg, .flv, .avi, .wmv, .rmvb" :data="updata" 
              :show-file-list="false" :before-upload="beforeUploadVideo" :on-success="handleVideoSuccess" :on-progress="uploadVideoProcess" :file-list="imgarr3">
              <div v-if="Video !='' && videoFlag == false" style="position:relative;">
                <video  :src="Video" width="350" height="180" controls="controls">您的浏览器不支持视频播放</video>
                <el-button type="danger" icon="el-icon-delete" circle style="position: absolute;right: 15px;top: 15px;font-size: 20px;padding: 5px;" @click.stop="delVideo"></el-button>
              </div>
              <i v-else-if="Video =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
              <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px"></el-progress>
            </el-upload>
            <span style="color:#b1b1b1;padding-left:10px">视频最大不超过10M</span>
          </el-form-item>
          <el-form-item label="店铺描述：" prop="search">
            <el-input type="textarea" v-model="form.search" maxlength="250" style="width:730px;" placeholder="请输入店铺描述，不要超过250字"></el-input>
          </el-form-item>
          <el-form-item label="店铺介绍：" prop="shopDesc">
            <p style="color:#b1b1b1;padding-bottom:10px">请填写店铺介绍 可传图片与文字</p>
            <tinymce-editor ref="editor" v-model="msg"></tinymce-editor>
          </el-form-item>
          <el-form-item label="门店地址：" prop="region">
            <el-select
              style="width:100px"
              v-model="citymsg"
              placeholder="选择省"
              @change="changeaddress(citymsg)"
            >
              <el-option
                v-for="item in addressList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              style="width:100px"
              v-model="citysub"
              placeholder="选择市"
              @change="changecity(citysub)"
            >
              <el-option v-for="item in subcity" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select style="width:100px" v-model="citysubs" placeholder="选择区">
              <el-option
                v-for="item in subscity"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="详细地址：">
            <div class="home">
              <!-- <input style="width:200px;height:30px;border-radius:5px;" type="text" class="address" /> -->
              <input
                style="width:200px;height:30px;border-radius:5px;"
                type="text"
                class="address"
                id="inputqq"
                v-on:input="searchs"
              />
              <el-button
                style="height:30px;width:50px"
                type="primary"
                size="mini"
                @click="searchs"
              >搜索</el-button>
              <input style="opacity:0" type="text" readonly id="lat" />
              <input style="opacity:0" type="text" readonly id="lng" />
              <div id="container"></div>
            </div>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button class="editor-btn" type="primary" @click="submit">保存编辑</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import TinymceEditor from "../../common/Tinymce";
import axios from "axios";
import { setTimeout } from 'timers';
import _ from "lodash"
export default {
  name: "markdown",
  components: {
    TinymceEditor
  },
  data: function() {
    // 自定义验证密码的函数
    const validatelevel = (rule, value, callback) => {
      if (value <= 0 || value > 5) {
        // 非空
        callback(new Error("请输入正确的数字(1-5)"));
      } else {
        callback();
      }
    };
    return {
      form: {
        ida: "", //店铺id
        audit: "3", //审核状态,1=待审核，2=审核失败，3=通过审核
        lng: "", //纬度
        lat: "", //经度
        adCode: "1", //区域代码
        shopName: "", //店铺名称
        tel: "", //联系电话
        logo: [], //店铺lOGO
        search: "", //店铺关键词
        provinceId: "", //所属省
        cityid: "", //所属城市
        regionld: "", //所属区县
        level: "", //店铺星级
        startPrice: "", //店铺起止价格
        flag: "1", //是否为旗舰店，1-普通店，2-旗舰店，3-加盟店，4-自营，5-盲人店
        openDesc: "", //营业时间描述
        status: "1", //状态：1-启用，2-禁用
        remark: "1", //审核备注
        appid: "", //微信小程序的appid
        secret: "", //微信小程序的secret
        shopDesc: "",
        shopSign:""
        // resource: "1",//
        // desc: "1",//
        // delivery: false,//
        //  cityInfo:'',
      },
      bannerUrl: [], //店铺ID 店铺描述 店铺banner，多个用逗号隔开，上传的视频也拼接在这个里面。
      citysubs: "",
      subscity: "", //区
      citymsg: "", //省
      citysub: "",
      subcity: "", //市
      rules: {
        tel: [
          {
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的号码格式",
            trigger: "blur"
          }
        ],
        level: [
          {
            required: true,
            pattern: /^\d+$|^\d+[.]?\d+$/,
            validator: validatelevel,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ]
      },
      geolocation: "",
      positionNum: "",
      options: "",
      address: "",
      map: null,
      lat: "", //经度
      lng: "", //纬度
      addressList: [],
      uploadImageUrl: "", //存储上传图片返回的路径
      uploadImageName: "", //上传图片的名字
      fileList: [], //存放需要显示的图片的名字和路径
      videoFlag: false, //刚开始的时候显示为flase
      videoUploadPercent: "0%", //进度条刚开始的时候为0%
      paramsdata: {},
      videourl: false,
      Video: "",
      Params: new FormData(),
      dataform: {
        fileData: {},
        type: "feedback"
      },
      dialogImageUrl: [],
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      updata1: {
        type: "storeMassage"
      },
      filename: "file",
      filename1: "file",
      imgdata: "",
      msg: "",
      imgarr1: [],
      imgarr: [],
      imgarr3: [],
      bannerimgUrl: []
    };
  },
  methods: {
    delVideo(){
      this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.Video='';
          var vidx = _.findIndex(this.bannerUrl,function(o){return o==this.Video}); 
          if(vidx!=-1){
            this.bannerUrl.splice(vidx,1);
          }
        })
    },
    // 将图片上传到服务器，返回地址替换到md中
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    suss(response, file, fileList) {
      // this.bannerUrl = this.bannerUrl.split(",")
      this.bannerUrl.push(response.data);
      // this.imgarr.push(response.data)
      console.log(this.bannerUrl);
    },
    // 将图片上传到服务器，返回地址替换到md中
    handleRemove1(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    suss1(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.form.logo = response.data;
    },
    submit() {
      this.imgarr1 = [];
      this.imgarr = [];
      this.imgarr3 = [];
      this.form.shopDesc = this.msg;
      if (this.bannerUrl == "") {
        this.bannerUrl = this.bannerimgUrl;
      } else {
        this.bannerUrl = this.bannerUrl.toString();
      }
      if(this.Video.length==0){
        var bannerUrl = this.bannerUrl.split(',');
        var vidx = _.findIndex(bannerUrl,function(o){return o.indexOf('.mp4')!=-1});
        bannerUrl.splice(vidx,1);
        this.bannerUrl = bannerUrl.toString();
      }
      const params = {
        id: window.localStorage.getItem("shopid"),
        address: this.address,
        audit: this.form.audit,
        lng: this.lng,
        lat: this.lat,
        // adCode: this.form.adCode,//
        shopName: this.form.shopName,
        tel: this.form.tel,
        logo: this.form.logo,
        search: this.form.search,
        provinceId: this.citymsg.id,
        cityId: this.subcity.id,
        regionId: this.subscity.id,
        level: this.form.level,
        startPrice: this.form.startPrice,
        flag: this.form.flag,
        openDesc: this.form.openDesc,
        status: this.form.status,
        workerNum: this.form.workerNum,
        remark: this.form.remark,
        appid: this.form.appid,
        secret: this.form.secret,
        "storeDetail.shopDesc": this.form.shopDesc,
        "storeDetail.bannerUrl": this.bannerUrl
      };
      console.log(params);
      console.log(this.bannerUrl);
      // delete params.appid;
      // delete params.secret;
      this.req
        .post("/store/save", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            // this.getshopmsg();
            this.$router.push("/store");
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getaddress() {
      const params = {
        pid: this.pid
      };
      this.req
        .post("/content/getregionlist", params)
        .then(res => {
          console.log(res);
          // 判断
          let { data } = res.data;
          if (res.data.sub_code == "SUCCESS") {
            this.addressList = data;
            // this.$router.go(0);
            this.$forceUpdate();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeaddress(id) {
      let params = {
        pid: id
      };
      this.req
        .post("/content/getregionlist", params)
        .then(res => {
          console.log(res.data.data);
          this.subcity = res.data.data;
          // 判断
          if (res.data.sub_code == "SUCCESS") {
            this.citysub = "";
            this.citysubs = "";
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changecity(id) {
      let params = {
        pid: id
      };
      this.req
        .post("/content/getregionlist", params)
        .then(res => {
          console.log(res.data.data);
          this.subscity = res.data.data;
          // 判断
          if (res.data.sub_code == "SUCCESS") {
            this.citysubs = "";
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchs() {
      var that = this;
      that.address = document.querySelector(".address").value;
      var geo = new qq.maps.Geocoder();
      geo.getLocation(that.address); //地址
      // console.log(geo)
      geo.setComplete(function(res) {
        let lat = res.detail.location.lat; //经度
        let lng = res.detail.location.lng; //纬度
        that.lat = lat;
        that.lng = lng;
        document.querySelector("#lat").value = lat;
        document.querySelector("#lng").value = lng;
        window.map = new qq.maps.Map(document.getElementById("container"), {
          center: new qq.maps.LatLng(lat, lng), //将经纬度加到center属性上
          zoom: 15, //缩放
          draggable: true, //是否可拖拽
          scrollwheel: true, //是否可滚动缩放
          disableDoubleClickZoom: false
        });
        var marker = new qq.maps.Marker({
          position: res.detail.location, //标记的经纬度
          animation: qq.maps.MarkerAnimation.BOUNCE, //标记的动画
          map: map //标记的地图
        });

        var citylocation = new qq.maps.CityService({
          //设置地图
          map: map,
          complete: function(results) {
            console.log(9999, results);
          }
        });
      });
    },
    init() {
      window.map = new qq.maps.Map(document.getElementById("container"), {
        center: new qq.maps.LatLng(29.57, 106.55), //地图中心坐标 重庆
        zoom: 13 //地图缩放级别
      });
    },
    beforeUploadVideo(file) {
      //视频上传之前判断他的大小
      const isLt10M = file.size / 1024 / 1024 < 2000;
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过2000MB哦!");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      //视频上传的时候获取上传进度传给进度条
      this.videoFlag = true;
      this.videoUploadPercent = parseInt(file.percentage);
      console.log(this.videoUploadPercent);
    },
    handleVideoSuccess(res, file) {
      //视频上传成功之后返回视频地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.bannerUrl.push(res.data);
      this.Video = this.$imgurl()+res.data;
    },
    // 获取店铺信息回填
    getshopmsg() {
      const params = {
        id: window.localStorage.getItem("shopid")
      };
      this.req.post("/store/detail", params).then(res => {
          this.bannerimgUrl = res.data.data.storeDetail.bannerUrl;
          document.querySelector(".address").value = res.data.data.address;
          this.searchs();
          this.init();
          this.form = res.data.data;
          this.form.logo = this.form.logo;
          this.msg = this.form.storeDetail.shopDesc;
          this.getaddress();
          let imgArr = [],
            videoArr = [],
            newUrl = "";
          newUrl = res.data.data.storeDetail.bannerUrl.split(",");
          this.imgArr = newUrl;
          newUrl.forEach(item => {
            console.log(item.indexOf(".png", "jpg"));
            if (item.indexOf(".png") != -1 || item.indexOf(".jpg") != -1) {
              imgArr.push(item);
            } else if (item.indexOf(".mp4") != -1) {
              videoArr.push(item);
              this.Video = this.$imgurl()+item;
            }
          });
          imgArr.forEach((item, i) => {
            let imgArr = this.$imgurl()+item;
            this.imgarr.push({
              url: imgArr,
              name: i,
              id: i
            });
          });
          videoArr.forEach((item, i) => {
            let imgArrvideo = this.$imgurl()+item;
            this.imgarr3.push({
              url: imgArrvideo,
              name: i,
              id: i
            });
          });
          this.imgarr1.push({
            url: this.$imgurl()+res.data.data.logo,
            name: res.data.data.logo,
            id: res.data.data.id
          });

          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        });
    }
  },
  created() {
    this.getshopmsg();
    setTimeout(()=>{
      this.getaddress();
      this.init();
      this.searchs();
    },100)
  },
  mounted(){
    this.init();
    
  }
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
  padding: 10px;
  width: 80px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.video-avatar {
  width: 400px;
  height: 200px;
}
* {
  margin: 0px;
  padding: 0px;
}

body,
button,
input,
select,
textarea {
  font: 12px / 16px Verdana, Helvetica, Arial, sans-serif;
}

p {
  width: 500px;
  padding-top: 3px;
  overflow: hidden;
}

#container {
  width: 800px;
  margin-top: 10px;
  height: 300px;
  min-width: 500px;
  min-height: 300px;
  margin-bottom: 20px;
}
.container {
  height: 100%;
  padding: 20px;
}
#inputqq {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>
