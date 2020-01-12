<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-lx-home",
          index: "index",
          title: "首页"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "servicemanagement",
          title: "服务管理"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "mall",
          title: "商品管理"
        },
        {
          icon: "el-icon-lx-friend",
          index: "technician",
          title: "技师管理"
        },
        // {
        //   icon: "el-icon-lx-copy",
        //   index: "1",
        //   title: "商品管理"
        // },
        {
          icon: "el-icon-lx-copy",
          index: "ordermanagement",
          title: "订单管理",
          subs:[
            // {icon: "el-icon-lx-copy", index: "MallProcure", title: "采购单",},//下一个版本开发
            {icon: "el-icon-lx-copy", index: "ordermanagement", title: "服务订单",},
            {icon: "el-icon-lx-copy", index: "MallOrder", title: "商品订单",},
            {icon: "el-icon-lx-copy", index: "MallRefundOrder", title: "维权订单",},
          ]
        },
        {
          icon: "el-icon-lx-calendar",
          index: "membercenter",
          title: "会员中心"
          /*      subs: [
                            {
                                index: 'form',
                                title: '基本表单'
                            },
                            {
                                index: '3-2',
                                title: '三级菜单',
                                subs: [
                                    {
                                        index: 'editor',
                                        title: '富文本编辑器'
                                    },
                                    {
                                        index: 'markdown',
                                        title: 'markdown编辑器'
                                    },
                                ]
                            },
                            {
                                index: 'upload',
                                title: '文件上传'
                            }
                        ]  */
        },
        // {
        //   icon: "el-icon-lx-emoji",
        //   index: "datacenter",
        //   title: "数据中心"
        // },
        {
          icon: "el-icon-lx-emoji",
          index: "assetsmanagement",
          title: "资产管理"
        },
        {
          icon: "el-icon-rank",
          index: "marketing",
          title: "营销应用"
          /*  subs: [
                            {
                                index: 'marketing',
                                title: '营销应用',
                        
                            },
                            {
                                index: 'membership',
                                title: '会员卡',
                        
                            },
                            {
                                index: 'groupbooking',
                                title: '拼团',
                            },
                            {
                                index: 'bargainirg',
                                title: '砍价',
                            },
                            {
                                index: '112',
                                title: '秒杀（二期）',
                            },
                            {
                                index: '113',
                                title: '优惠券',
                            },
                            {
                                index: '114',
                                title: '抽奖',
                            }
                        ]  */
        },
        {
          icon: "el-icon-lx-global",
          index: "store",
          title: "店铺管理"
        },
        {
          icon: "el-icon-lx-settings",
          index: "appletsettings",
          title: "设置"
          /* subs: [
                            {
                                index: 'permission',
                                title: '权限测试'
                            },
                            {
                                index: '404',
                                title: '404页面'
                            }
                        ] */
        },
        {
          icon: "el-icon-lx-warn",
          index: "goback",
          title: "返回系统"
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.el-menu-item.is-active {
  border-left: 4px solid #00d1b2 !important;
}
</style>
