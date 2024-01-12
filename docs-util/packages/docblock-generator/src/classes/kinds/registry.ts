import ts from "typescript"
import KindDocGenerator from "../../interface/KindDocGenerator.js"
import FunctionKind from "./function.js"
import DefaultKind from "./default.js"
import MedusaReactKind from "./medusa-react.js"

class KindsRegistry {
  protected kindInstances: KindDocGenerator[]
  protected defaultKindGenerator: DefaultKind

  constructor(checker: ts.TypeChecker) {
    this.kindInstances = [
      new MedusaReactKind({ checker }),
      new FunctionKind({ checker }),
    ]
    this.defaultKindGenerator = new DefaultKind({ checker })
  }

  getKindGenerator(node: ts.Node): KindDocGenerator | undefined {
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
