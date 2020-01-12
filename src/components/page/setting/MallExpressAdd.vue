<template>
  <div>
      <el-card>
          <div slot="header">配送方式：快递配送</div>
          <div>
              <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
                  <el-form-item label="方案名称" prop="name">
                      <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <table border="0" class="table">
                        <tr style="border-bottom:1px solid #ddd;">
                            <th>可配送区域</th>
                            <th class="ths">首件(个)</th>
                            <th class="ths">运费(元)</th>
                            <th class="ths">续件(个)</th>
                            <th class="ths">续费(元)</th>
                            <th class="ths text-center">操作</th>
                        </tr>
                        <tr v-for="(item,index) in form.items" :key="index">
                            <td>
                                {{item.regions}}
                                <!-- <el-cascader
                                    :options="area"
                                    :props=props
                                    v-model="item.regionids"
                                    :change-on-select='false'
                                    separator=','
                                    @blur="bRegion($event,item)"
                                    @active-item-change="loadArea"
                                    @change="changeRegion(item)">
                                </el-cascader> -->
                                <!-- <el-cascader
                                    :options="area"
                                    :props=props
                                    :change-on-select='true'
                                    v-model="item.regionids"
                                    separator=','
                                    @active-item-change="loadArea"
                                     @change="loadArea(item,index)"
                                    >
                                </el-cascader> -->
                            </td>
                            <td class="ths">
                                <el-input v-model="item.num" placeholder="首件(个)" class="form-input" type="number" min='1'>
                                    <div slot="append">个</div>
                                </el-input>
                            </td>
                            <td class="ths">
                                <el-input-number v-model="item.fee" :min="0" :precision="2" label="label" :step="0.01"></el-input-number>
                            </td>
                            <td class="ths">
                                <el-input v-model="item.nextnum" placeholder="续件(个)" class="form-input" min='0' type="number">
                                    <div slot="append">个</div>
                                </el-input>
                            </td>
                            <td class="ths">
                                <el-input-number v-model="item.nextfee" :min="0" :precision="2" label="label" :step="0.01"></el-input-number>
                            </td>
                            <td class="ths text-center">
                                <el-button type="primary" @click="editItem(item,index)">修改区域</el-button>
                                <el-button type="warning" @click="delItem(item,index)">删除</el-button>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="6">
                                <el-button type="primary" @click="selArea">新增区域</el-button>
                            </td>
                        </tr>
                  </table>
                  <el-button type="success" @click="save">保存</el-button>
                  <el-button type="info" @click="back">返回</el-button>
              </el-form>
          </div>
      </el-card>
      <el-dialog
          title=""
          :visible.sync="dialogVisible"
          width="width">
          <div>
              <el-tree class="tree"
                  :data="area"
                  :props="props"
                  node-key='id'
                  :show-checkbox='true'
                  ref="tree"
                  @node-click="nodeChange">
              </el-tree>
          </div>
          <div slot="footer">
              <el-button @click="closeArea">取 消</el-button>
              <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import area from '@/utils/region20190925101218.json';
