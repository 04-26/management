<template>
    
</template>

<script>
export default {
    created(){
         window.localStorage.removeItem("shopid");
         this.$router.push("/myshop");
    }
}
</script>

<style>

</style>
