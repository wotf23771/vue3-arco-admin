import { DEFAULT_ROUTE, DEFAULT_ROUTE_NAME, REDIRECT_ROUTE_NAME } from "@/router/constants";
import { isString } from "@/utils/is";
import { defineStore } from "pinia";
import { RouteLocationNormalized } from "vue-router";
import { TabBarState, TagProps } from "./types";

const formatTag = (route: RouteLocationNormalized) => {
  const { name, meta, fullPath, query, path } = route;
  return {
    title: meta.title || "",
    name: String(name),
    path,
    fullPath,
    query,
    ignoreCache: meta.ignoreCache,
  };
};

const BAN_LIST = [REDIRECT_ROUTE_NAME];

const useAppStore = defineStore("tabBar", {
  state: (): TabBarState => ({
    cacheTabList: new Set([DEFAULT_ROUTE_NAME]), // 当前 tab name列表
    tagList: [DEFAULT_ROUTE], // 当前 tab 集合
    currentIndex: 0, // 当前打开的tab index
    currentName: "", // 当前打开的tab name
  }),

  getters: {
    getTabList(): TagProps[] {
      return this.tagList;
    },
    getCacheList(): string[] {
      return Array.from(this.cacheTabList);
    },
  },

  actions: {
    updateTabList(route: RouteLocationNormalized) {
      if (BAN_LIST.includes(route.name as string)) return;
      this.tagList.push(formatTag(route));
      if (!route.meta.ignoreCache) {
        this.cacheTabList.add(route.name);
      }
      console.log("cacheTabList", this.cacheTabList);
    },
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1);
      this.cacheTabList.delete(tag.name);
    },
    addCache(name: string) {
      if (isString(name) && name !== "") this.cacheTabList.add(name);
    },
    // 关闭当前 tab
    closeCurrent(): void {
      this.tagList.splice(this.currentIndex, 1);
      this.cacheTabList.delete(this.currentName);
    },
    setCurrentIndex(index: number): void {
      this.currentIndex = index;
    },
    setCurrentName(name: string): void {
      this.currentName = name;
    },
    deleteCache(tag: TagProps) {
      this.cacheTabList.delete(tag.name);
    },
    freshTabList(tags: TagProps[]) {
      this.tagList = tags;
      this.cacheTabList.clear();
      // 要先判断ignoreCache
      this.tagList
          .filter((el) => !el.ignoreCache)
          .map((el) => el.name)
          .forEach((x) => this.cacheTabList.add(x));
    },
    resetTabList() {
      this.tagList = [DEFAULT_ROUTE];
      this.cacheTabList.clear();
      this.cacheTabList.add(DEFAULT_ROUTE_NAME);
    },
  },
});

export default useAppStore;
