import { auth } from "@clerk/nextjs/server";

export async function getBackendAuthHeaders() {
  const { getToken } = await auth();
  const token = await getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}