import lodash from 'lodash';
import bus from '@/components/common/bus';
export default {
    name:'MallExpressAdd',
    data(){
        return {
            form:{
                name:'',
                items:[
                    // {num:1,fee:0.0,nextnum:1,nextfee:0.0,regionids:[],regions:''},
                ]
            },
            dialogVisible:false,
            area:[],
            // props:{value:'id',label:'name',children:'subList'},
            props:{label:(data,node)=>{
                return data.name;
            }},
            prevs:[],
            currendIndex:-1,
            loading:false            
        }
    },
    created(){
        // this.area.value = '0';
        // this.area.label = '选择区域';
        // this.area.children = area;
        this.area = area;
        // this.loadArea([1])
        if(localStorage.getItem('expItem')){
            this.form = JSON.parse(localStorage.getItem('expItem'));
            this.form.items = [];
            this.getExpDetail();
        }
    },
    methods:{
        getExpDetail(){
            // /express/detail
            this.loading=true;
            this.req.post('/express/detail',{id:this.form.id}).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.form = res.data.data;
                    if(this.form.items){
                        this.form.items.forEach(item=>{
                            item.regionids = JSON.parse(item.regionids);
                            if(item.hasOwnProperty('initTime')){
                                delete item.initTime;
                            }
                        })
                    }
                    this.$forceUpdate();
                }
            })
        },
        getRegions(ids){
            // /content/getregionlist
            var params = {pid:ids[ids.length-1]};
            this.req.post("/content/getregionlist",params).then(res=>{
                // console.log(res)
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                }
            })
        },
        selArea(){
            this.dialogVisible=true;
            if(this.$refs.tree){
                var nodes = this.$refs.tree.getHalfCheckedKeys();
                if(nodes && nodes.length>0){
                    nodes.forEach(item=>{
                        this.$refs.tree.setChecked(item,false,true);
                    });
                }
            }
            // var item = {num:1,fee:0.0,nextnum:1,nextfee:0.0,regionids:[],regions:''};
            // this.form.items.push(item);
        },
        closeArea(){
            this.currendIndex=-1;
            this.dialogVisible=false;
        },
        changeRegion(item){
            // item.regions = 'aaa'
            // this.getRegions(item.regionids);
        },

        bRegion(e,item){
            // console.log(e.target)
        },
        editItem(item,index){
            this.selArea();
            setTimeout(()=>{
                this.currendIndex=index;
                if(this.form.items[index].regionids && this.form.items[index].regionids.length>0){
                    this.form.items[index].regionids.forEach(item=>{
                        this.$refs.tree.setChecked(item,true);
                    })
                }
            },100);
        },
        delItem(item,index){
            this.form.items.shift(index,1);
        },
        nodeChange(e){
            console.log(e);
        },
        getCheckedNodes(){
            // 获取所有选择的节点
            var nodes = this.$refs.tree.getCheckedNodes(false,true);
            console.log(nodes);
            var regions = [];
            var regionids = [];
            if(nodes){
                nodes.forEach((item,index)=>{
                    if(item.children && item.children[0] && item.children[0].children){
                        regions.push(item.name);
                        this.prevs.push(item.id);
                    }
                    if(!item.children){
                        regionids.push(item.id);
                    }
                })
                if(regionids.length==0){
                    this.$message.error('还没选择快递区域');
                    return ;
                }
                if(this.currendIndex!=-1){
                    this.form.items[this.currendIndex].regionids = regionids;
                    this.form.items[this.currendIndex].regions = regions.join(',');
                    this.currendIndex=-1;
                }else{
                var item = {num:1,fee:10.0,nextnum:1,nextfee:10.0,regionids:regionids,regions:regions.join(',')};
                    this.form.items.push(item);
                }
                this.dialogVisible=false;
            }
        },
        save(){
            if(this.form.name.length==0){
                this.$message.error('请输入方案名称');
                return ;
            }
            if(this.form.items.length==0){
               this.$message.error('请选择快递区域');
                return ; 
            }
            // /express/add
            var params = Object.assign({},this.form);
            params.items.forEach(item=>{
                item.regionids = JSON.stringify(item.regionids);
            });
            if(params.hasOwnProperty('initTime')){
                delete params.initTime;
            }
            this.loading=true;
            var url = "/express/add";
            if(this.form.id && !localStorage.getItem('isCopy')){
                url = "/express/edit";
            }
            this.req.ppost(url,params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$message.success('操作成功');
                    localStorage.removeItem('isCopy');
                    bus.$emit('close_current_tags');
                    this.$router.push({path:'/appletsettings'});
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        back(){
           localStorage.removeItem('isCopy');
           bus.$emit('close_current_tags');
        }
    }
}
</script>
<style scoped>
.table{width:100%;border:none;}
.table th{color:#666;font-size:14px;padding:5px;}
.table .ths{width:200px;}
.table .form-input{width:140px;text-align:center;margin:5px 0px;}
.tree >>> .el-tree-node__children{display:flex;height:auto;flex-wrap: wrap;}
</style>