<template>
  <div>
      <el-card>
          <el-row :gutter="10">
              <el-col :span="8">
                  <h3 style="text-align:center;">小程序商城页面设计</h3>
                  <div class="mcphone-header">
                      <img :src="header" style="width:100%;">
                  </div>
                  <div class="mcphone">
                      <PersonRecommand :list="productList"></PersonRecommand> &nbsp;
                      <Fresh :list="productList"></Fresh>&nbsp;
                      <Special :list="productList"></Special>
                  </div>
                  <div class="mcphone-footer">
                      <MallTabBar></MallTabBar>                      
                  </div>
              </el-col>
              <el-col :span="10">
                  <h3 style="text-align:center;">小程序页面展示数据</h3>
                  <el-form ref="form" :model="form" label-width="150px" class="right-form">
                      <el-form-item label="商品组名称">
                          <el-input v-model="form.groupTitle" placeholder="请输入商品组名称"></el-input>
                      </el-form-item>
                      <el-form-item label="是否启用">
                          <el-radio v-model="form.status" :label="1">是</el-radio>
                          <el-radio v-model="form.status" :label="0">否</el-radio>
                      </el-form-item>
                      <el-form-item label="首页展示排序">
                          <el-input v-model="form.order" placeholder="请输入排序" type="number" min="1" step="1"></el-input>
                      </el-form-item>
                      <el-form-item label="商品组副标题">
                          <el-input v-model="form.groupTitle" placeholder="请输入商品组副标题"></el-input>
                      </el-form-item>
                      <el-form-item label="价格">
                          <el-input v-model="form.groupTitle" placeholder="请输入价格" type="number" min="0" step="0.01"></el-input>
                      </el-form-item>
                      <el-form-item label="添加图片">
                          <el-upload :action="$upfileUrl()" :show-file-list="false" :on-success="upSuccess" :before-upload="upSuccess" class="upimg"> 
                              <img v-if="form.imageUrl" :src="form.imageUrl">
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                      </el-form-item>
                      <el-form-item label="组内商品">
                          <el-button type="primary">添加商品</el-button>
                          <Notes content="设置商品过多，用户打开速度会变慢，建议控制在10个商品以内" :inline="true" padding="0 10px 0"></Notes>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary">保存商品组</el-button>
                          <el-button type="success" @click="reList">返回列表</el-button>
                      </el-form-item>
                  </el-form>
              </el-col>
              <el-col :span="6">

              </el-col>
          </el-row>
      </el-card>
  </div>
</template>

<script>
import PersonRecommand from '@/components/page/mall/PersonRecommand.vue'
import Fresh from '@/components/page/mall/Fresh.vue'
import Special from '@/components/page/mall/Special.vue'
import Notes from '@/components/page/mall/Notes.vue'
import MallTabBar from '@/components/page/setting/MallTabBar.vue'
import bus from '@/components/common/bus'
export default {
    name:'MallDegsin',
    data(){
        return {
            form:{
                groupTitle:'',
                status:0,
                order:'',
                imageUrl:''
            },
            productList:[],
            loading:false,
            totalCount:0,
            pageSize:10,
            pageNo:1,
            header:require('@/assets/img/xcx.png')
        }
    },
    created() {
        this.getProductList();
    },
    methods: {
        upSuccess(){

        },
        reList(){
            bus.$emit('close_current_tags');
            this.$router.push({path:"/productgroup"})
        },
        getProductList(){
            this.loading=true;
            var param = {pageSize:this.pageSize,pageNo:this.pageNo};
            this.req.post("/ss",param).then(res=>{
                console.log(res);
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.productList = res.data.data.resultList;
                    this.totalCount = res.data.data.totalCount;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
    },
    components:{
        PersonRecommand,
        Fresh,
        Special,
        Notes,
        MallTabBar
    }
}
</script>

<style scoped>
    .mcphone-header{width:375px;height:65px;margin: 0 auto;padding:0px;overflow: hidden;}
    .mcphone{width:375px;height:550px;overflow-y: auto; padding:0px;background:#ddd;border:1px solid #ddd;margin: 0 auto;box-sizing:border-box;}
    .mcphone-footer{width:375px;padding:0px;background:linear-gradient(to bottom,#fff,rgb(240, 239, 239),#eee);margin: 0 auto;}
    .mcphone::-webkit-scrollbar{width:0 !important;}
    .upimg{display:flex;}
    .upimg >>> .el-upload{display:flex !important;justify-content:center;align-items:center;width:100%;height:200px;} 
    .upimg >>> .el-upload .avatar-uploader-icon{font-size:18px;}
</style>