<template>
  <div>
      <el-card>
          <div slot="header">编辑商品详情</div>
          <div>
            <el-row :gutter="10">
                <el-col :span="10" class="edit">
                    <tinymce-editor ref="editor"  v-model="product.detail.description" toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | removeformat">
                    </tinymce-editor>
                </el-col>
                <el-col :span="8">
                    <div class="show">
                        <div class="detail" v-loading="loading" v-html="product.detail.description"></div>
                    </div>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <div style="margin-top:15px;">
                <el-button type="primary" @click="saveDetail">保存</el-button>
            </div>
          </div>
      </el-card>

  </div>
</template>

<script>
import TinymceEditor from "@/components/common/Tinymce";
export default {
    name:'AddProdDetail',
    data(){
        return {
            product:{
                detail:{
                    description:''
                }
            },
            loading:false
        }
    },
    created(){
        // if(localStorage.getItem('productId')){
        //     this.getProduct(localStorage.getItem('productId'));
        // }
        if(localStorage.getItem('productDetail')){
            var product = JSON.parse(localStorage.getItem('productDetail'));
            this.product.id  = product.id;
            if(product.detail && product.detail.description){
                this.product.detail.description = product.detail.description;
            }
        }
    },
    methods:{
        getProduct(id){
            // /product/detail
            this.loading= true;
            var param = {productId:id};
            this.req.post("/product/detail",param).then(res=>{
                this.loading= false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.product = res.data.data;
                }else{
                    this.$message.error(res.data.sub_code);
                }
            })
        },
        saveDetail(){
            if(this.product.detail.description.length==0){
                this.$message.error('请编辑商品详情');
                return ;
            }
            var param = {id:this.product.id,description:this.product.detail.description};
            this.loading = true;
            this.req.ppost("/product/save/detail",param).then(res=>{
                this.loading = false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        }
    },
    components:{
        TinymceEditor
    }
}
</script>
<style scoped>
.edit{height:667px;}
.edit >>> .tox-tinymce{height:667px !important;}
.show{width:375px;height:667px;padding:1px;background:#ddd;overflow-x:hidden;word-wrap: break-word;}
.show .detail{background:#fff;}
</style>