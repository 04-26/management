<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="tabChange" type="card">
      <el-tab-pane label="快递发货" name="first">
        <h4 style="text-indent:5px;">快递发货功能</h4>
        <Notes content="启用后，买家下单可以选择快递发货，由你安排快递送货上门" padding="5px 5"></Notes>
        <el-button type="primary" @click="addExp">新增配送方案</el-button>
        <el-table :data="tempList" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="配送方案"></el-table-column>
          <el-table-column label="操作" width="600" align='center'>
            <template slot-scope="scope">
              <div>
                <span>创建时间：{{scope.row.initTime|dateformat}}</span>&nbsp;&nbsp;
                <el-button type="primary" size="mini" v-if="false">查看使用该商品的方案</el-button>
                <el-button type="success" size="mini" @click="copyExp(scope.row)" v-if="false">复制方案</el-button>
                <el-button type="success" size="mini" @click="editExp(scope.row)">修改</el-button>
                <el-button type="warning" size="mini" @click="delExp(scope.row,scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="pageNoChange" style="margin:10px auto;text-align:right;" 
            :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="同城配送" name="two">
        <h4 style="text-indent:5px;">同城配送</h4>
        <el-table :data="cityCase" style="width: 100%" v-loading="loading">
          <el-table-column label="配送方案" width="300">商家配送</el-table-column>
          <el-table-column label="说明">
            <template slot-scope="scope">
                用户下单后可以选择商家配送的配送方式，由商家安排配送商品，配送费由商家设置
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="配送费" width="145"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <div>
                <el-button type="success" @click="upAreaStatus(scope.row)" v-if="scope.row.status==2">启用</el-button>
                <el-button type="warning" @click="upAreaStatus(scope.row)" v-if="scope.row.status==1">禁用</el-button>
                <el-button type="primary" @click="setArea(scope.row)">设置</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="上门自提" name="three">
        <h4 style="text-indent:5px;">买家上门自提功能</h4>
        <Notes content="启用上门自提功能后，买家可以就近选择你预设的自提点，下单后你需要尽快将商品配送至指定自提点。" padding="5"></Notes>
        <el-button type="primary" @click="liftAdd()">新增自提点</el-button>
        <el-table :data="liftList" style="width: 100%" v-loading="mloading">
          <el-table-column prop="name" label="自提点名称"></el-table-column>
          <el-table-column prop="provinceId" label="省份">
            <template slot-scope='scope'>
              <div>
                {{getRegionName(scope.row,0)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cityId" label="城市">
            <template slot-scope='scope'>
              <div>
                {{getRegionName(scope.row,1)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="regionId" label="地区">
            <template slot-scope='scope'>
              <div>
                {{getRegionName(scope.row,2)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="telphone" label="联系电话"></el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="success" @click="upLiftStatus(scope.row)" v-if="scope.row.status==2">启用</el-button>
                <el-button type="warning" @click="upLiftStatus(scope.row)" v-if="scope.row.status==1">禁用</el-button>
                <el-button type="primary" @click="liftAdd(scope.row)">编辑</el-button>
                <el-button type="danger" @click="delLift(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="msizeChange" @current-change="mpageNoChange" style="margin:10px auto;text-align:right;" 
            :current-page="pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="slot, total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="快递配送设置" :visible.sync="expVibs" width="600" class="exp">
      <div>
      </div>
      <div slot="footer">
        <el-button @click="expVibs = false">取 消</el-button>
        <el-button type="primary" @click="expVibs = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Notes from '@/components/page/mall/Notes.vue';
export default {
    name:'MallDistrTemplate',
    data(){
        return {
          activeName:'first',
          liftList:[],
          tempList:[],
          cityCase:[
            {name:'商家配送',amount:0}
          ],
          loading:false,
          totalCount:0,
          pageSize:10,
          pageNo:1,
          mloading:false,
          mtotalCount:0,
          mpageSize:10,
          mpageNo:1,
          expVibs:false,
        }
    },
    created(){
      sessionStorage.removeItem('area');
      sessionStorage.removeItem('liftItem');
      this.getTempList();
    },
    methods: {
        getRegionName(item,index){
          if(item.regionname){
            var regionnameArr = item.regionname.split(' ');
            return regionnameArr[index]?regionnameArr[index]:'';
          }
        },
        tabChange(tab){
          this.activeName = tab.name;
          this.pageNo = 1;
          this.tempList = [];
          this.getTempList();
        },
        sizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.loading=true;
            this.tempList = [];
            this.getTempList();
        },
        pageNoChange(pageNo){
            this.mpageNo = pageNo;
            this.mloading=true;
            this.getTempList();
        },
        msizeChange(size){
            this.pageSize = size;
            this.pageNo = 1;
            this.loading=true;
            this.getTempList();
        },
        mpageNoChange(pageNo){
            this.mpageNo = pageNo;
            this.mloading=true;
            this.getTempList();
        },
        getTempList(){
          if(this.activeName=='first'){
            // /express/list
            var params = {pageNo:this.pageNo,pageSize:this.pageSize}
            this.req.post("/express/list", params).then(res => { 
              this.loading=false;
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.totalCount = res.data.data.totalPageCount;
                  this.tempList = this.tempList.concat(res.data.data.resultList);
              }
            })
          }
          if(this.activeName=='two'){
            // /delivery/list
            var params = {pageNo:this.pageNo,pageSize:this.pageSize}
            this.req.post("/delivery/list", params).then(res => { 
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.totalCount = res.data.data.totalPageCount;
                  if(res.data.data.resultList.length!=0){
                    this.cityCase = res.data.data.resultList;
                  }
                  // this.cityCase = this.cityCase.concat(res.data.data.resultList);
              }
            })
          }
          if(this.activeName=='three'){
            // /selflift/list
            var params = {pageNo:this.pageNo,pageSize:this.pageSize}
            this.req.post("/selflift/list", params).then(res => { 
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.mtotalCount = res.data.data.totalPageCount;
                  this.liftList = this.tempList.concat(res.data.data.resultList);
              }
            })
          }
        },
        addExp(){
          localStorage.setItem('activeName','fourth');
          localStorage.removeItem('expItem');
          this.$router.push({path:'/setting/mallexpressadd'})
        },
        editExp(item){
          localStorage.setItem('activeName','fourth');
          localStorage.setItem('expItem',JSON.stringify(item));
          this.$router.push({path:'/setting/mallexpressadd'})
        },
        delExp(item,index){
          // /express/remove
          this.$confirm('此操作将永久删除该条数据, 是否继续?', '温馨提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
              var params = {id:item.id};
              this.loading=true;
              this.req.post('/express/remove',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.$message.success('删除成功');
                  // this.tempList.splice(index,1);
                  this.tempList = [];
                  this.getTempList();
                }else{
                  this.$message.error(res.data.sub_msg);
                }
              })
          })
        },
        copyExp(item){
          localStorage.setItem('activeName','fourth');
          localStorage.setItem('expItem',JSON.stringify(item));
          localStorage.setItem('isCopy',true);
          this.$router.push({path:'/setting/mallexpressadd'})
        },
        setArea(item){
          sessionStorage.setItem('area',JSON.stringify(item));
          localStorage.setItem('activeName','fourth');
          this.$router.push({path:'/setting/setarea'});
        },
        upAreaStatus(item){
          // /delivery/upstatus
          var params = {id:item.id};
          if(item.status==1){
            params.status = 2;
          }else{
            params.status = 1;
          }
          this.loading = true;
          this.req.post('/delivery/upstatus',params).then(res=>{
            this.loading = false;
            if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
              this.$message.success('操作成功');
              this.getTempList();
            }else{
              this.$message.error(res.data.sub_msg);
            }
          })
        },
        liftAdd(liftItem){
          if(liftItem){
            sessionStorage.setItem('liftItem',JSON.stringify(liftItem));
          }
          localStorage.setItem('activeName','fourth');
          this.$router.push({path:'/setting/mallliftadd'});
        },
        upLiftStatus(item){
            // /selflift/upstatus
            var params = {id:item.id};
            if(item.status==1){
              params.status = 2;
            }else{
              params.status = 1;
            }
            this.loading = true;
            this.req.post('/selflift/upstatus',params).then(res=>{
              this.loading = false;
              if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                this.$message.success('操作成功');
                this.getTempList();
              }else{
                this.$message.error(res.data.sub_msg);
              }
            })
        },
        delLift(item){
          this.$confirm('此操作将永久删除该条数据, 是否继续?', '温馨提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
              var params = {id:item.id};
              this.loading=true;
              this.req.post('/selflift/remove',params).then(res=>{
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                  this.$message.success('删除成功');
                  this.liftList = [];
                  this.getTempList();
                }else{
                  this.$message.error(res.data.sub_msg);
                }
              })
          })
        }
    },
    components:{
      Notes,
    }
}
</script>
<style scoped>
.exp >>> .el-dialog__body{padding:15px;}
</style>