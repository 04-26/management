<template>
    <div>
        <el-card>
            <div slot="header">商品列表</div>
            <div class="prod">
                &nbsp;&nbsp;
                <el-button type="primary" @click="addProduct">发布商品</el-button>
                <el-button type="success" @click="mutilAdd" v-if='false'>批量发布商品</el-button>
                <el-button type="success" @click="$router.push({path:'/productcategroy'})">商品分类管理</el-button>
                <el-button type="success" @click="$router.push({path:'/productgroup'})">商品组管理</el-button>
                <el-row :gutter="10" style="margin-top:15px;">
                    <el-form ref="form" :model="searchForm" label-width="80px">
                        <el-col :span="6">
                            <el-form-item label="商品名称">
                                <el-input v-model="searchForm.productName" placeholder="请输入商品名称或者条码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18"><div style="height:55px;">&nbsp;</div></el-col>
                        <el-col :span="6">
                            <el-form-item label="商品分类">
                                <el-cascader :options="cateList" v-model="searchForm.menu" 
                                    :props="{value:'id',label:'name'}" 
                                    filterable clearable
                                    placeholder="请选择商品所属分类" :change-on-select='true'>
                        </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商品类型">
                                <el-select v-model="searchForm.type" placeholder="请选择类型" style="width:100%;">
                                    <el-option
                                        v-for="item in cate"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="价格">
                                <el-input v-model="searchForm.minprice" type="number" min="1" step="0.01"  class="input-money" placeholder="最低价"></el-input>-<el-input v-model="searchForm.maxprice" type="number" min="1" step="0.01" class="input-money" placeholder="最高价"></el-input>
                                &nbsp;<el-button type="primary" @click="search">查询</el-button>&nbsp;<el-button type="success" @click="flashPage">刷新</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4"><div style="height:55px;">&nbsp;</div></el-col>
                    </el-form>
                </el-row>
            </div>
            <el-tabs v-model="activeTab" type="card" @tab-click="changTab">
                <el-tab-pane label="销售中" name="first">
                    <ProductItem :list="productList" v-loading="loading" @sel-change="selChange" ref="prodlist" 
                        @save-sort='saveSort'
                        @on-sell="onSell"
                        @set-stock="setStock"
                        @edit-item="editItem"
                        @delete="delItem"
                        @edit-price="editPrice" @save-title="saveTitle"></ProductItem>
                </el-tab-pane>
                <el-tab-pane label="库存预警" name="second">
                    <ProductItem :list="productList" v-loading="loading" @sel-change="selChange" ref="prodlist" 
                        @save-sort='saveSort'
                        @on-sell="onSell"
                        @set-stock="setStock"
                        @edit-item="editItem"
                        @delete="delItem"
                        @edit-price="editPrice" @save-title="saveTitle"></ProductItem>
                </el-tab-pane>
                <el-tab-pane label="已售罄" name="third">
                    <ProductItem :list="productList" v-loading="loading" @sel-change="selChange" ref="prodlist" 
                        @save-sort='saveSort'
                        @on-sell="onSell"
                        @set-stock="setStock"
                        @edit-item="editItem"
                        @delete="delItem"
                        @edit-price="editPrice" @save-title="saveTitle"></ProductItem>
                </el-tab-pane>
                <el-tab-pane label="仓库中" name="fourth">
                    <ProductItem :list="productList" v-loading="loading" @sel-change="selChange" ref="prodlist" 
                        @save-sort='saveSort'
                        @on-sell="onSell"
                        @set-stock="setStock"
                        @edit-item="editItem"
                        @delete="delItem"
                        @edit-price="editPrice" @save-title="saveTitle"></ProductItem>
                </el-tab-pane>
            </el-tabs>
            <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
                :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
                <div style="display:inline-block" class="page-btn">
                    <el-button type="primary" class="page-btn-up" size="mini" @click="prodUp">{{mutilUp}}</el-button>
                    <el-button type="primary" class="page-btn-del" size="mini" @click="prodDel">批量删除</el-button>
                </div>
            </el-pagination>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="300">
            <div><Sku :pid='productId' ref="sku" v-if="dialogVisible" @get-sku="getSku" :isprice="isprice" :isstock="isstock"></Sku></div>
            <div slot="footer" style="text-align:center;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setProdItem">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import helper from '@/utils/helper.js';
