<template>
  <div class>
    <el-card shadow="never" style="margin-top:20px" class="box-card mgb20">
      <div slot="header" class="clearfix">
        <span>服务管理</span>
      </div>
      <div style="display:flex; justify-content: space-between;padding-bottom:20px">
        <div>
          <el-button type="primary" @click="addservice">添加服务</el-button>
          <el-button type="primary" @click="dialogTableVisible = true">分类添加/管理</el-button>
        </div>
        <div>
          <span style="font-size:14px;color:'#303133';padding-right:10px">选择分类</span>
          <el-select filterable v-model="typeId" placeholder="按服务类别查询" @change="getGoodsListByPage">
            <el-option label="全部" value></el-option>
            <el-option v-for="(v,i) in gridData1" :key="i" :label="`${v.title}`" :value="v.id">
              <span style="float: left">{{ v.title }}</span>
            </el-option>
          </el-select>
        </div>
        <div style="display:flex;">
          <el-input type="text" v-model="keywords" placeholder="项目名称/描述"></el-input>
          <el-button @click="getGoodsListByPage" type="primary">搜索</el-button>
        </div>
      </div>
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="goodsTableData"
        tooltip-effect="dark"
        class="table"
        ref="goodsTableData"
      >
        <el-table-column label="项目名称" width="300" align="center">
          <template slot-scope="scope">
            <div style="display:flex;">
              <img style="width:60px;height:60px;" :src="scope.row.imageUrl|avatar" alt="#" />
              <div style="padding-left:5px">
                <p style="line-height:30px;">{{scope.row.title}}</p>
                <p style="line-height:30px;">
                  <span style="font-size:16px">￥{{scope.row.price}}</span>
                  <span style="text-decoration:line-through">￥{{scope.row.marketPrice}}</span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序(越大越靠前)" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.sort}}</p>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.type.title}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="serviceTime" label="服务时长" align="center"></el-table-column>
        <el-table-column prop="realSold" label="总销量" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.onsell=='1'">上架</p>
            <p v-if="scope.row.onsell=='0'">下架</p>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.initTime |dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
          </template>
        </el-table-column>
        <el-table-column width="400" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="servicedetails(scope.$index, scope.row)">详情</el-button>
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              type="success"
              @click="selectTrigger(scope.$index, scope.row,onsellnum=1)"
              v-if="scope.row.onsell == '0'"
            >项目上架</el-button>
            <el-button
              type="success"
              @click="selectTrigger(scope.$index, scope.row,onsellnum=0)"
              v-if="scope.row.onsell == '1'"
            >项目下架</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 20px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5,6, 10, 30]"
          :page-size="6"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog title="服务分类管理" :visible.sync="dialogTableVisible">
      <div style="padding-bottom:10px">
        <el-popover placement="top" width="160" v-model="visible2">
          <el-input placeholder="请输入名称" v-model="title"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="addserve">确定</el-button>
          </div>
          <el-button type="primary" slot="reference">新建分类</el-button>
        </el-popover>
      </div>
      <div>
        <el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}" :data="gridData">
          <el-table-column property="date" label="商品名称" width="150">
            <template slot-scope="scope">
              <p>{{scope.row.title}}</p>
            </template>
          </el-table-column>
          <el-table-column property="date" label="排序" width="150">
            <template slot-scope="scope">
              <p>{{scope.row.sortNo}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="openchange(scope.$index, scope.row)">改名</el-button>
              <el-button type="danger" class="red" @click="delservice(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top: 20px;text-align:center">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            :page-sizes="[1, 3, 5, 10, 30]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
      </div>

      <div style="margin-top:10px" v-if="changenamedisplay">
        <el-input type="text" style="width:200px" v-model="changename"></el-input>
        <el-input type="number" style="width:200px" v-model="sortNo"></el-input>
        <el-button style="margin:10px" @click="changeName" class="red">保存</el-button>
        <el-button @click="changenamedisplay=false" class="red">取消</el-button>
      </div>
    </el-dialog>
    <!-- 服务详情 -->
    <el-dialog title="服务详情" :visible.sync="centerDialogVisible" width="60%">
      <div style="padding-left:20px;padding-right:20px">
        <p>
          <span class="span-title">服务名称：</span>
          {{serviced.title}}
        </p>
        <p>
          <span class="span-title">分&emsp;&emsp;类：</span>
          {{serviced.type.title}}
        </p>
        <p>
          <span class="span-title">售&emsp;&emsp;价：</span>
          {{serviced.price}}
        </p>
        <p>
          <span class="span-title">原&emsp;&emsp;价：</span>
          {{serviced.marketPrice}}
        </p>
        <p>
          <span class="span-title">服务时长：</span>
          {{serviced.serviceTime}}分钟
        </p>
        <div style="display:flex;">
          <p class="span-title">服务项目图：</p>
          <img style="with:100px;height:100px" :src="$imgurl()+serviced.imageUrl" alt="#" />
        </div>

        <p>
          <span class="span-title">排&emsp;&emsp;序：</span>
          {{serviced.sort}}
        </p>
        <p>
          <span class="span-title">已售数量：</span>
          {{serviced.sold}}
        </p>
        <div>
          <div class="p-content">
            <p class="span-title">服务介绍：</p>

            <div class="p-img" v-html="this.serviced.description"></div>
          </div>
        </div>
        <p style="margin-top:20px">
          <span class="span-title">温馨提示：</span>
          {{serviced.prompt}}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 服务编辑 -->
    <el-dialog title="编辑服务" @close="closeDialog" width="80%" :visible.sync="dialogFormVisible">
      <el-form ref="serviceform" :model="serviceform" label-width="120px">
        <el-form-item label="服务名称：" prop="title">
          <el-input style="width:200px" v-model="serviceform.title"></el-input>
        </el-form-item>
        <el-form-item label="选择分类" prop="typeId">
          <el-select v-model="serviceform.typeId" placeholder="选择服务分类">
            <el-option v-for="(v,i) in options" :key="i" :label="v.title" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售价：" prop="price">
          <el-input
            @mousewheel.native.prevent
            type="number"
            style="width:200px"
            v-model="serviceform.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="原价：">
          <el-input style="width:200px" v-model="serviceform.marketPrice"></el-input>
        </el-form-item>
        <el-form-item label="上架状态：" prop="onsell">
          <el-radio-group v-model="serviceform.onsell">
            <el-radio label="0">下架</el-radio>
            <el-radio label="1">上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务时长：">
          <el-input style="width:200px" v-model="serviceform.serviceTime"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" prop="imageUrl">
          <el-upload
            :action="$upfileUrl()"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :name="filename"
            :data="updata"
            :on-success="suss"
            :limit="1"
            :show-file-list="false"
          >
            <img v-if="serviceform.imageUrl" :src="$imgurl()+serviceform.imageUrl" style="width:100%;height:100%;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
          <!-- <el-upload
              :action="$upfileUrl()"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :name="filename"
              :on-success="suss"
              multiple
              :file-list="imgarr"
              :show-file-list="true"></el-upload> -->
        <el-form-item label="排序：">
          <el-input style="width:200px" v-model="serviceform.sort"></el-input>
        </el-form-item>
        <el-form-item label="已售数量：">
          <el-input style="width:200px" v-model="serviceform.sold"></el-input>
        </el-form-item>
        <el-form-item label="服务简介：" prop="subDescription">
          <el-input
            type="textarea"
            maxlength="200"
            show-word-limit
            :rows="4"
            v-model="serviceform.subDescription"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:10px" label="服务介绍：" prop="shopDesc">
          <tinymce-editor ref="editor" v-model="msg" toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | removeformat">
            <!-- :disabled="disabled" -->
          </tinymce-editor>
        </el-form-item>
        <el-form-item label="温馨提示">
          <el-input
            type="textarea"
            maxlength="200"
            show-word-limit
            :rows="4"
            v-model="serviceform.prompt"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button style="margin-left:10px" type="primary" @click="submitservice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TinymceEditor from "../../common/Tinymce";
import axios from "axios";
export default {
  name: "tabs",
  components: {
    TinymceEditor
  },
  data() {
    return {
      changename: "",
      sortNo:0,
      changenameid: "",
      changenamedisplay: false,
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      msg: "",
      filename: "file",

      options: [],

      dialogImageUrl: "",

      dialogFormVisible: false,
      centerDialogVisible: false,
      serviced: {
        type: {
          title: ""
        }
      },
      goodsTableData: [],
      multipleSelection: [],
      currentPage: 1, // 当前页
      pageSize: 6, // 每页条数
      total: 0, // 数据总条数
      currentPage1: 1, // 当前页
      pageSize1: 5, // 每页条数
      total1: 0, // 数据总条数
      is_search: false,
      editVisible: false,
      delVisible: false,
      dialogTableVisible: false,
      visible2: false,
      gridData: [], //模态框表格
      gridData1: [], //模态框表格
      title: "",
      selectData: {
        val: ""
      },
      keywords: "",
      serviceform: {
        title: "", //服务名称
        price: "", //售价
        marketPrice: "", //原价
        onsell: "", //上架状态
        imageUrl: "", //主图地址
        sold: "", //已售数量
        sort: "", //排序
        description: "", //服务介绍
        subDescription: "", //服务简介
        prompt: "", //温馨提示,
        serviceTime: "", //服务时长
        typeId: ""
      },
      typeId: "",
      imgarr: []
    };
  },

  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    closeDialog() {
      this.getGoodsListByPage();
    },
    gettypeid() {
      let params = {
        flag: false
      };
      this.req
        .post("/massage/type/list", params)
        .then(res => {
          console.log(res);
          this.options = res.data.data.resultList;
          console.log(this.options);
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
      console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    suss(response, file, fileList) {
      this.serviceform.imageUrl=response.data;
    },
    getGoodsListByPage() {
      let params;
      if (this.typeId == "") {
        params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          keywords: this.keywords
        };
      } else {
        params = {
          typeId: this.typeId
        };
      }
      this.req
        .post("/massage/list", params)
        .then(res => {
          this.goodsTableData = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(res);
          this.goodsTableData.map(v => {
            if (v.type == undefined) {
              return (v.type = "");
            }
          });
          // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          if (!res.data.data.resultList.length && this.currentPage !== 1) {
            this.currentPage -= 1; // 当前页码自减1
            this.getGoodsListByPage(); // 再次请求数据
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
    //添加服务类别
    addserve() {
      let params = {
        title: this.title,
        parentId: "0"
      };
      this.req
        .post("/massage/type/save", params)
        .then(res => {
          // console.log(res)
          this.visible2 = false;
          if (res.data.sub_code == "SUCCESS") {
            this.getserve();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 服务类别改名
    openchange(index, row) {
      this.changename = row.title;
      this.sortNo=row.sortNo;
      this.changenameid = row.id;
      this.changenamedisplay = true;
    },
    changeName() {
      let params = {
        sortNo:this.sortNo,
        title: this.changename,
        id: this.changenameid
      };
      this.req
        .post("/massage/type/name", params)
        .then(res => {
          this.visible2 = false;
          if (res.data.sub_code == "SUCCESS") {
            this.getserve();
            this.changenamedisplay = false;
            this.$message({
              type: "success",
              message: "改名成功"
            });
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取服务类别
    getserve() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize1
      };
      this.req
        .post("/massage/type/list", params)
        .then(res => {
          console.log(res);
          this.gridData = res.data.data.resultList;
          this.total1 = res.data.data.totalCount;
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取服务类别
    getallserve() {
      this.req
        .post("/massage/type/list")
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
    // 去添加服务
    addservice() {
      this.$router.push("/addservice");
    },
    //删除服务
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            smid: row.id
          };
          this.req
            .post("/massage/del", params)
            .then(res => {
              if (res.data.sub_code == "SUCCESS") {
                console.log(res);
                this.getGoodsListByPage();
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
    //服务详情
    servicedetails(index, row) {
      this.centerDialogVisible = true;
      this.serviced = row;
      console.log(this.serviced);
    },
    // 打开服务详情编辑
    handleEdit(index, row) {
      this.imgarr = [];
      this.dialogFormVisible = true;
      this.serviceform = row;
      this.serviceform.onsell = +row.onsell + "";
      this.msg = row.description;
      this.imgarr.push({
        url: this.$imgurl()+row.imageUrl,
        name: row.imageUrl,
        id: row.id
      });
      console.log(row);
      this.dialogImageUrl = row.imageUrl;
    },
    //保存编辑
    submitservice() {
      this.serviceform.description = this.msg;
      const params = {
        title: this.serviceform.title, //服务名称
        price: this.serviceform.price, //售价
        marketPrice: this.serviceform.marketPrice, //原价
        onsell: this.serviceform.onsell, //上架状态
        imageUrl: this.serviceform.imageUrl, //主图地址
        typeId: this.serviceform.typeId, //项目类别
        sold: this.serviceform.sold, //已售数量
        sort: this.serviceform.sort, //排序
        description: this.serviceform.description, //服务介绍
        subDescription: this.serviceform.subDescription, //服务简介
        prompt: this.serviceform.prompt, //温馨提示
        serviceTime: this.serviceform.serviceTime,
        id: this.serviceform.id
      };
      console.log(params);

      this.req
        .post("/massage/save", params)
        .then(res => {
          console.log(res.data.sub_code);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogFormVisible = false;
            this.getGoodsListByPage();
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
      this.getGoodsListByPage(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getGoodsListByPage(); // 调用分页函数
    },
    handleSizeChange1(val) {
      // 当每页显示条数改变
      this.pageSize1 = val;
      this.getserve(); // 调用分页函数
    },
    handleCurrentChange1(val) {
      // 当前页码改变
      this.currentPage1 = val;
      this.getserve(); // 调用分页函数
    },
    search() {
      this.is_search = true;
    },
    selectTrigger(val, id, onsellnum) {
      console.log(val, id, onsellnum);
      let params = {
        onsell: !+id.onsell,
        smid: id.id
      };
      this.req
        .post("/massage/update/onsell", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getserve();
            this.getGoodsListByPage();
            this.goodsTableData.map(item => {});
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delservice(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            id: row.id
          };
          this.req
            .post("/massage/type/del", params)
            .then(res => {
              if (res.data.sub_code == "SUCCESS") {
                console.log(res);
                this.getGoodsListByPage();
                this.getserve();
                this.getallserve();
                this.gettypeid();
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
    }
  },
  created() {
    this.getGoodsListByPage();
    this.getserve();
    this.getallserve();
    this.gettypeid();
  },
  mounted() {
    this.getGoodsListByPage();
    this.getserve();
    this.getallserve();
    this.gettypeid();
  },
  activated() {
    this.getGoodsListByPage();
    this.getserve();
    this.getallserve();
    this.gettypeid();
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
.el-dialog__wrapper {
  z-index: 1300 !important;
}
.v-modal {
  z-index: 1200 !important;
}
.p-img p img{
  height: 400px !important;
  width: 500px !important;
}
.p-img p{
  
  width: 500px !important;
}
</style>

