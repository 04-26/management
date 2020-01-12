<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <!-- <img style="width:100px;height:100px" :src="`/img//${this.shopmsg.logo}`" alt /> -->
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple">
              <p>
                <span class="span-title">店铺名称：</span>
                {{this.shopmsg.shopName}}
                <el-button type="primary" v-if="isAuth"><a href="https://uatwxapi.xszam.com/wxapi/preauthorizationurl" target="_blank" style="color:#fff;">点击授权</a></el-button>
              </p>
              <p>
                <span class="span-title">联系电话：</span>
                {{this.shopmsg.tel}}
              </p>
              <p>
                <span class="span-title">星级：</span>
                <el-rate
                  v-model="value"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                ></el-rate>
              </p>
              <p>
                <span class="span-title">营业时间：</span>
                {{this.shopmsg.openDesc}} <el-button type="primary" size="mini" @click="editOpenTime">修改</el-button>
              </p>
              <div>
                <p class="span-title">店铺首页视频：</p>
                <video :src="$imgurl()+videoArr[0]" controls="controls" width="420" height="340"></video>
              </div>
              <div>
                <p class="span-title">店铺首页图片:</p>
                <viewer :images="imgArr">
                  <img
                    style="with:100px;height:100px;cursor: pointer;padding:5px;"
                    v-for="(item,i) in imgArr"
                    :key="i"
                    :src="$imgurl()+item"
                    alt="#"
                  />
                </viewer>
              </div>
              <p>
                <span class="span-title">门店地址：</span>
                {{this.shopmsg.address}}
              </p>
              <p class="span-title">店铺介绍：</p>
              <div class="p-img" v-html="this.shopmsg.storeDetail.shopDesc"></div>
              <el-card style="width:450px;margin-bottom:15px;" v-loading="addressLoading">
                <div slot="header">
                  <div class="address">
                    <div>收货地址</div>
                    <div>
                      <el-button type="success" @click="getAddress" size="mini">刷新</el-button>
                      <el-button type="primary" @click="setAddress" size="mini">{{addressList.name?'修改':'新增'}}</el-button>
                    </div>
                  </div>
                </div>
                <div v-if='addressList.name'>
                    <p>姓名：{{addressList.name}}</p>
                    <p>联系电话：{{addressList.tel}}</p>
                    <p>联系地址：{{addressList.regionnames+addressList.address}}</p>
                </div>
              </el-card>
              <MallSet :shopDetail='shopmsg' width="450px"></MallSet>
              <p>
                <el-button @click="eidtshop" type="primary">编辑内容</el-button>
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog title="设置店铺营业时间" :visible.sync="openTime" width="600px">
      <div>
        <MallOpenTime ref='time'></MallOpenTime>
      </div>
    </el-dialog>
    <el-dialog title="设置店铺收货地址" :visible.sync="addressvisble" width="600px">
      <div>
        <SetAddress ref='address'></SetAddress>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import { close } from "fs";
import MallOpenTime  from '@/components/page/setting/MallOpenTime.vue';
import SetAddress  from '@/components/page/storemanagement/SetAddress.vue';
import MallSet from '@/components/page/storemanagement/MallSet.vue'
export default {
  data: function() {
    return {
      content: "",
      html: "",
      configs: {},
      value: 0,
      isError: false,
      id: "",
      shopmsg: {
        storeDetail: {
          bannerUrl: "",
          id: "",
          shopDesc: ""
        }
      },
      imgArr: [],
      videoArr: "",
      isAuth:false,
      openTime:false,
      addressvisble:false,
      addressList:{name:'',tel:'',regionnames:'',address:''},
      addressLoading:false
    };
  },
  methods: {
    setAddress(){
      this.addressvisble = true;
    },
    getAddress(){
        // /store/getreturninfo
        var param = {};
        this.addressLoading = true;
        this.req.post("/store/getreturninfo",param).then(res=>{
            this.addressLoading = false; 
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                if(res.data.data){
                  this.addressList = res.data.data;
                }
            }
        })
    },
    getAuth(){
      // 通过接口获取
      this.req.get("/wxapi/authorizer/"+this.shopmsg.appid).then(res => {
          if(res.authorization_info){
            this.isAuth=false;
          }else{
            this.isAuth=true;
          }
      })
    },
    eidtshop() {
      // console.log(1)
      this.$router.push("/informationediting");
    },
    getshopmsg() {
      const params = {
        id: window.localStorage.getItem("shopid")
      };
      this.req
        .post("/store/detail", params)
        .then(res => {
          console.log(res.data.data);
          this.shopmsg = res.data.data;
          this.value = this.shopmsg.level;
          let bannerUrl = this.shopmsg.storeDetail.bannerUrl;
          this.getAuth();
          console.log(bannerUrl);
          let imgArr = [],
            videoArr = [],
            newUrl = "";
          newUrl = bannerUrl.split(",");
          newUrl.forEach(item => {
            console.log(item.indexOf(".png", "jpg"));
            if (item.indexOf(".png") != -1 || item.indexOf(".jpg") != -1) {
              imgArr.push(item);
            } else if (item.indexOf(".mp4") != -1) {
              videoArr.push(item);
            }
          });
          this.imgArr = imgArr;
          this.videoArr = videoArr;
          console.log(this.imgArr);
          console.log(this.videoArr);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    editOpenTime(){
      this.openTime=true;
      setTimeout(()=>{
        this.$refs.time.getDateinfo();
      },100)
      
      
    }
    // initVideo() {
    //   //初始化视频方法
    //   let myPlayer = this.$video(myVideo, {
    //     //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
    //     controls: true,
    //     //自动播放属性,muted:静音播放
    //     autoplay: "muted",
    //     //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
    //     preload: "auto",
    //     //设置视频播放器的显示宽度（以像素为单位）
    //     width: "800px",
    //     //设置视频播放器的显示高度（以像素为单位）
    //     height: "400px"
    //   });
    // }
  },
  mounted() {},
  beforeDestroy() {},

  created() {
    this.getshopmsg();
    this.getAddress();
  },
  components:{
    MallOpenTime,
    SetAddress,
    MallSet
  }
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
}
.span-title {
  color: #4c4c4d;
  font-weight: 600;
  
}
.p-img>>>p img{
  height: 500px !important;
  width: 800px !important;
}
.box-card >>> .el-card__header{padding:6px 20px;}
.address{display:flex;justify-content: space-between;}
</style>
