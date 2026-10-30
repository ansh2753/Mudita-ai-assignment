from datetime import datetime
from typing import Dict, List, Literal
from models import CalendarBookingRequest, CalendarBookingResponse

# In-memory store to track booked slots and prevent duplicates/conflicts
BOOKED_SLOTS: List[Dict[str, str]] = []

AVAILABLE_SLOTS = [
    "Tuesday Nov 3, 10:00 AM EST",
    "Tuesday Nov 3, 2:00 PM EST",
    "Wednesday Nov 4, 11:00 AM EST",
    "Thursday Nov 5, 3:00 PM EST"
]

def get_available_slots() -> List[str]:
    # Return slots that have not been booked yet
    booked_times = [booking["slot_time"] for booking in BOOKED_SLOTS]
    return [slot for slot in AVAILABLE_SLOTS if slot not in booked_times]

def book_calendar_slot(request: CalendarBookingRequest) -> CalendarBookingResponse:
    # 1. Reliable action check: Recheck availability before booking
    booked_times = [booking["slot_time"] for booking in BOOKED_SLOTS]
    
    if request.slot_time in booked_times:
        return CalendarBookingResponse(
            booking_id="err_conflict",
            status="Conflict",
            slot_time=request.slot_time,
            message="Selected slot is already occupied or was just booked. Please choose another time."
        )
    
    if request.slot_time not in AVAILABLE_SLOTS:
        return CalendarBookingResponse(
            booking_id="err_invalid",
            status="Failed",
            slot_time=request.slot_time,
            message="Requested slot is invalid or outside working hours."
        )

    # 2. Create the booking entry securely
    booking_id = f"bk_{int(datetime.utcnow().timestamp())}"
    BOOKED_SLOTS.append({
        "booking_id": booking_id,
        "lead_id": request.lead_id,
        "representative_name": request.representative_name,
        "slot_time": request.slot_time,
        "attendee_email": request.attendee_email
    })

    return CalendarBookingResponse(
        booking_id=booking_id,
        status="Confirmed",
        slot_time=request.slot_time,
        message=f"Meeting successfully booked with {request.representative_name} for {request.slot_time}!"
    )