<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/砍价</span>
      </div>
      <div>
        <!-- 上半部分 -->
        <el-row>
          <el-col class="bookingtop-left" :span="6">
            <p>砍价使用介绍：</p>
            <p class="left-p2">
              <el-popover title="活动规则" placement="right" width="400" trigger="click">
                <div>
                  <p>1.发起砍价和帮好友砍价前顾客需要先登录</p>
                  <p>2.发起砍价后可微信分享活动给好友帮砍，好友也可自己发起砍价</p>
                  <p>3.本活动不能与其他优惠同享。</p>
                  <p>4.活动最终解释权归商家所有。</p>
                </div>
                <el-button slot="reference">规则说明</el-button>
              </el-popover>
              <span>使用教程</span>
              <span>活动案例</span>
            </p>
            <p>
              <router-link to="/addbargainirg" class="btn btn-success">新建砍价活动</router-link>
            </p>
          </el-col>
        </el-row>
        <!-- 下半部分 -->

        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="砍价列表" name="first">
            <div>
              <div class="booking-bottom">
                <p class="bottom-item">
                  <span @click="getbargainirg(0)" class="bordernone">全部</span>
                  <span @click="getbargainirg(1)" class="bordernone">未开始</span>
                  <span @click="getbargainirg(2)" class="bordernone">进行中</span>
                  <span style="cursor: pointer;" @click="getbargainirg(3)">已结束</span>
                </p>
                <p>
                  <el-input style="width:150px" type="text" v-model="keyword" placeholder="请输入活动名称"></el-input>
                  <el-button type="primary" @click="getbargainirg('')">搜索</el-button>
                </p>
              </div>
              <el-table
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column label="活动名称" width="120px">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="活动时间" width="300px">
                  <template slot-scope="scope">
                    <span
                      style="margin-left: 10px"
                    >{{ scope.row.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>至
                    <span
                      style="margin-left: 10px"
                    >{{ scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="活动状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status=='1'" style="margin-left: 10px">未开始</span>
                    <span v-if="scope.row.status=='2'" style="margin-left: 10px">进行中</span>
                    <span v-if="scope.row.status=='3'" style="margin-left: 10px">已结束</span>
                  </template>
                </el-table-column>
                <el-table-column label="砍价发起人数">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.xStoreactionStatic.launchs }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="帮砍人数（真实数据）">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.xStoreactionStatic.participants }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="砍价成功人数">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.xStoreactionStatic.turnover }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="450">
                  <template slot-scope="scope">
                    <el-button
                      type="success"
                      size="mini"
                      @click="handleorder(scope.$index, scope.row)"
                    >查看订单</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      v-if="scope.row.status=='2'"
                      @click="handleend(scope.$index, scope.row)"
                    >立即结束</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button>
                    <el-button
                      type="info"
                      size="mini"
                      @click="servicedetails(scope.$index, scope.row)"
                    >详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div style="margin-top: 20px;text-align:center">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[1, 3, 5, 8,10, 30]"
                  :page-size="8"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="砍价订单列表" name="second">
            <div style="display:flex;">
              <p style="width:50%;display:flex">
                订单编号：
                <el-input
                  style="width:280px;"
                  type="text"
                  autosize
                  placeholder="请输入电话、订单编号"
                  v-model="keywords"
                ></el-input>
                <el-button @click="getgroupbooking()" type="primary">搜索</el-button>
              </p>
            </div>
            <el-table
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="tableDae"
              style="width: 100%"
            >
              <el-table-column label="商品" width="180">
                <template slot-scope="scope">
                  <div style="margin-left: 10px;display:flex;align-items: center;">
                    <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="$imgurl()+scope.row.skuList[0].imgurl"
                      alt="#"
                    />
                    <div
                      style="display:flex;justify-content: center;align-content: center;flex-wrap: wrap;padding-left:10px"
                    >
                      <p style="width:100%">{{ scope.row.skuList[0].productName }}</p>
                      <p style="width:100%">
                        <span>￥{{ scope.row.skuList[0].price }}</span>
                        <span>x{{ scope.row.skuList[0].quantity }}</span>
                      </p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="290px" label="顾客信息">
                <template slot-scope="scope">
                  <div>
                    <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="scope.row.userinfo.avatar|avatar"
                      alt="#"
                    />
                    <span style="margin-left: 10px;line-height:50px">{{ scope.row.userinfo.nick }}</span>
                    <span
                      style="margin-left: 10px;line-height:50px"
                    >{{ scope.row.userinfo.telphone }}</span>
                  </div>
                  <!-- <p
                    style="padding-left:20px"
                  >发起砍价时间：{{scope.row.startTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>-->
                </template>
              </el-table-column>
              <el-table-column width="250" label="订单编号">
                <template slot-scope="scope">
                  <p style="margin-left: 10px;line-height:71px">{{ scope.row.orderno}}</p>
                  <!-- <p>结束时间：{{scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p> -->
                </template>
              </el-table-column>
              <el-table-column label="下单时间">
                <template slot-scope="scope">
                  <p
                    style="margin-left: 10px;line-height:71px"
                  >{{ scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
                </template>
              </el-table-column>

              <!-- <el-table-column label="砍后金额（元 ) ">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.payPrice }}</span>
                </template>
              </el-table-column>-->
              <el-table-column label="实付金额（元）" width="150">
                <template slot-scope="scope">
                  <p v-if="scope.row.orderStatus==2">{{scope.row.payAmount}}</p>
                  <p v-if="scope.row.orderStatus==6">{{scope.row.payAmount}}</p>
                  <p v-if="scope.row.orderStatus==8">{{scope.row.payAmount}}</p>
                  <p v-if="scope.row.orderStatus==4">{{scope.row.payAmount}}</p>
                  <p
                    v-if="scope.row.paymentId=='0'&&scope.row.orderStatus==2&&scope.row.orderStatus==6&&scope.row.orderStatus==8&&scope.row.orderStatus==4"
                  >到店支付</p>
                  <p
                    v-if="scope.row.paymentId=='1'&&scope.row.orderStatus==2&&scope.row.orderStatus==6&&scope.row.orderStatus==8&&scope.row.orderStatus==4"
                  >微信支付</p>
                  <p
                    v-if="scope.row.paymentId=='2'&&scope.row.orderStatus==2&&scope.row.orderStatus==6&&scope.row.orderStatus==8&&scope.row.orderStatus==4"
                  >钱包支付</p>
                  <p
                    v-if="scope.row.paymentId=='3'&&scope.row.orderStatus==2&&scope.row.orderStatus==6&&scope.row.orderStatus==8&&scope.row.orderStatus==4"
                  >会员卡支付</p>
                  <p
                    v-if="scope.row.paymentId=='4'&&scope.row.orderStatus==2&&scope.row.orderStatus==6&&scope.row.orderStatus==8&&scope.row.orderStatus==4"
                  >会员卡支付</p>
                </template>
              </el-table-column>
              <el-table-column label="订单状态" width="150">
                <template slot-scope="scope">
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
                </template>
              </el-table-column>
              <el-table-column width="400px" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="info"
                    size="mini"
                    @click="orderdetail(scope.$index, scope.row)"
                  >订单详情</el-button>
                  <el-button
                    type="success"
                    size="mini"
                    @click="getremark(scope.$index, scope.row)"
                  >备注</el-button>
                  <el-button
                    v-if="scope.row.orderStatus=='1'||scope.row.orderStatus=='4'"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                    type="danger"
                  >取消订单</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    @click="getmoney(scope.$index, scope.row)"
                    v-if="scope.row.orderStatus=='5'"
                  >收款</el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="opencancel(scope.$index, scope.row)"
                    v-if="scope.row.orderStatus=='4'"
                  >消费编码</el-button>
                  <!-- <p v-if="scope.row.status=='0'">上线</p> -->
                  <p v-if="scope.row.status=='1'">已下单</p>
                  <p v-if="scope.row.status=='2'">已支付</p>
                  <p v-if="scope.row.status=='3'">已失效</p>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="margin-top: 20px;text-align:center">
              <el-pagination
                @size-change="handleSize"
                @current-change="handleCurrent"
                :current-page="currentPage1"
                :page-sizes="[1, 3, 5, 10, 30]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1"
              ></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品砍价订单列表" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog id="eidt" title="砍价活动编辑" width="70%" :visible.sync="dialogFormVisible">
      <el-form :model="eidtform">
        <el-form-item label="活动名称：" :label-width="formLabelWidth">
          <el-input v-model="eidtform.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动结束时间：" :label-width="formLabelWidth">
          <el-date-picker v-model="eidtform.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="已参与砍价数量：" :label-width="formLabelWidth">
          <el-input v-model="eidtform.num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="走马灯设置：" :label-width="formLabelWidth">
          <el-checkbox-group v-model="eidtform.horseSet">
            <el-checkbox :label="1">开启走马灯</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发起砍价次数：" prop="everyCount">
          <el-input style="width:200px" v-model="eidtform.everyCount" placeholder="请填写2-100的整数"></el-input>
        </el-form-item>
        <el-form-item label="活动规则" :label-width="formLabelWidth">
          <el-input
            show-word-limit
            maxlength="200"
            type="textarea"
            :rows="4"
            v-model="eidtform.extinfo.actRules"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动介绍：" :label-width="formLabelWidth">
          <tinymce-editor ref="editor" v-model="msg"></tinymce-editor>
        </el-form-item>
        <el-form-item label="温馨提示" :label-width="formLabelWidth">
          <el-input
            show-word-limit
            maxlength="200"
            type="textarea"
            :rows="4"
            v-model="eidtform.extinfo.actWarm"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单备注" :visible.sync="dialogFormVisible11">
      <el-form ref="remarkForm" :model="remarkForm">
        <el-input
          maxlength="100"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="remarkForm.remark"
          autocomplete="off"
        ></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible11 = false">取 消</el-button>
        <el-button type="primary" @click="remarksave">保存</el-button>
      </div>
    </el-dialog>
    <!-- 消费编码 -->
    <el-dialog title="请输入消费编码：" :visible.sync="dialogFormVisible1">
      <el-input v-model="usecode" autocomplete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 砍价详情 -->
    <el-dialog title="砍价活动信息" :visible.sync="centerDialogVisible" width="60%">
      <div style="padding-left:20px;padding-right:20px">
        <p>
          <span class="span-title">活动名称：</span>
          {{serviced.title}}
        </p>
        <p>
          <span class="span-title">活动时间：</span>
          {{serviced.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}至 {{serviced.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}
        </p>
        <p>
          <span class="span-title">选择项目：</span>
          {{serviced.itemtitle}}
        </p>
        <p>
          <span class="span-title">砍价有效期：</span>
          {{serviced.bargainExp}}小时
        </p>
        <p>
          <span class="span-title">砍价商品库存：</span>
          {{serviced.productStock}}
        </p>
        <p>
          <span class="span-title">砍价最低价：</span>
          {{serviced.lowPrice}}元
        </p>
        <p>
          <!-- <span class="span-title">成团价格：</span> -->
          <!-- {{serviced.type.title}} -->
        </p>
        <p>
          <span class="span-title">帮砍金额：</span>
          <span v-if="serviced.priceType=='1'">随机</span>
          <span v-if="serviced.priceType=='2'">{{serviced.maxPrice}}元</span>
        </p>
        <p>
          <span class="span-title">帮砍人数：</span>
          {{serviced.helpNum}}
        </p>
        <p>
          <span class="span-title">已参与砍价人数：</span>
          {{serviced.num}}
        </p>
        <div style="display:flex;">
          <p class="span-title">走马灯设置：</p>
          <span v-if="serviced.horseSet=='0'">走马灯未开启</span>
          <span v-if="serviced.horseSet=='1'">走马灯已开启</span>
          <!-- <img style="with:100px;height:100px" :src="`/img/${serviced.imageUrl}`" alt="#" />sssssssssssssssssssssssss-->
        </div>

        <p>
          <span class="span-title">发起砍价次数：</span>
          {{serviced.everyCount}}
        </p>
        <p>
          <span class="span-title">帮砍次数：</span>
          {{serviced.everyHelp}}
        </p>
        <p style="margin-top:20px">
          <span class="span-title">活动规则：</span>
          {{serviced.extinfo.actRules}}
        </p>
        <div>
          <div class="p-content">
            <p class="span-title">活动介绍：</p>

            <div class="p-img" v-html="this.serviced.extinfo.actContent"></div>
          </div>
        </div>
        <p style="margin-top:20px">
          <span class="span-title">温馨提示：</span>
          {{serviced.extinfo.actWarm}}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TinymceEditor from "../../../common/Tinymce";
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      centerDialogVisible: false,
      msg: "",
      tableData: [],
      tableDae: [],
      currentPage: 1, // 当前页
      pageSize: 8, // 每页条数
      total: 0, // 数据总条数,
      currentPage1: 1, // 当前页
      pageSize1: 5, // 每页条数
      total1: 0, // 数据总条数,
      dialogFormVisible: false,
      dialogFormVisible11: false,
      dialogFormVisible1: false,
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
      formdata: {},
      formLabelWidth: "120px",
      eidtform: {
        title: "", //砍价活动标题
        endTime: "", //活动结束时间
        num: "", //已参与砍价人数
        horseSet: "", //	走马灯设置
        everyCount: "", //	发起砍价次数
        extinfo: {
          actRules: "", //活动规则
          actContent: "", //活动介绍
          actWarm: "" //温馨提示
        },
        Timelist: []
      },
      activeName: "first",
      usecode: "",
      remarkForm: {
        remark: ""
      },
      serviced: {
        extinfo: {}
      },
      keywords: "",
      keyword: ""
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.eidtform = row;
      this.msg = row.extinfo.actContent;
    },
    saveEdit() {
      this.eidtform.extinfo.actContent = this.msg;

      const params = {
        title: this.eidtform.title, //砍价活动标题
        endTime: moment(this.eidtform.endTime).format("YYYY-MM-DD HH:mm:ss"), //活动结束时间
        num: this.eidtform.num, //已参与砍价人数
        horseSet: +this.eidtform.horseSet, //	走马灯设置
        everyCount: this.eidtform.everyCount, //	发起砍价次数
        "extinfo.actRules": this.eidtform.extinfo.actRules, //活动规则
        "extinfo.actContent": this.eidtform.extinfo.actContent, //活动介绍
        "extinfo.actWarm": this.eidtform.extinfo.actWarm, //温馨提示
        id: this.eidtform.id
      };
      console.log(params);

      this.req
        .post("/bargain/edit", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleorder(index, row) {
      // 存入token
      window.localStorage.removeItem("bargainid");
      window.localStorage.setItem("bargainid", row.id);
      // console.log(row.id)
      // 跳后端首页
      this.$router.push({ path: "/bargainactivityorder" });
    },
    getbargainirg(i) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        status: i,
        keywords: this.keyword
      };
      this.req
        .post("/bargain/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultListVo;
          this.total = res.data.data.totalCount;
          this.tableData.map(item => {
            if (item.xStoreactionStatic == undefined) {
              item.xStoreactionStatic = {};
            }
          });
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
      this.getbargainirg(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getbargainirg(); // 调用分页函数
    },
    handleSize(val) {
      // 当每页显示条数改变
      this.pageSize1 = val;
      this.getgroupbooking(); // 调用分页函数
    },
    handleCurrent(val) {
      // 当前页码改变
      this.currentPage1 = val;
      this.getgroupbooking(); // 调用分页函数
    },
    //立即结束
    handleend(index, row) {
      this.$confirm(
        "进行中的活动立即结束将不可再编辑。用户发起的砍价，未下单分享给好友的链接，好友无法查看确定要立即结束该活动？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let params = {
            bargainId: row.id
          };
          this.req
            .post("/bargain/endbargain", params)
            .then(res => {
              console.log(res);
              this.getbargainirg();
              if (res.data.sub_code == "SUCCESS") {
                this.$message({
                  type: "success",
                  message: "结束成功!"
                });
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消结束"
          });
        });
    },
    getgroupbooking() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize1,
        keyword: this.keywords
      };
      this.req
        .post("/bargain/orderlist", params)
        .then(res => {
          console.log(res);
          this.tableDae = res.data.data.resultList;
          console.log(this.tableDae);
          this.total1 = res.data.data.totalCount;
          this.tableDae.map(item => {
            if (item.userinfo == undefined) {
              item.userinfo = {};
              item.userinfo["avatar"] = "";
            }
          });
          if (res.data.sub_code == "SUCCESS") {
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
      window.localStorage.removeItem("detailnumber");

      window.localStorage.setItem("detailnumber", row.orderno);
      this.$router.push({ path: "/orderdetail" });
    },
    getremark(index, row) {
      this.remarkmangage = row.order;
      this.remarkForm.remark = row.order.remark;
      this.dialogFormVisible11 = true;
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
            this.dialogFormVisible11 = false;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
            this.getgroupbooking();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //砍价详情
    servicedetails(index, row) {
      let params = {
        id: row.id
      };
      this.req
        .post("/bargain/detail", params)
        .then(res => {
          this.serviced = res.data.data;
          this.centerDialogVisible = true;
          console.log(this.serviced);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    tabChange(tab,event){
      if(tab.name=='third'){
        this.$router.push({path:'/bmallorder'});
      }
    }
  },
  created() {
    this.getbargainirg();

    this.getgroupbooking();
  },
  components: {
    TinymceEditor
  }
};
</script>

<style scoped>
.bookingtop-left > p {
  line-height: 40px;
  font-size: 14px;
}
.left-p2 {
  display: flex;
  justify-content: space-between;
}
.bookingtop-right {
  display: flex;
  justify-content: space-between;
}
.booking-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding-bottom: 10px;
}
.bottom-item > span {
  display: inline-block;
  padding: 5px;
  border: 1px solid #c9c7c7;
}
.bordernone {
  border-right: none !important;
  cursor: pointer;
}
.el-row {
  margin-bottom: 20px;
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
.span-title {
  color: #4c4c4d;
  font-weight: 600;
}
.p-content {
  display: flex;
}
.el-dialog__title {
  padding-left: 20px;
}
.el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;
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

.el-dialog__wrapper {
  z-index: 1300 !important;
}
.v-modal {
  z-index: 1200 !important;
}
.p-img p img {
  height: 400px !important;
  width: 500px !important;
}
.p-img p {
  width: 500px !important;
}
</style>