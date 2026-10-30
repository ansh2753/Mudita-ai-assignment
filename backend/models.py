from typing import List, Optional
from pydantic import BaseModel, Field

class CompanyRule(BaseModel):
    rule_id: str
    description: str

class TranscriptInput(BaseModel):
    session_id: str
    transcript_text: str
    rules: List[CompanyRule]

# --- Intake Agent Schemas ---
class ExtractedDecision(BaseModel):
    decision: str
    source_reference: str  # Exact quote from transcript

class IntakeOutput(BaseModel):
    decisions: List[ExtractedDecision]
    requirements: List[str]
    constraints: List[str]
    missing_or_conflicting_info: List[str]

# --- Planning Agent Schemas ---
class TaskItem(BaseModel):
    task_id: str
    description: str
    owner: Optional[str] = None
    deadline: Optional[str] = None
    dependencies: List[str] = []
    classification: str = Field(description="Must be 'Supported Fact' or 'Recommendation'")

class PlanningOutput(BaseModel):
    tasks: List[TaskItem]
    unresolved_questions: List[str]

# --- Review Agent Schemas ---
class ReviewOutput(BaseModel):
    is_approved: bool
    violations_found: List[str] = []
    specific_corrections: List[str] = []