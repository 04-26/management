<template>
    <div>
        <el-table v-loading="loading"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column :label="clmName">
              <template slot-scope="scope">
                <img :src="scope.row.avatar|avatar" style="width:30px;height:30px;border-radius:50%;">
                <div style="display:inline-block;vertical-align:middle;">
                  <div style="margin-left: 10px">{{ scope.row.realName }}</div>
                  <div style="margin-left: 10px">{{ scope.row.telphone }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="clmTime">
              <template slot-scope="scope">
                <span>{{ scope.row.recentVisitTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="级别">
              <template slot-scope="scope">
                <span>{{ scope.row|level(currUser) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="禁用时间">
              <template slot-scope="scope">
                <span>{{ scope.row.initTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button size="mini" @click="$emit('detail', scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
    </div>
</template>
<script>
export default {
    name:'DisPromoterItem',
    props:{
        tableData:{type:Array,default:[]},
        clmName:{type:String,default:'我的推广员'},
        clmTime:{type:String,default:'绑定时间'},
        loading:{type:Boolean,default:false},
        currUser:{type:Object,default:{}}
    },
    data(){
        return {

        }
    },
    filters:{
      level(v,currUser){
        if(v && currUser){
          if(v.recommendId==currUser.id){
            return "直接下级";
          }
          if(v.recommendIdSuper==currUser.id){
            return "间接下级";
          }
        }
      },
    }
}
</script>