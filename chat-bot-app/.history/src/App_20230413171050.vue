<script setup lang="ts">
console.log(
  "---环境变量----", // @ts-ignore
  import.meta.env
);
</script>
<template>
  <router-view></router-view>
</template>

<style>
/* .icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: #e8604c;
} */
#nprogress .bar {
  background-color: #c60b1e !important;
  border: 1px #c60b1e solid;
}
</style>
