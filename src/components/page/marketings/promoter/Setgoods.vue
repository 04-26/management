<template>
  <div style="width:100%">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/推广员</span>
      </div>
      <div>
        <!-- 上半部分 -->
        <el-row>
          <el-col class="bookingtop-left" :span="8">
            <p>
              推广员使用介绍：为店铺打造人人皆可推广的系统。
              邀请客户、员工、合作方等成为推广员，推广成功后发佣金。
            </p>
            <p class="left-p2">
              <span>使用教程</span>
              <span>活动案例</span>
            </p>
          </el-col>
        </el-row>
        <!-- 下半部分 -->
        <div>
          <div class="booking-bottom">
            <p class="bottom-item">
              <span style="margin-right:15px">
                  <router-link style="padding:5px 10px;text-decoration: none;" to="/promoter">推广员</router-link>
              </span>
              <span style="margin-right:15px">
                  <router-link style="padding:5px 10px;text-decoration: none;" to="/promoteaudit">推广员审核</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link style="padding:5px 10px;text-decoration: none;" to="/promotionset">推广设置</router-link>
              </span>
              <span style="margin-right:15px" class="active">
                <router-link
                  style="padding:5px 10px;text-decoration: none;"
                  class="active-a"
                  to="/setgoods"
                >设置商品</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link
                  style="padding:5px 10px;text-decoration: none;"
                  to="/promoterrecruit"
                >推广招募</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link
                  style="padding:5px 10px;text-decoration: none;"
                  to="/promoterorder"
                >推广订单列表</router-link>
              </span>
              <span style="margin-right:15px">
                <router-link
                  style="padding:5px 10px;text-decoration: none;"
                  to="/prodrawalmanagement"
                >推广提现设置</router-link>
              </span>
            </p>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <p>
              <el-button type="primary" @click="addMassage(1)">添加服务</el-button>
              <el-button type="primary" @click="addMassage(2)">添加会员卡</el-button>
              <el-button type="primary" @click="addMassage(3)">添加拼团活动</el-button>
              <el-button type="primary" @click="addMassage(4)">添加砍价活动</el-button>
              <el-button type="primary" @click="addMassage(5)">添加商品</el-button>
            </p>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="服务项目" name="first">
              <ServiceMassage :tableData="tableData" @edit-item="openItem" @del-item="delItem"></ServiceMassage>
            </el-tab-pane>
            <el-tab-pane label="会员卡" name="second">
              <ServiceMassage :tableData="tableData" @edit-item="openItem" @del-item="delItem"></ServiceMassage>
            </el-tab-pane>
            <el-tab-pane label="拼团活动" name="third">
              <ServiceMassage :tableData="tableData" @edit-item="openItem" @del-item="delItem"></ServiceMassage>
            </el-tab-pane>
            <el-tab-pane label="砍价活动" name="fourth">
              <ServiceMassage :tableData="tableData" @edit-item="openItem" @del-item="delItem"></ServiceMassage>
            </el-tab-pane>
            <el-tab-pane label="商品列表" name="five">
              <ServiceMassage :tableData="tableData" @edit-item="openItem" @del-item="delItem"></ServiceMassage>
            </el-tab-pane>
          </el-tabs>
          <div style="margin-top: 20px;text-align:center;">
            <el-pagination @size-change="tabSizeChange" @current-change="tabCurrentChange" 
              :current-page="tpageNo" :page-sizes="[10, 50,100, 200]" :page-size="tpageSize" layout="total, sizes, prev, pager, next, jumper" :total="tabtotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 服务项目 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="closeDialog" :close-on-click-modal='false' :close-on-press-escape='false' :destroy-on-close='true'>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
          <div></div>
          <div style="text-align:right;">
            <el-select v-model="massageCateId" placeholder="全部分类" style="vertical-align:bottom;width:100px;" @change="statusChange" v-if="form.type==1 || form.type==2">
              <el-option label="全部分类" :value="0" v-if="form.type==1"></el-option>
              <el-option v-for="item in massageCate" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-cascader v-if="activeName=='five'"
                :options="massageCate"
                v-model="menu"
                :props="{value:'id',label:'name'}"
                placeholder="请选择商品所属分类"
                :change-on-select='true'
                >
            </el-cascader>
            <el-input style="width:150px;border-right-radius:0px;" type="text" v-model="keyword" :placeholder="holder"></el-input>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </div>
        </div>
        <el-table :data="options" border class="table" ref="massageSel" @selection-change="handleSelectionChange" :row-key="getRowKeys1">
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column prop="title" label="名称"></el-table-column>
          <el-table-column prop="price" label="价格（元）"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top: 20px;text-align:center;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="currentPage" :page-sizes="[1, 3, 5, 10, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <el-form ref="form" :model="form" style="margin-top:10px;" :rules="rules" :inline-message='true'>
          <el-form-item label="设置佣金" prop="countType" style="margin-bottom:0px;">
            <el-radio-group v-model="form.countType">
              <el-radio :label="0">按照百分比</el-radio>
              <el-radio :label="1">按照固定金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.countType==0">
            <div style="display:flex;">
              <el-form-item label="直接推广提成" prop="firstamount" style="flex:1;margin-bottom:0px;">
                <el-input placeholder="请输入提成百分比" v-model="form.firstamount" style="width:220px;" :max="100" :min="1" type="number">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item label="间接推广提成" prop="secdamount" style="flex:1;margin-bottom:0px;">
                <el-input placeholder="请输入提成百分比" v-model="form.secdamount" style="width:220px;" :max="100" :min="1" type="number">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
          </template>
          <template v-if="form.countType==1">
            <div style="display:flex;">
              <el-form-item label="直接推广提成" prop="firstamount" style="flex:1;margin-bottom:0px;" >
                <el-input placeholder="请输入提成金额" v-model="form.firstamount" style="width:220px;" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="间接推广提成" prop="secdamount" style="flex:1;margin-bottom:0px;">
                <el-input placeholder="请输入提成金额" v-model="form.secdamount" style="width:220px;" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
          </template>
        </el-form>
        <div style="color:red;width:90%;">
          <p> 温馨提示：设置时请考虑，用户使用优惠劵、折扣卡、充值卡、次卡等优惠方式下单是否有提成，为了让推广员积极分享，系统默认均有提成，组合商品订单，按照分佣商品售价计算提成。</p>
          <div style="text-align:center;">
              <el-button type="primary" @click="addMassageAndOpt">确定</el-button>
              <el-button type="default" @click="closeMassageDialog">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑推广 -->
    <el-dialog :visible.sync="editVisible" :close-on-click-modal='false' :close-on-press-escape='false' :destroy-on-close='true'>
      <div>
        <ServiceMassage :tableData="itemTableData" :noOpt="true" :showTime="true"></ServiceMassage>
        <el-form ref="form" :model="form" style="margin-top:10px;" :rules="rules" :inline-message='true'>
          <el-form-item label="设置佣金" prop="countType" style="margin-bottom:0px;">
            <el-radio-group v-model="form.countType">
              <el-radio :label="1">按照固定金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.countType==1">
            <div style="display:flex;">
              <el-form-item label="直接推广提成" prop="firstamount" style="flex:1;margin-bottom:0px;" >
                <el-input placeholder="请输入提成金额" v-model="form.firstamount" style="width:220px;" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="间接推广提成" prop="secdamount" style="flex:1;margin-bottom:0px;">
                <el-input placeholder="请输入提成金额" v-model="form.secdamount" style="width:220px;" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
          </template>
        </el-form>
        <div style="color:red;width:90%;">
          <p> 温馨提示：设置时请考虑，用户使用优惠劵、折扣卡、充值卡、次卡等优惠方式下单是否有提成，为了让推广员积极分享，系统默认均有提成，组合商品订单，按照分佣商品售价计算提成。</p>
          <div style="text-align:center;">
              <el-button type="primary" @click="editItem">确定</el-button>
              <el-button type="default" @click="closeItem">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ServiceMassage from '@/components/common/ServiceMassage.vue'
