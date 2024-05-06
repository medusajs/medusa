/* eslint-disable no-case-declarations */
import { WorkflowManager } from "@medusajs/orchestration"
import * as path from "path"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"
import registerWorkflows from "../utils/register-workflows.js"
import DiagramBuilder from "../classes/diagram-builder.js"
// @ts-expect-error mermaid typing issue
import { run as runMermaid } from "@mermaid-js/mermaid-cli"

type Options = {
  output: string
  type: "docs" | "markdown" | "mermaid" | "console" | "svg" | "png" | "pdf"
  theme: boolean
  prettyNames: boolean
}

export default async function (workflowPath: string, options: Options) {
  const workflowDefinitions = await registerWorkflows(workflowPath)

  const diagramBuilder = new DiagramBuilder(options)

  if (
    workflowDefinitions.size > 0 &&
    ["svg", "png", "pdf"].includes(options.type)
  ) {
    console.log(
      `Generating ${options.type} file(s) with mermaid. This may take some time...`
    )
  }

  for (const [name, code] of workflowDefinitions) {
    const workflow = WorkflowManager.getWorkflow(name)

    if (!workflow) {
      continue
    }

    const diagram = diagramBuilder.buildDiagram(workflow.flow_)
    if (!existsSync(options.output)) {
      mkdirSync(options.output, { recursive: true })
    }

    switch (options.type) {
      case "docs":
        const workflowPath = path.join(options.output, name)
        if (!existsSync(workflowPath)) {
          mkdirSync(workflowPath, { recursive: true })
        }
        // write files
        writeFileSync(path.join(workflowPath, "diagram.mermaid"), diagram)
        if (code) {
          writeFileSync(path.join(workflowPath, "code.ts"), code)
        }
        break
      case "mermaid":
        writeFileSync(path.join(options.output, `${name}.mermaid`), diagram)
        break
      case "markdown":
        writeFileSync(
          path.join(options.output, `${name}.md`),
          `\`\`\`mermaid\n${diagram}\n\`\`\``
        )
        break
      case "console":
        console.log(`Diagram for workflow ${name}:\n${diagram}`)
        break
      case "svg":
      case "png":
      case "pdf":
        const tempFilePath = path.join(options.output, `${name}.mermaid`)
        writeFileSync(tempFilePath, diagram)
        await runMermaid(
          tempFilePath,
          path.join(options.output, `${name}.${options.type}`),
          {
            quiet: true,
          }
        )
        rmSync(tempFilePath)
    }
  }

  console.log(`Generated diagrams for ${workflowDefinitions.size} workflows.`)
}
