import ts from "typescript"
import FunctionKindGenerator from "./function.js"
import DefaultKindGenerator from "./default.js"
import MedusaReactKindGenerator from "./medusa-react.js"

class KindsRegistry {
  protected kindInstances: DefaultKindGenerator[]
  protected defaultKindGenerator: DefaultKindGenerator

  constructor(checker: ts.TypeChecker) {
    this.kindInstances = [
      new MedusaReactKindGenerator({ checker }),
      new FunctionKindGenerator({ checker }),
    ]
    this.defaultKindGenerator = new DefaultKindGenerator({ checker })
  }

  getKindGenerator(node: ts.Node): DefaultKindGenerator | undefined {
    return (
      this.kindInstances.find((generator) => generator.isAllowed(node)) ||
      (this.defaultKindGenerator.isAllowed(node)
        ? this.defaultKindGenerator
        : undefined)
    )
  }

  hasGenerator(node: ts.Node): boolean {
    return this.getKindGenerator(node) !== undefined
  }
}

export default KindsRegistry
