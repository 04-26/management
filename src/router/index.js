import Vue from 'vue';
import Router from 'vue-router';
import mall from './mall';

console.log(mall.routers)
Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            name:'Home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/index',
                    name:'Index',
                    component: resolve => require(['../components/page/index/Index.vue'], resolve),
                    meta: {
                        title: '首页'
                    }
                },
                {
                    path: '/datacenter',
                    component: resolve => require(['../components/page/datacenter/Datacenter.vue'], resolve),
                    meta: {
                        title: '数据中心'
                    }
                },
                {
                    path: '/appointment',
                    component: resolve => require(['../components/page/Appointment.vue'], resolve),
                    meta: {
                        title: '预约管理'
                    }
                },
                {
                    path: '/servicemanagement',
                    component: resolve => require(['../components/page/servicemanagement/Servicemanagement.vue'], resolve),
                    meta: {
                        title: '服务管理'
                    }
                },
                {
                    path: '/addservice',
                    component: resolve => require(['../components/page/servicemanagement/Addservice.vue'], resolve),
                    meta: {
                        title: '服务管理'
                    }
                },
                {
                    path: '/ordermanagement',
                    component: resolve => require(['../components/page/ordermanagement/Ordermanagement.vue'], resolve),
                    meta: {
                        title: '订单管理'
                    }
                },
                {
                    path: '/orderdetail',
                    component: resolve => require(['../components/page/ordermanagement/Orderdetail.vue'], resolve),
                    meta: {
                        title: '订单详情'
                    }
                },
                {
                    path: '/openorder',
                    component: resolve => require(['../components/page/ordermanagement/OpenOrderAndCard.vue'], resolve),
                    meta: {
                        title: '开单/开卡'
                    }
                },
                {
                    path: '/technician',
                    component: resolve => require(['../components/page/technician/Technician.vue'], resolve),
                    meta: {
                        title: '技师管理'
                    },
                  
                },
                {
                    path:'/addtechnician',
                    component: resolve => require(['../components/page/technician/Addtechnician.vue'],resolve),
                    meta:{
                        title:'添加技师'
                    }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {
                        title: '基本表单'
                    }
                },
                {
                    path: '/marketing',
                    component: resolve => require(['../components/page/marketings/Marketings.vue'], resolve),
                    meta: {
                        title: '营销应用'
                    }
                },

                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {
                        title: 'markdown编辑器'
                    }
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {
                        title: '文件上传'
                    }
                },
                {
                    path: '/assetsmanagement',
                    component: resolve => require(['../components/page/assetsmanagement/Assetsmanagement.vue'], resolve),
                    meta: {
                        title: '资产管理'
                    }
                },
                {
                    path: '/forthe',
                    component: resolve => require(['../components/page/assetsmanagement/Forthe.vue'], resolve),
                    meta: {
                        title: '待结算'
                    }
                },
                {
                    path: '/billingdetails',
                    component: resolve => require(['../components/page/assetsmanagement/Billingdetails.vue'], resolve),
                    meta: {
                        title: '店铺账单明细'
                    }
                },
                {
                    path: '/topupdetails',
                    component: resolve => require(['../components/page/assetsmanagement/Topupdetails.vue'], resolve),
                    meta: {
                        title: '充值账单明细'
                    }
                },
                {
                    path: '/balancewithdrawal',
                    component: resolve => require(['../components/page/assetsmanagement/Balancewithdrawal.vue'], resolve),
                    meta: {
                        title: '余额资金提现'
                    }
                },
                {
                    path: '/balancewithdrawalcard',
                    component: resolve => require(['../components/page/assetsmanagement/Balancewithdrawalcard.vue'], resolve),
                    meta: {
                        title: '充值卡资金提现'
                    }
                },
                {
                    path: '/showdetails',
                    name:'showdetails',
                    component: resolve => require(['../components/page/assetsmanagement/Showdetails.vue'], resolve),
                    meta: {
                        title: '提现详情'
                    }
                },
                {
                    path: '/addbankcard',
                    component: resolve => require(['../components/page/assetsmanagement/Addbankcard.vue'], resolve),
                    meta: {
                        title: '添加银行卡'
                    }
                },
                {
                    path: '/addbankcard',
                    component: resolve => require(['../components/page/assetsmanagement/Addbankcard.vue'], resolve),
                    meta: {
                        title: '添加银行卡'
                    }
                },
                {
                    path: '/membership',
                    component: resolve => require(['../components/page/marketings/clubcard/Membership.vue'], resolve),
                    meta: {
                        title: '会员卡'
                    }

                },
                {
                    path: '/carddetail',
                    name:'carddetail',
                    component: resolve => require(['../components/page/marketings/clubcard/Carddetail.vue'], resolve),
                    meta: {
                        title: '会员卡详情'
                    }

                },
                {
                    path: '/timecard',
                    component: resolve => require(['../components/page/marketings/clubcard/Timecard.vue'], resolve),
                    meta: {
                        title: '创建次卡'
                    }
                },
                {
                    path: '/discount',
                    component: resolve => require(['../components/page/marketings/clubcard/Discount.vue'], resolve),
                    meta: {
                        title: '创建折扣卡'
                    }
                },
                {
                    path: '/topup',
                    component: resolve => require(['../components/page/marketings/clubcard/Topup.vue'], resolve),
                    meta: {
                        title: '创建充值卡'
                    }
                },
                {
                    path: '/groupbooking',
                    component: resolve => require(['../components/page//marketings/groupbooking/Groupbooking.vue'], resolve),
                    meta: {
                        title: '拼团'
                    }
                },
                {
                    path: '/groupactivitylist',
                    component: resolve => require(['../components/page//marketings/groupbooking/Groupactivitylist.vue'], resolve),
                    meta: {
                        title: '拼团活动订单列表'
                    }
                },
                {
                    path: '/addgroundbooking',
                    component: resolve => require(['../components/page//marketings/groupbooking/Addgroundbooking.vue'], resolve),
                    meta: {
                        title: '新建拼团'
                    }
                },
                {
                    path: '/bargainirg',
                    component: resolve => require(['../components/page/marketings/bargain/Bargainirg.vue'], resolve),
                    meta: {
                        title: '砍价'
                    }
                },
                {
                    path: '/bargainactivityorder',
                    component: resolve => require(['../components/page/marketings/bargain/Bargainactivityorder.vue'], resolve),
                    meta: {
                        title: '砍价活动订单详情'
                    }
                },
                {
                    path: '/addbargainirg',
                    component: resolve => require(['../components/page/marketings/bargain/Addbargainirg.vue'], resolve),
                    meta: {
                        title: '新建砍价'
                    }
                },
                {
                    path: '/barginorderdetail',
                    component: resolve => require(['../components/page/marketings/bargain/Barginorderdetail.vue'], resolve),
                    meta: {
                        title: ''
                    }
                },
                {
                    path: '/discountcoupon',
                    component: resolve => require(['../components/page/marketings/discountcoupon/Discountcoupon.vue'], resolve),
                    meta: {
                        title: '优惠券'
                    }
                },
                {
                    path: '/adddiscountcoupon',
                    component: resolve => require(['../components/page/marketings/discountcoupon/Adddiscountcoupon.vue'], resolve),
                    meta: {
                        title: '添加优惠券'
                    }
                },
                {
                    path: '/resivenum',
                    name:'resivenum',
                    component: resolve => require(['../components/page/marketings/discountcoupon/Resivenum.vue'], resolve),
                    meta: {
                        title: '已领取量'
                    }
                },
                {
                    path: '/promoter',
                    component: resolve => require(['../components/page/marketings/promoter/Promoter.vue'], resolve),
                    meta: {
                        title: '推广员'
                    }
                },
                {
                    path: '/promoter/detail',
                    component: resolve => require(['../components/page/marketings/promoter/PromoterDetail.vue'], resolve),
                    meta: {
                        title: '推广员详情'
                    }
                },
                {
                    path: '/promotionset',
                    component: resolve => require(['../components/page/marketings/promoter/Promotionset.vue'], resolve),
                    meta: {
                        title: '推广设置'
                    }
                },
                {
                    path: '/prodrawalmanagement',
                    component: resolve => require(['../components/page/marketings/promoter/Prodrawalmanagement.vue'], resolve),
                    meta: {
                        title: '推广提现管理'
                    }
                },
                {
                    path: '/promoteaudit',
                    component: resolve => require(['../components/page/marketings/promoter/Promoteaudit.vue'], resolve),
                    meta: {
                        title: '推广员审核'
                    }
                },
                {
                    path: '/promoterrecruit',
                    component: resolve => require(['../components/page/marketings/promoter/Promoterrecruit.vue'], resolve),
                    meta: {
                        title: '推广招募'
                    }
                },
                {
                    path: '/promoterorder',
                    component: resolve => require(['../components/page/marketings/promoter/Promoterorder.vue'], resolve),
                    meta: {
                        title: '推广提佣订单列表'
                    }
                },
                {
                    path: '/setgoods',
                    component: resolve => require(['../components/page/marketings/promoter/Setgoods.vue'], resolve),
                    meta: {
                        title: '设置商品'
                    }
                },
                {
                    path: '/store',
                    component: resolve => require(['../components/page/storemanagement/Store.vue'], resolve),
                    meta: {
                        title: '店铺管理'
                    }
                },
                {
                    path: '/informationediting',
                    component: resolve => require(['../components/page/storemanagement/Informationediting.vue'], resolve),
                    meta: {
                        title: '店铺信息编辑'
                    }
                },
                {
                    path: '/shopcertification',
                    component: resolve => require(['../components/page/storemanagement/shopcertification/Shopcertification.vue'], resolve),
                    meta: {
                        title: '店铺认证'
                    }
                },
                {
                    path: '/personalcertificate',
                    component: resolve => require(['../components/page/storemanagement/shopcertification/Personalcertificate.vue'], resolve),
                    meta: {
                        title: '个人认证'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                },
                {
                    path: '/membercenter',
                    component: resolve => require(['../components/page/membercenter/Membercenter.vue'], resolve),
                    meta: {
                        title: '会员中心'
                    }
                },
                {
                    path: '/membershipdetails',
                    name:'membershipdetails',
                    component: resolve => require(['../components/page/membercenter/Membershipdetails.vue'], resolve),
                    meta: {
                        title: '会员详情'
                    }
                },
                {
                    path: '/membercard',
                    name:'membercard',
                    component: resolve => require(['../components/page/membercenter/Membercard.vue'], resolve),
                    meta: {
                        title: '会员卡'
                    }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: {
                        title: '403'
                    }
                },
                {
                    path: '/appletsettings',
                    component: resolve => require(['../components/page/setting/Appletsettings.vue'], resolve),
                    meta: {
                        title: '小程序设置'
                    }
                },
                {
                    path: '/goback',
                    component: resolve => require(['../components/page/goback/goback.vue'], resolve),
                    meta: {
                        title: '返回系统'
                    }
                },
                // {
                //     path: '/marketing',
                //     component: resolve => require(['../components/page/Marketing.vue'], resolve),
                //     meta: {
                //         title: '403'
                //     }
                // }
            ]
        },
        {
            // 登录
            path: '/login',
            component: resolve => require(['../components/page/login/Login.vue'], resolve)
        },
        {
            //注册
            path: '/register',
            component: resolve => require(['../components/page/login/Register.vue'], resolve)
        },
        {
            //找回密码
            path: '/retrievepassword',
            component: resolve => require(['../components/page/login/Retrievepassword.vue'], resolve)
        },
        {
            //账号管理
            path: '/accountmanagement',
            component: resolve => require(['../components/common/Accountmanagement.vue'], resolve),
            children: [
                {
                // 我的店铺
                path: '/myshop',
                name:'Myshop',
                component: resolve => require(['../components/page/accountmanagement/Myshop.vue'], resolve),
            },
                {
                // 账户信息
                path: '/accountinformation',
                component: resolve => require(['../components/page/accountmanagement/Accountinformation.vue'], resolve),
            },
                {
                // 消息中心
                path: '/messagecenter',
                component: resolve => require(['../components/page/accountmanagement/Messagecenter.vue'], resolve),
            },
                {
                // 修改密码
                path: '/changepassword',
                component: resolve => require(['../components/page/accountmanagement/Changepassword.vue'], resolve),
            },
                {
                // 创建店铺
                path: '/createshop',
                component: resolve => require(['../components/page/accountmanagement/Createshop.vue'], resolve),
            },
        ]
        },
        {
            path:'/malls',
            component: resolve => require(['@/components/common/Home.vue'], resolve),
            children:mall.routers
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})