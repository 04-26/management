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
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promotionset">推广设置</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/setgoods">设置商品</router-link>
              </span>
              <span style="margin-right:15px" class="active">
                <router-link style="padding:5px 10px;text-decoration: none;" class="active-a" to="/promoterrecruit">推广招募</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promoterorder">推广订单列表</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/prodrawalmanagement">推广提现管理</router-link>
              </span>
            </p>
          </div>
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="招募标题">
              <el-input style="width:200px" v-model="info.title"></el-input>
            </el-form-item>
            <el-form-item prop="shopDesc">
              <tinymce-editor ref="editor" v-model="info.content" :toolbar="toolbar">
                <!-- :disabled="disabled" -->
              </tinymce-editor>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="setInfo">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import TinymceEditor from "../../../common/Tinymce";

export default {
     components: {
    TinymceEditor
  },
  data() {
    return {
      info:{title:'',content:''},
      toolbar:"undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | removeformat"
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo(){
      // /promoter/info
      this.req.post('/promoter/info').then(res=>{
          if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
            if(res.data.data){
              this.info = res.data.data
            }
          }else{
            this.$message.error(res.data.sub_msg);
          }
      })
    },
    setInfo(){
      // /promoter/info/save
      if(this.info.title.length==0){
        this.$message.error("标题还没填写");
        return ;
      }
      if(this.info.content.length==0){
        this.$message.error("还没填写招募内容");
        return ;
      }
      var postData = {
        title:this.info.title,
        content:this.info.content,
      }
      this.req.post('/promoter/info/save',postData).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.$message.success('操作成功');
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
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
.active {
  background: #07c4a8;
}
.active-a {
  color: #fff;
}
</style>