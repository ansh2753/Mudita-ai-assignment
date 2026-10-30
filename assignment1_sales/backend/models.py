from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class InboundInquiry(BaseModel):
    channel: Literal["whatsapp", "instagram", "gmail"]
    sender_id: str
    sender_name: str
    message_body: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow.isoformat())

class LeadQualification(BaseModel):
    lead_id: str
    sender_name: str
    channel: str
    classification: Literal["Qualified", "Not Qualified", "Needs More Information"]
    buyer_intent: str
    evidence: List[str]
    assigned_representative: Optional[str] = None
    urgency_score: int = Field(ge=1, le=5)
    reasoning: str

class SalesResponse(BaseModel):
    response_message: str
    suggested_slots: List[str] = []
    requires_human_review: bool = False

class CalendarBookingRequest(BaseModel):
    lead_id: str
    representative_name: str
    slot_time: str
    attendee_email: str

class CalendarBookingResponse(BaseModel):
    booking_id: str
    status: Literal["Confirmed", "Failed", "Conflict"]
    slot_time: str
    message: str