<script setup lang="ts">
import { ref, reactive, defineExpose, onMounted } from "vue";
import { useRouter } from "vue-router";
import { sendMessage } from "@/apis/chat";
import { resultMessagesType } from "@/apis/Interface";
let prompt = ref("");
let messages = ref([] as resultMessagesType[]); //前端存储的所有记录
let requestingFlag = false;
let indexFlag = ref(1);
const enterToSend = (event: any) => {
  if (event.keyCode === 13) {
    // 执行发送消息的操作
    clickToSend();
  }
};
const clickToSend = () => {
  if (prompt.value) {
    if (requestingFlag === false) {
      requestingFlag = true;
      messages.value.push({ content: prompt.value, isBot: false });
      const data = { message: prompt.value };
      prompt.value = ""; //在后面才可以清空
      messages.value.push({
        content: "加载中...",
        isBot: true,
      });
      // textContainer.innerHTML =
      //   messages.value[messages.value.length - 1].content;
      sendMessage(data).then((res) => {
        let textContainer = document.getElementById(
          "content-reply-bot-" + indexFlag.value
        ); // 获取文本容器
        var cursorEls = document.getElementsByClassName("cursor");
        var cursorEl =
          document.getElementsByClassName("cursor")[cursorEls.length - 1]; // 获取打字光标容器
        console.log(res.data);
        messages.value.splice(-1, 1, {
          content: "",
          isBot: true,
        });
        indexFlag.value += 2; //因为中间隔着一个用户发送的！
        console.log(textContainer);

        var text = res.data.content.replace(/\n/g, "<br>"); // 文本内容
        var index = 0; // 初始化索引值
        // 定义打字机效果的函数
        function type() {
          let temple_str =
            text[index] + text[index + 1] + text[index + 2] + text[index + 3];
          if (temple_str === "<br>") {
            // @ts-ignore
            textContainer.innerHTML += temple_str;
            index += 4; // 索引值自增
          } else {
            // @ts-ignore
            textContainer.innerHTML += text[index]; // 将当前字符添加到文本容器中
            index++; // 索引值自增
          }

          if (index >= text.length) {
            // 如果已经到达文本末尾
            clearInterval(timer); // 停止定时器
            // 延迟一段时间后隐藏光标
            setTimeout(() => {
              // @ts-ignore
              cursorEl.style.display = "none";
            }, 200);
            return;
          }
        }
        var timer = setInterval(type, 100); // 每隔100ms调用type函数
        requestingFlag = false;
      });
    } else {
      //@ts-ignore
      ElMessage({
        type: "warning",
        message: "请不要重复请求！",
      });
    }
  } else {
    //@ts-ignore
    ElMessage({
      type: "warning",
      message: "请输入内容！",
    });
  }
};
//用于使map自适应高度和宽度,通过窗体高宽计算容器高宽
let resizeMainContainer = function () {
  let mainContainer = document.getElementById("main-container");
  // @ts-ignore
  // mainContainer.style.width = window.innerWidth + "px";
  mainContainer.style.width = "1226px";
  // @ts-ignore
  mainContainer.style.height = window.innerHeight + "px";
};
let maxHeight = ref(0);
let resizeHeight = function () {
  let domMessages = document.getElementsByClassName("messages")[0];
  // console.log(domMessages);
  // // @ts-ignore
  // console.log(domMessages.offsetHeight);
  // @ts-ignore
  maxHeight.value = domMessages.offsetHeight - 20 + "px";
  // console.log(maxHeight.value);
};

