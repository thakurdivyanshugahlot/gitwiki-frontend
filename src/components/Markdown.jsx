"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

function CodeBlock({ children }) {
  const codeProps = children?.props ?? {};
  const raw = String(codeProps.children ?? "").replace(/\n$/, "");
  const match = /language-(\w+)/.exec(codeProps.className || "");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[11px] uppercase tracking-wide text-neutral-500">
          {match?.[1] || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-6 text-neutral-200">
        <code>{raw}</code>
      </pre>
    </div>
  );
}

const components = {
  p: ({ children }) => <p className="mb-3 leading-6 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1.5 marker:text-emerald-400 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-6">{children}</li>,
  h1: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold text-white first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold text-white first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-1.5 mt-3 text-sm font-semibold text-white first:mt-0">{children}</h4>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-emerald-400/40 pl-3 text-neutral-400">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-emerald-300">{children}</code>
  ),
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-white/10 bg-white/5 px-3 py-2 font-medium text-neutral-300">{children}</th>,
  td: ({ children }) => <td className="border-b border-white/5 px-3 py-2 text-neutral-300">{children}</td>,
};

export default function Markdown({ content }) {
  return (
    <div className="text-sm text-neutral-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}