<template>
  <el-card shadow="never" class="box-card">
    <div slot="header" class="clearfix">
      <span>会员中心/会员详情/会员卡</span>
    </div>
    <div>
      <p style="padding-bottom:10px">状态：
        <!-- <el-select filterable v-model="typeId" placeholder="按服务类别查询" @change="getcardListByPage">
          <el-option label="有效" :value="this.endTimeSmall"></el-option>
          <el-option label="失效" :value="this.endTimeBig"></el-option>
        </el-select> -->
        <el-button type="danger"  @click="getcardListByPage('',endTimeSmall)">失效</el-button>
        <el-button type="primary"  @click="getcardListByPage(endTimeBig,'')">有效</el-button>
        <el-button @click="getcardListByPage('','')">全部</el-button>
      </p>
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="goodsTableData"
        tooltip-effect="dark"
        class="table"
        ref="goodsTableData"
      >
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column label="卡类型" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.kind=='0'">次卡</p>
            <p v-if="scope.row.kind=='1'">打折卡</p>
            <p v-if="scope.row.kind=='2'">充值卡</p>
          </template>
        </el-table-column>
        <el-table-column label="卡号" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.number}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="购买日期" align="center">
          <template slot-scope="scope">{{scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.valid=='0'">永久有效</p>
            <p
              v-if="scope.row.endTime!=undefined"
            >{{scope.row.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
          </template>
        </el-table-column>
        <el-table-column width="400" label="操作" align="center">
          <template slot-scope="scope">
            <p style="display:flex;padding-left:50px">
              <el-button type="info" @click="gomemberdetails(scope.$index, scope.row)">详情</el-button>
              <el-button
                v-if="scope.row.valid!='0'"
                type="primary"
                @click="setdata(scope.$index, scope.row)"
              >修改有效期</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 20px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5,8, 10, 30]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog :visible.sync="dialogVisible" width="50%">
        <div style="line-height:40px">
          <p>
            <span style="font-size:32px">{{cardData.title}}</span>
            <span
              style="padding:5px 20px;background:#07c4a8;border-radius:20px;margin-left:20px"
              v-if="cardData.kind=='0'"
            >次卡</span>
            <span
              style="padding:5px 20px;background:#07c4a8;border-radius:20px;margin-left:20px"
              v-if="cardData.kind=='1'"
            >打折卡</span>
            <span
              style="padding:5px 20px;background:#07c4a8;border-radius:20px;margin-left:20px"
              v-if="cardData.kind=='2'"
            >充值卡</span>
          </p>
          <div>
            <p>
              <span>卡编号：{{cardData.number}}</span>
              <span v-if="cardData.kind!='2'" style="margin-left:40px">卡卖价：￥{{cardData.amount}}</span>
              <span v-if="cardData.kind=='2'" style="margin-left:40px">充值金额：￥{{cardData.amount}}</span>
              <span
                v-if="cardData.kind=='2'"
                style="margin-left:40px"
              >赠送金额：￥{{cardData.amountOrigin}}</span>
            </p>
            <p>
              有效期：
              <span v-if="cardData.valid=='0'">永久有效</span>
              <span
                v-if="cardData.endTime!=undefined"
              >{{cardData.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
            </p>
            <p>使用规则：{{cardData.description}}</p>
          </div>
          <div>
            <p v-if="cardData.amountLeft>0&&cardData.kind=='1'">
              所获特权：
              <span style="margin-left:40px">全场通用</span>
              <span style="margin-left:40px">折扣：{{cardData.amountLeft}}折</span>
            </p>
            <el-table
              v-if="cardData.kind=='0'"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="cardtabledata"
              tooltip-effect="dark"
              class="table"
              ref="cardtabledata"
            >
              <el-table-column label="适用项目" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.massageTitle}}</p>
                </template>
              </el-table-column>
              <el-table-column label="初始次数" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.useTimes}}</p>
                </template>
              </el-table-column>
              <el-table-column label="剩余次数" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.timesLeft}}</p>
                </template>
              </el-table-column>
              <el-table-column label="有效期" align="center">
                <p v-if="cardData.valid=='0'">永久有效</p>
                <p
                  v-if="cardData.endTime!=undefined"
                >{{cardData.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
              </el-table-column>
            </el-table>
            <el-table
              v-if="cardData.kind=='1'"
              :header-cell-style="{background:'#eef1f6',color:'#606266'}"
              :data="cardtabledata"
              tooltip-effect="dark"
              class="table"
              ref="cardtabledata"
            >
              <el-table-column label="适用项目" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.massageTitle}}</p>
                </template>
              </el-table-column>
              <el-table-column label="折扣" align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.discount}}</p>
                </template>
              </el-table-column>
              <el-table-column label="有效期" align="center">
                <p v-if="cardData.valid=='0'">永久有效</p>
                <p
                  v-if="cardData.endTime!=undefined"
                >{{cardData.endTime|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
      <!-- 修改有效日期 -->
      <el-dialog title="修改有效期" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="到期时间：" :label-width="formLabelWidth">
            <el-date-picker
              type="datetime"
              placeholder="选择日期"
              v-model="form.endTime"
              style="width: 100%;"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="savedata">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      dialogVisible: false,
      dialogFormVisible: false,
      activeName: "first",
      goodsTableData: [],
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 数据总条数
      cardData: {},
      cardtabledata: [],
      form: {
        endTime: ""
      },
      id: "",
      formLabelWidth: "120px",
      endTimeSmall : moment().utc().format('YYYY-MM-DD HH:mm:ss'),
   endTimeBig :  moment().utc().format('YYYY-MM-DD HH:mm:ss'),
   typeId:''
    };
  },
  methods: {
    getcardListByPage(i,a) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        userId: this.$route.query.uid,
        timedata:'',
        endTimeSmall:a,
      endTimeBig:i
      };
      this.req
        .post("/vipcard/list/user", params)
        .then(res => {
          this.goodsTableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(res);
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          this.tableData.map(v => {
            if (v.userWorker == undefined) {
              return (v.userWorker = "");
            }
          });
          if (!res.data.data.resultList.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getcardListByPage(); // 再次请求数据
          }
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
      this.getcardListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getcardListByPage(); // 调用分页函数
    },
    gomemberdetails(index, row) {
      let params = {
        id: row.id
      };
      this.req
        .post("/vipcard/user/detail", params)
        .then(res => {
          this.cardData = res.data.data;
          this.cardtabledata = res.data.data.goods;
          console.log(this.cardData);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogVisible = true;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setdata(index, row) {
      this.id = row.id;

      this.dialogFormVisible = true;
    },
    savedata(index, row) {
      let params = {
        id: this.id,
        endTime: this.form.endTime
      };
      this.req
        .post("/vipcard/user/update/validate", params)
        .then(res => {
          console.log(this.cardData);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogFormVisible = false;
            this.getcardListByPage();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

 
  },

  created() {
    this.getcardListByPage();
  },
  activated() {
    this.getcardListByPage();
  }
};
</script>

<style scoped>
</style>