const initDrag = () => {
  var dragElement = document.getElementById("drag-element");
  var targetElement = document.getElementById("target-element");
  var verifyElement = document.getElementById("verify");
  // @ts-ignore
  dragElement.addEventListener("dragstart", function (event) {
    // @ts-ignore
    event.dataTransfer.setData("text", "dragging");
  });
  // @ts-ignore
  dragElement.addEventListener("dragend", function (event) {
    // @ts-ignore
    event.dataTransfer.clearData();
  });
  // @ts-ignore
  targetElement.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  // @ts-ignore
  targetElement.addEventListener("drop", function (event) {
    event.preventDefault();
    // @ts-ignore
    var data = event.dataTransfer.getData("text");
    if (data === "dragging") {
      // @ts-ignore
      verifyElement.style.display = "none";
      //@ts-ignore
      ElMessage({
        type: "success",
        message: "验证通过！",
      });
      // alert("验证通过");
    } else {
      //@ts-ignore
      ElMessage({
        type: "warning",
        message: "验证失败！",
      });
      // alert("验证失败");
    }
  });
};
onMounted(() => {
  //设置容器高宽
  resizeMainContainer();
  resizeHeight();

  initDrag();
});
</script>
<template>
  <div id="main-container">
    <div class="message-wapper">
      <div class="head-title"><img src="@/assets/img/logo.png" /></div>

      <div class="messages">
        <el-scrollbar :max-height="maxHeight">
          <div
            v-for="(m, i) in messages"
            :key="i"
            :class="'line-block-' + m.isBot"
          >
            <div v-if="m.isBot" class="bot-say">
              <img src="@/assets/img/bot.png" />
              <div>
                <span :id="'content-reply-bot-' + i" v-html="m.content"></span>
                <span class="cursor"></span>
              </div>
            </div>
            <div v-else class="my-say">
              <div v-html="m.content"></div>
              <img src="@/assets/img/people.png" />
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div class="operate-board">
        <input
          v-model="prompt"
          type="text"
          placeholder="在此输入提示语..."
          class="inputStyle"
          @keydown.enter="enterToSend"
        />
        <button @click="clickToSend" class="buttonStyle">发送</button>
      </div>
    </div>
  </div>
  <div id="verify" class="backdrop">
    <div class="wapper">
      <div class="word-title">人机验证</div>
      <div id="drag-element" draggable="true">
        <span>请将我拖到下面的方框中</span>
      </div>
      <div id="target-element"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backdrop {
  width: 80%;
  height: 40%;
  // border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  // letter-spacing: 0.5em;
  backdrop-filter: blur(10px);
  // color: #fff;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3);
}
.word-title {
  font-size: 18px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  width: 300px;
  height: 35px;
}
#verify {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  .wapper {
    width: 300px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
}
// #drag-element {
//   width: 200px;
//   height: 50px;
//   background-color: #eee;
//   text-align: center;
//   line-height: 50px;
// }

// #target-element {
//   width: 200px;
//   height: 200px;
//   background-color: #ccc;
//   margin-top: 20px;
// }
/* 拖动验证框样式 */
#drag-element {
  width: 250px;
  height: 50px;
  background-color: #fff;
  border: 1px solid #4f4f4f;
  border-radius: 25px;
  cursor: move;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 14px;
  color: #272727;
}
#target-element {
  width: 250px;
  height: 50px;
  background-color: #f5f5f5;
  border: 1px dashed #4f4f4f;
  border-radius: 25px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  color: #272727;
}

/* 光标的样式定义 */
.cursor {
  display: inline-block;
  width: 3px;
  height: 1em;
  margin-left: 5px;
  vertical-align: middle;
  animation: blink 0.5s step-end infinite;
  background-color: rgb(255, 255, 255);
}

@keyframes blink {
  from,
  to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
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
  .head-title {
    width: 800px;
    height: auto;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
    // border-bottom: 1px rgb(255,255,255) solid;
    // box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
    img {
      width: 150px;
      height: 40px;
    }
  }
  .messages {
    width: 800px;
    height: 85%;
    position: relative;
    // border: 1px #e8604c solid;
    box-shadow: inset 0px 5px 30px -5px rgba(0, 0, 0, 0.12);

    .line-block-true {
      width: 100%;
      min-height: 45px;
      margin-top: 20px;
      position: relative;
      display: flex;
      justify-content: left;
    }
    .line-block-false {
      width: 100%;
      min-height: 45px;
      margin-top: 20px;
      position: relative;
      display: flex;
      justify-content: right;
    }
    // .line-block:after {
    //   content: "";
    //   display: block;
    //   clear: both;
    // }
    .my-say {
      display: flex;
      justify-content: left;
      align-items: start;
      // position: absolute;
      // right: 10px;
      padding-right: 10px;
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
      justify-content: left;
      align-items: start;
      // position: absolute;
      // left: 10px;
      padding-left: 10px;
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
        font-family: Calibri;
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
  font-family: Calibri;
  font-weight: 300;
  font-style: italic;
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
    border-color: rgb(192, 192, 192); /* 控制闪光的颜色 */
    background: linear-gradient(to right, rgb(255, 255, 255), black 100%);
  }
}
</style>
