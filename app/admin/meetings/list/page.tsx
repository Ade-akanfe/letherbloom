"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import supabase from "@/lib/supabase";
import { formatLocalTime, getRelativeTime } from "@/util/date-format";

export default function MeetingsListPage() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [expired, setExpired] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const PAGE_SIZE = 5;
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [expiredPage, setExpiredPage] = useState(0);
  const [totalUpcoming, setTotalUpcoming] = useState(0);
  const [totalExpired, setTotalExpired] = useState(0);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      // 1. Fetch Active (Not Ended)
      const { data: upData, error: upError, count: upCount } = await supabase
        .from("meetings")
        .select("*", { count: "exact" })
        .eq("is_ended", false)
        .order("start_time", { ascending: true })
        .range(upcomingPage * PAGE_SIZE, (upcomingPage + 1) * PAGE_SIZE - 1);

      if (upError) throw upError;

      // 2. Fetch Ended (Completed)
      const { data: exData, error: exError, count: exCount } = await supabase
        .from("meetings")
        .select("*", { count: "exact" })
        .eq("is_ended", true)
        .order("start_time", { ascending: false })
        .range(expiredPage * PAGE_SIZE, (expiredPage + 1) * PAGE_SIZE - 1);

      if (exError) throw exError;
      // ... (fetchMeetings continues, just adding state above)
      setUpcoming(upData || []);
      setTotalUpcoming(upCount || 0);

      setExpired(exData || []);
      setTotalExpired(exCount || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [upcomingPage, expiredPage]);

  const handleMarkAsEnded = async (id: string, isEnded: boolean) => {
    try {
      const res = await fetch(`/api/admin/meetings?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_ended: isEnded }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchMeetings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (meeting: any) => {
    setEditingId(meeting.id);
    setEditForm({
      title: meeting.title || "",
      meeting_number: meeting.meeting_number,
      meeting_password: meeting.meeting_password || "",
      start_time: meeting.start_time ? meeting.start_time.substring(0, 16) : "",
      details: meeting.details?.description || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/meetings?id=${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update meeting");
      setEditingId(null);
      fetchMeetings();
    } catch (err: any) {
      alert(err.message);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    try {
      const res = await fetch(`/api/admin/meetings?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      // Refresh list
      fetchMeetings();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-2xl font-bold mb-4">Meetings</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-zinc-800">Active & Scheduled</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-zinc-500 py-6 italic border rounded bg-white text-center">No active or scheduled meetings.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((m) => (
                <div key={m.id} className="rounded-xl border bg-white p-5 shadow-sm">
                  {editingId === m.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Title</label>
                          <input className="border rounded px-3 py-2 text-sm" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Meeting Number</label>
                          <input className="border rounded px-3 py-2 text-sm" value={editForm.meeting_number} onChange={e => setEditForm({ ...editForm, meeting_number: e.target.value })} placeholder="Number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Starts At</label>
                          <input className="border rounded px-3 py-2 text-sm" type="datetime-local" value={editForm.start_time} onChange={e => setEditForm({ ...editForm, start_time: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Password</label>
                          <input className="border rounded px-3 py-2 text-sm" value={editForm.meeting_password} onChange={e => setEditForm({ ...editForm, meeting_password: e.target.value })} placeholder="Password" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-zinc-500">Description</label>
                        <textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={editForm.details} onChange={e => setEditForm({ ...editForm, details: e.target.value })} placeholder="Description" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleUpdate} className="bg-rose-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-rose-700 transition">Save Changes</button>
                        <button onClick={() => setEditingId(null)} className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded text-sm font-semibold hover:bg-zinc-200 transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-bold text-zinc-900">{m.title || "Untitled Session"}</div>
                        <div className="text-sm text-zinc-500 mt-1 max-w-md">{m.details?.description}</div>
                        <div className="flex gap-4 mt-4">
                          <button onClick={() => startEdit(m)} className="text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider">Edit</button>
                          <button onClick={() => handleMarkAsEnded(m.id, true)} className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-wider">Mark as Ended</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <div className="font-mono text-zinc-600 font-medium text-sm">ID: {m.meeting_number}</div>
                        <div className="text-rose-600 text-sm mt-1 font-bold">{formatLocalTime(m.start_time)}</div>
                        <div className="text-zinc-400 text-xs mt-0.5">{getRelativeTime(m.start_time)}</div>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider mt-4"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination for Upcoming */}
              {totalUpcoming > PAGE_SIZE && (
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                  <p className="text-sm text-zinc-500">
                    Showing {upcomingPage * PAGE_SIZE + 1} to {Math.min((upcomingPage + 1) * PAGE_SIZE, totalUpcoming)} of {totalUpcoming}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUpcomingPage(p => Math.max(0, p - 1))}
                      disabled={upcomingPage === 0 || loading}
                      className="px-3 py-1 rounded border border-zinc-200 bg-white text-sm hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setUpcomingPage(p => p + 1)}
                      disabled={(upcomingPage + 1) * PAGE_SIZE >= totalUpcoming || loading}
                      className="px-3 py-1 rounded border border-zinc-200 bg-white text-sm hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-800">Closed & Past</h2>
          {expired.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4 italic border rounded bg-white text-center">No closed meetings yet.</p>
          ) : (
            <div className="space-y-4">
              {expired.map((m) => (
                <div key={m.id} className="rounded-xl border bg-white p-5 opacity-75 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold text-zinc-700">{m.title || "Untitled Session"}</div>
                      <div className="text-sm text-zinc-400">{m.details?.description}</div>
                      <button onClick={() => handleMarkAsEnded(m.id, false)} className="text-xs font-semibold text-rose-600 hover:underline mt-3">Restore to Active</button>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right text-sm">
                        <div className="font-mono text-zinc-400">ID: {m.meeting_number}</div>
                        <div className="text-zinc-400 mt-1">{formatLocalTime(m.start_time)}</div>
                      </div>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination for Expired */}
              {totalExpired > PAGE_SIZE && (
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                  <p className="text-sm text-zinc-500">
                    Showing {expiredPage * PAGE_SIZE + 1} to {Math.min((expiredPage + 1) * PAGE_SIZE, totalExpired)} of {totalExpired}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpiredPage(p => Math.max(0, p - 1))}
                      disabled={expiredPage === 0 || loading}
                      className="px-3 py-1 rounded border border-zinc-200 bg-white text-sm hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setExpiredPage(p => p + 1)}
                      disabled={(expiredPage + 1) * PAGE_SIZE >= totalExpired || loading}
                      className="px-3 py-1 rounded border border-zinc-200 bg-white text-sm hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
