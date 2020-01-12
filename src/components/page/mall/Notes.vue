<template>
    <div :class="inline==true?'inline':''">
        <div v-html="content" :style="{color:color,fontSize:fontSize+'px',padding:padding+'px'}" ></div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name:'Notes',
    props:{
        content:{type:String,default:''},
        color:{type:String,default:'#777'},
        fontSize:{type:Number,default:12},
        padding:{type:String,default:"12"},
        inline:{type:Boolean,default:false},
    }
}
</script>
<style scoped>
    .inline{display:inline-block;}
</style>