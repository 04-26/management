<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>营销应用/拼团活动/新建拼团活动</span>
      </div>
      <div class="container">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="活动名称：" prop="name">
            <el-input style="width:200px" v-model="form.name"></el-input>
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
          <el-form-item label="选择项目类型" prop="itemType">
            <el-radio-group v-model="form.itemType">
              <el-radio label="1">服务项目</el-radio>
              <el-radio label="2">会员卡</el-radio>
              <el-radio label="3">商品</el-radio>
            </el-radio-group>
            <p
              class="p-tishi"
            >请选择要参加拼团的商品/服务项目/次卡，一旦参加活动，该商品在活动期间不可修改。(一个活动只能选择一个类型的一个商品，若要多个项目参与请分别新建拼团活动)</p>
          </el-form-item>
          <el-form-item label="参团商品" prop="itemId" v-if="form.itemType==3">
              <el-button type="primary" @click="dialogVisible=true">添加商品</el-button>
              <SkuList :item="item" ref="skulist" @get-skulist="getSku" @remove-item="removeItem"></SkuList>
          </el-form-item>
          <el-form-item v-if="this.form.itemType=='2'" label="选择项目：" prop="itemId">
            <el-select v-model="form.itemId" placeholder="请选择服务项目">
              <el-option v-for="(v,i) in options1" :key="i" :label="v.title" :value="v.id">
                <span style="float: left">{{ v.title }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ v.amount }}元</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.form.itemType=='1'" label="选择项目：" prop="itemId">
            <el-select v-model="form.itemId" placeholder="请选择服务项目">
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
          <el-form-item label="活动限购：" prop="buylimit">
            <el-input
              @mousewheel.native.prevent
              type="number"
              style="width:200px"
              v-model="form.buylimit"
            ></el-input>
            <span class="p-tishi" style="padding-left:10px">0为不限购，大于0为限购次数</span>
          </el-form-item>
          <el-form-item label="拼团有效期：" prop="validityTime">
            <el-input
              @mousewheel.native.prevent
              type="number"
              style="width:200px"
              v-model="form.validityTime"
            ></el-input>
            <span class="p-tishi" style="padding-left:10px">单位为分钟</span>
          </el-form-item>
          <el-form-item label="模拟成团：" prop="simulate">
            <el-checkbox-group v-model="form.simulate">
              <el-checkbox :label="1">开启模拟成团</el-checkbox>
            </el-checkbox-group>
            <p class="p-tishi">
              开启模拟成团后，该团有效期结束时，人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。
              只有已付款参团的真实买家才会获得商品。建议合理开启。以提高成团率。
            </p>
          </el-form-item>
          <el-form-item label="走马灯设置：" prop="lantern">
            <el-checkbox-group v-model="form.lantern">
              <el-checkbox :label="1">开启走马灯</el-checkbox>
            </el-checkbox-group>
            <p class="p-tishi">开启走马灯设置后，系统会模拟“匿名买家拼团”滚动显示，增加拼团活跃度。</p>
          </el-form-item>
          <el-form-item label="开团数量:" prop="countlimit">
            <el-input style="width:200px" v-model="form.countlimit" placeholder="请填写此次活动成团数量" type="number" min='0'>
              <template v-slot:append>
                <div>
                  个
                </div>
              </template>
            </el-input>
            <p class="p-tishi">请填写此次活动成团数量, 0 为不限制</p>
          </el-form-item>
          <el-form-item label="成团人数：" prop="actionNum">
            <el-input style="width:200px" v-model="form.actionNum" placeholder="请填写2-100的整数"></el-input>
          </el-form-item>
          <el-form-item label="已成团份数：" prop="participation">
            <el-input
              style="width:200px"
              type="text"
              v-model="form.participation"
              placeholder="（选填）请填写2-100的整数"
            ></el-input>
            <p class="p-tishi">为刚发布的活动造势，份数不建议填写过大。（不作为后台真实数据统计）</p>
          </el-form-item>
          <el-form-item label="成团价格：" prop="actionPrice">
            <el-input
              style="width:200px"
              type="text"
              v-model="form.actionPrice"
              placeholder="请填写大于0且小于原售价的数字"
            ></el-input>
            <p class="p-tishi">请填写小于项目售价的数字</p>
          </el-form-item>
          <el-form-item label="活动规则" prop="abDesc.rules">
            <el-input
              maxlength="200"
              show-word-limit
              type="textarea"
              :rows="4"
              v-model="form.abDesc.rules"
            ></el-input>
            <p class="p-tishi">次卡拼团时建议只作简短的文字说明</p>
          </el-form-item>
          <el-form-item label="活动介绍：" prop="msg">
            <tinymce-editor ref="editor" v-model="form.msg">
              <!-- :disabled="disabled" -->
            </tinymce-editor>
            <p class="p-tishi">次卡拼团时建议只作简短的文字说明</p>
          </el-form-item>
          <el-form-item label="温馨提示" prop="abDesc.reminder">
            <el-input
              maxlength="200"
              show-word-limit
              style="width:625px"
              type="textarea"
              :rows="4"
              v-model="form.abDesc.reminder"
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
          <el-table-column prop="name" label="名称">
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
        name: "", //活动名称
        startTime: "", //开始时间，格式为日期时间，如：2019-05-18 00:00:00
        endTime: "", //结束时间，格式为日期时间，如：2019-05-18 00:00:00
        actionNum: "", //几人团
        actionPrice: "", //活动价格
        itemType: "", //活动商品类型：1-推拿项目,2-会员卡,3-商品
        actionNum: "", //成团人数
        buylimit: "", //活动限购，0-不限制
        validityTime: "", //拼团有效期(单位为分钟)
        simulate: "0", //模拟成团0-关闭，1-开启
        lantern: "0", //走马灯设置0-关闭，1-开启
        participation: "0", //已成团数量
        abDesc: {
          rules: "", //	//活动规则
          reminder: "", //	//活动提醒
          acdescription: "", //		//活动介绍
          pskus:''
        },
        itemId: "",
        Timelist: [],
        countlimit:1,
        mulitprice:0
      },
      item:{},
      options: [],
      options1: [],
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
        name: [
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
        itemType: [
          { required: true, message: "请选择项目类型", trigger: "blur" }
        ],
        itemId: [{ required: true, message: "请选择项目", trigger: "blur" }],
        buylimit: [
          { required: true, message: "请输入活动限购", trigger: "blur" }
        ],
        validityTime: [
          { required: true, message: "请输入拼团有效期", trigger: "blur" }
        ],
        actionNum: [
          { required: true, message: "请输入成团人数", trigger: "blur" }
        ],
        countlimit: [
          { required: true, message: "请输入开团数量", trigger: "blur" }
        ],
        actionPrice: [
          {
            required: true,
            message: "请输入成团价格，小于原售价",
            trigger: "blur"
          }
        ],
        rules: [{ required: true, message: "请填写活动规则", trigger: "blur" }],
        msg: [{ required: true, message: "请填写活动介绍", trigger: "blur" }],
        reminder: [
          { required: true, message: "请填写温馨提示", trigger: "blur" }
        ]
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
          this.form.abDesc.acdescription = this.form.msg;
          try{
            let pskus = JSON.parse(this.form.abDesc.pskus);
            let skusItem = pskus[0];
            pskus.forEach(item=>{
              if(item.price!=skusItem.price){
                this.form.mulitprice = 1;
              }
            })
          }catch(e){
              this.form.mulitprice = 0;
          }
          const params = {
            name: this.form.name, //活动名称
            startTime: this.form.Timelist[0], //开始时间，格式为日期时间，如：2019-05-18 00:00:00
            endTime: this.form.Timelist[1], //结束时间，格式为日期时间，如：2019-05-18 00:00:00
            actionNum: this.form.actionNum, //几人团
            countlimit: this.form.countlimit, //开团数量
            actionPrice: this.form.actionPrice, //活动价格
            itemType: this.form.itemType, //活动商品类型：1-推拿项目,2-会员卡,3-商品
            buylimit: this.form.buylimit, //活动限购，0-不限制
            validityTime: this.form.validityTime, //拼团有效期(单位为分钟)
            simulate: +this.form.simulate, //模拟成团0-关闭，1-开启
            lantern: +this.form.lantern, //走马灯设置0-关闭，1-开启
            participation: this.form.participation, //已成团数量
            "abDesc.rules": this.form.abDesc.rules, //	//活动规则
            "abDesc.reminder": this.form.abDesc.reminder, //	//活动提醒
            "abDesc.acdescription": this.form.abDesc.acdescription, //		//活动介绍
            "abDesc.pskus": this.form.abDesc.pskus, //		//活动介绍
            storeid: window.localStorage.getItem("shopid"),
            itemId: this.form.itemId,
            mulitprice:this.form.mulitprice,
          };
          console.log(+this.form.simulate, +this.form.lantern);
          console.log(params);

          this.req
            .post("/assemble/add", params)
            .then(res => {
              console.log(res);
              if (res.data.sub_code == "SUCCESS") {
                this.$router.push("/groupbooking");
              } else {
                if (res.data.sub_msg == "{XAssemble.startTime.illegal}") {
                  this.$message.error("开始时间设置错误，请重新设置开始时间");
                } else {
                  this.$message.error(res.data.sub_msg);
                }
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
    gettypeid() {
      let parmas={
        flag:false
      }
      this.req
        .post("/massage/list",parmas)
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
    getTimecard() {
      const params = {kind:0, flag: false };
      this.req
        .post("/vipcard/list", params)
        .then(res => {
          console.log(res);
          this.options1 = res.data.data.resultList;
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
      this.form.itemId = item.id;
      this.$refs.skulist.getProduct(item.id);
    },
    removeItem(item){
      var index = loadash.findIndex(this.items,(o)=>{return o.id==item.id});
      this.items.splice(index,1);
      this.item = {};
      this.form.itemId=''
    },
    getSku(sku){
      var psku = [];
      sku.forEach(item=>{
        let skitem = {pcode:item.pcode,price:item.price};
        psku.push(skitem);
      });
      if(psku.length>0){
        this.form.abDesc.pskus = JSON.stringify(psku);
      }else{
        this.form.abDesc.pskus='';
      }
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