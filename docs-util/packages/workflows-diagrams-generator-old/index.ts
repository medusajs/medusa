#!/usr/bin/env node

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs"
import ts, { CompilerOptions } from "typescript"
import path from "path"
import { fileURLToPath } from "url"
import { Workflow } from "./utils/types"
import utils from "./utils/index.js"
import createDiagram from "./utils/create-diagram.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "www",
  "apps",
  "docs",
  "diagrams",
  "workflows"
)

const fileName = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "packages",
  "workflows",
  "src",
  "utils",
  "composer",
  "test.ts"
)
const tsconfigPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "packages",
  "workflows",
  "tsconfig.json"
)

const tsconfigOptions = (
  JSON.parse(readFileSync(tsconfigPath, "utf-8")) as {
    compilerOptions: CompilerOptions
  }
).compilerOptions

// remove unwanted fields
delete tsconfigOptions.moduleResolution

const sourceFile = ts.createSourceFile(
  fileName,
  readFileSync(fileName).toString(),
  tsconfigOptions.target || ts.ScriptTarget.ES2021,
  /*setParentNodes */ true
)

const program = ts.createProgram({
  rootNames: [sourceFile.fileName],
  options: tsconfigOptions,
})

// Get the checker, we will use it to find more about classes
const checker = program.getTypeChecker()

const workflows: Workflow[] = []

const { traverse } = utils({
  program,
  checker,
  workflows,
})

for (const sourceFile of program.getSourceFiles()) {
  if (sourceFile.isDeclarationFile) {
    continue
  }

  const variableSymbols = checker.getSymbolsInScope(
    sourceFile,
    ts.SymbolFlags.Variable
  )

  // TODO only check exported symbols
  variableSymbols.forEach((variableSymbol) => {
    traverse(variableSymbol)
  })
}

if (!workflows.length) {
  process.exit()
}

// check if the workflows directory exist in the output directory
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

workflows.forEach((workflow) => {
  const diagram = createDiagram(workflow)

  // write files
  const workflowPath = path.join(outputDir, workflow.name)
  if (!existsSync(workflowPath)) {
    mkdirSync(workflowPath)
  }

  writeFileSync(path.join(workflowPath, "diagram.mermaid"), diagram)
  writeFileSync(path.join(workflowPath, "code.ts"), workflow.code)
})

console.log(`Generated ${workflows.length} diagram specs`)
