<template>
    <div>
        <el-card>
            <el-tabs v-model="activeName" @tab-click="tabChange">
                <el-tab-pane label="开单" name="first">
                    <OpenOrder :prodList="prodList" :pageSize="pageSize" 
                        @tab="selTab" @search="search" @sel-massage="selMassage" @num-change="numChange" @del-massage="delMassage"
                        @search-user="searchUser" @size-change="sizeChange" @no-change="currentChange"
                        :massageItem="massageItem"
                        :num="num"
                        :user="user"
                        :pageNo="pageNo" :totalCount="totalCount" v-loading="loading" :massgeTypeList="massgeTypeList">
                    </OpenOrder>
                </el-tab-pane>
                <el-tab-pane label="开卡" name="second">
                    <OpenCard :prodList="prodList" :pageSize="pageSize" 
                        @tab="selTab" @search="search" @sel-massage="selMassage" @num-change="numChange" @del-massage="delMassage"
                        @search-user="searchUser" @size-change="sizeChange" @no-change="currentChange"
                        :massageItem="massageItem"
                        :num="num"
                        :user="user"
                        :pageNo="pageNo" :totalCount="totalCount" v-loading="loading" :massgeTypeList="massgeTypeList"></OpenCard>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
import OpenOrder from '@/components/page/ordermanagement/OpenOrder.vue';
import OpenCard from '@/components/page/ordermanagement/OpenCard.vue';
export default {
    name:'OpenOrderAndCard',
    data(){
        return {
            activeName:'first',
            prodList:[],
            massgeTypeList:[],
            totalCount:0,
            pageSize:10,
            pageNo:1,
            loading:false,
            typeId:0,
            title:'',
            massageItem:{id:0},
            worker:{id:0,nick:''},
            num:1,
            userList:[],
            user:{id:0}
        }
    },
    created() {
        this.getTypeList();
        this.getProdList();
    },
    methods: {
        tabChange(tab){
            this.activeName = tab.name;
            if(tab.name=='first'){
                this.pageNo=1;
                this.getTypeList()
                this.getProdList();
            }
            if(tab.name=='second'){
                this.pageNo=1;
                this.getCardTypeList();
                this.getCardList();
            }
        },
        getProdList(){
            var params = {pageNo:this.pageNo,pageSize:this.pageSize,onsell:true};
            if(this.typeId!=0){
                params.typeId = this.typeId;
            }
            if(this.title.length!=0){
                params.keywords = this.title;
            }
            this.loading=true;
            this.req.post("/massage/list", params).then(res => {  
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.prodList = res.data.data.resultList;
                    this.totalCount = res.data.data.totalCount;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
                
            });
        },
        getTypeList(){
            var params = {flag:true};
            this.req.post("/massage/type/list", params).then(res => {  
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.massgeTypeList = res.data.data.resultList;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
                
            });
        },
        getCardList(){
            var params = {pageNo:this.pageNo,pageSize:this.pageSize};
            params.kind = this.typeId-1;
            if(this.typeId==0){
                params.kind=3
            }
            if(this.title.length!=0){
                params.keywords = this.title;
            }
            this.loading=true;
            this.req.post("/vipcard/list", params).then(res => {  
                this.loading=false;
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    res.data.data.resultList.forEach(item=>{
                        item.price=item.amount;
                        item.imageUrl=item.cardImageUrl;
                    })
                    this.prodList = res.data.data.resultList;
                    this.totalCount = res.data.data.totalCount;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
                
            });
        },
        getCardTypeList(){
            // var params = {flag:true};
            // this.req.post("/massage/type/list", params).then(res => {  
            //     if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
            //         this.massgeTypeList = res.data.data.resultList;
            //     }else{
            //         this.$message.error(res.data.sub_msg);
            //     }
                
            // });
            this.massgeTypeList = [
                {id:1,title:'次数卡'},
                {id:2,title:'折扣卡'},
                {id:3,title:'充值卡'},
            ];
        },
        getUserList(){
            // /userinfo/list
            var params = {keyword:this.keywords};
            this.req.post("/userinfo/list", params).then(res => {  
                if(res.data.code=='SUCCESS' && res.data.sub_code=='SUCCESS'){
                    this.userList = res.data.data.resultList;
                }else{
                    this.$message.error(res.data.sub_msg);
                }
                
            });
        },
        selTab(id){
            this.typeId=id;
            this.pageNo=1;
            if(this.activeName=='first'){
                this.getProdList();
            }
            if(this.activeName=='second'){
                this.getCardList();
            }
        },
        search(title){
            this.title=title;
            if(this.activeName=='first'){
                this.getProdList();
            }
            if(this.activeName=='second'){
                this.getCardList();
            }
        },
        searchUser(item){
            this.user = item;
        },
        selMassage(item){
            this.massageItem = item;
        },
        delMassage(){
            this.massageItem={id:0};
        },
        numChange(val){
            this.num=val;
        },
        sizeChange(val){
            this.pageSize=val;
            if(this.activeName=='first'){
                this.getProdList();
            }
            if(this.activeName=='second'){
                this.getCardList();
            }
        },
        currentChange(val){
            this.pageNo=val;
            if(this.activeName=='first'){
                this.getProdList();
            }
            if(this.activeName=='second'){
                this.getCardList();
            }
        }
    },
    components:{
        OpenOrder,
        OpenCard
    }
}
</script>