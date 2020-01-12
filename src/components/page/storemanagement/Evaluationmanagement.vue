<template>
  <div class>
    <el-card shadow="never" style="margin-top:20px" class="box-card mgb20">
      <div class="clearfix">
        <div style="float: left; padding: 3px 0;display:flex;">
          <el-button type="primary" @click="dialogaddVisible=true">添加评论</el-button>
          <!-- <el-button type="danger">删除选中评论</el-button> -->
        </div>
      </div>
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="goodsTableData"
        tooltip-effect="dark"
        class="table"
        ref="goodsTableData"
      >
        <!-- @selection-change="handleSelectionChange" -->
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column label="用户信息" align="center">
          <template slot-scope="scope">
            <div>
              <img
                style="width:50px;height:50px;border-radius:50%"
                :src="scope.row.avatar|avatar"
                alt="#"
              />
              <div>
                <p>{{scope.row.name}}</p>
                <p>{{scope.row.tel}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论类型" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.type==0">用户评论项目</p>
            <p v-if="scope.row.type==1">技师评论用户</p>
            <p v-if="scope.row.type==2">用户评论技师</p>
            <p v-if="scope.row.type==3">用户评价店铺</p>
          </template>
        </el-table-column>
        <el-table-column label="评分/时间" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.initTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <el-rate
              v-model="scope.row.star"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            ></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
        <el-table-column label="评论对象" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.massageTitle}}</p>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0"
              type="success"
              @click="changgestatus(scope.$index, scope.row,1)"
              size="mini"
            >显示评论</el-button>
            <el-button
              v-if="scope.row.status==1"
              type="success"
              @click="changgestatus(scope.$index, scope.row,0)"
              size="mini"
            >隐藏评论</el-button>
          </template>
        </el-table-column>
        <el-table-column width="400" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="reply(scope.$index, scope.row)" size="mini">回复</el-button>
            <el-button @click="delreviews(scope.$index, scope.row)" type="danger" size="mini">删除</el-button>
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
    </el-card>
    <!-- 回复评论 -->
    <el-dialog title="回复评论" :visible.sync="dialogreplyVisible">
      <el-input v-model="replycontent" autocomplete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogreplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="replyreview">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加评价" width="50%" :visible.sync="dialogaddVisible">
      <el-form :rules="rules" ref="addevaluation" :model="addevaluation">
        <el-form-item label="用户头像" prop="PackingImage">
          <el-upload
            :action="$upfileUrl()"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :name="filename"
            :data="updata"
            :on-success="suss"
            multiple
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="name">
          <el-input
            style="width:250px"
            placeholder="请输入用户昵称"
            v-model="addevaluation.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="tel">
          <el-input
            style="width:250px"
            placeholder="请输入联系方式"
            v-model="addevaluation.tel"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="星级评分" :label-width="formLabelWidth" prop="star">
          <el-input
            style="width:250px"
            placeholder="请输入星级评分（1-5的数字）"
            v-model="addevaluation.star"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth" prop="initTime">
          <el-date-picker
            style="width:250px"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="addevaluation.initTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="type" label="评论类型" :label-width="formLabelWidth">
          <el-radio-group v-model="addevaluation.type">
            <el-radio :label="3">评论店铺</el-radio>
            <el-radio :label="0">评论项目</el-radio>
            <el-radio :label="2">评论技师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left:80px" v-show="addevaluation.type=='0'" prop="massageId">
          <el-select
            style="margin-right:10px"
            filterable
            v-model="addevaluation.massageId"
            placeholder="指定项目(必填)"
          >
            <el-option v-for="(v,i) in gridData1" :key="i" :label="`${v.title}`" :value="v.id">
              <span style="float: left">{{ v.title }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:80px" v-show="addevaluation.type=='0'">
          <el-select filterable v-model="addevaluation.massagistId" placeholder="指定技师">
            <el-option v-for="(v,i) in gridData" :key="i" :label="`${v.userName}`" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:80px" v-show="addevaluation.type=='2'" prop="massageId">
          <el-select
            style="margin-right:10px"
            filterable
            v-model="addevaluation.massageId"
            placeholder="指定项目(必填)"
          >
            <el-option v-for="(v,i) in gridData1" :key="i" :label="`${v.title}`" :value="v.id">
              <span style="float: left">{{ v.title }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:80px" v-show="addevaluation.type=='2'">
          <el-select filterable v-model="addevaluation.massagistId" placeholder="指定技师">
            <el-option v-for="(v,i) in gridData" :key="i" :label="`${v.userName}`" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:80px" v-show="addevaluation.type=='3'" prop="massageId">
          <el-select
            style="margin-right:10px"
            filterable
            v-model="addevaluation.massageId"
            placeholder="指定项目(必填)"
          >
            <el-option v-for="(v,i) in gridData1" :key="i" :label="`${v.title}`" :value="v.id">
              <span style="float: left">{{ v.title }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:80px" v-show="addevaluation.type=='3'" prop="massagistId">
          <el-select filterable v-model="addevaluation.massagistId" placeholder="指定技师(必填)">
            <el-option v-for="(v,i) in gridData" :key="i" :label="`${v.userName}`" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论内容" :label-width="formLabelWidth" prop="content">
          <el-input
            style="width:70%"
            placeholder="请输入评论内容"
            maxlength="100"
            show-word-limit
            type="textarea"
            :rows="4"
            v-model="addevaluation.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="回复评论" :label-width="formLabelWidth" prop="replyContent">
          <el-input
            style="width:70% "
            placeholder="请输入回复内容"
            maxlength="100"
            show-word-limit
            type="textarea"
            :rows="4"
            v-model="addevaluation.replyContent"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addevaluat()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogaddVisible: false,
      addevaluation: {
        massageId: "", //项目id
        massagistId: "", //	Int		Y	技师id
        // orderNo: "", //String		Y	订单号
        type: "", //	Int		Y	评价类型:0-用户评论项目2-用户评论技师3-用户评论店铺
        // anonymous: "", //	BIT		Y	匿名: 0-不匿名 1-匿名
        star: "", //	Int		Y	星数
        // tags: "", //	String		N	标签:多个标签','分隔
        // imageUrls: "", //	String		N	评论图片:多图片‘,’分隔
        content: "", //	String		N	内容
        type: "", //	Int		Y	评价类型 0-用户评论项目2-用户评论技师
        name: "", //	String		N	姓名
        avatar: "", //	String		N	头像
        tel: "", //String		N	联系方式
        initTime: "", //	String		N	发布时间
        replyContent: ""
      },
      formLabelWidth: "80px",
      rules: {
        massageId: [{ required: true, message: "请选择项目", trigger: "blur" }],
        massagistId: [
          { required: true, message: "请选择技师", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择评价类型", trigger: "blur" }],
        star: [{ required: true, message: "请输入密码", trigger: "blur" }],
        content: [
          { required: true, message: "请输入评价内容", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
        avatar: [
          { required: true, message: "请上传用户头像", trigger: "blur" }
        ],
        tel: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        initTime: [
          { required: true, message: "请选择发布时间", trigger: "blur" }
        ]
      },
      goodsTableData: [],
      status: "",
      dialogreplyVisible: false,
      replycontent: "",
      replyid: "",
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数
      dialogImageUrl: "",
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      filename: "file",
      gridData1: [], //模态框表格
      gridData: [] //模态框表格
    };
  },
  created() {
    this.getreviewListByPage();
    this.getallserve();
    this.getData();
  },
  computed: {},
  methods: {
    addevaluat() {
      this.$refs.addevaluation.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          // 收集账号和密码

          let params = {
            massageId: this.addevaluation.massageId, //项目id
            massagistId: this.addevaluation.massagistId, //	Int		Y	技师id
            // orderNo: "", //String		Y	订单号
            type: this.addevaluation.type, //	Int		Y	评价类型:0-用户评论项目2-用户评论技师3-用户评论店铺
            // anonymous: "", //	BIT		Y	匿名: 0-不匿名 1-匿名
            star: this.addevaluation.star, //	Int		Y	星数
            // tags: "", //	String		N	标签:多个标签','分隔
            // imageUrls: "", //	String		N	评论图片:多图片‘,’分隔
            content: this.addevaluation.content, //	String		N	内容
            type: this.addevaluation.type, //	Int		Y	评价类型 0-用户评论项目2-用户评论技师
            name: this.addevaluation.name, //	String		N	姓名
            avatar: this.addevaluation.avatar, //	String		N	头像
            tel: this.addevaluation.tel, //String		N	联系方式
            initTime: this.addevaluation.initTime, //	String		N	发布时间
            replyContent: this.addevaluation.replyContent
          };
          // 发送请求给后端
          this.req
            .post("/reviews/save", params)
            .then(res => {
              // 接收后端返回的数据
              console.log(res);
              this.getreviewListByPage();
              if (res.data.sub_code == "SUCCESS") {
                this.dialogaddVisible = false;
              } else {
                // 弹失败提示
                // this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("前端验证失败！不允许提交!");
          return false;
        }
      });
    },
    //获取技师
    getData() {
      let params = {
        flag: false
      };
      // 发送请求给后端
      this.req
        .post("/technician/list", params)
        .then(res => {
          // 接收后端返回的数据
          console.log(res);
          // this.gridData1 = res.data.data.resultList;

          this.gridData = res.data.data.resultList;
          if (res.data.sub_code == "220") {
            // 跳后端首页
            // this.$router.push("/accountmanagement");
          } else {
            // 弹失败提示
            // this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取服务类别
    getallserve() {
      this.req
        .post("/massage/list")
        .then(res => {
          console.log(res);
          this.gridData1 = res.data.data.resultList;
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 将图片上传到服务器，返回地址替换到md中
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    suss(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.addevaluation.avatar = response.data;
    },
    getreviewListByPage() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.req
        .post("/reviews/list", params)
        .then(res => {
          this.goodsTableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(res);
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          if (!res.data.data.resultList.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getreviewListByPage(); // 再次请求数据
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
    handleDelete(index, row) {},
    changgestatus(index, row, i) {
      let params = {
        status: i,
        id: row.id
      };
      this.req
        .post("/reviews/update/status", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getreviewListByPage();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delreviews(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            userid: row.userId,
            id: row.id
          };
          this.req
            .post("/reviews/update/del", params)
            .then(res => {
              console.log(res);
              if (res.data.sub_code == "SUCCESS") {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getreviewListByPage();
                this.getevaluate();
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
            message: "已取消删除"
          });
        });
    },
    reply(index, row) {
      this.dialogreplyVisible = true;
      this.replyid = row.id;
    },
    replyreview() {
      let params = {
        content: this.replycontent,
        id: this.replyid
      };
      this.req
        .post("/reviews/update/reply", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogreplyVisible = false;
            this.$message({
              type: "success",
              message: "回复成功"
            });
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
      this.getreviewListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getreviewListByPage(); // 调用分页函数
    }
  },
  activated() {
    this.getreviewListByPage();
  }
};
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
.technician-list {
  display: flex;
  justify-content: space-around;
}
.technician-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.el-checkbox {
  margin-left: 5px !important;
}
</style>

