<template>
  <div>
      <el-card>
          <div slot="header">配送方式：快递配送</div>
          <div>
              <el-form ref="form" :model="form" label-width="80px">
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
                                <el-button type="primary" v-if="item.id" @click="editItem(item)">修改</el-button>
                                <el-button type="warning" @click="delItem(item,index)">删除</el-button>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="6">
                                <el-button type="primary" @click="selArea">新增区域</el-button>
                            </td>
                        </tr>
                  </table>
                  <el-button type="success">保存</el-button>
                  <el-button type="info">返回</el-button>
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
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import area from '@/utils/region20190925101218.json';
import lodash from 'lodash';
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
            }}
            
        }
    },
    created(){
        // this.area.value = '0';
        // this.area.label = '选择区域';
        // this.area.children = area;
        this.area = area;
        // this.loadArea([1])
    },
    methods:{
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
            // var item = {num:1,fee:0.0,nextnum:1,nextfee:0.0,regionids:[],regions:''};
            // this.form.items.push(item);
        },
        changeRegion(item){
            item.regions = 'aaa'
            // this.getRegions(item.regionids);
        },
        loadArea(val,i){
            if(val.regionids){
                val = val.regionids;
            }
            
            var region = [];
            var params = {pid:val[val.length-1]};
            if(params.pid!=1){
                if(val.length==1){
                    var index = lodash.findIndex(this.area,(o)=>{
                        return o.id==params.pid;
                    });
                }else{
                    var index = lodash.findIndex(this.area,(o)=>{
                        return o.id==val[0];
                    });
                   var pindex = lodash.findIndex(this.area[index].subList,(o)=>{
                        return o.id==val[1];
                    }); 
                }
            }
            if(val.length==3){
                if(i!=undefined){
                    if(this.area.length>0 && index>=0 && pindex==undefined){
                        region.push(this.area[index].name);
                    }
                    if(this.area.length>0 && pindex>=0){
                        region.push(this.area[index].subList[pindex].name)
                    }
                    var ppindex = lodash.findIndex(this.area[index].subList[ppindex].subList,(o)=>{
                        return o.id==params.pid;
                    });
                    if(this.area.length>0 && ppindex>=0){
                        region.push(this.area[index].subList[pindex].subList[ppindex])
                    }
                    this.form.items[i].regions = '';
                    this.form.items[i].regions = region.join(',');
                }
                return ;
            }
            if(this.area.length>0 && index>=0 && pindex==undefined){
                this.area[index].subList=[];
            }
            if(this.area.length>0 && pindex>=0){
                this.area[index].subList[pindex].subList=[];
            }
            this.req.post("/content/getregionlist",params).then(res=>{
                // console.log(res)
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    res.data.data.forEach(item=>{
                        item.subList = [];
                        if(this.area.length==0 || item.level==2){
                            this.area.push(item);
                        }
                        if(this.area.length>0 && index>=0 && pindex==undefined){
                            this.area[index].subList.push(item);
                        }
                        if(this.area.length>0 && pindex>=0){
                            item.subList = null;
                            if(typeof this.area[index].subList[pindex].subList!='array'){
                                this.area[index].subList[pindex].subList=[];
                            }
                            this.area[index].subList[pindex].subList.push(item);
                        }
                    });
                }
            });
            setTimeout(()=>{
                if(this.area.length>0 && index>=0 && pindex==undefined){
                    region.push(this.area[index].name);
                }
                if(this.area.length>0 && pindex>=0){
                    region.push(this.area[index].subList[pindex].name)
                }
                if(i!=undefined){
                    this.form.items[i].regions = '';
                    this.form.items[i].regions = region.join(',');
                }
            },1000)
        },
        bRegion(e,item){
            // console.log(e.target)
        },
        editItem(item){

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
                    }
                    if(!item.children){
                        regionids.push(item.id);
                    }
                })
                var item = {num:1,fee:0.0,nextnum:1,nextfee:0.0,regionids:regionids,regions:regions.join(',')};
                this.form.items.push(item);
            }
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