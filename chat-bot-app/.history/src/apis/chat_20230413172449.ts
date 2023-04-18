import httpRequest from "@/request";
import { promptType } from "@/apis/Interface/index";
export const sendMessage = (data: promptType) => {
  // console.log(passData);
  return httpRequest({
    data: data,
    method: "post",
    url: "/chatbot/talk",
    // loading: false, //显示加载圈
  });
};
