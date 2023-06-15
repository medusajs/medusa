import fs from "fs"
import path from "path"
import { globSync } from "glob"

export function clearProject (directory: string) {
  const files = globSync([
    path.join(directory, `src`, `admin/**/*`),
    path.join(directory, `src`, `**/onboarding/`),
    path.join(directory, `src`, `types`),
    path.join(directory, `src`, `**/*.{ts,tsx,js,jsx}`),
  ])
  files.forEach((file) =>
    fs.rmSync(file, {
      recursive: true,
      force: true,
    })
  )
  // add empty typescript file to avoid build errors
  fs.openSync(path.join(directory, "src", "index.ts"), "w")
}
