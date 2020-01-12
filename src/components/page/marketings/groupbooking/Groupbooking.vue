<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>多人拼团</span>
      </div>
      <div>
        <!-- 上半部分 -->
        <el-row>
          <el-col class="bookingtop-left" :span="6">
            <p>多人拼团使用介绍：</p>
            <div class="left-p2">
              <p class="left-p2">
                <el-popover
                  title="规则说明"
                  style="margin-right:10px"
                  placement="right"
                  width="400"
                  trigger="click">
                  <div>
                    <p>1.只有支付成功才能开团/参团。</p>
                    <p>2.在团有效期内凑够人数参加拼团，即可算拼团成功。</p>
                    <p>3.拼团成功后所购买的商品才会发放：次卡会自动发放到用户的“我的会员卡”中。</p>
                    <p>4.若团有效期内没有凑齐人数，则拼团失败。系统会自动将所支付的款项原路退回，具体到账时间以各银行为准。</p>
                    <p>5.一旦付款则不能取消订单，可等后，未凑齐人数拼团失败订单自动取消。</p>
                    <p>6.开团者在自己开的团未结束前不能再开团，只可参加其他人的团。</p>
                    <p>7.本活动不能与其他优惠同享。</p>
                    <p>8.活动最终解释权归商家所有。</p>
                  </div>
                  <el-button slot="reference">规则说明</el-button>
                </el-popover>
                <span style="line-height:33px">使用教程</span>
                <span style="line-height:33px">活动案例</span>
              </p>
              <span style="line-height:33px">使用教程</span>
              <span style="line-height:33px">活动案例</span>
            </div>
            <p>
              <router-link to="/addgroundbooking" class="btn btn-success">新建拼团活动</router-link>
            </p>
          </el-col>
        </el-row>
        <!-- 下半部分 -->

        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="拼团列表" name="first">
            <div>
              <div class="booking-bottom">
                <p class="bottom-item">
                  <span class="bordernone" @click="getgroupbooking(0)">全部</span>
                  <span class="bordernone" @click="getgroupbooking(1)">未开始</span>
                  <span class="bordernone" @click="getgroupbooking(2)">进行中</span>
                  <span style="cursor: pointer;" @click="getgroupbooking(3)">已结束</span>
                </p>
                <p>
                  <el-input
                    v-model="keywords"
                    style="width:150px"
                    type="text"
                    placeholder="请输入活动名称"
                  ></el-input>
                  <el-button @click="getgroupbooking('')" type="primary">搜索</el-button>
                </p>
              </div>
              <el-table
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column label="活动名称" width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="活动时间" width="380">
                  <template slot-scope="scope">
                    <span
                      style="margin-left: 10px"
                    >{{ scope.row.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>至
                    <span
                      style="margin-left: 10px"
                    >{{ scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="活动状态" width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status=='1'" style="margin-left: 10px">未开始</span>
                    <span v-if="scope.row.status=='2'" style="margin-left: 10px">进行中</span>
                    <span v-if="scope.row.status=='3'" style="margin-left: 10px">已结束</span>
                  </template>
                </el-table-column>
                <el-table-column label="开团数" width="130">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.launchs }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="成团数" width="130">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.turnover }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="几人团" width="130">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.actionNum }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="success"
                      size="mini"
                      @click="handledetails(scope.$index, scope.row)"
                    >查看订单</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      v-if="scope.row.status=='1'"
                      @click="handleDel(scope.$index, scope.row)"
                    >删除</el-button>
                    <el-button
                      v-if="scope.row.status=='2'"
                      size="mini"
                      @click="handleend(scope.$index, scope.row)"
                      type="danger"
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
              <el-dialog title="拼团活动详情" :visible.sync="centerDialogVisible" width="50%" center>
                <div>
                  <p>活动名称：{{dogdata.name}}</p>
                  <p>活动时间：{{ dogdata.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}至{{ dogdata.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                  <p>选择项目：{{dogdata.itemname}}</p>
                  <p v-if="dogdata.buylimit!=0">活动限购：{{dogdata.buylimit}}</p>
                  <p v-if="dogdata.buylimit==0">活动限购：无限制</p>
                  <p>拼团有效期：{{dogdata.validityTime}}分钟</p>
                  <p v-if="dogdata.simulate=='1'">模拟成团：已开启模拟成团</p>
                  <p v-if="dogdata.simulate=='0'">模拟成团：未开启模拟成团</p>
                  <p style="padding-left:70px;font-size:12px;color:#b1b1b1">
                    开启模拟成团后，该团有效期结束时，人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。
                    只有已付款参团的真实买家才会获得商品。建议合理开启。以提高成团率。
                  </p>
                  <p v-if="dogdata.lantern=='1'">走马灯设置：已开启走马灯</p>
                  <p v-if="dogdata.lantern=='0'">走马灯设置：未开启走马灯</p>
                  <p
                    style="padding-left:70px;font-size:12px;color:#b1b1b1"
                  >开启走马灯设置后，系统会模拟“匿名买家拼团”滚动显示，增加拼团活跃度。</p>
                  <p>成团人数：{{dogdata.actionNum}}</p>
                  <p>已参与拼团人数：{{dogdata.participation}}</p>
                  <p>成团价格：{{dogdata.actionPrice}}</p>
                  <p>活动规则：{{dogdata.abDesc.rules}}</p>
                  <div>
                    活动介绍：
                    <p style="padding-left:70px" v-html="dogdata.abDesc.acdescription"></p>
                  </div>
                  <p>温馨提示：{{dogdata.abDesc.reminder}}</p>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="centerDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>
              <!-- 分页 -->
              <div style="margin-top: 20px;text-align:center">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[1, 3, 5,10, 30]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
              <!-- 编辑模态框 -->
              <el-dialog title="编辑拼团活动：" width="80%" :visible.sync="dialogFormVisible">
                <el-form :model="eidtform">
                  <el-form-item label="活动名称：" :label-width="formLabelWidth">
                    <el-input v-model="eidtform.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动结束时间：" :label-width="formLabelWidth">
                    <el-date-picker v-model="eidtform.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="已成团数量：" :label-width="formLabelWidth">
                    <el-input v-model="eidtform.participation" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="走马灯设置：" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="eidtform.lantern">
                      <el-checkbox :label="1">开启走马灯</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="模拟成团：" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="eidtform.simulate">
                      <el-checkbox :label="1">开启模拟成团</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="活动规则" :label-width="formLabelWidth">
                    <el-input show-word-limit maxlength="200" type="textarea" :rows="4" v-model="eidtform.abDesc.rules"></el-input>
                  </el-form-item>
                  <el-form-item label="活动介绍：" :label-width="formLabelWidth">
                    <tinymce-editor ref="editor" v-model="msg">
                      <!-- :disabled="disabled" -->
                    </tinymce-editor>
                  </el-form-item>
                  <el-form-item label="温馨提示" :label-width="formLabelWidth">
                    <el-input show-word-limit maxlength="200" type="textarea" :rows="4" v-model="eidtform.abDesc.reminder"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveEidt">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </el-tab-pane>
          <el-tab-pane label="拼团订单列表" name="second">
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
                <el-button @click="getgroup()" type="primary">搜索</el-button>
              </p>
            </div>
            <el-table
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="tableDe"
              style="width: 100%"
            >
              <el-table-column label="顾客信息">
                <template slot-scope="scope">
                 
                    <img
                      style="width:50px;height:50px;border-radius:50%"
                      :src="scope.row.userinfo.avatar|avatar"
                      alt="#"
                    />
                    <span
                      style="margin-left: 10px;line-height:50px;display:inline-block;"
                    >{{ scope.row.userinfo.nick }}</span>
                  <div>
                    
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="订单编号">
                <template slot-scope="scope">
                  <p
                    
                    style="margin-left: 10px;line-height:50px"
                  >{{ scope.row.orderno }}</p>
                  <p style="padding:20px"></p>
                </template>
              </el-table-column>
              <el-table-column label="下单时间">
                <template slot-scope="scope">
                  <p
                    style="margin-left: 10px;line-height:50px"
                  >{{ scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                  <!-- <p
                    style="padding-top:20px;"
                  >开始时间：{{scope.row.startTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p> -->
                </template>
              </el-table-column>
              <el-table-column label="实付金额（元）">
                <template slot-scope="scope">
                  <p
                    style="margin-left: 10px;line-height:50px"
                   
                  >{{ scope.row.payAmount }}</p>
                  
                </template>
              </el-table-column>
              <el-table-column label="订单状态">
                <template slot-scope="scope">
                  <p
                    style="margin-left: 10px;line-height:50px"
                  >
                    <span v-if="scope.row.orderStatus=='1'">待支付</span>
                    <span v-if="scope.row.orderStatus=='2'">已支付（待接单）</span>
                    <span v-if="scope.row.orderStatus=='3'">已预约</span>
                    <span v-if="scope.row.orderStatus=='4'">已确认（待服务）</span>
                    <span v-if="scope.row.orderStatus=='5'">待支付（待结束）</span>
                    <span v-if="scope.row.orderStatus=='6'">服务完成（待评价）</span>
                    <span v-if="scope.row.orderStatus=='7'">申请退款</span>
                    <span v-if="scope.row.orderStatus=='8'">已完成</span>
                    <span v-if="scope.row.orderStatus=='-1'">订单取消</span>
                    <span v-if="scope.row.orderStatus=='-2'">订单取消</span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column width="400" label="操作">
                <template style="padding:0" slot-scope="scope">
                  <div style="padding-bottom:20px">
                     <p  style="height:50px">
                    <el-button
                      type="info"
                      style="margin-left:0;margin-bottom:10px"
                      
                      size="mini"
                      @click="handlewatch(scope.row.orderno)"
                    >订单详情</el-button>
                    <el-button
                      type="success"
                      size="mini"
                      @click="getremark(scope.row)"
                    >备注</el-button>
                    <el-button
                      v-if="scope.row.orderStatus=='1'||scope.row.orderStatus=='4'"
                      size="mini"
                      @click="handleEdit(scope.row)"
                      type="danger"
                    >取消订单</el-button>
                    <el-button
                      size="mini"
                      type="success"
                      @click="getmoney(scope.row)"
                      v-if="scope.row.orderStatus=='5'"
                    >收款</el-button>
                    <el-button
                      size="mini"
                      type="warning"
                      @click="opencancel(scope.row)"
                      v-if="scope.row.orderStatus=='4'"
                    >消费编码</el-button>
                  </p>
                  </div>
                 
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
          <el-tab-pane label="商品拼团订单列表" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
      <el-dialog title="订单备注" :visible.sync="dialogFormVisible11">
      <el-form ref="remarkForm" :model="remarkForm">
        <el-input
         show-word-limit maxlength="100"
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
      <!-- 拼团详情 -->
    <el-dialog title="拼团详情" :visible.sync="centerDialogVisible" width="60%">
      <div style="padding-left:20px;padding-right:20px">
        <p>
          <span class="span-title">活动名称：</span>
          {{serviced.name}}
        </p>
        <p>
        <p>
          <span class="span-title">活动时间：</span>
          {{serviced.startTime|dateformat('YYYY-MM-DD HH:mm:ss') }}至 {{serviced.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}
        </p>
        <p>
        <p>
          <span class="span-title">选择项目：</span>
          {{serviced.itemname}}
        </p>
        <p>
          <span class="span-title">活动限购：</span>
          <!-- {{serviced.buylimit}} -->
          <span v-if="serviced.buylimit==0">无限制</span>
          <span v-if="serviced.buylimit>0">{{serviced.buylimit}}</span>
        </p>
        <p>
          <span class="span-title">拼团有效期：</span>
          {{serviced.validityTime}}分钟
        </p>
       <div style="display:flex;">
          <p class="span-title">模拟成团：</p>
          <span v-if="serviced.simulate=='0'">模拟成团未开启</span>
          <span v-if="serviced.simulate=='1'">模拟成团已开启</span>
          <!-- <img style="with:100px;height:100px" :src="`/img/${serviced.imageUrl}`" alt="#" /> -->
        </div>
       <div style="display:flex;">
          <p class="span-title">走马灯设置：</p>
          <span v-if="serviced.lantern=='0'">走马灯未开启</span>
          <span v-if="serviced.lantern=='1'">走马灯已开启</span>
          <!-- <img style="with:100px;height:100px" :src="`/img/${serviced.imageUrl}`" alt="#" /> -->
        </div>
        <p>
          <span class="span-title">成团人数：</span>
          {{serviced.actionNum}}
        </p>
        <p>
          <span class="span-title">已参与拼团人数：</span>
          {{serviced.participation}}
        </p>
        <p>
          <span class="span-title">成团价格：</span>
          {{serviced.actionPrice}}元
        </p>
        <p style="margin-top:20px">
          <span class="span-title">活动规则：</span>
          {{serviced.abDesc.rules}}
        </p>
        <div>
          <div class="p-content">
            <p  class="span-title">活动介绍：</p>

            <div class="p-img" v-html="this.serviced.abDesc.acdescription"></div>
          </div>
        </div>
        <p style="margin-top:20px">
          <span class="span-title">温馨提示：</span>
          {{serviced.abDesc.reminder}}
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
      centerDialogVisible : false,
       serviced:{
        abDesc:{}
      },
      activeName: "first",
      tableData: [],
      tableDe: [],
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 数据总条数
      currentPage1: 1, // 当前页
      pageSize1: 5, // 每页条数
      total1: 0, // 数据总条数
      centerDialogVisible: false,
      dogdata: {
        abDesc: {
          acdescription: "",
          id: "",
          initTime: "",
          reminder: "",
          rules: ","
        }
      },
      eidtform: {
        abDesc: {
          rules: "",
          reminder: ""
        },
        participation: "",
        lantern: "",
        endTime: "",
        simulate: ""
      },
      dialogFormVisible: false,
      dialogFormVisible11: false,
      dialogFormVisible1: false,
      formLabelWidth: "120px",
      msg: "",
      filename: "file",
      keywords: "",
      usecode: "",
      remarkForm: {
        remark: ""
      }
    };
  },
  methods: {
    //编辑
    handleEdit(index, row) {
      (this.dialogFormVisible = true), console.log(index, row);
      let params = {
        id: row.id
      };
      this.req
        .post("/assemble/detail", params)
        .then(res => {
          this.eidtform = res.data.data;
          this.msg = this.eidtform.abDesc.acdescription;
          console.log(this.eidtform);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存编辑
    saveEidt() {
      let params = {
        id: this.eidtform.id,
        "abDesc.rules": this.eidtform.abDesc.rules,
        "abDesc.reminder": this.eidtform.abDesc.reminder,
        "abDesc.acdescription": this.msg,

        participation: this.eidtform.participation,
        lantern: +this.eidtform.lantern,
        simulate: +this.eidtform.simulate,
        endTime: moment(this.eidtform.endTime).format("YYYY-MM-DD HH:mm:ss"),
        name: this.eidtform.name,
        storeid: window.localStorage.getItem("shopid")
      };
      console.log(params);
      this.req
        .post("/assemble/edit", params)
        .then(res => {
          console.log(res);
          this.dialogFormVisible = false;
          this.getgroupbooking();
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //立即结束
    handleend(index, row) {
      this.$confirm(
        "进行中的活动立即结束将不可再编辑。若未开启模拟成团，拼团中的团将拼团失败，订单自动关闭并退款;若已开启模拟成团，拼团中的团将立即模拟成团。已成团订单仍需及时处理。确定要立即结束该活动？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let params = {
            id: row.id
          };
          this.req
            .post("/assemble/upover", params)
            .then(res => {
              console.log(res);
              this.getgroupbooking();
              if (res.data.sub_code == "SUCCESS") {
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });

          this.$message({
            type: "success",
            message: "结束成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消结束"
          });
        });
    },
    //查看详情
    handlewatch(index, row) {
      let params = {
        id: row.id
      };
      this.req
        .post("/assemble/detail", params)
        .then(res => {
          if (res.data.sub_code == "SUCCESS") {
            this.dogdata = res.data.data;
            console.log(this.dogdata);
            this.centerDialogVisible = true;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查看订单
    handledetails(index, row) {
      console.log(index, row);

      // 存入token
      window.localStorage.removeItem("groundbookingid");
      window.localStorage.setItem("groundbookingid", row.id);
      // console.log(row.id)
      // 跳后端首页
      this.$router.push({ path: "/groupactivitylist" });
    },
    handleDel(index, row) {
      this.$confirm("删除后数据无法恢复，是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: row.id
          };
          this.req
            .post("/assemble/remove", params)
            .then(res => {
              console.log(res);

              this.getgroupbooking();
              if (res.data.sub_code == "SUCCESS") {
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getgroupbooking(i) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        fliter: i,
        keywords: this.keywords
      };
      this.req
        .post("/assemble/list", params)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
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
      this.getgroupbooking(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getgroupbooking(); // 调用分页函数
    },
    handleSize(val) {
      // 当每页显示条数改变
      this.pageSize1 = val;
      this.getgroup(); // 调用分页函数
    },
    handleCurrent(val) {
      // 当前页码改变
      this.currentPage1 = val;
      this.getgroup(); // 调用分页函数
    },
    suss(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.form.imageUrl = response.data;
      console.log(this.form.imageUrl);
    },
    getgroup() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize1,
        keyword: this.keywords

        // actionid: window.localStorage.getItem("groundbookingid")
      };
      this.req
        .post("/assemble/orderlist", params)
        .then(res => {
          console.log(res);
          this.tableDe = res.data.data.resultList;
          this.total1 = res.data.data.totalCount;
          this.tableDe.map(item => {
            item.orderList.map(v => {
              if (v.userinfo == undefined) {
                v.userinfo = {};

                v.userinfo.avatar = "";
              }
            });
          });
          console.log(this.tableDe);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查看详情
    handlewatch(orderno) {
      window.localStorage.removeItem("detailnumber");

      window.localStorage.setItem("detailnumber", orderno);
      this.$router.push({ path: "/orderdetail" });
    },
    getremark(item) {
      this.remarkmangage = item;
      this.remarkForm.remark = item.remark;
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
    opencancel(item) {
      this.dialogFormVisible1 = true;
      this.usecodemsg = item;
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
            this.getgroup();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
     //拼团详情
    servicedetails(index, row) {
       let params = {
        id: row.id,
      
      };
      this.req
        .post("/assemble/detail", params)
        .then(res => {
          this.serviced = res.data.data
          console.log(res.data.data)
            console.log(this.serviced);
      this.centerDialogVisible = true;
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
        this.$router.push({path:'/gmallorder'});
      }
    }
  },
  components: {
    TinymceEditor
  },
  created() {
    this.getgroupbooking();
    this.getgroup();
  },
  activated() {
    this.getgroupbooking();
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
.el-dialog__wrapper{
  z-index: 1300 !important;
}
.v-modal{
  z-index: 1200 !important;

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
.p-img p img{
  height: 400px !important;
  width: 500px !important;
}
.p-img p{
  
  width: 500px !important;
}
</style>