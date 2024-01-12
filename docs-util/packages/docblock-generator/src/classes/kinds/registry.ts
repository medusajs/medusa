import ts from "typescript"
import FunctionKindGenerator from "./function.js"
import DefaultKindGenerator from "./default.js"
import MedusaReactHooksKindGenerator from "./medusa-react-hooks.js"
import SourceFileKindGenerator from "./source-file.js"

class KindsRegistry {
  protected kindInstances: DefaultKindGenerator[]
  protected defaultKindGenerator: DefaultKindGenerator

  constructor(checker: ts.TypeChecker) {
    this.kindInstances = [
      new MedusaReactHooksKindGenerator({ checker }),
      new FunctionKindGenerator({ checker }),
      new SourceFileKindGenerator({ checker }),
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
