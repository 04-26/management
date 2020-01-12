<template>
  <div>
    <el-card shadow="never" class="box-card">
      <!-- <div slot="header">
        <el-row :gutter="20">
          <el-row :gutter="20" class="topcard">
            <el-col :span="6">
              <el-card shadow="never" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-1">
                  <i class="el-icon-lx-people grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div>订单数量（已完成）</div>
                    <div class="grid-num">{{paydata.orderNum}}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-2">
                  <i class="el-icon-lx-notice grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div>订单金额（已完成）</div>
                    <div class="grid-num">{{paydata.orderAmount}}元</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-3">
                  <i class="el-icon-lx-goods grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div>微信支付金额（已完成）</div>
                    <div class="grid-num">{{paydata.wxpayAmount}}元</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-3">
                  <i class="el-icon-lx-goods grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div>会员卡支付金额（已完成）</div>
                    <div class="grid-num">{{paydata.vipcardPayAmount}}元</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-row>
      </div>-->
      <div>
        <el-card shadow="never" class="box-card">
          <div>
            <div class="search-criteria">
              <p class="block">
                订单日期：
                <span
                  style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;"
                  @click="getorderdata(0)"
                >全部</span>
                <span
                  style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;"
                  @click="gettoday()"
                >今日</span>
                <!-- <span
                  style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;"
                  @click="getYesterday()"
                >昨天</span>
                <span
                  style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;"
                  @click="getCurrWeekDays()"
                >本周</span>-->
                <span
                  style="border:1px solid #ccc;padding:5px;margin-right:10px; cursor:pointer;"
                  @click="getCurrMonthDays()"
                >本月</span>
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getorderdata"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width:300px"
                ></el-date-picker>
              </p>
              <div style="display:flex;">
                <p style="width:50%;display:flex;line-height:28px">
                  订单编号：
                  <el-input
                    style="width:280px;margin-left:5px"
                    type="text"
                    autosize
                    placeholder="请输入订单编号"
                    v-model="keywords"
                    size="mini"
                  ></el-input>
                  <el-button size="mini" @click="getorderdata()" type="primary">搜索</el-button>
                </p>
              </div>
              <div style="display:flex;justify-content: space-between;margin-top:10px">
                <p>
                  订单状态：
                  <el-button
                    style="border:1px solid #ccc;padding:5px; cursor:pointer;"
                    @click="getorderdata(i)"
                    v-for="(os,i) in orderStatus"
                    :key="i"
                    plain
                  >{{os}}</el-button>
                  <el-button type="primary" size="mini" @click="toOpenOrder">开单</el-button>
                </p>
                <p>
                  <el-select
                    filterable
                    v-model="typeId"
                    placeholder="按服务类别查询"
                    @change="getorderdata(0)"
                  >
                    <el-option label="全部类型" value="0"></el-option>
                    <el-option label="服务订单" value="1"></el-option>
                    <el-option label="会员卡" value="2"></el-option>
                    <!-- <el-option label="商品订单" value="3"></el-option> -->
                    <el-option label="充值" value="4"></el-option>
                    <el-option label="打赏" value="10"></el-option>
                    <el-option label="面对面订单" value="20"></el-option>
                  </el-select>
                </p>
                <p style="padding-left:80px">
                  <el-button @click="exportOut" type="primary">导出</el-button>
                  <el-button @click="newrouter()" type="primary">刷新</el-button>
                </p>
              </div>
            </div>
            <div>
              <h3 style="padding-bottom:10px">订单列表</h3>
              <el-table
                v-loading="loading"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                :data="tableData"
                style="width: 100%"
                id="out-table"
              >
                <el-table-column label="商品" width="220">
                  <template slot-scope="scope">
                    <p>订单号:{{scope.row.orderno}}</p>
                    <div style="margin-left: 10px;display:flex;">
                      <img
                        style="width:60px;height:60px;border-radius:50%"
                        :src="scope.row.skuList[0].imgurl|avatar"
                        alt="#"
                      />
                      <div
                        style="display:flex;justify-content:center;align-content:center;flex-wrap:wrap;padding-left:10px"
                      >
                        <p style="width:100%">{{ scope.row.skuList[0].productName }}</p>
                        <p style="width:100%">
                          <span
                            v-if="scope.row.skuList[0].productName!='优惠买单' "
                          >￥{{ scope.row.skuList[0].price }}</span>
                          <span
                            v-if="scope.row.skuList[0].productName!='优惠买单' "
                          >x{{ scope.row.skuList[0].quantity }}</span>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="手艺人" width="100">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.userWorker.userName!=''"
                      style="margin-left: 10px"
                    >{{ scope.row.userWorker.userName }}</span>
                    <span
                      v-if="scope.row.userWorker.userName==undefined"
                      style="margin-left: 10px"
                    >--</span>
                  </template>
                </el-table-column>
                <el-table-column label="顾客信息" width="280">
                  <template slot-scope="scope">
                    <p
                      v-if="scope.row.bookTime!=undefined"
                    >预约到店时间：{{scope.row.bookTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
                    <div style="display:flex;">
                      <img
                        style="width:60px;height:60px;border-radius:50%"
                        :src="scope.row.userinfo.avatar|avatar"
                        alt
                      />
                      <div
                        style="display:flex;justify-content: center;align-content: center;flex-wrap: wrap;padding-left:10px"
                      >
                        <p style="width:100%">{{ scope.row.userinfo.nick }}</p>
                        <p style="width:100%">{{ scope.row.userinfo.telphone }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="实付金额（元）" width="120">
                  <template slot-scope="scope">
                    <p>{{ scope.row.payAmount }}</p>
                    <p v-if="scope.row.paymentId=='0'">到店支付</p>
                    <p v-if="scope.row.paymentId=='1'">微信支付</p>
                    <p v-if="scope.row.paymentId=='2'">钱包支付</p>
                    <p v-if="scope.row.paymentId=='3'">会员卡支付</p>
                    <p v-if="scope.row.paymentId=='4'">会员卡支付</p>
                  </template>
                </el-table-column>
                <el-table-column label="订单状态" width="150">
                  <template slot-scope="scope">
                    <div v-if="scope.row.kind!=3">
                      <p v-if="scope.row.orderStatus=='1'">待支付</p>
                      <p v-if="scope.row.orderStatus=='2'">已支付（待接单）</p>
                      <p v-if="scope.row.orderStatus=='3'">已预约</p>
                      <p v-if="scope.row.orderStatus=='4'">待服务</p>
                      <p v-if="scope.row.orderStatus=='5'">待支付（待结束）</p>
                      <p v-if="scope.row.orderStatus=='6'">服务完成（待评价）</p>
                      <p v-if="scope.row.orderStatus=='7'">申请退款</p>
                      <p v-if="scope.row.orderStatus=='8'">已完成</p>
                      <p v-if="scope.row.orderStatus=='-1'">订单取消</p>
                      <p v-if="scope.row.orderStatus=='-2'">订单取消</p>
                    </div>
                    <div v-if="scope.row.kind==3">
                      <p>{{scope.row.orderStatus|status}}</p>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <p style="padding-bottom:30px">下单时间：{{scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
                    <el-button type="info" size="mini" @click="orderdetail(scope.$index, scope.row)">订单详情</el-button>
                    <el-button type="success" size="mini" @click="getremark(scope.$index, scope.row)">备注</el-button>
                    <el-button v-if="scope.row.orderStatus=='1'||scope.row.orderStatus=='4'" size="mini" @click="handleEdit(scope.$index,scope.row)" type="danger">取消订单</el-button>
                    <el-button size="mini" type="success" @click="getmoney(scope.$index,scope.row)" v-if="scope.row.orderStatus=='5'">收款</el-button>
                    <el-button size="mini" type="warning" @click="opencancel(scope.$index,scope.row)" v-if="scope.row.orderStatus=='4'">消费编码</el-button>
                    <el-button type="primary" size="mini" v-if="scope.row.orderStatus=='4'" @click="fastOrder(scope.row)">快速核单</el-button>
                    <el-button type="warning" size="mini" v-if="scope.row.orderStatus=='7'" @click="cancelOrder(scope.row,2)">拒绝取消</el-button>
                    <el-button type="primary" size="mini" v-if="scope.row.orderStatus=='7'" @click="cancelOrder(scope.row,1)">同意取消</el-button>
                    <el-button type="danger" size="mini" @click="setMail(scope.row)" v-if="scope.kind==3 && scope.row.orderStatus=='4'">修改物流</el-button>
                    <el-button type="primary" size="mini" @click="sendGoods(scope.row)" v-if="scope.kind==3 && scope.row.orderStatus>2 && scope.row.orderStatus<6 ">发货</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
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
          </div>
        </el-card>
      </div>
    </el-card>
    <!-- 订单备注 -->
    <el-dialog title="订单备注" :visible.sync="dialogFormVisible" width="450px">
      <el-form ref="remarkForm" :model="remarkForm">
        <el-input
          show-word-limit
          maxlength="200"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="remarkForm.remark"
          autocomplete="off"
        ></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="remarksave">保存</el-button>
      </div>
    </el-dialog>
    <!-- 消费编码 -->
    <el-dialog title="请输入消费编码：" :visible.sync="dialogFormVisible1" width="450px">
      <el-input v-model="usecode" autocomplete="off"></el-input>
      <div style="color:#ee5002;font-size:14px;">下单的客户到店服务时，让他把消费码告诉你，输入消费码，进行核销,核销后开始服务。</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
    <!-- 发货 -->
    <el-dialog title="提示" :visible.sync="dialogFormVisible2" width="450px">
      <div style="color:#ee5002;font-size:16px;margin-bottom:10px;">为了更好的服务，必须设置退货信息后才可以继续发货！</div>
      <span style="paddingleft:50px">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
      <el-input
        style="margin:10px 0;width:300px;"
        v-model="username"
        placeholder="请输入姓名"
        autocomplete="off"
        width="300px"
      ></el-input>
      <div>
        <span>联系电话：</span>
        <el-input
          style="margin:10px 0;width:300px"
          v-model="usertel"
          placeholder="请输入联系电话"
          autocomplete="off"
        ></el-input>
      </div>
      <div style="margin-bottom:10px;">
        <span>联系地址：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="margin:10px 0;width:300px"
          ></el-option>
        </el-select>
      </div>
      <span>详细地址：</span>
      <el-input
        style="margin:10px 0;width:300px"
        placeholder="请输入详细的街道门牌号"
        v-model="useraddress"
        autocomplete="off"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!-- 发货详情 -->
    <el-dialog title="订单发货" :visible.sync="dialogFormVisible3" width="1000px">
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="testData"
        style="width: 100%"
      >
        <el-table-column label="商品" width="300">
          <template slot-scope="scope">
            <div style="margin-left: 10px;display:flex;">
              <img style="width:40px;height:40px;border-radius:50%" alt="#" />
              <div
                style="display:flex;justify-content:center;align-content:center;flex-wrap:wrap;padding-left:10px;height:60px;"
              >
                <p style="width:100%">{{scope.row.goodsname}}</p>
                <p style="width:100%">
                  <span>{{scope.row.goodsinfo}}</span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="180">
          <template slot-scope="scope">
            <p>x {{scope.row.count}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="300">
          <template slot-scope="scope">
            <p>{{scope.row.state}}</p>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" center></el-table-column>
      </el-table>
      <div style="display:flex;height:50px;color:#606266;font-weight:700;">
        <div style="width:80px;">配送信息:</div>
        <div style="flex:1">
          <p style="margin-top:5px;">方式：快递</p>
          <p style="margin-top:5px;">收货人：小龙女</p>
          <p style="margin-top:5px;">收货地址：重庆市渝中区朗俊中心4-3</p>
        </div>
      </div>
      <el-form style="margin-top:50px;" label-width="80px" label-position="left">
        <el-form-item label="发货方式">
          <el-radio-group style="margin-top:8px;" v-model="radio">
            <el-radio label="自己联系快递"></el-radio>
            <el-radio label="无需物流"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-select v-model="select" placeholder="请选择快递公司">
            <el-option
              v-for="item in testoption"
              :key="item.value"
              :label="item.label"
              :value="item.testvalue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input style="width:300px;" v-model="ordernum" placeholder="请输入快递单号"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary">发货</el-button>
      </div>
    </el-dialog>
    <!-- 修改物流 -->
    <el-dialog
      style="text-align:center;"
      title="修改物流"
      :visible.sync="dialogFormVisible4"
      width="20%"
    >
      <div style="text-align:center;color:#F56C6C;font-size:16px;">仅可更改一次请认真填写！</div>
      <p style="text-align:left;margin-top:10px;fiont-weight:700;">物流信息</p>
      <el-form ref="form" width="300" label-width="90px" label-position="left">
        <el-form-item label="快递公司：">
          <el-select v-model="select" style="width:100%;" placeholder="请选择快递公司">
            <el-option
              v-for="item in testoption"
              :key="item.testvalue"
              :label="item.label"
              :value="item.testvalue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号:">
          <el-input v-model="ordernum" placeholder="请输入快递单号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="dialogFormVisible4=false">取消</el-button>
        <el-button size="mini" @click="innerVsible=true" type="primary">保存</el-button>
      </span>
      <!-- 内部确定弹窗 -->
      <el-dialog style="margin-top:100px;" title="确认修改信息" :visible.sync="innerVsible" width="50%">
        <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" style="width:100%;">
          <el-table-column label="商品数量" width="100">
            <template>
              <p>x1</p>
            </template>
          </el-table-column>
          <el-table-column label="发货方式" prop="数量"></el-table-column>
          <el-table-column label="物流公司"></el-table-column>
          <el-table-column label="快递单号" width="300"></el-table-column>
        </el-table>
        <span slot="footer">
          <el-button @click="innerVsible=false">返回修改</el-button>
          <el-button type="primary">确认修改</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import getDate from "./getData";
import { log } from 'util';
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "重庆"
        },
        {
          value: "2",
          label: "上海"
        },
        {
          value: "3",
          label: "广东"
        },
        {
          value: "4",
          label: "深圳"
        },
        {
          value: "5",
          label: "北京"
        }
      ],
      testoption: [
        {
          testvalue: "1",
          label: "顺丰快递"
        },
        {
          testvalue: "2",
          label: "圆通快递"
        },
        {
          testvalue: "3",
          label: "申通快递"
        },
        {
          testvalue: "4",
          label: "韵达快递"
        }
      ],
      testvalue: "",
      select: "",
      radio: "",
      testData: [
        {
          goodsname: "商品名称",
          goodsinfo: "蓝莓味 500ml",
          count: 1,
          state: "待发货"
        },
        {
          goodsname: "商品名称",
          goodsinfo: "蓝莓味 500ml",
          count: 1,
          state: "待发货"
        },
        {
          goodsname: "商品名称",
          goodsinfo: "蓝莓味 500ml",
          count: 1,
          state: "待发货"
        },
        {
          goodsname: "商品名称",
          goodsinfo: "蓝莓味 500ml",
          count: 1,
          state: "待发货"
        }
      ],
      value: "",
      ordernum: "",
      orderStatus: ["全部", "已取消", "待使用", "已完成",'取消待审核'], //订单状态
      orderData: ["全部", "昨天", "今天", "本周", "本月", "本季度", "本年"], //订单日期
      tableData: [],
      oldtableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      timevalue: [],
      value1: "",
      value2: "",
      value3: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      innerVsible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      remarkForm: {
        remark: ""
      },
      remarkmangage: "",
      storetype: "",
      keywords: "",
      visible: false,
      usecode: "",
      usecodemsg: "",
      value1: [],
      avnum: true,
      imgnum: 0,
      paydata: {},
      typeId: "",
      oldadta: [],
      inum: "",
      loading: false,
      username: "",
      usertel: "",
      useraddress: ""
    };
  },
  methods: {
    fastOrder(item) {
      this.$confirm(
        "确定快速核销【" +
          item.orderno +
          "】, 是否继续?   在明确下单人到达店铺的时候使用此功能。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.req
          .post("/order/fastuseservice", { orderno: item.orderno })
          .then(res => {
            if (res.data.code == "SUCCESS" && res.data.sub_code == "SUCCESS") {
              this.$message.success("核销成功");
              this.getorderdata();
            } else {
              this.$message.error(res.data.sub_msg);
            }
          });
      });
    },
    toOpenOrder() {
      this.$router.push({ path: "/openorder" });
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.$confirm("确定取消当前订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            orderNo: row.orderno
          };
          this.req
            .post("/order/cancelorder", params)
            .then(res => {
              if (res.data.sub_code == "SUCCESS") {
                this.getorderdata();
              } else {
              }
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "订单取消成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getmoney(index, row) {
      console.log(index, row);
      let params = {
        orderno: row.orderno,
        amount: row.payAmount
      };
      this.req
        .post("/order/payorder", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getorderdata(i, flg) {
      if (i == 0) {
        this.timevalue = [];
      }
      this.inum = i;
      let params = {};
      if (i == undefined) {
        if (this.keywords == "") {
          params = {
            pageNo: this.currentPage,
            pageSize: this.pageSize,
            type: this.typeId,
            storetype: i,
            flag: flg
            // keyword: this.keywords
          };
        } else {
          params = {
            pageSize: this.pageSize,
            keyword: this.keywords,
            flag: flg
          };
        }
      } else if (this.value1 != "") {
        params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          starttime: this.$moment(this.value1[0]).format("YYYY-MM-DD"),
          endtime: this.$moment(this.value1[1]).format("YYYY-MM-DD"),
          flag: flg
        };
      } else {
        params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          storetype: i,
          type: this.typeId,
          flag: flg
        };
        this.tableData = [];
      }
      if (this.timevalue.length != 0) {
        params.starttime = this.$moment(this.timevalue[1]).format("YYYY-MM-DD");
        params.endtime = this.$moment(this.timevalue[0]).format("YYYY-MM-DD");
      }
      if (this.typeId != 0) {
        params.kind = this.typeId;
        if(params.kind==3){
          params.sorderkind = 3
        }
      }
      this.loading = true;
      // debugger;
      this.req
        .post("/order/list", params)
        .then(res => {
          this.loading = false;
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          this.tableData.map(v => {
            if (v.userWorker == undefined) {
              return (v.userWorker = "");
            }
          });
          this.tableData.map(v => {
            if (v.userinfo.avatar == undefined) {
              v.userinfo.avatar = "";
            }
          });
          console.log(this.tableData);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getorderdata(this.inum); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getorderdata(this.inum); // 调用分页函数
    },

    //消费编码
    opencancel(index, row) {
      this.dialogFormVisible1 = true;
      this.usecodemsg = row;
    },
    cancel() {
      let params = {
        orderno: this.usecodemsg.orderno,
        usecode: this.usecode
      };
      this.req
        .post("/order/useservice", params)
        .then(res => {
          console.log(res);
          this.visible = false;
          if (res.data.sub_code == "SUCCESS") {
            this.$message({
              type: "success",
              message: "消费编码成功"
            });

            this.dialogFormVisible1 = false;
            this.getorderdata();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getremark(index, row) {
      this.remarkmangage = row;
      this.remarkForm.remark = row.remark;
      this.dialogFormVisible = true;
      console.log(row);
    },
    remarksave() {
      let params = {
        orderNo: this.remarkmangage.orderno,
        remark: this.remarkForm.remark
      };
      this.req
        .post("/order/remark", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.$message({
              type: "success",
              message: "备注成功"
            });
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //订单详情
    orderdetail(index, row) {
      if(localStorage.getItem('detailnumber')){
        localStorage.removeItem('detailnumber');
      }
      localStorage.setItem("detailnumber", row.orderno);
      if(row.kind==3){
        this.$router.push({path:'/mallorderdetail'});
      }else{
        this.$router.push({ path: "/orderdetail" });
      }
    },

    //定义导出Excel表格事件
    async activeExportOut() {
      // this.ableExportOut = true //设置可以下载
      this.oldadta = this.tableData; //保存起就数据
      await this.getorderdata("", false);
      this.exportOut();
    },
    sendGoods() {
      this.dialogFormVisible2 = !this.dialogFormVisible2;
    },
    setMail(){
      this.dialogFormVisible4 = !this.dialogFormVisible4
      
    },
    exportOut() {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "订单列表.xlsx"
        );
      } catch (e) {
        this.$message.error(error.getMessage());
      }
      // this.tableData = this.oldadta; //回复原来说的数据
      return wbout;
    },

    // 今日
    gettoday() {
      this.timevalue = [];
      this.timevalue[0] = this.$moment(getDate.getToday().endtime).format(
        "YYYY-MM-DD"
      );
      this.timevalue[1] = this.$moment(getDate.getToday().starttime).format(
        "YYYY-MM-DD"
      );
      console.log(this.value1);
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        starttime: this.timevalue[1],
        endtime: this.timevalue[0]
      };

      console.log(params);
      this.loading = true;
      // debugger;
      this.req
        .post("/order/list", params)
        .then(res => {
          this.loading = false;
          if (res.data.sub_code == "SUCCESS") {
            this.tableData = res.data.data.resultList;
            this.total = res.data.data.totalCount;
            this.tableData.map(v => {
              if (v.userWorker == undefined) {
                return (v.userWorker = "");
              }
            });
            this.tableData.map(v => {
              if (v.userinfo.avatar == undefined) {
                return (v.userinfo.avatar = "");
              }
            });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //昨日
    getYesterday() {
      this.timevalue = [];
      this.timevalue = this.timevalue.concat(getDate.getYesterday().endtime);
      this.timevalue = this.timevalue.concat(getDate.getYesterday().starttime);
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        starttime: this.timevalue[1],
        endtime: this.timevalue[0]
      };

      console.log(params);

      // debugger;
      this.req
        .post("/order/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          this.tableData.map(v => {
            if (v.userWorker == undefined) {
              return (v.userWorker = "");
            }
          });
          this.tableData.map(v => {
            if (v.userinfo.avatar == undefined) {
              return (v.userinfo.avatar = "");
            }
          });
          console.log(this.tableData);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 本周
    getCurrWeekDays() {
      this.timevalue = [];
      this.timevalue = this.timevalue.concat(getDate.getCurrWeekDays().endtime);
      this.timevalue = this.timevalue.concat(
        getDate.getCurrWeekDays().starttime
      );
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        starttime: this.timevalue[1],
        endtime: this.timevalue[0]
      };

      console.log(params);

      // debugger;
      this.req
        .post("/order/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          this.tableData.map(v => {
            if (v.userWorker == undefined) {
              return (v.userWorker = "");
            }
          });
          this.tableData.map(v => {
            if (v.userinfo.avatar == undefined) {
              return (v.userinfo.avatar = "");
            }
          });
          console.log(this.tableData);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //本月
    getCurrMonthDays() {
      this.timevalue = [];
      this.timevalue = this.timevalue.concat(
        getDate.getCurrMonthDays().endtime
      );
      this.timevalue = this.timevalue.concat(
        getDate.getCurrMonthDays().starttime
      );
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        starttime: this.$moment(this.timevalue[1]).format("YYYY-MM-DD"),
        endtime: this.$moment(this.timevalue[0]).format("YYYY-MM-DD")
      };

      this.loading = true;
      // debugger;
      this.req
        .post("/order/list", params)
        .then(res => {
          this.loading = false;
          if (res.data.sub_code == "SUCCESS") {
            this.tableData = res.data.data.resultList;
            this.total = res.data.data.totalCount;
            this.tableData.map(v => {
              if (v.userWorker == undefined) {
                return (v.userWorker = "");
              }
            });
            this.tableData.map(v => {
              if (v.userinfo == undefined) {
                return (v.userinfo = "");
              }
            });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getpaydata() {
      this.req
        .post("/order/ordertotalcount")
        .then(res => {
          console.log(res);
          this.paydata = res.data.data;
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    newrouter() {
      this.$router.go(0);
    },
    cancelOrder(item,status){
      // /order/confirmrefundorder
      if(status==1){
        var title = '确定同意用户取消订单吗？';
        var ctn = '同意后，资金原路返还给用户';
      }else{
        var title = '确定拒绝用户取消订单吗？';
        var ctn = '拒绝后，订单成待服务状态，用户可正常到店使用';
      }
      this.$confirm(ctn, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          var params = {orderNo:item.orderno,note:'',octype:status};
          this.req.post('/order/confirmrefundorder',params).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.$message.success('操作成功');
              this.getorderdata();
            }else{
              this.$message.error(res.data.sub_msg);
            }
          })
      })

    }
  },
  // formatter(value, item, row, prop) {
  //   //针对table中item多层对象层级的情况
  //   if (prop.indexOf(".") > 0) {
  //     let temp = prop.split(".");
  //     //item中嵌套两层
  //     if (temp.length == 2) {
  //       let temp = prop.split(".");
  //       if (item.formatterType == "common-type") {
  //         //通用类型转换
  //         let arry = item.formatterInfo;
  //         for (let i in arry) {
  //           if (arry[i].value == row[temp[0]][temp[1]]) {
  //             return arry[i].label;
  //           }
  //         }
  //       } else if (item.formatterType == "time-type") {
  //         //时间标准格式化
  //         if (!global.isNull(row[temp[0]][temp[1]])) {
  //           return row[temp[0]][temp[1]].substring(
  //             0,
  //             row[temp[0]][temp[1]].length - 2
  //           );
  //         }
  //       } else if (item.formatterType == "amount-type") {
  //         //金额转换
  //         return (row[temp[0]][temp[1]] / 100).toFixed(2);
  //       }
  //     }
  //   } else {
  //     //item中无嵌套对象
  //     let temp = prop.split(".");
  //     if (item.formatterType == "common-type") {
  //       //通用类型转换
  //       let arry = item.formatterInfo;
  //       for (let i in arry) {
  //         if (arry[i].value == value) {
  //           return arry[i].label;
  //         }
  //       }
  //     } else if (item.formatterType == "time-type") {
  //       //时间标准格式化
  //       if (!global.isNull(row[temp[0]][temp[1]])) {
  //         return value.substring(0, value.length - 2);
  //       }
  //     } else if (item.formatterType == "amount-type") {
  //       //金额转换
  //       return (value / 100).toFixed(2);
  //     }
  //   }
  // },
  created() {
    this.getorderdata();
    this.getpaydata();
  },
  filters:{
      status(val){
        // 1-待支付，2-已支付（待接单）（待发货-商品订单）3-已预约（待发货-商品订单），4-已确认（待服务）（待发货-商品订单），
        // 5-服务中（待结束）（待收货-商品订单），6-服务完成（待评价）（已收货-商品订单），7-申请退款，8- 已完成-1 -订单取消 -2-订单取消
        if(val==-1 || val==-2){
          return '订单已取消';
        }
        if(val==1){
          return '待支付';
        }
        if(val==2){
          return '待发货';
        }
        if(val==3){
          return '待发货';
        }
        if(val==4){
          return '待发货';
        }
        if(val==5){
          return '待收货';
        }
        if(val==6){
          return '已收货';
        }
        if(val==7){
          return '申请退款';
        }
        if(val==8){
          return '已完成';
        }
        if(val==10){
          return '已完成';
        }
      },
  }
};
</script>

<style scoped>
.card-top {
  display: flex;
  justify-content: space-between;
}
.search-criteria {
  font-size: 14px;
}
.search-criteria > p {
  line-height: 40px;
}
.search-criteria > p > span {
  padding: 5px 10px;
  margin: 5px;
  border: 1px solid #cfcdcd;
  cursor: pointer;
}
.topcard {
  display: flex;
  justify-content: space-around;
}
.el-row {
  margin-bottom: 20px;
}
.function-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.function-span {
  display: inline-block;
  width: 25%;
  line-height: 80px;
  text-align: center;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>