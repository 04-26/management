<template>
  <el-card :body-style="{ padding: '0px' }" class="card">
      <div slot="header">
          <span>新增商品</span>
      </div>
      <div class="card-body" v-loading="loading">
          <el-row :gutter="10">
              <el-col :span="23">
                <el-form ref="form" :model="form" label-width="200px" class="card-form" :rules="rules">
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品轮播图" prop="detail.images">
                        <transition-group tag="div" name="pic-move" class="pic" v-if="form.detail.images.length>0" >
                            <div v-for="(img,imindex) in form.detail.images" :key="img+imindex"  draggable="true" 
                                @drag="dragstart($event,imindex)" 
                                @mouseenter="mouseenter($event,imindex)"
                                :class="form.imageUrl==img?'actived':''"
                                class="pic-group" :style="{backgroundImage:'url('+$imgurl()+img+')'}">
                                <!-- <img  :src="$imgurl()+img"  class="thumb"> -->
                                <el-button type="primary" size="mini" @click="setThumb(img)">设置主图</el-button>
                                <el-button type="warning" size="mini" @click="ImagesRemove(imindex)">删除</el-button>
                            </div>
                        </transition-group>
                        <el-upload v-if="form.detail.images.length<8"
                            :multiple='false'
                            :action="$upfileUrl()"
                            list-type="text"
                            :on-preview="ImageCardPreview"
                            :on-remove="ImageRemove"
                            name="file"
                            :data="{type:'prod'}"
                            :on-success="suss"
                            :limit="8"
                            :show-file-list="false"
                            class="upload-btn"
                            >
                            <i  class="el-icon-plus"></i>
                        </el-upload>
                        <Notes content="拖动图片进行图片排序" padding="0"></Notes>
                    </el-form-item>
                    <el-form-item label="商品类目" v-if='false'>
                        <el-select v-model="form.title" placeholder="请选择商品类别" clearable>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="menu2">
                        <el-cascader
                            :options="cateList"
                            v-model="menu"
                            :props="{value:'id',label:'name'}"
                            placeholder="请选择商品所属分类"
                            :change-on-select='true'
                            >
                        </el-cascader>&nbsp;
                        <el-button type="primary" @click="addCate">新建分类</el-button>
                        <el-button type="warning" @click="getCateList">刷新</el-button>
                    </el-form-item>
                    <el-form-item label="商品卖点">
                        <el-input v-model="form.title" placeholder="40字以内，展示在商品详情页"></el-input>
                        <el-tooltip effect="dark" content="示例" placement="top">
                            <span>示例</span>
                        </el-tooltip>
                    </el-form-item>
                    <!-- <el-form-item label="库存扣减方式">
                        <el-checkbox v-model="form.title">拍下减库存</el-checkbox>
                    </el-form-item> -->
                    <el-form-item label=" 库存" prop="stock">
                        <el-input v-model="form.stock" type="number" min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <!-- <el-input v-model="form.unit" placeholder="输入数量">
                            <template slot="append">
                                <el-select v-model="form.unit" placeholder="请选择单位" style="width:150px;" clearable>
                                    <el-option
                                        v-for="(item,index) in units"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-input> -->
                        <el-autocomplete
                            class="inline-input"
                            v-model="form.unit"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入单位"
                            @select="selUnit"
                            ></el-autocomplete>
                    </el-form-item>
                    <!-- <el-form-item label="商品单位">
                        <el-input v-model="form.unit" placeholder="请输入商品单位"></el-input>
                    </el-form-item> -->
                    <el-form-item label="商品编码">
                        <el-input v-model="form.pcode" placeholder="选填"></el-input>
                    </el-form-item>
                    <el-form-item label="搜索关键字">
                        <el-input v-model="form.searchKeys" placeholder="选填"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="form.sort" placeholder="选填"></el-input>
                    </el-form-item>
                    <el-form-item label="已售数量">
                        <el-input v-model="form.sold" placeholder="请输入已售商品数量（选填）" type="number" min="0"></el-input>
                        <Notes content="只做小程序页面展示，不作数据统计依据" padding="0"></Notes>
                    </el-form-item>
                    <el-form-item label="添加字段">
                        <el-button type="primary" @click="addField">添加自定义字段</el-button>
                    </el-form-item>
                    <el-form-item :label="attr.title" v-for="(attr,index) in form.detail.customattrs" :key="index">
                        <el-input v-model="attr.value"></el-input>
                    </el-form-item>
                    <el-form-item label="是否支持自提" prop="shipmethod3">
                        <el-checkbox v-model="form.shipmethod3" >到店自提</el-checkbox>
                    </el-form-item>
                    <el-form-item label="限购:">
                        <el-input v-model="form.buylimit" placeholder="请输入限购数量" style="width:150px;"></el-input>单
                        <Notes content="限制每人购可买数量，填 0 则不限制。可用于新人首单优惠" padding="0"></Notes>
                    </el-form-item>
                    <el-form-item label="配送方式" prop="shipmethod">
                        <el-checkbox v-model="form.shipmethod1" @change="dshipmethod">快递发货</el-checkbox>
                        <el-checkbox v-model="form.shipmethod2" @change="tshipmethod">同城配送 &nbsp;<el-button type="primary" v-if="isCityCase" @click="setArea">去设置</el-button></el-checkbox>
                    </el-form-item>
                    <el-form-item label="快递运费" prop="expressmethod">
                        <el-radio-group v-model="expressmethod" @change="tempChange">
                            <el-radio :label="0">统一邮费:
                                <el-input v-if="expressmethod==0" v-model="form.expressfee" placeholder="" style="width:100px;" type="number" min="0" step="0.01">
                                    <template slot="prepend">￥</template>
                                </el-input>
                            </el-radio>
                            <el-radio :label="2">运费方案:
                                <el-select v-model="form.expressmethod" placeholder="按地区设置运费方案" v-if="expressmethod!=0" v-loading="tloading">
                                    <el-option
                                        v-for="item in templateList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>&nbsp;&nbsp;
                                <el-button type="primary" v-if="expressmethod!=0" @click="addTemplate">新增</el-button>
                                <el-button type="success" @click="getTemplate" v-if="expressmethod!=0">刷新</el-button>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="上架时间" prop="onsell">
                        <el-radio-group v-model="form.onsell">
                            <el-radio :label="true" style="margin: 9px auto 2px;">立即上架售卖</el-radio><br/>
                            <!-- <el-radio :label="2">指定时间上架 <el-date-picker v-model="form.title" type="datetime" placeholder="设置上架时间"></el-date-picker></el-radio><br/> -->
                            <el-radio :label="false">暂不出售，放入仓库</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="店主推荐">
                        <el-radio-group v-model="form.rommand" style="margin-top:5px;">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                        <el-table :data="form.relates" style="width: 100%" v-if="form.relates.length>0">
                            <el-table-column prop="name" label="商品名称/商品分类" width="200px">
                                <template slot-scope="scope">
                                    <div>
                                        <img :src="$imgurl()+scope.row.product.imageUrl" alt="" style="width:45px;height:45px;">
                                        {{scope.row.product.name}}
                                    </div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="sort" label="排序">
                                <template slot-scope="scope">
                                    <div>
                                        <el-input v-model="scope.row.product.sort" placeholder="请输入排序"></el-input>
                                    </div>
                                </template>
                            </el-table-column> -->
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
                        <Notes content="设置后，所有开启的店主推荐的商品详情底部均可以看见推荐商品" padding="0"></Notes>
                        <el-button type="primary" icon="plus" v-if="form.rommand" @click="addProd">选择商品</el-button>
                    </el-form-item>
                    <el-form-item label="商品规格" prop="sku">
                        <Sku @get-sku="getSku" ref='sku'></Sku>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="saveProd">保存</el-button>
                        <el-button type="success" @click="nextPage" v-if="form.id">下一步</el-button>
                    </el-form-item>
                </el-form>
              </el-col>
          </el-row>
          
      </div>
      <el-dialog title="添加自定义字段" :visible.sync="fieldVisble" width="400px">
          <div>
              <el-form ref="formext" :model="formext" label-width="80px" :rules="rulesext">
                  <el-form-item label="字段名称" prop="title">
                      <el-input v-model="formext.title"></el-input>
                  </el-form-item>
                  <el-form-item label="字段属性" prop="field">
                      <el-input v-model="formext.field"></el-input>
                  </el-form-item>
              </el-form>
          </div>
          <div slot="footer">
              <el-button @click="fieldVisble = false">取 消</el-button>
              <el-button type="primary" @click="fieldSave">确 定</el-button>
          </div>
      </el-dialog>
        <el-dialog title="添加产品" :visible.sync="addprodVisble" width="800px">
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
                <el-table :data="productList" style="width: 100%" v-loading="mloading">
                    <el-table-column prop="name" label="商品名称/商品分类">
                        <template slot-scope="scope">
                            <div>
                                <img :src="$imgurl()+scope.row.imageUrl" alt="" style="width:45px;height:45px;">
                                {{scope.row.name}}
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
  </el-card>
