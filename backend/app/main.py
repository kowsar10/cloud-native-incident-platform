from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, incidents

app = FastAPI(
    title="Cloud-Native Incident Reporting API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-url.azurewebsites.net"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(incidents.router)


@app.get("/")
def home():
    return {"message": "Incident Reporting API is running on Azure"}