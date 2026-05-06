"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import supabase from "@/lib/supabase";
import { formatLocalTime, getRelativeTime } from "@/util/date-format";
import { toast } from "sonner";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<{ id: string, title: string } | null>(null);

  const availablePlans = [
    "Personal Training",
    "Individual Group",
    "Corporate Group",
    "Functional Core"
  ];

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
      toast.success(isEnded ? "Meeting marked as ended" : "Meeting restored to active");
      fetchMeetings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update meeting status");
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
      allowed_plans: Array.isArray(meeting.allowed_plans) ? meeting.allowed_plans : [],
    });
  };

  const handlePlanToggle = (plan: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      allowed_plans: prev.allowed_plans.includes(plan)
        ? prev.allowed_plans.filter((p: string) => p !== plan)
        : [...prev.allowed_plans, plan]
    }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/meetings?id=${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update meeting");
      toast.success("Meeting updated successfully");
      setEditingId(null);
      fetchMeetings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update meeting");
    } finally {
      setIsUpdating(false);
    }
  };


  const handleDeleteClick = (id: string, title: string) => {
    setMeetingToDelete({ id, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!meetingToDelete) return;

    setShowDeleteModal(false);
    setDeletingId(meetingToDelete.id);
    try {
      const res = await fetch(`/api/admin/meetings?id=${meetingToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      toast.success("Meeting deleted successfully");
      fetchMeetings();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete meeting");
    } finally {
      setDeletingId(null);
      setMeetingToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMeetingToDelete(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-900 mb-1">Delete Meeting</h3>
                <p className="text-sm text-zinc-600 mb-1">
                  Are you sure you want to delete <span className="font-semibold text-zinc-900">"{meetingToDelete?.title || 'this meeting'}"</span>?
                </p>
                <p className="text-xs text-zinc-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                          <input disabled={!!deletingId} className="border rounded px-3 py-2 text-sm disabled:opacity-50" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Meeting Number</label>
                          <input disabled={!!deletingId} className="border rounded px-3 py-2 text-sm disabled:opacity-50" value={editForm.meeting_number} onChange={e => setEditForm({ ...editForm, meeting_number: e.target.value })} placeholder="Number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Starts At</label>
                          <input disabled={!!deletingId} className="border rounded px-3 py-2 text-sm disabled:opacity-50" type="datetime-local" value={editForm.start_time} onChange={e => setEditForm({ ...editForm, start_time: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-zinc-500">Password</label>
                          <input disabled={!!deletingId} className="border rounded px-3 py-2 text-sm disabled:opacity-50" value={editForm.meeting_password} onChange={e => setEditForm({ ...editForm, meeting_password: e.target.value })} placeholder="Password" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-zinc-500">Description</label>
                        <textarea disabled={!!deletingId} className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50" rows={2} value={editForm.details} onChange={e => setEditForm({ ...editForm, details: e.target.value })} placeholder="Description" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-zinc-500">Allowed Plans (Access Control)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                          {availablePlans.map((plan) => (
                            <label key={plan} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                disabled={!!deletingId}
                                checked={editForm.allowed_plans?.includes(plan) || false}
                                onChange={() => handlePlanToggle(plan)}
                                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-zinc-300 disabled:opacity-50"
                              />
                              <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">{plan}</span>
                            </label>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-zinc-500 italic">Select which training plans can view and join this meeting.</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button disabled={!!deletingId || isUpdating} onClick={handleUpdate} className="bg-rose-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-2">
                          {isUpdating ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : "Save Changes"}
                        </button>
                        <button disabled={!!deletingId || isUpdating} onClick={() => setEditingId(null)} className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded text-sm font-semibold hover:bg-zinc-200 transition disabled:opacity-50">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-bold text-zinc-900">{m.title || "Untitled Session"}</div>
                        <div className="text-sm text-zinc-500 mt-1 max-w-md">{m.details?.description}</div>
                        <div className="flex gap-4 mt-4">
                          <button disabled={!!deletingId} onClick={() => startEdit(m)} className="text-xs font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider disabled:opacity-50">Edit</button>
                          <button disabled={!!deletingId} onClick={() => handleMarkAsEnded(m.id, true)} className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-wider disabled:opacity-50">Mark as Ended</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <div className="font-mono text-zinc-600 font-medium text-sm">ID: {m.meeting_number}</div>
                        <div className="text-rose-600 text-sm mt-1 font-bold">{formatLocalTime(m.start_time)}</div>
                        <div className="text-zinc-400 text-xs mt-0.5">{getRelativeTime(m.start_time)}</div>
                        <button
                          onClick={() => handleDeleteClick(m.id, m.title || "Untitled Session")}
                          disabled={!!deletingId}
                          className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider mt-4 disabled:opacity-50 flex items-center gap-1"
                        >
                          {deletingId === m.id ? (
                            <>
                              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : "Delete"}
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
                      <button disabled={!!deletingId} onClick={() => handleMarkAsEnded(m.id, false)} className="text-xs font-semibold text-rose-600 hover:underline mt-3 disabled:opacity-50">Restore to Active</button>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right text-sm">
                        <div className="font-mono text-zinc-400">ID: {m.meeting_number}</div>
                        <div className="text-zinc-400 mt-1">{formatLocalTime(m.start_time)}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(m.id, m.title || "Untitled Session")}
                        disabled={!!deletingId}
                        className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 flex items-center gap-1"
                      >
                        {deletingId === m.id ? (
                          <>
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : "Delete"}
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
