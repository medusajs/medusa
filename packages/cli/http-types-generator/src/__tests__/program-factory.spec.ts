import fs from "fs"
import os from "os"
import path from "path"
import ts from "typescript"
import { Config } from "../config"
import { ProgramFactory } from "../core/program-factory"

describe("ProgramFactory", () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "http-types-program-"))
    jest.spyOn(process, "cwd").mockReturnValue(tmpDir)
    Config.load({})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Config.reset()
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it("reads a tsconfig that contains comments and trailing commas", () => {
    fs.writeFileSync(
      path.join(tmpDir, "tsconfig.json"),
      `{
  // line comment
  "compilerOptions": {
    /* block comment */
    "target": "ES2021",
    "strict": true,
  },
}
`
    )
    const file = path.join(tmpDir, "index.ts")
    fs.writeFileSync(file, "export const a = 1\n")

    const { program } = ProgramFactory.create([file])
    const options = program.getCompilerOptions()

    expect(options.strict).toBe(true)
    expect(options.target).toBe(ts.ScriptTarget.ES2021)
    expect(options.noEmit).toBe(true)
  })

  it("resolves a tsconfig that extends another tsconfig", () => {
    fs.writeFileSync(
      path.join(tmpDir, "tsconfig.base.json"),
      `{
  // base config
  "compilerOptions": { "strictNullChecks": true, },
}
`
    )
    fs.writeFileSync(
      path.join(tmpDir, "tsconfig.json"),
      `{ "extends": "./tsconfig.base.json", }\n`
    )
    const file = path.join(tmpDir, "index.ts")
    fs.writeFileSync(file, "export const a = 1\n")

    const { program } = ProgramFactory.create([file])

    expect(program.getCompilerOptions().strictNullChecks).toBe(true)
  })
})
