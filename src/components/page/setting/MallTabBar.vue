<template>
  <div class="tabbar">
      <div class="tabbar-item">
          <div>
            <i class="el-icon-delete"></i>
            <span>首页</span>
          </div>
      </div>
      <div class="tabbar-item">
          <div>
          <i class="el-icon-delete"></i>
          <span>商城</span>
          </div>
      </div>
      <div class="tabbar-item">
          <div>
          <i class="el-icon-delete"></i>
          <span>购物车</span>
          </div>
      </div>
      <div class="tabbar-item">
          <div>
          <i class="el-icon-delete"></i>
          <span>我的</span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'MallTabBar',
    data(){
        return {

        }
    },
    methods: {
        
    },
}
</script>
<style scoped>
.tabbar{display:flex;justify-content:center;align-content:center;box-sizing:border-box;}
.tabbar-item{flex:1;text-align:center;display:flex;flex-direction:row;justify-content:center;align-items:center;padding:3px;font-size:12px;cursor: pointer;}
.tabbar-item>div{flex:1;text-align:center;display:flex;flex-direction:column;justify-content:center;}
.tabbar-item i{font-size:16px;color:chocolate;padding:0 0 2px;}
.tabbar-item::after{content:'';border-right:1px solid #999;display:inline-block;height:50%;opacity:0.5;}
.tabbar-item:last-child::after{content:'';border-right:none;display:inline-block;}
</style>