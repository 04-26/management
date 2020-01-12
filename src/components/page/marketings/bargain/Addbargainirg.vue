<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/砍价活动/新建砍价活动</span>
      </div>
      <div class="container">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="活动名称：" prop="title">
            <el-input style="width:200px" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item style="width: 500px;" label="活动时间" prop="Timelist">
            <el-date-picker
              v-model="form.Timelist"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="选择项目状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择项目类型" prop="relatType">
            <el-radio-group v-model="form.relatType">
              <el-radio label="1">服务项目</el-radio>
              <el-radio label="2">会员卡</el-radio>
              <el-radio label="3">商品</el-radio>
            </el-radio-group>
            <p class="p-tishi">
              请选择要参加砍价的商品，一旦参加活动，该商品在活动期间不可修改。
(一个活动只能选择一个规格的一个商品，若要多个项目参与只能设置低于最低规格的砍价金额，若满足不了您的商业需求，建议另外新建活动
            </p>
          </el-form-item>
          <el-form-item label="参团商品" prop="itemId" v-if="form.relatType==3">
              <el-button type="primary" @click="dialogVisible=true">添加商品</el-button>
              <SkuList :item="item" ref="skulist" @get-skulist="getSku" @remove-item="removeItem" 
                        :isPriceBtn="false" :collen="2"
                        :showSku="true" :isasprice="false" rightTitle="操作"></SkuList>
          </el-form-item>

          <el-form-item v-if="this.form.relatType=='2'" label="选择项目：" prop="productId">
            <el-select v-model="form.productId" placeholder="请选择服务项目">
              <el-option
                v-for="(v,i) in options1"
                :key="i"
                :label="`${v.title+'-----'+v.amount+'元'}`"
                :value="v.id"
              >
                <span style="float: left">{{ v.title }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ v.amount }}元</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.form.relatType=='1'" label="选择项目：" prop="productId">
            <el-select v-model="form.productId" placeholder="请选择服务项目">
              <el-option
                v-for="(v,i) in options"
                :key="i"
                :label="`${v.title+'-----'+v.price+'元'}`"
                :value="v.id"
              >
                <span style="float: left">{{ v.title }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ v.price }}元</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="砍价有效期：" prop="bargainExp">
            <el-input
              type="number"
              style="width:200px"
              v-model="form.bargainExp"
              placeholder="2-72小时"
              @mousewheel.native.prevent
            ></el-input>
            <p class="p-tishi">单位为小时</p>
          </el-form-item>
          <el-form-item label="砍价商品库存：" prop="productStock">
            <el-input
              type="number"
              style="width:200px"
              v-model="form.productStock"
              placeholder="小于等于商品库存"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item label="砍价最低价：" prop="lowPrice">
            <el-input
              type="number"
              style="width:200px"
              v-model="form.lowPrice"
              placeholder="请输入砍价底价"
              @mousewheel.native.prevent
            ></el-input>
            <span>不得超过商品原价</span>
            <span v-if="item">&nbsp;当前商品原价：</span>
            <span v-if="item" style="color:#0AABA5;">￥{{item.price}}</span>
            <span style="color:red;">&nbsp;&nbsp;注意：砍价仅支持多个SKU统一设置砍价最低价，请慎重填写创建后不可修改价格</span>
          </el-form-item>
          <el-form-item label="帮砍金额：" prop="priceType">
            <el-radio-group v-model="form.priceType">
              <el-radio label="1">随机</el-radio>
              <el-radio label="2">固定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label>
            <div>
              <p v-if="form.priceType==1">
                最小值：
                <el-input style="width:200px" v-model="form.minPrice" placeholder="请填写随机砍价最小值"></el-input>最大值：
                <el-input style="width:200px" v-model="form.maxPrice" placeholder="请填写随机砍价最大值"></el-input>
              </p>
              <el-input
                v-if="form.priceType==2"
                style="width:200px"
                v-model="form.maxPrice"
                placeholder="请填写固定金额"
              ></el-input>
            </div>

            <p class="p-tishi">设置每位帮砍用户参与砍价的金额、随机砍价、还是按照原价与底价差的平均值来砍</p>

            <p
              class="p-tishi"
            >选择「随机金额」砍价后，需设定砍价人数，每名好友砍价金额随机，例如：原价99，底价0，商家设置10人砍到底价，每人砍价金额介于0-19.8之间，但10人砍价的总金额为99元；</p>
            <p class="p-tishi">选择「固定金额」砍价后，每名好友砍价金额固定为需砍价格的平均值，例如：原价99，底价0，商家设置10人砍到底价，每人砍价金额为9.9。</p>
          </el-form-item>
          <el-form-item label="帮砍人数：" prop="helpNum">
            <el-input style="width:200px" v-model="form.helpNum" placeholder="请填写2-100的整数"></el-input>
            <span class="p-tishi" style="padding-left:10px">每个砍价订单的帮砍人数，达到该人数，才可砍至底价</span>
          </el-form-item>
          <el-form-item label="已参与砍价人数：" prop="num">
            <el-input style="width:200px" v-model="form.num" placeholder="请填写2-100的整数"></el-input>
            <span class="p-tishi" style="padding-left:10px">为刚发布的活动造势，人数不建议填写过大。</span>
          </el-form-item>
          <el-form-item label="走马灯设置：" prop="horseSet">
            <el-checkbox-group v-model="form.horseSet">
              <el-checkbox :label="1">开启走马灯</el-checkbox>
            </el-checkbox-group>
            <p class="p-tishi">开启走马灯设置后，系统会模拟“匿名买家拼团”滚动显示，增加拼团活跃度。</p>
          </el-form-item>
          <el-form-item label="发起砍价次数：" prop="everyCount">
            <el-input style="width:200px" v-model="form.everyCount" placeholder="请填写2-100的整数"></el-input>
            <span class="p-tishi" style="padding-left:10px">一个用户能参与几次活动（低于原价购买算一次）</span>
          </el-form-item>
          <el-form-item label="活动规则">
            <el-input
              maxlength="200"
              show-word-limit
              type="textarea"
              :rows="4"
              v-model="form.extinfo.actRules"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动介绍：" class="msg" prop="msg">
            <tinymce-editor ref="editor" v-model="form.msg">
              <!-- :disabled="disabled" -->
            </tinymce-editor>
          </el-form-item>
          <el-form-item label="温馨提示" prop="actWarm">
            <el-input
              maxlength="200"
              show-word-limit
              type="textarea"
              :rows="4"
              v-model="form.extinfo.actWarm"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
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
                    <div style="font-size:12px;line-height:24px;">{{scope.row.name?scope.row.name.substr(0,20):''}}{{scope.row.name && scope.row.name.length>20?'...':''}}</div>
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="60">
          </el-table-column>
          <el-table-column label="操作" width="60" align="right">
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
import TinymceEditor from "../../../common/Tinymce";
import axios from "axios";
import SkuList from "@/components/page/mall/SkuList.vue";
import loadash from 'lodash'
export default {
  name: "markdown",
  data: function() {
    return {
      form: {
        msg: "",
        id: null, //如果是新增，id传null
        title: "", //砍价活动标题
        startTime: "", //Y	活动开始时间
        endTime: "", //活动结束时间
        productId: "", //关联的砍价产品
        productStock: "", //	砍价商品库存
        lowPrice: "", //砍价最低价
        minPrice: 0, //帮砍金额最小值
        maxPrice: "", //帮砍金额最大值
        priceType: "", //帮砍金额限制类型，1=随机，2=固定
        bargainExp: "", //	砍价有效期,以小时为单位
        helpNum: "", //帮砍人数
        num: "", //已参与砍价人数
        horseSet: "", //	走马灯设置
        everyCount: "", //	发起砍价次数
        everyHelp: "", //	帮砍次数
        shopId: "", //	店铺ID
        status: "1", //砍价活动的状态，0=未上线，1=上线，2=进行中，3=已结束
        relatType: "", //关联砍价产品类型
        extinfo: {
          actRules: "", //活动规则
          actContent: "", //活动介绍
          actWarm: "" //温馨提示
        },
        Timelist: []
      },
      options: [],
      options1: [],
      prodList: [],
      uploadImageUrl: "", //存储上传图片返回的路径
      uploadImageName: "", //上传图片的名字
      dialogImageUrl: "",
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      filename: "file",
      seleid: "",
      rules: {
        title: [
          {
            required: true,
            message: "请输入砍价活动名称",
            trigger: "blur"
          },
          {
            type: "string",
            max: 12,
            message: "活动名称不能超过12个字符",
            trigger: "blur"
          }
        ],
        Timelist: [
          { required: true, message: "请输入活动时间", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择项目状态", trigger: "blur" }
        ],
        relatType: [
          { required: true, message: "请选择项目类型", trigger: "blur" }
        ],
        productId: [
          { required: true, message: "请选择服务项目", trigger: "blur" }
        ],
        bargainExp: [
          { required: true, message: "请输入砍价有效期", trigger: "blur" }
        ],
        productStock: [
          {
            required: true,
            message: "请输入砍价项目/卡的库存",
            trigger: "blur"
          }
        ],
        lowPrice: [
          {
            required: true,
            message: "请输入砍价最低价，不能超过项目/卡的原价",
            trigger: "blur"
          }
        ],
        priceType: [
          { required: true, message: "请帮砍金额类型", trigger: "blur" }
        ],
        helpNum: [
          { required: true, message: "请输入帮砍人数", trigger: "blur" }
        ],
        num: [
          { required: true, message: "请输入已参与砍价人数", trigger: "blur" }
        ],
        everyCount: [
          { required: true, message: "请输入发起砍价次数", trigger: "blur" }
        ],
        msg: [{ required: true, message: "请填写活动介绍", trigger: "blur" }]
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
      item:{},
      prodList:[]
    }
  },
  components: {
    TinymceEditor,
    SkuList
  },

  methods: {
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
      this.form.imageUrl = response.data;
      console.log(this.form.imageUrl);
    },
    submit() {
      this.$refs.form.validate(valid => {
        // 所有前端验证通过valid就是true 否则就是false
        if (valid) {
          this.form.extinfo.actContent = this.form.msg;

          const params = {
            title: this.form.title, //砍价活动标题
            startTime: this.form.Timelist[0], //Y	活动开始时间
            endTime: this.form.Timelist[1], //活动结束时间
            productId: this.form.productId, //关联的砍价产品
            productStock: this.form.productStock, //	砍价商品库存
            lowPrice: this.form.lowPrice, //砍价最低价
            minPrice: this.form.minPrice, //帮砍金额最小值
            maxPrice: this.form.maxPrice, //帮砍金额最大值
            priceType: this.form.priceType, //帮砍金额限制类型，1=随机，2=固定
            bargainExp: this.form.bargainExp, //	砍价有效期,以小时为单位
            helpNum: this.form.helpNum, //帮砍人数
            num: this.form.num, //已参与砍价人数
            horseSet: +this.form.horseSet, //	走马灯设置
            everyCount: this.form.everyCount, //	发起砍价次数
            everyHelp: "1", //	帮砍次数
            status: "1", //砍价活动的状态，0=未上线，1=上线，2=进行中，3=已结束
            relatType: this.form.relatType, //关联砍价产品类型
            "extinfo.actRules": this.form.extinfo.actRules, //活动规则
            "extinfo.actContent": this.form.extinfo.actContent, //活动介绍
            "extinfo.actWarm": this.form.extinfo.actWarm, //温馨提示
            shopId: window.localStorage.getItem("shopid")
          };
          // console.log(params);return;
          this.req.post("/bargain/save", params).then(res => {
              if (res.data.code == "SUCCESS" && res.data.sub_code == "SUCCESS") {
                this.$router.push({ path: "/bargainirg" });
              } else {
                this.$message.error(res.data.sub_msg);
              }
            }).catch(err => {
              console.log(err);
            });
        } else {
          console.log("前端验证失败！不允许提交!");
          return false;
        }
      });
    },
    gettypeid() {
      this.req.post("/massage/list").then(res => {
          if (res.data.sub_code == "SUCCESS") {
            this.options = res.data.data.resultList;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        }).catch(err => {
          console.log(err);
        });
    },
    getTimecard() {
      const params = {
        kind: 0,
        flag: false
      };
      this.req.post("/vipcard/list", params).then(res => {
          if (res.data.sub_code == "SUCCESS") {
            this.options1 = res.data.data.resultList;
          } else {
            this.$message.error(res.data.sub_msg);
          }
        }).catch(err => {
          console.log(err);
        });
    },
    getProductLists(){
        var param = {pageNo:this.pageNo,pageSize:this.pageSize};
        if(this.keywords){
          param.keywords = this.keywords;
        }
        param.onsell = 1 ;
        this.req.post("/product/list",param).then(res=>{
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
        this.getProductLists();
    },
    pageNoChange(pageNo){
        this.pageNo = pageNo;
        this.mloading=true;
        this.getProductLists();
    },
    search(){
        this.pageNo = 1;
        this.mloading=true;
        this.getProductLists();
    },
    addItem(item){
      var index = loadash.findIndex(this.items,(o)=>{return o.id==item.id});
      if(index==-1){
        this.items.push(item);
      }else{
        this.items.splice(index,1);
        this.items.push(item);
      }
      this.item = item;
      this.form.productId = item.id;
      this.$refs.skulist.getProduct(item.id);
    },
    removeItem(item){
      var index = loadash.findIndex(this.items,(o)=>{return o.id==item.id});
      this.items.splice(index,1);
      this.item = {};
      this.form.productId=''
    },
    getSku(sku){
      // var psku = [];
      // sku.forEach(item=>{
      //   let skitem = {pcode:item.pcode,price:item.price};
      //   psku.push(skitem);
      // });
      // if(psku.length>0){
      //   this.form.abDesc.pskus = JSON.stringify(psku);
      // }else{
      //   this.form.abDesc.pskus='';
      // }
    }
  },
  created() {
    this.gettypeid();
    this.getTimecard();
    this.getProductLists();
  }
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.video-avatar {
  width: 400px;
  height: 200px;
}
.p-tishi {
  color: #606266;
  font-size: 14px;
}
</style>