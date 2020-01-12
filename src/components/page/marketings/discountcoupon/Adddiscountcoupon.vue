<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/优惠劵/新建优惠劵</span>
      </div>
      <div>
        <el-form :rules="rules" ref="discountForm" :model="discountForm" label-width="120px">
          <el-form-item label="优惠券名称" prop="title">
            <el-input placeholder="请输入优惠券名称" style="width:200px" v-model="discountForm.title"></el-input>
          </el-form-item>
          <el-form-item label="选择有效期类型" prop="datanum">
            <el-radio-group v-model="discountForm.datanum">
              <el-radio label="1">天数</el-radio>
              <el-radio label="2">日期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="discountForm.datanum=='2'"
            style="width: 500px;"
            label="使用有效期"
            prop="Timelist"
          >
            <el-date-picker
              v-model="discountForm.Timelist"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels="false"
            ></el-date-picker>
           
          </el-form-item>
          <el-form-item
            v-if="discountForm.datanum=='1'"
            style="width: 500px;"
            label="使用有效期"
            prop="validate"
          >
            <el-input
              @mousewheel.native.prevent
              type="number"
              style="width:200px"
              v-model="discountForm.validate"
            ></el-input>天
          </el-form-item>
          <el-form-item label="优惠方式" prop="type">
            <el-radio-group v-model="discountForm.type">
              <el-radio label="1">满减券</el-radio>
              <el-radio label="2">折扣券</el-radio>
              <el-radio label="4">现金券</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="discountForm.type == '1'" label="满" prop="limitAmount">
            <el-input
              @mousewheel.native.prevent
              type="number"
              style="width:200px"
              v-model="discountForm.limitAmount"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="discountForm.type == '1'" label="减" prop="discount">
            <el-input
              @mousewheel.native.prevent
              type="number"
              style="width:200px"
              v-model="discountForm.discount"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="discountForm.type == '4'" label="现金券面值" prop="discount">
            <el-input
              placeholder="优惠券面值应为整数"
              type="number"
              style="width:200px"
              v-model="discountForm.discount"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item v-if="discountForm.type == '2'" label="折扣" prop="discount">
            <el-input
              placeholder="请输入1-9.9的折扣数"
              type="number"
              style="width:200px"
              v-model="discountForm.discount"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item label="类型选择" prop="useType">
            <el-radio-group v-model="discountForm.useType" @change="changeUseType">
              <el-radio :label="0">全部通用</el-radio>
              <el-radio :label="1">指定项目</el-radio>
              <el-radio :label="2">通用项目</el-radio>
              <el-radio :label="3">通用商品</el-radio>
              <el-radio :label="4">指定商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" v-if="istypes(discountForm.useType)">
              <el-button type="primary" @click="dialogVisible=true">添加商品</el-button>
              <el-table :data="items" style="width: 600px;" v-if="items.length>0">
                <el-table-column prop="name" label="名称">
                    <template slot-scope="scope">
                    <div style="display:flex;align-items:center;">
                        <el-image style="width: 45px; height: 45px;margin-right:5px;" :src="$imgurl()+scope.row.imageUrl" fit="cover"></el-image>
                        <div style="font-size:12px;line-height:24px;" v-if="discountForm.useType==1">{{scope.row.title?scope.row.title.substr(0,20):''}}{{scope.row.title && scope.row.title.length>20?'...':''}}</div>
                        <div style="font-size:12px;line-height:24px;" v-if="discountForm.useType==4">{{scope.row.name?scope.row.name.substr(0,20):''}}{{scope.row.name && scope.row.name.length>20?'...':''}}</div>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="60">
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="scope">
                      <div>
                          <el-button type="warning" @click="removeItem(scope.row)" size="mini">移除</el-button>
                      </div>
                  </template>
                </el-table-column>
              </el-table>
          </el-form-item>
          <el-form-item v-if="discountForm.useType=='1' && false" label="指定服务项目" prop="itemIds">
            <el-select v-model="discountForm.itemIds" placeholder="请输入关键字选择" filterable remote :remote-method="gettypeid" :loading="loading">
              <!-- multiple -->
              <el-option
                v-for="item in gridData"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放总量" prop="couponCount">
            <el-input
              placeholder="数量只能输正整数"
              type="number"
              style="width:200px"
              v-model="discountForm.couponCount"
              @mousewheel.native.prevent
            ></el-input>
            <span style="color:#606266;padding-left:10px">请输入整数，输入0为无限制</span>
          </el-form-item>
          <el-form-item label="用户获取方式" prop="recvPos">
            <el-checkbox-group v-model="discountForm.recvPos">
              <el-checkbox label="1">进店首页弹窗</el-checkbox>
              <el-checkbox label="2">领劵页面领取</el-checkbox>
              <el-checkbox label="3">抽奖页面</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="每人限领" prop="sendNum">
            <el-input
              @mousewheel.native.prevent
              type="number"
              style="width:200px"
              v-model="discountForm.sendNum"
            ></el-input>
            <span style="color:#606266;padding-left:10px">0为不限制，大于0就为限制张数</span>
          </el-form-item>
          <el-form-item label="优惠券规则" prop="note">
            <el-input
              style="width:400px"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="discountForm.note"
              maxlength="255"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="editor-btn" type="primary" @click="adddiscountForm">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog :title="dtitle" :visible.sync="dialogVisible" width="600px">
      <div>
        <div class="search-head">
            <el-input v-model="keywords" placeholder="请输入商品名称">
                <template slot="append">
                    <div>
                        <el-button type="info" icon="el-icon-search" @click="search">搜索</el-button>
                    </div>
                </template>
            </el-input>
        </div>
        <el-table :data="addProds" style="width: 100%">
          <el-table-column prop="title" label="名称">
            <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
                <el-image style="width: 45px; height: 45px;margin-right:5px;" :src="$imgurl()+scope.row.imageUrl" fit="cover"></el-image>
                <div style="font-size:12px;line-height:24px;" v-if="discountForm.useType==1">{{scope.row.title?scope.row.title.substr(0,20):''}}{{scope.row.title && scope.row.title.length>20?'...':''}}</div>
                <div style="font-size:12px;line-height:24px;" v-if="discountForm.useType==4">{{scope.row.name?scope.row.name.substr(0,20):''}}{{scope.row.name && scope.row.name.length>20?'...':''}}</div>
            </div>
             </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="80">
          </el-table-column>
          <el-table-column label="操作" width="100" align="right">
            <template slot-scope="scope">
                <div>
                    <el-button type="primary" @click="addItem(scope.row)" size="mini">选择</el-button>
                </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:center;" 
            :current-page="pageNo" :page-sizes="[5, 10, 30]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import loadash from 'lodash';
