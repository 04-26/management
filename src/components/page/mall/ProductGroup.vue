<template>
    <div>
        <el-card>
            <div slot="header">商品列表</div>
            <div class="prod">
                <el-button type="success" @click="cateAdd">新增商品组</el-button>
                <el-button type="info" @click="getCateList">刷新</el-button>
            </div>
            <el-table :data="cateList" style="width:100%" stripe v-loading="loading" row-key="id" class="prod-table"> 
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="title" label="商品组名称">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="!isSys(scope.row)">{{scope.row.title}}</span>
                            <Notes content="（店内所有商品，系统根据商品被购买情况对商品排序、不可编辑修改）" v-if="scope.row.title=='人气推荐'" padding="0"></Notes>
                            <Notes content="（店内所有商品，新发布的商品排在前面、不可编辑修改）" v-if="scope.row.title=='新鲜好物'" padding="0"></Notes>
                            <span v-if="isSys(scope.row)">{{scope.row.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="组内商品数量" width="200">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.items?scope.row.items.length:0}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="200">
                    <template slot-scope="scope">
                        <div>
                        {{scope.row.sort}}
                        <el-popover  trigger="click" v-if='isSys(scope.row)'>
                            <el-input v-model="scope.row.sort" placeholder="请输入序号">
                                <template slot="append">
                                    <el-button type="primary" @click.native="editSort(scope.row)">保存</el-button>
                                </template>
                            </el-input>
                            <template slot="reference"><i class="el-icon-edit-outline" style="color:#ee5002;font-size:16px;"></i></template>
                        </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="200">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.status==1?'启用':'禁用'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="400" align="right">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="status(scope.row)" v-if="scope.row.status==1">禁用</el-button>
                        <el-button type="primary" @click="status(scope.row)" v-if="scope.row.status==2">启用</el-button>
                        <el-button type="primary" @click="cateEdit(scope.row)" v-if='isSys(scope.row)'>编辑</el-button>
                        <el-button type="danger" @click="cateDel(scope.row)" v-if='isSys(scope.row)'>删除</el-button>
                        <el-button type="danger" @click="copy(scope.row)" v-if='isSys(scope.row) && false'>复制链接</el-button>
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
import Notes from '@/components/page/mall/Notes.vue'
import bus from '@/components/common/bus'
export default {
    name:'ProductGroup',
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
        }
    },
    created() {
        this.getCateList();
        bus.$on('get_List',this.getCateList);
    },
    methods: {
        isSys(item){
            var nameArr = ['人气推荐','新鲜好物'];
            if(nameArr.indexOf(item.name)!=-1){
                return false
            }else{
                return true;
            }
        },
        cateAdd(item){
            localStorage.removeItem('groupItem');
            this.$router.push({path:'/addprodgroup'})
        },
        mvProd(item){

        },
        status(item){
            var param = {id:item.id,status:item.status==2?1:2};
            this.loading=true;
            this.req.post("/product/combo/update/status",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    this.getCateList();
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        cateEdit(item){
            localStorage.setItem('groupItem',JSON.stringify(item));
            this.$router.push({path:'/addprodgroup'})
        },
        cateDel(item){
            this.$confirm('此操作将永久删除该数据, 是否继续?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var param = {id:item.id};
                this.loading=true;
                this.req.post("/product/combo/update/del",param).then(res=>{
                    this.loading=false;
                    if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                        this.$message.success('操作成功');
                        this.getCateList();
                    }else{
                        this.$message.error(res.data.sub_msg);
                    }
                })
            }).catch(() => {});
        },
        editSort(item){
            var param = {id:item.id,sort:item.sort};
            this.loading=true;
            this.req.post("/product/combo/save",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    this.getCateList();
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        getCateList(){
            this.loading=true;
            var param = {pageSize:this.pageSize,pageNo:this.pageNo};
            this.req.post("/product/combo/list",param).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.cateList = res.data.data;
                    // this.totalCount = res.data.data.totalCount;
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
        copy(item){

        }
    },
    components:{
        Notes
    }
}
</script>
<style scoped >
    .prod-table{margin-top:10px;}
    .prod-table >>> .el-table__expand-icon{display:inline;padding-right:15px;}
</style>