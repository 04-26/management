<template>
    <div>
        <div class="sku">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="商品规格名:">
                    <el-input v-model="form.name" placeholder="请输入商品规格名"></el-input>
                </el-form-item>
                <el-form-item label="商品规格值:">
                    <div class="sku-val" v-for="(item,index) in form.value" :key="index">
                        <el-row :gutter="5">
                            <el-col :span="10"><el-input v-model="item.value" placeholder="请输入商品规格名"></el-input></el-col>
                            <el-col :span="4"> 
                                    <i class="el-icon-plus sku-add" @click="addValue"></i>
                                    <i class="el-icon-minus sku-add" @click="minusValue(index)" v-if='index>0'></i>
                            </el-col>                  
                            <el-col :span="8" class="text-center">                    
                                <el-upload 
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
                                    <img v-if="item.imgUrl" :src="$imgurl()+item.imgUrl" class="sku-img">
                                    <i  v-if="!item.imgUrl" class="el-icon-plus"></i>
                                </el-upload>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="sku-note" style="margin-left:0px;">仅支持一组规格设置规格图片（最多30张图），买家选择不同规格会看到对应规格图片，建议尺寸：640 x 640像素</div>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="addSku">添加规格</el-button>
                </el-form-item>
            </el-form>
            <div class="sku-note">如有颜色、尺码、口味、容量、等请添加规格名,最多只能添加3个规格。</div>
        </div>
        <div class="sku-list" v-if="skuList.length>0">
            <table class="table table-striped table-bordered" border="1">
                <tr class="sku-list-thead">
                    <td v-for='(item,index) in skuAttrsList' :key="index">{{item.name}}</td>
                    <td>库存</td>
                    <td>编码</td>
                    <td>卖价</td>
                    <td>划线价</td>
                    <td>已售数量</td>
                    <td>销量</td>
                </tr>
                <tr v-for='(item,index) in countNum()' :key="index">
                    <template v-for="(aitem,aindex) in skuAttrsList">
                        <td :rowspan="aitem.value.length" v-for="sitem in aitem.value">{{sitem.value}}{{aindex}}</td>
                    </template>
                    <td>
                        库存2
                    </td>
                    <td>
                        库存2
                    </td>
                    <td>卖价</td>
                    <td>划线价</td>
                    <td>已售数量</td>
                    <td>销量</td>
                </tr>

            </table>
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
       pid:{type:Number,default:0}, 
    },
    data(){
        return {
            form:{
                name:'',
                value:[{value:'',imgUrl:''}],
            },
            valueList:[],
            skuAttrsList:[],
            skuList:[]
        }
    },
    methods: {
        ImageCardPreview(){

        },
        ImageRemove(){

        },
        suss(response, file, fileList) {
            // prod/2019/11/17/06cac36a-b8ca-44af-be3b-c2b6b1c3bf40.jpg
            this.form.detail.images.push(response.data) ;
        },
        addValue(){
            let fvalue = {value:'',imgUrl:''};
            this.form.value.push(fvalue)
        },
        minusValue(index){
            this.form.value.splice(index,1);
        },
        addSku(){
            if(this.skuAttrsList.length>3){
                this.$message.error('添加规格最多3种');
                return ;
            }
            let addsku = Object.assign({},this.form);
            this.skuAttrsList.push(addsku);
            let skuAttr = {
                shopId:'',
                stock:'',
                pcode:'',
                sold:'',
                price:'',
                marketPrice:'',
                wholesalePrice:'',
                msrprice:''
            };
            skuAttr.name = this.form.name;
            addsku.value.forEach(item=>{
                let addItem = Object.assign({},skuAttr)
                addItem.value = item.value;
                this.skuList.push(addItem);
            })
            this.form.name = '';
            this.form.value = [{value:'',imgUrl:''}];
        },
        countNum(){
            return 6;
        }
    },
}
</script>
<style scope>
    .sku{border:1px solid #eee;margin:10px;padding:5px;}
    /* .sku-upload-btn{width:100%;height:100%;} */
    .sku-upload-btn >>> .el-upload--picture-card{width: 100px;height: 100px;line-height:100px;margin-top:15px;}
    .sku .sku-img{width:100px;height:100px;}
    .sku .sku-plus{width:35px;height:35px;display:flex;justify-content: center;align-items: center;border:1px dashed #ccc;cursor:pointer;}
    .sku .sku-val{margin-bottom:10px;}
    .sku .sku-add{margin:0 5px;}
    .sku .sku-add:hover{border:1px dashed #ccc;cursor:pointer;}
    .sku .sku-note{color:#9e9b9b;font-size:12px;margin-left:100px;}
    .sku-list{border:1px solid #eee;margin:10px;padding:5px;}
    /* .sku-list .sku-list-thead{border-bottom:1px solid #eee;} */
</style>