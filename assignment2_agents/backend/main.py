from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from models import CompanyRule
from orchestrator import execute_workflow, SESSION_STORE

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RunRequest(BaseModel):
    session_id: str
    transcript_text: str
    rules: List[CompanyRule]
    simulate_failure: bool = False

class UpdateFactRequest(BaseModel):
    session_id: str
    new_transcript_text: str
    rules: List[CompanyRule]

@app.post("/api/run-coordinator")
def run_coordinator(req: RunRequest):
    result = execute_workflow(req.session_id, req.transcript_text, [r.model_dump() for r in req.rules], req.simulate_failure)
    return result

@app.post("/api/update-fact-and-rerun")
def update_fact_and_rerun(req: UpdateFactRequest):
    result = execute_workflow(req.session_id, req.new_transcript_text, [r.model_dump() for r in req.rules])
    return result

@app.get("/api/session/{session_id}")
def get_session(session_id: str):
    if session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Session not found or isolated.")
    return SESSION_STORE[session_id]