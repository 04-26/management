<template>
  <div>
    <tinymce-editor ref="editor"
      v-model="msg"
      >
      <!-- :disabled="disabled" -->
    </tinymce-editor>
    <button @click="clear">清空内容</button>
    <button @click="disabled = true">禁用</button>
    <button @click="content">查看</button>
  </div>
</template>

<script>
import TinymceEditor from '../../common/Tinymce'
import axios from 'axios';

export default {
  components: {
    TinymceEditor
  },
  data () {
    return {
      msg: '',
      disabled: false
    }
  },
  methods: {
    // // 鼠标单击的事件
    // onClick (e, editor) {
    //   console.log('Element clicked')
    //   console.log(e)
    //   console.log(editor)
    // },
    // 清空内容
    // clear () {
    //   this.$refs.editor.clear()
    // },
    content(){
        console.log(this.msg)
    }
  }
}
</script>