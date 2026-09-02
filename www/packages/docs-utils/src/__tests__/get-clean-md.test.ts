import { describe, expect, it } from "vitest"
import { getCleanMd } from "../get-clean-md.js"
import { globalConfig } from "../global-config.js"

const clean = (content: string) =>
  getCleanMd({
    file: content,
    type: "content",
  })

describe("getCleanMd", () => {
  describe("MDX expressions", () => {
    it("resolves expressions referencing the docs config", async () => {
      const md = await clean(
        `Medusa's current version is v{config.version.number}.`
      )

      expect(md.trim()).toBe(
        `Medusa's current version is v${globalConfig.version!.number}.`
      )
    })

    it("resolves expressions referencing constants exported by the page", async () => {
      const md = await clean(
        [
          "export const releaseNoteText = `Read the [Release Notes](${config.version.releaseUrl}).`",
          "",
          "{releaseNoteText}",
        ].join("\n")
      )

      expect(md.trim()).toBe(
        `Read the [Release Notes](${globalConfig.version!.releaseUrl}).`
      )
    })

    it("resolves constants declared after their usage", async () => {
      const md = await clean(
        ["Hello {name}!", "", 'export const name = "World"'].join("\n")
      )

      expect(md.trim()).toBe("Hello World!")
    })

    it("resolves values passed through the scope option", async () => {
      const withScope = await getCleanMd({
        file: `The answer is {custom.answer}.`,
        type: "content",
        scope: { custom: { answer: 42 } },
      })

      expect(withScope.trim()).toBe("The answer is 42.")
    })

    it("removes expressions that can't be resolved instead of leaking them", async () => {
      const md = await clean(`Version {someUnknownVariable} here.`)

      expect(md).not.toContain("someUnknownVariable")
      expect(md).not.toContain("{")
    })

    it("removes MDX comments", async () => {
      const md = await clean(["{/* a comment */}", "", "Content."].join("\n"))

      expect(md.trim()).toBe("Content.")
    })

    it("resolves the page title in the main heading", async () => {
      const md = await clean(
        [
          "export const metadata = {",
          "  title: `${pageNumber} Updating Medusa`,",
          "}",
          "",
          "# {metadata.title}",
        ].join("\n")
      )

      expect(md.trim()).toBe("# Updating Medusa")
    })
  })

  describe("code block meta", () => {
    it("removes UI-only meta from code blocks", async () => {
      const md = await clean(
        ["```bash npx2yarn", "npx medusa -v", "```"].join("\n")
      )

      expect(md.trim()).toBe(["```bash", "npx medusa -v", "```"].join("\n"))
    })

    it("keeps the title meta", async () => {
      const md = await clean(
        [
          '```ts title="src/jobs/hello-world.ts" highlights={highlights}',
          "const a = 1",
          "```",
        ].join("\n")
      )

      expect(md.trim()).toBe(
        ['```ts title="src/jobs/hello-world.ts"', "const a = 1", "```"].join(
          "\n"
        )
      )
    })
  })
})
