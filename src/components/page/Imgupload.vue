
<template>

</template>
<script>
export default {
  methods: {
    beforeupload(file) {
      this.formData.append("file", file);

      return false;
    }
  }
};
</script>
<style scoped>
</style>

