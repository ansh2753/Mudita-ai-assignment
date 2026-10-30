"use client";

import { useState } from "react";

interface TaskItem {
  task_id: string;
  description: string;
  owner?: string;
  deadline?: string;
  dependencies: string[];
  classification: string;
}

interface WorkflowState {
  run_id: string;
  version: number;
  status: string;
  logs: { step: string; message: string }[];
  intake?: {
    decisions: { decision: string; source_reference: string }[];
    requirements: string[];
    constraints: string[];
    missing_or_conflicting_info: string[];
  };
  plan?: {
    tasks: TaskItem[];
    unresolved_questions: string[];
  };
  review?: {
    is_approved: boolean;
    violations_found: string[];
    specific_corrections: string[];
  };
}

export default function OperationsDashboard() {
  const [sessionId, setSessionId] = useState("session-01");
  const [transcript, setTranscript] = useState(
    "During the Q3 sync, it was decided that we need to migrate our database infrastructure to AWS by next month. John will lead the migration, but we haven't locked down the exact budget yet."
  );
  const [rules, setRules] = useState([
    { rule_id: "r1", description: "All tasks must have a designated owner." },
    { rule_id: "r2", description: "Deadlines cannot be less than 1 week away." },
  ]);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowState | null>(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://mudita-ai-assignment-1.onrender.com/api/run-coordinator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          transcript_text: transcript,
          rules: rules,
          simulate_failure: simulateFailure,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Assignment 02
              </span>
              <span className="text-slate-400 text-sm">Operations Coordinator</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Multi-Agent Operations Hub
            </h1>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-400">
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend Connected</span>
            </div>
          </div>
        </header>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-5">
            <h2 className="text-lg font-semibold text-slate-200">
              📝 Session Configuration & Transcript
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Session ID
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Meeting Transcript
              </label>
              <textarea
                rows={5}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-3">
                🛡️ Enforced Company Rules
              </h2>
              <ul className="space-y-2.5 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                {rules.map((r, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{r.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/60">
              <label className="flex items-center space-x-3 text-sm cursor-pointer bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-300">Simulate Model API Failure</span>
              </label>

              <button
                onClick={handleRun}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <span>Agents Collaborating...</span> : <span>🚀 Run Agent Pipeline</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Results Dashboard Section */}
        {result && (
          <div className="space-y-6">
            
            {/* Status Bar */}
            <div className="bg-slate-900/80 border border-slate-800 px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pipeline Status</span>
                <p className={`text-xl font-bold ${result.status === "Approved" ? "text-emerald-400" : "text-amber-400"}`}>
                  {result.status}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Execution Version</span>
                <p className="text-xl font-bold text-indigo-400">v{result.version}</p>
              </div>
            </div>

            {/* 1. Three Agent Output Cards (Moved Above) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Intake Agent */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h4 className="font-bold text-indigo-400 text-base">1. Intake Agent</h4>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Extractor</span>
                </div>
                {result.intake ? (
                  <div className="space-y-3 text-sm text-slate-200">
                    <p className="font-semibold text-slate-300 text-xs uppercase tracking-wider">Extracted Decisions:</p>
                    {result.intake.decisions.map((d, i) => (
                      <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
                        <p className="font-medium text-slate-100 text-sm leading-snug">{d.decision}</p>
                        <p className="text-xs text-slate-400 italic">Ref: "{d.source_reference}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Waiting for execution...</p>
                )}
              </div>

              {/* Planning Agent */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h4 className="font-bold text-indigo-400 text-base">2. Planning Agent</h4>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Synthesizer</span>
                </div>
                {result.plan ? (
                  <div className="space-y-3 text-sm text-slate-200">
                    <p className="font-semibold text-slate-300 text-xs uppercase tracking-wider">Proposed Action Plan:</p>
                    {result.plan.tasks.map((t, i) => (
                      <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2.5">
                        <p className="font-medium text-slate-100 text-sm leading-snug">{t.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                          <span className="text-slate-400">Owner: <strong className="text-slate-200">{t.owner || "Unassigned"}</strong></span>
                          <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-medium">{t.classification}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Waiting for execution...</p>
                )}
              </div>

              {/* Review Agent */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h4 className="font-bold text-indigo-400 text-base">3. Review Agent</h4>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Gatekeeper</span>
                </div>
                {result.review ? (
                  <div className="space-y-3 text-sm text-slate-200">
                    <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                      <span className="font-semibold text-slate-300 text-xs uppercase tracking-wider">Audit Result:</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-xs ${result.review.is_approved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                        {result.review.is_approved ? "Approved" : "Needs Revision"}
                      </span>
                    </div>
                    {result.review.specific_corrections.length > 0 && (
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/30 space-y-1.5">
                        <p className="font-semibold text-rose-400 text-xs uppercase tracking-wider">Corrections Iteration:</p>
                        {result.review.specific_corrections.map((c, i) => (
                          <p key={i} className="text-slate-200 text-xs leading-relaxed">• {c}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Waiting for execution...</p>
                )}
              </div>

            </div>

            {/* 2. Collaboration Action Log (Moved Below & Made Larger/Clearer) */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
                <span>⚡ Live Agent Handoff & Action Log</span>
              </h3>
              <div className="space-y-3 text-sm font-mono bg-slate-950 p-5 rounded-xl border border-slate-800/80 max-h-60 overflow-y-auto">
                {result.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-3 py-1.5 border-b border-slate-900 last:border-0">
                    <span className="text-indigo-400 font-bold shrink-0">[{log.step}]</span>
                    <span className="text-slate-200 text-sm leading-relaxed">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}