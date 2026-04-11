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

function getCommitSubjects(range) {
  const args = range
    ? ["log", range, "--pretty=format:%s"]
    : ["log", "--pretty=format:%s"];

  const output = runGit(args);
  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildContent({ timestamp, branch, rangeLabel, commits }) {
  const bulletList = commits.length
    ? commits.map((subject) => `- ${subject}`).join("\n")
    : "- No commits found in selected range";

  return [
    "# Pending Release Declaration",
    "",
    `Generated at: ${timestamp}`,
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
  const commits = getCommitSubjects(range);
  const timestamp = new Date().toISOString();
  const content = buildContent({ timestamp, branch, rangeLabel, commits });

  await mkdir(releasesDir, { recursive: true });
  await writeFile(outputFile, content, "utf8");

  console.log(`[release:declare] Wrote ${path.relative(repoRoot, outputFile)}`);
}

main().catch((error) => {
  console.error("[release:declare] Failed:", error.message);
  process.exit(1);
});
