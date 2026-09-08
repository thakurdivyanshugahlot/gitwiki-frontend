import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getGithubToken() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const client = await clerkClient();
  const response = await client.users.getUserOauthAccessToken(userId, "github");
  const token = response.data?.[0]?.token;

  if (!token) throw new Error("GitHub account not connected");
  return token;
}