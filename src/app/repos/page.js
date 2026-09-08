"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReposPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/repos", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load repositories");
        return data;
      })
      .then(setRepos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Your Repositories</h1>
      {loading && <p className="text-neutral-400">Loading repositories...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && <div className="grid grid-cols-2 gap-4">
        {repos.map((repo) => (
          <Link
            key={repo.id}
            href={`/repos/${repo.id}`}
            className="border border-neutral-800 rounded-lg p-4 hover:border-neutral-600"
          >
            <h2 className="font-medium">{repo.fullName}</h2>
            <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
              {repo.description || "No description"}
            </p>
            <div className="flex gap-3 text-xs text-neutral-500 mt-3">
              {repo.language && <span>{repo.language}</span>}
              <span>★ {repo.stars}</span>
            </div>
          </Link>
        ))}
      </div>}
    </div>
  );
}