</template>

<script>
import Notes from "@/components/page/mall/Notes.vue";
import Sku from '@/components/page/mall/Sku.vue';
import helper from '@/utils/helper.js';
import bus from '@/components/common/bus';
import loadash from 'lodash';
export default {
    name:'AddProduct',
    data(){
        return {
            form:{
                name:'',
                imageUrl:'',
                title:'',
                menu1:'',
                menu2:'',
                detail:{
                    description:'',
                    images:[
                        // 'prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg',
                        // 'prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg',
                        // 'prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg',
                        // 'prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg',
                        // 'storeMassage/2019/9/4/c27a4060-b6bc-4a0c-b97d-4310bddbe164.png',
                    ],
                    skuattrs:'',
                    customattrs:[]
                },
                sort:0,
                stock:'',
                unit:'',
                rommand:false,
                skus:[],
                shipmethod1:true,
                shipmethod2:false,
                shipmethod3:false,
                shipmethod:1,
                expressmethod:0,
                expressfee:10.0,
                onsell:false,
                searchKeys:'',
                sold:0,
                price:'',
                marketPrice:'',
                relates:[],
                buylimit:0
            },
            rules:{
                name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
                menu2:[{required:true,message:'请选择商品所属分类',trigger:'blur'}],
                'detail.images':[{required:true,message:'请选上传商品轮播图',trigger:'blur'}],
                stock:[{required:true,message:'请输入商品库存',trigger:'blur'}],
                unit:[{required:true,message:'请输入商品单位',trigger:'blur'}],
            },
            formext:{
                title:'',
                field:''
            },
            rulesext:{
                title:[{required:true,message:'请输入自定义字段名称',trigger:'blur'}],
                field:[{required:true,message:'请输入自定义字段属性',trigger:'blur'}]
            },
            // units:['个','件','套','双','本','支','斤','杯','瓶','箱'],
            units:[{value:'个'},{value:'件'},{value:'套'},{value:'双'},{value:'本'},{value:'支'},{value:'斤'},{value:'杯'},{value:'瓶'},{value:'箱'}],
            expressmethod:0,
            cateList:[],
            loading:false,
            mloading:false,
            prodCate:[{label:'按摩推拿',value:1,id:1}],
            model:0,
            fieldVisble:false,
            templateList:[],
            currentDragItem:-1,
            menu:[],
            addprodVisble:false,
            searchForm:{
                menu:[],
                name:''
            },
            productList:[],
            totalCount:0,
            pageSize:5,
            pageNo:1,
            tloading:false,
            isCityCase:true,
        }
    },
    created(){
        this.getCateList();
        this.getTemplate();
        this.getlift();
        if(localStorage.getItem('productId')){
            // this.from = JSON.parse(localStorage.getItem('prodItem'));
            // var prodItem = JSON.parse(localStorage.getItem('prodItem'));
            localStorage.removeItem('prodItem');
            setTimeout(()=>{
                this.getProduct(this.$route.query.id);
            },100);
            // if(!prodItem.detail){
            //     prodItem.detail = this.form.detail;
            // }else{
            //    if(prodItem.detail.customattrs && prodItem.detail.customattrs.length>0 && !(prodItem.detail.customattrs instanceof Array)){
            //        prodItem.detail.customattrs = JSON.parse(prodItem.detail.customattrs);
            //    }
            // }
            // if(!(prodItem.menu2 instanceof Array)){
            //     prodItem.menu2 = [prodItem.menu1,prodItem.menu2];
            // }
            // if(prodItem.shipmethod1){
            //     prodItem.shipmethod = 1;
            // }
            // if(prodItem.shipmethod2){
            //     prodItem.shipmethod = 2;
            // }
            // if(prodItem.shipmethod3){
            //     prodItem.shipmethod = 3;
            // }
            // this.$set(this,'form',prodItem);
        }
        bus.$on('flush_temp',(val)=>{
            this.getlift();
        });
    },
    watch:{
        'form.shipmethod1':function(v,o){
            this.getTemplate();
            return v;
        },
        menu:function(v,o){
            if(v.length==2){
                this.$set(this.form,'menu1',v[0]);
                this.$set(this.form,'menu2',v[1]);
            }
            return v;
        }
    },
    methods: {
        dshipmethod(val){
            if(val){
                this.form.shipmethod2 = !val;
            }
        },
        tshipmethod(val){
            if(this.isCityCase){
                this.$message.error('还没设置同城配送，请去设置');
                this.form.shipmethod2 = false;
                return ;
            }
            if(val){
                this.form.shipmethod1 = !val;
            }
        },
        getProductLists(){
            this.mloading=true;
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
            param.onsell = 1 ;
            this.req.post("/product/list",param).then(res=>{
                this.mloading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.productList = res.data.data.list;
                    this.totalCount = res.data.data.totalPage*this.pageSize;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        addProd(){
            this.addprodVisble=true;
            this.getProductLists();
        },
        sizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.mloading=true;
            this.getProductLists();
        },
        pageNoChange(pageNo){
            this.pageNo = pageNo;
            this.mloading=true;
            this.getProductLists();
        },
        search(){
            this.pageNo = 1;
            this.mloading=true;
            this.getProductLists();
        },
        addItem(item){
            var itemStr = JSON.stringify(item);
            var prod = JSON.parse(itemStr);
            if(this.form.id && item.id==this.form.id){
                return ;
            }
            if(this.form.relates.length>=6){
                this.$message.error('商品最多添加6个');
                return ;
            }
            var index = loadash.findIndex(this.form.relates,(o)=>{return o.itemid==item.id});
            if(index==-1){
                if(!prod.itemid){
                    prod.itemid = item.id;
                    delete prod.id;
                }
                delete prod.initTime;
                var prodItem = {itemid:item.id,product:item}
                this.form.relates.push(prodItem);
            }
        },
        removeItem(item){
            // /product/combo/update/item/del
            if(item.id){
                var param = {id:item.id};
                this.req.post('product/update/relate/del',param).then(res=>{
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
            }
            var index = loadash.findIndex(this.form.relates,(o)=>{
                return o.itemid==item.itemid;
            })
            this.form.relates.splice(index,1);
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
        getProduct(id){
            // /product/detail
            var param = {id:id};
            this.req.post("/product/detail",param).then(res=>{
                this.loading= false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    var prodItem = res.data.data;
                    if(!prodItem.detail){
                        prodItem.detail = this.form.detail;
                    }else{
                        if(prodItem.detail.customattrs && prodItem.detail.customattrs.length>0 && !(prodItem.detail.customattrs instanceof Array)){
                            prodItem.detail.customattrs = JSON.parse(prodItem.detail.customattrs);
                        }else{
                            prodItem.detail.customattrs = []
                        }
                        if(prodItem.detail.images && prodItem.detail.images.length>0 && !(prodItem.detail.images instanceof Array)){
                            try{
                                prodItem.detail.images = JSON.parse(prodItem.detail.images);
                            }catch(e){
                                prodItem.detail.images = [prodItem.detail.images];
                            }
                        }else{
                            prodItem.detail.images = []
                        }
                    }
                    this.menu = [prodItem.menu1,prodItem.menu2];
                    // if(prodItem.shipmethod1){
                    //     prodItem.shipmethod = 1;
                    // }
                    // if(prodItem.shipmethod2){
                    //     prodItem.shipmethod = 2;
                    // }
                    // if(prodItem.shipmethod3){
                    //     prodItem.shipmethod = 3;
                    // }
                    this.$set(this,'form',prodItem);
                    if(this.form.expressmethod!=0){
                        this.expressmethod = 2
                    }else{
                        this.expressmethod = 0
                    }
                    if(this.form.relates.length>0){
                        this.form.rommand = true;
                    }else{
                        this.form.rommand = false;
                    }
                    // localStorage.setItem('prodItem',JSON.stringify(this.form));
                    this.$refs.sku.getEditProduct(id);
                }else{
                    this.$message.error(res.data.sub_code);
                }
            })
        },
        addCate(){
            this.$router.push({path:"/addprodcate"});
        },
        ImageCardPreview(file){
            // this.dialogImageUrl = file.url;
        },
        ImageRemove(file, fileList){
            console.log(file, fileList);
        },
        ImagesRemove(index){
            this.form.detail.images.shift(index,1);
        },
        setThumb(item){
            this.form.imageUrl = item;
        },
        suss(response, file, fileList) {
            // prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg
            this.form.detail.images.push(response.data) ;
        },
        querySearch(queryString, cb) {
            var results = queryString ? this.units.filter(item=>{return item.value.toLowerCase().indexOf(queryString.toLowerCase())===0}) : this.units;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        selUnit(item){

        },
        addField(){
            this.fieldVisble = true;
        },
        fieldSave(){
            this.$refs.formext.validate((valid)=>{
                if(valid){
                    var attrs = {value:''};
                    attrs = Object.assign(attrs,this.formext);
                    this.form.detail.customattrs.push(attrs)
                    this.formext.title = '';
                    this.formext.field = '';
                    this.fieldVisble = false;
                }
            })
        },
        getSku(sku){
            sku.skuAttr.forEach(item=>{
                if(!item.isImg){
                    item.value.forEach(vitem=>{
                        vitem.imgUrl='';
                    })
                }
            });
            this.form.detail.skuattrs = JSON.stringify(sku.skuAttr);
            
            this.form.stock = 0;
            var minIndex = -1;
            var minValue = 0
            sku.skuList.forEach((item,index)=>{
                if(minIndex!=-1 && parseFloat(item.price)<parseFloat(minValue)){
                    minValue=item.price;
                    minIndex = index;
                    this.$set(this.form,'price',item.price);
                    this.$set(this.form,'marketPrice',item.marketPrice);
                }else if(minIndex==-1){
                    minValue=parseFloat(item.price);
                    minIndex = index;
                    this.$set(this.form,'price',item.price);
                    this.$set(this.form,'marketPrice',item.marketPrice);
                }
                if(item.initTime){
                    delete item.initTime;
                }
                if(item.id){
                    delete item.id;
                }
                this.form.stock += item.stock;
            });
            this.form.skus = sku.skuList;
        },
        rommandAdd(){

        },
        tempChange(v){
            if(v==2){
                this.form.expressmethod='';
            }else{
               this.form.expressmethod=0; 
            }
        },
        getTemplate(){
            var params = {flag:true}
            this.tloading=true;
            this.req.post("/express/list", params).then(res => { 
              this.tloading=false;
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.templateList = res.data.data.resultList;
              }
            })
            return ;
            // 下面代码已经废弃
           if(this.form.shipmethod==1){
            // /express/list
            var params = {flag:true}
            this.req.post("/express/list", params).then(res => { 
              this.loading=false;
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.templateList = res.data.data.resultList;
              }
            })
            return ;
          }
          if(this.form.shipmethod==2){
            // /delivery/list
            var params = {flag:true}
            this.req.post("/delivery/list", params).then(res => { 
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.templateList = res.data.data.resultList;
              }
            })
            return ;
          }
          if(this.form.shipmethod==3){
            // /selflift/list
           var params = {flag:true}
            this.req.post("/selflift/list", params).then(res => { 
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.templateList = res.data.data.resultList;
              }
            })
          } 
        },
        dragstart(e,index){
            this.currentDragItem = index;
        },
        mouseenter(e,index){
            if(e.type=='mouseenter' && this.currentDragItem!=-1){
                let imageStr = JSON.stringify(this.form.detail.images);
                let images = JSON.parse(imageStr);
                let imgDrag = images[this.currentDragItem];
                let img = images[index];
                images[this.currentDragItem] = img;
                images[index] = imgDrag;
                this.$set(this.form.detail,'images',images)
                this.currentDragItem=-1;
            }
        },
        saveProd(){
            this.$refs.form.validate((valid)=>{
                if(valid){
                    if(this.form.detail.images.length==0){
                        this.$message.error('请选上传商品轮播图');
                        return ;
                    }
                    if(!this.form.imageUrl){
                        this.$message.error('请设置主图');
                        return ;
                    }
                    if(this.menu.length<2){
                        this.$message.error('请选择产品所属分类，且必须包含子分类');
                        return ;
                    }
                    // if(this.form.shipmethod==1){
                    //     this.form.shipmethod1 = true;
                    // }else{
                    //     this.form.shipmethod1 = false;
                    // }
                    // if(this.form.shipmethod==2){
                    //     this.form.shipmethod2 = true;
                    // }else{
                    //     this.form.shipmethod2 = false;
                    // }
                    // if(this.form.shipmethod==3){
                    //     this.form.shipmethod3 = true;
                    // }else{
                    //     this.form.shipmethod3 = false;
                    // }
                    if(this.expressmethod==2 && !this.form.expressmethod){
                        this.$message.error('请选择运费方案');
                        return ;
                    }
                    if(this.form.expressmethod!=0){
                        this.form.expressfee = '';
                    }
                    // /product/save
                    var params = JSON.stringify(this.form);
                    params = JSON.parse(params);
                    params.detail.images = JSON.stringify(params.detail.images);
                    params.detail.customattrs = JSON.stringify(params.detail.customattrs);

                    if(params.detail.initTime){
                        delete params.detail.initTime;
                    }
                    
                    params.menu1=this.menu[0];
                    params.menu2=this.menu[1];

                    params.skus.forEach((item,index)=>{
                        if(item.initTime){
                            delete item.initTime;
                        }
                        if(item.id){
                            delete item.id;
                        }
                    })
                    params.relates.forEach(item=>{
                        if(item.initTime){
                            delete item.initTime;
                        }
                        if(item.product){
                            delete item.product;
                        }
                    })

                    if(params.initTime){
                        delete params.initTime;
                    }
                    this.loading = true;
                    this.req.ppost("/product/save",params).then(res=>{
                        this.loading = false;
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            // bus.$emit('close_current_tags');
                            if(res.data.data.id){
                                this.form.id = res.data.data.id;
                            }else{
                                bus.$emit('close_current_tags');
                                this.$router.push({path:"/mall"});
                            }
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })

                }
            })
        },
        nextPage(){
            // this.saveProd();
            localStorage.setItem('productDetail',JSON.stringify(this.form));
            this.$router.push({path:'/addproddetail'})
        },
        addTemplate(){
            // localStorage.setItem('activeName','fourth')
            
            this.$router.push({path:'/setting/mallexpressadd'})
        },
        getlift(){
            // /delivery/list
            var params = {pageNo:this.pageNo,pageSize:this.pageSize}
            this.req.post("/delivery/list", params).then(res => { 
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  if(res.data.data.resultList.length!=0){
                    this.isCityCase = false;
                  }
              }
            })
        },
        setArea(){
            this.$router.push({path:'/setting/setArea'});
        }
    },
    components:{
        Notes,
        Sku
    }
}
</script>

