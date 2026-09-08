"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeRepoId } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function RepoDetailPage({ params }) {
  const { repoId } = use(params);
  const { fullName } = decodeRepoId(repoId);
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  async function startChat(force = false) {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: fullName, force }),
      });
      if (!res.ok) throw new Error("Failed to start indexing");
      const { jobId } = await res.json();
      router.push(`/repos/${repoId}/chat?indexJobId=${jobId}`);
    } catch (err) {
      setError(err.message);
      setStarting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
        <Sparkles size={14} /> Repository
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{fullName}</h1>
      <p className="mt-2 text-sm leading-6 text-text-muted">
        Index this repository and start asking questions about its code.
      </p>

      <div className="mt-6 flex gap-3">
        <button onClick={() => startChat(false)} disabled={starting} className="btn-primary">
          {starting ? "Starting..." : "Chat with this repo"}
        </button>
        <button onClick={() => startChat(true)} disabled={starting} className="btn-secondary">
          Force re-index
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-danger">{error}</p>}
    </div>
  );
}