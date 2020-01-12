<template>
  <div>
      <el-card class="card">
          <div slot="header">配送设置</div>
          <div>
              <div class="note">
                <Notes padding="0">
                    <div>1、首先要输入可配送的范围XXKM.</div>
                    <div>2、然后定位商铺位置.</div>
                    <div>3、商铺位置定位后再选定区域位置</div>
                    <div>4、选定区域后确认，即完成区域设置</div>
                </Notes>
              </div>
              <el-row :gutter="10" class="form-map">
                  <el-col :span="12">
                        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                            <el-form-item label="配送费用" prop="amount">
                                <el-input v-model="form.amount" placeholder="请输入配送费用" type="number" min="0">
                                    <template slot="append">
                                        <div>
                                            ￥&nbsp;
                                        </div>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="起送金额" prop="limitAmount">
                                <el-input v-model="form.limitAmount" placeholder="订单满多少钱免配送费，输入数字，例如：12.00" type="number" min="0">
                                    <template slot="append">
                                        <div>
                                            ￥&nbsp;
                                        </div>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="配送范围" prop="radius">
                                <el-input v-model="form.radius" placeholder="请输入配送距离" type="number" min="0">
                                    <template slot="append">
                                        <div>
                                            Km
                                        </div>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <div class="form-map-left">
                                    <div class="map" id="container">

                                    </div>
                                    <div class="map-btn">
                                        <el-button type="primary" @click="getShopLocation()">定位商铺位置</el-button>
                                        <el-button type="primary" @click="setShopArea">选定区域</el-button>
                                        <el-button type="primary" @click="checkPos">确认位置</el-button>
                                    </div>
                                </div>
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
export default {
    name:"SetArea",
    data(){
        return {
            form:{
               radius:'',
               limitAmount:'',
               amount:'',
               center:''
            },
            rules:{
               radius:{required:true,message:'请输入配送距离',trigger:'blur'}, 
               limitAmount:{required:true,message:'请输入包邮金额',trigger:'blur'},
               amount:{required:true,message:'请输入配送金额',trigger:'blur'} 
            },
            shopInfo:{lat:'',lng:''},
            map:{},
            circle:{},
            marker:{},
            lng:'',
            lat:''
        }
    },
    created(){
        if(sessionStorage.getItem('area')){
            this.form = JSON.parse(sessionStorage.getItem('area'));
            if(this.form.initTime){
                delete this.form.initTime;
            }
            if(this.form.center){
                setTimeout(()=>{
                    this.setCircle();
                    var center = this.form.center.split(',')
                    this.lng = center[0];
                    this.lat = center[1];
                    this.getShopLocation(this.lat,this.lng);
                    this.resetArea();
                },1000)
            }else{
               this.form.center = '';
            }
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
        getShopLocation(lat,lng){ //定位店铺
            if(lat || lng){
                var center = new qq.maps.LatLng(lat,lng);
            }else{
                var center = new qq.maps.LatLng(this.shopInfo.lat,this.shopInfo.lng);
            }
            //创建一个Marker
            if(!this.marker.getMap){
                this.marker = new qq.maps.Marker({
                    //设置Marker的位置坐标
                    position: center,
                    //设置显示Marker的地图
                    map: this.map
                });   
            }
            this.marker.setPosition(center);
            this.marker.setVisible(true);
            //设置Marker的动画属性为从落下
            this.marker.setAnimation(qq.maps.MarkerAnimation.DOWN);
            this.marker.setTitle(this.shopInfo.shopName);  
            this.marker.setDraggable(true);
            qq.maps.event.addListener(this.marker, 'dragend', ()=>{
                var pos = this.marker.getPosition();
                this.lat = pos.lat;
                this.lng = pos.lng;
                this.resetArea();
            });
            qq.maps.event.addListener(this.marker, 'position_changed', ()=>{
                var pos = this.marker.getPosition();
                console.log(pos);
                this.lat = pos.lat;
                this.lng = pos.lng;
                this.resetArea();
            });
        },
        setShopArea(){
            if(!this.form.radius){
                this.$message.error('请设置配送范围');
                return ;
            }
            var center = new qq.maps.LatLng(this.shopInfo.lat,this.shopInfo.lng);
            var color = new qq.maps.Color(0,0,255,0.3);
            if(!this.circle.getMap){
                this.circle=new qq.maps.Circle({
                    map:this.map,
                    center:center,
                    radius:parseFloat(this.form.radius)*1000,
                    fillColor:color,
                    strokeDashStyle:'dash',
                    strokeWeight:2
                });
            }
            this.circle.setVisible(true);
            this.circle.setRadius(parseFloat(this.form.radius)*1000);
            if(this.circle.getMap()){
               this.circle.setMap(null);
            }
            this.circle.setMap(this.map);
        },
        resetArea(){
            if(!this.form.radius){
                return ;
            }
            var center = new qq.maps.LatLng(this.lat,this.lng);
            var color = new qq.maps.Color(0,0,255,0.3);
            if(!this.circle.getMap){
                this.circle=new qq.maps.Circle({
                    map:this.map,
                    center:center,
                    radius:parseFloat(this.form.radius)*1000,
                    fillColor:color,
                    strokeDashStyle:'dash',
                    strokeWeight:2
                });
            }
            this.circle.setCenter(center);
            this.circle.setVisible(true);
            this.circle.setRadius(parseFloat(this.form.radius)*1000);
            if(this.circle.getMap()){
            this.circle.setMap(null);
            }
            this.circle.setMap(this.map);
        },
        checkPos(){
            if(!this.lat || !this.lng){
                this.form.center = this.shopInfo.lng+','+this.shopInfo.lat;
            }else{
                this.form.center = this.lng+','+this.lat;
            }
            this.setShopArea();
        },
        back(){
            sessionStorage.removeItem('area');
            bus.$emit('close_current_tags');
        },
        save(){
            // /delivery/edit
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.form.center.length==0){
                        this.$message.error('请确认位置');
                        return ;
                    }
                    var params = Object.assign({},this.form);
                    this.req.post('/delivery/edit',params).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            sessionStorage.removeItem('area');
                            bus.$emit('flush_temp');
                            bus.$emit('close_current_tags');
                            this.$router.push({path:'/appletsettings'});
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }
            });
        }
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
    .card .form-map .form-map-left .map{width:500px;height:400px;border:1px solid #dd875c;}
    .card .form-map .form-map-left .map-btn{padding:0px 15px;display:flex;flex-direction: column;justify-content:flex-end;align-content:flex-start;}
    .card .form-map .form-map-left .map-btn button{margin:15px 0px 0px;width:100%;}
    

</style>