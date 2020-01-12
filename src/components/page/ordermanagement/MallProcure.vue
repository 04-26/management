<template>
  <!-- 采购单-->
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header">
        <span>搜索条件</span>
      </div>
      <!-- card body -->
      <div>
        <div class="search-criteria">
          <p class="block">
            订单日期：
            <span
              style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;"
            >全部</span>
            <span style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;">今日</span>
            <span style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;">昨天</span>
            <span style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;">本周</span>
            <span style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;">本月</span>
            <el-date-picker
              v-model="value1"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:300px"
            ></el-date-picker>
          </p>
          <div style="display:flex;">
            <p style="display:flex;line-height:28px">
              订单编号：
              <el-input
                style="width:280px;margin-left:5px"
                type="text"
                autosize
                placeholder="请输入订单编号"
                v-model="keywords"
                size="mini"
              ></el-input>
              <el-button size="mini" type="primary">搜索</el-button>
            </p>
            <p style="display:flex;line-height:28px;margin-left:20px;">
              买家订单编号：
              <el-input
                style="width:280px;margin-left:5px"
                type="text"
                autosize
                placeholder="请输入买家订单编号"
                v-model="keywords"
                size="mini"
              ></el-input>
              <el-button size="mini" type="primary">搜索</el-button>
            </p>
          </div>
          <div style="display:flex;justify-content: space-between;margin-top:10px">
            <p>
              订单状态：
              <el-button type="primary" size="mini">全部</el-button>
            </p>
            <p>
              <span>采购单状态:&nbsp;&nbsp;&nbsp;</span>
              <el-select filterable v-model="id" placeholder="全部状态">
                <el-option label="全部状态" value="0"></el-option>
                <el-option label="待付款" value="1"></el-option>
                <el-option label="待供应商发货" value="2"></el-option>
                <el-option label="供应商已发货" value="3"></el-option>
                <el-option label="已完成" value="4"></el-option>
                <el-option label="已取消" value="10"></el-option>
              </el-select>
            </p>
            <p style="padding-left:80px">
              <el-button type="primary">导出</el-button>
              <el-button @click="newrouter()" type="primary">刷新</el-button>
            </p>
          </div>
        </div>
      </div>
      <h3>采购单详情</h3>
      <div>
        <el-table
          :data="testData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          border
          stripe
        >
          <el-table-column label="商品" width="300">
            <template slot-scope="scope">
              <p>
                订单编号:T20190511152410 234241256
                <el-link
                  type="warning"
                  @click="toProcuredetai(scope.$index,scope.row)"
                  style="padding-left:10px;"
                >查看</el-link>
              </p>
              <div style="display:flex;">
                <img
                  alt="#"
                  style="height:60px;width:60px;border-radius:50%;background-color:pink;"
                />
                <div style="padding-left:15px;">
                  <p>{{scope.row.goods}}</p>
                  <p>{{scope.row.goodsinfo}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="买家" width="200">
            <template slot-scope="scope">
              <p>供应商:货多多</p>
              <div style="display:flex;">
                <img
                  alt="#"
                  style="height:60px;width:60px;border-radius:50%;background-color:pink;"
                />
                <div style="padding-left:15px;">
                  <p>{{scope.row.user}}</p>
                  <p>{{scope.row.usertel}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="采购实付" width="100">
            <template slot-scope="scope">
              <p style="text-align:center">￥{{scope.row.paymoney}}</p>
            </template>
          </el-table-column>
          <el-table-column label="配送方式" width="100">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.sendmethods}}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <p style="padding-bottom:30px;">
                买家订单号：E123131234324324324
                <el-link
                  type="warning"
                  @click="toOrderdetail(scope.$index, scope.row)"
                  style="padding-left:10px;"
                >查看</el-link>
              </p>
              <p style="text-align:center;">{{scope.row.time}}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.state}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <div style="display:flex;justify-content:center;">
              <el-button type="info">订单详情</el-button>
              <el-button type="primary">备注</el-button>
            </div>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;text-align:center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 3, 5, 10, 30]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MallProcure",
  data() {
    return {
      id: "",
      keywords: "",
      value1: "",
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      testData: [
        {
          goods: "牛奶",
          goodsinfo: "蓝莓味 500ml",
          user: "小龙女",
          usertel: 12345678910,
          paymoney: 20.01,
          sendmethods: "物流配送",
          time: "2019.10.10",
          state: "待付款"
        },
        {
          goods: "牛奶",
          goodsinfo: "蓝莓味 500ml",
          user: "小龙女",
          usertel: 12345678910,
          paymoney: 20.01,
          sendmethods: "物流配送",
          time: "2019.10.10",
          state: "待付款"
        },
        {
          goods: "牛奶",
          goodsinfo: "蓝莓味 500ml",
          user: "小龙女",
          usertel: 12345678910,
          paymoney: 20.01,
          sendmethods: "物流配送",
          time: "2019.10.10",
          state: "待付款"
        }
      ]
    };
  },
  methods: {
    newrouter() {
      this.$router.go(0);
    },
    toOrderdetail(index, row) {
      this.$router.push({ path: "/orderdetail" });
    },
    toProcuredetai() {
      this.$router.push({ path: "/mallprocuredetail" });
    },
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
    }
  }
};
</script>

<style>
</style>