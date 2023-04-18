import openai
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

history = []
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["HEAD", "OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
    allow_headers=["*"],
    max_age=86400
)

openai.api_key = "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"


class TalkRequest(BaseModel):
    message: str


@app.post("/chatbot/talk")
async def chatbot_talk(user_input: TalkRequest):
    if not history:
        history.append({"role": "system", "content": "你好，我是你的私人助手！"})
    history.append({"role": "user", "content": user_input.message.strip()})
    # 调用 ChatGPT 接口
    model_engine = "text-davinci-003"  # 这个最好用 # 注意节点要开香港的！
    # text-davinci-002也可以
    # model_engine = "davinci"
    # model_engine = "text-davinci-002"
    response = openai.Completion.create(
        engine=model_engine,
        prompt=user_input.message.strip(),
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )
    bot_response = response.choices[0].text.strip()
    history.append({"role": "bot", "content": bot_response})
    print(history)
    return {"content": bot_response, "history": history}
