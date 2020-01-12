<template>
  <div class>
    <el-card shadow="never" style="margin-top:20px" class="box-card mgb20">
      <div slot="header" class="clearfix">
        <span>
          <el-button type="primary" @click="addtechnician">添加技师</el-button>
        </span>
        <div style="float: right; padding: 3px 0;display:flex;">
          <el-input type="text" placeholder="技师名、手机号" prop="keyword" v-model="form.keyword "></el-input>
          <el-button type="primary" @click="getData">搜索</el-button>
        </div>
      </div>
      <el-table
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="multipleTable"
        border
        class="table"
        ref="multipleTable"
      >
        <el-table-column label="姓名" width="280" align="center">
          <template slot-scope="scope">
            <div style="display:flex;">
              <img style="width:45px;height:45px;border-radius:50%" :src="scope.row.avatar|avatar" alt="#"/>
              <p style="line-height:45px;padding-left:10px">{{scope.row.userName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="telphone" label="手机号" width="280" align="center"></el-table-column>
        <el-table-column label="添加时间" width="280" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.initTime |dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="info" @click="watchdetail(scope.$index, scope.row)">查看详情</el-button>
            <el-button type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="warning" @click="getWorkerProdList(scope.row)">我的项目</el-button>
            <el-button type="primary" @click="relatedprojects(scope.$index, scope.row)">关联项目</el-button>
            <el-button type="danger" class="red" v-if="scope.row.agentApiData.status==1" @click="handleDe(scope.$index, scope.row,2)">禁用此技师</el-button>
            <el-button type="success" class="red" v-if="scope.row.agentApiData.status==2" @click="handleDe(scope.$index, scope.row,1)">启用此技师</el-button>
            <el-button type="danger" class="red" v-if="scope.row.workstatus==0" @click="workerstatus(scope.$index, scope.row,1)">上班</el-button>
            <el-button type="success" class="red" v-if="scope.row.workstatus==1" @click="workerstatus(scope.$index, scope.row,0)">休息</el-button>
            <el-button type="danger" @click="delWorker(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 20px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5,8 ,10, 30]"
          :page-size="8"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 技师编辑 -->
    <el-dialog title="技师信息编辑" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="头像上传" prop="PackingImage">
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
              <img v-if="form.avatar" :src="$imgurl()+form.avatar" style="width:100%;height:100%;">
              <i v-else class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="技师名称：">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="技师联系方式：">
          <el-input v-model="form.telphone"></el-input>
        </el-form-item>
        <el-form-item label="工作经验：">
          <el-input type="date" v-model="form.experience" placeholder="输入技师工作经验"></el-input>
        </el-form-item>
        <el-form-item label="多少人选择：">
          <el-input v-model="form.serviceNum"></el-input>
        </el-form-item>
        <el-form-item label="特长标签：">
          <el-select v-model="staffId" multiple placeholder="请选择" @change="staffIdval">
            <el-option v-for="item in gridData" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技师评分：">
          <el-input v-model="form.level"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍：">
          <el-input
            type="textarea"
            maxlength="200"
            show-word-limit
            :rows="4"
            placeholder="请填写温馨提示（选填）"
            v-model="form.descript"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">保存编辑</el-button>
      </div>
    </el-dialog>
    <!-- 技师详情 -->
    <el-dialog title="技师详情" :visible.sync="dialogVisible" width="40%">
      <div>
        <p>
          <img
            style="width:80px;height:80px;border-radius:50%"
            :src="techniciandetail.avatar|avatar"
            alt="#"
          />
        </p>
        <p>
          <span class="span-title">技师电话：</span>
          {{this.techniciandetail.telphone}}
        </p>
        <p>
          <span class="span-title">技师名称：</span>
          {{this.techniciandetail.userName}}
        </p>
        <p>
          <span class="span-title">工作经验：</span>
          {{this.techniciandetail.experience |dateformat('YYYY-MM-DD') }}至今
        </p>
        <p>
          <span class="span-title">多少人选择：</span>
          {{this.techniciandetail.serviceNum}}
        </p>
        <p>
          <span class="span-title">特长标签：</span>
          {{this.techniciandetail.massageType}}
        </p>
        <p>
          <span class="span-title">技师评分：</span>
          {{this.techniciandetail.level}}
        </p>
        <p style="word-wrap:break-word;word-break:break-all;">
          <span class="span-title">个人介绍：</span>
          {{this.techniciandetail.descript}}
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 服务关联项目 -->
    <el-dialog title="添加关联项目(已关联项目未展示)" :visible.sync="dialogVisiblee" width="50%">
      <div>
        <el-table
          :data="goodsTableData"
          tooltip-effect="dark"
          class="table"
          ref="multipleTable"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="项目名称" align="center">
            <template slot-scope="scope">
              <div style="display:flex;">
                <img style="width:45px;height:45px;" :src="scope.row.imageUrl|avatar"/>
                <div>
                  <div style="line-height:15px;padding:6px">{{scope.row.title}}</div>
                  <div style="line-height:15px;padding:5px">
                    <span style="font-size:14px">￥{{scope.row.price}}</span>
                    <span style="text-decoration:line-through">￥{{scope.row.marketPrice}}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="售价（元）" width="300" align="center">
            <template slot-scope="scope">{{scope.row.price}}</template>
          </el-table-column>
          <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblee = false">取消</el-button>
        <el-button type="primary" @click="eidtgoods">确定</el-button>
      </span>
    </el-dialog>
    <!-- 已关联项目 -->
    <el-dialog title="已关联项目" :visible.sync="dialogVisibleed" width="50%" v-loading="loading">
      <div>
        <el-table :data="workerProdList" tooltip-effect="dark" class="table" ref="multipleTablelist" :row-key="getRowKeys" 
          @selection-change="workerSelectionChange">
          <!-- <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column> -->
          <el-table-column label="项目名称">
            <template slot-scope="scope">
              <div style="display:flex;">
                <img style="width:45px;height:45px;border-radius:50%" :src="$imgurl()+scope.row.product.imageUrl" alt="#"/>
                <div style="display:inline-block;">
                  <div style="padding-left:5px">{{scope.row.product.title}}</div>
                  <div style="padding-left:5px">
                    <span style="font-size:14px">￥{{scope.row.product.price}}</span>
                    <span style="text-decoration:line-through;font-size:12px;">￥{{scope.row.product.marketPrice}}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="售价（元）" width="300" align="center">
            <template slot-scope="scope">{{scope.row.product.price}}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="danger" @click="delWorkerProd(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top:10px;text-align:center">
          <el-pagination @size-change="workerSizeChange" @current-change="workerCurrentChange" 
            :current-page="workerPageNo" :page-sizes="[10,20,30,50]" :page-size="workerPageSize" layout="total, sizes, prev, pager, next, jumper" :total="workertotal">
          </el-pagination>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleed = false">取消</el-button>
        <el-button type="primary" @click="eidtgoods">确定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "tabs",
  data() {
    return {
      dialogVisibleed:false,
      workerProdList:[],
      workerPageNo:0,
      workerPageSize:10,
      workertotal:0,
      currWorker:{},
      loading:false,
      techniciandetail: {},
      tableprojectid: [],
      multipleTable: [],
      gridData: [],
      staffId: [],
      dialogVisible: false,
      dialogVisiblee: false,
      dialogFormVisible: false,
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {
        shopman: "", //到店人
        //预约内容
        //手艺人
        //预约时间
        //上次服务时间
        //下单时间
        //下单人
        //预约门店
        name: "",
        date: "",
        address: ""
      },
      idx: -1,
      form: {
        avatar: "",
        userName: "",
        experience: "",
        serviceNum: "",
        massageTypeTitle: "",
        level: "",
        descript: "",
        tel: "",
        keyword: ""
      },
      imgarr: [],
      currentPage: 1, // 当前页
      pageSize: 8, // 每页条数
      total: 0, // 数据总条数
      currentPage1: 1, // 当前页
      pageSize1: 5, // 每页条数
      total1: 0, // 数据总条数
      updata: {
        type: "storeMassage"
      },
      filename: "file",
      dialogVisible: false,
      goodsTableData: "",
      multipleSelection: [],
      dialogImageUrl:'',
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      }
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
    workerSelectionChange(){
      // 已关联项目选择删除
    },
    workerSizeChange(val){
      // 关联项目改变页面数量
      this.workerPageNo = 1 ;
      this.workerPageSize = val ;
      this.getWorkerProdList(this.currWorker)
    },
    workerCurrentChange(val){
      // 关联项目改变当前页
      this.workerPageNo = val ;
      this.getWorkerProdList(this.currWorker)
    },
    delWorkerProd(row){
      var postData = {
        subbox:row.id
      }
      this.req.post("/worker/deletepro",postData).then(res=>{
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.$message.success("操作成功");
          this.getWorkerProdList(this.currWorker);
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    delWorker(row){
      this.$confirm('此操作将永久删除该技师, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          var postData = {
            id:row.id
          }
          this.req.post("/technician/delete",postData).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.$message.success("操作成功");
              this.getData();
            }else{
              this.$message.error(res.data.sub_msg);
            }
          })
      })
    },
    getWorkerProdList(row){
      // 获取技师已经关联项目
      // workerProdList
      this.loading=true;
      if(this.currWorker.id && this.currWorker.id!=row.id){
        this.workerPageNo = 1 ;
        this.workerPageSize = 10 ;
        this.currWorker = row
      }
      if(!this.currWorker.id){
        this.currWorker = row;
      }
      this.dialogVisibleed=true;
      var postData = {
        userId:row.id,
        pageNo:this.workerPageNo,
        pageSize:this.workerPageSize,
      }
      this.req.post("/worker/product",postData).then(res=>{
        this.loading=false;
        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
          this.workerProdList = res.data.data.resultList;
          this.workertotal = res.data.data.totalCount;
        }else{
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    // 获取 easy-mock 的模拟数据
    // 将图片上传到服务器，返回地址替换到md中
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.imgarr = file.url;
      this.dialogVisible = true;
    },
    suss(response, file, fileList) {
      this.form.avatar = response.data;
    },
    getData() {
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.form.keyword
      };

      // 发送请求给后端
      this.req
        .post("/technician/list", params)
        .then(res => {
          // 接收后端返回的数据
          console.log(res);
          // 判断
          this.multipleTable = res.data.data.resultList;
          this.total = res.data.data.totalCount;
          console.log(this.multipleTable);
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
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.imgarr = [];
      this.form = row;
      this.form.experience = moment(this.form.experience).format("YYYY-MM-DD");
      this.imgarr.push({
        url: `/img/${row.avatar}`,
        name: row.avatar,
        id: row.id
      });
      var massageType = row.massageType.split(',')
      // staffId
      this.staffId = [];
      this.gridData.forEach(item=>{
        console.log(massageType)
        if(massageType.indexOf(item.title)!=-1){
          this.staffId.push(item.id);
        }
      })
      this.dialogFormVisible = true;
    },
    handleDe(index, row, i) {
      const params = {
        status: i,
        id: row.agentApiData.id
      };
      console.log(params);
      this.req
        .post("/technician/updatestatus", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getData();
          } else {
            // this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上班休息
    workerstatus(index, row, i) {
      const params = {
        status: i,
        id: row.agentApiData.id
      };
      console.log(params);
      this.req
        .post("/technician/updateworkerstatus", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.getData();
          } else {
            // this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
    },
    handleSelectionChange(val) {
      let valarr = [];

      if (val) {
        val.forEach(row => {
          if (row) {
            valarr.push(row.id);
          }
        });
      }
      // val.map(item => {
      //   return valarr.push(item.id);
      // });
      this.multipleSelection = valarr;
      // this.multipleSelection = this.unique(this.multipleSelection)
      console.log(this.multipleSelection);
    },
    // 保存编辑
    saveEdit() {
      const params = {
        avatar: this.form.avatar,
        userName: this.form.userName,
        experience: this.form.experience,
        serviceNum: this.form.serviceNum,
        massageType: this.staffId.toString(),
        level: this.form.level,
        descript: this.form.descript,
        telphone: this.form.tel,
        id: this.form.id,
        cateStr: this.cateStr
      };
      console.log(params);
      this.req.post("/technician/save", params).then(res => { 
          console.log(res);
          this.imgarr = [];
          if (res.data.sub_code == "SUCCESS") {
            this.dialogFormVisible = false;
            this.getData();
          } else {
            this.$message.error(res.data.sub_msg);
          }
        });
    },
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.getData(); // 调用分页函数
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      this.getData(); // 调用分页函数
    },
    handleSizeChange1(val) {
      // 当每页显示条数改变
      this.pageSize1 = val;
      this.getGoodsListByPage(); // 调用分页函数
    },
    handleCurrentChange1(val) {
      // 当前页码改变
      this.currentPage1 = val;
      this.getGoodsListByPage(); // 调用分页函数
    },
    getserve() {
      this.req.post("/massage/type/list").then(res => {
          if (res.data.sub_code == "SUCCESS") {
            this.gridData = res.data.data.resultList;
          }
      });
    },
    //关联项目
    relatedprojects(index, row) {
      this.$refs.multipleTable.clearSelection();
      this.tableprojectid = row.id;
      this.dialogVisiblee = true;
      this.getGoodsListByPage();
    },
    getWorkerProd(){

    },
    //获取服务项目
    getGoodsListByPage() {
      let params = {
        uid:this.tableprojectid,
        pageNo: this.currentPage1,
        pageSize: this.pageSize1
      };
      this.req.post("/worker/prodlist", params).then(res => {
          if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
            this.goodsTableData = res.data.data.resultList;
            this.total1 = res.data.data.totalCount;
          }
          // console.log(res);
          // this.goodsTableData.map(v => {
          //   if (v.type == undefined) {
          //     return (v.type = "");
          //   }
          // });
          // // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
          // if (!res.data.data.resultList.length && this.currentPage !== 1) {
          //   this.currentPage -= 1; // 当前页码自减1
          //   this.getGoodsListByPage(); // 再次请求数据
          // }
          // if (res.data.sub_code == "220") {
          // } else {
          //   // this.$message.error(res.data.sub_msg);
          // }
        })
    },
    // old
    getGoodsListByPageOld() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize1
      };
      this.req
        .post("/massage/list", params)
        .then(res => {
          this.goodsTableData = res.data.data.resultList;
          this.total1 = res.data.data.totalCount;
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
          if (res.data.sub_code == "220") {
          } else {
            // this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存选中关联项目
    eidtgoods() {
      let params = {
        subbox: this.multipleSelection.toString(),
        uid: this.tableprojectid
      };
      this.req
        .post("/worker/saveprod", params)
        .then(res => {
          console.log(res);
          if (res.data.sub_code == "SUCCESS") {
            this.dialogVisiblee = false;
          } else {
            // this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //技师详情
    watchdetail(index, row) {
      this.techniciandetail = row;
      console.log(this.techniciandetail);
      this.dialogVisible = true;
    },
    addtechnician() {
      this.$router.push("/addtechnician");
    },
    staffIdval(val) {
      console.log(this.staffId.length);
      console.log(val)
      if (this.staffId.length > 5) {
        this.staffId.pop();
      }
    }
  },
  created() {
    this.getData();
    this.getserve();
    this.getGoodsListByPage();
  },
  mounted() {
    this.getData();
    this.getserve();
    this.getGoodsListByPage();
  },
  activated() {
    this.getData();
    this.getserve();
    this.getGoodsListByPage();
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
.el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;
}
</style>

