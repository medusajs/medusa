import ts from "typescript"
import { Workflow } from "./types"
import traverse from "./traverse.js"

type Options = {
  program: ts.Program
  checker: ts.TypeChecker
  workflows: Workflow[]
}

export default function ({ checker, workflows }: Options) {
  return {
    traverse: (symbol: ts.Symbol) => traverse({ symbol, checker, workflows }),
  }
}
