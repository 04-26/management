<template>
    <div>
        <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="tableData" style="width:100%">
            <el-table-column label="商品名称">
                <template slot-scope="scope">
                <img :src="$imgurl()+scope.row.imgUrl" style="width:30px;height:30px;" v-if='scope.row.imgUrl'>
                <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column label="售价(元)" width="220">
                <template slot-scope="scope">
                <span style="margin-left:10px">{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="总销售量(次)" width="220">
                <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left:10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="直接推广提成(元)" width="220">
                <template slot-scope="scope">
                <span style="margin-left:10px">{{ scope.row.firstamount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="间接推广提成(元)" width="120">
                <template slot-scope="scope">
                <span style="margin-left:10px">{{ scope.row.secdamount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" width="220" v-if='showTime'>
                <template slot-scope="scope">
                <span style="margin-left:10px">{{ scope.row.initTime|dateformat }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" v-if="!noOpt">
                <template slot-scope="scope">
                <el-button size="mini" @click="$emit('del-item',scope.$index, scope.row)">删除</el-button>
                <el-button size="mini" @click="$emit('edit-item',scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name:'ServiceMassage',
    props:{
        tableData:{type:Array,default:[]},
        noOpt:{type:Boolean,default:false},
        showTime:{type:Boolean,default:false},
    },
    data(){
        return {

        }
    },
    methods:{

    }
}
</script>
<style scope>

</style>