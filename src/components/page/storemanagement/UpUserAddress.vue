<template>
  <div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="姓名" prop="username">
              <el-input v-model="form.username" placeholder="请输入收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telphone">
              <el-input v-model="form.telphone" placeholder="请输入收货人联系电话"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="regionId">
                <el-select style="width:150px" ref="prev" v-model="form.provinceId" placeholder="选择省" @change="changeaddress(1)">
                    <el-option v-for="(item, index) in prev" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select style="width:150px" v-model="form.cityId" placeholder="选择城市" @change="changeaddress(2)">
                    <el-option v-for="(item, index) in city" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select style="width:150px" v-model="form.regionId" placeholder="选择区县" @change="changeaddress(3)">
                    <el-option v-for="(item, index) in region" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请选择收货人详细地址" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="">
              <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name:'UpUserAddress',
    props:{
        orderNo:{type:String,default:''}
    },
    data(){
        return {
            form:{
                username:'',
                status:1,
                address:'',
                regionId:'',
                cityId:'',
                provinceId:'',
                regionnames:'',
                telphone:'',
                orderNo:'',
            },
            rules:{
                username:{required:true,message:'请输入收货人姓名',trogger:'blur'},
                telphone:{required:true,message:'请输入收货人联系电话',trogger:'blur'},
                provinceId:{required:true,message:'请选择收货人所在省份',trogger:'blur'},
                cityId:{required:true,message:'请选择收货人所在城市',trogger:'blur'},
                regionId:[{type:'number',required:true,message:'请选择收货人所在区县',trogger:'blur'}],
                address:{required:true,message:'请选择收货人详细地址',trogger:'blur'},
            },
            prev:[],
            city:[],
            region:[],
        }
    },
    created(){
        this.getRegion(1,1);
    },
    methods:{
        getRegion(pid,level){
            var params = {pid: pid};
            this.req.post("/content/getregionlist", params).then(res => {
                if (res.data.sub_code == "SUCCESS" && res.data.code=="SUCCESS") {
                    if(level==1){
                    this.prev = res.data.data;
                    }else if(level==2){
                    this.city = res.data.data;
                    }else if(level==3){
                    this.region= res.data.data;
                    }
                    this.$forceUpdate();
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        changeaddress(val){
            if(val==1){
                this.form.cityId='';
                this.form.regionId='';
            }
            if(val==2){
                this.form.regionId='';
            }
            if(val==3){
                var prevIndex = _.findIndex(this.prev,(o)=>{return o.id==this.form.provinceId});
                var cityIndex = _.findIndex(this.city,(o)=>{return o.id==this.form.cityId});
                var regionIndex = _.findIndex(this.region,(o)=>{return o.id==this.form.regionId});
                
                this.form.regionnames = this.prev[prevIndex].name+this.city[cityIndex].name+this.region[regionIndex].name
            }
            if(this.form.provinceId){
                this.getRegion(this.form.provinceId,2);
            }
            if(this.form.cityId){
                this.getRegion(this.form.cityId,3);
            }
        },
        getAddress(){
            // /store/getreturninfo
            var param = {};
            this.req.post("/store/getreturninfo",param).then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.form = res.data.data;
                    this.getRegion(1,1);
                    if(this.form.provinceId){
                        this.getRegion(this.form.provinceId,2);
                    }
                    if(this.form.cityId){
                        this.getRegion(this.form.cityId,3);
                    }
                    this.$emit('get-address',this.form);
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
        },
        save(){
            // /store/updatereturninfo
            this.$refs.form.validate((valid)=>{
                if(valid){
                    if(!/^1[3|4|5|6|7|8|9][0-9]{9}/.test(this.form.telphone)){
                        this.$message.error('请输入正确的手机号码');
                        return;
                    }
                    var formStr = JSON.stringify(this.form);
                    var param = JSON.parse(formStr);
                    param.orderNo = this.orderNo;
                    if(param.initTime){
                        delete param.initTime;
                    }
                    this.req.post("/order/editaddress",param).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                            this.$emit('close',this.form);
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }
            })
        }
    }
}
</script>

<style>

</style>