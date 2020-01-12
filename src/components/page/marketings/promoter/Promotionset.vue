<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/推广员</span>
      </div>
      <div>
        <!-- 上半部分 -->
        <el-row>
          <el-col class="bookingtop-left" :span="8">
            <p>
              推广员使用介绍：为店铺打造人人皆可推广的系统。
              邀请客户、员工、合作方等成为推广员，推广成功后发佣金。
            </p>
            <p class="left-p2">
              <span>使用教程</span>
              <span>活动案例</span>
              <el-tooltip class="item" effect="dark"  placement="right">
                <div slot="content">
                  <div> 1、通过分享的链接注册成为推广员的下级</div>
                  <div>2、已成为店铺推广员的用户不能再成为推广员的下级</div>
                  <div>3、已成为店铺会员的用户不能再成为推广员的下级</div>
                  <div>4、关闭推广员功能，之前开启申请成为的推广员，能继续推广，<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提佣等操作，若不想让推广员再使用，建议把推广提佣的商品从推广商品列表删除。</div>
                  <div>5、推广商品，只能选择上架的商品。</div>
                </div>
                <span>活动规则</span>
              </el-tooltip>
            </p>
          </el-col>
        </el-row>
        <!-- 下半部分 -->
        <div>
          <div class="booking-bottom">
            <p class="bottom-item">
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoter">推广员</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoteaudit">推广员审核</router-link>
              </span>
              <span style="margin-right:15px" class="bordernone active">
                <router-link style="padding:5px 10px;text-decoration: none;" class="active-a" to="/promotionset">推广设置</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;"  to="/setgoods">设置商品</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoterrecruit">推广招募</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoterorder">推广订单列表</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/prodrawalmanagement">推广提现管理</router-link>
              </span>
            </p>
          </div>
          <el-form ref="form" :model="form" label-width="100px" v-loading="loading">
            <el-form-item label="推广员开启">
              <el-radio-group v-model="form.open">
                <div style="margin-top:10px;"><el-radio :label="true">开启 <span class="p-tishi" style="margin-left:10px;color:#ccc;">开启后，用户可以通过我的-推广员-申请成为推广员，完成推广员申请。</span></el-radio></div> 
                <div><el-radio :label="false">关闭 <span class="p-tishi" style="margin-left:10px;color:#ccc;">关闭后，用户无法申请成为推广员。</span></el-radio></div> 
              </el-radio-group>
            </el-form-item>
            <el-form-item label="推广员审核">
              <el-radio-group v-model="form.audit">
                <div style="margin-top:10px;"><el-radio :label="true">开启 <span class="p-tishi" style="margin-left:10px;color:#ccc;">开启，用户点击申请后，需要后台通过才能申请成功。</span></el-radio></div>
                <div><el-radio :label="false">关闭 <span class="p-tishi" style="margin-left:10px;color:#ccc;">关闭后，用户申请推广员，无需审核。</span></el-radio></div>
              </el-radio-group>
              
              
            </el-form-item>
            <el-form-item label="分佣范围">
              <el-radio-group v-model="form.vipcardpay">
                <el-radio :label="false">使用会员卡支付不计算推广佣金</el-radio>
                <el-radio :label="true">使用会员卡支付计算推广佣金</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分佣结算时间">
              <el-radio-group v-model="form.type">
                <div style="margin-top:10px;"><el-radio :label="1">交易完成结算 <span class="p-tishi" style="color:#ccc;">推广员的直接下级、及间接下级产生的订单，订单状态为以完成状态后。为分佣结算时间</span></el-radio></div>
                <div><el-radio :label="2">交易完成的 <el-input style="width:100px;" type="number" size="mini" v-model="form.days"></el-input><span >天后结算</span><span class="p-tishi" style="color:#ccc;">推广员的直接下级、及间接下级产生的订单，订单状态为以完成状态后。自定义N天为分佣结算时间</span></el-radio></div>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="提现金额最小值" label-width="120">
              <el-input v-model="form.withdrawMin" style="width:150px;"></el-input>
              <span class="p-tishi" style="color:#ccc;">&nbsp;推广员申请提现时，最低提现金额。不填写默认值为1元，个人微信转账每天限额2万，请悉知</span>
            </el-form-item>
            <el-form-item label="提现金额最大值" label-width="120">
              <el-input v-model="form.withdrawMax" style="width:150px;"></el-input>
              <span class="p-tishi" style="color:#ccc;">&nbsp;推广员申请提现时，最高提现金额。不填写默认值为：0，表示不限制，个人微信转账每天限额2万，请悉知</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="saveSet">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      form: {
        id:0,
        open: false,
        audit: false,
        type: 1,
        days: 0,
        vipcardpay: false,
        withdrawMax:0,
        withdrawMin:1
      }
    };
  },
  created() {
    this.getSetInfo();
  },
  methods: {
    getSetInfo(){
      // /promoter/setting
      this.loading=true;
      this.req.post("/promoter/setting",{}).then(res => {
        if (res.data.sub_code == "SUCCESS") {
          if(res.data.data){
            this.form = res.data.data;
          }
          this.loading=false;
        } else {
          this.$message.error(res.data.sub_msg);
        }
      });
    },
    saveSet(){
      var postData = Object.assign({},this.form);
      if(this.form.type==1){
        this.form.days=0;
        postData.days=0;
      }else if(this.form.days==0){
        this.$message.error('天数还没填写');
        return ;
      }
      delete this.form.initTime;

      // 处理默认值最大值和最小值
      if(!this.form.withdrawMin){
        this.form.withdrawMin=1;
        postData.withdrawMin=0;
      }
      if(!this.form.withdrawMax){
        this.form.withdrawMax=0;
        postData.withdrawMax=0;
      }
      if(this.form.id==0){
        delete postData.id; 
      }
      delete postData.initTime;
      this.loading=true;
      this.req.post("/promoter/setting/save",postData).then(res => {
        this.loading=false;
        if (res.data.code == "SUCCESS" && res.data.sub_code == "SUCCESS") {
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.sub_msg);
        }
      });

    }
  }
};
</script>

<style scoped>
.bookingtop-left > p {
  line-height: 30px;
  font-size: 14px;
}
.left-p2 {
  display: flex;
  justify-content: space-between;
}
.bookingtop-right {
  display: flex;
  justify-content: space-between;
}
.booking-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.bottom-item > span {
  display: inline-block;
  padding: 5px;
  border: 1px solid #c9c7c7;
}
.bordernone {
  border-right: none !important;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
.active{
    background: #07c4a8;
    
}
.active-a{
    color: #fff
}
.p-tishi {
  color: #606266;
  font-size: 14px;
}
</style>