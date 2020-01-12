<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>服务管理/添加服务</span>
      </div>
      <div class="container">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
          <el-form-item label="服务名称：" prop="title">
            <el-input style="width:200px" v-model="form.title" placeholder="服务名称2-15个字"></el-input>
          </el-form-item>
          <el-form-item label="选择分类" prop="typeId">
            <el-select v-model="form.typeId" placeholder="选择服务分类">
              <el-option v-for="(v,i) in options" :key="i" :label="v.title" :value="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售价：" prop="price">
            <el-input
              @mousewheel.native.prevent
              placeholder="请输入卖价，低于原价"
              type="number"
              style="width:200px"
              v-model="form.price"
            ></el-input>
          </el-form-item>
          <el-form-item label="原价：" prop="marketPrice">
            <el-input placeholder="请输入原价，高于售价" style="width:200px" v-model="form.marketPrice"></el-input><span style="color:#ccc;">&nbsp;输入0,小程序不展示原价</span>
          </el-form-item>
          <el-form-item label="上架状态：" prop="onsell">
            <el-radio-group v-model="form.onsell">
              <el-radio label="0">下架</el-radio>
              <el-radio label="1">上架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务时长：">
            <el-input placeholder="输入服务时长" style="width:200px" v-model="form.serviceTime"></el-input>
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
              <img v-if="form.imageUrl" :src="$imgurl()+form.imageUrl" style="width:100%;height:100%;">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
            <p>建议尺寸750X420PX</p>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input placeholder="服务项目展示顺序，整数" style="width:200px" v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="已售数量：" prop="sold">
            <el-input placeholder="输入已售数量，整数" style="width:200px" v-model="form.sold"></el-input>
          </el-form-item>
          <el-form-item label="服务简介：" prop="subDescription">
            <el-input
              type="textarea"
              maxlength="200"
              show-word-limit
              :rows="4"
              v-model="form.subDescription"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top:10px" label="服务介绍：" prop="msg1">
            <el-input style="dispaly:none;opacity:0" v-model="form.msg1"></el-input>
            <tinymce-editor ref="editor" v-model="msg" toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | removeformat">
              <!-- :disabled="disabled" -->
            </tinymce-editor>
          </el-form-item>
          <el-form-item label="温馨提示" prop="prompt">
            <el-input
              type="textarea"
              maxlength="200"
              show-word-limit
              :rows="4"
              v-model="form.prompt"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import TinymceEditor from "../../common/Tinymce";
import axios from "axios";
import bus from '@/components/common/bus';
export default {
  name: "markdown",
  data: function() {
    return {
      msg: "",
      form: {
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
        typeId: "",
        msg1: "dasdasd"
      },
      options: [],
      uploadImageUrl: "", //存储上传图片返回的路径
      uploadImageName: "", //上传图片的名字
      dialogImageUrl: "",
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      filename: "file",
      rules: {
        title: [
          {
            required: true,
            message: "请输入服务名称",
            trigger: "blur"
          }
        ],
        typeId: [
          {
            required: true,
            message: "请选择服务类别",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入售价",
            trigger: "blur"
          }
        ],
        onsell: [
          {
            required: true,
            message: "请选择上架状态",
            trigger: "blur"
          }
        ],
        imageUrl: [
          {
            required: true,
            message: "请选择图片",
            trigger: "blur"
          }
        ],
        subDescription: [
          {
            required: true,
            message: "请填写服务简介",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请选择服务项目图片",
            trigger: "blur"
          }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        prompt: [
          {
            type: "string",
            max: 200,
            message: "最多输入200字 "
          }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        msg1: [
          {
            required: true,
            message: "填写服务介绍",
            trigger: "blur"
          }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        sold: [
          {
            required: true,
            message: "请输入已售数量",
            trigger: "blur"
          }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        marketPrice: [
          {
            required: true,
            message: "请输入原价",
            trigger: "blur"
          }
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ]
      }
    };
  },
  components: {
    TinymceEditor
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
      this.form.imageUrl = response.data;
    },

    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.description = this.msg;
          const params = {
            title: this.form.title, //服务名称
            price: this.form.price, //售价
            marketPrice: this.form.marketPrice, //原价
            onsell: this.form.onsell, //上架状态
            imageUrl: this.form.imageUrl, //主图地址
            typeId: this.form.typeId, //项目类别
            sold: this.form.sold, //已售数量
            sort: this.form.sort, //排序
            description: this.form.description, //服务介绍
            subDescription: this.form.subDescription, //服务简介
            prompt: this.form.prompt, //温馨提示
            serviceTime: this.form.serviceTime
          };
          console.log(params);

          this.req
            .post("/massage/save", params)
            .then(res => {
              console.log(res.data.sub_code);
              if (res.data.sub_code == "SUCCESS") {
                this.$refs["form"].resetFields();
                bus.$emit('close_current_tags');
                this.$router.push("/servicemanagement");
              } else {
                this.$message.error(res.data.sub_msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    gettypeid() {
      this.req
        .post("/massage/type/list")
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
    }
  },
  created() {
    this.gettypeid();
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
</style>
