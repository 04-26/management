<template>
  <div>
    <el-card  shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺认证/企业认证</span>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="企业名称：">
            <el-input style="width:200px" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="法人：">
            <el-input style="width:200px" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证正面照：" prop="PackingImage">
            <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :data="updata"
              :on-success="suss"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="身份证背面照：" prop="PackingImage">
            <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :data="updata"
              :on-success="suss"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="营业执照：" prop="PackingImage">
            <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :data="updata"
              :on-success="suss"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>

          <el-form-item label="门店地址：" prop="region">
            <el-select v-model="form.city" placeholder="选择省/市/区">
              <el-option
              ></el-option>
                <!-- v-for="item in addressList"
                :key="item.id"
                :label="item.name"
                :value="item.name" -->
            </el-select>
          </el-form-item>
          <div class="home" style="padding-left:80px">
            搜索地址:
            <input type="text" class="address">
            经度为：
            <input type="text" readonly id="lat">
            纬度为：
            <input type="text" readonly id="lng">
            <button @click="search">搜索</button>
            <div id="container"></div>
          </div>
          <el-form-item label="门头照片：" prop="PackingImage">
            <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :data="updata"
              :on-success="suss"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="店铺照片：" prop="PackingImage">
            <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :data="updata"
              :on-success="suss"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="收银照片：" prop="PackingImage">
            <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :data="updata"
              :on-success="suss"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item prop="verificationcode" label="手机验证：">
            <el-input type="text" v-model="form.verificationcode" placeholder="验证码"></el-input>
            <el-button @click="getCode(form)" :disabled="!show">
              <span v-show="show">获取验证码</span>
              <span v-show="!show" class="count">{{count}} s</span>
            </el-button>
          </el-form-item >
          <el-button class="editor-btn" type="primary">提交</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
const TIME_COUNT = 60;
export default {
  data() {
    return {
      form: {
        pid: "1"
      },
      dialogImageUrl: "",
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      filename: "file",
       show: true,
       count: "",
    };
  },
  methods: {
        search() {
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
    // getaddress() {
    //   // 发送请求给后端
    //   // 收集账号和密码
    //   const params = {
    //     pid: this.pid
    //   };

    //   this.req
    //     .post("/content/getregionlist", params)
    //     .then(res => {
    //       // 判断
    //       let { data } = res.data;
    //       if (res.data.sub_code == "SUCCESS") {
    //         this.addressList = data;
    //         this.addressList.map(item => {
    //           return this.addressList1.add(item.id);
    //         });
    //         const params = {};
    //         this.req
    //           .post("/content/getregionlist", params)
    //           .then(res => {
    //             console.log(res);
    //           })
    //           .catch(err => {
    //             console.log(err);
    //           });
    //         this.$message({
    //           type: "success",
    //           message: "成功"
    //         });
    //       } else {
    //         this.$message.error(res.data.sub_msg);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },

    getCode(form) {
      const params = {
        telphone: this.form.telphone,
        type: this.form.type
      };
      this.req
        .post("/content/smscode", params)
        .then(res => {
          // 接收后端返回的数据
          // let { item, reason, token, id } = res;
          console.log(res);
          // 判断
          if (res.data.sub_code === "SUCCESS") {
            this.code = res.data.data;
            console.log(this.code);
            // 弹成功提示
            this.$message({
              type: "success",
              message: res.msg
            });

            // 跳后端首页
            // this.$router.push('/index')
          } else {
            // 弹失败提示
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
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
      console.log(response);
      console.log(file);
      console.log(fileList);
    //   this.form.bannerUrl.push(response.data);
    }
  },
   mounted() {
    this.init();
  }
};
</script>
<style scoped>
#container {
    max-width: 400px;
  min-width: 300px;
  min-height: 200px;
  margin-bottom: 20px;
}
</style>