import _ from 'lodash'
import { setTimeout } from 'timers';
import helper from '@/utils/helper.js';
export default {
  data() {
    // 验证取值范围
    var validatefirstamount=(rule, value, callback)=>{
      if(this.form.countType==0 && (value<1 || value>100)){
        callback(new Error('取值范围为1到100'));
      }
      if(this.form.countType==1 && value<1){
        callback(new Error('取值不能为负数'));
      }
      callback();
    }
    return {
      getRowKeys1(row) {
        return row.id;
      },
      title:'选择服务',
      holder:'请输入服务名称',
      activeName:'first',
      tableData: [],
      value1: "",
      value2: "",
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 数据总条数,
      options: [],
      keyword:'',
      massageCateId:'',
      vipcardTypeId:3,
      dialogFormVisible: false,
      editVisible: false,
      massageList:[],
      massageCate:[],
      form:{
        countType:0,
        type:1,
        firstamount:'',
        secdamount:'',
      },
      rules:{
        countType:[{ required: true}],
        firstamount:[
          { required: true, message: '请输入直接提成', trigger: 'blur' },
          { validator:validatefirstamount, trigger: 'blur'},
        ],
        secdamount:[
          { required: true, message: '请输入间接提成', trigger: 'blur' },
          { validator:validatefirstamount, trigger: 'blur'},
        ]
      },
      tpageSize:10,
      tpageNo:1,
      itemTableData:[],
      tabtotal: 0, // 数据总条数,
      menu:[]
    };
  },
  watch: {
    'form.countType':function(v,o){
        this.form.firstamount=''
        this.form.secdamount=''
    }
  },
  created() {
    this.getMassageCate();
    this.getmangageitem();
    this.getTableDate();
  },
  methods: {
    statusChange(v){
      this.massageCateId = v;
    },
    handleClick(vm){
      if(vm.name=='first'){
        this.form.type=1;
      }
      if(vm.name=='second'){
        this.form.type=2;
      }
      if(vm.name=='third'){
        this.form.type=3;
      }
      if(vm.name=='fourth'){
        this.form.type=4;
      }
      if(vm.name=='five'){
        this.form.type=5;
      }
      this.tpageSize=10;
      this.tpageNo=1;
      this.tableData=[];
      setTimeout(()=>{
        this.getTableDate();
      },100);
    },
    onSubmit(){
        this.currentPage = 1;
        if(this.form.type==1){
            var postData = {
              typeId:this.massageCateId,
              keywords:this.keyword,
              pageNo: this.currentPage,
              pageSize: this.pageSize
            }
            if(this.massageCateId==0){
              delete postData.typeId;
            }
    
            this.req.post("/massage/list", postData).then(res => {
              if (res.data.sub_code == "SUCCESS") {
                this.options = res.data.data.resultList;
                this.total = res.data.data.totalCount;
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
        }
        if(this.form.type==2){
          this.getVipCard();
        }
        if(this.form.type==3){
          this.getAessList();
        }
        if(this.form.type==4){
          this.getBarginList();
        }
        if(this.form.type==5){
          this.getProductList();
        }
    },
    proving1(e) {
      var keynum = window.event ? e.keyCode : e.which;
      var keychar = String.fromCharCode(keynum);

      if (keynum == 189 || keynum == 190 || keynum == 110 || keynum == 109) {
        e.target.value = "";
      }
    },
    handleSizeChange(val) {
      // 当每页显示条数改变
      this.pageSize = val;
      this.pageNo=1;
      if(this.form.type==1){
        this.getmangageitem(); // 调用分页函数
      }
      if(this.form.type==2){
        this.getVipCard(); // 调用分页函数
      }
      if(this.form.type==3){
        this.getAessList(); // 调用分页函数
      }
      if(this.form.type==4){
        this.getBarginList(); // 调用分页函数
      }
      if(this.form.type==5){
        this.getProductList(); // 调用分页函数
      }
    },
    handleSelectionChange(val){
      this.massageList=[];
      this.$forceUpdate();
      val.forEach((item)=>{
        var itemo = {
          "title":item.title,
          "itemId":item.id,
          "price":item.price,
          "imgUrl":item.imageUrl
        }
        this.massageList.push(itemo);
      });
      
    },
    handleCurrentChange(val) {
      // 当前页码改变
      this.currentPage = val;
      if(this.form.type==1){
        this.getmangageitem(); // 调用分页函数
      }
      if(this.form.type==2){
        this.getVipCard(); // 调用分页函数
      }
      if(this.form.type==3){
        this.getAessList(); // 调用分页函数
      }
      if(this.form.type==4){
        this.getBarginList(); // 调用分页函数
      }
      if(this.form.type==5){
        this.getProductList(); // 调用分页函数
      }
    },
    tabSizeChange(val) {
      // 当每页显示条数改变
      this.tpageSize = val;
      this.tpageNo=1;
      this.getTableDate();
    },
    tabCurrentChange(val) {
      // 当前页码改变
      this.tpageNo=val;
      this.getTableDate();
    },
    getmangageitem() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.req.post("/massage/list", params).then(res => {
        if (res.data.sub_code == "SUCCESS") {
          
          this.options = res.data.data.resultList;
          this.total = res.data.data.totalCount;
        } else {
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getMassageCate(){
      // 获取全部产品分类
      // /massage/type/list
      this.req.post("/massage/type/list",{}).then(res => {
        if (res.data.sub_code == "SUCCESS") {
            this.massageCate = res.data.data.resultList;
        } else {
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getTableDate(){
      // 获取推广商品名称
      // /promoter/item/list
      let params = {
        type:this.form.type,
        pageNo: this.tpageNo,
        pageSize: this.tpageSize
      };
      this.req.post("/promoter/item/list",params).then(res => {
        if (res.data.sub_code == "SUCCESS") {
            this.tpageNo = res.data.data.pageNo;
            this.tableData = res.data.data.resultList;
            this.tabtotal = res.data.data.totalCount;
        } else {
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getVipCard(){
      // 获取所有会员卡
      // /vipcard/list
      var postData = {
        kind:this.massageCateId,
        keywords:this.keyword,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      var time = new Date();
      postData.startTime = this.$moment().format('Y-MM-DD HH:mm:ss');
      postData.endTime = this.$moment().format('Y-MM-DD HH:mm:ss');
      this.req.post("/vipcard/list",postData).then(res => {
        if (res.data.sub_code == "SUCCESS") {
            this.options = res.data.data.resultList;
            this.total = res.data.data.totalCount;
            this.options.forEach(item=>{
                item.price = item.amount;
            })
        } else {
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getBarginList(){
      // 获取砍价
      // /bargain/list
      var postData = {
        keywords:this.keyword,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        status:2
      }
      this.req.post("/bargain/list",postData).then(res => {
        if (res.data.sub_code == "SUCCESS") {
            this.options = res.data.data.resultListVo;
            this.total = res.data.data.totalCount;
            this.options.forEach(item=>{
                item.price = item.lowPrice;
            })
        } else {
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getAessList(){
      // 获取所有拼团
      // /assemble/list
      var postData = {
        keywords:this.keyword,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        fliter:2,
      }
      if(this.keyword.length==0){
        delete postData.keywords;
      }
      this.req.post("/assemble/list",postData).then(res => {
        if (res.data.sub_code == "SUCCESS") {
            this.options = res.data.data.resultList;
            this.total = res.data.data.totalCount;
            this.options.forEach(item=>{
                item.price = item.actionPrice;
                item.title = item.name;
            })
        } else {
          this.$message.error(res.data.sub_msg);
        }
      })
    },
    getProductList(){
        var postData = {
          keywords:this.keyword,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        if(this.menu){
          postData.menu1=this.menu[0];
          postData.menu2=this.menu[1];
        }
        this.req.post("/product/list",postData).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                this.options = res.data.data.list;
                this.options.forEach(item=>{
                  item.title = item.name;
                })
                this.total = res.data.data.totalPage*this.pageSize;
            }else{
                this.$message.error(res.data.sub_msg);
            }
        })
    },
    getCateList(){
        var param = {};
        this.req.post("/product/type/list",param).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                this.massageCate = res.data.data;
                this.massageCate = helper.sort(this.massageCate,'sort');
                this.massageCate = helper.tree(this.massageCate,0,'parentid');
            }else{
                this.$message.error(res.data.sub_msg);
            }
        })
    },
    addMassage(type){
      this.massageList=[];
      this.form.type=type;
      this.dialogFormVisible=true;
      this.options=[];
      this.getTableDate();
      this.keyword='';
      if(type==1){
        this.title="选择服务项目";
        this.holder="请输入服务项目名称";
        this.activeName="first";
        this.massageCate=[];
        this.getMassageCate();
        this.getmangageitem();
      }
      if(type==2){
        this.title="选择会员卡";
        this.holder="请输入会员卡名称";
        this.activeName="second";
        this.massageCate = [
          {title:'全部卡项',id:3},
          {title:'次数卡',id:0},
          {title:'折扣卡',id:1},
          {title:'充值卡',id:2},
        ];
        this.massageCateId=3;
        this.getVipCard();
      }
      if(type==3){
        this.title="选择拼团活动";
        this.holder="请输入拼团名称";
        this.activeName="third";
        this.massageCate=[];
        this.getAessList();
      }
      if(type==4){
        this.title="选择砍价活动";
        this.holder="请输入砍价活动名称";
        this.activeName="fourth";
        this.massageCate=[];
        this.getBarginList();
      }
      if(type==5){
        this.title="选择推广商品";
        this.holder="请输入推广商品名称";
        this.activeName="five";
        this.massageCate=[];
        this.getCateList();
        this.getProductList();
      }
    },
    addMassageAndOpt(){
      // 添加项目和设置
      if(this.massageList.length==0){
        this.$message.error('还没添加要推广的服务项目');
        return ;
      }
      this.$refs['form'].validate((valid) => {
          if (valid) {
            var params = {}
            this.massageList.forEach((item,index)=>{
              params['i['+index+'].title'] = item.title;
              params['i['+index+'].itemId'] = item.itemId;
              params['i['+index+'].price'] = item.price;
              params['i['+index+'].imgUrl'] = item.imgUrl;
            });

            params['countType'] = this.form.countType;
            params['type'] = this.form.type;
            params['firstamount'] = this.form.firstamount;
            params['secdamount'] = this.form.secdamount;

            this.req.post("/promoter/item/save", params).then(res => {
              if (res.data.sub_code == "SUCCESS") {
                this.dialogFormVisible=false;
                this.form.firstamount='';
                this.form.secdamount='';
                this.currentPage=1;
                this.$refs['massageSel'].clearSelection();
                this.getTableDate();
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
          } else {
            return false;
          }
        });
    },
    closeDialog(done){
      this.massageList=[];
      this.currentPage=1;
      this.$refs['massageSel'].clearSelection();
      setTimeout(()=>{
        done();
      },100)
    },
    closeMassageDialog(){
      this.massageList=[];
      this.currentPage=1;
      this.$refs['massageSel'].clearSelection();
      this.dialogFormVisible=false;
    },
    closeItem(){
      this.editVisible=false;
      this.itemTableData=[];
      this.form.countType=0;
      this.form.firstamount='';
      this.form.secdamount='';
    },
    openItem(index,row){
      this.editVisible=true;
      this.itemTableData.push(row);
      this.form.countType=1;
      setTimeout(()=>{
        this.$set(this.form,'firstamount',row.firstamount);
        this.form.secdamount=row.secdamount;
        this.$forceUpdate();
      },100)
    },
    editItem(index,row){
      // 编辑推广
      // /promoter/item/update/change
      var postData = {
        id:this.itemTableData[0].id,
        countType:this.form.countType,
        firstamount:this.form.firstamount,
        secdamount:this.form.secdamount,
      }
      this.req.post("/promoter/item/update/change",postData).then(res=>{
          if(res.data.code=='SUCCESS' && res.data.sub_code=="SUCCESS"){
            this.itemTableData=[]
            this.editVisible=false;
            this.form.countType=0;
            this.form.firstamount='';
            this.form.secdamount='';
            this.getTableDate();
            this.$message.success("操作成功");
          }else{
            this.$message.error(res.data.sub_msg);
          }
      })

    },
    delItem(index,row){
      // 删除推广
      // /promoter/item/update/del
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.req.post("/promoter/item/update/del",{id:row.id}).then(res=>{
            if(res.data.code=='SUCCESS' && res.data.sub_code=="SUCCESS"){
              this.getTableDate();
              this.$message.success("操作成功");
            }else{
              this.$message.error(res.data.sub_msg);
            }
          })
        });
    }
  },
  components:{
    ServiceMassage,
  }
};
</script>

<style scoped>
.bookingtop-left > p {
  line-height: 30px;
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
}
.bottom-item > span {
  display: inline-block;
  padding: 5px;
  border: 1px solid #c9c7c7;
}
.bordernone {
  border-right: none !important;
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
.active {
  background: #07c4a8;
  border: none;
}
.active-a {
  color: #fff;
}
</style>