<style scoped>
    .card{display:flex;flex-direction:column;height:100%;overflow-y: auto;overflow-x:hidden;}
    .card >>> .el-card__body{flex:1;}
    .card-body{display:flex;flex-direction:column;overflow-y: auto;overflow-x: hidden;}
    .card-form{flex:1;margin:15px auto;}
    .card-form >>> .el-input-group__prepend{padding:0px 3px;}
    .thumb{width:100%;}
    .pic-move{transition: transform 1s;cursor:move;}
    .el-icon-zoom-in:before {
        content: "设置主图";
        font-size: 12px;
        border: 1px solid #eee;
        padding: 5px 10px;
        border-radius: 7px;
    }
    .el-icon-delete:before {
        content: "删除";
        font-size: 12px;
        border: 1px solid #eee;
        padding: 5px 10px;
        border-radius: 7px;
    }
    .pic{
        /* display:grid;
        grid-gap: 5px;
        grid-template-columns:  repeat(auto-fit, minmax(100px, 1fr));;
        grid-template-rows: repeat(1, 100px); */
        width:100%;display:flex;flex-wrap:wrap;justify-content:flex-start;
    }
    .pic .pic-group{width:calc(25% - 15px);height:120px;margin-right:15px;margin-top:15px;}
    .pic img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .upload-btn >>> .el-upload--text{width:35px;height:35px;margin-top:15px;}
    .pic-group{opacity:0.5;background-size:cover;background-repeat:no-repeat;display:flex;flex-direction: column;justify-content:center;align-items:center;}
    .pic-group:hover{opacity:1;cursor:move;}
    .pic-group:hover button{opacity:1;}
    .pic-group button{margin-top:5px;padding:5px 5px;font-size:12px;opacity:0;transition:opacity 0.3s;}
    .pic-group button:nth-child(2){margin-top:5px;margin-left:0px;}
    .pic .actived{opacity:1;}
    .search-head{display:flex;justify-content: space-around;}
    .search-head:nth-child(2){flex:1;}
</style>