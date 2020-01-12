<template>
  <div>
      
      <div id="div_second_table" data-spy="scroll" data-target="#navbar-example" data-offset="0" style=" height:100%;overflow:auto;position:relative;">
        <el-form label-position=top :rules="rules" :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm" style="overflow:hidden;">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
                <el-form-item label="激活码：" prop="shopSign">
                  <el-input v-model="ruleForm.shopSign"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="微信小程序的appid：" prop="appid">
                <el-input v-model="ruleForm.appid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="微信小程序的secret：" prop="secret">
                <el-input v-model="ruleForm.secret"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="店铺名称：" prop="shopName">
                <el-input v-model="ruleForm.shopName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="主营类目：" prop="flag">
                <el-select v-model="ruleForm.flag" placeholder="选择经营类目" style="width:100%;">
                  <el-option label="美容院" :value="1"></el-option>
                  <el-option label="养生保健" :value="2"></el-option>
                  <el-option label="健身瑜伽" :value="3"></el-option>
                  <el-option label="美甲美睫" :value="4"></el-option>
                  <el-option label="医疗美容" :value="5"></el-option>
                  <el-option label="综合店" :value="6"></el-option>
                  <el-option label="其他" :value="7"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
                <el-form-item  style="width:100%" label="选择省/市/区：" prop="regionld">
                  <el-select style="width:100px;" v-model="citymsg" placeholder="选择省" @change="changeaddress(citymsg)">
                    <el-option v-for="item in addressList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-select style="width:100px;" v-model="citysub" placeholder="选择市" @change="changecity(citysub)">
                    <el-option v-for="item in subcity" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <el-select style="width:100px;" v-model="citysubs" placeholder="选择区" @change="chageRegion">
                    <el-option v-for="item in subscity" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-form-item label="详细地址：">
                  <el-input v-model="ruleForm.address">
                    <template slot="append">
                      <el-button type="primary" @click="search">搜索</el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <div class="home" v-show="false">
                  <div class="home-content" style="padding-bottom:10px;font-size: 14px;color: #606266;line-height: 30px;">
                    <p> <span style="color: #f56c6c;">*</span> 详细地址：&nbsp;&nbsp;&nbsp;&nbsp;</p>
                    <input style="width:300px;height:30px;border-radius:5px;" type="text" v-model="ruleForm.address" class="address" id="inputqq" v-on:input="search"/>
                    <el-button style="height:30px;" type="primary" size="mini" @click="search">搜索</el-button>
                    <input  style="opacity:0" type="text" readonly class="imputqq" id="lat" />
                    <input  style="opacity:0" type="text" readonly class="imputqq" id="lng" />
                  </div>
                </div>
                <div id="container" style="width:100%;height:300px;"></div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="">
                <el-checkbox-group v-model="initdata">
                  <el-checkbox label="initdata" name="initdata" :true-label="1" :false-label="0">是否初始化数据（系统默认设置好的服务项目，推拿服务行业可勾选）</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>
