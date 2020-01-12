<template>
    <div>
        <div class="sku" v-show="pid==-1">
            <el-form ref="form"  label-width="100px">
                <div v-for="(itemform,itemIndex) in skuAttrsList" :key="itemIndex">
                    <el-form-item label="商品规格名:">
                        <div class="sku-name">
                            <el-autocomplete class="inline-input" v-model="itemform.name" :fetch-suggestions="querySearch" placeholder="请输入商品规格名" @select="selValue">
                                <template slot="append" v-if='itemIndex>0'>
                                    <div>
                                        <i class="el-icon-close" @click="minusName(itemIndex)" ></i>
                                    </div>
                                </template>
                            </el-autocomplete>
                            <el-checkbox v-model="itemform.isImg" class="sku-name-isimg">添加图片</el-checkbox>
                        </div>
                    </el-form-item>
                    <el-form-item label="商品规格值:">
                        <div class="sku-val-list">
                            <div class="sku-val" v-for="(item,index) in itemform.value" :key="index">
                                <el-input v-model="item.value" placeholder="请输入商品规格名">
                                    <template slot="append" v-if='index>0'>
                                        <div>
                                            <i class="el-icon-close" @click="minusValue(itemIndex,index)" ></i>
                                        </div>
                                    </template>
                                </el-input>
                                <el-upload v-if='itemform.isImg'
                                    :multiple='false'
                                    :action="$upfileUrl()"
                                    list-type="picture-card"
                                    :on-preview="ImageCardPreview"
                                    :on-remove="ImageRemove"
                                    name="file"
                                    :data="{type:'prod'}"
                                    :on-success="suss"
                                    :limit="1"
                                    :show-file-list="false"
                                    class="sku-upload-btn"
                                    >
                                    <div  slot="trigger" @click="upbtn(item,itemIndex,index)">
                                        <img v-if="item.imgUrl" :src="$imgurl()+item.imgUrl" class="sku-img">
                                        <i v-if="!item.imgUrl"  class="el-icon-plus" ></i>
                                    </div>
                                </el-upload>
                            </div>
                            <span class="sku-add" @click="addValue(itemIndex)">添加规格值</span>
                        </div>
                        <div class="sku-note" style="margin-left:0px;">仅支持一组规格设置规格图片（最多30张图），买家选择不同规格会看到对应规格图片，建议尺寸：640 x 640像素</div>
                    </el-form-item>
                </div>
                <el-form-item label="">
                    <el-button v-if="skuAttrsList.length<3" type="primary" @click="addSku">新增规格</el-button>
                    <el-button v-else type="info" >新增规格</el-button>
                </el-form-item>
            </el-form>
            <div class="sku-note">如有颜色、尺码、口味、容量、等请添加规格名,最多只能添加3个规格。</div>
        </div>
        <div class="sku-list" v-if="skuList.length>0">
            <table class="table table-striped table-bordered" border="1" v-if="pid==-1">
                <tr class="sku-list-thead">
                    <td style="padding:3px;" v-for='(item,index) in skuAttrsList' :key="index">{{item.name}}</td>
                    <td>库存</td>
                    <td style="width:135px;">规格编码</td>
                    <td style="width:135px;">卖价</td>
                    <td style="width:135px;" v-if="false">批发价</td>
                    <td style="width:135px;">划线价</td>
                    <td style="width:135px;">已售数量</td>
                    <td style="width:135px;">销量</td>
                </tr>
                <tr v-for='(item,index) in skuList' :key="index">
                    <template v-for='(aitem,aindex) in skuAttrsList'>
                        <td style="padding:3px;"  :key="aindex" v-if="showTd(aindex,index)" :rowspan="counts(item,aindex+1)">{{item['value'+(aindex+1)]}}</td>
                    </template>
                    <td>
                        <el-input-number v-model="item.stock" :min="1" @change="saveSkuList"></el-input-number>
                    </td>
                    <td>
                        <el-input v-model="item.pcode" placeholder="请输入规格编码" @blur="saveSkuList"></el-input>
                    </td>
                    <td><el-input v-model="item.price" placeholder="请输入交易价" type="number" step="0.01" min="0" @blur="saveSkuList"></el-input></td>
                    <td v-if="false"><el-input v-model="item.wholesalePrice" placeholder="请输入批发价" type="number" step="0.01" min="0" @blur="saveSkuList"></el-input></td>
                    <td><el-input v-model="item.marketPrice" placeholder="请输入划线价" type="number" step="0.01" min="0" @blur="saveSkuList"></el-input></td>
                    <td><el-input v-model="item.sold" placeholder="请输入已售量" type="number" @blur="saveSkuList"></el-input></td>
                    <td>{{item.resold}}</td>
                </tr>
            </table>
            <table class="table table-striped table-bordered" border="1" v-if="pid>0" v-loading="loading">
                <tr class="sku-list-thead">
                    <td style="padding:3px;" v-for='(item,index) in skuAttrsList' :key="index">{{item.name}}</td>
                    <td v-if="isstock">库存</td>
                    <td v-if="isprice" style="width:135px;">卖价</td>
                    <td v-if="isprice  && false" style="width:135px;">批发价</td>
                    <td v-if="isprice" style="width:135px;">划线价</td>
                </tr>
                <tr v-for='(item,index) in skuList' :key="index">
                    <template v-for='(aitem,aindex) in skuAttrsList'>
                        <td style="padding:3px;"  :key="aindex" v-if="showTd(aindex,index)" :rowspan="counts(item,aindex+1)">{{item['value'+(aindex+1)]}}</td>
                    </template>
                    <td v-if="isstock">
                        <el-input-number v-model="item.stock" :min="1" @change="saveSkuList"></el-input-number>
                    </td>
                    <td v-if="isprice"><el-input v-model="item.price" placeholder="请输入交易价" type="number" step="0.01" min="0" @blur="saveSkuList"></el-input></td>
                    <td v-if="isprice && false"><el-input v-model="item.wholesalePrice" placeholder="请输入批发价" type="number" step="0.01" min="0" @blur="saveSkuList"></el-input></td>
                    <td v-if="isprice"><el-input v-model="item.marketPrice" placeholder="请输入划线价" type="number" step="0.01" min="0" @blur="saveSkuList"></el-input></td>
                </tr>
            </table>
            <div>批量设置：
                <span class="sku-sets">
                    库存
                    <el-popover  trigger="click">
                        <el-input v-model="stock" placeholder="请输入库存">
                            <template slot="append">
                                <el-button type="primary" @click.native="saveSet('stock')">保存</el-button>
                            </template>
                        </el-input>
                        <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;"></i></template>
                    </el-popover>
                </span>
                <span class="sku-sets">
                    卖价
                    <el-popover  trigger="click">
                        <el-input v-model="price" placeholder="请输入卖价">
                            <template slot="append">
                                <el-button type="primary" @click.native="saveSet('price')">保存</el-button>
                            </template>
                        </el-input>
                        <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;"></i></template>
                    </el-popover>
                </span>
                <span class="sku-sets" v-if="false">
                    批发价
                    <el-popover  trigger="click">
                        <el-input v-model="wholesalePrice" placeholder="请输入批发价">
                            <template slot="append">
                                <el-button type="primary" @click.native="saveSet('wholesalePrice')">保存</el-button>
                            </template>
                        </el-input>
                        <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;"></i></template>
                    </el-popover>
                </span>
                <span class="sku-sets">
                    划线价
                    <el-popover  trigger="click">
                        <el-input v-model="marketPrice" placeholder="请输入划线价">
                            <template slot="append">
                                <el-button type="primary" @click.native="saveSet('marketPrice')">保存</el-button>
                            </template>
                        </el-input>
                        <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;"></i></template>
                    </el-popover>
                </span>
                <span class="sku-sets">
                    已卖
                    <el-popover  trigger="click">
                        <el-input v-model="sold" placeholder="请输入已卖数量">
                            <template slot="append">
                                <el-button type="primary" @click.native="saveSet('sold')">保存</el-button>
                            </template>
                        </el-input>
                        <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;"></i></template>
                    </el-popover>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * sku
 */
