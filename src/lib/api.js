import "server-only";
import { getGithubToken } from "./getGithubToken";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

async function backendFetch(path, options = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export async function getRepos() {
  const token = await getGithubToken();
  return backendFetch("/api/repos", { headers: { "x-github-token": token } });
}

export async function startIndexing(repo, { force = false } = {}) {
  const githubToken = await getGithubToken();
  return backendFetch("/api/index", {
    method: "POST",
    body: JSON.stringify({ repo, githubToken, force }),
  });
}

export async function getIndexJob(jobId) {
  return backendFetch(`/api/index/${jobId}`);
}