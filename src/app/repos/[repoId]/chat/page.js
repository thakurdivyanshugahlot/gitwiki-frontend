"use client";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { usePoll } from "@/hooks/usePoll";
import { decodeRepoId } from "@/lib/utils";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage({ params }) {
  const { repoId } = use(params);
  const { fullName } = decodeRepoId(repoId);
  const indexJobId = useSearchParams().get("indexJobId");

  const { data: indexJob } = usePoll(
    indexJobId ? `/api/index/${indexJobId}` : null,
    { enabled: !!indexJobId }
  );

  if (indexJobId && (!indexJob || indexJob.status === "pending")) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mb-4" />
        <h2 className="text-lg font-medium">Indexing {fullName}...</h2>
        <p className="text-neutral-400 text-sm mt-1">Fetching files, chunking, and embedding.</p>
      </div>
    );
  }

  if (indexJob?.status === "failed") {
    return <div className="p-8 text-red-400">Indexing failed: {indexJob.error}</div>;
  }

  return <ChatWindow repo={fullName} />;
}