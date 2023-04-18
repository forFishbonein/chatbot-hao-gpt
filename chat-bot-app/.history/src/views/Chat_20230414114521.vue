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
let mainContainer = document.getElementById("main-container");
//用于使map自适应高度和宽度,通过窗体高宽计算容器高宽
let resizeMainContainer = function () {
  // @ts-ignore
  // mainContainer.style.width = window.innerWidth + "px";
  mainContainer.style.width = "1226px";
  // @ts-ignore
  mainContainer.style.height = window.innerHeight + "px";
};
let domMessages = document.getElementsByClassName("messages")[0];
let height = 0;
let resizeHeight = function () {
  // @ts-ignore
  height = domMessages.getElementsByClassName.height;
};
onMounted(() => {
  //设置容器高宽
  resizeMainContainer();
});
</script>
<template>
  <div id="main-container">
    <div class="message-wapper">
      <h3>欢迎来到haoGPT!</h3>
      <div class="messages">
        <el-scrollbar :max-height="height">
          <div v-for="(m, i) in messages" :key="i" class="line-block">
            <div v-if="m.isBot" class="bot-say">
              <img src="@/assets/img/bot.png" />
              <div>{{ m.content }}</div>
            </div>
            <div v-else class="my-say">
              <div>{{ m.content }}</div>
              <img src="@/assets/img/people.png" />
            </div></div
        ></el-scrollbar>
      </div>
      <div class="operate-board">
        <input
          v-model="prompt"
          type="text"
          placeholder="在此输入提示语..."
          class="inputStyle"
        />
        <button @click="clickToSend" class="buttonStyle">发送</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#main-container {
  // width: 1000px;
  // height: 800px;
  margin: 0 auto;
  // border: 1px #e8604c solid;
}
.message-wapper {
  width: 800px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
  padding-top: 10px;
  .messages {
    width: 800px;
    height: 85%;
    position: relative;
    // border: 1px #e8604c solid;
    padding-top: 20px;

    .line-block {
      width: 100%;
      min-height: 45px;
      margin-top: 20px;
    }
    .my-say {
      display: flex;
      justify-content: center;
      align-items: start;
      position: absolute;
      right: 10px;
      padding-left: 20px;
      img {
        width: 40px;
        height: 40px;
        display: inline-block;
        cursor: pointer;
      }
      div {
        background-color: black;
        color: rgb(255, 255, 255);
        font-size: 14px;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 0 1px #272727, 0 0 10px 2px #3c3c3c, 0 0 10px 4px #4f4f4f;
        margin-right: 20px;
      }
    }
    .bot-say {
      display: flex;
      justify-content: center;
      align-items: start;
      position: absolute;
      left: 10px;
      padding-right: 20px;
      img {
        width: 40px;
        height: 40px;
        display: inline-block;
        cursor: pointer;
      }
      div {
        background-color: black;
        color: rgb(255, 255, 255);
        font-size: 14px;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 0 1px #272727, 0 0 10px 2px #3c3c3c, 0 0 10px 4px #4f4f4f;
        margin-left: 20px;
      }
    }
  }
  .operate-board {
    // position: absolute;
    // bottom: 0px;
    width: 800px;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px dashed rgba(0, 0, 0, 0.12);
  }
}

.buttonStyle {
  height: 38px;
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
  margin-left: 20px;
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
  width: 400px;
  height: 35px;
  background-color: #4f4f4f;
  border-radius: 8px;
  border-width: 5px 5px 5px 5px;
  border-style: inset;
  border-color: black;
  // font-family: "Droid Sans Mono Slashed";
  font-weight: 300;
  // font-style: italic;
  padding-left: 10px;
  color: rgb(255, 255, 255);
  word-spacing: 2px;
  letter-spacing: 2px;
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
