import { getBackendAuthHeaders } from "@/lib/backend";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request) {
  const repo = new URL(request.url).searchParams.get("repo");
  const authHeaders = await getBackendAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/chat/history?repo=${encodeURIComponent(repo)}`, {
    headers: { "Content-Type": "application/json", ...authHeaders },
    cache: "no-store",
  });
  return Response.json(await res.json(), { status: res.status });
}

export async function DELETE(request) {
  const repo = new URL(request.url).searchParams.get("repo");
  const authHeaders = await getBackendAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/chat/history?repo=${encodeURIComponent(repo)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders },
    cache: "no-store",
  });
  return Response.json(await res.json(), { status: res.status });
}