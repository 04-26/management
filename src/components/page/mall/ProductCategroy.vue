<template>
    <div>
        <el-card>
            <div slot="header">商品分类列表</div>
            <div class="prod">
                <el-button type="success" @click="cateAdd">新增商品分类</el-button>
            </div>
            <el-table :data="cateList" style="width:100%" stripe v-loading="loading" row-key="id" :lazy='true' :load="getList" border class="prod-table" > 
                <el-table-column prop="name" label="分类层级"></el-table-column>
                <el-table-column prop="sort" label="排序" width="200"></el-table-column>
                <el-table-column prop="num" label="商品数据" width="200"></el-table-column>
                <el-table-column  label="操作" width="400" align="right">
                    <template slot-scope="scope">
                        <el-button type="info" @click="cateAdd(scope.row)" v-if="scope.row.parentid==0">新增子分类</el-button>
                        <el-button type="warning" @click="mvProd(scope.row)" v-if='false'>移动商品</el-button>
                        <el-button type="primary" @click="cateEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="cateDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
                :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </el-card>
        <el-dialog title="" :visible.sync="dialogVisible" width="300">
            <div></div>
            <div slot="footer" style="text-align:center;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import helper from '@/utils/helper.js';
import bus from '@/components/common/bus';
export default {
    name:'ProductCategroy',
    data(){
        return {
            cateList:[],
            loading:false,
            totalCount:0,
            pageSize:10,
            pageNo:1,
            mutilUp:'批量下架',
            selProd:[],
            dialogVisible:false,
            parentId:0,
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        cateAdd(item){
            if(item && item.id){
                localStorage.setItem('cateItem',JSON.stringify(item));
                this.$router.push({path:'/addprodcate',query:{parentId:item.id}})
            }else{
                this.$router.push({path:'/addprodcate'})
            }
        },
        mvProd(item){

        },
        cateEdit(item){
            localStorage.setItem('cateItem',JSON.stringify(item));
            this.$router.push({path:'/addprodcate',query:{cateId:item.id}});
            bus.$on('getCateList',()=>{
                this.getCateList();
            });
        },
        cateDel(item){
            this.$confirm('此操作将永久删除该该条数据, 是否继续?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {id:item.id};
                this.req.post("/product/type/del",params).then(res=>{
                    this.loading=false;
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                        this.getCateList();
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
            })
        },
        getCateList(){
            var param = {parentid:this.parentId};
            this.loading = true;
            this.req.post("/product/type/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    res.data.data.forEach(item=>{
                        item.hasChildren = true;
                        item.children = [];
                    })
                    this.cateList = res.data.data;
                    this.cateList = helper.sort(this.cateList,'sort');
                    this.totalCount = res.data.data.totalCount;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        getList(row,index,resolve){
            var param = {parentid:row.id};
            this.loading = true;
            this.req.post("/product/type/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    resolve(res.data.data);
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        
        sizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.loading=true;
            this.getCateList();
        },
        pageNoChange(pageNo){
            this.pageNo = pageNo;
            this.loading=true;
            this.getCateList();
        },
        search(){
            this.pageNo = 1;
            this.loading=true;
            this.getCateList();
        },
    },
}
</script>
<style scoped >
    .prod-table{margin-top:10px;}
    .prod-table >>> .el-table__expand-icon{display:inline;padding-right:15px;}
</style>