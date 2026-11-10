import path from "path"
import { afterEach, describe, expect, it, vi } from "vitest"

const PREFIX = "export const generatedEditDates = "

const gitOutputs: Record<string, string> = {
  "git ls-files --other --exclude-standard": "",
  "git diff --name-only":
    "www/apps/book/app/unstaged/page.mdx\nwww/apps/book/app/both/page.mdx\nwww/apps/resources/app/other/page.mdx\n",
  "git diff --name-only --staged":
    "www/apps/book/app/staged/page.mdx\nwww/apps/book/app/both/page.mdx\n",
}

const existingPages = [
  "app/unstaged/page.mdx",
  "app/staged/page.mdx",
  "app/both/page.mdx",
]

const setup = async (flavor: "posix" | "win32") => {
  vi.resetModules()

  const pathImpl = path[flavor]
  const cwd =
    flavor === "win32" ? "C:\\repo\\www\\apps\\book" : "/repo/www/apps/book"
  vi.spyOn(process, "cwd").mockReturnValue(cwd)

  const written: { content?: string } = {}

  const normalize = (p: string) => p.replace(/\\/g, "/")
  const fileExists = (p: string) => {
    const normalized = normalize(p)
    return (
      normalized.endsWith("generated/edit-dates.mjs") ||
      existingPages.some((page) => normalized.endsWith(page))
    )
  }

  vi.doMock("path", () => ({ default: pathImpl, ...pathImpl }))
  vi.doMock("child_process", () => ({
    // emulates a shell that only understands plain commands, like cmd.exe
    exec: (
      command: string,
      callback: (err: Error | null, res?: unknown) => void
    ) => {
      if (!(command in gitOutputs)) {
        callback(new Error(`'${command}' is not recognized as a command`))
        return
      }
      callback(null, { stdout: gitOutputs[command], stderr: "" })
    },
  }))
  vi.doMock("fs", () => ({ existsSync: fileExists }))
  vi.doMock("fs/promises", () => ({
    readdir: vi.fn(),
    readFile: async () => `${PREFIX}{}`,
    stat: async () => ({ mtime: new Date("2026-01-01T00:00:00.000Z") }),
    writeFile: async (_path: string, content: string) => {
      written.content = content
    },
  }))

  const { generateEditedDates } = await import("../generate-edited-dates.js")

  return { generateEditedDates, written }
}

describe("generateEditedDates", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.doUnmock("path")
    vi.doUnmock("child_process")
    vi.doUnmock("fs")
    vi.doUnmock("fs/promises")
  })

  it.each(["posix", "win32"] as const)(
    "should collect unstaged and staged changed pages of the project without shell-specific syntax (%s)",
    async (flavor) => {
      const { generateEditedDates, written } = await setup(flavor)

      await generateEditedDates()

      const editDates = JSON.parse(written.content!.replace(PREFIX, ""))
      expect(Object.keys(editDates).sort()).toEqual([
        "app/both/page.mdx",
        "app/staged/page.mdx",
        "app/unstaged/page.mdx",
      ])
    }
  )
})