export default {
  data() {
    return {
      discountForm: {
        title: "", //优惠券名称
        type: "", //优惠券类型1-普通优惠券，2-贬值券，3-礼品券
        discount: "", //折扣的现金
        limitAmount: "", //满减限制,满减券为最低金额限制.折扣券为最高折扣金额，0表示不限制
        validate: "", //有效期领取多少天后失效
        itemIds: [], //关联的项目id数组
        status: "", //
        startTime: "", //优惠券可使用的开始时间
        endTime: "", //优惠券可使用的结束时间
        couponCount: "", //发放优惠券总数
        note: "", //优惠券规则说明
        sendNum: "", //每次发放多少张，0-不限制
        useType: "", //优惠券使用类型,  0=通用 ，1 = 项目
        shopId: "", //优惠券所属店铺
        recvPos: [], //优惠券前台发放位置，1=进店首页弹窗，2=支付页面,3=抽奖页面
        datanum: "",
        Timelist: [],
      },
      loading:false,
      gridData: [],
      remnant: 0, //输入数
      rules: {
        title: [
          {
            required: true,
            message: "请输入优惠券名称",
            trigger: "blur"
          },
          {
            type: "string",
            max: 8,
            message: "优惠卷名称不能超过8个字符",
            trigger: "blur"
          }
        ],
        datanum: [
          { required: true, message: "请选择有效期类型", trigger: "blur" }
        ],
        Timelist: [
          { required: true, message: "请输入有效期日期", trigger: "blur" }
        ],
        validate: [
          { required: true, message: "请输入有效期天数", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择优惠方式", trigger: "blur" }],
        useType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        itemIds: [
          { required: true, message: "请指定服务项目", trigger: "blur" }
        ],
        couponCount: [
          { required: true, message: "请输入发放总量", trigger: "blur" }
        ],
        recvPos: [
          { required: true, message: "请选择用户获取方式", trigger: "blur" }
        ],
        sendNum: [
          { required: true, message: "请设置每人限领", trigger: "blur" }
        ],
        note: [{ required: true, message: "请填写优惠券规则", trigger: "blur" }]
      },
      dtitle:'添加',
      dialogVisible:false,
      addProds:[],
      keywords:'',
      mloading:false,
      totalCount:0,
      pageSize:5,
      pageNo:1,
      items:[],
    };
  },
  created(){
    if(localStorage.getItem('couponId')){
      this.getCoupon();
    }
  },
  methods: {
    istypes(val){
      if(val==1 || val==4){
        return true;
      }else{
        return false;
      }
    },
    getCoupon(){ // 编辑优惠券 未写，需要详情接口。功能暂时无
      // var param = {id:}
    },
    adddiscountForm() {
      this.$refs.discountForm.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          if([1,4].indexOf(this.discountForm.useType)!=-1){
            if(this.items.length==0){
              this.$message.error('请添加商品或者服务项目');
              return ;
            }
            this.discountForm.itemIds = [];
            this.items.forEach(item=>{
              this.discountForm.itemIds.push(item.id);
            });
          }

          let params = {
            title: this.discountForm.title, //优惠券名称
            type: this.discountForm.type, //优惠券类型1-普通优惠券（满减券），2-折扣券 4-现金券
            discount: this.discountForm.discount, //折扣的现金
            limitAmount: this.discountForm.limitAmount, //满减限制,满减券为最低金额限制.折扣券为最高折扣金额，0表示不限制
            validate: this.discountForm.validate, //有效期领取多少天后失效
            itemIds: this.discountForm.itemIds.toString(), //关联的项目id数组
            status: "1", //
            startTime: this.discountForm.Timelist[0], //优惠券可使用的开始时间
            endTime: this.discountForm.Timelist[1], //优惠券可使用的结束时间
            couponCount: this.discountForm.couponCount, //发放优惠券总数
            note: this.discountForm.note, //优惠券规则说明
            sendNum: this.discountForm.sendNum, //每次发放多少张，0-不限制
            useType: this.discountForm.useType, //优惠券使用类型,  0=通用 ，1 = 项目
            shopId: localStorage.getItem('shopid'), //优惠券所属店铺
            recvPos: this.discountForm.recvPos.toString() //优惠券前台发放位置，1=进店首页弹窗，2=支付页面,3=抽奖页面
          };
          console.log(params);//return;
          this.req.post("/coupon/save", params).then(res => {
              if (res.data.code=="SUCCESS" && res.data.sub_code == "SUCCESS") {
                this.$router.push({ path: "/discountcoupon" });
              } else {
                this.$message.error(res.data.sub_msg);
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
    gettypeid(query) {
      var params = {};
      if (query !== '') {
          console.log(query);
          this.loading = true;
          params.keywords = query;
      }
      this.req.post("/massage/list",params).then(res => {
          this.loading=false;
          if (res.data.sub_code == "SUCCESS" && res.data.code=='SUCCESS') {
            this.gridData = res.data.data.resultList;
          } else {
            this.$message.error(res.data.sub_msg);
          }
      })
    },
    changeUseType(val){
      this.items = [];
      this.pageNo = 1;
      if(val==1){
        this.dialogVisible = true;
        this.getMassages();
      }
      if(val==4){
        this.dialogVisible = true;
        this.getProductLists();
      }
    },
    getMassages(){
        this.mloading=true;
        var param = {pageSize:this.pageSize,pageNo:this.pageNo};
        if(this.keywords.length>0){
            param.keywords = this.keywords;
        }
        // param.status = 1 ;
        this.req.post("/massage/list",param).then(res=>{
            this.mloading=false;
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                this.addProds = res.data.data.resultList;
                this.totalCount = res.data.data.totalCount;
            }else{
                this.$message.error(res.data.sub_msg);
            }
        })
    },
    getProductLists(){
        this.mloading=true;
        var param = {pageSize:this.pageSize,pageNo:this.pageNo};
        if(this.keywords.length>0){
            param.keywords = this.keywords;
        }
        param.onsell = 1 ;
        this.req.post("/product/list",param).then(res=>{
            this.mloading=false;
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                this.addProds = res.data.data.list;
                this.totalCount = res.data.data.totalPage*this.pageSize;
            }else{
                this.$message.error(res.data.sub_msg);
            }
        })
    },
    sizeChange(size){
        this.pageSize = size;
        this.pageNo = 1;
        this.mloading=true;
        if(this.discountForm.useType==1){
          this.getMassages();
        }
        if(this.discountForm.useType==4){
          this.getProductLists();
        }
    },
    pageNoChange(pageNo){
        this.pageNo = pageNo;
        this.mloading=true;
        if(this.discountForm.useType==1){
          this.getMassages();
        }
        if(this.discountForm.useType==4){
          this.getProductLists();
        }
    },
    search(){
        this.pageNo = 1;
        this.mloading=true;
        if(this.discountForm.useType==1){
          this.getMassages();
        }
        if(this.discountForm.useType==4){
          this.getProductLists();
        }
    },
    addItem(item){
      var index = loadash.findIndex(this.items,(o)=>{return o.id==item.id});
      if(index==-1){
        this.items.push(item);
      }
    },
    removeItem(item){
      var index = loadash.findIndex(this.items,(o)=>{return o.id==item.id});
      this.items.splice(index,1);
    }
  },
  created() {
    this.gettypeid();
  }
};
</script>

<style scoped>
</style>
