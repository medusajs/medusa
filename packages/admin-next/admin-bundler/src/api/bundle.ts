import { readFileSync } from "fs"
import glob from "glob"
import { relative, resolve } from "path"
import { build as command } from "vite"

type BundleArgs = {
  root?: string | undefined
  watch?: boolean | undefined
}

export async function bundle({ watch, root }: BundleArgs) {
  const resolvedRoot = root
    ? resolve(process.cwd(), root)
    : resolve(process.cwd(), "src", "admin")

  const files = glob.sync(`${resolvedRoot}/**/*.{ts,tsx,js,jsx}`)

  const input: Record<string, string> = {}
  for (const file of files) {
    const relativePath = relative(resolvedRoot, file)
    input[relativePath] = file
  }

  const packageJson = JSON.parse(
    readFileSync(resolve(process.cwd(), "package.json"), "utf-8")
  )
  const external = [
    ...Object.keys(packageJson.dependencies),
    "@medusajs/ui",
    "@medusajs/ui-preset",
    "react",
    "react-dom",
    "react-router-dom",
    "react-hook-form",
  ]

  await command({
    build: {
      watch: watch ? {} : undefined,
      rollupOptions: {
        input: input,
        external: external,
      },
    },
  })
}
