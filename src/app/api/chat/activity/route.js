import { getBackendAuthHeaders } from "@/lib/backend";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  const authHeaders = await getBackendAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/chat/activity`, {
    headers: { "Content-Type": "application/json", ...authHeaders },
    cache: "no-store",
  });
  return Response.json(await res.json(), { status: res.status });
}