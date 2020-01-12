<template>
    <div>
        <div class="box">
            <div class="box-title" :style="{color:textColor}">{{(indexNum+1)+'、'}}{{item.title}}</div>
            <div class="box-btn">
                <el-button type="primary" :style="{backgroundColor:textColor,letterSpacing:'1px'}" @click="video(item)">查看教程</el-button>
                <el-button type="primary" :style="{backgroundColor:textColor,letterSpacing:'1px'}" @click="artice(item)">查看文档</el-button>
            </div>
        </div>
        <el-dialog :title="'【'+item.title+'】视频教程'" :visible.sync="dialogTableVisible" class="guidle-video" :close-on-click-modal="false" :close-on-press-escape="false">
            <video :src="$imgurl()+item.summary" controls="controls" style="width:100%;">您的浏览器不支持 video 标签。</video>
        </el-dialog>
        <el-dialog :title="'【'+item.title+'】文档教程'" :visible.sync="artDialogVisible" class="guidle-video" :close-on-click-modal="false" :close-on-press-escape="false">
            <div v-html="item.content" style="width:100%;padding:15px;max-height:600px;overflow-y:auto;"></div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'Guidle',
    props:{
        bgColor:{type:String,default:'#ffffff'},
        textColor:{type:String,default:'#06bda2'},
        item:{type:Object,default:{}},
        btnBgColor:{type:String,default:'#06bda2'},
        indexNum:{type:Number,default:0}
    },
    data(){
        return {
            dialogTableVisible:false,
            artDialogVisible:false
        }
    },
    methods: {
        video(item){
            this.dialogTableVisible=true;
        },
        artice(item){
            this.artDialogVisible=true;
        }
    },
}
</script>
<style scoped>
    .box{box-shadow: 0px 0px 16px 4px #eee;padding:20px;}
    .box-title{padding:0 3px 24px;text-align:left;cursor: pointer;}
    .box-btn{display:flex;justify-content: space-between;}
</style>
<style>
.guidle-video .el-dialog__body{padding:0px !important;}
</style>