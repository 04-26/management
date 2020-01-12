<template>
    <div style="width:100%;">
    <el-card shadow="never" class="box-card">
        <div slot="header" class="clearfix">
            <span>营销应用/推广员/推广员详情</span>
        </div>
        <el-row>
            <el-col :span="10">
                <img :src="detail.avatar|avatar" style="width:60px;height:60px;border-radius:50%;">
                <div style="display:inline-block;vertical-align: middle;margin-left: 15px;">
                    <div style="font-size:14px;" class="success">{{detail.nick}}</div>
                    <div style="font-size:14px;">{{detail.telphone}}</div>
                </div>
            </el-col>
            <el-col :span="7">
                <div style="height:60px;line-height:60px;font-size:14px;">
                    <el-button type="primary">加入时间:{{detail.initTime|dateformat}} </el-button>
                </div>
            </el-col>
            <el-col :span="7">
                <div style="height:60px;line-height:60px;font-size:14px;">
                    <el-button type="success" v-if="detail.recommend">上级:{{detail.recommend.parentName}}【{{detail.recommend.parentTel}}】</el-button>
                    <el-button type="success" v-else>暂无上级</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row style="margin:15px 0px;">
            <el-col :span="5">
                <el-button type="primary">姓名：{{detail.realName}}</el-button>
            </el-col>
            <el-col :span="5">
                <el-button type="success" @click="lookQrcode">查看收款二维码</el-button>
            </el-col>
            <el-col :span="7">
                <el-button type="info">直接下级会员数:{{detail.subnum}}人（直接下级推广员和直接下级会员总人数）</el-button>
            </el-col>
            <el-col :span="7">
                <el-button type="info">间接下级会员数:{{detail.secondnum}}人（间接下级推广员和间接下级会员总人数）</el-button>
            </el-col>
        </el-row>
        <el-row style="margin:15px 0px;">
            <el-col :span="5">
                <el-button type="warning">累积佣金：{{acountDetail.promoteTotalAmount}}</el-button>
            </el-col>
            <el-col :span="5">
                <el-button type="warning" >可提现佣金：{{acountDetail.amount}}</el-button>
            </el-col>
            <el-col :span="7">
                <el-button type="warning">已提现佣金:{{(acountDetail.promoteTotalAmount-acountDetail.amount).toFixed(2)}}</el-button>
            </el-col>
            <el-col :span="7">
                <el-button type="success" @click="lookHis">查看提现记录</el-button>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="tabChange">
            <el-tab-pane label="直接下属" name="first">
                <OnePromoterItem :tableData="tableData" @detail="toDetail" v-if="activeName=='first'" :loading="loading"></OnePromoterItem>
            </el-tab-pane>
            <el-tab-pane label="提佣订单" name="second">
                <PromoterOrderItem :tableData="tableData" :currUser="detail" v-if="activeName=='second'" :loading="loading"></PromoterOrderItem>
            </el-tab-pane>
            <el-tab-pane label="间接下级" name="third">
                <OnePromoterItem :tableData="tableData" @detail="toDetail" clmName="间接下级" v-if="activeName=='third'" :loading="loading"></OnePromoterItem>
            </el-tab-pane>
            <el-tab-pane label="禁用下级" name="fourth">
                <DisPromoterItem :tableData="tableData" :currUser="detail" @detail="toDetail" v-if="activeName=='fourth'" :loading="loading"></DisPromoterItem>
            </el-tab-pane>
        </el-tabs>
        <div style="text-align:center;padding:10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="pageSize" :page-sizes="[10, 50, 100, 200]" 
                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
    </el-card>
    <el-dialog :close-on-click-modal='false' :close-on-press-escape="false"
      :center="true"
      title=""
      width="300px"
      :visible.sync="dialogVisible">
      <div style="text-align:center;">
        <img style="width:100%;height:auto;" :src="detail.qrWxpay|avatar">
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
import OnePromoterItem from '@/components/common/OnePromoterItem.vue'
import PromoterOrderItem from '@/components/common/PromoterOrderItem.vue'
import DisPromoterItem from '@/components/common/DisPromoterItem.vue'
export default {
    name:'PromoterDetail',
    data(){
        return {
            tableData:[],
            loading:false,
            detail:{avatar:''},
            activeName:'first',
            pageSize:10,
            pageNo:1,
            totalCount:0,
            dialogVisible:false,
            acountDetail:{
                promoteTotalAmount: 0,
                amount: 0,
                saleTotalAmount: 0,
            }
        }
    },
    created() {
        var detail = sessionStorage.getItem('promoterDetail');
        if(detail){
            this.detail = JSON.parse(detail);
        }
        this.getDetail();
        this.getpromoter();
        this.getAcount();
    },
    methods:{
        lookHis(){
            sessionStorage.setItem('promoter',JSON.stringify(this.detail));
            this.$router.push({path:'/prodrawalmanagement'});
        },
        tabChange(){
            this.pageNo=1;
            this.pageSize=10;
            this.tableData=[];
            if(this.activeName=='first'){
                this.getpromoter();
            }
            if(this.activeName=='second'){
                this.getOrderList();
            }
            if(this.activeName=='third'){
                this.getsubpromoter();
            }
            if(this.activeName=='fourth'){
                this.getdispromoter();
            }
        },
        getDetail(){
            var postData = {
                id:this.detail.id
            }
            this.loading=true;
            this.req.post("/promoter/detail",postData).then(res=>{
                this.loading=false;  
                if(res.data.code=="SUCCESS" && res.data.sub_code=='SUCCESS'){
                    this.detail = res.data.data;
                }
            })
        },
        handleSizeChange(v){  // 改变每页显示数量
            this.pageSize=v;
            if(this.activeName=='first'){
                this.getpromoter();
            }
            if(this.activeName=='second'){
                this.getOrderList();
            }
            if(this.activeName=='third'){
                this.getsubpromoter();
            }
            if(this.activeName=='fourth'){
                this.getdispromoter();
            }
        },
        handleCurrentChange(v){  // 当前页码改变
            this.pageNo=v;
            if(this.activeName=='first'){
                this.getpromoter();
            }
            if(this.activeName=='second'){
                this.getOrderList();
            }
            if(this.activeName=='third'){
                this.getsubpromoter();
            }
            if(this.activeName=='fourth'){
                this.getdispromoter();
            }
        },
        lookQrcode(){
            this.dialogVisible=true;
        },
        getpromoter() {
            var postData = {
                userType:1,
                pageSize:this.pageSize,
                pageNo:this.pageNo,
                recommendId:this.detail.id
            }
            this.loading = true;
            this.req.post("/promoter/list",postData).then(res => {
                this.loading=false;
                if (res.data.sub_code == "SUCCESS") {
                    this.pageNo = res.data.data.pageNo;
                    this.totalCount = res.data.data.totalCount;
                    this.tableData = res.data.data.resultList;
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        getdispromoter() {
            var postData = {
                userType:10,
                pageSize:this.pageSize,
                pageNo:this.pageNo,
                recommendIds:this.detail.id,
            }
            this.loading = true;
            this.req.post("/promoter/list",postData).then(res => {
                this.loading=false;
                if (res.data.sub_code == "SUCCESS") {
                    this.pageNo = res.data.data.pageNo;
                    this.totalCount = res.data.data.totalCount;
                    this.tableData = res.data.data.resultList;
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        getsubpromoter() {
            var postData = {
                userType:1,
                pageSize:this.pageSize,
                pageNo:this.pageNo,
                recommendIdSuper:this.detail.id
            }
            this.loading = true;
            this.req.post("/promoter/list",postData).then(res => {
                this.loading=false;
                if (res.data.sub_code == "SUCCESS") {
                    this.pageNo = res.data.data.pageNo;
                    this.totalCount = res.data.data.totalCount;
                    this.tableData = res.data.data.resultList;
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        getOrderList() {
            var postData = {
                pageSize:this.pageSize,
                pageNo:this.pageNo,
                benefituid:this.detail.id
            }
            this.loading = true;
            this.req.post("/order/benefitlist",postData).then(res => {
                this.loading=false;
                if (res.data.sub_code == "SUCCESS") {
                    this.pageNo = res.data.data.pageNo;
                    this.totalCount = res.data.data.totalCount;
                    this.tableData = res.data.data.resultList;
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            });
        },
        toDetail(row){
            sessionStorage.setItem("memeberDetail",JSON.stringify(row));
            this.$router.push({path:"/membershipdetails",query:{
                avatar:row.avatar,
                nick:row.nick,
                telphone:row.telphone,
                birthDate:row.birthDate,
                sexStr:row.sexStr,
                regionName:row.regionName,
                recentVisitTime:this.$moment(row.recentVisitTime).format('YYYY-MM-DD HH:mm:ss'),
                accountAmount:row.accountAmount,
                amountOrigin:row.amountOrigin,
                totalConsumption:row.totalConsumption,
                cardCount:row.cardCount,
                uid:row.id
            }})
        },
        getAcount(){
            // /promoter/account
            var postData = {
                userId:this.detail.id
            }
            this.req.post("/promoter/account",postData).then(res => {
                if (res.data.sub_code == "SUCCESS") {
                    if(res.data.data){
                        this.acountDetail = res.data.data;
                    }
                } else {
                    this.$message.error(res.data.sub_msg);
                }
            });
        }
    },
    components:{
        OnePromoterItem,
        PromoterOrderItem,
        DisPromoterItem
    }
}
</script>
<style scope>

</style>