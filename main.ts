// Statistik Nusantara — hand-in program (Node 22, standard library only).
//
// The site lives in app/ beside this file as plain static files, and its
// screenshots in screenshots/. This program hands both in: it copies them
// into the hand-in directory and writes the dossier.json the judge reads,
// built by the vendored make.fun library so the bytes match what the
// scorer builds from the same files.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR set:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader the directory is /output, the repository is read-only, and
// there is no network. The program writes only inside the hand-in
// directory, uses no clock or randomness, and exits 0.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The scorer's own caps (see the competition's RULES.txt): only the text
// cap shapes the dossier's bytes; the others refuse an entry the scorer
// would refuse — more than 4 screenshots or one over 256 KiB, more than
// 993 files and directories in app/ or 16 MiB of app files.
const DOSSIER_TEXT_MAX_BYTES = 163840;
const SCREENSHOT_MAX_COUNT = 4;
const SCREENSHOT_MAX_BYTES = 262144;
const APP_MAX_FILES = 993;
const APP_MAX_BYTES = 16777216;

function repositoryRoot(): string {
  return fileURLToPath(new URL(".", import.meta.url));
}

function handInDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function copyTree(source: string, target: string): void {
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

function handIn(): void {
  const root = repositoryRoot();
  const out = handInDir();

  mkdirSync(out, { recursive: true });
  copyTree(join(root, "app"), join(out, "app"));
  if (existsSync(join(root, "screenshots"))) {
    copyTree(join(root, "screenshots"), join(out, "screenshots"));
  }

  writeFileSync(
    join(out, "dossier.json"),
    buildDossier(out, {
      text_max_bytes: DOSSIER_TEXT_MAX_BYTES,
      screenshots: { max: SCREENSHOT_MAX_COUNT, max_bytes: SCREENSHOT_MAX_BYTES },
      app_max_files: APP_MAX_FILES,
      app_max_bytes: APP_MAX_BYTES,
    }),
  );
}

handIn();
