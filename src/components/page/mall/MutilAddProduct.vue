<template>
    <div>
        <el-card>
            <div slot="header">批量上传商品</div>
            <div class="prod">
                <Notes :content="notes" :padding="10"></Notes>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form :inline="true" ref="form" :model="form" :rules="ruleForm" label-width="135px">
                            <el-form-item label="上传商品模版文件" prop="productFile">
                                <el-input v-model="form.productFile" placeholder="请上传商品模版库" style="width:450px;">
                                    <template slot="append">
                                        <el-upload action="$upfileUrl" :show-file-list="false" :on-success="prodSuccess" :before-upload="beforeProdSuccess" class="sele-file">
                                            选择
                                        </el-upload>
                                    </template>
                                </el-input>
                                &nbsp;<a :href="downlink" target="_blank" rel="noopener noreferrer" class="down">点此下载模板文件</a>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12">&nbsp;</el-col>
                </el-row>
                <el-button type="primary" style="margin-left:135px;" @click="importEslx">上 传</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import Notes from '@/components/page/mall/Notes.vue';
export default {
    name:'MutilAddProduct',
    data(){
        return {
            notes:'1.上传的文件必须是xlsx文件，可下载模板表格，按照模板表格进行商品数据处理；<br>2.批量上传的商品均在商品仓库中，需要手动编辑审核上架；',
            form:{productFile:'',},
            ruleForm:{
                productFile:[
                    {required:true,message:'请上传批量上传商品模版',trigger:'blur'}
                ],
            },
            downlink:''
        }
    },
    methods: {
        importEslx(){

        },
        prodSuccess(file,fileList){

        },
        beforeProdSuccess(file){

        }
    },
    components:{
        Notes
    }
}
</script>
<style scoped >
    .prod >>> .el-input-group__append{padding:0;}
    .prod >>> .el-upload--text{width:100%;height:100%;padding:4px 10px;border:none;}
    .down{color:#00d1b2;}
</style>