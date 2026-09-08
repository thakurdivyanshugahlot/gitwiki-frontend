"use client";
import { useEffect, useState } from "react";
import { getActivity, clearHistory } from "@/lib/apiClient";
import { FileCode2, Trash2 } from "lucide-react";

export default function ActivityPanel() {
  const [repos, setRepos] = useState(null);
  const [clearing, setClearing] = useState(null);

  useEffect(() => {
    getActivity().then(setRepos).catch(() => setRepos([]));
  }, []);

  async function handleClear(repo) {
    setClearing(repo);
    try {
      await clearHistory(repo);
      setRepos((prev) => prev.filter((r) => r.repo !== repo));
    } finally {
      setClearing(null);
    }
  }

  if (repos === null) {
    return <p className="p-6 text-sm text-text-muted">Loading your activity…</p>;
  }

  return (
    <div className="p-2">
      <h2 className="mb-1 text-lg font-semibold text-text-primary">Your activity</h2>
      <p className="mb-6 text-sm text-text-muted">Repositories you've chatted with, most recent first.</p>

      {repos.length === 0 ? (
        <p className="text-sm text-text-faint">You haven't chatted with any repo yet.</p>
      ) : (
        <div className="space-y-2">
          {repos.map(({ repo, createdAt }) => (
            <div key={repo} className="surface-card flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FileCode2 size={15} className="text-accent" />
                {repo}
              </div>
              <button
                onClick={() => handleClear(repo)}
                disabled={clearing === repo}
                className="flex items-center gap-1 text-xs text-text-ghost hover:text-danger disabled:opacity-50"
              >
                <Trash2 size={13} /> {clearing === repo ? "Clearing…" : "Clear history"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}