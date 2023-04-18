<script setup lang="ts">
import { ref, reactive, defineExpose, onMounted } from "vue";
import { useRouter } from "vue-router";

onMounted(() => {});
</script>
<template>
  <div>
    <div v-for="(message, index) in messages" :key="index">
      <div v-if="message.isBot">{{ message.content }}</div>
      <div v-else>{{ message.content }}</div>
    </div>
    <input
      v-model="prompt"
      type="text"
      placeholder="Type your message here..."
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<style lang="scss" scoped></style>
<template>
  <div>
    <div v-for="(message, index) in messages" :key="index">
      <div v-if="message.isBot">{{ message.content }}</div>
      <div v-else>{{ message.content }}</div>
    </div>
    <input
      v-model="prompt"
      type="text"
      placeholder="Type your message here..."
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Chat",
  data() {
    return {
      prompt: "",
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      alert("发送请求");
      const url = "http://127.0.0.1:8080/chatbot/talk";
      const data = { message: this.prompt };
      const response = await axios.post(url, data);
      this.messages.push({ content: this.prompt, isBot: false });
      this.messages.push({ content: response.data.content, isBot: true });
      this.message = "";
      alert("返回成功");
    },
  },
};
</script>
