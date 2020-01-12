<template>
  <div>
    <el-card  shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资产管理/充值账单明细</span>
      </div>
      <div>
     
        <el-card  shadow="never" class="box-card">
          <div>
              <div>
                  <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                  <el-button type="primary">导出账单</el-button>

                </div>
                <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="tableData" style="width: 100%">
                  <el-table-column label="时间">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="业务单号 | 支付流水号">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="账户">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="金额 （元）">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="账户余额（元）">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                </el-table>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
      value1: "",
      value2: "",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  }
};
</script>
<style scoped>

</style>