export default {
    name:'Sku',
    props:{
       pid:{type:Number,default:-1},
       isprice:{type:Boolean,default:true},
       isstock:{type:Boolean,default:true},
    },
    data(){
        return {
            form:{
                name:'',
                value:[{value:'',imgUrl:'',}],
                vlen:1,
                isImg:false
            },
            valueList:[],
            skuAttrsList:[
                {name:'',value:[{value:'',imgUrl:''}],vlen:1,isImg:false}
            ],
            skuList:[],
            skuListBk:[],
            upItem:{},
            currentItemIndex:'',
            currentIndex:'',
            values:[
                {value:'口味'},
                {value:'包装'},
                {value:'颜色'},
                {value:'尺寸'},
                {value:'尺码'},
                {value:'款式'},
                {value:'种类'},
                {value:'净含量'},
                {value:'版本'},
                {value:'套餐'},
            ],
            stock:'',
            sold:'',
            price:'',
            marketPrice:'',
            wholesalePrice:'',
            productItem:{},
            loading:false,
        }
    },
    watch:{
        skuAttrsList:{
            deep:true,
            immediate:true,
            handler:function(v,o) {
                if(this.pid>0){
                    this.skuList.sort((item1,item2)=>{
                        if(escape(item1.value1+item1.value2+item1.value3)>escape(item2.value1+item2.value2+item2.value3)){
                            return 1;
                        }else if(escape(item1.value1+item1.value2+item1.value3)<escape(item2.value1+item2.value2+item2.value3)){
                            return -1;
                        }else{
                            return 0;
                        }
                    });
                    return v;
                }
                let skuAttr = {
                    shopId:localStorage.getItem('shopid'),
                    stock:'',
                    pcode:'',
                    sold:'',
                    price:'',
                    marketPrice:'',
                    wholesalePrice:'',
                    msrprice:''
                };
                v.forEach((item,index)=>{
                    item.vlen = item.value.length;
                    skuAttr['name'+(index+1)] = item.name;
                });
                this.skuList = [];
                v[0].value.forEach((item0)=>{
                    let skuItem = Object.assign({},skuAttr);
                    skuItem['value1'] = item0.value;
                    if(!item0.value){
                        this.$emit('get-sku',{skuAttr:[],skuList:[]});
                        return ;
                    }
                    this.skuList.push(skuItem);
                });
                if(v[1]){
                    let len = this.skuList.length;
                    v[1].value.forEach((item)=>{
                        if(len!=0){
                            for(let i=0;i<len;i++){
                                this.skuList[i]['value2'] = item.value;
                            }
                            len = 0;
                        }else{
                            v[0].value.forEach(skuitem=>{
                                let skuItem = Object.assign({},skuAttr);
                                skuItem['value1'] = skuitem.value;
                                skuItem['value2'] = item.value;
                                this.skuList.push(skuItem);
                            })
                        }
                    });
                }
                if(v[2]){
                    let len = this.skuList.length;
                    let lens = v[0].value.length*v[1].value.length;
                    let count = 0;
                    v[2].value.forEach((item)=>{
                        if(len!=0){
                            for(let i=0;i<len;i++){
                                this.skuList[i]['value3'] = item.value;
                            }
                            len = 0;
                        }else{
                            for(let i=0;i<lens;i++){
                                let skuItem = Object.assign({},this.skuList[i]);
                                skuItem['value3'] = item.value;
                                if(item.value){
                                    this.skuList.push(skuItem);
                                }
                            }
                        }
                    });
                }

                if(localStorage.getItem('prodItem')){
                    var prodItem = JSON.parse(localStorage.getItem('prodItem'));
                    if(prodItem.skus && prodItem.skus.length>0){
                        var nSkuhash = [];
                        this.skuList.forEach(item=>{
                            var hash = escape(item.value1);
                            if(v[1]){
                                hash = escape(item.value1+item.value2);
                            }
                            if(v[2]){
                                hash = escape(item.value1+item.value2+item.value3);
                            }
                            nSkuhash.push(hash);
                        })
                        prodItem.skus.forEach((item,index)=>{
                            var hash = escape(item.value1);
                            if(item['name2']){
                                hash = escape(item.value1+item.value2);
                            }
                            if(item['name3']){
                                hash = escape(item.value1+item.value2+item.value3);
                            }
                            var idx = nSkuhash.indexOf(hash);
                            if(idx!=-1){
                                this.$set(this.skuList,idx,item);
                            }
                        });
                        // this.skuList = this.skuList.concat(prodItem.skus);
                    }
                }

                this.skuList.sort((item1,item2)=>{
                    if(escape(item1.value1+item1.value2+item1.value3)>escape(item2.value1+item2.value2+item2.value3)){
                        return 1;
                    }else if(escape(item1.value1+item1.value2+item1.value3)<escape(item2.value1+item2.value2+item2.value3)){
                        return -1;
                    }else{
                        return 0;
                    }
                });
                if(this.skuList.length>0){

                    this.$emit('get-sku',{skuAttr:v,skuList:this.skuList});
                }
                return v;
            }
        }
    },
    created(){
        if(localStorage.getItem('prodItem')){
            var prodItem = JSON.parse(localStorage.getItem('prodItem'));
            this.getEditProduct(prodItem.id);
        }
    },
    mounted(){
        if(this.pid>0){
            setTimeout(()=>{
                this.getProduct();
            },100)
        }
    },
    methods: {
        showTd(aindex,index){
            let rowNum = this.counts(this.skuList[index],aindex+1);
            let colCount = this.skuAttrsList.length;
            let colIndex = this.skuAttrsList.indexOf()
            if(index%rowNum===0){
                return true;
            }else{
                return false;
            }
        },
        counts(item,clm){
            let rows = 1;
            if(clm==1){
                item = this.skuList.reduce((item,nextItem)=>{
                    if(item.value1==nextItem.value1){
                        rows++;
                    }
                    return item;
                })
            }
            if(clm==2){
                item = this.skuList.reduce((item,nextItem)=>{
                    if(item.value1==nextItem.value1 && item.value2==nextItem.value2){
                        rows++;
                    }
                    return item;
                })
            }
            return rows;
        },
        getProduct(){
            //  /product/detail
            var params = {id:this.pid};
            this.loading=true;
            this.req.post('/product/detail',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.productItem = res.data.data;
                    if(this.productItem.detail){
                        this.skuAttrsList = this.productItem.detail.skuattrs ? JSON.parse(this.productItem.detail.skuattrs):this.skuAttrsList;
                    }
                    if(this.productItem.skus.length>0){
                        this.skuList = this.productItem.skus ? this.productItem.skus:[];
                        if(this.skuAttrsList.length==1 && !this.skuAttrsList[0].name){
                            this.skuAttrsList = [];
                            var attr = {name:'',value:[{value:'',imgUrl:''}],vlen:1,isImg:false};
                            attr.name = this.skuList[0].name1
                            this.skuAttrsList.push(attr);
                            var attr = {name:'',value:[{value:'',imgUrl:''}],vlen:1,isImg:false};
                            attr.name = this.skuList[0].name2
                            this.skuAttrsList.push(attr);
                            var attr = {name:'',value:[{value:'',imgUrl:''}],vlen:1,isImg:false};
                            attr.name = this.skuList[0].name3
                            this.skuAttrsList.push(attr);
                        }
                    }
                }
            })
        },
        getEditProduct(id){
            //  /product/detail
            var params = {id:id};
            this.loading=true;
            this.skuAttrsList = [
                {name:'',value:[{value:'',imgUrl:''}],vlen:1,isImg:false}
            ];
            localStorage.removeItem('prodItem');
            this.req.post('/product/detail',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    var prodItem = res.data.data;
                    if(prodItem.detail &&  prodItem.detail.skuattrs && prodItem.detail.skuattrs.length>0 && !(prodItem.detail.skuattrs instanceof Array)){
                        this.skuAttrsList = JSON.parse(prodItem.detail.skuattrs);
                        localStorage.setItem('prodItem',JSON.stringify(prodItem));
                    }
                }
            })
        },
        ImageCardPreview(){

        },
        ImageRemove(){

        },
        saveSet(cate){
            this.skuList.forEach(item=>{
                item[cate] = this[cate];
            });
            this.$emit('get-sku',{skuAttr:this.skuAttrsList,skuList:this.skuList});
        },
        querySearch(queryString, cb) {
            var results = queryString ? this.values.filter(item=>{return item.value.toLowerCase().indexOf(queryString.toLowerCase())===0}) : this.values;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        selValue(item){

        },
        upbtn(item,itemIndex,index){
            this.upItem = item;
            this.currentItemIndex=itemIndex;
            this.currentIndex=index;
        },
        suss(response, file, fileList) {
            // prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg
            this.skuAttrsList[this.currentItemIndex].value[this.currentIndex].imgUrl = response.data; 
            // this.upItem.imgUrl=response.data;
        },
        // change(file,fileList){
        //     console.log(file);
        //     // this.skuAttrsList[this.currentItemIndex].value[currentIndex].imgUrl = response.data; 
        // },
        addValue(index){
            let fvalue = {value:'',imgUrl:''};
            this.skuAttrsList[index].value.push(fvalue);
            this.$forceUpdate();
        },
        minusValue(itemIndex,index){
             this.skuAttrsList[itemIndex].value.splice(index,1);
        },
        minusName(itemIndex){
             this.skuAttrsList.splice(itemIndex,1);
             localStorage.setItem('skuList',JSON.stringify(this.skuList));
        },
        addSku(){
            if(this.skuAttrsList.length>3){
                this.$message.error('添加规格最多3种');
                return ;
            }
            var addsku = {name:'',value:[{value:'',imgUrl:''}],vlen:1,isImg:false};
            this.skuAttrsList.push(addsku);
            addsku = null;
        },
        countNum(){
            return 6;
        },
        saveSkuList(){
            this.$emit('get-sku',{skuAttr:this.skuAttrsList,skuList:this.skuList});
        }
    },
}
</script>
<style scope>
    .sku{border:1px solid #eee;margin:10px;padding:5px;}
    .sku .sku-img{width:100%;height:100%;}
    .sku .sku-plus{width:35px;height:35px;display:flex;justify-content: center;align-items: center;border:1px dashed #ccc;cursor:pointer;}
    .sku .sku-add{padding:0 5px;height: 35px;}
    .sku .sku-add:hover{border:1px dashed #ccc;cursor:pointer;}
    .sku .sku-note{color:#9e9b9b;font-size:12px;margin-left:100px;}
    .sku-list{border:1px solid #eee;margin:10px;padding:5px;}
    .sku-name{display:flex;}
    .sku-name .sku-name-isimg{padding:0px 15px;}
    .sku-val-list{display:flex;flex-wrap:wrap;overflow:hidden;justify-content:flex-start;}
    .sku-val-list .sku-val{width:calc(20% - 15px);overflow:hidden;margin-right:15px;margin-bottom:10px;}
    /* .sku-list .sku-list-thead{border-bottom:1px solid #eee;} */
    .sku-sets{padding:3px 8px;cursor: pointer;}
    .sku-sets:hover{border:1px dashed #ddd;}
</style>
<style>
.sku-upload-btn .el-upload--picture-card{width: 100% !important;margin-top:15px;}
</style>