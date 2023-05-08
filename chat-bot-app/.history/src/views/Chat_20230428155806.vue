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
  particlesJS("particle-container", {
    // 粒子配置选项
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
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
        value: 3,
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
        color: "#ffffff",
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
          distance: 200,
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
<script lang="ts">
/* -----------------------------------------------
/* Author : Vincent Garreau  - vincentgarreau.com
/* MIT license: http://opensource.org/licenses/MIT
/* Demo / Generator : vincentgarreau.com/particles.js
/* GitHub : github.com/VincentGarreau/particles.js
/* How to use? : Check the GitHub README
/* v2.0.0
/* ----------------------------------------------- */

var pJS = function (tag_id, params) {
  var canvas_el = document.querySelector(
    "#" + tag_id + " > .particles-js-canvas-el"
  );

  /* particles.js variables with default values */
  this.pJS = {
    canvas: {
      el: canvas_el,
      w: canvas_el.offsetWidth,
      h: canvas_el.offsetHeight,
    },
    particles: {
      number: {
        value: 400,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#fff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#ff0000",
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: "",
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 1,
        random: false,
        anim: {
          enable: false,
          speed: 2,
          opacity_min: 0,
          sync: false,
        },
      },
      size: {
        value: 20,
        random: false,
        anim: {
          enable: false,
          speed: 20,
          size_min: 0,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: "#fff",
        opacity: 1,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 3000,
          rotateY: 3000,
        },
      },
      array: [],
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 100,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 200,
          size: 80,
          duration: 0.4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
      mouse: {},
    },
    retina_detect: false,
    fn: {
      interact: {},
      modes: {},
      vendors: {},
    },
    tmp: {},
  };

  var pJS = this.pJS;

  /* params settings */
  if (params) {
    Object.deepExtend(pJS, params);
  }

  pJS.tmp.obj = {
    size_value: pJS.particles.size.value,
    size_anim_speed: pJS.particles.size.anim.speed,
    move_speed: pJS.particles.move.speed,
    line_linked_distance: pJS.particles.line_linked.distance,
    line_linked_width: pJS.particles.line_linked.width,
    mode_grab_distance: pJS.interactivity.modes.grab.distance,
    mode_bubble_distance: pJS.interactivity.modes.bubble.distance,
    mode_bubble_size: pJS.interactivity.modes.bubble.size,
    mode_repulse_distance: pJS.interactivity.modes.repulse.distance,
  };

  pJS.fn.retinaInit = function () {
    if (pJS.retina_detect && window.devicePixelRatio > 1) {
      pJS.canvas.pxratio = window.devicePixelRatio;
      pJS.tmp.retina = true;
    } else {
      pJS.canvas.pxratio = 1;
      pJS.tmp.retina = false;
    }

    pJS.canvas.w = pJS.canvas.el.offsetWidth * pJS.canvas.pxratio;
    pJS.canvas.h = pJS.canvas.el.offsetHeight * pJS.canvas.pxratio;

    pJS.particles.size.value = pJS.tmp.obj.size_value * pJS.canvas.pxratio;
    pJS.particles.size.anim.speed =
      pJS.tmp.obj.size_anim_speed * pJS.canvas.pxratio;
    pJS.particles.move.speed = pJS.tmp.obj.move_speed * pJS.canvas.pxratio;
    pJS.particles.line_linked.distance =
      pJS.tmp.obj.line_linked_distance * pJS.canvas.pxratio;
    pJS.interactivity.modes.grab.distance =
      pJS.tmp.obj.mode_grab_distance * pJS.canvas.pxratio;
    pJS.interactivity.modes.bubble.distance =
      pJS.tmp.obj.mode_bubble_distance * pJS.canvas.pxratio;
    pJS.particles.line_linked.width =
      pJS.tmp.obj.line_linked_width * pJS.canvas.pxratio;
    pJS.interactivity.modes.bubble.size =
      pJS.tmp.obj.mode_bubble_size * pJS.canvas.pxratio;
    pJS.interactivity.modes.repulse.distance =
      pJS.tmp.obj.mode_repulse_distance * pJS.canvas.pxratio;
  };

  /* ---------- pJS functions - canvas ------------ */

  pJS.fn.canvasInit = function () {
    pJS.canvas.ctx = pJS.canvas.el.getContext("2d");
  };

  pJS.fn.canvasSize = function () {
    pJS.canvas.el.width = pJS.canvas.w;
    pJS.canvas.el.height = pJS.canvas.h;

    if (pJS && pJS.interactivity.events.resize) {
      window.addEventListener("resize", function () {
        pJS.canvas.w = pJS.canvas.el.offsetWidth;
        pJS.canvas.h = pJS.canvas.el.offsetHeight;

        /* resize canvas */
        if (pJS.tmp.retina) {
          pJS.canvas.w *= pJS.canvas.pxratio;
          pJS.canvas.h *= pJS.canvas.pxratio;
        }

        pJS.canvas.el.width = pJS.canvas.w;
        pJS.canvas.el.height = pJS.canvas.h;

        /* repaint canvas on anim disabled */
        if (!pJS.particles.move.enable) {
          pJS.fn.particlesEmpty();
          pJS.fn.particlesCreate();
          pJS.fn.particlesDraw();
          pJS.fn.vendors.densityAutoParticles();
        }

        /* density particles enabled */
        pJS.fn.vendors.densityAutoParticles();
      });
    }
  };

  pJS.fn.canvasPaint = function () {
    pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h);
  };

  pJS.fn.canvasClear = function () {
    pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);
  };

  /* --------- pJS functions - particles ----------- */

  pJS.fn.particle = function (color, opacity, position) {
    /* size */
    this.radius =
      (pJS.particles.size.random ? Math.random() : 1) *
      pJS.particles.size.value;
    if (pJS.particles.size.anim.enable) {
      this.size_status = false;
      this.vs = pJS.particles.size.anim.speed / 100;
      if (!pJS.particles.size.anim.sync) {
        this.vs = this.vs * Math.random();
      }
    }

    /* position */
    this.x = position ? position.x : Math.random() * pJS.canvas.w;
    this.y = position ? position.y : Math.random() * pJS.canvas.h;

    /* check position  - into the canvas */
    if (this.x > pJS.canvas.w - this.radius * 2) this.x = this.x - this.radius;
    else if (this.x < this.radius * 2) this.x = this.x + this.radius;
    if (this.y > pJS.canvas.h - this.radius * 2) this.y = this.y - this.radius;
    else if (this.y < this.radius * 2) this.y = this.y + this.radius;

    /* check position - avoid overlap */
    if (pJS.particles.move.bounce) {
      pJS.fn.vendors.checkOverlap(this, position);
    }

    /* color */
    this.color = {};
    if (typeof color.value == "object") {
      if (color.value instanceof Array) {
        var color_selected =
          color.value[
            Math.floor(Math.random() * pJS.particles.color.value.length)
          ];
        this.color.rgb = hexToRgb(color_selected);
      } else {
        if (
          color.value.r != undefined &&
          color.value.g != undefined &&
          color.value.b != undefined
        ) {
          this.color.rgb = {
            r: color.value.r,
            g: color.value.g,
            b: color.value.b,
          };
        }
        if (
          color.value.h != undefined &&
          color.value.s != undefined &&
          color.value.l != undefined
        ) {
          this.color.hsl = {
            h: color.value.h,
            s: color.value.s,
            l: color.value.l,
          };
        }
      }
    } else if (color.value == "random") {
      this.color.rgb = {
        r: Math.floor(Math.random() * (255 - 0 + 1)) + 0,
        g: Math.floor(Math.random() * (255 - 0 + 1)) + 0,
        b: Math.floor(Math.random() * (255 - 0 + 1)) + 0,
      };
    } else if (typeof color.value == "string") {
      this.color = color;
      this.color.rgb = hexToRgb(this.color.value);
    }

    /* opacity */
    this.opacity =
      (pJS.particles.opacity.random ? Math.random() : 1) *
      pJS.particles.opacity.value;
    if (pJS.particles.opacity.anim.enable) {
      this.opacity_status = false;
      this.vo = pJS.particles.opacity.anim.speed / 100;
      if (!pJS.particles.opacity.anim.sync) {
        this.vo = this.vo * Math.random();
      }
    }

    /* animation - velocity for speed */
    var velbase = {};
    switch (pJS.particles.move.direction) {
      case "top":
        velbase = { x: 0, y: -1 };
        break;
      case "top-right":
        velbase = { x: 0.5, y: -0.5 };
        break;
      case "right":
        velbase = { x: 1, y: -0 };
        break;
      case "bottom-right":
        velbase = { x: 0.5, y: 0.5 };
        break;
      case "bottom":
        velbase = { x: 0, y: 1 };
        break;
      case "bottom-left":
        velbase = { x: -0.5, y: 1 };
        break;
      case "left":
        velbase = { x: -1, y: 0 };
        break;
      case "top-left":
        velbase = { x: -0.5, y: -0.5 };
        break;
      default:
        velbase = { x: 0, y: 0 };
        break;
    }

    if (pJS.particles.move.straight) {
      this.vx = velbase.x;
      this.vy = velbase.y;
      if (pJS.particles.move.random) {
        this.vx = this.vx * Math.random();
        this.vy = this.vy * Math.random();
      }
    } else {
      this.vx = velbase.x + Math.random() - 0.5;
      this.vy = velbase.y + Math.random() - 0.5;
    }

    // var theta = 2.0 * Math.PI * Math.random();
    // this.vx = Math.cos(theta);
    // this.vy = Math.sin(theta);

    this.vx_i = this.vx;
    this.vy_i = this.vy;

    /* if shape is image */

    var shape_type = pJS.particles.shape.type;
    if (typeof shape_type == "object") {
      if (shape_type instanceof Array) {
        var shape_selected =
          shape_type[Math.floor(Math.random() * shape_type.length)];
        this.shape = shape_selected;
      }
    } else {
      this.shape = shape_type;
    }

    if (this.shape == "image") {
      var sh = pJS.particles.shape;
      this.img = {
        src: sh.image.src,
        ratio: sh.image.width / sh.image.height,
      };
      if (!this.img.ratio) this.img.ratio = 1;
      if (pJS.tmp.img_type == "svg" && pJS.tmp.source_svg != undefined) {
        pJS.fn.vendors.createSvgImg(this);
        if (pJS.tmp.pushing) {
          this.img.loaded = false;
        }
      }
    }
  };

  pJS.fn.particle.prototype.draw = function () {
    var p = this;

    if (p.radius_bubble != undefined) {
      var radius = p.radius_bubble;
    } else {
      var radius = p.radius;
    }

    if (p.opacity_bubble != undefined) {
      var opacity = p.opacity_bubble;
    } else {
      var opacity = p.opacity;
    }

    if (p.color.rgb) {
      var color_value =
        "rgba(" +
        p.color.rgb.r +
        "," +
        p.color.rgb.g +
        "," +
        p.color.rgb.b +
        "," +
        opacity +
        ")";
    } else {
      var color_value =
        "hsla(" +
        p.color.hsl.h +
        "," +
        p.color.hsl.s +
        "%," +
        p.color.hsl.l +
        "%," +
        opacity +
        ")";
    }

    pJS.canvas.ctx.fillStyle = color_value;
    pJS.canvas.ctx.beginPath();

    switch (p.shape) {
      case "circle":
        pJS.canvas.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
        break;

      case "edge":
        pJS.canvas.ctx.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
        break;

      case "triangle":
        pJS.fn.vendors.drawShape(
          pJS.canvas.ctx,
          p.x - radius,
          p.y + radius / 1.66,
          radius * 2,
          3,
          2
        );
        break;

      case "polygon":
        pJS.fn.vendors.drawShape(
          pJS.canvas.ctx,
          p.x - radius / (pJS.particles.shape.polygon.nb_sides / 3.5), // startX
          p.y - radius / (2.66 / 3.5), // startY
          (radius * 2.66) / (pJS.particles.shape.polygon.nb_sides / 3), // sideLength
          pJS.particles.shape.polygon.nb_sides, // sideCountNumerator
          1 // sideCountDenominator
        );
        break;

      case "star":
        pJS.fn.vendors.drawShape(
          pJS.canvas.ctx,
          p.x - (radius * 2) / (pJS.particles.shape.polygon.nb_sides / 4), // startX
          p.y - radius / ((2 * 2.66) / 3.5), // startY
          (radius * 2 * 2.66) / (pJS.particles.shape.polygon.nb_sides / 3), // sideLength
          pJS.particles.shape.polygon.nb_sides, // sideCountNumerator
          2 // sideCountDenominator
        );
        break;

      case "image":
        function draw() {
          pJS.canvas.ctx.drawImage(
            img_obj,
            p.x - radius,
            p.y - radius,
            radius * 2,
            (radius * 2) / p.img.ratio
          );
        }

        if (pJS.tmp.img_type == "svg") {
          var img_obj = p.img.obj;
        } else {
          var img_obj = pJS.tmp.img_obj;
        }

        if (img_obj) {
          draw();
        }

        break;
    }

    pJS.canvas.ctx.closePath();

    if (pJS.particles.shape.stroke.width > 0) {
      pJS.canvas.ctx.strokeStyle = pJS.particles.shape.stroke.color;
      pJS.canvas.ctx.lineWidth = pJS.particles.shape.stroke.width;
      pJS.canvas.ctx.stroke();
    }

    pJS.canvas.ctx.fill();
  };

  pJS.fn.particlesCreate = function () {
    for (var i = 0; i < pJS.particles.number.value; i++) {
      pJS.particles.array.push(
        new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value)
      );
    }
  };

  pJS.fn.particlesUpdate = function () {
    for (var i = 0; i < pJS.particles.array.length; i++) {
      /* the particle */
      var p = pJS.particles.array[i];

      // var d = ( dx = pJS.interactivity.mouse.click_pos_x - p.x ) * dx + ( dy = pJS.interactivity.mouse.click_pos_y - p.y ) * dy;
      // var f = -BANG_SIZE / d;
      // if ( d < BANG_SIZE ) {
      //     var t = Math.atan2( dy, dx );
      //     p.vx = f * Math.cos(t);
      //     p.vy = f * Math.sin(t);
      // }

      /* move the particle */
      if (pJS.particles.move.enable) {
        var ms = pJS.particles.move.speed / 2;
        p.x += p.vx * ms;
        p.y += p.vy * ms;
      }

      /* change opacity status */
      if (pJS.particles.opacity.anim.enable) {
        if (p.opacity_status == true) {
          if (p.opacity >= pJS.particles.opacity.value)
            p.opacity_status = false;
          p.opacity += p.vo;
        } else {
          if (p.opacity <= pJS.particles.opacity.anim.opacity_min)
            p.opacity_status = true;
          p.opacity -= p.vo;
        }
        if (p.opacity < 0) p.opacity = 0;
      }

      /* change size */
      if (pJS.particles.size.anim.enable) {
        if (p.size_status == true) {
          if (p.radius >= pJS.particles.size.value) p.size_status = false;
          p.radius += p.vs;
        } else {
          if (p.radius <= pJS.particles.size.anim.size_min)
            p.size_status = true;
          p.radius -= p.vs;
        }
        if (p.radius < 0) p.radius = 0;
      }

      /* change particle position if it is out of canvas */
      if (pJS.particles.move.out_mode == "bounce") {
        var new_pos = {
          x_left: p.radius,
          x_right: pJS.canvas.w,
          y_top: p.radius,
          y_bottom: pJS.canvas.h,
        };
      } else {
        var new_pos = {
          x_left: -p.radius,
          x_right: pJS.canvas.w + p.radius,
          y_top: -p.radius,
          y_bottom: pJS.canvas.h + p.radius,
        };
      }

      if (p.x - p.radius > pJS.canvas.w) {
        p.x = new_pos.x_left;
        p.y = Math.random() * pJS.canvas.h;
      } else if (p.x + p.radius < 0) {
        p.x = new_pos.x_right;
        p.y = Math.random() * pJS.canvas.h;
      }
      if (p.y - p.radius > pJS.canvas.h) {
        p.y = new_pos.y_top;
        p.x = Math.random() * pJS.canvas.w;
      } else if (p.y + p.radius < 0) {
        p.y = new_pos.y_bottom;
        p.x = Math.random() * pJS.canvas.w;
      }

      /* out of canvas modes */
      switch (pJS.particles.move.out_mode) {
        case "bounce":
          if (p.x + p.radius > pJS.canvas.w) p.vx = -p.vx;
          else if (p.x - p.radius < 0) p.vx = -p.vx;
          if (p.y + p.radius > pJS.canvas.h) p.vy = -p.vy;
          else if (p.y - p.radius < 0) p.vy = -p.vy;
          break;
      }

      /* events */
      if (isInArray("grab", pJS.interactivity.events.onhover.mode)) {
        pJS.fn.modes.grabParticle(p);
      }

      if (
        isInArray("bubble", pJS.interactivity.events.onhover.mode) ||
        isInArray("bubble", pJS.interactivity.events.onclick.mode)
      ) {
        pJS.fn.modes.bubbleParticle(p);
      }

      if (
        isInArray("repulse", pJS.interactivity.events.onhover.mode) ||
        isInArray("repulse", pJS.interactivity.events.onclick.mode)
      ) {
        pJS.fn.modes.repulseParticle(p);
      }

      /* interaction auto between particles */
      if (
        pJS.particles.line_linked.enable ||
        pJS.particles.move.attract.enable
      ) {
        for (var j = i + 1; j < pJS.particles.array.length; j++) {
          var p2 = pJS.particles.array[j];

          /* link particles */
          if (pJS.particles.line_linked.enable) {
            pJS.fn.interact.linkParticles(p, p2);
          }

          /* attract particles */
          if (pJS.particles.move.attract.enable) {
            pJS.fn.interact.attractParticles(p, p2);
          }

          /* bounce particles */
          if (pJS.particles.move.bounce) {
            pJS.fn.interact.bounceParticles(p, p2);
          }
        }
      }
    }
  };

  pJS.fn.particlesDraw = function () {
    /* clear canvas */
    pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    /* update each particles param */
    pJS.fn.particlesUpdate();

    /* draw each particle */
    for (var i = 0; i < pJS.particles.array.length; i++) {
      var p = pJS.particles.array[i];
      p.draw();
    }
  };

  pJS.fn.particlesEmpty = function () {
    pJS.particles.array = [];
  };

  pJS.fn.particlesRefresh = function () {
    /* init all */
    cancelRequestAnimFrame(pJS.fn.checkAnimFrame);
    cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
    pJS.tmp.source_svg = undefined;
    pJS.tmp.img_obj = undefined;
    pJS.tmp.count_svg = 0;
    pJS.fn.particlesEmpty();
    pJS.fn.canvasClear();

    /* restart */
    pJS.fn.vendors.start();
  };

  /* ---------- pJS functions - particles interaction ------------ */

  pJS.fn.interact.linkParticles = function (p1, p2) {
    var dx = p1.x - p2.x,
      dy = p1.y - p2.y,
      dist = Math.sqrt(dx * dx + dy * dy);

    /* draw a line between p1 and p2 if the distance between them is under the config distance */
    if (dist <= pJS.particles.line_linked.distance) {
      var opacity_line =
        pJS.particles.line_linked.opacity -
        dist /
          (1 / pJS.particles.line_linked.opacity) /
          pJS.particles.line_linked.distance;

      if (opacity_line > 0) {
        /* style */
        var color_line = pJS.particles.line_linked.color_rgb_line;
        pJS.canvas.ctx.strokeStyle =
          "rgba(" +
          color_line.r +
          "," +
          color_line.g +
          "," +
          color_line.b +
          "," +
          opacity_line +
          ")";
        pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
        //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */

        /* path */
        pJS.canvas.ctx.beginPath();
        pJS.canvas.ctx.moveTo(p1.x, p1.y);
        pJS.canvas.ctx.lineTo(p2.x, p2.y);
        pJS.canvas.ctx.stroke();
        pJS.canvas.ctx.closePath();
      }
    }
  };

  pJS.fn.interact.attractParticles = function (p1, p2) {
    /* condensed particles */
    var dx = p1.x - p2.x,
      dy = p1.y - p2.y,
      dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= pJS.particles.line_linked.distance) {
      var ax = dx / (pJS.particles.move.attract.rotateX * 1000),
        ay = dy / (pJS.particles.move.attract.rotateY * 1000);

      p1.vx -= ax;
      p1.vy -= ay;

      p2.vx += ax;
      p2.vy += ay;
    }
  };

  pJS.fn.interact.bounceParticles = function (p1, p2) {
    var dx = p1.x - p2.x,
      dy = p1.y - p2.y,
      dist = Math.sqrt(dx * dx + dy * dy),
      dist_p = p1.radius + p2.radius;

    if (dist <= dist_p) {
      p1.vx = -p1.vx;
      p1.vy = -p1.vy;

      p2.vx = -p2.vx;
      p2.vy = -p2.vy;
    }
  };

  /* ---------- pJS functions - modes events ------------ */

  pJS.fn.modes.pushParticles = function (nb, pos) {
    pJS.tmp.pushing = true;

    for (var i = 0; i < nb; i++) {
      pJS.particles.array.push(
        new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value, {
          x: pos ? pos.pos_x : Math.random() * pJS.canvas.w,
          y: pos ? pos.pos_y : Math.random() * pJS.canvas.h,
        })
      );
      if (i == nb - 1) {
        if (!pJS.particles.move.enable) {
          pJS.fn.particlesDraw();
        }
        pJS.tmp.pushing = false;
      }
    }
  };

  pJS.fn.modes.removeParticles = function (nb) {
    pJS.particles.array.splice(0, nb);
    if (!pJS.particles.move.enable) {
      pJS.fn.particlesDraw();
    }
  };

  pJS.fn.modes.bubbleParticle = function (p) {
    /* on hover event */
    if (
      pJS.interactivity.events.onhover.enable &&
      isInArray("bubble", pJS.interactivity.events.onhover.mode)
    ) {
      var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
        dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
        dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
        ratio = 1 - dist_mouse / pJS.interactivity.modes.bubble.distance;

      function init() {
        p.opacity_bubble = p.opacity;
        p.radius_bubble = p.radius;
      }

      /* mousemove - check ratio */
      if (dist_mouse <= pJS.interactivity.modes.bubble.distance) {
        if (ratio >= 0 && pJS.interactivity.status == "mousemove") {
          /* size */
          if (pJS.interactivity.modes.bubble.size != pJS.particles.size.value) {
            if (
              pJS.interactivity.modes.bubble.size > pJS.particles.size.value
            ) {
              var size = p.radius + pJS.interactivity.modes.bubble.size * ratio;
              if (size >= 0) {
                p.radius_bubble = size;
              }
            } else {
              var dif = p.radius - pJS.interactivity.modes.bubble.size,
                size = p.radius - dif * ratio;
              if (size > 0) {
                p.radius_bubble = size;
              } else {
                p.radius_bubble = 0;
              }
            }
          }

          /* opacity */
          if (
            pJS.interactivity.modes.bubble.opacity !=
            pJS.particles.opacity.value
          ) {
            if (
              pJS.interactivity.modes.bubble.opacity >
              pJS.particles.opacity.value
            ) {
              var opacity = pJS.interactivity.modes.bubble.opacity * ratio;
              if (
                opacity > p.opacity &&
                opacity <= pJS.interactivity.modes.bubble.opacity
              ) {
                p.opacity_bubble = opacity;
              }
            } else {
              var opacity =
                p.opacity -
                (pJS.particles.opacity.value -
                  pJS.interactivity.modes.bubble.opacity) *
                  ratio;
              if (
                opacity < p.opacity &&
                opacity >= pJS.interactivity.modes.bubble.opacity
              ) {
                p.opacity_bubble = opacity;
              }
            }
          }
        }
      } else {
        init();
      }

      /* mouseleave */
      if (pJS.interactivity.status == "mouseleave") {
        init();
      }
    } else if (
      /* on click event */
      pJS.interactivity.events.onclick.enable &&
      isInArray("bubble", pJS.interactivity.events.onclick.mode)
    ) {
      if (pJS.tmp.bubble_clicking) {
        var dx_mouse = p.x - pJS.interactivity.mouse.click_pos_x,
          dy_mouse = p.y - pJS.interactivity.mouse.click_pos_y,
          dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
          time_spent =
            (new Date().getTime() - pJS.interactivity.mouse.click_time) / 1000;

        if (time_spent > pJS.interactivity.modes.bubble.duration) {
          pJS.tmp.bubble_duration_end = true;
        }

        if (time_spent > pJS.interactivity.modes.bubble.duration * 2) {
          pJS.tmp.bubble_clicking = false;
          pJS.tmp.bubble_duration_end = false;
        }
      }

      function process(bubble_param, particles_param, p_obj_bubble, p_obj, id) {
        if (bubble_param != particles_param) {
          if (!pJS.tmp.bubble_duration_end) {
            if (dist_mouse <= pJS.interactivity.modes.bubble.distance) {
              if (p_obj_bubble != undefined) var obj = p_obj_bubble;
              else var obj = p_obj;
              if (obj != bubble_param) {
                var value =
                  p_obj -
                  (time_spent * (p_obj - bubble_param)) /
                    pJS.interactivity.modes.bubble.duration;
                if (id == "size") p.radius_bubble = value;
                if (id == "opacity") p.opacity_bubble = value;
              }
            } else {
              if (id == "size") p.radius_bubble = undefined;
              if (id == "opacity") p.opacity_bubble = undefined;
            }
          } else {
            if (p_obj_bubble != undefined) {
              var value_tmp =
                  p_obj -
                  (time_spent * (p_obj - bubble_param)) /
                    pJS.interactivity.modes.bubble.duration,
                dif = bubble_param - value_tmp;
              value = bubble_param + dif;
              if (id == "size") p.radius_bubble = value;
              if (id == "opacity") p.opacity_bubble = value;
            }
          }
        }
      }

      if (pJS.tmp.bubble_clicking) {
        /* size */
        process(
          pJS.interactivity.modes.bubble.size,
          pJS.particles.size.value,
          p.radius_bubble,
          p.radius,
          "size"
        );
        /* opacity */
        process(
          pJS.interactivity.modes.bubble.opacity,
          pJS.particles.opacity.value,
          p.opacity_bubble,
          p.opacity,
          "opacity"
        );
      }
    }
  };

  pJS.fn.modes.repulseParticle = function (p) {
    if (
      pJS.interactivity.events.onhover.enable &&
      isInArray("repulse", pJS.interactivity.events.onhover.mode) &&
      pJS.interactivity.status == "mousemove"
    ) {
      var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
        dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
        dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

      var normVec = { x: dx_mouse / dist_mouse, y: dy_mouse / dist_mouse },
        repulseRadius = pJS.interactivity.modes.repulse.distance,
        velocity = 100,
        repulseFactor = clamp(
          (1 / repulseRadius) *
            (-1 * Math.pow(dist_mouse / repulseRadius, 2) + 1) *
            repulseRadius *
            velocity,
          0,
          50
        );

      var pos = {
        x: p.x + normVec.x * repulseFactor,
        y: p.y + normVec.y * repulseFactor,
      };

      if (pJS.particles.move.out_mode == "bounce") {
        if (pos.x - p.radius > 0 && pos.x + p.radius < pJS.canvas.w)
          p.x = pos.x;
        if (pos.y - p.radius > 0 && pos.y + p.radius < pJS.canvas.h)
          p.y = pos.y;
      } else {
        p.x = pos.x;
        p.y = pos.y;
      }
    } else if (
      pJS.interactivity.events.onclick.enable &&
      isInArray("repulse", pJS.interactivity.events.onclick.mode)
    ) {
      if (!pJS.tmp.repulse_finish) {
        pJS.tmp.repulse_count++;
        if (pJS.tmp.repulse_count == pJS.particles.array.length) {
          pJS.tmp.repulse_finish = true;
        }
      }

      if (pJS.tmp.repulse_clicking) {
        var repulseRadius = Math.pow(
          pJS.interactivity.modes.repulse.distance / 6,
          3
        );

        var dx = pJS.interactivity.mouse.click_pos_x - p.x,
          dy = pJS.interactivity.mouse.click_pos_y - p.y,
          d = dx * dx + dy * dy;

        var force = (-repulseRadius / d) * 1;

        function process() {
          var f = Math.atan2(dy, dx);
          p.vx = force * Math.cos(f);
          p.vy = force * Math.sin(f);

          if (pJS.particles.move.out_mode == "bounce") {
            var pos = {
              x: p.x + p.vx,
              y: p.y + p.vy,
            };
            if (pos.x + p.radius > pJS.canvas.w) p.vx = -p.vx;
            else if (pos.x - p.radius < 0) p.vx = -p.vx;
            if (pos.y + p.radius > pJS.canvas.h) p.vy = -p.vy;
            else if (pos.y - p.radius < 0) p.vy = -p.vy;
          }
        }

        // default
        if (d <= repulseRadius) {
          process();
        }

        // bang - slow motion mode
        // if(!pJS.tmp.repulse_finish){
        //   if(d <= repulseRadius){
        //     process();
        //   }
        // }else{
        //   process();
        // }
      } else {
        if (pJS.tmp.repulse_clicking == false) {
          p.vx = p.vx_i;
          p.vy = p.vy_i;
        }
      }
    }
  };

  pJS.fn.modes.grabParticle = function (p) {
    if (
      pJS.interactivity.events.onhover.enable &&
      pJS.interactivity.status == "mousemove"
    ) {
      var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
        dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
        dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

      /* draw a line between the cursor and the particle if the distance between them is under the config distance */
      if (dist_mouse <= pJS.interactivity.modes.grab.distance) {
        var opacity_line =
          pJS.interactivity.modes.grab.line_linked.opacity -
          dist_mouse /
            (1 / pJS.interactivity.modes.grab.line_linked.opacity) /
            pJS.interactivity.modes.grab.distance;

        if (opacity_line > 0) {
          /* style */
          var color_line = pJS.particles.line_linked.color_rgb_line;
          pJS.canvas.ctx.strokeStyle =
            "rgba(" +
            color_line.r +
            "," +
            color_line.g +
            "," +
            color_line.b +
            "," +
            opacity_line +
            ")";
          pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
          //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */

          /* path */
          pJS.canvas.ctx.beginPath();
          pJS.canvas.ctx.moveTo(p.x, p.y);
          pJS.canvas.ctx.lineTo(
            pJS.interactivity.mouse.pos_x,
            pJS.interactivity.mouse.pos_y
          );
          pJS.canvas.ctx.stroke();
          pJS.canvas.ctx.closePath();
        }
      }
    }
  };

  /* ---------- pJS functions - vendors ------------ */

  pJS.fn.vendors.eventsListeners = function () {
    /* events target element */
    if (pJS.interactivity.detect_on == "window") {
      pJS.interactivity.el = window;
    } else {
      pJS.interactivity.el = pJS.canvas.el;
    }

    /* detect mouse pos - on hover / click event */
    if (
      pJS.interactivity.events.onhover.enable ||
      pJS.interactivity.events.onclick.enable
    ) {
      /* el on mousemove */
      pJS.interactivity.el.addEventListener("mousemove", function (e) {
        if (pJS.interactivity.el == window) {
          var pos_x = e.clientX,
            pos_y = e.clientY;
        } else {
          var pos_x = e.offsetX || e.clientX,
            pos_y = e.offsetY || e.clientY;
        }

        pJS.interactivity.mouse.pos_x = pos_x;
        pJS.interactivity.mouse.pos_y = pos_y;

        if (pJS.tmp.retina) {
          pJS.interactivity.mouse.pos_x *= pJS.canvas.pxratio;
          pJS.interactivity.mouse.pos_y *= pJS.canvas.pxratio;
        }

        pJS.interactivity.status = "mousemove";
      });

      /* el on onmouseleave */
      pJS.interactivity.el.addEventListener("mouseleave", function (e) {
        pJS.interactivity.mouse.pos_x = null;
        pJS.interactivity.mouse.pos_y = null;
        pJS.interactivity.status = "mouseleave";
      });
    }

    /* on click event */
    if (pJS.interactivity.events.onclick.enable) {
      pJS.interactivity.el.addEventListener("click", function () {
        pJS.interactivity.mouse.click_pos_x = pJS.interactivity.mouse.pos_x;
        pJS.interactivity.mouse.click_pos_y = pJS.interactivity.mouse.pos_y;
        pJS.interactivity.mouse.click_time = new Date().getTime();

        if (pJS.interactivity.events.onclick.enable) {
          switch (pJS.interactivity.events.onclick.mode) {
            case "push":
              if (pJS.particles.move.enable) {
                pJS.fn.modes.pushParticles(
                  pJS.interactivity.modes.push.particles_nb,
                  pJS.interactivity.mouse
                );
              } else {
                if (pJS.interactivity.modes.push.particles_nb == 1) {
                  pJS.fn.modes.pushParticles(
                    pJS.interactivity.modes.push.particles_nb,
                    pJS.interactivity.mouse
                  );
                } else if (pJS.interactivity.modes.push.particles_nb > 1) {
                  pJS.fn.modes.pushParticles(
                    pJS.interactivity.modes.push.particles_nb
                  );
                }
              }
              break;

            case "remove":
              pJS.fn.modes.removeParticles(
                pJS.interactivity.modes.remove.particles_nb
              );
              break;

            case "bubble":
              pJS.tmp.bubble_clicking = true;
              break;

            case "repulse":
              pJS.tmp.repulse_clicking = true;
              pJS.tmp.repulse_count = 0;
              pJS.tmp.repulse_finish = false;
              setTimeout(function () {
                pJS.tmp.repulse_clicking = false;
              }, pJS.interactivity.modes.repulse.duration * 1000);
              break;
          }
        }
      });
    }
  };

  pJS.fn.vendors.densityAutoParticles = function () {
    if (pJS.particles.number.density.enable) {
      /* calc area */
      var area = (pJS.canvas.el.width * pJS.canvas.el.height) / 1000;
      if (pJS.tmp.retina) {
        area = area / (pJS.canvas.pxratio * 2);
      }

      /* calc number of particles based on density area */
      var nb_particles =
        (area * pJS.particles.number.value) /
        pJS.particles.number.density.value_area;

      /* add or remove X particles */
      var missing_particles = pJS.particles.array.length - nb_particles;
      if (missing_particles < 0)
        pJS.fn.modes.pushParticles(Math.abs(missing_particles));
      else pJS.fn.modes.removeParticles(missing_particles);
    }
  };

  pJS.fn.vendors.checkOverlap = function (p1, position) {
    for (var i = 0; i < pJS.particles.array.length; i++) {
      var p2 = pJS.particles.array[i];

      var dx = p1.x - p2.x,
        dy = p1.y - p2.y,
        dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= p1.radius + p2.radius) {
        p1.x = position ? position.x : Math.random() * pJS.canvas.w;
        p1.y = position ? position.y : Math.random() * pJS.canvas.h;
        pJS.fn.vendors.checkOverlap(p1);
      }
    }
  };

  pJS.fn.vendors.createSvgImg = function (p) {
    /* set color to svg element */
    var svgXml = pJS.tmp.source_svg,
      rgbHex = /#([0-9A-F]{3,6})/gi,
      coloredSvgXml = svgXml.replace(rgbHex, function (m, r, g, b) {
        if (p.color.rgb) {
          var color_value =
            "rgba(" +
            p.color.rgb.r +
            "," +
            p.color.rgb.g +
            "," +
            p.color.rgb.b +
            "," +
            p.opacity +
            ")";
        } else {
          var color_value =
            "hsla(" +
            p.color.hsl.h +
            "," +
            p.color.hsl.s +
            "%," +
            p.color.hsl.l +
            "%," +
            p.opacity +
            ")";
        }
        return color_value;
      });

    /* prepare to create img with colored svg */
    var svg = new Blob([coloredSvgXml], {
        type: "image/svg+xml;charset=utf-8",
      }),
      DOMURL = window.URL || window.webkitURL || window,
      url = DOMURL.createObjectURL(svg);

    /* create particle img obj */
    var img = new Image();
    img.addEventListener("load", function () {
      p.img.obj = img;
      p.img.loaded = true;
      DOMURL.revokeObjectURL(url);
      pJS.tmp.count_svg++;
    });
    img.src = url;
  };

  pJS.fn.vendors.destroypJS = function () {
    cancelAnimationFrame(pJS.fn.drawAnimFrame);
    canvas_el.remove();
    pJSDom = null;
  };

  pJS.fn.vendors.drawShape = function (
    c,
    startX,
    startY,
    sideLength,
    sideCountNumerator,
    sideCountDenominator
  ) {
    // By Programming Thomas - https://programmingthomas.wordpress.com/2013/04/03/n-sided-shapes/
    var sideCount = sideCountNumerator * sideCountDenominator;
    var decimalSides = sideCountNumerator / sideCountDenominator;
    var interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
    var interiorAngle = Math.PI - (Math.PI * interiorAngleDegrees) / 180; // convert to radians
    c.save();
    c.beginPath();
    c.translate(startX, startY);
    c.moveTo(0, 0);
    for (var i = 0; i < sideCount; i++) {
      c.lineTo(sideLength, 0);
      c.translate(sideLength, 0);
      c.rotate(interiorAngle);
    }
    //c.stroke();
    c.fill();
    c.restore();
  };

  pJS.fn.vendors.exportImg = function () {
    window.open(pJS.canvas.el.toDataURL("image/png"), "_blank");
  };

  pJS.fn.vendors.loadImg = function (type) {
    pJS.tmp.img_error = undefined;

    if (pJS.particles.shape.image.src != "") {
      if (type == "svg") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", pJS.particles.shape.image.src);
        xhr.onreadystatechange = function (data) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              pJS.tmp.source_svg = data.currentTarget.response;
              pJS.fn.vendors.checkBeforeDraw();
            } else {
              console.log("Error pJS - Image not found");
              pJS.tmp.img_error = true;
            }
          }
        };
        xhr.send();
      } else {
        var img = new Image();
        img.addEventListener("load", function () {
          pJS.tmp.img_obj = img;
          pJS.fn.vendors.checkBeforeDraw();
        });
        img.src = pJS.particles.shape.image.src;
      }
    } else {
      console.log("Error pJS - No image.src");
      pJS.tmp.img_error = true;
    }
  };

  pJS.fn.vendors.draw = function () {
    if (pJS.particles.shape.type == "image") {
      if (pJS.tmp.img_type == "svg") {
        if (pJS.tmp.count_svg >= pJS.particles.number.value) {
          pJS.fn.particlesDraw();
          if (!pJS.particles.move.enable)
            cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
          else pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
        } else {
          //console.log('still loading...');
          if (!pJS.tmp.img_error)
            pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
        }
      } else {
        if (pJS.tmp.img_obj != undefined) {
          pJS.fn.particlesDraw();
          if (!pJS.particles.move.enable)
            cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
          else pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
        } else {
          if (!pJS.tmp.img_error)
            pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
        }
      }
    } else {
      pJS.fn.particlesDraw();
      if (!pJS.particles.move.enable)
        cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
      else pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
    }
  };

  pJS.fn.vendors.checkBeforeDraw = function () {
    // if shape is image
    if (pJS.particles.shape.type == "image") {
      if (pJS.tmp.img_type == "svg" && pJS.tmp.source_svg == undefined) {
        pJS.tmp.checkAnimFrame = requestAnimFrame(check);
      } else {
        //console.log('images loaded! cancel check');
        cancelRequestAnimFrame(pJS.tmp.checkAnimFrame);
        if (!pJS.tmp.img_error) {
          pJS.fn.vendors.init();
          pJS.fn.vendors.draw();
        }
      }
    } else {
      pJS.fn.vendors.init();
      pJS.fn.vendors.draw();
    }
  };

  pJS.fn.vendors.init = function () {
    /* init canvas + particles */
    pJS.fn.retinaInit();
    pJS.fn.canvasInit();
    pJS.fn.canvasSize();
    pJS.fn.canvasPaint();
    pJS.fn.particlesCreate();
    pJS.fn.vendors.densityAutoParticles();

    /* particles.line_linked - convert hex colors to rgb */
    pJS.particles.line_linked.color_rgb_line = hexToRgb(
      pJS.particles.line_linked.color
    );
  };

  pJS.fn.vendors.start = function () {
    if (isInArray("image", pJS.particles.shape.type)) {
      pJS.tmp.img_type = pJS.particles.shape.image.src.substr(
        pJS.particles.shape.image.src.length - 3
      );
      pJS.fn.vendors.loadImg(pJS.tmp.img_type);
    } else {
      pJS.fn.vendors.checkBeforeDraw();
    }
  };

  /* ---------- pJS - start ------------ */

  pJS.fn.vendors.eventsListeners();

  pJS.fn.vendors.start();
};

