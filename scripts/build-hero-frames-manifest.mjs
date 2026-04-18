import { readdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const HERO_FRAMES_ROOT = join(process.cwd(), "public", "hero-frames");
const VALID_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

function extractNumber(filename) {
  const match = filename.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
}

function buildManifestForBrand(brandDirectoryName) {
  const brandDirectory = join(HERO_FRAMES_ROOT, brandDirectoryName);
  const outputManifestFile = join(brandDirectory, "manifest.json");

  const frameFiles = readdirSync(brandDirectory)
    .filter((file) => VALID_EXTENSIONS.has(extname(file).toLowerCase()))
    .filter((file) => !file.toLowerCase().startsWith("cover."))
    .sort((a, b) => {
      const numberA = extractNumber(a);
      const numberB = extractNumber(b);

      if (numberA !== numberB) {
        return numberA - numberB;
      }

      return a.localeCompare(b);
    })
    .map((file) => `/hero-frames/${brandDirectoryName}/${file}`);

  writeFileSync(outputManifestFile, `${JSON.stringify(frameFiles, null, 2)}\n`, "utf8");

  return {
    brand: brandDirectoryName,
    outputManifestFile,
    frameCount: frameFiles.length
  };
}

function main() {
  try {
    const targetBrand = process.argv[2];
    const brandFolders = targetBrand
      ? [targetBrand]
      : readdirSync(HERO_FRAMES_ROOT, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name);

    const results = brandFolders.map(buildManifestForBrand);

    for (const result of results) {
      console.log(
        `✓ ${result.brand}: ${result.frameCount} frames -> ${result.outputManifestFile}`
      );
    }
  } catch (error) {
    console.error("✗ Failed to build hero manifests", error);
    process.exit(1);
  }
}

main();
