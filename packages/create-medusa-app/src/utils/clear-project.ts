import fs from "fs"
import glob from "glob"
import path from "path"

export function clearProject(directory: string) {
  const adminFiles = glob.sync(path.join(directory, `src`, `admin/**/*`))
  const onboardingFiles = glob.sync(
    path.join(directory, `src`, `**/onboarding/`)
  )
  const typeFiles = glob.sync(path.join(directory, `src`, `types`))
  const srcFiles = glob.sync(
    path.join(directory, `src`, `**/*.{ts,tsx,js,jsx}`)
  )

  const files = [...adminFiles, ...onboardingFiles, ...typeFiles, ...srcFiles]

  files.forEach((file) =>
    fs.rmSync(file, {
      recursive: true,
      force: true,
    })
  )
  // add empty typescript file to avoid build errors
  fs.openSync(path.join(directory, "src", "index.ts"), "w")
}
