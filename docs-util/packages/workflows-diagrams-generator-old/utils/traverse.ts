import ts from "typescript"
import { Workflow } from "./types"
import getPropertiesInType from "./get-properties-in-type.js"
import formatStringValue from "./format-string-value.js"

type Options = {
  symbol: ts.Symbol
  checker: ts.TypeChecker
  workflows: Workflow[]
}

export default function traverse({ symbol, checker, workflows }: Options) {
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
      name: "",
      input: {},
      output: {},
      steps: [],
      code: workflowInitializer.getText(),
    }

    // get inputs + workflow name
    if ("arguments" in workflowInitializer) {
      const workflowArguments = workflowInitializer.arguments as ts.Node[]
      if (arguments.length) {
        workflow.name = formatStringValue(workflowArguments[0].getText())

        const constructorFnArgument = workflowArguments.find(
          (argument) => argument.kind === ts.SyntaxKind.FunctionExpression
        )

        if (constructorFnArgument && "parameters" in constructorFnArgument) {
          ;(constructorFnArgument.parameters as ts.Node[]).forEach(
            (parameter) => {
              const parameterSymbol =
                "symbol" in parameter
                  ? (parameter.symbol as ts.Symbol)
                  : checker.getSymbolAtLocation(parameter)

              if (parameterSymbol?.name === "input") {
                // get parameters in input
                const parameterSymbolType = checker.getTypeOfSymbolAtLocation(
                  parameterSymbol,
                  parameterSymbol.valueDeclaration!
                )
                if (parameterSymbolType.aliasTypeArguments?.length) {
                  const actualParameterType =
                    parameterSymbolType.aliasTypeArguments[0]

                  workflow!.input = getPropertiesInType(
                    actualParameterType,
                    checker
                  )
                }
              }
            }
          )
        }
      }
    }

    // get output
    const outputType =
      symbolType.aliasTypeArguments && symbolType.aliasTypeArguments.length >= 2
        ? symbolType.aliasTypeArguments[1]
        : undefined

    if (outputType) {
      workflow!.output = getPropertiesInType(outputType, checker)
    }

    // get steps
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
            name: formatStringValue(
              (stepInitializer.arguments as ts.Node[])[0].getText()
            ),
          })
        }
      }
    })
  }

  const workflowIsDefined =
    workflow &&
    !(
      Object.keys(workflow.input).length === 0 &&
      Object.keys(workflow.output).length === 0 &&
      workflow.steps.length === 0
    )

  if (workflowIsDefined) {
    workflows.push(workflow!)
  }
}
