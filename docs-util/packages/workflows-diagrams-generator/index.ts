#!/usr/bin/env node

import { readFileSync } from "fs"
import ts, { CompilerOptions } from "typescript"
import path from "path"
import { fileURLToPath } from "url"

// Keeping this as an object in case we need to add any other properties.
type Step = {
  name: string
}

type Workflow = {
  input: Record<string, any>
  output: Record<string, any>
  steps: Step[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

for (const sourceFile of program.getSourceFiles()) {
  if (sourceFile.isDeclarationFile) {
    continue
  }

  const variableSymbols = checker.getSymbolsInScope(
    sourceFile,
    ts.SymbolFlags.Variable
  )

  variableSymbols.forEach(traverse)
}

function traverse(symbol: ts.Symbol) {
  const symbolType = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!
  )

  let workflow: Workflow | undefined

  // TODO maybe import type from workflows package
  if (checker.typeToString(symbolType).startsWith("ReturnWorkflow")) {
    const workflowInitializer = (
      symbol.valueDeclaration! as ts.VariableDeclaration
    ).initializer!
    // build a workflow from here
    workflow = {
      input: {},
      output: {},
      steps: [],
    }

    // get inputs
    if ("arguments" in workflowInitializer) {
      const constructorFnArgument = (
        workflowInitializer.arguments as ts.Node[]
      ).find((argument) => argument.kind === ts.SyntaxKind.FunctionExpression)

      if (constructorFnArgument && "parameters" in constructorFnArgument) {
        ;(constructorFnArgument.parameters as ts.Node[]).forEach(
          (parameter) => {
            const parameterSymbol =
              "symbol" in parameter
                ? (parameter.symbol as ts.Symbol)
                : checker.getSymbolAtLocation(parameter)

            if (parameterSymbol) {
              // TODO need to traverse "object" types for their descendent types.
              workflow!.input[parameterSymbol.name] = checker.typeToString(
                checker.getTypeOfSymbolAtLocation(
                  parameterSymbol,
                  parameterSymbol.valueDeclaration!
                )
              )
            }
          }
        )
      }
    }

    // get output
    console.log(workflowInitializer)

    const workflowSymbols = checker.getSymbolsInScope(
      symbol.valueDeclaration!,
      ts.SymbolFlags.Variable
    )

    workflowSymbols.forEach((workflowSymbol) => {
      const workflowSymbolType = checker.getTypeOfSymbolAtLocation(
        workflowSymbol,
        workflowSymbol.valueDeclaration!
      )

      if (checker.typeToString(workflowSymbolType).startsWith("StepFunction")) {
        const stepInitializer = (
          workflowSymbol.valueDeclaration! as ts.VariableDeclaration
        ).initializer!

        if ("arguments" in stepInitializer) {
          workflow?.steps.push({
            name: (stepInitializer.arguments as ts.Node[])[0].getText(),
          })
        }
      }
    })
  }
}

/** True if this is visible outside this file, false otherwise */
// function isNodeExported(node: ts.Node): boolean {
//   return (
//     (ts.getCombinedModifierFlags(node as ts.Declaration) &
//       ts.ModifierFlags.Export) !==
//       0 ||
//     (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
//   )
// }
