<template>
    <div>
        <el-row :gutter="10" v-loading="loading">
            <el-col :span="6">
                <div class="mobile" :style="{backgroundImage:'url('+mbg+')'}">
                    <iframe :src="getUrl()" 
                        height="100%" width="100%" scrolling="no" allowtransparency="yes"
                        frameborder="0" class="htmltemp" ></iframe>
                    <div class="htmltemp" v-html="templateHtml" v-if='false'></div>
                    <div class="iframe-modal"></div>
                </div>
            </el-col>
            <el-col :span="8">
                <el-form :model="form" ref="form" label-width="80px" class="template-form">
                    <el-form-item label="选择模版">
                        <el-radio-group v-model="form.template_id">
                            <el-radio v-for="(item, index) in templateList" :key="index" :label="item.template_id">{{item.source_miniprogram}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交模版</el-button>
                    </el-form-item>
                </el-form>

            </el-col>
            <el-col :span="10">
                <el-button type="primary" @click="latestauditstatus">查询模版审核状态</el-button>
                <div v-if="reason.length>0">{{reason}}</div>
                <div style="padding:15px 0px;" v-if="qrcode.length>0">
                    <div style="font-size:14px;">体验二维码</div>
                    <img :src="qrcode" style="width:150px;height:150px;" v-if="qrcode.length>0">
                </div>
                <el-checkbox v-model="wxmsgtemplate" @change="checkTmpSms" :disabled="wxmsgtemplate">初始化模版消息</el-checkbox>
                <el-button type="primary" @click="release" v-if="isRelease">发布小程序</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name:"MiniTemplate",
    props:{
        shopDetail:{type:Object,default:{}}
    },
    data(){
        return {
            templateList:[],
            mbg:require("@/assets/img/minibg.png"),
            templateHtml:'',
            form:{
                template_id:0
            },
            loading:false,
            isRelease:false,
            reason:'',
            qrcode:'',
            wxmsgtemplate:false
        }
    },
    created(){
        this.getTemplate();
        // this.getTemplateHtml();
        this.getQrcode();
        this.wxmsgtemplate = this.shopDetail.wxmsgtemplate;
    },
    methods: {
        getUrl(){
            var url = process.env.NODE_ENV=="development" || location.host.indexOf('uat')!=-1?'https://uatbbclient.xsztn.cn/index.html?appid='+this.shopDetail.appid:'https://client.xszam.com/index.html?appid='+this.shopDetail.appid;
            return url;
        },
        getTemplate(){
            // /wxapi/templatelist
            this.req.get("/wxapi/templatelist",{}).then(res=>{
                if(res.errcode==0 && res.errmsg=='ok'){
                    this.templateList = res.template_list;
                }
            })
        },
        getTemplateHtml(){
            this.req.get('https://www.baidu.com').then(res=>{
                this.templateHtml = res;
            })
        },
        onSubmit(){
            // /wxapi/submitaudit
            this.loading=true
            this.req.get("/wxapi/committemplate/"+this.shopDetail.appid+'/'+this.form.template_id).then(res=>{
                this.loading=false;
                if(res.errcode==0 && res.errmsg=='ok'){
                    // this.$message.success("提交成功");
                    this.submitaudit();
                }else{
                    this.$message.error(res.errmsg);
                }
            })
        },
        submitaudit(){
            this.req.get("/wxapi/submitaudit/"+this.shopDetail.appid).then(res=>{
                if(res.errcode==0 && res.errmsg=='ok'){
                    this.$message.success("提交成功");
                    
                }else{
                    this.$message.error(res.errmsg);
                }
            })
        },
        latestauditstatus(){
            this.req.get("/wxapi/latestauditstatus/"+this.shopDetail.appid).then(res=>{
                if(res.errcode==0 && res.errmsg=='ok'){
                    if(res.status==0){
                        this.$message.success("审核通过");
                        this.isRelease=true;
                    }else if(res.status==2){
                        this.$message.success("审核中");
                    }else{
                        this.$message.error("审核未通过");
                        this.reason = res.reason;
                    }
                }else{
                    this.$message.error(res.errmsg);
                }
            })
        },
        release(){
            this.req.get("/wxapi/release/"+this.shopDetail.appid).then(res=>{
                if(res.errcode==0 && res.errmsg=='ok'){
                    this.$message.success("发布小程序成功");
                }else{
                    this.$message.error(res.errmsg);
                }
            })
        },
        getQrcode(){
            var url = process.env.NODE_ENV=="development" || location.host.indexOf('uat')!=-1?'https://uatwxapi.xszam.com/wxapi/qrcode/':'https://wxapi.xszam.com/wxapi/qrcode/'
            this.qrcode = url+this.shopDetail.appid;
        },
        checkTmpSms(){
            // /wxapi/inittemplates/wx39b9fc128b665cd6/654
            if(this.wxmsgtemplate){
                this.req.get("/wxapi/inittemplates/"+this.shopDetail.appid+'/'+this.shopDetail.id).then(res=>{
                    if(res.code=='success'){
                        this.$message.success('初始化成功');
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            }
        }
    },
}
</script>
<style scope>
    .mobile{width:100%;height:671px;background-repeat:no-repeat;background-position: center center;padding:60px 10px 0px;position: relative;}
    .iframe-modal{position:absolute;top:0;left:0;z-index:99;width:100%;height:100%;}
    .htmltemp{width:100%;height:100%;}
    iframe::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
    
</style>
<style>
.template-form .el-radio-group{vertical-align:initial;}
</style>