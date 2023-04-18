<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
onMounted(() => {});
</script>
<template>
  <div class="page-wrapper">
    <BaseHeader></BaseHeader>
    <router-view v-slot="{ Component }">
      <!-- <keep-alive v-if="$route.meta.keepAlive"> -->
      <!-- 只有在一个容器切换时alive才生效，并且只有include可以生效，meta不行 -->
      <keep-alive :include="['Home']">
        <component :is="Component" />
      </keep-alive>
      <!-- <component :is="Component" v-else /> -->
    </router-view>
    <BaseFooter></BaseFooter>
  </div>
</template>

<style lang="scss" scoped></style>
