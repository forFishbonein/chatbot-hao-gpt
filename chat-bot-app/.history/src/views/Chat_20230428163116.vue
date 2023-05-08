<script setup lang="ts">
import { ref, reactive, defineExpose, onMounted } from "vue";
import { useRouter } from "vue-router";
import { sendMessage } from "@/apis/chat";
import { resultMessagesType, oneHistoryType } from "@/apis/Interface";
import { historyStore } from "@/store/history";
import ClipboardJS from "clipboard";
// import * as Particles from "particles.js";
const store = historyStore();
let prompt = ref("");
let messages = ref([] as resultMessagesType[]); //前端存储的所有记录
// const initHistory = () => {
//   let l = store.history.length + 1;
//   store.history.push({ id: l, title: `第${l}次对话`, dialogues: [] });
// };
let remember = [] as oneHistoryType[]; //这个是无关的
let myHistory = ref({} as oneHistoryType); //这个是关联的，因为更改操作直接在这里做
const outputFlag = ref(false);
const initMessage = () => {
  messages.value.push({
    content: "加载中...",
    isBot: true,
  });
  setTimeout(() => {
    outputText({ role: "bot", content: "你好，我是你的私人助手HaoGPT！" });
    console.log(messages.value);
    //给这个push不会影响页面，只是为了记忆
    myHistory.value.dialogues.push({
      content: "你好，我是你的私人助手HaoGPT！",
      isBot: true,
    });
  }, 1000);
};
// let dialogId: number;
const createNewDialog = () => {
  if (outputFlag.value == true || requestingFlag == true) {
    //@ts-ignore
    ElMessage({
      type: "warning",
      message: "请等待回答完毕！",
    });
    return;
  }
  // let id = store.history.length + 1;
  let id: number;
  if (store.history.length === 0) {
    id = 1;
  } else {
    id = store.history[0].id + 1;
  }

  store.lastId = id;
  // let id = store.history[store.history.length - 1].id + 1;
  // if (store.history.length === 0) {
  store.history.unshift({ id: id, title: `第${id}次对话`, dialogues: [] });
  setTimeout(() => {
    initFirstStyle();
  }, 500);
  // } else {
  //   store.history.unshift({ id: id, title: `第${id}次对话`, dialogues: [] });
  // }

  // store.remember.push({ id: id, title: `第${id}次对话`, dialogues: [] });
  // dialogId = id;
  // initAll(); //TODO 这里不用initall了，因为肯定会去select，直接在那边init即可！
};
// 找到所有相关的DOM元素
let siblings;
const handleTwoIcons = (event, siblings) => {
  // 获取触发事件的DOM节点
  const targetNode = event.target;
  if (targetNode.nodeName === "DIV") {
    // 获取该节点的子节点
    const childrenNode = targetNode.parentNode.children;
    if (childrenNode[0].style.display === "none") {
      if (childrenNode[2].style.display === "none") {
        childrenNode[2].style.display = "flex";
      }
      if (childrenNode[3].style.display === "none") {
        childrenNode[3].style.display = "flex";
      }
    }
    // console.log(siblings);
    siblings.forEach((e) => {
      if (e !== event.currentTarget) {
        let child = e.children;
        if (child[0].style.display === "flex") {
          child[0].style.display = "none";
        }
        if (child[1].style.display === "none") {
          child[1].style.display = "flex";
        }
        if (child[2].style.display === "flex") {
          child[2].style.display = "none";
        }
        if (child[3].style.display === "flex") {
          child[3].style.display = "none";
        }
        if (child[4].style.display === "flex") {
          child[4].style.display = "none";
        }
      }
    });
  } else {
    // 获取该节点的子节点
    const childrenNode = targetNode.children;
    if (childrenNode[0].style.display === "none") {
      if (childrenNode[2].style.display === "none") {
        childrenNode[2].style.display = "flex";
      }
      if (childrenNode[3].style.display === "none") {
        childrenNode[3].style.display = "flex";
      }
    }
    // console.log(siblings);
    siblings.forEach((e) => {
      if (e !== event.currentTarget) {
        let child = e.children;
        if (child[0].style.display === "flex") {
          child[0].style.display = "none";
        }
        if (child[1].style.display === "none") {
          child[1].style.display = "flex";
        }
        if (child[2].style.display === "flex") {
          child[2].style.display = "none";
        }
        if (child[3].style.display === "flex") {
          child[3].style.display = "none";
        }
        if (child[4].style.display === "flex") {
          child[4].style.display = "none";
        }
      }
    });
  }
};
const selectOneDialog = (event, id: number) => {
  if (outputFlag.value == true || requestingFlag == true) {
    //@ts-ignore
    ElMessage({
      type: "warning",
      message: "请等待回答完毕！",
    });
    return;
  }
  store.lastId = id;
  siblings = document.querySelectorAll(".history-item");
  // 遍历所有元素，将除了当前点击的元素之外的其他元素的选中样式都移除
  siblings.forEach(function (sibling) {
    if (sibling !== event.currentTarget) {
      sibling.classList.remove("selected");
    }
  });
  // 为当前点击的元素添加选中样式
  event.currentTarget.classList.add("selected");
  handleTwoIcons(event, siblings);
  // alert(id);
  // dialogId = id;
  // if (store.history.length !== 1) {
  //因为第一次的时候肯定是添加了一个，长度为1，这时候不应该再初始化
  initAll();
  // }
};
const selectLastDialog = (id) => {
  console.log(id);
  const element = document.querySelectorAll(`li[data-sign="${id}"]`)[0];
  console.log(element);
  siblings = document.querySelectorAll(".history-item");
  // 遍历所有元素，将除了当前点击的元素之外的其他元素的选中样式都移除
  siblings.forEach(function (sibling) {
    if (sibling != element) {
      sibling.classList.remove("selected");
    }
  });
  // 为当前点击的元素添加选中样式
  element.classList.add("selected");
  // 获取该节点的子节点
  const childrenNode = element.children;
  // @ts-ignore
  if (childrenNode[0].style.display === "none") {
    // @ts-ignore
    if (childrenNode[2].style.display === "none") {
      // @ts-ignore
      childrenNode[2].style.display = "flex";
    }
    // @ts-ignore
    if (childrenNode[3].style.display === "none") {
      // @ts-ignore
      childrenNode[3].style.display = "flex";
    }
  }
  // console.log(siblings);
  siblings.forEach((e) => {
    if (e != element) {
      let child = e.children;
      if (child[0].style.display === "flex") {
        child[0].style.display = "none";
      }
      if (child[1].style.display === "none") {
        child[1].style.display = "flex";
      }
      if (child[2].style.display === "flex") {
        child[2].style.display = "none";
      }
      if (child[3].style.display === "flex") {
        child[3].style.display = "none";
      }
      if (child[4].style.display === "flex") {
        child[4].style.display = "none";
      }
    }
  });
  // alert(id);
  // dialogId = id;
  initAll();
};
const initAll = () => {
  const tempString = JSON.stringify(store.history);
  remember = JSON.parse(tempString);
  // store.remember = store.history; //每次都把history和remember同步一下
  remember.forEach((e) => {
    if (e.id === store.lastId) {
      messages.value = e.dialogues;
    }
  });
  store.history.forEach((e) => {
    if (e.id === store.lastId) {
      myHistory.value = e;
    }
  });
  // console.log(messages.value);
  // myHistory.value = store.remember[store.remember.length - 1];
  // setTimeout(() => {
  //   if (messages.value.length === 0) {
  //     //如果历史记录中没有内容
  //     initMessage(); //调用初始化文字的方法
  //   }
  // }, 200);
  if (messages.value.length === 0) {
    //如果历史记录中没有内容
    initMessage(); //调用初始化文字的方法
  }
};
const editTheTitle = (event, title) => {
  // event.stopPropagation(); //阻止事件冒泡
  modifyTitle.value = title;
  // 获取触发事件的DOM节点
  const targetNode = event.target;
  // console.log(targetNode);
  // 获取该节点的父节点的父节点
  const parent3Node = targetNode.parentNode.parentNode.parentNode;
  // console.log(parent3Node);
  // 获取该节点的兄弟节点
  const childrenNodes = parent3Node.children;
  // console.log(childrenNodes);
  if (childrenNodes[0].style.display === "none") {
    childrenNodes[0].style.display = "flex";
  }
  if (childrenNodes[1].style.display === "flex") {
    childrenNodes[1].style.display = "none";
  }
  if (childrenNodes[2].style.display === "flex") {
    childrenNodes[2].style.display = "none";
  }
  if (childrenNodes[3].style.display === "flex") {
    childrenNodes[3].style.display = "none";
  }
  if (childrenNodes[4].style.display === "none") {
    childrenNodes[4].style.display = "flex";
  }
};
const modifyTitle = ref("");
const saveTheTitle = (event, id) => {
  // alert(modifyTitle.value);
  store.history.forEach((e) => {
    if (e.id === id) {
      e.title = modifyTitle.value;
    }
  });
  // 获取触发事件的DOM节点
  const targetNode = event.target;
  // console.log(targetNode);
  // 获取该节点的父节点的父节点
  const parent3Node = targetNode.parentNode.parentNode.parentNode;
  // console.log(parent3Node);
  // 获取该节点的兄弟节点
  const childrenNodes = parent3Node.children;
  if (childrenNodes[0].style.display === "flex") {
    childrenNodes[0].style.display = "none";
  }
  if (childrenNodes[1].style.display === "none") {
    childrenNodes[1].style.display = "flex";
  }
  if (childrenNodes[2].style.display === "none") {
    childrenNodes[2].style.display = "flex";
  }
  if (childrenNodes[3].style.display === "none") {
    childrenNodes[3].style.display = "flex";
  }
  if (childrenNodes[4].style.display === "flex") {
    childrenNodes[4].style.display = "none";
  }
};
const deleteTheHistory = (id) => {
  if (outputFlag.value == true || requestingFlag == true) {
    //@ts-ignore
    ElMessage({
      type: "warning",
      message: "请等待回答完毕！",
    });
    return;
  }
  // @ts-ignore
  ElMessageBox.confirm("确认删除吗？该操作不可逆！", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      let tempId = store.history[0].id;
      if (id === tempId) {
        //如果是头部id
        if (store.history.length === 1) {
          store.history = [] as oneHistoryType[];
          store.lastId = NaN as number;
          // @ts-ignore
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        } else {
          store.history = store.history.filter((obj) => obj.id !== id);
          // @ts-ignore
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          initFirstStyle2();
        }
      } else {
        store.history = store.history.filter((obj) => obj.id !== id);
        // @ts-ignore
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        initFirstStyle();
      }
    })
    .catch(() => {
      // @ts-ignore
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
  // alert(modifyTitle.value);
  // store.history.forEach((e) => {
  //   if (e.id === id) {
  //     e.title = modifyTitle.value;
  //   }
  // });
};
let requestingFlag = false;
let indexFlag = ref(NaN as number); // TODO 如果有初始消息，那么初始索引应该为0或者2
// let indexFlag = ref(1);
// let indexFlag = ref(2);
const enterToSend = (event: any) => {
  if (event.keyCode === 13) {
    // 执行发送消息的操作
    clickToSend();
  }
};
let stopButton;
let timer;
let cursorEl;
const outputText = (data) => {
  // let siblings = document.querySelectorAll(".history-item");
  // // 将 NodeList 转换为 HTMLElement 数组
  // let siblingList = Array.from(siblings) as HTMLElement[];
  // // 为所有元素设置 disabled 为 true
  // siblingList.forEach((sibling) => {
  //   // 将元素的class属性中添加一个禁用样式类名，用于控制样式
  //   sibling.classList.add("disabled");
  //   // 将元素的tabIndex属性设置为-1，使其失去焦点和可交互性
  //   sibling.tabIndex = -1;
  //   // 添加一个data-disabled属性，用于标记元素为禁用状态
  //   sibling.dataset.disabled = "true";
  // });
  console.log(messages.value);
  indexFlag.value = messages.value.length;
  // alert(indexFlag.value);
  let textContainer = document.getElementById(
    "content-reply-bot-" + indexFlag.value
  ); // 获取文本容器
  var cursorEls = document.getElementsByClassName("cursor");
  cursorEl = document.getElementsByClassName("cursor")[cursorEls.length - 1]; // 获取打字光标容器
  console.log(data);
  messages.value.splice(-1, 1, {
    content: "",
    isBot: true,
  });
  indexFlag.value += 2; //因为中间隔着一个用户发送的！
  console.log(textContainer);

  let text = data.content.replace(/\n/g, "<br>"); // 文本内容
  let index = 0; // 初始化索引值
  // 定义打字机效果的函数
  const type = () => {
    if (outputFlag.value == false) {
      outputFlag.value = true;
      stopButton = document.getElementsByClassName("stop-button")[0];
      console.log(stopButton);
      // @ts-ignore
      if (stopButton.style.display == "none") {
        // @ts-ignore
        stopButton.style.display = "flex";
      }
    }
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
      outputFlag.value = false;
      // stopButton = document.getElementsByClassName("stop-button")[0];
      // @ts-ignore
      if (stopButton.style.display == "flex") {
        // @ts-ignore
        stopButton.style.display = "none";
      }
      // 延迟一段时间后隐藏光标
      setTimeout(() => {
        // @ts-ignore
        cursorEl.style.display = "none";
      }, 200);
      return;
    }
  };
  timer = setInterval(type, 30); // 每隔100ms调用type函数
};

