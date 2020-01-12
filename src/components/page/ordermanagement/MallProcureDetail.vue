<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header">
        <span>采购单详情</span>
      </div>
      <p>订单号：T20190511152410 234241256</p>
      <div style="display:flex;height:200px;border:1px solid #eee;">
        <div
          style="width:400px;border-right:1px solid #eee;display:flex;flex-direction: column;justify-content:center"
        >
          <p style="font-size:25px;font-weight:700;padding-left:20px;">已完成</p>
          <p style="padding-left:20px;">订单已完成，结算金额在资产管理查看。</p>
        </div>
        <div style="display:flex;justify-content:center;align-items:center;flex:1;padding:0 50px;">
          <el-steps :active="3" style="width:100%;">
            <el-step title="采购单已生成" description="2017-07-19 15:43:23"></el-step>
            <el-step title="采购单等待付款" description="2017-07-19 15:43:23"></el-step>
            <el-step title="供应商发货" description="2017-07-19 15:43:23"></el-step>
            <el-step title="交易完成" description></el-step>
          </el-steps>
        </div>
      </div>
      <div style="background-color:#eee;margin-top:20px;display:flex;padding:20px;">
        <div style="flex:3;font-size:16px">
          <p style="font-weight:700">付款信息</p>
          <p>付款人:货多多供应商</p>
          <p>实付金额:20元</p>
          <p>付款方式:微信支付</p>
          <p>付款方式:付款时间 2019-10-25 19:23:55</p>
        </div>
        <div style="flex:5">
          <p style="font-weight:700">供应商信息</p>
          <p>供应商:乐多多</p>
        </div>
        <div style="flex:4">
          <p style="font-weight:700">买家信息</p>
          <p>买家:小龙女</p>
          <p>买家留言:</p>
          <p>发票:</p>
          <p>买家订单：E123124354364567</p>
        </div>
      </div>
      <p style="margin-top:20px;padding-left:20px">温馨提醒：</p>
      <p style="padding-left:20px">交易成功后，如果买家表示未收到货或者货物有问题，请及时联系买家积极处理，友好协商。</p>

      <el-table :data="testData" style="margin-top:15px" :header-cell-style="{background:'#eef1f6',color:'#606266'}" border stripe>
        <el-table-column label="商品" width="250">
            <template slot-scope="scope">
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
        <el-table-column label="分销零售价" width="150">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="分销优惠价" width="150">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="分销补差价" width="150">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="供货价" width="150">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="供货商品优惠" width="150">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="运费" width="150">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="供货运费" width="150">
         <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column label="付款时间">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.time}}</p>
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
              <p style="text-align:center">{{scope.row.state}}</p>
            </template>
        </el-table-column>
      </el-table>

      <div style="background-color:#eee;margin-top:20px;padding:40px 20px;">
        <p>分销零售价：分销商将商品推广给买家时，买家看到的商品原价；您可以理解为分销商给商品设置的建议零售价；</p>
        <p>分销优惠价：分销商给买家的优惠，包括每个商品的优惠和按比例到每个商品的订单优惠；</p>
        <p>供货价：供货商品在分销市场上的原价；</p>
        <p>运费：分销商给买家品设置的运费金额；</p>
        <p>供货运费：供货商给分销商品设置的运费金额；</p>
        <p>分销补差价：常见于分销商亏本销售商品。当分销商做活动让利给买家，导致买家实付金额小于供货商的定价，分销商需补足这部分差价；</p>
        <p>供货商品优惠：供货商给分销商的商品级别优惠，例如，分销商等级折扣；</p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "MallProcureDetail",
  data() {
    return {
        testData:[{
            goods:"牛奶",
            goodsinfo:"蓝莓味 500ml",
            price:500,
            time:"2019-05-11 15:24:10",
            state:"待退款"
        },{
            goods:"牛奶",
            goodsinfo:"蓝莓味 500ml",
            price:500,
            time:"2019-05-11 15:24:10",
            state:"待退款"
        }]
    };
  }
};
</script>
<style scoped>
</style>