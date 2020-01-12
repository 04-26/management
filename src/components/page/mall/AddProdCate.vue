<template>
    <div>   
        <el-card v-loading="loading">
            <div slot="header">新增分类</div>
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form ref="form" :model="form" label-width="80px" :rules="ruleForm">
                        <el-form-item label="分类名称" prop="title">
                            <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
                        </el-form-item>
                        <el-form-item label="分类排序">
                            <el-input type="number" min="1" step="1" v-model="form.sort" placeholder="请输入排序"></el-input>
                        </el-form-item>
                        <el-form-item label="上级分类" class="pid-select" prop="pid">
                            <el-select v-model="form.parentid" placeholder="选择上级分类">
                                <el-option
                                    v-for="item in cateList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveCate">保存</el-button>
                            <el-button type="success" @click="reList">返回列表</el-button>
                        </el-form-item>
                    </el-form>
                    
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import helper from '@/utils/helper.js';
import bus from '@/components/common/bus';
export default {
    name:'AddProdCate',
    data(){
        return {
            form:{
                name:'',
                sort:'',
                parentid:''
            },
            ruleForm:{
                name:[{required:true,message:'请填写分类名称',trigger:'blur'}],
                parentid:[{required:true,message:'请选择上级分类',trigger:'blur'}],
            },
            options:[
                {label:'顶级分类',value:1}
            ],
            loading:false,
            cateList:[],
            parentId:0,
        }
    },
    created() {
        if(this.$route.query.parentId){
            this.form.parentid = this.$route.query.parentId;
            if(localStorage.getItem('cateItem')){
                this.cateList.push(JSON.parse(localStorage.getItem('cateItem')));
                localStorage.removeItem('cateItem');
            }
        }else if(this.$route.query.cateId){
            if(localStorage.getItem('cateItem')){
                this.form = JSON.parse(localStorage.getItem('cateItem'));
                localStorage.removeItem('cateItem');
                if(this.form.initTime){
                    delete this.form.initTime;
                }
            }
            this.getCateList();
        }else{
            this.getCateList();
        }
    },
    methods: {
        getCateList(){
            var param = {parentid:this.parentId};
            this.req.post("/product/type/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    var parentItem = {id:0,name:'顶级分类'};
                    if(res.data.data && (res.data.data instanceof Array) && res.data.data.length>0){
                        this.cateList = res.data.data;
                        this.cateList = helper.sort(this.cateList,'sort');
                        this.cateList.unshift(parentItem)
                    }else{
                        this.cateList.push(parentItem);
                    }
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        reList(){
            bus.$emit('close_current_tags');
            this.$router.push({path:"/productcategroy"})
        },
        saveCate(){
            
            this.$refs['form'].validate((valid)=>{
                if(valid){
                    var params = Object.assign({},this.form);
                    this.loading = true;
                    if(!params.sort){
                        params.sort = 1;
                    }
                    var url = '/product/type/save';
                    // if(this.$route.query.cateId){
                    //     url = '/product/type/edit'
                    // }
                    this.req.post(url,params).then(res=>{
                        this.loading = false;
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            bus.$emit('getCateList');
                            bus.$emit('close_current_tags');
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }else{
                    return false;
                }
            })
            
        }
    },
}
</script>
<style scoped>
    .pid-select >>> .el-select{width:100%;}
</style>>
