"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Check, Copy, FileCode2, LoaderCircle, Sparkles } from "lucide-react";
import Markdown from "./Markdown";
import { sendChatQuestion, getChatJob, getChatHistory } from "@/lib/apiClient";

export default function ChatWindow({ repo }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getChatHistory(repo).then((history) => {
      if (!cancelled) {
        setMessages(history.map((m) => ({ role: m.role, content: m.content, sources: m.sources })));
      }
    });
    return () => { cancelled = true; };
  }, [repo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function sendQuestion(question) {
    // Add the user's message AND an empty "thinking" placeholder immediately —
    // this no longer waits on any answer content existing.
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: "", streaming: true },
    ]);
    setSending(true);
    setError(null);

    try {
      const { jobId } = await sendChatQuestion(repo, question);
      pollAnswer(jobId);
    } catch (err) {
      setSending(false);
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1)); // drop the placeholder on immediate failure
    }
  }

  async function pollAnswer(jobId, attempt = 0) {
  let job;
  try {
    job = await getChatJob(jobId);
  } catch (err) {
    if (attempt >= 20) {
      setSending(false);
      setMessages((prev) => {
        const withoutPlaceholder = prev[prev.length - 1]?.streaming ? prev.slice(0, -1) : prev;
        return [...withoutPlaceholder, { role: "assistant", content: `Something went wrong: ${err.message}` }];
      });
      return;
    }
    setTimeout(() => pollAnswer(jobId, attempt + 1), 1000);
    return;
  }

  if (job.status === "pending") {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant" && last.streaming) {
        return [...prev.slice(0, -1), { ...last, content: job.answer || "" }];
      }
      return prev;
    });
    setTimeout(() => pollAnswer(jobId, 0), 1000);
    return;
  }

  setSending(false);
  setMessages((prev) => {
    const withoutPlaceholder = prev[prev.length - 1]?.streaming ? prev.slice(0, -1) : prev;
    if (job.status !== "completed") {
      return [...withoutPlaceholder, { role: "assistant", content: `Something went wrong: ${job.error || "unknown error"}` }];
    }
    return [...withoutPlaceholder, { role: "assistant", content: job.answer, sources: job.sources }];
  });
}

  async function copyMessage(index, content) {
    await navigator.clipboard.writeText(content);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    sendQuestion(input.trim());
    setInput("");
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      <header className="border-b border-border bg-surface-raised/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <Sparkles size={14} /> Repository intelligence
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-text-primary">Ask {repo}</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-text-muted sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Indexed context
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {messages.length === 0 && (
            <div className="flex min-h-[55%] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-soft-border bg-accent-soft text-accent">
                <Bot size={27} />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary">What should we uncover?</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-text-faint">
                Ask about architecture, implementation details, or where to make your next change.
              </p>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[min(80%,680px)] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm leading-6 text-surface">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="group flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Bot size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  {m.content ? (
                    <Markdown content={m.content} />
                  ) : (
                    m.streaming && (
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <LoaderCircle className="animate-spin text-accent" size={15} />
                        Thinking…
                      </div>
                    )
                  )}
                  {m.streaming && m.content && (
                    <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-accent align-middle" />
                  )}

                  {m.content && !m.streaming && (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => copyMessage(i, m.content)}
                        className="flex items-center gap-1 text-xs text-text-ghost opacity-0 transition group-hover:opacity-100 hover:text-text-secondary"
                      >
                        {copied === i ? <Check size={13} /> : <Copy size={13} />} {copied === i ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}

                  {m.sources?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.sources.map((src) => (
                        <span
                          key={src}
                          className="flex items-center gap-1 rounded-md border border-border bg-white/[0.03] px-2 py-1 text-[11px] text-text-muted"
                        >
                          <FileCode2 size={11} /> {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-surface-raised px-4 py-4 sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-border bg-white/[0.04] p-2 shadow-2xl shadow-black/20 focus-within:border-accent-soft-border">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this repository..."
            className="min-h-11 flex-1 bg-transparent px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-ghost"
          />
          <button
            type="submit"
            disabled={sending}
            aria-label="Send question"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? <LoaderCircle className="animate-spin" size={18} /> : <ArrowUp size={18} />}
          </button>
        </form>
        {error && <p className="mx-auto mt-2 max-w-4xl text-xs text-danger">{error}</p>}
        <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-text-ghost">
          Answers are grounded in the indexed source files.
        </p>
      </div>
    </div>
  );
}