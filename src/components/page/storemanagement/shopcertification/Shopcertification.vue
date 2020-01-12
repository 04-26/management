<template>
  <div>
    <el-card  shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺认证</span>
      </div>
      <div style="display:flex;justify-content: center;">
          <div style="padding:100px;">
              <p class="pcontent">企业认证店铺，提现时可提现至公司银行账户或者个人账户，审核周期为1个工昨日</p>
              <p class="pcontent">个人认证店铺，提现时可提现至个人银行账户，审核周期为3个工作日。</p>
              <p class="pcontent">请根据实际情况任选一种即可</p>
              <p style="display:flex;justify-content:center">
                  <el-button type="primary" @click="goPc">个人认证</el-button>
                  <el-button type="primary"  @click="goCc">企业认证</el-button>
              </p>
          </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
    methods:{
        //个人认证
        goPc(){
            console.log(1)
        },
        // 企业认证
        goCc(){
            console.log(2)
        }
    }
};
</script>
<style scoped>
.pcontent{
   line-height: 30px;
   font-size: 14;

}
</style>
