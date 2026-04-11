#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packageJsonPath = path.join(repoRoot, "package.json");
const declarationPath = path.join(repoRoot, "releases", "pending-release.md");
const [remoteName = "origin"] = process.argv.slice(2);

function fail(message) {
  console.error(`[release:publish] ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
    ...options,
  });

  const stdout = (result.stdout || "").trim();
  const stderr = (result.stderr || "").trim();

  if (result.error) {
    return { ok: false, status: -1, stdout, stderr: result.error.message };
  }

  return { ok: result.status === 0, status: result.status ?? -1, stdout, stderr };
}

function requireCommand(command) {
  const check = run(command, ["--version"]);
  if (!check.ok) {
    fail(`Missing required command '${command}'. Install it and retry.`);
  }
}

function isSemver(version) {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(
    version,
  );
}

async function getPackageVersion() {
  const raw = await readFile(packageJsonPath, "utf8");
  const parsed = JSON.parse(raw);
  const version = String(parsed.version || "").trim();

  if (!version) {
    fail("package.json must include a non-empty version.");
  }

  if (!isSemver(version)) {
    fail(`package.json version '${version}' is not valid semantic versioning.`);
  }

  return version;
}

async function ensureReleaseNotes() {
  const notes = await readFile(declarationPath, "utf8");
  if (!notes.trim()) {
    fail("releases/pending-release.md is empty. Run release:declare first.");
  }
}

function assertRemoteTagDoesNotExist(tag) {
  const remoteTag = run("git", [
    "ls-remote",
    "--tags",
    "--refs",
    remoteName,
    `refs/tags/${tag}`,
  ]);

  if (!remoteTag.ok) {
    fail(
      `Unable to verify remote tag on '${remoteName}': ${remoteTag.stderr || "unknown error"}`,
    );
  }

  if (remoteTag.stdout) {
    fail(
      `Tag '${tag}' already exists on remote '${remoteName}'. Bump package.json version before pushing.`,
    );
  }
}

function assertReleaseDoesNotExist(tag) {
  const release = run("gh", ["release", "view", tag]);

  if (release.ok) {
    fail(
      `GitHub release '${tag}' already exists. Bump package.json version before pushing.`,
    );
  }

  const stderr = release.stderr.toLowerCase();
  const notFound =
    stderr.includes("not found") ||
    stderr.includes("could not find") ||
    stderr.includes("http 404");

  if (!notFound) {
    fail(`Unable to verify if release '${tag}' exists: ${release.stderr || "unknown error"}`);
  }
}

function ensureLocalTag(tag) {
  const head = run("git", ["rev-parse", "HEAD"]);
  if (!head.ok || !head.stdout) {
    fail("Unable to resolve HEAD commit.");
  }

  const existingTag = run("git", ["rev-parse", "--verify", `refs/tags/${tag}`]);

  if (existingTag.ok) {
    const taggedCommit = run("git", ["rev-list", "-n", "1", tag]);
    if (!taggedCommit.ok || !taggedCommit.stdout) {
      fail(`Unable to resolve commit for existing local tag '${tag}'.`);
    }

    if (taggedCommit.stdout !== head.stdout) {
      fail(
        `Local tag '${tag}' exists but does not point to HEAD. Align the tag manually or bump version.`,
      );
    }

    console.log(`[release:publish] Reusing existing local tag ${tag}`);
    return;
  }

  const createTag = run("git", ["tag", "-a", tag, "-m", `Release ${tag}`]);
  if (!createTag.ok) {
    fail(`Failed to create local tag '${tag}': ${createTag.stderr || "unknown error"}`);
  }

  console.log(`[release:publish] Created local tag ${tag}`);
}

function pushTagToRemote(tag) {
  const pushResult = run(
    "git",
    ["push", remoteName, `refs/tags/${tag}:refs/tags/${tag}`],
    {
      env: {
        ...process.env,
        UNIFICADORA_INTERNAL_TAG_PUSH: "1",
      },
    },
  );

  if (!pushResult.ok) {
    fail(
      `Failed pushing tag '${tag}' to '${remoteName}': ${pushResult.stderr || "unknown error"}`,
    );
  }

  console.log(`[release:publish] Pushed tag ${tag} to ${remoteName}`);
}

function createGithubRelease(tag) {
  const createRelease = run("gh", [
    "release",
    "create",
    tag,
    "--title",
    tag,
    "--notes-file",
    "releases/pending-release.md",
    "--verify-tag",
  ]);

  if (!createRelease.ok) {
    fail(`Failed creating GitHub release '${tag}': ${createRelease.stderr || "unknown error"}`);
  }

  console.log(`[release:publish] Published GitHub release ${tag}`);
}

async function main() {
  requireCommand("git");
  requireCommand("gh");

  const version = await getPackageVersion();
  const tag = `v${version}`;

  await ensureReleaseNotes();
  assertRemoteTagDoesNotExist(tag);
  assertReleaseDoesNotExist(tag);
  ensureLocalTag(tag);
  pushTagToRemote(tag);
  createGithubRelease(tag);
}

main().catch((error) => {
  fail(error.message);
});
