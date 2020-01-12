<template>
  <div class="cardlist">
      
        <div>
          <router-link  to="/membership">
              <span class="cardone">

              </span>
          </router-link>
        </div>
      
      
        <div>
          <router-link to="/groupbooking">
           <span class="cardone2">

              </span>
          </router-link>
        </div>
      
      
        <div>
          <router-link to="/bargainirg">
            <span class="cardone3">

              </span>
          </router-link>
        </div>
      
      
        <div>
          <router-link to="/discountcoupon">
            <span class="cardone4">

              </span>
          </router-link>
        </div>
      
      
        <div>
          <router-link to="/promoter">
            <span class="cardone5">

              </span>
          </router-link>
        </div>
      
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.el-card {
  margin-left: 20px;
}
.cardone{
  display: inline-block;
  color: #fff;
  padding: 20px;
  background: url("../../../assets/img/会员卡@2x.png") no-repeat;
  height: 130px;
  width: 305px;
}
.cardone2{
  display: inline-block;
  color: #fff;
  padding: 20px;
  background: url("../../../assets/img/拼团@2x.png") no-repeat;
  height: 130px;
  width: 305px;
}
.cardone3{
  display: inline-block;
  color: #fff;
  padding: 20px;
  background: url("../../../assets/img/砍价@2x.png") no-repeat;
  height: 130px;
  width: 305px;
}
.cardone4{
  display: inline-block;
  color: #fff;
  padding: 20px;
  background: url("../../../assets/img/优惠券@2x.png") no-repeat;
  height: 130px;
  width: 305px;
}
.cardone5{
  display: inline-block;
  color: #fff;
  padding: 20px;
  background: url("../../../assets/img/推广员@2x.png") no-repeat;
  height: 130px;
  width: 305px;
}
.cardlist{
  display: flex;
  
}
</style>