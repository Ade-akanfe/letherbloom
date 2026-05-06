// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import CodeEntry from "@/components/LiveTraining/CodeEntry";
// import ZoomSession from "@/components/LiveTraining/ZoomSession";

// function LiveTrainingContent() {
//     const searchParams = useSearchParams();
//     const [isValidated, setIsValidated] = useState(false);
//     const [accessCode, setAccessCode] = useState("");
//     const [meetings, setMeetings] = useState<any[]>([]);
//     const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);

//     // Check for "code" param (passed from payment-success page)
//     const urlCode = searchParams.get("code");

//     useEffect(() => {
//         if (urlCode && !isValidated) {
//             // We could auto-validate here if verification API allows it without user action,
//             // but for now, passing it to CodeEntry as initial prop is enough.
//         }
//     }, [urlCode, isValidated]);

//     const handleCodeSuccess = (code: string) => {
//         setAccessCode(code);
//         setIsValidated(true);
//         // Fetch meeting details associated with this code
//         (async () => {
//             try {
//                 // const res = await fetch("/api/meetings/get-by-code", {
//                 //     method: "POST",
//                 //     headers: { "Content-Type": "application/json" },
//                 //     body: JSON.stringify({ code }),
//                 // });
//                 // const data = await res.json();

//                 // Hardcoded test meeting for debugging
//                 const testMeeting = {
//                     id: 'test-123',
//                     topic: 'Test Zoom Meeting',
//                     start_time: new Date().toISOString(),
//                     meeting_number: '84574864139',
//                     meeting_password: 'gn0KtR'
//                 };
//                 setMeetings([testMeeting]);

//                 // if (res.ok && data.meetings) {
//                 //     setMeetings(data.meetings);
//                 // } else {
//                 //     setMeetings([]);
//                 // }
//             } catch (err) {
//                 setMeetings([]);
//             }
//         })();
//     };

//     const handleJoinMeeting = (meeting: any) => {
//         setSelectedMeeting(meeting);
//     };

//     return (
//         <div className="flex min-h-screen flex-col bg-zinc-50">
//             <main className="flex flex-1 flex-col items-center justify-center p-4">
//                 {!isValidated ? (
//                     <CodeEntry initialCode={urlCode || ""} onSuccess={handleCodeSuccess} />
//                 ) : !selectedMeeting ? (
//                     <div className="mt-12 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
//                         <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
//                             <div className="mb-6 flex items-center justify-between">
//                                 <h2 className="text-2xl font-bold text-zinc-900">Available Sessions</h2>
//                                 <button
//                                     onClick={() => setIsValidated(false)}
//                                     className="text-sm text-zinc-500 hover:text-zinc-900"
//                                 >
//                                     Log out
//                                 </button>
//                             </div>

//                             {meetings.length === 0 ? (
//                                 <div className="py-12 text-center text-zinc-500">
//                                     <p>No upcoming sessions found.</p>
//                                 </div>
//                             ) : (
//                                 <div className="grid gap-4">
//                                     {meetings.map((meeting) => (
//                                         <div
//                                             key={meeting.id}
//                                             className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:bg-zinc-100"
//                                         >
//                                             <div className="space-y-1">
//                                                 <h3 className="font-semibold text-zinc-900">{meeting.title || "Live Training Session"}</h3>
//                                                 <p className="text-sm text-zinc-500">
//                                                     Start: {new Date(meeting.start_time).toLocaleString()}
//                                                 </p>
//                                             </div>
//                                             <button
//                                                 onClick={() => handleJoinMeeting(meeting)}
//                                                 className="rounded-lg bg-black px-6 py-2.5 font-semibold text-white transition hover:bg-zinc-800 active:scale-95"
//                                             >
//                                                 Join Session
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="mt-12 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
//                         <ZoomSession
//                             meetingNumber={selectedMeeting.meeting_number}
//                             userName="Participant"
//                             userEmail={""}
//                             passWord={selectedMeeting.meeting_password || ""}
//                             onLeave={() => setSelectedMeeting(null)}
//                         />
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

// export default function LiveTrainingPage() {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <LiveTrainingContent />
//         </Suspense>
//     );
// }


"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CodeEntry from "@/components/LiveTraining/CodeEntry";
import ZoomSession from "@/components/LiveTraining/ZoomSession";
import { formatLocalTime, getRelativeTime } from "@/util/date-format";

