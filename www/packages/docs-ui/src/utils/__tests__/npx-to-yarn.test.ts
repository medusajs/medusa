import { describe, it, expect } from "vitest"
import { npxToYarn } from "../npx-to-yarn.js"

describe("npxToYarn", () => {
  describe("yarn conversion", () => {
    it("should convert basic npx command to yarn", () => {
      const result = npxToYarn("npx medusa db:migrate", "yarn")
      expect(result).toBe("yarn medusa db:migrate")
    })

    it("should convert npx command with multiple arguments", () => {
      const result = npxToYarn("npx medusa develop --port 9000", "yarn")
      expect(result).toBe("yarn medusa develop --port 9000")
    })

    it("should convert npx command with flags", () => {
      const result = npxToYarn("npx medusa user --email admin@test.com", "yarn")
      expect(result).toBe("yarn medusa user --email admin@test.com")
    })

    it("should handle npx command with leading/trailing whitespace", () => {
      const result = npxToYarn("  npx medusa db:migrate  ", "yarn")
      expect(result).toBe("yarn medusa db:migrate")
    })

    it("should convert npx command to yarn dlx when isExecutable is true", () => {
      const result = npxToYarn("npx create-medusa-app@latest", "yarn", true)
      expect(result).toBe("yarn dlx create-medusa-app@latest")
    })

    it("should convert npx command to yarn when isExecutable is false", () => {
      const result = npxToYarn("npx medusa db:migrate", "yarn", false)
      expect(result).toBe("yarn medusa db:migrate")
    })
  })

  describe("pnpm conversion", () => {
    it("should convert basic npx command to pnpm", () => {
      const result = npxToYarn("npx medusa db:migrate", "pnpm")
      expect(result).toBe("pnpm medusa db:migrate")
    })

    it("should convert npx command with multiple arguments", () => {
      const result = npxToYarn("npx medusa develop --port 9000", "pnpm")
      expect(result).toBe("pnpm medusa develop --port 9000")
    })

    it("should convert npx command with flags", () => {
      const result = npxToYarn("npx medusa user --email admin@test.com", "pnpm")
      expect(result).toBe("pnpm medusa user --email admin@test.com")
    })

    it("should handle npx command with leading/trailing whitespace", () => {
      const result = npxToYarn("  npx medusa db:migrate  ", "pnpm")
      expect(result).toBe("pnpm medusa db:migrate")
    })

    it("should convert npx command to pnpm dlx when isExecutable is true", () => {
      const result = npxToYarn("npx create-medusa-app@latest", "pnpm", true)
      expect(result).toBe("pnpm dlx create-medusa-app@latest")
    })

    it("should convert npx command to pnpm when isExecutable is false", () => {
      const result = npxToYarn("npx medusa db:migrate", "pnpm", false)
      expect(result).toBe("pnpm medusa db:migrate")
    })
  })

  describe("edge cases", () => {
    it("should return original command if it does not start with npx", () => {
      const result = npxToYarn("npm install medusa", "yarn")
      expect(result).toBe("npm install medusa")
    })

    it("should handle command with only npx and package name", () => {
      const result = npxToYarn("npx medusa", "yarn")
      expect(result).toBe("yarn medusa")
    })

    it("should preserve command structure with special characters", () => {
      const result = npxToYarn("npx medusa db:seed --file=./data.json", "pnpm")
      expect(result).toBe("pnpm medusa db:seed --file=./data.json")
    })

    it("should handle command with path separators", () => {
      const result = npxToYarn("npx @medusajs/medusa-cli develop", "yarn")
      expect(result).toBe("yarn @medusajs/medusa-cli develop")
    })

    it("should handle multi-line commands with backslash continuation", () => {
      const multiLineCommand = `npx create-medusa-app@latest \\
  --db-url postgres://localhost/medusa \\
  --skip-db`
      const result = npxToYarn(multiLineCommand, "yarn", true)
      expect(result).toBe(`yarn dlx create-medusa-app@latest \\
  --db-url postgres://localhost/medusa \\
  --skip-db`)
    })

    it("should handle multi-line commands for pnpm", () => {
      const multiLineCommand = `npx medusa develop \\
  --port 9000 \\
  --verbose`
      const result = npxToYarn(multiLineCommand, "pnpm")
      expect(result).toBe(`pnpm medusa develop \\
  --port 9000 \\
  --verbose`)
    })

    it("should handle commands with newlines", () => {
      const commandWithNewlines = "npx create-medusa-app@latest\n  --db-url postgres://localhost/medusa"
      const result = npxToYarn(commandWithNewlines, "yarn", true)
      expect(result).toBe("yarn dlx create-medusa-app@latest\n  --db-url postgres://localhost/medusa")
    })

    it("should convert multiple npx commands on separate lines for yarn", () => {
      const multipleCommands = `npx medusa db:migrate
npx medusa develop`
      const result = npxToYarn(multipleCommands, "yarn")
      expect(result).toBe(`yarn medusa db:migrate
yarn medusa develop`)
    })

    it("should convert multiple npx commands on separate lines for pnpm", () => {
      const multipleCommands = `npx medusa db:migrate
npx medusa user --email admin@test.com
npx medusa develop --port 9000`
      const result = npxToYarn(multipleCommands, "pnpm")
      expect(result).toBe(`pnpm medusa db:migrate
pnpm medusa user --email admin@test.com
pnpm medusa develop --port 9000`)
    })

    it("should convert multiple npx commands with executable flag", () => {
      const multipleCommands = `npx create-medusa-app@latest
npx @medusajs/medusa-cli init`
      const result = npxToYarn(multipleCommands, "yarn", true)
      expect(result).toBe(`yarn dlx create-medusa-app@latest
yarn dlx @medusajs/medusa-cli init`)
    })

    it("should preserve indentation when converting multiple commands", () => {
      const indentedCommands = `npx medusa db:migrate
  npx medusa develop
    npx medusa user`
      const result = npxToYarn(indentedCommands, "pnpm")
      expect(result).toBe(`pnpm medusa db:migrate
  pnpm medusa develop
    pnpm medusa user`)
    })

    it("should handle mixed npx and non-npx lines", () => {
      const mixedCommands = `npx medusa db:migrate
echo "Migration complete"
npx medusa develop`
      const result = npxToYarn(mixedCommands, "yarn")
      expect(result).toBe(`yarn medusa db:migrate
echo "Migration complete"
yarn medusa develop`)
    })
  })
})
