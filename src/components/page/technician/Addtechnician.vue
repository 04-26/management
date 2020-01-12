<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>技师管理/添加技师</span>
      </div>
      <div style="width:30%;margin:0 auto">
        <div>
          <el-form :rules="rules" ref="form" :model="form" label-width="120px">
            <el-form-item label="图片上传" prop="PackingImage">
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
            <el-form-item label="技师名称：" prop="userName">
              <el-input v-model="form.userName" placeholder="输入技师名称"></el-input>
            </el-form-item>
            <el-form-item label="技师联系方式：" prop="tel">
              <el-input v-model="form.tel" placeholder="输入技师电话"></el-input>
            </el-form-item>
            <el-form-item label="工作经验：" prop="experience">
              <el-date-picker value-format="yyyy-MM-dd" v-model="form.experience" type="date" placeholder="输入技师工作经验"></el-date-picker>
            </el-form-item>
            <el-form-item label="多少人选择：" prop="serviceNum">
              <el-input v-model="form.serviceNum" placeholder="输入技师服务人数"></el-input>
            </el-form-item>
            <el-form-item label="特长标签：">
              <el-select v-model="form.staffId" multiple placeholder="请选择" @change="staffIdval">
                <el-option
                  v-for="item in gridData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <p style="color:d8d8d8;font-size:12px">最多添加五个</p>
            </el-form-item>
            <el-form-item label="技师评分：" prop="level">
              <el-input v-model="form.level" placeholder="1-5的整数，5分最高"></el-input>
            </el-form-item>
            <el-form-item label="个人介绍：" prop="descript">
              <el-input
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="4"
                placeholder="请填写温馨提示（选填）"
                v-model="form.descript"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="addtechnician">确定</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        avatar: "",
        userName: "",
        experience: "",
        serviceNum: "",
        massageTypeTitle: "",
        level: "",
        descript: "",
        tel: "",
        staffId: []
      },
      selectedId: "",
      isdisabledFn: true,
      newgridData: [],
      gridData: [],
      Specialtytags: ["小儿推拿", "足疗", "艾灸"],
      uploadImageUrl: "", //存储上传图片返回的路径
      uploadImageName: "", //上传图片的名字
      dialogImageUrl: "",
      dialogVisible: false,
      updata: {
        type: "storeMassage"
      },
      filename: "file",
      rules: {
        userName: [
          {
            required: true,
            message: "请输入技师名称",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "请输入技师电话",
            trigger: "blur"
          }
        ],
        experience: [
          {
            required: true,
            message: "请输入技师工作经验",
            trigger: "blur"
          }
        ],
        serviceNum: [
          {
            required: true,
            message: "请输入多少人选择过",
            trigger: "blur"
          }
        ],
        staffId: [
          {
            required: true,
            message: "请输入特长标签",
            trigger: "blur"
          }
        ],
        level: [
          {
            required: true,
            message: "请输入技师星级",
            trigger: "blur"
          }
        ],
        descript: [
          {
            required: true,
            message: "请输入个人介绍",
            trigger: "blur"
          }
        ]
      }
    };
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
      this.form.avatar = response.data;
      console.log(this.form.avatar);
    },
    onSubmit() {},
    onSubmitadd() {
      this.Specialtytags.push(this.form.specialty);
      this.form.specialty = "";
      // if (this.form.specialty == "") {
      //   isdisabledFn: false;
      // } else {
      //   isdisabledFn: true;
      // }
    },
    handleDelete() {},

    addtechnician() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            avatar: this.form.avatar,
            userName: this.form.userName,
            experience: this.form.experience,
            serviceNum: this.form.serviceNum,
            massageType: this.form.staffId.toString(),
            level: this.form.level,
            descript: this.form.descript,
            telphone: this.form.tel
          };
          console.log(params);
          this.req
            .post("/technician/save", params)
            .then(res => {
              console.log(res);
              if (res.data.sub_code == "SUCCESS") {
                this.$router.push("/technician");
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
    getserve() {
      this.req
        .post("/massage/type/list")
        .then(res => {
          console.log(res);
          this.gridData = res.data.data.resultList;
          console.log(this.gridData);
          if (res.data.sub_code == "SUCCESS") {
          } else {
            this.$message.error(res.data.sub_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    staffIdval() {
      console.log(this.form.staffId.length);
      if (this.form.staffId.length > 5) {
        this.form.staffId.pop();
      }
    }
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    }
  },
  created() {
    this.getserve();
  }
};
</script>
<style scoped>
.Specialtytags {
  display: inline-block;
  line-height: 20px;
  border-radius: 30px;
  border: 1px #00d1b2 solid;
  text-align: center;
  padding: 0 5px;
}
.Specialtytags i:hover {
  color: #00d1b2;
  cursor: pointer;
}
</style>
