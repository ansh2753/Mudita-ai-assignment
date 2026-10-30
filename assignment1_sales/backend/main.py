from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from models import InboundInquiry, CalendarBookingRequest
from agents import qualify_and_respond_lead
from calendar_service import get_available_slots, book_calendar_slot, BOOKED_SLOTS

app = FastAPI(title="Mudita Sales Assistant API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InquiryRequest(BaseModel):
    channel: str # "whatsapp", "instagram", "gmail"
    sender_name: str
    message_body: str

@app.get("/")
def read_root():
    return {"message": "Mudita Sales Assistant API is running successfully!"}

@app.post("/api/inquiries/process")
def process_inquiry(inquiry: InquiryRequest):
    """
    Ingests an inquiry from WhatsApp, Instagram, or Gmail,
    runs the Gemini AI agent to qualify the lead, assign a rep, and draft a response.
    """
    try:
        qualification, sales_response = qualify_and_respond_lead(
            channel=inquiry.channel,
            sender_name=inquiry.sender_name,
            message_body=inquiry.message_body
        )
        return {
            "qualification": qualification.dict(),
            "response": sales_response.dict(),
            "available_slots": get_available_slots()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/calendar/slots")
def get_slots():
    return {"available_slots": get_available_slots(), "booked_meetings": BOOKED_SLOTS}

@app.post("/api/calendar/book")
def book_slot(request: CalendarBookingRequest):
    """
    Books a specific calendar slot with reliable duplicate/conflict checks.
    """
    result = book_calendar_slot(request)
    if result.status == "Conflict" or result.status == "Failed":
        raise HTTPException(status_code=400, detail=result.message)
    return result