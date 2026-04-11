#!/usr/bin/env node

import { chmod, copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(__dirname, "hooks");
const targetDir = path.join(repoRoot, ".git", "hooks");

async function main() {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const hooks = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

  if (hooks.length === 0) {
    console.log("[hooks:install] No hooks found under scripts/hooks");
    return;
  }

  await mkdir(targetDir, { recursive: true });

  for (const hookName of hooks) {
    const sourcePath = path.join(sourceDir, hookName);
    const targetPath = path.join(targetDir, hookName);

    await copyFile(sourcePath, targetPath);
    await chmod(targetPath, 0o755);
    console.log(`[hooks:install] Installed ${hookName}`);
  }
}

main().catch((error) => {
  console.error("[hooks:install] Failed:", error.message);
  process.exit(1);
});
