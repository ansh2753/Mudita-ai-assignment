"use client";
import React, { useState } from "react";

interface Qualification {
  lead_id: string;
  sender_name: string;
  channel: string;
  classification: string;
  buyer_intent: string;
  evidence: string[];
  assigned_representative: string;
  urgency_score: number;
  reasoning: string;
}

interface SalesResponse {
  response_message: string;
  suggested_slots: string[];
  requires_human_review: boolean;
}

export default function SalesDashboard() {
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "instagram" | "gmail">("whatsapp");
  const [senderName, setSenderName] = useState("Alex Morgan");
  const [messageBody, setMessageBody] = useState(
    "Hi there! We are looking for enterprise-grade financial forecasting analytics for our retail chain with a $50k budget. Can we schedule a demo call this week?"
  );
  
  const [loading, setLoading] = useState(false);
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [response, setResponse] = useState<SalesResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("alex.morgan@retailcorp.com");
  const [bookingStatus, setBookingStatus] = useState<any>(null);

  // Preset sample messages for quick testing
  const sampleInquiries = {
    whatsapp: {
      name: "Alex Morgan",
      text: "Hey! Need supply chain optimization analytics for our warehouse by next month. Budget is around $20k."
    },
    instagram: {
      name: "Sophia Vance",
      text: "Loved your post on customer analytics! How fast can we get an enterprise demo set up?"
    },
    gmail: {
      name: "Jonathan Brooks",
      text: "Dear Mudita Team, we require comprehensive financial forecasting and risk analysis models for our fintech startup. Looking to connect with Sarah Jenkins this week."
    }
  };

  const handleChannelSwitch = (channel: "whatsapp" | "instagram" | "gmail") => {
    setActiveChannel(channel);
    setSenderName(sampleInquiries[channel].name);
    setMessageBody(sampleInquiries[channel].text);
  };

  const processInquiry = async () => {
    setLoading(true);
    setBookingStatus(null);
    try {
      const res = await fetch("https://mudita-ai-assignment.onrender.com/api/inquiries/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: activeChannel,
          sender_name: senderName,
          message_body: messageBody
        })
      });
      const data = await res.json();
      setQualification(data.qualification);
      setResponse(data.response);
      setAvailableSlots(data.available_slots);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to FastAPI backend. Make sure uvicorn is running!");
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async () => {
    if (!selectedSlot || !qualification) return;
    try {
      const res = await fetch("https://mudita-ai-assignment.onrender.com/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: qualification.lead_id,
          representative_name: qualification.assigned_representative,
          slot_time: selectedSlot,
          attendee_email: attendeeEmail
        })
      });
      const data = await res.json();
      setBookingStatus(data);
    } catch (err: any) {
      alert("Booking error or conflict detected.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-400">
              Mudita Sales Assistant Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-channel inquiry ingestion, Gemini lead qualification, and calendar booking system.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-300 font-medium">FastAPI Backend Connected</span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Multi-Channel Ingestion Inbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-3">
              📥 Multi-Channel Ingestion
            </h2>

            {/* Channel Tabs */}
            <div className="flex space-x-2">
              {(["whatsapp", "instagram", "gmail"] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => handleChannelSwitch(ch)}
                  className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                    activeChannel === ch
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {/* Inquiry Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">Sender Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Inbound Message Body</label>
                <textarea
                  rows={4}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={processInquiry}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading ? "Analyzing Lead via Gemini..." : "Process Inquiry & Qualify"}
              </button>
            </div>
          </div>

          {/* Column 2: Lead Qualification & AI Response */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-3">
              🤖 AI Qualification & Routing
            </h2>

            {qualification ? (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Classification:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    qualification.classification === "Qualified" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                    qualification.classification === "Not Qualified" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                    "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {qualification.classification}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Buyer Intent:</span>
                  <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    {qualification.buyer_intent}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Assigned Representative:</span>
                  <span className="inline-block bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 px-3 py-1 rounded-lg font-medium">
                    {qualification.assigned_representative || "Unassigned"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">AI Drafted Reply:</span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs leading-relaxed">
                    {response?.response_message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm">
                Click <span className="text-indigo-400 font-medium">"Process Inquiry"</span> to run lead qualification and routing.
              </div>
            )}
          </div>

          {/* Column 3: Calendar Booking Integration */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-3">
              📅 Calendar Booking Sync
            </h2>

            {qualification ? (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Attendee Email</label>
                  <input
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Available Meeting Slots</label>
                  <div className="space-y-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                          selectedSlot === slot
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={bookSlot}
                  disabled={!selectedSlot}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  Confirm & Book Meeting
                </button>

                {bookingStatus && (
                  <div className={`p-3 rounded-lg text-xs font-medium border ${
                    bookingStatus.status === "Confirmed"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    {bookingStatus.message}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm">
                Qualify an inbound lead to unlock calendar scheduling slots.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}