import ProductItem from '@/components/page/mall/ProductItem.vue'
import Sku from '@/components/page/mall/Sku.vue'
export default {
    name:'Product',
    data(){
        return {
            searchForm:{productName:'',menu:[],type:0,minprice:0,maxprice:0},
            activeTab:'first',
            options:[
                {label:'全部分类',value:1}
            ],
            productList:[],
            loading:false,
            totalCount:0,
            pageSize:10,
            pageNo:1,
            mutilUp:'批量下架',
            selProd:[],
            dialogVisible:false,
            skuList:[],
            cateList:[],
            productId:-1,
            cate:[{label:'全部商品',value:0},{label:'实物商品',value:1},{label:'虚拟商品',value:2}],
            isprice:true,
            isstock:true
        }
    },
    created() {
        this.getCateList();
        this.getProductList();
    },
    methods: {
        getCateList(){
            var param = {};
            this.req.post("/product/type/list",param).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.cateList = res.data.data;
                    this.cateList = helper.sort(this.cateList,'sort');
                    this.cateList = helper.tree(this.cateList,0,'parentid');
                }
            })
        },
        addProduct(){
            localStorage.removeItem('productId');
            localStorage.removeItem('prodItem');
            this.$router.push({path:'/addproduct'})
        },
        mutilAdd(){
            this.$router.push({path:'/mutiladdproduct'})
        },
        changTab(tab, event){
            this.activeTab=tab.name;
            if(this.activeTab=='fourth'){
                this.mutilUp = '批量上架';
            }
            this.loading=true;
            this.productList = [];
            this.pageNo = 1;
            this.getProductList();
        },
        getProductList(){
            var param = {pageSize:this.pageSize,pageNo:this.pageNo};
            if(this.searchForm.productName){
                param.keywords = this.searchForm.productName;
            }
            if(this.searchForm.menu.length!=0){
                param.menu1 = this.searchForm.menu[0];
            }
            if(this.searchForm.menu.length==2){
                param.menu2 = this.searchForm.menu[1];
            }
            if(this.searchForm.type){
                param.type = this.searchForm.type;
            }
            if(this.activeTab==='first'){
                param.onsell = 1;
            }
            if(this.activeTab==='fourth'){
                param.onsell = 0;
            }
            if(this.activeTab==='second'){
                param.stockMax = 1;
            }
            if(this.activeTab==='third'){
                param.stockMax = 0;
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
        sizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.loading=true;
            this.getProductList();
        },
        pageNoChange(pageNo){
            this.pageNo = pageNo;
            this.loading=true;
            this.getProductList();
        },
        search(){
            this.pageNo = 1;
            this.loading=true;
            this.getProductList();
        },
        flashPage(){
            this.pageNo = 1;
            this.loading=true;
            this.searchForm={productName:'',menu:[],type:0,minprice:0,maxprice:0};
            this.getProductList();
        },
        selChange(selval){
            // selval => 选中的item数组
            this.selProd=selval;
        },
        prodUp(){
            // 批量上架 selProd
            this.selProd=[]
            this.$refs.prodlist.clear();
            this.pageNo = 1;
            this.loading=true;
            this.getProductList();
        },
        prodDel(){
            // 批量删除 selProd
            this.selProd=[]
            this.$refs.prodlist.clear();
            this.pageNo = 1;
            this.loading=true;
            this.getProductList();
        },
        editPrice(item){
            this.dialogVisible=true;
            this.productId=item.id;
            this.isprice = true;
            this.isstock = false;
            
        },
        saveTitle(item){
            var params = {id:item.id,title:item.name}
            this.req.post("/product/update/title",params).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    this.getProductList();
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        saveSort(item){
            var params = {id:item.id,sort:item.sort}
            this.req.post("/product/update/sort",params).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    this.getProductList();
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        onSell(item){
            var params = {id:item.id,onsell:!item.onsell}
            this.req.post("/product/update/onsell",params).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    this.getProductList();
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        getSku(sku){
            this.skuList = sku.skuList;
        },
        setStock(item){
            this.dialogVisible=true;
            this.productId=item.id;
            this.isprice = false;
            this.isstock = true;
        },
        setProdItem(){
            // /product/update/price
            var params = {sku:[]};
            params.skus = this.skuList;
            params.skus.forEach(item=>{
                delete item.initTime;
            })
            var url = "/product/update/price";
            if(this.isstock){
                url = "/product/update/stock";
            }
            this.req.ppost(url,params).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    this.getProductList();
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        editItem(item){
            // localStorage.setItem('prodItem',JSON.stringify(item));
            localStorage.setItem('productId',item.id);
            this.$router.push({path:'/addProduct',query:{id:item.id}});
        },
        delItem(item){
            localStorage.removeItem('prodItem');
            this.$confirm('此操作将永久删除该数据, 是否继续?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {id:item.id};
                this.req.ppost('/product/update/del',params).then(res=>{
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                        this.getProductList();
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
            }).catch(err=>{})

        }


    },
    components:{
        ProductItem,
        Sku
    }
}
</script>
<style scoped >
    .input-money{width:80px;}
    .input-money >>> .el-input__inner{-webkit-appearance: none !important;-moz-appearance: textfield !important;}
    .page-btn{padding-right:10px;}
    .page-btn >>> button.page-btn-up{background:#00D1B2;color:#fff;}
    .page-btn >>> button.page-btn-del{background:rgb(224, 46, 2);color:#fff;}
</style>