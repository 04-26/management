export default {
    routers:[
        {
            path: '/mall',
            name:'Product',
            component: resolve => require(['../components/page/mall/Product.vue'], resolve),
            meta: {title: '商品管理'}
        },
        {
            path: '/addproduct',
            name:'AddProduct',
            component: resolve => require(['../components/page/mall/AddProduct.vue'], resolve),
            meta: {title: '发布商品'}
        },
        {
            path: '/addproddetail',
            name:'AddProdDetail',
            component: resolve => require(['../components/page/mall/AddProdDetail.vue'], resolve),
            meta: {title: '添加商品详情'}
        },
        {
            path: '/mutiladdproduct',
            name:'MutilAddProduct',
            component: resolve => require(['../components/page/mall/MutilAddProduct.vue'], resolve),
            meta: {title: '批量发布商品'}
        },
        {
            path: '/productcategroy',
            name:'ProductCategroy',
            component: resolve => require(['../components/page/mall/ProductCategroy.vue'], resolve),
            meta: {title: '商品分类'}
        },
        {
            path: '/addprodcate',
            name:'AddProdCate',
            component: resolve => require(['../components/page/mall/AddProdCate.vue'], resolve),
            meta: {title: '添加商品分类'}
        },
        {
            path: '/productgroup',
            name:'ProductGroup',
            component: resolve => require(['../components/page/mall/ProductGroup.vue'], resolve),
            meta: {title: '商品组管理'}
        },
        {
            path: '/addprodgroup',
            name:'AddProdGroup',
            component: resolve => require(['../components/page/mall/AddProdGroup.vue'], resolve),
            meta: {title: '添加商品组'}
        },
        {
            path: '/mallorder',
            name:'MallOrder',
            component: resolve => require(['@/components/page/ordermanagement/MallOrder.vue'], resolve),
            meta: {title: '商品订单'}
        },
        {
            path: '/mallorderdetail',
            name:'MallOrderDetail',
            component: resolve => require(['@/components/page/ordermanagement/MallOrderDetail.vue'], resolve),
            meta: {title: '订单详情'}
        },
        {
            path: '/mallrefundorder',
            name:'MallRefundOrder',
            component: resolve => require(['@/components/page/ordermanagement/MallRefundOrder.vue'], resolve),
            meta: {title: '维权订单'}
        },
        {
            path: '/mallrefundorderdetail',
            name:'MallRefundOrderDetail',
            component: resolve => require(['@/components/page/ordermanagement/MallRefundOrderDetail.vue'], resolve),
            meta: {title: '维权订单详情'}
        },
        {
            path: '/setting/mallexpressadd',
            name:'MallExpressAdd',
            component: resolve => require(['@/components/page/setting/MallExpressAdd.vue'], resolve),
            meta: {title: '快递配送设置'}
        },
        {
            path: '/setting/setarea',
            name:'SetArea',
            component: resolve => require(['@/components/page/setting/SetArea.vue'], resolve),
            meta: {title: '同城配送-设置区域'}
        },
        {
            path: '/setting/mallliftadd',
            name:'MallLiftAdd',
            component: resolve => require(['@/components/page/setting/MallLiftAdd.vue'], resolve),
            meta: {title: '自提点设置'}
        },
        {
            path: '/mallprocure',
            name:'MallProcure',
            component: resolve => require(['@/components/page/ordermanagement/MallProcure.vue'], resolve),
            meta: {title: '采购单'}
        },
        {
            path: '/mallprocuredetail',
            name:'MallProcureDetail',
            component: resolve => require(['@/components/page/ordermanagement/MallProcureDetail.vue'], resolve),
            meta: {title: '采购单详情'}
        },
        {
            path: '/setting/mallopentime',
            name:'MallOpenTime',
            component: resolve => require(['@/components/page/setting/MallOpenTime.vue'], resolve),
            meta: {title: '设置店铺营业时间'}
        },
        {
            path: '/gmallorder',
            name:'GMallOrder',
            component: resolve => require(['@/components/page/marketings/groupbooking/GMallOrder.vue'], resolve),
            meta: {title: '商品拼团订单列表'}
        },
        {
            path: '/gmallorderdetail',
            name:'GMallOrderDetail',
            component: resolve => require(['@/components/page/marketings/groupbooking/GMallOrderDetail.vue'], resolve),
            meta: {title: '商品拼团订单详情'}
        },
        {
            path: '/bmallorder',
            name:'BMallOrder',
            component: resolve => require(['@/components/page/marketings/bargain/BMallOrder.vue'], resolve),
            meta: {title: '商品砍价订单列表'}
        },
        {
            path: '/bmallorderdetail',
            name:'BMallOrderDetail',
            component: resolve => require(['@/components/page/marketings/bargain/BMallOrderDetail.vue'], resolve),
            meta: {title: '商品砍价订单详情'}
        },
    ]
}