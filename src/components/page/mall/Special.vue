<template>
    <div>
        <el-card class="spec-card">
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="12">专题精选</el-col>
                    <el-col :span="12" class="header-right">更多推荐</el-col>
                </el-row>
            </div>
            <div class="cards">
                <div class="card-bodys">
                    <!-- <el-carousel height="200px" :autoplay="false">
                        <el-carousel-item v-for="(item, index) in list" :key="index" type="card" class="card-item" :style="{order:item.sort}">
                            <div class="card-body" draggable="true">
                                <div class="card-body-img">
                                    <img class="body-img" :src="$imgurl()+thumb" v-if="thumb.length>0"/>
                                </div>
                                <div class="card-body-right">
                                    <div>
                                        <div class="title">{{item.name}}</div>
                                        <div class="desc">{{item.name}}</div>
                                    </div>
                                    <div class="btns">
                                        <div class="price">￥{{item.price}}元起</div>
                                        <div class="go-btn" v-if="false">去看看</div>
                                    </div>
                                </div>
                            </div>
                        </el-carousel-item>
                    </el-carousel> -->
                    <div class="card-body" draggable="true">
                        <div class="card-body-img">
                            <el-image class="body-img" :src="$imgurl()+item.imageUrl" fit="object-fit">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="card-body-right">
                            <div>
                                <div class="title">{{item.name}}</div>
                                <div class="desc">{{item.title}}</div>
                            </div>
                            <div class="btns">
                                <div class="price">￥{{item.price}}元起</div>
                                <div class="go-btn" v-if="false">去看看</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="selbtn" @click="$emit('sel-type',3)">
                    <el-radio :label="3" v-model="typev">选择专题精选商品组</el-radio>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Special',
    props:{
        list:{type:Array,default:()=>{return []}},
        type:{type:Number,default:0},
        item:{type:Object,default:{imageUrl:'',name:'',title:''}}
    },
    created(){
        this.typev = this.type;
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
    methods: {
        
    },
}
</script>

<style scoped>
.spec-card >>> .el-card__body{padding:0px !important;}
.header-right{text-align:right;color:#777;}
/* .card-bodys{display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:flex-start;} */
.card-bodys >>> .el-carousel__item{width:100% !important;}
.card-bodys >>> .el-carousel__container{display:flex;justify-content: flex-start;}
.card-body{display:flex;flex-direction: column;box-sizing:border-box;border:1px solid #ddd;padding:0px 5px;}
.card-body:hover{border:2px dashed #ddd;}
.card-body-img{flex:0 0 80px;}
.body-img{width:100%;height:150px;}
.card-body-right{flex:4;display:flex;flex-direction:row;padding:10px 0px;box-sizing: border-box;}
.card-body-right .title{flex:1;}
.card-body-right .desc{flex:1;color:#ddd;}
.card-body-right .btns{flex:1;display:flex;justify-content:flex-end;align-items:flex-start;}
.card-body-right .btns .price{color:#ee5002;font-size:14px;text-align:center;}
.card-body-right .btns .go-btn{border:1px solid #ee5002;padding:0px 3px;color:#ee5002;font-size:12px;}
.selbtn{padding:10px 5px;background:#ddd;margin-top:15px;order:4}
.body-img >>> .image-slot{text-align: center;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 35px;color: #eee;}
</style>