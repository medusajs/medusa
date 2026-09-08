import Handlebars from "handlebars"
import { DeclarationReflection, SignatureReflection } from "typedoc"
import { getReflectionTypeFakeValueStr, getStepInputType } from "utils"
import beautifyCode from "../../utils/beautify-code.js"
import { getPackageNameForWorkflowReflection } from "../../utils/workflow-utils.js"

export default function () {
  Handlebars.registerHelper(
    "stepExamples",
    function (this: SignatureReflection): string {
      const stepReflection = this.parent

      const exampleTags = stepReflection.comment?.blockTags.filter(
        (tag) => tag.tag === "@example"
      )

      if (exampleTags?.length) {
        return Handlebars.helpers.example(stepReflection)
      }

      return generateStepExample(stepReflection)
    }
  )
}

function generateStepExample(stepReflection: DeclarationReflection): string {
  if (!stepReflection.signatures?.length) {
    return ""
  }
  const inputType = getStepInputType(stepReflection.signatures[0])
  const inputStr = inputType
    ? `${getReflectionTypeFakeValueStr({
        reflectionType: inputType,
        name: "",
      })}`
    : ""
  const packageName = getPackageNameForWorkflowReflection(stepReflection)

  // generate example
  return `
\`\`\`ts title="src/workflows/my-workflow.ts"
${beautifyCode(`import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { ${stepReflection.name} } from "${packageName}"

const myWorkflow = createWorkflow(
  "my-workflow",
  () => {
    const data = ${stepReflection.name}(${inputStr})
  }
)`)}
\`\`\`
  `
}