<script>
import _ from "lodash"
export default {
  name:'Createshop',
  data() {
    return {
      ruleForm: {
        secret:'',
        appid:'',
        address: "",
        lng: "",
        lat: "",
        cityid: "",
        regionld: "",
        provinceId: "",
        shopName: "",
        flag: '',
        shopSign:'',
        adCode:''
      },
      marker:null,
      addressList: [],
      address: "",
      saddress:'',
      map: null,
      lat: "", //经度
      lng: "", //纬度
      citymsg: "",
      citysub: "",
      subcity: "",
      citysubs: "",
      subscity: "",
      initdata:0,
      rules: {
        shopName: [
          {required: true,message: "请输入店铺名称",trigger: "blur" }
        ],
        flag: [ 
          {required: true,message: "请选择主营类目",trigger: "blur" }
        ],
        shopSign: [ 
          {required: true,message: "请输入激活码",trigger: "blur" }
        ],
        appid: [ 
          {required: true,message: "请输入小程序appid",trigger: "blur" }
        ],
        secret: [ 
          {required: true,message: "请输入小程序secret",trigger: "blur" }
        ],
        regionld: [ 
          {required: true,message: "请选择正确的城市区域",trigger: "blur" }
        ]
      },
      geo:{}
    };
  },
  components: {
    //  CitySelect
  },
  computed: {
    //  cityName() {
    //    const names = [];
    //    this.cityInfo.province && names.push(this.cityInfo.province.name + ' ')
    //    this.cityInfo.city     && names.push(this.cityInfo.city.name + ' ')
    //    this.cityInfo.block    && names.push(this.cityInfo.block.name + ' ')
    //    return names.join('')
    //  }
  },
  created() {
    this.getaddress();
  },
  mounted() {
    this.init();
  },
  methods: {
    search() {
      var that = this;
      that.saddress = this.address+document.querySelector(".address").value;
      var geo = new qq.maps.Geocoder();
      geo.getLocation(that.saddress); //地址
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
        that.marker = new qq.maps.Marker({
          position: res.detail.location, //标记的经纬度
          animation: qq.maps.MarkerAnimation.BOUNCE, //标记的动画
          map: map //标记的地图
        });
        // that.init();
        that.mapClick();
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
        zoom: 13, //地图缩放级别
        draggable: true, //是否可拖拽
        scrollwheel: true, //是否可滚动缩放
        disableDoubleClickZoom: false
      });
      this.mapClick();
    },
    mapClick(){
      var geo = new qq.maps.Geocoder({
          complete : (result)=>{
              console.log(result);
              this.address = result.detail.address;
              this.ruleForm.address = result.detail.address;
              // this.address = result.detail.addressComponents.province+result.detail.addressComponents.city
              //                   +result.detail.addressComponents.district
              //                   +result.detail.addressComponents.street
              //                   +(result.detail.addressComponents.streetNumber?result.detail.addressComponents.streetNumber:result.detail.addressComponents.town);
              
              // this.ruleForm.address = this.address;
              map.setCenter(result.detail.location);
              document.querySelector(".address").value=this.address;
              if(this.marker){
                this.marker.setMap(null);
              }
              this.marker = new qq.maps.Marker({
                  map:map,
                  position: result.detail.location,
                  animation: qq.maps.MarkerAnimation.BOUNCE,
              });

          }
      });
      qq.maps.event.addListener(map, 'click', (res)=>{
          this.lng = res.latLng.lng;
          this.lat = res.latLng.lat;
          geo.getAddress(res.latLng);
      });
    },
    submitForm(formName) {
      this.ruleForm.regionld = this.citysubs;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            adCode: this.ruleForm.adCode,
            address: this.address,
            lng: this.lng,
            lat: this.lat,
            cityId: this.citysub,
            regionId: this.citysubs,
            provinceId: this.citymsg,
            appid: this.ruleForm.appid,
            secret: this.ruleForm.secret,
            shopName: this.ruleForm.shopName,
            shopSign: this.ruleForm.shopSign,
            initdata:this.initdata,
            flag:this.ruleForm.flag
          };
          this.req.post("/store/save", params).then(res => {
              if (res.data.sub_code == "SUCCESS") {
                this.$router.push({ path: "/myshop", name: "Myshop" });
              } else {
                this.$message.error(res.data.sub_msg);
              }
            }).catch(err => {
              console.log(err);
            });
        }else{
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getaddress() {
      const params = {
        pid: this.pid
      };

      this.req.post("/content/getregionlist", params).then(res => {
          console.log(res);
          // 判断
          let { data } = res.data;
          if (res.data.sub_code == "SUCCESS") {
            this.addressList = data;
            // res.data.data.map(item => {
            //   let params = {
            //     pid:item.id
            //   }
            //   this.req
            //     .post("/content/getregionlist", params)
            //     .then(res => {
            //       console.log(res.data.data);
            //       // 判断
            //       if (res.data.sub_code == "SUCCESS") {
            //       } else {
            //         this.$message.error(res.data.sub_msg);
            //       }
            //     })
            //     .catch(err => {
            //       console.log(err);
            //     });
            // });
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
    chageRegion(){
        var prevIndex = _.findIndex(this.addressList,(o)=>{return o.id==this.citymsg});
        var cityIndex = _.findIndex(this.subcity,(o)=>{return o.id==this.citysub});
        var regionIndex = _.findIndex(this.subscity,(o)=>{return o.id==this.citysubs});
        this.ruleForm.adCode = this.subscity[regionIndex].adCode;
        this.address = this.addressList[prevIndex].name+this.subcity[cityIndex].name+this.subscity[regionIndex].name;
        this.saddress = this.address+document.querySelector(".address").value;
        document.querySelector(".address").value=this.saddress
        this.search();
    }
  },
  
};
</script>

<style>
  body,button,input,select,textarea {font: 12px / 16px Verdana, Helvetica, Arial, sans-serif;}
  p {width: 300px;padding-top: 3px;overflow: hidden;}#container {width: 400px;height: 200px;min-width: 300px;min-height: 200px;margin-bottom: 20px;}
  /* .home-content {display: flex;} */
  #inputqq {-webkit-appearance: none;background-color: #fff;background-image: none;border-radius: 4px;border: 1px solid #dcdfe6;-webkit-box-sizing: border-box;box-sizing: border-box;color: #606266;display: inline-block;font-size: inherit;height: 40px;line-height: 40px;outline: 0;padding: 0 15px;-webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);width: 100%;}
  .imputqq {-webkit-appearance: none;background-color: #fff;background-image: none;border-radius: 4px;border: 1px solid #dcdfe6;-webkit-box-sizing: border-box;box-sizing: border-box;color: #606266;display: inline-block;font-size: inherit;height: 30px;line-height: 30px;outline: 0;padding: 0 15px;-webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);}
  .el-card__body{height: 100% !important;}
</style>
