#!/usr/bin/env node

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const engramPath = path.join(repoRoot, ".engram");

const args = new Set(process.argv.slice(2));
const shouldStage = args.has("--stage") || args.has("--commit") || args.size === 0;
const shouldCommit = args.has("--commit");

function runGit(commandArgs, options = {}) {
  const result = spawnSync("git", commandArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    env: options.env ? { ...process.env, ...options.env } : process.env,
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    throw new Error(stderr || `git ${commandArgs.join(" ")} failed`);
  }

  return (result.stdout || "").trim();
}

function hasEngramChanges() {
  const result = spawnSync("git", ["status", "--porcelain", "--", ".engram"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    return false;
  }

  return result.stdout.trim().length > 0;
}

function main() {
  if (!existsSync(engramPath)) {
    console.log("[sync-engram] .engram not found, nothing to sync");
    return;
  }

  if (shouldStage) {
    runGit(["add", "-f", "-A", ".engram"]);
    console.log("[sync-engram] Staged .engram updates");
  }

  if (!shouldCommit) {
    return;
  }

  if (!hasEngramChanges()) {
    console.log("[sync-engram] No .engram changes to commit");
    return;
  }

  runGit(["commit", "-m", "chore(engram): sync memory artifacts"], {
    env: { ENGRAM_POST_COMMIT_AUTOCOMMIT: "1" },
  });

  console.log("[sync-engram] Created .engram sync commit");
}

try {
  main();
} catch (error) {
  console.error("[sync-engram] Failed:", error.message);
  process.exit(1);
}
