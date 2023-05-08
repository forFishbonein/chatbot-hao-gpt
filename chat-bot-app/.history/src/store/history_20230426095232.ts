import { defineStore } from "pinia";
import pinia from "@/store";
import { oneHistoryType } from "@/apis/Interface";
export const historyStore = defineStore("history", {
  persist: {
    key: "history",
    storage: window.localStorage,
  }, //开启缓存
  state: () => ({
    // remember: [] as oneHistoryType[],
    history: [] as oneHistoryType[],
    lastId: NaN as number,
  }),
  getters: {},
  actions: {},
});
