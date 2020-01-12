<template>
  <div>
      <el-form ref="form" :model="form" label-width="100px" class="form-day" :rules="rules">
          <el-form-item label="营业时间" prop="opentime">
              <el-time-picker is-range v-model="opentime" value-format="HH:MM:ss" 
                    :picker-options="{ selectableRange: '18:30:00 至 20:30:00' }" 
                    range-separator="至"   start-placeholder="开门时间"   end-placeholder="关门时间"   placeholder="选择时间范围">
              </el-time-picker>
          </el-form-item>
          <el-form-item label="周休息日">
          </el-form-item>
          <el-form-item label-width="30px">
            <div class="week">
                <el-button :type="ishas(1)?'info':'primary'" @click="sel(1)">周一</el-button>
                <el-button :type="ishas(2)?'info':'primary'" @click="sel(2)">周二</el-button>
                <el-button :type="ishas(3)?'info':'primary'" @click="sel(3)">周三</el-button>
                <el-button :type="ishas(4)?'info':'primary'" @click="sel(4)">周四</el-button>
                <el-button :type="ishas(5)?'info':'primary'" @click="sel(5)">周五</el-button>
                <el-button :type="ishas(6)?'info':'primary'" @click="sel(6)">周六</el-button>
                <el-button :type="ishas(0)?'info':'primary'" @click="sel(0)">周日</el-button>
            </div>
            <Notes content="灰色：表示休息，蓝色：表示营业" padding="5"></Notes>
          </el-form-item>
          <el-form-item label="停业日期"></el-form-item>
          <el-form-item label-width="30px">
              <el-calendar v-model="closeday">
                <template slot="dateCell" slot-scope="{date, data}" >
                    <div @click.stop="pickDays(date, data)" v-if="!gtToday(date)" :class="!gtToday(date)?'exp':''">{{data.day.split('-').slice(2).toString()}}</div>
                    <div @click.stop="pickDays(date, data)" v-if="gtToday(date)" :class="closedays.indexOf(data.day)!=-1?'seleted':''">{{data.day.split('-').slice(2).toString()}}</div>
                </template>
              </el-calendar>
          </el-form-item>
          <el-form-item label-width="30px">
              <el-button type="primary" @click="save">保 存</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>
<script>
import lodash from 'lodash';
import Notes from "@/components/page/mall/Notes.vue";
import moment from 'moment';
export default {
    name:'MallOpenTime',
    data(){
        return {
            form:{
                opentime:'',
                closetime:'',
                weekcloseday:'',
                closeday:'',
            },
            rules:{
                opentime:{required:true,message:'请设置开门时间',trigger:'blur'},
                closetime:{required:true,message:'请设置关门时间',trigger:'blur'},
                weekcloseday:{required:true,message:'请设置周休息时间',trigger:'blur'},
                closeday:{required:true,message:'请设置特殊休息日',trigger:'blur'},
            },
            week:[],
            closeday:'',
            closedays:[],
            opentime:[moment().format('08:00:00'),moment().format('18:00:00')],
        }
    },
    created(){
        this.getDateinfo();
    },
    watch:{
        opentime:function(v,o){
            this.form.opentime = v[0];
            this.form.closetime = v[1];
        }
    },
    methods:{
        getDateinfo(){
            // /store/getworktime
            this.req.post('/store/getworktime').then(res=>{
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    if(res.data.data){
                        this.$set(this,'form',res.data.data);
                        this.week = this.form.weekcloseday?this.form.weekcloseday.split(','):[];
                        this.closedays = this.form.closeday?this.form.closeday.split(','):[];
                        this.opentime = [this.form.opentime,this.form.closetime];
                    }
                }
            })
        },
        sel(val){
            var index = lodash.findIndex(this.week,(o)=>{ return o==val });
            if(index==-1){
                this.week.push(val);
            }else{
               this.week.splice(index,1); 
            }
        },
        ishas(val){
           var index = lodash.findIndex(this.week,(o)=>{ return o==val });
            if(index==-1){
                return false
            } 
            return true;
        },
        pickDays(date, data){
            // pickDay 多选日期
            if(moment().format('YYYY-MM-DD')>moment(date).format('YYYY-MM-DD')){
                return false
            }
            let index = this.closedays.indexOf(moment(date).format('YYYY-MM-DD'));
            if(index!=-1){
                data.isSelected=false;
                this.closedays.splice(index,1); 
            }else{
                data.isSelected=true;
                this.closedays.push(moment(date).format('YYYY-MM-DD'));
            }
        },
        pickDay(date, data){    
            // pickDay 单选日期
            if(moment().format('YYYY-MM-DD')>moment(date).format('YYYY-MM-DD')){
                return false
            }
            if(moment(this.closeday).format('YYYY-MM-DD')==moment(date).format('YYYY-MM-DD')){
                data.isSelected=false;
                this.closeday = '';
            }else{
                data.isSelected=true;
                this.closeday = moment(date).format('YYYY-MM-DD');
            }
        },
        gtToday(date){
            if(moment().format('YYYY-MM-DD')<=moment(date).format('YYYY-MM-DD')){
                return true
            }else{
                return false;
            }
        },
        save(){
            if(this.opentime.length==0){
                this.$message.error('还没设置营业时间');
                return ;
            }else{
                this.form.opentime = this.opentime[0];
                this.form.closetime = this.opentime[1];
            }
            this.form.weekcloseday = this.week.join(',');
            this.form.closeday = this.closedays.toString();
            var params = Object.assign({},this.form);
            if(params.initTime){
                delete params.initTime;
            }
            this.$refs.form.validate((valid)=>{
                if(valid){
                    // /store/updateworktime
                    this.req.post('/store/updateworktime',params).then(res=>{
                        if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                            this.$message.success('操作成功');
                        }else{
                            this.$message.error(res.data.sub_msg);
                        }
                    })
                }
            })
        }
    },
    components:{
        Notes
    }
}
</script>
<style scoped>
.form-day >>> .el-form-item{margin-bottom:0px !important;}
.form-day >>> .el-calendar__header{padding:1px 20px;}
.form-day >>> .el-calendar-table .el-calendar-day{height:36px;padding:0px;}
.form-day >>> .el-calendar-table .el-calendar-day .seleted{width:100%;height:100%;background:tan;}
.form-day >>> .is-selected{color:#666;background:transparent;}
.form-day >>> .el-calendar-table .el-calendar-day:hover{color:#666;background:tan;}
.form-day >>> .el-calendar-table thead th{padding:0px}
.form-day >>> .exp{color:#C0C4CC;}
.week{display:flex;justify-content: space-between;align-items:center;}
</style>