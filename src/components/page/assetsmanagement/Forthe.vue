<template>
  <div>
    <el-card  shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>资产管理/待结算</span>
      </div>
      <div>
        <div class="assets-top">
          <div>
            <p>待结算</p>
            <p>10000.45</p>
            <p>顾客已付款，但交易未完成的订单金额之和</p>
          </div>
          <div>
            <p>拼团</p>
            <p>10000.45</p>
            <p>顾客已参加拼团，但未拼团成功的订单金额之和</p>
          </div>
        </div>
        <el-card  shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>提现记录</span>
          </div>
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="服务订单" name="first">
                <div>
                  <el-input type="text" style="width:200px" placeholder="会员名、手机号、"></el-input>
                  <el-button type="primary">搜索</el-button>
                  <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>
                <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="tableData" style="width: 100%">
                  <el-table-column label="商品名称">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="技师">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="用户名称">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="实付金额">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="拼团订单" name="second">充值</el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </div>
    </el-card>
    <el-dialog title="你还未认证" :visible.sync="centerDialogVisible" width="30%" center>
      <span>为了保证资金安全，请先通过店铺认证。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">立即认证</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
      value1: "",
      value2: "",
      centerDialogVisible: false
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
.assets-top {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}
</style>
