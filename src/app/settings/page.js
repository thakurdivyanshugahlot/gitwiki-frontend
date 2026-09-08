import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { getGithubToken } from "@/lib/getGithubToken";
import { LogOut, CheckCircle2, AlertCircle } from "lucide-react";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

export default async function SettingsPage() {
  const user = await currentUser();

  let githubConnected = true;
  try {
    await getGithubToken();
  } catch {
    githubConnected = false;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-text-primary">Settings</h1>

      <div className="surface-card mb-4 p-5">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">Account</h2>
        <div className="flex items-center gap-3">
          <img src={user?.imageUrl} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <p className="text-sm font-medium text-text-primary">{user?.fullName || "Unnamed"}</p>
            <p className="text-xs text-text-faint">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card mb-4 p-5">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">GitHub connection</h2>
        <div className="flex items-center gap-2 text-sm">
          <GithubIcon className="text-text-secondary" />
          {githubConnected ? (
            <span className="flex items-center gap-1.5 text-accent">
              <CheckCircle2 size={14} /> Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-danger">
              <AlertCircle size={14} /> Not connected — reconnect from your profile
            </span>
          )}
        </div>
        {!githubConnected && (
          <a href="/profile" className="mt-3 inline-block text-xs text-accent underline underline-offset-2">
            Go to Profile → Connected accounts
          </a>
        )}
      </div>

      <div className="surface-card p-5">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-text-muted">Session</h2>
        <SignOutButton redirectUrl="/sign-in">
          <button className="btn-secondary flex items-center gap-2">
            <LogOut size={15} /> Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}