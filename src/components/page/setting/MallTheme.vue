<template>
  <div>
    <div class="theme-color">
      <div>选择配色方案：</div>
      <div class="color-item">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
      </div>
      <div class="color-item">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
      </div>
      <div class="color-item">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
      </div>
      <div class="color-item">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
      </div>
    </div>
    <div class="theme-temp" style="margin-top:15px;">
      <div>当前风格示例：</div>
      <div class="temp-item">
        <div class="temp"></div>
        <div>
          <el-button type="primary" size="large">使用中</el-button>
        </div>
      </div>
      <div class="temp-item">
        <div class="temp"></div>
        <div>
          <el-button type="primary" size="large">使用该模版</el-button>
        </div>
      </div>
      <div class="temp-item">
        <div class="temp"></div>
        <div>
          <el-button type="primary" size="large">使用该模版</el-button>
        </div>
      </div>
      <div class="temp-item">
        <div class="temp"></div>
        <div>
          <el-button type="primary" size="large">使用该模版</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name:'MallTheme',
    data(){
        return {

        }
    },
    methods: {
        
    },
}
</script>
<style scoped>
  .theme-color{display:flex;justify-content:center;align-items:center;}
  .theme-color .color-item{display:flex;flex:1;box-sizing:border-box;padding:0px 15px;}
  .theme-color .color-item div{flex:1;height:35px;box-sizing:border-box;background:green;padding:0 5px;background-clip: content-box;cursor:pointer;}
  .theme-temp{display:flex;justify-content:center;align-items:flex-start;}
  .theme-temp .temp-item{flex:1;display:flex;flex-direction: column; box-sizing:border-box;padding:0px 15px;}
  .theme-temp .temp-item .temp{flex:1;height:450px;box-sizing:border-box;background:green;padding:0 5px;background-clip: content-box;cursor:pointer;}
  .theme-temp .temp-item div:nth-child(2){text-align: center;padding:5px 15px;}
  .theme-temp .temp-item div:nth-child(2) >>> .el-button--primary{width:50%;}
</style>