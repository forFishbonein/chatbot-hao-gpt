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
onMounted(() => {
  let mainContainer = document.getElementById("main-container");
  //用于使map自适应高度和宽度,通过窗体高宽计算容器高宽
  let resizeMainContainer = function () {
    // @ts-ignore
    // mainContainer.style.width = window.innerWidth + "px";
    mainContainer.style.width = "80%";
    // @ts-ignore
    mainContainer.style.height = window.innerHeight + "px";
  };
  //设置容器高宽
  resizeMainContainer();
});
</script>
<template>
  <div id="main-container">
    <div v-for="(m, i) in messages" :key="i">
      <div v-if="m.isBot" class="bot-say">
        <img src="@/assets/img/bot.png" />
        <div>{{ m.content }}</div>
      </div>
      <div v-else class="my-say">
        <div>{{ m.content }}</div>
        <img src="@/assets/img/people.png" />
      </div>
    </div>
    <input
      v-model="prompt"
      type="text"
      placeholder="在此输入提示语..."
      class="inputStyle"
    />
    <button @click="clickToSend" class="buttonStyle">发送</button>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  // width: 1000px;
  // height: 800px;
  margin: 0 auto;
}
.buttonStyle {
  height: 27px;
  width: 80px;
  border: 0;
  background-color: #6c6c6c;
  box-shadow: 0 0 1px #272727, 0 0 10px 2px #3c3c3c, 0 0 10px 4px #4f4f4f;
  border-radius: 4px;
  font-family: Calibri;
  font-weight: 800;
  font-style: italic;
  color: rgb(255, 255, 255);
  cursor: pointer;
}
.buttonStyle:hover {
  animation: buttonEffect 0.4s linear;
  transition-timing-function: linear;
}
.buttonStyle:active {
  transform: scale(1.2);
  bottom: -3px;
  transition-timing-function: ease-in-out;
}
@keyframes buttonEffect {
  0% {
    background: radial-gradient(ellipse 20px 8px, white, black, black);
  }
  20% {
    background: radial-gradient(ellipse 30px 12px, white, black, black);
  }
  40% {
    background: radial-gradient(ellipse 40px 16px, white, black, black);
  }
  60% {
    background: radial-gradient(ellipse 50px 20px, white, black, black);
  }
  80% {
    background: radial-gradient(ellipse 60px 24px, white, black, black);
  }
  100% {
    background: radial-gradient(ellipse 70px 280px, white, black, black);
  }
}
.inputStyle {
  width: 200px;
  height: 30px;
  background-color: #4f4f4f;
  border-radius: 8px;
  border-width: 5px 5px 5px 5px;
  border-style: inset;
  border-color: black;
  font-family: "Droid Sans Mono Slashed";
  font-weight: 300;
  font-style: italic;
  color: rgb(255, 255, 255);
}
.inputStyle:focus {
  background-color: black;
}
.inputStyle:hover {
  animation: inputEffect 0.8s linear;
  transition-timing-function: linear;
}
@keyframes inputEffect {
  0% {
    border-top-color: rgb(255, 255, 255);
    background: linear-gradient(to right, rgb(255, 255, 255), black 20%);
  }
  25% {
    border-right-color: rgb(255, 255, 255);
    background: linear-gradient(to right, rgb(255, 255, 255), black 40%);
  }
  50% {
    border-bottom-color: rgb(255, 255, 255);
    background: linear-gradient(to right, rgb(255, 255, 255), black 60%);
  }
  75% {
    border-left-color: rgb(255, 255, 255);
    background: linear-gradient(to right, rgb(255, 255, 255), black 80%);
  }
  100% {
    border-color: cyan;
    background: linear-gradient(to right, rgb(255, 255, 255), black 100%);
  }
}
</style>
