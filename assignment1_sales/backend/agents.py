import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json
from models import LeadQualification, SalesResponse

# Load environment variables from backend/.env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the Google GenAI client using gemini-3.5-flash-lite
client = genai.Client(api_key=api_key)
MODEL_ID = "gemini-3.5-flash-lite"

BUSINESS_POLICY = """
Fictional Analytics Consultancy Policy:
- Services Offered: Predictive Customer Analytics, Supply Chain Optimization, Financial Forecasting.
- Qualifying Criteria: Must be a registered business, budget > $5,000, timeline within 3 months.
- Sales Representatives: 
  1. Sarah Jenkins (Specializes in Financial Forecasting & Supply Chain)
  2. David Chen (Specializes in Customer Analytics & Enterprise Accounts)
- Routing Rules: 
  - Financial/Supply chain queries go to Sarah Jenkins.
  - Customer analytics/general queries go to David Chen.
- Working Hours: Monday - Friday, 9:00 AM - 5:00 PM EST.
"""

def qualify_and_respond_lead(channel: str, sender_name: str, message_body: str) -> tuple[LeadQualification, SalesResponse]:
    prompt = f"""
    You are an expert AI Sales Assistant for an analytics consultancy.
    Review the following business policy strictly. Do not invent services or staff.
    
    {BUSINESS_POLICY}
    
    Incoming Inquiry:
    - Channel: {channel}
    - Sender Name: {sender_name}
    - Message: "{message_body}"
    
    Tasks:
    1. Classify the lead as 'Qualified', 'Not Qualified', or 'Needs More Information'.
    2. Extract buyer intent and evidence from the message.
    3. Assign a representative strictly from the policy list based on routing rules.
    4. Provide an urgency score from 1 to 5.
    5. Draft a professional, context-aware response message tailored to the channel ({channel}), including 2 sample meeting slots if qualified or needing info.
    
    Return your output strictly as a JSON object with this exact structure:
    {{
      "lead_id": "lead_12345",
      "sender_name": "{sender_name}",
      "channel": "{channel}",
      "classification": "Qualified / Not Qualified / Needs More Information",
      "buyer_intent": "brief summary",
      "evidence": ["point 1", "point 2"],
      "assigned_representative": "Sarah Jenkins or David Chen",
      "urgency_score": 3,
      "reasoning": "explanation",
      "response_message": "drafted reply text...",
      "suggested_slots": ["Tuesday Nov 3, 10:00 AM EST", "Wednesday Nov 4, 2:00 PM EST"],
      "requires_human_review": false
    }}
    """

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2
        ),
    )

    result = json.loads(response.text)
    
    qualification = LeadQualification(
        lead_id=result.get("lead_id", "lead_001"),
        sender_name=result.get("sender_name", sender_name),
        channel=result.get("channel", channel),
        classification=result.get("classification"),
        buyer_intent=result.get("buyer_intent"),
        evidence=result.get("evidence", []),
        assigned_representative=result.get("assigned_representative"),
        urgency_score=result.get("urgency_score", 3),
        reasoning=result.get("reasoning")
    )
    
    sales_resp = SalesResponse(
        response_message=result.get("response_message"),
        suggested_slots=result.get("suggested_slots", []),
        requires_human_review=result.get("requires_human_review", False)
    )
    
    return qualification, sales_resp