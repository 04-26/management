<template>
    <div>
        <el-table :data="list" style="width: 100%" stripe @selection-change="selChange" ref="prodList"> 
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="title" label="产品名称">
                <template slot-scope="scope">
                    <img :src="$imgurl()+scope.row.imageUrl" style="width:45px;height:45px;vertical-align: top;margin-right:5px;" :alt="scope.row.id">
                    <div style="display:inline-block;">
                        <div>
                            <span class="title">{{scope.row.name.substr(0,5)}}{{scope.row.name.length>5?'...':''}}</span>
                            <el-popover  trigger="click">
                                <el-input v-model="scope.row.name" placeholder="请输入商品名称">
                                    <template slot="append">
                                        <el-button type="primary" @click.native="saveTitle(scope.row)">保存</el-button>
                                    </template>
                                </el-input>
                                <template slot="reference"><i class="el-icon-edit-outline"></i></template>
                            </el-popover>
                        </div>
                        <div style="color:#ee5002;">￥{{scope.row.price}} <i class="el-icon-edit-outline" @click="$emit('edit-price',scope.row)"></i></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="120">
                <template slot-scope="scope">
                    <el-tag type="danger">{{scope.row.stock}}</el-tag>
                    <i class="el-icon-edit-outline" @click="$emit('set-stock',scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column prop="resold" label="总销量" width="200px"></el-table-column>
            <el-table-column prop="id" label="序号" width="120">
                <template slot-scope="scope">
                    {{scope.row.sort}} 
                    <el-popover  trigger="click">
                        <el-input v-model="scope.row.sort" placeholder="请输入序号">
                            <template slot="append">
                                <el-button type="primary" @click.native="$emit('save-sort',scope.row)">保存</el-button>
                            </template>
                        </el-input>
                        <template slot="reference"><i class="el-icon-edit-outline"></i></template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="initTime" label="创建时间" width="200px">
                <template slot-scope="scope">
                    {{scope.row.initTime|dateformat}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="上架状态" width="80px" align="center">
                <template slot-scope="scope">
                    {{scope.row.onsell?'上架':'下架'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="false">复制</el-button>
                    <el-button type="primary" size="mini" @click="$emit('edit-item',scope.row)">编辑</el-button>
                    <!-- <el-button type="primary" size="mini">分享</el-button> -->
                    <el-button type="danger" size="mini" @click="$emit('delete',scope.row)">删除</el-button>
                    <el-button type="warning" size="mini" @click="$emit('on-sell',scope.row)"> {{scope.row.onsell?'下架':'上架'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name:'ProductItem',
    props:{
        list:{type:Array,default:()=>{return []}}
    },
    data(){
        return {

        }
    },
    methods: {
        selChange(selection){
            this.$emit('sel-change',selection)
        },
        clear(){
            this.$refs['prodList'].clearSelection();
        },
        saveTitle(item){
            this.$emit('save-title',item);
        },
        delete(item){
            this.$emit('delete',item);
        }
    },
}
</script>
<style scope>
    .el-icon-edit-outline{font-size:16px;color:#ee5002;vertical-align:sub;}
</style>