<template>
  <div class="home">
    <div id="container"></div>搜索地址:
    <input type="text" class="address">
    经度为：
    <input type="text" readonly id="lat">
    纬度为：
    <input type="text" readonly id="lng">
    <button @click="search">搜索</button>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      geolocation:'',
      positionNum:'',
      options:'',
      address:'',
      map:null,
      lat:'', //经度
      lng:'' //纬度
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    search(){
      this.address=document.querySelector('.address').value;
      var geo = new qq.maps.Geocoder()
        geo.getLocation(this.address)//地址
        // console.log(geo)
        geo.setComplete(function(res){
            let lat=res.detail.location.lat; //经度
            let lng=res.detail.location.lng; //纬度
            document.querySelector('#lat').value=lat; 
            document.querySelector('#lng').value=lng; 
            window.map = new qq.maps.Map(document.getElementById('container'),{
                center: new qq.maps.LatLng(lat,lng),//将经纬度加到center属性上
                zoom: 15,//缩放   
                draggable: true,//是否可拖拽
                scrollwheel: true,//是否可滚动缩放
                disableDoubleClickZoom: false
            })
            var marker = new qq.maps.Marker({
                position: res.detail.location,//标记的经纬度
                animation: qq.maps.MarkerAnimation.BOUNCE,//标记的动画
                map: map//标记的地图
            })

            var citylocation = new qq.maps.CityService({
                //设置地图
                map : map,
                complete : function(results){
                    console.log(9999,results)
                }
            });
      })
    },
    init () {
      window.map = new qq.maps.Map(document.getElementById("container"),{
        center: new qq.maps.LatLng(29.57,106.55), //地图中心坐标 重庆
        zoom: 13 //地图缩放级别
      })
      
    }
   

  }
}
</script>

<style  scoped>

  * {
    margin: 0px;
    padding: 0px;
  }

  body, button, input, select, textarea {
    font: 12px / 16px Verdana, Helvetica, Arial, sans-serif;
  }

  p {
    width: 500px;
    padding-top: 3px;
    overflow: hidden;
  }

  #container {
    min-width: 500px;
    min-height: 500px;
    margin-bottom: 20px;
  }
</style>

