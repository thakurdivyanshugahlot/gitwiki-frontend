export function decodeRepoId(repoId) {
  const [owner, repo] = repoId.split("--");
  return { owner, repo, fullName: `${owner}/${repo}` };
}