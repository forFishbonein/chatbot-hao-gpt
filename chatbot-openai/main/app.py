import openai
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
import re

history = []
request_messages = []
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["HEAD", "OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
    allow_headers=["*"],
    max_age=86400
)

openai.api_key = "your key"


class TalkRequest(BaseModel):
    message: str


@app.post("/chatbot/talk")
async def chatbot_talk(user_input: TalkRequest):
    if not history:
        history.append({"role": "system", "content": "你好，我是你的私人助手HaoGPT！"})
    history.append({"role": "user", "content": user_input.message.strip()})
    request_messages.append({"role": "user", "content": user_input.message.strip()})
    # 调用 ChatGPT 接口
    '''
    在使用GPT-3时，哪个版本最好用主要取决于你具体的需求和应用场景。以下是每个版本的特点：
    Text-davinci-003: 参数最多、能力最强大、生成的内容质量最高。适用于需要高质量生成内容的场景，如文章创作、写作辅助等。
    Text-Cursivity-002: 在生成文本的同时，也可以生成代码和数学运算。适用于需要在文本生成场景中涉及代码和数学的场景，如程序代码生成，算法编写等。
    Text-Plato-002: 在生成文本的同时，也可以进行语义搜索和知识图谱构建。适用于需要搜索和组织大量知识或构建知识图谱的场景，如智能问答、语义搜索等。
    Text-Babbage-001: 适用于与程序交互，生成对话的场景，如虚拟助手、聊天机器人等。
    Text-Ada-001: 可以实现数据的分析和转换，适用于需要进行数据分析和处理的场景，如自动化数据分析、数据转换等。
    因此，你需要根据你的具体需求和应用场景来选择适合你的GPT-3版本。
    Text-davinci-002、Text-davinci-001、Text-cushman-xl、Text-cushman
    '''
    # 这里是openai.Completion的写法，回答效果不好
    # model_engine = "text-davinci-003"  # 这个最好用 # 注意节点要开香港的！
    # text-davinci-002也可以   text-davinci-002-render
    # model_engine = "davinci"
    # model_engine = "text-davinci-002"
    # response = openai.Completion.create(
    #     engine=model_engine,
    #     prompt=user_input.message.strip(),
    #     max_tokens=1024,
    #     n=1,
    #     stop=None,
    #     temperature=0.5,
    # )
    # bot_response = response.choices[0].message
    # bot_response = response.choices[0].text.strip()
    # bot_response = re.sub(r'^[^\u4e00-\u9fa5a-zA-Z]*', '', response.choices[0].text.strip())

    # 这里是openai.ChatCompletion的写法，回答效果比较好
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=request_messages
    )
    bot_response = re.sub(r'^[^\u4e00-\u9fa5a-zA-Z]*', '', response['choices'][0]['message']['content'].strip())
    # print(bot_response)
    # print(response.choices[0])
    history.append({"role": "bot", "content": bot_response})
    print(history)  # history用于后台记录，但是不能作为提示词全部发给openai接口！
    return {"content": bot_response, "history": history}
