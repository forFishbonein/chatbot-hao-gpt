import { RouteRecordRaw } from "vue-router";
// import Index from "@/Index.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index", //App中包裹Index
    meta: {
      title: "首页",
      keepAlive: true,
      // requireLogin: true, //先加在这里，表示需要登录！
    },
    component: () => import("@/Index.vue"),
    // component: Index,
    redirect: "/chat", //Index中包裹Home等组件
    children: [
      {
        path: "/chat",
        name: "Chat",
        component: () => import("@/views/Chat.vue"), //这个不行，会加载不出来
        // component: Home,
        meta: { title: "首页", keepAlive: true, showTab: true },
      },
    ],
  },
];
