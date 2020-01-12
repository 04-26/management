<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <span>选择商品：</span>
                <el-input  class="search-input" v-model="massageTitle" placeholder="请输入商品名称">
                    <template slot="append" >
                        <el-button type="primary" @click="$emit('search',massageTitle)">搜索</el-button>
                    </template>
                </el-input> 
                
            </el-col>
            <el-col :span="12" style="text-align:right;">
                <span>查找要开单的会员：</span>
                <el-select v-model="userId" multiple filterable remote reserve-keyword :multiple-limit="1" placeholder="请输入会员名、手机号"
                    @change="selUser" 
                    @remove-tag="delUser"
                    :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="item in options" :key="item.id" :label="item.telphone+'  '+item.nick" :value="item.id">
                    </el-option>
                </el-select>                
            </el-col>
        </el-row>
        <div style="margin:5px 0px;font-size:14px;color:#00D1B2;border-bottom:1px solid #00D1B2;">服务项目</div>
        <div>
            <el-tag class="tag" @click="selmassgeType(0)" :type="typeId==0?'warning':'default'">全部</el-tag>
            <el-tag v-for="(item, index) in massgeTypeList" :key="index"
                class="tag" :type="typeId==item.id?'warning':'default'" @click="selmassgeType(item.id)" >
                {{item.title}}
            </el-tag>
        </div>
        <div class="prodlist">
            <el-card :body-style="{ padding: '0px' }" v-for="(item, index) in prodList" :key="index" class="prod-card">
                <img :src="$imgurl()+item.imageUrl" class="image">
                <div style="padding: 10px;">
                    <span style="color:#666;font-size:14px;">{{item.title}}</span>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <span style="color:#ee5002;;font-size:14px;">￥{{item.price}}</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                            <span style="color:#ee5002;;font-size:14px;color:#00D1B2;cursor:pointer;" @click="$emit('sel-massage',item)">选择</span>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
        <div style="display:block;">
            <el-pagination @size-change="sizeChange" @current-change="currentChange" 
                :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
        <div style="margin:5px 0px;font-size:14px;color:#00D1B2;border-bottom:1px dashed #00D1B2;" v-if="massageItem.id!=0">消费清单</div>
        <div v-if="massageItem.id!=0">
            <el-row :gutter="10" style="background:#eee;padding:3px;">
                <el-col :span="20" style="color:#666;font-size:15px;display:flex;line-height: 32px;">
                    <span style="flex:1;">{{massageItem.title}}</span>
                    <span style="flex:1;">￥{{massageItem.price}}X{{num}}</span>
                    <span style="flex:1;color:#ee5002;font-weight: bold;">￥{{massageItem.price*num}}</span>
                </el-col>
                <el-col :span="4" style="text-align:right;">
                    <el-input-number v-model="numb" @change="numChange" :min="1"></el-input-number>&nbsp;
                    <el-button type="warning" size="small" @click="$emit('del-massage')">删除</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="10" style="background:#eee;padding:3px;">
                <el-col :span="20" style="color:#666;font-size:15px;display:flex;line-height: 32px;">
                    <div style="flex:1;" v-if="workerItem.id==0">
                        技师：未指定（非必须）
                        <el-button type="primary" size="mini" @click="selWorker">指定技师</el-button>
                    </div>
                    <div style="flex:1;" v-if="workerItem.id!=0">
                        技师：{{workerItem.userName}}
                        <el-button type="primary" size="mini" @click="delWorker">删除技师</el-button>
                    </div>
                    <span style="flex:1;">
                        <el-button type="warning" size="mini" @click="changePrice">改价</el-button>
                    </span>
                    <div style="flex:1;">
                       预约时间：
                       <el-date-picker v-model="btime" type="datetime" 
                            placeholder="选择日期时间" default-time="12:00:00" format="yyyy-MM-dd HH:mm:00"
                            @change="timeChange"></el-date-picker>
                    </div>
                </el-col>
                <el-col :span="4">&nbsp;</el-col>
            </el-row>
        </div>
        <div style="margin:5px 0px;font-size:14px;color:#00D1B2;border-bottom:1px dashed #00D1B2;" v-if="user.id!=0">开单用户信息</div>
        <div  v-if="user.id!=0">
            <img :src="user.avatar|avatar" style="width:40px;height:40px;border-radius:50%;">
            <div style="display:inline-block;vertical-align: middle;padding-left:15px;">
                <div style="padding-left:2px;">{{user.nick}}</div>
                <div>{{user.telphone}}</div>
            </div>
        </div>
        <el-input type="textarea" autosize placeholder="请输入备注内容" v-model="userMsg" style="margin:15px 0px;" :rows="3" v-if="massageItem.id!=0"></el-input>
        <el-row :gutter="10" style="background:#eee;margin:10px 0px;" v-if="massageItem.id!=0">
            <el-col :span="20" style="color:#666;font-size:15px;display:flex;line-height: 32px;">
               合计：￥{{massageItem.price*num}}
            </el-col>
            <el-col :span="4" style="text-align:right;">
                <el-button type="primary" @click="recvMoney">实际收款：￥{{totalPrice}}</el-button>
            </el-col>
        </el-row>
        <el-dialog title="指定技师" :visible.sync="dialogTableVisible" width="400px" :close-on-click-modal="false" :close-on-press-escape='false'>
                <el-select v-model="workerId" multiple filterable remote reserve-keyword :multiple-limit="1" placeholder="请输入技师姓名"
                    @change="selWorkers" 
                    @remove-tag="delWorker"
                    :remote-method="remoteMethodWorker" :loading="mloading">
                    <el-option v-for="item in workerList" :key="item.id" :label="item.userName+'  '+item.telphone" :value="item.id">
                    </el-option>
                </el-select>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'OpenOrder',
    props:{
        pageSize:{type:Number,default:10},
        pageNo:{type:Number,default:1},
        totalCount:{type:Number,default:0},
        num:{type:Number,default:1},
        bookTime:{type:String,default:''},
        prodList:{type:Array,default:[]},
        massgeTypeList:{type:Array,default:[]},
        massageItem:{type:Object,default:()=>{return {id:0}}},
        worker:{type:Object,default:()=>{return {id:0,nick:''}}},
        user:{type:Object,default:()=>{return {id:0}}},
    },
    data(){
        return {
            massageTitle:'',
            keywords:'',
            activeName:0,
            btime:(new Date()).setMinutes((new Date()).getMinutes()+30),
            typeId:0,
            numb:1,
            options:[],
            loading:false,
            mloading:false,
            userId:0,
            totalPrice:0,
            dialogTableVisible:false,
            gridData:[],
            workerId:0,
            workerList:[],
            workerItem:{id:0,userName:''},
            userMsg:''
        }
    },
    watch: {
        massageItem:function(v,o){
            if(v.price){
                this.totalPrice = v.price*this.numb;
            }
        }
    },
    methods: {
        tabChange(tab){
            this.$emit('tab-change',tab);
        },
        sizeChange(val){
            this.$emit('size-change',val);
        },
        currentChange(val){
            this.$emit('no-change',val);
        },
        numChange(val){
            this.numb=val;
            this.totalPrice = this.massageItem.price*this.numb;
            this.$emit('num-change',val);
        },
        timeChange(val){
            this.$emit('time-change',val);
        },
        selmassgeType(id){
            this.typeId=id;
            this.$emit('tab',id);
        },
        remoteMethod(query){
            if(typeof query != 'string'){
                return ;
            }
            var params = {keyword:query};
            this.req.post("/userinfo/list", params).then(res => {  
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.options = res.data.data.resultList;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        selUser(id){
            this.options.map((subitem,index)=>{
                if(subitem.id==id){
                    this.$emit('search-user',subitem);
                    return;
                }
            });
        },
        delUser(id){
            this.$emit('search-user',{id:0});
        },
        changePrice(){
            this.$prompt('', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder:'请输入新的价格',
                inputType:'number',
                inputValidator:(val)=>{
                    console.log(val>=0)
                    if(val>=0){
                        return true
                    }else{
                        return '请输入正确的金额';
                    }},
            }).then(({ value }) => {
                this.totalPrice = value;
                this.$message.success('改价成功');
            })
        },
        selWorker(){
            this.dialogTableVisible=true;
            this.remoteMethodWorker('');
        },
        selWorkers(id){
            this.workerList.map(item=>{
                if(item.id==id){
                    this.workerItem = item;
                    this.$emit('sel-worker',item);
                    return ;
                }
            });
        },
        delWorker(){
            this.workerItem = {id:0,userName:''}
            this.$emit('del-worker',{id:0})
        },
        remoteMethodWorker(query){
            var params = {userName:query};
            this.req.post("/technician/list", params).then(res => {  
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.workerList = res.data.data.resultList;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        recvMoney(){
            // /cart/order

            // 验证
            if(this.massageItem.id==0){
                this.$message.error("请选择要开单的项目");
                return ;
            }
            if(!this.btime){
                this.$message.error("请选择要开单预约时间");
                return ;
            }
            if(this.user.id==0){
                this.$message.error("请选择要开单会员");
                return ;
            }

            var params = {
                    kind:1,
                    bookTime:this.$moment(this.btime).format("YYYY-MM-DD HH:mm:00"),
                    items:[{"itemid":this.massageItem.id,"quantity":this.numb}],
                    uid:this.user.id,
                    amount:this.totalPrice
                }
            if(this.workerItem.id!=0){
                params.workid=this.workerItem.id;
            }
            if(this.userMsg.length>0){
                params.userMsg=this.userMsg;
            }
            params.items = JSON.stringify(params.items);
            this.loading=true;
            this.req.post('/cart/order',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.$emit('del-massage',{id:0});
                    this.workerItem={id:0,userName:''};
                    this.userMsg="";
                    this.$message.success("开单成功");
                }else{
                    this.$message.error(res.data.sub_msg);
                }
            })
            this.$emit('recv-money',{});
        }
    },
}
</script>
<style scope>
    .search-input{width:220px;}
    .tag{margin:10px 5px;cursor: pointer;font-size:14px;}
    .image{width:100%;height:110px;}
    .prodlist{display:grid;justify-content:space-between;grid-gap:10px;grid-template-columns:repeat(auto-fill, 200px);}
    /* .prodlist::after{flex:1;content:'';margin:5px 15px 5px 0px;} */
    .prod-card{width:200px;margin:5px 15px 5px 0px;}
</style>