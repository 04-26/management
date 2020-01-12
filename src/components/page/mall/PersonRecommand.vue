<template>
    <div>
        <el-card>
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="12">人气推荐</el-col>
                    <el-col :span="12" class="header-right">更多推荐</el-col>
                </el-row>
            </div>
            <div>
                <div class="card-bodys">
                    <div class="card-body" draggable="true" v-for="(item, index) in list" :key="index" v-if="index<3" :style="{order:item.sort}">
                        <div class="card-body-img">
                            <img class="body-img" :src="$imgurl()+item.imageUrl" />
                        </div>
                        <div class="card-body-right">
                            <div class="title">{{item.name}}</div>
                            <div class="desc">{{item.name}}</div>
                            <div class="btns">
                                <div class="price">￥{{item.price}}</div>
                                <div class="go-btn">去看看</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="selbtn" @click="$emit('sel-type',1)">
                    <el-radio :label="1" v-model="typev" >选择人气推荐商品组</el-radio>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'PersonRecommand',
    props:{
        list:{type:Array,default:()=>{return []}},
        type:{type:Number,default:0},
    },
    data(){
        return {
            typev:0
        }
    },
    watch:{
        type:function(v,o){
            this.typev = v;
            return v;
        }
    },
    created(){
        this.typev = this.type;
    },
    methods: {
        
    },
}
</script>

<style scope>
.header-right{text-align:right;color:#777;}
.card-bodys{display:flex;flex-direction:column;}
.card-body{display:flex;box-sizing:border-box;border-bottom:1px solid #ddd;padding:10px 0px;}
.card-body:last-child{border:none;}
.card-body:nth-child(1){order:3;}
.card-body:nth-child(2){order:2;}
.card-body:hover{border:2px dashed #ddd;}
.card-body-img{flex:0 0 80px;}
.body-img{width:100%;height:80px;}
.card-body-right{flex:4;display:flex;flex-direction:column;padding:0px 10px 0px;box-sizing: border-box;}
.card-body-right .title{flex:1;}
.card-body-right .desc{flex:1;color:#ddd;}
.card-body-right .btns{flex:1;display:flex;justify-content: space-between;align-items:flex-end;}
.card-body-right .btns .price{color:#ee5002;font-size:14px;}
.card-body-right .btns .go-btn{border:1px solid #ee5002;padding:0px 3px;color:#ee5002;font-size:12px;}
.selbtn{padding:10px 5px;background:#ddd;margin-top:15px;order:4}
</style>