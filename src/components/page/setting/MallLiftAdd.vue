<template>
  <div>
      <el-card class="card">
          <div slot="header">自提点设置</div>
          <div>
              <el-row :gutter="10" class="form-map">
                  <el-col :span="12">
                        <el-form ref="form" :model="form" label-width="150px" :rules="rules">
                            <el-form-item label="自提点名称" prop="name">
                                <el-input v-model="form.name" placeholder="请输入自提点名称"></el-input>
                            </el-form-item>
                            <el-form-item label="选择自提点" prop="regionId">
                                <el-select style="width:100px;" v-model="citymsg" placeholder="选择省" @change="changeaddress(citymsg)">
                                    <el-option v-for="item in addressList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <el-select style="width:100px;" v-model="citysub" placeholder="选择市" @change="changecity(citysub)">
                                    <el-option v-for="item in subcity" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <el-select style="width:100px;" v-model="form.regionId" placeholder="选择区" @change="chageRegion">
                                    <el-option v-for="item in subscity" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="详细地址" prop="address">
                                <el-input v-model="form.address" placeholder="请输入详细地址" ></el-input>
                            </el-form-item>
                            <el-form-item label="地图定位" prop="location">
                                <el-input v-model="maddress" v-if="form.regionId">
                                    <template slot="append">
                                        <el-button type="primary" @click="search">搜索</el-button>
                                    </template>
                                </el-input>
                                <div class="form-map-left">
                                    <div class="map" id="container">

                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="telphone">
                                <el-input v-model="form.telphone" placeholder="请输入联系电话" ></el-input>
                            </el-form-item>
                            <el-form-item label="自提时间段" prop="starttime">
                                <el-time-picker is-range v-model="liftTime" range-separator="至" 
                                    @change="changeTime"
                                    value-format='HH:mm'
                                    start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                                </el-time-picker> 
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" @click="save">保存</el-button>&nbsp;
                                <el-button type="info" @click="back">返回</el-button>
                            </el-form-item>
                        </el-form>
                  </el-col>
              </el-row>
          </div>
      </el-card>
  </div>
