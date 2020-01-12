<template>
    <div>
        <el-table v-loading="loading"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column :label="clmName" width="220">
              <template slot-scope="scope" >
                <img :src="scope.row.skuList[0].imgurl|avatar" style="width:45px;height:45px;">
                <div style="display:inline-block;vertical-align:middle;padding-left:5px;">
                  <div>{{scope.row.skuList[0].productName}}</div>
                  <div>{{scope.row.orderno }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="clmTime" width="220">
              <template slot-scope="scope">
                <span>{{ scope.row.receptTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实际支付(元)">
              <template slot-scope="scope">
                <span>{{ scope.row.payAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="推广提成(元)">
              <template slot-scope="scope">
                <span>{{ scope.row|money(currUser) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="下级">
              <template slot-scope="scope">
                <div>{{ scope.row.recommends.parentName }}</div>
                <div>{{ scope.row.recommends.parentTel }}</div>
              </template>
            </el-table-column>
            <el-table-column label="下级类型">
              <template slot-scope="scope">
                <span>{{ scope.row|level(currUser) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结算时间">
              <template slot-scope="scope">
                <span>{{ scope.row.dispatchTime|dateformat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结算状态">
              <template slot-scope="scope">
                <span>{{ scope.row.commission|commission }}</span>
              </template>
            </el-table-column>
          </el-table>
    </div>
</template>
<script>
export default {
    name:'PromoterOrderItem',
    props:{
        tableData:{type:Array,default:[]},
        clmName:{type:String,default:'商品/订单编号'},
        clmTime:{type:String,default:'订单完成时间'},
        loading:{type:Boolean,default:false},
        currUser:{type:Object,default:{}}
    },
    data(){
        return {

        }
    },
    filters:{
      money(v,currUser){
        if(v && currUser){
          if(v.recommendid==currUser.id){
            return v.benefitAmount;
          }
          if(v.superrecomid==currUser.id){
            return v.benefit2Amount;
          }
        }
      },
      level(v,currUser){
        if(v && currUser){
          if(v.recommendid==currUser.id){
            return "直接下级";
          }
          if(v.superrecomid==currUser.id){
            return "间接下级";
          }
        }
      },
      commission(v){
        if(v){
          if(v==1){
            return "已结算";
          }
          if(v==0){
            return "未结算";
          }
        }
      }
    }
}
</script>