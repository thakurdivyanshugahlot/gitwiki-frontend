async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export function startIndexing(repo, { force = false } = {}) {
  return apiFetch("/api/index", {
    method: "POST",
    body: JSON.stringify({ repo, force }),
  });
}

export function getIndexJob(jobId) {
  return apiFetch(`/api/index/${jobId}`);
}

export function sendChatQuestion(repo, question) {
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ repo, question }),
  });
}

export function getChatJob(jobId) {
  return apiFetch(`/api/chat/${jobId}`);
}

export function getChatHistory(repo) {
  return apiFetch(`/api/chat/history?repo=${encodeURIComponent(repo)}`);
}
export function getActivity() {
  return apiFetch("/api/chat/activity");
}

export function clearHistory(repo) {
  return apiFetch(`/api/chat/history?repo=${encodeURIComponent(repo)}`, { method: "DELETE" });
}