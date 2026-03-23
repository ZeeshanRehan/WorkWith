import { useEffect, useState } from "react";
import EntryForm from "../components/EntryForm.tsx";

type EntryUser = {
  name?: string;
};

type Entry = {
  _id: string;
  userId: string | EntryUser;
  metric: string;
  value: number | boolean | string;
  date: string;
};

function GroupPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const response = await fetch("http://localhost:5000/api/entry/default", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as {
        entries?: Entry[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch entries");
      }

      setEntries(data.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEntries();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">My Group</h1>
          <p className="mt-2 text-sm text-slate-500">
            Recent entries from the default group.
          </p>
        </div>

        <div className="mb-6">
          <EntryForm
            onSuccess={() => {
              setLoading(true);
              void fetchEntries();
            }}
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading entries...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map((entry) => {
                const userName =
                  typeof entry.userId === "object" ? entry.userId.name : "Unknown user";

                return (
                  <article
                    key={entry._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {userName || "Unknown user"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{entry.date}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {entry.metric}
                      </span>
                    </div>

                    <p className="mt-4 text-lg font-semibold text-slate-900">
                      {String(entry.value)}
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                No entries found.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default GroupPage;
