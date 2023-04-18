import { defineStore } from "pinia";
import { UserInfo } from "@/apis/user/uInterface";
import { passLogin, logout } from "@/apis/user/login";
import { register } from "@/apis/user/register";
import { getUserInfo } from "@/apis/user/user";
import pinia from "@/store";
export interface UserState {
  userInfo: UserInfo;
  token: string;
  getUserFlag: boolean;
}
export const mainStore = defineStore("main", {
  persist: {
    key: "main",
    storage: window.localStorage,
  }, //开启缓存
  state: () =>
    ({
      userInfo: {
        // email: "",
      } as UserInfo,
      token: "",
      getUserFlag: false,
    } as UserState),
  getters: {},
  actions: {
    passLogin(passData: any) {
      return new Promise((resolve, reject) => {
        try {
          passLogin(passData).then((res) => {
            // @ts-ignore
            console.log(res.message);
            // @ts-ignore
            this.$state.token = res.message;
            // setToken(res.data);
            resolve(res);
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo(this.$state.token)
          .then((res) => {
            // @ts-ignore
            if (res.code === 2000) {
              this.$state.userInfo = res.data;
              resolve(res);
            } else {
              //@ts-ignore
              this.$state.userInfo = {} as UserInfo; //清空对象
              this.$state.getUserFlag = false;
              this.$state.token = "";
              // removeToken();
              resolve(res);
            }
          })
          .catch((error) => {
            //@ts-ignore
            this.$state.userInfo = {} as UserInfo; //清空对象
            this.$state.getUserFlag = false;
            this.$state.token = "";
            // removeToken();
            reject(error);
          });
      });
    },
    register(registerData: any) {
      return new Promise((resolve, reject) => {
        try {
          register(registerData).then((res) => {
            console.log(res.data);
            // 不会返回token
            // this.$state.token = res.data;
            // setToken(res.data);
            resolve(res);
          });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
    fedLogOut() {
      return new Promise((resolve, reject) => {
        try {
          this.$state.userInfo = {} as UserInfo; //清空对象
          // setFlag(false);
          this.$state.getUserFlag = false;
          this.$state.token = "";
          resolve("用户超时登出成功"); //这里传参不能为空，ts严格检查
        } catch (error) {
          reject(error);
        }
      });
    },
    logout() {
      return new Promise((resolve, reject) => {
        //@ts-ignore
        this.$state.userInfo = {} as UserInfo; //清空对象
        console.log(this.$state.userInfo);
        this.$state.token = ""; //重置token
        this.$state.getUserFlag = false; //改变用户信息标志变量
        // 调用后端接口，也可以不调用！
        // logout(this.$state.token)
        //   .then((res) => {
        //     console.log(res);
        //     if (res) {
        //       //@ts-ignore
        //       this.$state.userInfo = {} as UserInfo; //清空对象
        //       console.log(this.$state.userInfo);
        //       this.$state.token = ""; //重置token
        //       this.$state.getUserFlag = false; //改变用户信息标志变量
        //       resolve(res);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     reject(error);
        //   });
      });
    },
  },
});
