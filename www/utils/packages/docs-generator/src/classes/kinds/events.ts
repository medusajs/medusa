import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import { glob } from "glob"
import getMonorepoRoot from "../../utils/get-monorepo-root.js"
import { readFile } from "fs/promises"
import { MedusaEvent } from "types"

class EventsKindGenerator extends DefaultKindGenerator<ts.VariableDeclaration> {
  protected allowedKinds: ts.SyntaxKind[] = [ts.SyntaxKind.VariableDeclaration]
  public name = "events"
  protected workflows: Record<string, string> = {}
  protected workflowsEmittingEvents: Record<string, string> = {}

  isAllowed(node: ts.Node): node is ts.VariableDeclaration {
    if (
      !super.isAllowed(node) ||
      !node.initializer ||
      !ts.isAsExpression(node.initializer) ||
      !ts.isObjectLiteralExpression(node.initializer.expression)
    ) {
      return false
    }

    return node.initializer.expression.properties.length > 0
  }

  async getDocBlock(
    node: ts.VariableDeclaration | ts.Node,
    options?: GetDocBlockOptions
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    const properties = (
      (node.initializer as ts.AsExpression)
        .expression as ts.ObjectLiteralExpression
    ).properties

    const events: MedusaEvent[] = properties
      .filter((property) => ts.isPropertyAssignment(property))
      .map((property) => {
        const propertyAssignment = property as ts.PropertyAssignment
        const eventVariableName = node.name.getText()
        const eventPropertyName = propertyAssignment.name.getText()
        const workflows = this.getWorkflowsUsingEvent({
          eventVariableName,
          eventPropertyName,
        })
        if (!workflows.length) {
          return null
        }

        const commentsAndTags = ts.getJSDocCommentsAndTags(propertyAssignment)
        let payloadTag: ts.JSDocTag | undefined
        let sinceTag: ts.JSDocTag | undefined
        let deprecatedTag: ts.JSDocTag | undefined
        let description: string | undefined
        commentsAndTags.forEach((comment) => {
          if (!("tags" in comment)) {
            return
          }

          if (typeof comment.comment === "string") {
            description = comment.comment
          }

          comment.tags?.forEach((tag) => {
            if (tag.tagName.getText() === "eventPayload") {
              payloadTag = tag
            }

            if (tag.tagName.getText() === "since") {
              sinceTag = tag
            }

            if (tag.tagName.getText() === "deprecated") {
              deprecatedTag = tag
            }
          })
        })

        return {
          name: propertyAssignment.initializer.getText().replaceAll(`"`, ""),
          parentName: eventVariableName,
          propertyName: eventPropertyName,
          payload: (payloadTag?.comment as string) ?? "",
          description,
          workflows,
          since: sinceTag?.comment as string,
          deprecated: deprecatedTag !== undefined,
          deprecated_message: deprecatedTag?.comment as string,
        }
      })
      .filter((event) => event !== null)

    return JSON.stringify(events)
  }

  getWorkflowsUsingEvent({
    eventVariableName,
    eventPropertyName,
  }: {
    eventVariableName: string
    eventPropertyName: string
  }): string[] {
    const eventName = `${eventVariableName}.${eventPropertyName}`

    const workflows = this.findWorkflowsUsingEvent(eventName)
    return workflows
  }

  async populateWorkflows() {
    if (Object.keys(this.workflows).length > 0) {
      return
    }

    const files = await glob(
      `${getMonorepoRoot()}/packages/core/core-flows/src/**/workflows/**/*.ts`
    )

    for (const file of files) {
      const workflowFile = await readFile(file, "utf-8")
      const workflowName = this.getWorkflowNameFromWorkflowFile(workflowFile)
      if (!workflowName) {
        continue
      }

      this.workflows[workflowName] = workflowFile
      // remove comments in case the emitEventStep is commented out
      const workflowWithoutComments = workflowFile.replace(
        /\/\*[\s\S]*?\*\/|\/\/.*/g,
        ""
      )
      // the emitEventStep should be mentioned at least twice in the workflow
      // including the import statement
      const emitEventStepCount = (
        workflowWithoutComments.match(/emitEventStep/g) || []
      ).length
      if (emitEventStepCount >= 2) {
        this.workflowsEmittingEvents[workflowName] = workflowWithoutComments
      }
    }
  }

  getWorkflowNameFromWorkflowFile(workflowFile: string) {
    const workflowNameMatch = workflowFile.match(
      /export const\s+(\w+)\s*=\s*createWorkflow\(/
    )
    return workflowNameMatch ? workflowNameMatch[1] : null
  }

  findWorkflowsUsingEvent(eventName: string) {
    const workflows = Object.keys(this.workflowsEmittingEvents).filter(
      (workflowName) =>
        this.workflowsEmittingEvents[workflowName].includes(eventName)
    )

    // find workflows using the extracted workflows
    let newWorkflows: string[] = [...workflows]
    while (newWorkflows.length > 0) {
      // loop over the workflows and find new workflows that use the extracted workflows
      const foundWorkflows: string[] = []
      for (const workflowName of newWorkflows) {
        foundWorkflows.push(
          ...Object.keys(this.workflows).filter(
            (workflowKey) =>
              workflowKey !== workflowName &&
              this.workflows[workflowKey].match(
                new RegExp(`${workflowName}[\n\\s]*\\.run`)
              )
          )
        )
      }

      workflows.push(...foundWorkflows)
      newWorkflows = foundWorkflows
    }

    return workflows
  }
}

export default EventsKindGenerator
