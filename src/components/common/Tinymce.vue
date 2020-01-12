<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init"  @onClick="onClick"></editor>
  </div>
</template>
<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "../../../public/tinymce/zh_CN";
// media
export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
   
    plugins: {
      type: [String, Array],
      default: "lists image media table wordcount"
    },
    toolbar: {
      type: [String, Array],
      default:
        "undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | removeformat"
    }
  },
  data() {
    return {
      init: {
        language_url: "/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        // skin_url: '/tinymce/skins/ui/oxide-dark',//暗色系
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          // 发送请求给后端
          const formData = new FormData();
          formData.append("file", blobInfo.blob());
          formData.append("type", "storeMassage");
          // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
          this.$axios.baseURL="http://localhost:8080/upfile";
          this.$axios.headers={
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
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
          }).then(res => {
            console.log(res);
            // this.$refs.md.$imgAddByUrl(`"/img"+${url.data}`)
          success(this.$imgurl()+res.data.data);
          });
        },
      },
      myValue: this.value
    };
  },
   mounted() {
    // this.init()
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
<style scoped>
.tinymce-editor{
  width: 80%;
}
</style>
