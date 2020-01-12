<template>
  <div>
      <el-card>
          <div slot="header">{{form.id?'编辑':'新增'}}商品组</div>
          <el-row :gutter="10">
              <el-col :span="8">
                  <h3 style="text-align:center;">小程序页面展示效果</h3>
                  <div class="mcphone">
                      <PersonRecommand :list="rmList" @sel-type="selType" :type="form.type"></PersonRecommand> &nbsp;
                      <Fresh :list="freshList" @sel-type="selType" :type="form.type"></Fresh>&nbsp;
                      <Special :list="speList" @sel-type="selType" :type="form.type" :item="form"></Special>
                  </div>
              </el-col>
              <el-col :span="10">
                  <h3 style="text-align:center;">小程序页面展示数据</h3>
                  <el-form ref="form" :model="form" label-width="150px" class="right-form" :rules="rules">
                      <el-form-item label="商品组名称" prop="name">
                          <el-input v-model="form.name" placeholder="请输入商品组名称" @blur="isSys"></el-input>
                      </el-form-item>
                      <el-form-item label="是否启用">
                          <el-radio v-model="form.status" :label="1">是</el-radio>
                          <el-radio v-model="form.status" :label="0">否</el-radio>
                      </el-form-item>
                      <el-form-item label="首页展示排序">
                          <el-input v-model="form.sort" placeholder="请输入排序" type="number" min="1" step="1"></el-input>
                      </el-form-item>
                      <el-form-item label="商品组副标题" v-if='form.type==3' prop="title">
                          <el-input v-model="form.title" placeholder="请输入商品组副标题"></el-input>
                      </el-form-item>
                      <el-form-item label="价格" v-if='form.type==3' prop="price">
                          <el-input v-model="form.price" placeholder="请输入价格" type="number" min="0" step="0.01"></el-input>
                      </el-form-item>
                      <el-form-item label="添加图片" v-if='form.type==3' prop="imageUrl">
                          <el-upload :action="$upfileUrl()" :show-file-list="false" :on-success="upSuccess" class="upimg" :limit="1"> 
                              <img v-if="form.imageUrl" :src="$imgurl()+form.imageUrl" style="width:100%;height:100%;">
                              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                          <Notes content="设置图片大小建议为：640px*640px" :inline="true" padding="0 10px 0"></Notes>
                      </el-form-item>
                      <el-form-item label="组内商品">
                            <el-button type="primary" @click="addProd" v-if="form.items.length<10">添加商品</el-button>
                            <el-button type="info" v-if="form.items.length==10">添加商品</el-button>
                            <el-table :data="form.items" style="width: 100%" v-if="false">
                                <el-table-column prop="name" label="商品名称/商品分类" width="120px">
                                        <template slot-scope="scope">
                                            <div>
                                                <img :src="$imgurl()+scope.row.imageUrl" alt="" style="width:45px;height:45px;">
                                                {{scope.row.name}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sort" label="排序">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-input v-model="scope.row.sort" placeholder="请输入排序"></el-input>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="价格">
                                        <template slot-scope="scope">
                                            <div style="color:#ee5002;">
                                                ￥{{scope.row.price}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="stock" label="库存"></el-table-column>
                                    <el-table-column label="操作" align="center">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-button type="warning" @click="removeItem(scope.row)" size="mini">移除</el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-table :data="form.items" style="width: 100%" v-if="form.items.length>0">
                                    <el-table-column prop="name" label="商品名称/商品分类" width="120px">
                                            <template slot-scope="scope">
                                                <div>
                                                    <img :src="$imgurl()+scope.row.product.imageUrl" alt="" style="width:45px;height:45px;">
                                                    {{scope.row.product.name?scope.row.product.name.substr(0,20):''}}{{scope.row.product.name?'...':''}}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="sort" label="排序">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-input v-model="scope.row.product.sort" placeholder="请输入排序"></el-input>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="价格">
                                            <template slot-scope="scope">
                                                <div style="color:#ee5002;">
                                                    ￥{{scope.row.product.price}}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="stock" label="库存">
                                            <template slot-scope="scope">
                                                <div>
                                                    {{scope.row.product.stock}}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" align="center">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-button type="warning" @click="removeItem(scope.row)" size="mini">移除</el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                            <Notes content="设置商品过多，用户打开速度会变慢，建议控制在10个商品以内" :inline="true" padding="0 10px 0"></Notes>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="saveProdGroup">保存商品组</el-button>
                          <el-button type="success" @click="reList">返回列表</el-button>
                      </el-form-item>
                  </el-form>
              </el-col>
              <el-col :span="6">

              </el-col>
          </el-row>
      </el-card>
      <el-dialog title="添加产品" :visible.sync="dialogVisible" width="800px">
          <div>
                <div class="search-head">
                    <el-cascader :options="cateList" v-model="searchForm.menu" :props="{value:'id',label:'name'}" placeholder="请选择商品所属分类" :change-on-select='true' >
                    </el-cascader>
                    <el-input v-model="searchForm.name" placeholder="请输入商品名称">
                        <template slot="append">
                            <div>
                                <el-button type="info" icon="el-icon-search" @click="search">搜索</el-button>
                            </div>
                        </template>
                    </el-input>
                </div>
                <el-table :data="productList" style="width: 100%">
                    <el-table-column prop="name" label="商品名称/商品分类">
                        <template slot-scope="scope">
                            <div>
                                <img :src="$imgurl()+scope.row.imageUrl" alt="" style="width:45px;height:45px;">
                                {{scope.row.name}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="价格" width="100px">
                        <template slot-scope="scope">
                            <div style="color:#ee5002;">
                                ￥{{scope.row.price}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="库存" width="100px"></el-table-column>
                    <el-table-column label="操作" align="right" width="100px">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="primary" @click="addItem(scope.row)" size="mini">选择</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
                    :current-page="pageNo" :page-sizes="[5, 10, 30]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import PersonRecommand from '@/components/page/mall/PersonRecommand.vue'
import Fresh from '@/components/page/mall/Fresh.vue'
import Special from '@/components/page/mall/Special.vue'
import Notes from '@/components/page/mall/Notes.vue'
import bus from '@/components/common/bus'
import helper from '@/utils/helper.js';
import loadash from 'lodash';
export default {
    name:'AddProdGroup',
    data(){
        return {
            form:{
                imageUrl:'',
                items:[],
                name:'',
                price:'',
                shopId:localStorage.getItem('shopid'),
                sort: 0,
                status: 1,
                title:'',
                type: -1,
            },
            rules:{
                name:{required:true,message:'请输入商品组名称',trigger:'blur'},
                items:{required:true,message:'请给商品组添加商品',trigger:'blur'},
                price:{required:true,message:'请输入该商品组价格',trigger:'blur'},
                title:{required:true,message:'请添加商品组副标题',trigger:'blur'},
                imageUrl:{required:true,message:'请上传该商品组图片',trigger:'blur'},
            },
            cateList:[],
            productList:[],
            rmList:[],
            freshList:[],
            speList:[],
            loading:false,
            dialogVisible:false,
            totalCount:0,
            pageSize:5,
            pageNo:1,
            searchForm:{
                menu:[],
                name:''
            }
        }
    },
    created() {
        this.getProductList();
        if(localStorage.getItem('groupItem')){
            this.$set(this,'form',JSON.parse(localStorage.getItem('groupItem')));
            this.getItems();
            if(!this.form.items){
                this.form.items = [];
            }
            if(this.form.type==1){
                this.form.items.forEach(item=>{
                    if(item.product){
                        this.rmList.push(item.product);
                    }
                })
            }
            if(this.form.type==2){
                this.form.items.forEach(item=>{
                    if(item.product){
                        this.freshList.push(item.product);
                    }
                })
            }
            if(this.form.type==3){
                this.form.items.forEach(item=>{
                    if(item.product){
                        this.speList.push(item.product);
                    }
                })
            }
            
        }

    },
    methods: {
        isSys(){
            var nameArr = ['人气推荐','新鲜好物'];
            if(nameArr.indexOf(this.form.name)!=-1){
                this.$message.error('名称不能包含:人气推荐,新鲜好物');
                this.form.name = '';
            }
        },
        getCateList(){
            var param = {};
            this.loading = true;
            this.req.post("/product/type/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.cateList = res.data.data;
                    this.cateList = helper.sort(this.cateList,'sort');
                    this.cateList = helper.tree(this.cateList,0,'parentid');
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        getItems(){
            var param = {groupId:this.form.id};
            this.loading = true;
            this.req.post("/product/combo/edit",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    if(res.data.data){
                        this.$set(this.form,'items',res.data.data);
                        this.form.items.forEach(item=>{
                            if(!item.product){
                                item.product = {imageUrl:'',sort:0,stock:0}
                            }
                        })
                    }
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        upSuccess(response,file,row){
            this.$set(this.form,'imageUrl',response.data);
        },
        reList(){
            bus.$emit('close_current_tags');
            this.$router.push({path:"/productgroup"})
        },
        getProductList(){
            this.loading=true;
            var param = {pageSize:this.pageSize,pageNo:this.pageNo};
            this.req.post("/product/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.productList = res.data.data.list;
                    this.rmList = this.productList;
                    this.freshList = this.productList;
                    this.speList = this.productList;
                    if(this.form.type==1){
                        this.form.items.forEach(item=>{
                            if(item.product){
                                this.rmList.push(item.product);
                            }
                        })
                    }
                    if(this.form.type==2){
                        this.form.items.forEach(item=>{
                            if(item.product){
                                this.freshList.push(item.product);
                            }
                        })
                    }
                    if(this.form.type==3){
                        this.form.items.forEach(item=>{
                            if(item.product){
                                this.speList.push(item.product);
                            }
                        })
                    }
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        getProductLists(){
            this.loading=true;
            var param = {pageSize:this.pageSize,pageNo:this.pageNo};
            if(this.searchForm.menu.length!=0){
                param.menu1 = this.searchForm.menu[0];
            }
            if(this.searchForm.menu.length==2){
                param.menu2 = this.searchForm.menu[1];
            }
            if(this.searchForm.name.length>0){
                param.keywords = this.searchForm.name;
            }
            this.req.post("/product/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.productList = res.data.data.list;
                    this.totalCount = res.data.data.totalPage*this.pageSize;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        selType(type){
            
            if(type==1){
                this.rmList = [];
                this.form.items.forEach(item=>{
                    this.rmList.push(item.product);
                })
            }else{
                this.rmList = this.productList;
            }
            if(type==2){
                this.freshList = [];
                this.form.items.forEach(item=>{
                    this.freshList.push(item.product);
                })
            }else{
                this.freshList = this.productList;
            }
            if(type==3){
                this.speList = [];
                this.form.items.forEach(item=>{
                    this.speList.push(item.product);
                })
            }else{
                this.speList = this.productList;
            }
            this.$set(this.form,'type',type);
        },
        addProd(){
            this.dialogVisible=true;
            this.getCateList();
            this.getProductLists();
        },
        sizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.loading=true;
            this.getProductLists();
        },
        pageNoChange(pageNo){
            this.pageNo = pageNo;
            this.loading=true;
            this.getProductLists();
        },
        search(){
            this.pageNo = 1;
            this.loading=true;
            this.getProductLists();
        },
        addItem(item){
            var itemStr = JSON.stringify(item);
            var prod = JSON.parse(itemStr);
            if(this.form.items.length>=10){
                this.$message.error('商品最多添加10个');
                return ;
            }
            var index = loadash.findIndex(this.form.items,(o)=>{return o.itemid==item.id});
            if(index==-1){
                if(!prod.itemid){
                    prod.itemid = item.id;
                    delete prod.id;
                }
                delete prod.initTime;
                var prodItem = {itemid:item.id,product:prod,shopId: localStorage.getItem('shopid'),sort: prod.sort,status: 1}
                this.form.items.push(prodItem);
            }
        },
        removeItem(item){
            // /product/combo/update/item/del
            if(item.id){
                var param = {id:item.id};
                this.req.post('/product/combo/update/item/del',param).then(res=>{
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
            }
            var index = loadash.findIndex(this.form.items,(o)=>{
                return o.itemid==item.itemid;
            })
            this.form.items.splice(index,1);
        },
        saveProdGroup(){
            // /product/combo/save
            this.$refs.form.validate((valid)=>{
                if(valid){
                    if(this.form.type==-1){
                        this.$message.error('还没选择展示方式');
                        return ;
                    }
                    if(this.form.items.length==0){
                        this.$message.error('请给商品组添加商品');
                        return ;
                    }
                    var formStr = JSON.stringify(this.form);
                    var param = JSON.parse(formStr);
                    if(param.initTime){
                        delete param.initTime;
                    }
                    if(param.type!=3){
                        delete param.price;
                        delete param.title;
                        delete param.imageUrl;
                    }
                    param.items.forEach(item=>{
                        if(item.initTime){
                            delete item.initTime;
                        }
                        if(item.product){
                            delete item.product;
                        }
                    })
                    this.req.ppost('/product/combo/save',param).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            bus.$emit('get_List');
                            localStorage.removeItem('groupItem');
                            bus.$emit('close_current_tags');
                            this.$router.push({path:"/productgroup"})
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    });
                }
            });
        }

    },
    components:{
        PersonRecommand,
        Fresh,
        Special,
        Notes
    }
}
</script>

<style scoped>
    .mcphone{width:375px;height:667px;overflow-y: auto; padding:15px;background:#ddd;border:1px solid #ddd;margin: 0 auto;}
    .mcphone::-webkit-scrollbar{width:0 !important;}
    .upimg{display:flex;}
    .upimg >>> .el-upload{display:flex !important;justify-content:center;align-items:center;width:100%;height:497px;} 
    .upimg >>> .el-upload .avatar-uploader-icon{font-size:18px;}
    .search-head{display:flex;justify-content: space-around;}
    .search-head:nth-child(2){flex:1;}
</style>