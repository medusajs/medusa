import { readFileSync } from "fs"
import { resolve } from "path"
import { describe, expect, it, vi } from "vitest"

vi.mock("vite", () => ({
  defineConfig: (config: unknown) => config,
  loadEnv: () => ({}),
}))
vi.mock("@medusajs/admin-vite-plugin", () => ({ default: () => ({}) }))
vi.mock("@vitejs/plugin-react", () => ({ default: () => ({}) }))
vi.mock("vite-plugin-inspect", () => ({ default: () => ({}) }))

const getDefine = async () => {
  const configPath = resolve(__dirname, "../../vite.config.mts")
  const { default: viteConfig } = await import(configPath)
  const config = await viteConfig({
    mode: "development",
    command: "serve",
  })
  return config.define as Record<string, string>
}

describe("dashboard vite config", () => {
  it("should define every build-time constant declared in vite-env.d.ts", async () => {
    const define = await getDefine()

    const envTypes = readFileSync(
      resolve(__dirname, "../vite-env.d.ts"),
      "utf-8"
    )
    const declared = [...envTypes.matchAll(/declare const (__\w+__)/g)].map(
      ([, name]) => name
    )

    expect(declared.length).toBeGreaterThan(0)
    expect(Object.keys(define)).toEqual(expect.arrayContaining(declared))
  })

  it("should default to session auth and a 1MB upload limit", async () => {
    const define = await getDefine()

    expect(define.__AUTH_TYPE__).toBe(JSON.stringify("session"))
    expect(define.__JWT_TOKEN_STORAGE_KEY__).toBe(JSON.stringify(""))
    expect(define.__MAX_UPLOAD_FILE_SIZE__).toBe(JSON.stringify(1024 * 1024))
  })
})
