import fs from "fs";
import path from "path";

let hasLoadedEnv = false;

export function ensureEnvironmentLoaded() {
  if (hasLoadedEnv) return;
  hasLoadedEnv = true;

  const candidates = [".env.local", ".env.production", ".env"];
  for (const file of candidates) {
    try {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            let val = trimmed.slice(idx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key] && val) {
              process.env[key] = val;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }
}