const stopResponse = () => {
  clearInterval(timer); // 停止定时器
  outputFlag.value = false;
  stopButton = document.getElementsByClassName("stop-button")[0];
  // @ts-ignore
  if (stopButton.style.display == "flex") {
    // @ts-ignore
    stopButton.style.display = "none";
  }
  // 延迟一段时间后隐藏光标
  setTimeout(() => {
    // @ts-ignore
    cursorEl.style.display = "none";
  }, 200);
};
let indexList = [] as Array<number>;
const copyTheText = (index) => {
  if (!indexList.includes(index)) {
    let copyButton = document.getElementById(`copy-button-${index + 1}`);
    // @ts-ignore
    let clipboard = new ClipboardJS(copyButton, {
      target: function () {
        return document.getElementById(`content-reply-bot-${index + 1}`);
      },
    });
    indexList.push(index);
    clipboard.on("success", function (e) {
      //@ts-ignore
      ElMessage({
        type: "success",
        message: "文本已复制到剪切板！",
      });
      // 清除选择的文本
      // @ts-ignore
      window.getSelection().removeAllRanges();
    });

    clipboard.on("error", function (e) {
      //@ts-ignore
      ElMessage({
        type: "warning",
        message: "复制失败！",
      });
    });
    // 手动触发复制操作
    // @ts-ignore
    clipboard.onClick(event);
  }
};
const setRightMenu = () => {
  // var myElement = document.getElementById("main-container");
  var contextMenu = document.getElementById("customContextMenu");
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // 阻止默认的右键菜单显示

    // 显示自定义右键菜单
    // @ts-ignore
    contextMenu.style.display = "flex";

    // 设置右键菜单的位置为鼠标点击位置
    // @ts-ignore
    contextMenu.style.left = e.pageX + "px";
    // @ts-ignore
    contextMenu.style.top = e.pageY + "px";
  });

  document.addEventListener("click", function () {
    // 点击页面其他位置时隐藏右键菜单
    // @ts-ignore
    contextMenu.style.display = "none";
  });
};
const clickToSend = () => {
  if (prompt.value) {
    if (requestingFlag === false) {
      requestingFlag = true;
      messages.value.push({ content: prompt.value, isBot: false });
      myHistory.value.dialogues.push({ content: prompt.value, isBot: false }); // 记忆我们自己的提问！
      const data = { message: prompt.value };
      prompt.value = ""; //在后面才可以清空
      messages.value.push({
        content: "加载中...",
        isBot: true,
      });
      // textContainer.innerHTML =
      //   messages.value[messages.value.length - 1].content;
      sendMessage(data).then((res) => {
        outputText(res.data);
        myHistory.value.dialogues.push({
          content: res.data.content.replace(/\n/g, "<br>"),
          isBot: true,
        });
        // messages.value.splice(-1, 1, {
        //   //把信息保存下来
        //   content: res.data.content.replace(/\n/g, "<br>"),
        //   isBot: true,
        // });
        console.log(messages.value);
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
//用于使容器自适应高度和宽度,通过窗体高宽计算容器高宽
let resizeMainContainer = function () {
  let mainContainer = document.getElementById("main-container");
  let messageWapper = document.getElementsByClassName("message-wapper")[0];
  // @ts-ignore
  // mainContainer.style.width = window.innerWidth + "px";
  // mainContainer.style.width = "1226px";
  // @ts-ignore
  // mainContainer.style.height = window.innerHeight + "px";
  // 找到你要禁用滚轮缩放的页面元素

  // 添加事件监听器，以捕获鼠标滚轮事件
  // @ts-ignore
  mainContainer.addEventListener(
    "wheel",
    function (event) {
      // 如果按下了Ctrl键，则阻止默认的缩放行为
      if (event.ctrlKey) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
};
let maxHeight = ref("");
let maxHeight2 = ref("");
let resizeHeight = function () {
  let domMessages = document.getElementsByClassName("messages")[0];
  let historyWapper = document.getElementsByClassName("history-wapper")[0];
  // console.log(domMessages);
  // // @ts-ignore
  // console.log(domMessages.offsetHeight);
  // @ts-ignore
  maxHeight.value = domMessages.offsetHeight - 20 + "px";
  // @ts-ignore
  maxHeight2.value = historyWapper.offsetHeight - 20 + "px";
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
      // TODO
      // createNewDialog();
      if (store.lastId) {
        selectLastDialog(store.lastId);
      }
      if (store.history.length === 0) {
        createNewDialog();
      }
      // if (messages.value.length === 0) {
      //   initMessage(); //调用初始化文字的方法
      // }
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
const initFirstStyle2 = () => {
  if (document.querySelector(".history-item")) {
    console.log(document.querySelectorAll(".history-item"));
    //为了让其默认选中第一个
    // @ts-ignore
    // let theFirstHistory =
    //   document.querySelectorAll(".history-item")[
    //     document.querySelectorAll(".history-item").length - 1
    //   ]; //返回最后一个
    // @ts-ignore
    let theFirstHistory = document.querySelector(".history-item"); //返回第一个
    console.log(theFirstHistory);
    // @ts-ignore
    theFirstHistory.addEventListener("click", function (event) {
      siblings = document.querySelectorAll(".history-item");
      // 遍历所有元素，将除了当前点击的元素之外的其他元素的选中样式都移除
      siblings.forEach(function (sibling) {
        if (sibling !== event.currentTarget) {
          sibling.classList.remove("selected");
        }
      });
      // 为当前点击的元素添加选中样式
      // @ts-ignore
      event.currentTarget.classList.add("selected");
      handleTwoIcons(event, siblings);
    });
    setTimeout(() => {
      //必须要延时，不然不能成功点击！
      // @ts-ignore
      theFirstHistory.click();
    }, 500);
  }
};
const initFirstStyle = () => {
  if (document.querySelector(".history-item")) {
    //为了让其默认选中第一个
    // @ts-ignore
    let theFirstHistory = document.querySelector(".history-item"); //默认返回第一个
    // @ts-ignore
    theFirstHistory.addEventListener("click", function (event) {
      siblings = document.querySelectorAll(".history-item");
      // 遍历所有元素，将除了当前点击的元素之外的其他元素的选中样式都移除
      siblings.forEach(function (sibling) {
        if (sibling !== event.currentTarget) {
          sibling.classList.remove("selected");
        }
      });
      // 为当前点击的元素添加选中样式
      // @ts-ignore
      event.currentTarget.classList.add("selected");
      handleTwoIcons(event, siblings);
    });
    // @ts-ignore
    theFirstHistory.click();
  }
};
const refreshThePage = () => {
  location.reload();
};
const initParticles = () => {
  // @ts-ignore
  particlesJS("particle-container", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#58adf0",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 8,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#58adf0",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 50,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  });
};
onMounted(() => {
  //设置容器高宽
  resizeMainContainer();
  resizeHeight();

  initDrag();
  // initFirstStyle();
  setRightMenu();
  initParticles();
  (function ($) {
    $(document).ready(function () {
      $(".change-model-button").on("click", function () {
        // console.log($(".main-left").attr("transform"));
        console.log($(".history-wapper").css("width"));
        if ($("#main-container").css("justify-content") == "left") {
          // @ts-ignore
          $(this).html(
            `<i data-v-f86fb796="" class="el-icon" style="--color:#e0e0e0;"><svg data-v-f86fb796="" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M384 192v640l384-320.064z"></path></svg></i>`
          );
          $(".history-wapper").css("width", "0");
          $("#main-container").css("justify-content", "center");
        } else {
          // @ts-ignore
          $(this).html(
            `<i data-v-f86fb796="" class="el-icon" style="--color:#e0e0e0;"><svg data-v-f86fb796="" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M672 192 288 511.936 672 832z"></path></svg></i>`
          );
          $(".history-wapper").css("width", "25%");
          setTimeout(() => {
            $("#main-container").css("justify-content", "left");
          }, 300);
        }
      });
    });
    //@ts-ignore
  })(jQuery);
});
</script>
<template>
  <div id="main-container">
    <div class="history-wapper">
      <el-scrollbar :max-height="maxHeight2">
        <ul class="history-ul">
          <li class="create-new" @click="createNewDialog">
            创建一个新对话&nbsp;<el-icon><Plus /></el-icon>
          </li>
          <li
            class="history-item"
            v-for="(item, key) in store.history"
            :key="key"
            @click="selectOneDialog($event, item.id)"
            :data-sign="item.id"
          >
            <input
              style="display: none"
              v-model="modifyTitle"
              @click.stop
              class="input-modify"
            />
            <div style="display: flex">
              {{ item.title }}
            </div>
            <div style="display: none" @click.stop>
              <el-icon @click.stop size="16px"
                ><Edit @click.stop="editTheTitle($event, item.title)"
              /></el-icon>
            </div>
            <div style="display: none" @click.stop>
              <el-icon @click.stop
                ><Delete @click.stop="deleteTheHistory(item.id)"
              /></el-icon>
            </div>
            <div style="display: none" @click.stop>
              <el-icon @click.stop
                ><Check @click.stop="saveTheTitle($event, item.id)"
              /></el-icon>
            </div>
          </li>
        </ul>
      </el-scrollbar>

      <div class="change-model-button">
        <el-icon color="#e0e0e0"> <CaretLeft /></el-icon>
      </div>
    </div>
    <div class="message-wapper">
      <div class="head-title">
        <a href="https://chat.openai.com/"
          ><img src="@/assets/img/logo.png"
        /></a>
      </div>

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
                <span
                  :id="'copy-button-' + (i + 1)"
                  class="copy-text"
                  @click.stop="copyTheText(i)"
                >
                  复制
                </span>
                <span
                  :id="'content-reply-bot-' + (i + 1)"
                  class="text"
                  v-html="m.content"
                ></span>
                <span
                  class="cursor"
                  v-show="outputFlag && i + 1 === messages.length"
                ></span>
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
        <div class="stop-button" style="display: none" @click="stopResponse">
          <el-icon size="16px" style="margin-right: 5px"
            ><SwitchButton /></el-icon
          >stop responding
        </div>
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
  <!-- <div id="particle-container">dadasdadasd1</div> -->
  <div id="verify" class="backdrop">
    <div id="particle-container">
      <div class="wapper">
        <div class="word-title">
          人机验证&nbsp;<el-icon><Pointer /></el-icon>
        </div>
        <div id="drag-element" draggable="true">
          <span>请将我拖到下面的方框中</span>
        </div>
        <div id="target-element"></div>
      </div>
      <div class="waves-container">
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(88, 173, 240, 0.7)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(88, 173, 240, 0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(88, 173, 240, 0.3)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="7"
              fill="rgba(88, 173, 240, 1)"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
  <ul id="customContextMenu">
    <li @click="createNewDialog()">
      <el-icon><Plus /></el-icon>创建新对话
    </li>
    <li @click="deleteTheHistory(store.lastId)">
      <el-icon><DeleteFilled /></el-icon>删除当前对话
    </li>
    <li @click="refreshThePage()">
      <el-icon><Refresh /></el-icon>刷新页面
    </li>
  </ul>
</template>

<style lang="scss" scoped>
#customContextMenu {
  position: fixed;
  background-color: #fff;
  z-index: 9999;
  display: none;
  flex-direction: column;
  padding: 5px;
  // justify-content: center;
  // align-items: center;
  background-color: #1a1a1a;
  border-radius: 15px;
  // > li:first-child {
  //   border-radius: 10px 10px 0 0;
  // }
  // > li:last-child {
  //   border-radius: 0 0 10px 10px;
  // }
  li {
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    // width: 100%;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    font-family: Calibri;
    transition: all 0.2s linear;
    border-radius: 15px;
    .el-icon {
      margin-right: 5px;
      transition: all 0.2s linear;
    }
  }
  li:hover {
    background-color: #262626;
    color: #58adf0;
    > .el-icon {
      color: #58adf0;
    }
  }
}
.stop-button {
  width: 150px;
  height: 30px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -60px;
  background-color: #eebe77;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s linear;
  border-radius: 5px;
}
.stop-button:hover {
  background-color: #e6a23c;
  transform: translate(0px, -1px);
}
//切换模式的按钮
.change-model-button {
  width: 28px;
  height: 28px;
  border-radius: 28px;
  background-color: #58adf0;
  box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  transform: translateX(50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.1s linear;
  z-index: 99999;
}
.change-model-button:hover {
  box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.3);
  // background-color: #cc0033;
}

.history-wapper {
  position: relative;
  width: 25%;
  // width: 0px;
  height: 90%;
  float: left;
  padding: 20px 15px;
  margin: 0 5px;
  transition: 0.4s cubic-bezier(1, -2.02, 0.38, 2.05);
  box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
  .history-ul {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding: 10px 0;
    filter: drop-shadow(1px 2px 4px rgb(88, 173, 240, 0.5));
  }
  .history-item {
    width: 80%;
    height: 45px;
    margin-bottom: 10px;
    border-radius: 5px;
    // box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 8px 1px;
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.2);
    border: 2px rgba(0, 0, 0, 0.2) dashed;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s linear;
    // border: 2px transparent solid;
    font-weight: 600;
    color: #606266;
    .input-modify {
      border: 1px #58adf0 dashed;
      border-radius: 5px;
      padding: 3px;
      margin-right: 5px;
      color: #303133;
      font-size: 13px;
      font-family: Calibri;
    }
    > div {
      // color: #303133;
      font-size: 15px;
      font-family: Calibri;
      margin-right: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  // .history-item:hover {
  //   transform: translate(0px, -1px);
  // }
  .history-item:hover {
    -webkit-animation: shake 0.4s;
    // background: #d3d3d3;
    border: 2px lightblue dashed;
    color: #58adf0;

    background-color: rgb(88, 173, 240, 0.1);
  }
  .selected {
    border: 2px lightblue dashed !important;
    color: #58adf0 !important;
    font-weight: 600 !important;
  }
  .create-new {
    height: 25px;
    border-radius: 0px;
    width: 80%;
    margin-bottom: 15px;
    // box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 8px 1px;
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 2px lightblue dashed;
    color: rgb(88, 173, 240, 0.7);
    font-weight: 600;
    transition: 0.3s cubic-bezier(1, -2.02, 0.38, 2.05);
    font-size: 15px;
    font-family: Calibri;
  }
  .create-new:hover {
    transform: translate(0px, -3px);
    color: #58adf0;
    // background-color: rgb(88, 173, 240, 0.2);
  }
  @-webkit-keyframes shake {
    0%,
    10%,
    55%,
    90%,
    94%,
    98%,
    100% {
      -webkit-transform: scale(1, 1);
    }
    30% {
      -webkit-transform: scale(1.14, 0.86);
    }
    75% {
      -webkit-transform: scale(0.92, 1.08);
    }
    92% {
      -webkit-transform: scale(1.04, 0.96);
    }
    96% {
      -webkit-transform: scale(1.02, 0.98);
    }
    99% {
      -webkit-transform: scale(1.01, 0.99);
    }
  }
}
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
  align-items: center;
  width: 300px;
  height: 50px;
  color: rgb(88, 173, 240, 0.7);
}
#verify {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 99999999;
  #particle-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    margin-right: 0;
    align-items: center;
  }
  .wapper {
    width: 300px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: absolute;
  }
  .waves-container {
    width: 100%;
    position: absolute;
    bottom: 0;
    .waves {
      position: relative;
      width: 100%;
      height: 15vh;
      margin-bottom: -13px;
      /*Fix for safari gap*/
      min-height: 150px;
      max-height: 250px;
    }

    /* Animation */

    .parallax > use {
      animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
    }

    .parallax > use:nth-child(1) {
      animation-delay: -2s;
      animation-duration: 7s;
    }

    .parallax > use:nth-child(2) {
      animation-delay: -3s;
      animation-duration: 10s;
    }

    .parallax > use:nth-child(3) {
      animation-delay: -4s;
      animation-duration: 13s;
    }

    .parallax > use:nth-child(4) {
      animation-delay: -5s;
      animation-duration: 20s;
    }

    @keyframes move-forever {
      0% {
        transform: translate3d(-90px, 0, 0);
      }

      100% {
        transform: translate3d(85px, 0, 0);
      }
    }

    /*Shrinking for mobile*/
    @media (max-width: 768px) {
      .waves {
        height: 40px;
        min-height: 40px;
      }

      .content {
        height: 30vh;
      }

      h1 {
        font-size: 24px;
      }
    }
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
  border: 1px solid rgb(88, 173, 240, 1);
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
  animation: tittlemove alternate infinite 4s ease-in-out;
  // box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
}
@keyframes tittlemove {
  0% {
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(3px);
  }
}
#target-element {
  width: 250px;
  height: 50px;
  background-color: #f5f5f5;
  border: 1px dashed rgb(88, 173, 240, 1);
  border-radius: 25px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  color: #272727;
  transition: 0.4s cubic-bezier(1, -2.02, 0.38, 2.05);
  cursor: pointer;
  box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
}
#target-element:hover {
  transform: scale(1.02);
}
/* 光标的样式定义 */
.cursor {
  display: inline-block;
  width: 3px;
  height: 1em;
  margin-left: 5px;
  vertical-align: middle;
  animation: blink 0.5s step-end infinite;
  background-color: #303133;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // height: 800px;
  // margin: 0 auto;
  // border: 1px #e8604c solid;
  display: flex;
  justify-content: left;
  margin-right: 0;
  align-items: center;
}
.message-wapper {
  position: relative;
  width: 75%;
  height: 100%;
  // margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
  .head-title {
    // width: 800px;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
    // border-bottom: 1px rgb(255,255,255) solid;
    box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
    img {
      width: 150px;
      height: 40px;
    }
  }
  .messages {
    // width: 800px;
    width: 100%;
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
        transition: all 0.3s linear;
      }
      img:hover {
        transform: translate(0px, -2px);
      }
      div {
        background-color: rgb(88, 173, 240, 0.3);
        color: #303133;
        font-size: 14px;
        font-family: Calibri;
        padding: 10px;
        border-radius: 10px;
        // box-shadow: 0 0 1px #272727, 0 0 10px 2px #3c3c3c, 0 0 10px 4px #4f4f4f;
        margin-right: 20px;
        text-align: left;
        transition: all 0.3s linear;
      }
      div:hover {
        background-color: rgb(88, 173, 240, 0.5);
        transform: scale(1.03);
      }
      div::selection {
        background-color: #ffff; /* 设置选中文本的背景颜色 */
        color: black; /* 设置选中文本的字体颜色 */
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
        transition: all 0.3s linear;
      }
      img:hover {
        transform: translate(0px, -2px);
      }
      div {
        background-color: rgb(88, 173, 240, 0.3);
        padding: 10px;
        border-radius: 10px;
        // box-shadow: 0 0 1px #272727, 0 0 10px 2px #3c3c3c, 0 0 10px 4px #4f4f4f;
        box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
        margin-left: 20px;
        transition: all 0.3s linear;
        position: relative;
        .copy-text {
          position: absolute;
          // top: -10px;
          right: 0;
          transform: translateX(100%);
          padding: 0 5px;
          height: 100%;
          color: #b1b3b8;
          font-size: 14px;
          font-family: Calibri;
          cursor: pointer;
          display: none;
          transition: all 0.3s linear;
        }
        .copy-text:hover {
          color: #58adf0;
        }
        .text {
          color: #303133;
          font-size: 14px;
          font-family: Calibri;
          text-align: left;
        }
        .text::selection {
          background-color: #ffff; /* 设置选中文本的背景颜色 */
          color: black; /* 设置选中文本的字体颜色 */
        }
      }
      div:hover {
        background-color: rgb(88, 173, 240, 0.5);
        transform: scale(1.01);
      }
      div:hover > .copy-text {
        display: block;
      }
    }
  }
  .operate-board {
    // position: absolute;
    // bottom: 0px;
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px dashed rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
    position: relative;
  }
}

.buttonStyle {
  height: 38px;
  width: 80px;
  border: 0;
  background-color: rgb(88, 173, 240, 0.3);
  // box-shadow: 0 0 1px #272727, 0 0 10px 2px #3c3c3c, 0 0 10px 4px #4f4f4f;
  // box-shadow: 0 2px 27px 6px rgba(0, 0, 0, 0.12);
  box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  font-family: Calibri;
  font-weight: 800;
  font-style: italic;
  color: #303133;
  cursor: pointer;
  margin-left: 20px;
  transition: all 0.1s linear;
}
.buttonStyle:hover {
  animation: buttonEffect 0.4s linear;
  transition-timing-function: linear;
  transform: translate(0px, -1px);
}
.buttonStyle:active {
  transform: scale(1.2);
  bottom: -3px;
  transition-timing-function: ease-in-out;
}
@keyframes buttonEffect {
  0% {
    background: radial-gradient(
      ellipse 20px 8px,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1),
      rgb(88, 173, 240, 1)
    );
  }
  20% {
    background: radial-gradient(
      ellipse 30px 12px,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1),
      rgb(88, 173, 240, 1)
    );
  }
  40% {
    background: radial-gradient(
      ellipse 40px 16px,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1),
      rgb(88, 173, 240, 1)
    );
  }
  60% {
    background: radial-gradient(
      ellipse 50px 20px,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1),
      rgb(88, 173, 240, 1)
    );
  }
  80% {
    background: radial-gradient(
      ellipse 60px 24px,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1),
      rgb(88, 173, 240, 1)
    );
  }
  100% {
    background: radial-gradient(
      ellipse 70px 280px,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1),
      rgb(88, 173, 240, 1)
    );
  }
}
.inputStyle {
  width: 400px;
  height: 35px;
  background-color: rgb(88, 173, 240, 0.5);
  border-radius: 8px;
  border-width: 5px 5px 5px 5px;
  border-style: inset;
  border-color: rgb(88, 173, 240, 1);
  // font-family: "Droid Sans Mono Slashed";
  font-family: Calibri;
  // font-weight: 400;
  // font-style: italic;
  padding-left: 10px;
  color: #303133;
  word-spacing: 1px;
  letter-spacing: 1px;
}
.inputStyle:focus {
  background-color: rgb(88, 173, 240, 0.3);
}
.inputStyle:hover {
  animation: inputEffect 0.8s linear;
  transition-timing-function: linear;
}
@keyframes inputEffect {
  0% {
    border-top-color: rgb(88, 173, 240, 0.3);
    background: linear-gradient(
      to right,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1) 20%
    );
  }
  25% {
    border-right-color: rgb(88, 173, 240, 0.3);
    background: linear-gradient(
      to right,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1) 40%
    );
  }
  50% {
    border-bottom-color: rgb(88, 173, 240, 0.3);
    background: linear-gradient(
      to right,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1) 60%
    );
  }
  75% {
    border-left-color: rgb(88, 173, 240, 0.3);
    background: linear-gradient(
      to right,
      rgb(88, 173, 240, 0.3),
      rgb(88, 173, 240, 1) 80%
    );
  }
  100% {
    border-color: rgb(88, 173, 240, 0.7); /* 控制闪光的颜色 */
    background: linear-gradient(
      to right,
      rgb(88, 173, 240, 0.7),
      rgb(88, 173, 240, 1) 100%
    );
  }
}
</style>
