import os
from dotenv import load_dotenv
load_dotenv() # Automatically loads your key from the .env file

import json
from google import genai
from google.genai import types
from models import IntakeOutput, PlanningOutput, ReviewOutput

client = genai.Client()
MODEL_NAME = "gemini-3.5-flash-lite"
# ... rest of your agent functions ...

import json
from google import genai
from google.genai import types
from models import IntakeOutput, PlanningOutput, ReviewOutput

# Automatically initializes using the GEMINI_API_KEY environment variable
client = genai.Client()

# Use Gemini's fast and powerful flash model
MODEL_NAME = "gemini-3.5-flash-lite"

def run_intake_agent(transcript: str, rules: list) -> IntakeOutput:
    prompt = f"""
    You are the Intake Agent for an operations coordinator.
    Extract decisions, requirements, and constraints from the transcript below.
    Attach exact source references for decisions. Flag missing or conflicting information.
    Do NOT invent owners or deadlines.

    Transcript:
    {transcript}
    """
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=IntakeOutput,
        ),
    )
    return response.parsed

def run_planning_agent(intake: IntakeOutput, rules: list, previous_feedback: str = None) -> PlanningOutput:
    prompt = f"""
    You are the Planning Agent. Using the Intake output and company rules, propose tasks, owners, deadlines, and dependencies.
    Clearly separate supported facts from recommendations and unresolved questions.
    
    {f"Previous Review Feedback to address: {previous_feedback}" if previous_feedback else ""}

    Intake Data:
    {intake.model_dump_json()}

    Company Rules:
    {json.dumps(rules)}
    """
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PlanningOutput,
        ),
    )
    return response.parsed

def run_review_agent(plan: PlanningOutput, transcript: str, rules: list) -> ReviewOutput:
    prompt = f"""
    You are the Review Agent. Check the proposed plan against the original transcript and company rules.
    If there are rule violations or unsupported inventions, set is_approved to false and provide specific corrections.

    Original Transcript:
    {transcript}

    Proposed Plan:
    {plan.model_dump_json()}

    Company Rules:
    {json.dumps(rules)}
    """
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ReviewOutput,
        ),
    )
    return response.parsed