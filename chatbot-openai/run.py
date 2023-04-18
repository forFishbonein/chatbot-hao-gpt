import uvicorn

from main.app import app

if __name__ == '__main__':
    uvicorn.run(
        app=app,
        host="127.0.0.1",
        port=8080,
        use_colors=True,
        log_level="debug"
    )