type Meeting = {
  id: string;
  title?: string;
  start_time: string;
  meeting_number: string;
  meeting_password?: string;
};

// Detect if user is on mobile device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

function LiveTrainingContent() {
  const searchParams = useSearchParams();

  const [isValidated, setIsValidated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const urlCode = searchParams.get("code");

  // Optional auto-fill code
  useEffect(() => {
    if (urlCode && !isValidated) {
      setAccessCode(urlCode);
    }
  }, [urlCode, isValidated]);

  const handleCodeSuccess = useCallback(async (code: string) => {
    setAccessCode(code);
    setIsValidated(true);

    try {
      const res = await fetch("/api/meetings/get-by-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.meetings) {
        setMeetings(data.meetings);
      } else {
        setMeetings([]);
        // Optional: Handle error UI or toast here
        console.error("No meetings found or error:", data.error);
      }
    } catch (error) {
      console.error("Failed to load meetings", error);
      setMeetings([]);
    }
  }, []);

  const handleJoinMeeting = useCallback((meeting: Meeting) => {
    // Mobile devices open the native Zoom App or Zoom's smart redirect page
    if (window.innerWidth <= 768) {
      const zoomUrl = `https://zoom.us/j/${meeting.meeting_number}?pwd=${meeting.meeting_password || ""}`;
      window.open(zoomUrl, "_blank");
      return;
    }

    // Tablets and Desktop use the embedded view
    setSelectedMeeting(meeting);
    setShowNameInput(true);
  }, []);

  const handleNameSubmit = useCallback(() => {
    if (userName.trim()) {
      setShowNameInput(false);
    }
  }, [userName]);

  const handleLeaveMeeting = useCallback(() => {
    setSelectedMeeting(null);
    setShowNameInput(false);
    setUserName("");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {/* STEP 1: Code validation */}
        {!isValidated && (
          <CodeEntry
            initialCode={accessCode}
            onSuccess={handleCodeSuccess}
          />
        )}

        {/* STEP 2: Meeting list */}
        {isValidated && !selectedMeeting && (
          <div className="mt-12 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Available Sessions
                </h2>
                <button
                  onClick={() => {
                    setIsValidated(false);
                    setMeetings([]);
                    setAccessCode("");
                  }}
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  Log out
                </button>
              </div>

              {meetings.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <p>No upcoming sessions found.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {meetings.map((meeting) => {
                    const isStarted = new Date(meeting.start_time) <= now;
                    return (
                      <div
                        key={meeting.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:bg-zinc-100"
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold text-zinc-900">
                            {meeting.title || "Live Training Session"}
                          </h3>
                          <p className="text-rose-600 font-bold text-sm">
                            {formatLocalTime(meeting.start_time)}
                          </p>
                          <p className="text-zinc-400 text-xs">
                            {getRelativeTime(meeting.start_time)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleJoinMeeting(meeting)}
                          disabled={!isStarted}
                          className={`rounded-lg px-6 py-2.5 font-semibold text-white transition active:scale-95 ${isStarted
                              ? "bg-black hover:bg-zinc-800"
                              : "bg-zinc-300 cursor-not-allowed"
                            }`}
                        >
                          {isStarted ? "Join Session" : "Starts Soon"}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Name Entry */}
        {isValidated && selectedMeeting && showNameInput && (
          <div className="mt-12 w-full max-w-md animate-in fade-in zoom-in duration-500">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
              <h2 className="mb-2 text-2xl font-bold text-zinc-900">
                Join Session
              </h2>
              <p className="mb-6 text-zinc-500">
                Please enter your name to join the session.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1 block w-full rounded-lg border border-zinc-200 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameSubmit();
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowNameInput(false);
                      setSelectedMeeting(null);
                    }}
                    className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 font-semibold text-zinc-600 transition hover:bg-zinc-50 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNameSubmit}
                    disabled={!userName.trim()}
                    className="flex-1 rounded-lg bg-black px-4 py-2 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Zoom session */}
        {isValidated && selectedMeeting && !showNameInput && (
          <div className="mt-12 w-full max-w-4xl animate-in fade-in zoom-in duration-500">
            <ZoomSession
              meetingNumber={selectedMeeting.meeting_number}
              userName={userName || "Participant"}
              userEmail=""
              passWord={selectedMeeting.meeting_password || ""}
              onLeave={handleLeaveMeeting}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function LiveTrainingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveTrainingContent />
    </Suspense>
  );
}
