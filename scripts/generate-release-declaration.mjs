#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const releasesDir = path.join(repoRoot, "releases");
const outputFile = path.join(releasesDir, "pending-release.md");

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    return null;
  }

  return (result.stdout || "").trim();
}

function getBranch() {
  return runGit(["rev-parse", "--abbrev-ref", "HEAD"]) || "unknown";
}

function getLastTag() {
  return runGit(["describe", "--tags", "--abbrev=0"]);
}

function getCommits(range) {
  const args = range
    ? ["log", range, "--pretty=format:%H%x1f%cI%x1f%s"]
    : ["log", "--pretty=format:%H%x1f%cI%x1f%s"];

  const output = runGit(args);
  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, committedAt, subject] = line.split("\x1f");
      return { hash, committedAt, subject };
    })
    .filter((commit) => commit.hash && commit.committedAt && commit.subject);
}

const IGNORED_SUBJECTS = new Set(["chore: update release declaration"]);

function buildContent({ snapshotFrom, branch, rangeLabel, commits }) {
  const bulletList = commits.length
    ? commits.map((commit) => `- ${commit.subject}`).join("\n")
    : "- No release-relevant commits found in selected range";

  return [
    "# Pending Release Declaration",
    "",
    `Snapshot from: ${snapshotFrom}`,
    `Branch: ${branch}`,
    `Commit range: ${rangeLabel}`,
    "",
    "## Commit Subjects",
    bulletList,
    "",
  ].join("\n");
}

async function main() {
  const branch = getBranch();
  const lastTag = getLastTag();
  const range = lastTag ? `${lastTag}..HEAD` : null;
  const rangeLabel = range || "all commits (no tags found)";
  const commits = getCommits(range).filter(
    (commit) => !IGNORED_SUBJECTS.has(commit.subject),
  );
  const snapshotFrom = commits[0]?.committedAt || rangeLabel;
  const content = buildContent({ snapshotFrom, branch, rangeLabel, commits });

  await mkdir(releasesDir, { recursive: true });
  await writeFile(outputFile, content, "utf8");

  console.log(`[release:declare] Wrote ${path.relative(repoRoot, outputFile)}`);
}

main().catch((error) => {
  console.error("[release:declare] Failed:", error.message);
  process.exit(1);
});
