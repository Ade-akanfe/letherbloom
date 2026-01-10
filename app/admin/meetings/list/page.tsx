"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function MeetingsListPage() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [expired, setExpired] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/meetings/list");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch");
        setUpcoming(data.upcoming || []);
        setExpired(data.expired || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-2xl font-bold mb-4">Meetings</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Upcoming / Active</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-zinc-600">No upcoming meetings.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((m) => (
                <div key={m.id} className="rounded border bg-white p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-lg font-bold">{m.title || "Untitled"}</div>
                      <div className="text-sm text-zinc-600">{m.details?.description}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Meeting: {m.meeting_number}</div>
                      <div>Starts: {m.start_time || "TBD"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Expired / Past</h2>
          {expired.length === 0 ? (
            <p className="text-sm text-zinc-600">No expired meetings.</p>
          ) : (
            <div className="space-y-4">
              {expired.map((m) => (
                <div key={m.id} className="rounded border bg-white p-4 opacity-80">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-lg font-bold">{m.title || "Untitled"}</div>
                      <div className="text-sm text-zinc-600">{m.details?.description}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Meeting: {m.meeting_number}</div>
                      <div>Started: {m.start_time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
