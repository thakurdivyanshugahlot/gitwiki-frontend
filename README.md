# GitWiki Frontend

This is the Next.js frontend for GitWiki. It uses Clerk for authentication, displays the connected repositories and chat interface, and proxies authenticated API calls to the backend Express server.

## What this app does

- Authenticates users with Clerk
- Lists repositories from the backend
- Starts repository indexing jobs
- Polls status for indexing and chat jobs
- Lets users ask questions about an indexed repo
- Displays markdown answers and source file references

## Stack

- Next.js 16
- React 19
- Clerk for auth
- Tailwind CSS
- Lucide icons
- React Markdown

## Prerequisites

- Node.js 18+
- npm
- A running GitWiki backend on http://localhost:8000
- Clerk publishable key and secret key

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

```bash
copy .env.example .env.local
```

3. Update the values in `.env.local`.

4. Start the Next.js dev server:

```bash
npm run dev
```

The app runs at:

- http://localhost:3000

## Environment variables

This app supports the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
BACKEND_URL="http://localhost:8000"
```

Notes:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is required for the frontend Clerk provider.
- `CLERK_SECRET_KEY` is required on the server for Clerk-protected routes and API helpers.
- `BACKEND_URL` points the frontend API handlers at the Python/Express backend. It defaults to `http://localhost:8000` when not set.

## Important app behavior

- The frontend route middleware protects all non-public routes using Clerk.
- Public routes are limited to sign-in and sign-up screens.
- The app calls the backend in server-side API handlers located under `src/app/api`.
- GitHub OAuth access tokens are fetched from Clerk for repository access.

## Routes

The main UI routes include:

- `/` - overview page
- `/sign-in` and `/sign-up` - Clerk auth pages
- `/repos` - repository list
- `/repos/[repoId]` - repo detail and indexing UI
- `/repos/[repoId]/chat` - chat interface
- `/profile` - Clerk user profile
- `/settings` - user settings and GitHub connection status

## Development notes

- The frontend does not directly call Pinecone, OpenAI, or Prisma.
- All heavy work is delegated to the backend service.
- The local app expects the backend to be started before repo indexing or chat requests are attempted.

## Security

Keep `.env.local` out of version control. Use `.env.local.example` as a safe, reusable template for local development.