/* ---------- global functions - vendors ------------ */

Object.deepExtend = function (destination, source) {
  for (var property in source) {
    if (
      source[property] &&
      source[property].constructor &&
      source[property].constructor === Object
    ) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

window.cancelRequestAnimFrame = (function () {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout
  );
})();

function hexToRgb(hex) {
  // By Tim Down - http://stackoverflow.com/a/5624139/3493650
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/* ---------- particles.js functions - start ------------ */

window.pJSDom = [];

window.particlesJS = function (tag_id, params) {
  //console.log(params);

  /* no string id? so it's object params, and set the id with default id */
  if (typeof tag_id != "string") {
    params = tag_id;
    tag_id = "particles-js";
  }

  /* no id? set the id to default id */
  if (!tag_id) {
    tag_id = "particles-js";
  }

  /* pJS elements */
  var pJS_tag = document.getElementById(tag_id),
    pJS_canvas_class = "particles-js-canvas-el",
    exist_canvas = pJS_tag.getElementsByClassName(pJS_canvas_class);

  /* remove canvas if exists into the pJS target tag */
  if (exist_canvas.length) {
    while (exist_canvas.length > 0) {
      pJS_tag.removeChild(exist_canvas[0]);
    }
  }

  /* create canvas element */
  var canvas_el = document.createElement("canvas");
  canvas_el.className = pJS_canvas_class;

  /* set size canvas */
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  /* launch particle.js */
  if (canvas != null) {
    pJSDom.push(new pJS(tag_id, params));
  }
};

window.particlesJS.load = function (tag_id, path_config_json, callback) {
  /* load json config */
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path_config_json);
  xhr.onreadystatechange = function (data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var params = JSON.parse(data.currentTarget.response);
        window.particlesJS(tag_id, params);
        if (callback) callback();
      } else {
        console.log("Error pJS - XMLHttpRequest status: " + xhr.status);
        console.log("Error pJS - File config not found");
      }
    }
  };
  xhr.send();
};
</script>
<template>
  <div id="main-container">
    <div class="history-wapper" id="particle-container">
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
  <div id="verify" class="backdrop">
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
  padding: 20px;
  transition: 0.4s cubic-bezier(1, -2.02, 0.38, 2.05);
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
  .wapper {
    width: 300px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .waves-container {
    width: 100%;
    position: absolute;
    bottom: 0;
    .waves {
      position: relative;
      width: 100%;
      height: 15vh;
      margin-bottom: -15px;
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
