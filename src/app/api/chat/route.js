import { getBackendAuthHeaders } from "@/lib/backend";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request) {
  const { repo, question } = await request.json();
  const authHeaders = await getBackendAuthHeaders();

  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ repo, question }),
  });

  return Response.json(await res.json(), { status: res.status });
}