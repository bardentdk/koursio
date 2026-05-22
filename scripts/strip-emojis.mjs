/**
 * Strip emojis from all source files.
 * Run: node scripts/strip-emojis.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src");

// Comprehensive emoji regex (covers all Unicode emoji ranges)
const EMOJI_REGEX = /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{2300}-\u{23FF}]|[\u{2B00}-\u{2BFF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]|[\u{FE0F}]|[\u{1F3FB}-\u{1F3FF}]/gu;

const EXT = [".tsx", ".ts", ".css"];
let fileCount = 0;
let totalChanges = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full);
    } else if (EXT.includes(extname(entry))) {
      const content = readFileSync(full, "utf-8");
      const cleaned = content.replace(EMOJI_REGEX, "");
      if (cleaned !== content) {
        // Clean up any orphan spaces left by emoji removal
        const final = cleaned
          .replace(/ +"/g, ' "')      // re-protect spaces before strings
          .replace(/"  +/g, '" ')     // normalize after string
          .replace(/(\S) {2,}(\S)/g, "$1 $2")  // collapse non-leading multi-spaces
          .replace(/ +$/gm, "")       // trailing spaces
          .replace(/\n\n\n+/g, "\n\n"); // triple newlines
        writeFileSync(full, final, "utf-8");
        fileCount++;
        const removed = (content.match(EMOJI_REGEX) || []).length;
        totalChanges += removed;
        console.log(`  ✓ ${full.replace(SRC, "src")} (${removed} emoji removed)`);
      }
    }
  }
}

console.log("Scanning src/ for emojis...\n");
walk(SRC);
console.log(`\nDone. ${totalChanges} emoji removed from ${fileCount} files.`);
