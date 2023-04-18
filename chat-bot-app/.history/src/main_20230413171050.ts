import { createApp } from "vue";
import pinia from "@/store";
import App from "./App.vue";
import router from "@/router";
// 引入字体
// import "@/assets/fonts/font.css";
// 引入图标库
// import "@/assets/font/iconfont";
// 引入全局element-icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

//创建实例
const setupAll = async () => {
  const app = createApp(App);
  app.use(router);
  app.use(pinia);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  app.mount("#app");
};
setupAll();
