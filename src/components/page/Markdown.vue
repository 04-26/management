<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 表单
        </el-breadcrumb-item>
        <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">
        mavonEditor：基于Vue的markdown编辑器。
        访问地址：
        <a
          href="https://github.com/hinesboy/mavonEditor"
          target="_blank"
        >mavonEditor</a>
      </div>
      <mavon-editor
        v-model="content"
        ref="md"
        @imgAdd="$imgAdd"
        @change="change"
        style="min-height: 600px"
      />
      <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "markdown",
  data: function() {
    return {
      content: "",
      html: "",
      configs: {}
    };
  },
  components: {
    mavonEditor
  },
  methods: {
    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      formdata.append("type", "storeMassage");
      // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
      this.$axios.baseURL = "http://localhost:8080/upfile";
      this.$axios.headers = {
        "X-Custom-Header": "foobar",
        device: "2",
        deviceid: "1",
        systemos: "web",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrZW4iLCJpYXQiOjE1Mzc1NTQzMDksImRhdGEiOnsidXNlcm5hbWUiOiJ4dXRvbmdiYW8iLCJpc19zdXBlcnVzZXIiOjEsImlkIjoxNywibG9naW5fdGltZSI6MTUzNzU1NDMwOX0sImV4cCI6MTUzODE1NDMwOX0.32Lys4hjjY2XRpM2r9YSmpYA798u821m_M5Tzb6wxIU",
        "Content-Type": "multipart/form-data",
        token: window.localStorage.getItem("t_k_1130_h5-@&1265"),
        shopid: window.localStorage.getItem("shopid")
      };
      this.$axios({
        url: "/common/saveimage",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {
        console.log(url);
        // this.$refs.md.$img2Url(pos, url);
        this.$refs.md.$imgUpdateByUrl(`"/img/${url.data.data}"`)
        console.log(`"/img/"+"${url.data.data}"`)
      });
    },
    change(value, render) {
      // render 为 markdown 解析后的结果
      this.html = render;
    },
    submit() {
      console.log(this.content);
      console.log(this.html);
      this.$message.success("提交成功！");
    }
  }
};
</script>
<style scoped>
.editor-btn {
  margin-top: 20px;
}
</style>