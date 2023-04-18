<script setup lang="ts">
import { ref, reactive, defineExpose, onMounted } from "vue";
import { useRouter } from "vue-router";
import { sendMessage } from "@/apis/chat";
import { resultMessagesType } from "@/apis/Interface";
let prompt = ref("");
let messages = ref([] as resultMessagesType[]);
const clickToSend = () => {
  const data = { message: prompt.value };
  sendMessage(data).then((res) => {
    messages.value.push({ content: prompt.value, isBot: false });
    messages.value.push({ content: res.data.content, isBot: true });
    prompt.value = "";
  });
};
onMounted(() => {});
</script>
<template>
  <div>
    <div v-for="(m, i) in messages" :key="i">
      <div v-if="m.isBot">{{ m.content }}</div>
      <div v-else>{{ m.content }}</div>
    </div>
    <input
      v-model="prompt"
      type="text"
      placeholder="Type your message here..."
    />
    <button @click="clickToSend">发送</button>
  </div>
</template>

<style lang="scss" scoped></style>
