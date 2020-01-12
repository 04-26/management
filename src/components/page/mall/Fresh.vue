<template>
    <div>
        <el-card>
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="12">新鲜好物</el-col>
                    <el-col :span="12" class="header-right">更多推荐</el-col>
                </el-row>
            </div>
            <div class="cards">
                <div class="card-bodys">
                    <el-carousel height="150px" :autoplay="false">
                        <el-carousel-item v-for="(item, index) in list" :key="index" type="card" class="card-item" :style="{order:item.sort}">
                            <div class="card-body" draggable="true">
                                <div class="card-body-img">
                                    <img class="body-img" :src="$imgurl()+item.imageUrl" />
                                </div>
                                <div class="card-body-right">
                                    <div class="title">{{item.name}}</div>
                                    <div class="desc">{{item.name}}</div>
                                    <div class="btns">
                                        <div class="price">￥{{item.price}}</div>
                                        <div class="go-btn" v-if="false">去看看</div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body" draggable="true">
                                <div class="card-body-img">
                                    <img class="body-img" :src="$imgurl()+item.imageUrl" />
                                </div>
                                <div class="card-body-right">
                                    <div class="title">{{item.title}}</div>
                                    <div class="desc">{{item.title}}</div>
                                    <div class="btns">
                                        <div class="price">￥{{item.price}}</div>
                                        <div class="go-btn" v-if="false">去看看</div>
                                    </div>
                                </div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="selbtn" @click="$emit('sel-type',2)">
                    <el-radio :label="2" v-model="typev" >选择新鲜好物商品组</el-radio>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Fresh',
    props:{
        list:{type:Array,default:()=>{return []}},
        type:{type:Number,default:0},
    },
    data(){
        return {
            typev:0
        }
    },
    created(){
        this.typev = this.type;
    },
    watch:{
        type:function(v,o){
            console.log(v,'---');
            this.typev = v;
            return v;
        }
    },
    methods: {
        
    },
}
</script>

<style scoped>
.header-right{text-align:right;color:#777;}
/* .card-bodys{display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:flex-start;} */
.card-item{display:flex;justify-content: space-evenly;}
.card-bodys >>> .el-carousel__item{width:100% !important;}
.card-bodys >>> .el-carousel__container{display:flex;justify-content: flex-start;}
.card-body{width:150px;display:flex;flex-direction: column;box-sizing:border-box;border:1px solid #ddd;padding:0px 5px;}
.card-body:hover{border:2px dashed #ddd;}
.card-body-img{flex:0 0 80px;}
.body-img{width:100%;height:80px;}
.card-body-right{flex:4;display:flex;flex-direction:column;padding:0px 10px 0px;box-sizing: border-box;text-align:center;}
.card-body-right .title{flex:1;}
.card-body-right .desc{flex:1;color:#ddd;}
.card-body-right .btns{flex:1;display:flex;justify-content: center;align-items:flex-end;}
.card-body-right .btns .price{color:#ee5002;font-size:14px;}
.card-body-right .btns .go-btn{border:1px solid #ee5002;padding:0px 3px;color:#ee5002;font-size:12px;}
.selbtn{padding:10px 5px;background:#ddd;margin-top:15px;order:4}
</style>