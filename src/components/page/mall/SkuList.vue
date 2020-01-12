<template>
  <div style="padding:15px 0px;" v-if="item.id">
        <table class="table table-striped table-bordered" border="1" v-loading="loading" style="margin-bottom:5px;">
            <tr style="background:#ee5002;color:#fff;" class="head"><td :colspan="skuAttrsList.length+collen">产品名称</td><td>产品价格</td><td style="text-align:center;">{{rightTitle}}</td></tr>
            <tr class="head">
                <td :colspan="skuAttrsList.length+collen">
                    <div style="display:flex;">
                        <el-image style="width: 45px; height: 45px;margin-right:5px;" :src="$imgurl()+item.imageUrl" fit="cover"></el-image>
                        <div>
                            <div style="font-size:12px;line-height:24px;">{{item.name}}</div>
                            <div style="font-size:12px;line-height:24px;">{{item.titme}}</div>
                        </div>
                    </div>
                </td>
                <td style="width:180px;">￥{{item.price}}元</td>
                <td style="width:180px;text-align:center;">
                    <el-button type="primary" @click="removeProd" size="mini">移除商品</el-button>
                </td>
            </tr>
            <tr class="sku-list-thead head" v-if="showSku">
                <td style="padding:3px;" v-for='(item,index) in skuAttrsList' :key="index">{{item.name}}</td>
                <td>库存</td>
                <td v-if="false" style="width:135px;">批发价</td>
                <td  style="width:135px;">划线价</td>
                <td style="width:135px;">卖价</td>
                <td style="width:135px;" v-if="isasprice">{{priceTitle}}</td>
                <td style="width:135px;text-align:center;">规格编码</td>
            </tr>
            <tr v-for='(item,index) in skuList' :key="index" v-if="showSku">
                <template v-for='(aitem,aindex) in skuAttrsList'>
                    <td style="padding:3px;"  :key="aindex">{{item['value'+(aindex+1)]}}</td>
                </template>
                <td><el-input-number v-model="item.stock" :min="1" @change="saveSkuList" disabled></el-input-number></td>
                <td v-if="false"><el-input v-model="item.wholesalePrice" placeholder="请输入批发价" type="number" step="0.01" min="0" @blur="saveSkuList" disabled></el-input></td>
                <td><el-input v-model="item.marketPrice" placeholder="请输入划线价" type="number" step="0.01" min="0" @blur="saveSkuList" disabled></el-input></td>
                <td>
                    <el-input v-once :value="item.price" placeholder="请输入交易价" type="number" step="0.01" min="0" @blur="saveSkuList" disabled>
                        <template slot="append" v-if="isPriceBtn">
                            <div>
                                <el-button type="primary" @click="removeSku(item,index)" size="mini">移除</el-button>
                            </div>
                        </template>
                    </el-input>
                </td>
                <td v-if="isasprice">
                    <el-input v-model="item.price" placeholder="请输入交易价" type="number" step="0.01" min="0" @blur="saveSkuList">
                        <template slot="append">
                            <div>
                                <el-button type="primary" @click="removeSku(item,index)" size="mini">移除</el-button>
                            </div>
                        </template>
                    </el-input>
                </td>
                <td style="text-align:center;">{{item.pcode}}</td>
            </tr>
        </table>
        <div v-if="showSku && isasprice">
            批量设置:&nbsp;{{priceTitle}}
            <el-popover  trigger="click">
                <el-input v-model="price" :placeholder="'请输入'+priceTitle">
                    <template slot="append">
                        <el-button type="primary" @click.native="saveSet('price')">保存</el-button>
                    </template>
                </el-input>
                <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;"></i></template>
            </el-popover>
        </div>
  </div>
</template>

<script>
export default {
    name:'SkuList',
    props:{
        item:{type:Object,default:{name:''}},
        isasprice:{type:Boolean,default:true},
        showSku:{type:Boolean,default:true},
        rightTitle:{type:String,default:'产品编码'},
        priceTitle:{type:String,default:'成团价'},
        isEditPrice:{type:Boolean,default:true},
        isPriceBtn:{type:Boolean,default:false},
        collen:{type:Number,default:3}
    },
    data(){
        return {
            loading:false,
            skuList:[],
            skuAttrsList:[],
            product:{},
            price:''
        }
    },
    created(){
        if(this.item.id){
            this.getProduct(this.item.id);
        }
    },
    methods:{
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
        saveSkuList(){
            this.$emit('get-skulist',this.skuList);
        },
        getProduct(id){
            //  /product/detail
            var params = {id:id};
            this.loading=true;
            this.req.post('/product/detail',params).then(res=>{
                this.loading=false;
                if(res.data.data.skus.length==0){
                    this.$emit('remove-item',this.item);
                    this.$message.error('商品参数异常，请重新选择');
                    return ;
                }
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.product = res.data.data
                    var prodItem = res.data.data;
                    if(prodItem.detail &&  prodItem.detail.skuattrs && prodItem.detail.skuattrs.length>0 && !(prodItem.detail.skuattrs instanceof Array)){
                        this.skuAttrsList = JSON.parse(prodItem.detail.skuattrs);
                    }else{
                        this.skuAttrsList = JSON.parse(prodItem.detail.skuattrs);
                    }
                    this.skuList = res.data.data.skus;
                    this.skuList.sort((item1,item2)=>{
                        if(escape(item1.value1+item1.value2+item1.value3)>escape(item2.value1+item2.value2+item2.value3)){
                            return 1;
                        }else if(escape(item1.value1+item1.value2+item1.value3)<escape(item2.value1+item2.value2+item2.value3)){
                            return -1;
                        }else{
                            return 0;
                        }
                    });
                    this.$emit('get-skulist',this.skuList);
                }
            })
        },
        removeSku(item,index){
            this.skuList.splice(index,1);
            this.$emit('get-skulist',this.skuList);
        },
        removeProd(){
            this.$emit('remove-item',this.item);
        },
        saveSet(cate){
            this.skuList.forEach(item=>{
                item[cate] = this[cate];
            });
            this.$emit('get-sku',{skuAttr:this.skuAttrsList,skuList:this.skuList});
        },
    }
}
</script>
<style scoped>
.head{background:#eee;color:#666;}
.head td{padding:5px 10px;}
</style>