</template>
<script>
import Notes from '@/components/page/mall/Notes.vue';
import bus from '@/components/common/bus';
import _ from "lodash"
export default {
    name:"MallLiftAdd",
    data(){
        return {
            form:{
               name:'',
               address:'',
               regionId:'',
               telphone:'',
               starttime:'',
               endtime:'',
               location:''
            },
            rules:{
               name:{required:true,message:'请输入自提点名称',trigger:'blur'}, 
               address:{required:true,message:'请输入详细地址',trigger:'blur'},
               regionId:{required:true,message:'请选择详细地区',trigger:'blur'}, 
               telphone:{required:true,message:'请输入联系电话',trigger:'blur'}, 
               starttime:{required:true,message:'请设置自提时间段开始时间',trigger:'blur'}, 
               endtime:{required:true,message:'请设置自提时间段结束时间',trigger:'blur'}, 
               location:{required:true,message:'请设置自提点坐标',trigger:'blur'}, 
            },
            liftTime:[new Date(),new Date()],
            citymsg: "",
            citysub: "",
            subcity: "",
            citysubs: "",
            subscity: "",
            addressList: [],
            shopInfo:{lat:'',lng:''},
            map:{},
            marker:{},
            lng:'',
            lat:'',
            saddress:'',
            address:'',
            maddress:''
            
        }
    },
    created(){
        this.getaddress();
        if(sessionStorage.getItem('liftItem')){
            this.form = JSON.parse(sessionStorage.getItem('liftItem'));
            if(this.form.initTime){
                delete this.form.initTime;
            }
            this.citymsg =  this.form.provinceId?this.form.provinceId:'';
            this.changeaddress(this.citymsg);
            this.liftTime = [this.form.starttime,this.form.endtime];
        }
        this.getSshop();
        
    },
    methods:{
        setCircle(){
            var lat = this.shopInfo.lat;
            var lng = this.shopInfo.lng;
            this.map = new qq.maps.Map(document.getElementById("container"), {
                center: new qq.maps.LatLng(lat, lng), //将经纬度加到center属性上
                zoom: 15, //缩放
                draggable: true, //是否可拖拽
                scrollwheel: true, //是否可滚动缩放
                disableDoubleClickZoom: false
            });
        },
        getSshop(){
            // 获取店铺基本信息
            this.req.post('/store/detail',{id:localStorage.getItem('shopid')}).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.shopInfo = res.data.data;
                    this.setCircle();
                }
            });
        },
        getaddress() {
            const params = {
                pid: 1
            };
            this.req.post("/content/getregionlist", params).then(res => {
                console.log(res);
                // 判断
                let { data } = res.data;
                if (res.data.sub_code == "SUCCESS") {
                    this.addressList = data;
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        changeaddress(id) {
            let params = {
                pid: id
            };
            this.req.post("/content/getregionlist", params).then(res => {
                console.log(res.data.data);
                this.subcity = res.data.data;
                // 判断
                if (res.data.sub_code == "SUCCESS") {
                    this.citysub = "";
                    if(this.form.cityId){//适配编辑
                        this.citysub =  this.form.cityId?this.form.cityId:'';
                        this.changecity(this.citysub);
                    }else{
                        this.form.regionId = "";
                    }
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            }).catch(err => {
                    console.log(err);
            });
        },
        changecity(id) {
            let params = {
                pid: id
            };
            this.req.post("/content/getregionlist", params).then(res => {
                console.log(res.data.data);
                this.subscity = res.data.data;
                // 判断
                if (res.data.sub_code == "SUCCESS") {
                    if(!this.form.cityId){//适配编辑
                        this.form.regionId = "";
                    }
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        chageRegion(){
            var prevIndex = _.findIndex(this.addressList,(o)=>{return o.id==this.citymsg});
            var cityIndex = _.findIndex(this.subcity,(o)=>{return o.id==this.citysub});
            var regionIndex = _.findIndex(this.subscity,(o)=>{return o.id==this.form.regionId});
            // this.form.regionId = this.subscity[regionIndex].id;
            this.address = this.addressList[prevIndex].name+this.subcity[cityIndex].name+this.subscity[regionIndex].name;
            this.saddress = this.address;//+this.form.address;
            // document.querySelector(".address").value=this.saddress
            this.search();
        },
        search(){
            var that = this;
            var geo = new qq.maps.Geocoder();
            if(this.maddress){
                that.saddress = this.address+this.maddress;
            }
            geo.getLocation(that.saddress);
            geo.setComplete(function(res) {
                let lat = res.detail.location.lat; //经度
                let lng = res.detail.location.lng; //纬度
                that.form.location = lng+','+lat;
                that.lat = lat;
                that.lng = lng;
                that.map.setCenter(res.detail.location);
                if(!that.marker.getMap){
                    that.marker = new qq.maps.Marker({
                        position: res.detail.location, //标记的经纬度
                        animation: qq.maps.MarkerAnimation.BOUNCE, //标记的动画
                        map: that.map //标记的地图
                    });
                }
                that.marker.setPosition(res.detail.location);
                that.marker.setDraggable(true);
                that.marker.setMap(that.map);
                // 监听maker移动
                qq.maps.event.addListener(that.marker, 'position_changed', ()=>{
                    var pos = that.marker.getPosition();
                    console.log(pos);
                    that.lat = pos.lat;
                    that.lng = pos.lng;
                    that.form.location = lng+','+lat;
                });
            });
        },
        changeTime(time){
            this.form.starttime = time[0];
            this.form.endtime = time[1];
            this.liftTime = time;
        },
        save(){
            // var ff = !/(^1[3|4|5|6|7|8|9]{1}[0-9]{9})|(^0[0-9]{10})/.test(this.form.telphone);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.form.telphone.length != 11 || !/(^1[3|4|5|6|7|8|9]{1}[0-9]{9})|(^0[0-9]{10})/.test(this.form.telphone)){
                        this.$message.error('请输入正确的联系电话');
                        return ;
                    }
                    var params = Object.assign({},this.form);
                    this.req.post('/selflift/edit',params).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            sessionStorage.removeItem('liftItem');
                            bus.$emit('close_current_tags');
                            this.$router.push({path:'/appletsettings'});
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }
            });
        },
        back(){
            sessionStorage.removeItem('liftItem');
            bus.$emit('close_current_tags');
        },
    },
    components:{
        Notes
    }
}
</script>
<style scoped>
    .card>>>.el-card__body{padding-top:5px;}
    .card .note{border:2px dashed #ddd;padding:15px;background:#f0f0f0;}
    .card .form-map{margin-top:15px;}
    .card .form-map .form-map-left{display:flex;}
    .card .form-map .form-map-left .map{width:100%;height:400px;border:1px solid #dd875c;}
    .card .form-map .form-map-left .map-btn{padding:0px 15px;display:flex;flex-direction: column;justify-content:flex-end;align-content:flex-start;}
    .card .form-map .form-map-left .map-btn button{margin:15px 0px 0px;width:100%;}
    

</style>