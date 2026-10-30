from typing import Dict, Any
from agents import run_intake_agent, run_planning_agent, run_review_agent

SESSION_STORE: Dict[str, Dict[str, Any]] = {}

def execute_workflow(session_id: str, transcript: str, rules: list, simulate_failure: bool = False):
    state = {
        "run_id": session_id,
        "version": SESSION_STORE.get(session_id, {}).get("version", 1) + 1,
        "status": "Running",
        "logs": [],
        "intake": None,
        "plan": None,
        "review": None,
        "iterations": 0
    }
    SESSION_STORE[session_id] = state

    try:
        print("--> Starting Intake Agent...")
        state["logs"].append({"step": "Intake", "message": "Extracting facts and constraints..."})
        intake_result = run_intake_agent(transcript, rules)
        state["intake"] = intake_result.model_dump()
        print("--> Intake Agent completed successfully.")

        if simulate_failure:
            raise Exception("Simulated Model API Failure / Timeout")

        print("--> Starting Planning Agent...")
        state["logs"].append({"step": "Planning", "message": "Generating initial task breakdown..."})
        plan_result = run_planning_agent(intake_result, rules)
        print("--> Planning Agent completed successfully.")

        max_iterations = 3
        feedback = None
        
        while state["iterations"] < max_iterations:
            state["iterations"] += 1
            print(f"--> Starting Review Agent (Attempt {state['iterations']})...")
            state["logs"].append({"step": "Review", "message": f"Reviewing plan (Attempt {state['iterations']})..."})
            
            review_result = run_review_agent(plan_result, transcript, rules)
            state["review"] = review_result.model_dump()
            state["plan"] = plan_result.model_dump()

            if review_result.is_approved:
                state["status"] = "Approved"
                state["logs"].append({"step": "Success", "message": "Plan approved successfully!"})
                print("--> Plan approved!")
                break
            else:
                if state["iterations"] >= max_iterations:
                    state["status"] = "Halted: Max Iterations Reached"
                    state["logs"].append({"step": "Halt", "message": "Exceeded max correction loops."})
                    break
                
                feedback = "; ".join(review_result.specific_corrections)
                state["logs"].append({"step": "Correction", "message": f"Sending corrections back to Planner: {feedback}"})
                plan_result = run_planning_agent(intake_result, rules, previous_feedback=feedback)

    except Exception as e:
        print(f"CRITICAL ERROR IN WORKFLOW: {str(e)}")
        state["status"] = "Failed"
        state["logs"].append({"step": "Error", "message": str(e)})

    SESSION_STORE[session_id] = state
    return state