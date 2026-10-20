import getRandomString from "../utils/get-random-string.js"
import type { WorkflowDefinition } from "../utils/register-workflows.js"

type DiagramBuilderOptions = {
  theme?: boolean
  prettyNames?: boolean
}

type ReturnedSteps = {
  links: string[]
  defsStr: string
}

export default class DiagramBuilder {
  private options: DiagramBuilderOptions
  static SPACING = "\t"

  constructor(options: DiagramBuilderOptions) {
    this.options = options
  }

  buildDiagram(workflow: WorkflowDefinition): string {
    let diagram = `${this.getThemeConfig()}${
      this.options.theme ? this.getLinePrefix(1) : ""
    }flowchart TB`

    const stepsDiagram = this.getSteps(
      workflow.steps,
      this.options.theme ? 2 : 1
    )

    diagram +=
      stepsDiagram.defsStr + `\n` + this.formatLinks(stepsDiagram.links)

    return diagram
  }

  getThemeConfig(): string {
    return this.options.theme
      ? `%%{
      init: {
        'theme': 'base',
        'themeVariables': {
          'background': '#FFFFFF',
          'mainBkg': '#FFFFFF',
          'primaryColor': '#FFFFFF',
          'primaryTextColor': '#030712',
          'primaryBorderColor': '#D1D5DB',
          'nodeBorder': '#D1D5DB',
          'lineColor': '#11181C',
          'fontFamily': 'Inter',
          'fontSize': '13px',
          'tertiaryColor': '#F3F4F6',
          'tertiaryBorderColor': '#D1D5DB',
          'tertiaryTextColor': '#030712'
        }
      }
    }%%`
      : ""
  }

  /**
   * Steps that depend on the same steps run in parallel, so they're shown
   * in a subgraph. Each dependency is a link to the step depending on it.
   */
  getSteps(steps: WorkflowDefinition["steps"], level: number): ReturnedSteps {
    const links: string[] = []
    let defsStr = ""
    const linePrefix = this.getLinePrefix(level)

    const getDependenciesKey = (step: WorkflowDefinition["steps"][number]) =>
      [...step.dependsOn].sort().join("|")
    const siblings = new Map<string, string[]>()
    steps.forEach((step) => {
      const key = getDependenciesKey(step)
      siblings.set(key, [...(siblings.get(key) || []), step.id])
    })

    const definedSteps = new Set<string>()
    steps.forEach((step) => {
      if (!definedSteps.has(step.id)) {
        const parallelSteps = siblings.get(getDependenciesKey(step)) || []
        if (parallelSteps.length > 1) {
          defsStr += this.getSubgraph(
            parallelSteps
              .map((stepId) => this.getStepDefinition(stepId, linePrefix))
              .join(""),
            linePrefix
          )
          parallelSteps.forEach((stepId) => definedSteps.add(stepId))
        } else {
          defsStr += this.getStepDefinition(step.id, linePrefix)
          definedSteps.add(step.id)
        }
      }

      const escapedName = this.getEscapedStepName(step.id)
      step.dependsOn.forEach((dependency) => {
        links.push(
          `${linePrefix}${this.getEscapedStepName(
            dependency
          )} --> ${escapedName}`
        )
      })
    })

    return {
      links,
      defsStr,
    }
  }

  getStepDefinition(stepId: string, linePrefix: string): string {
    return `${linePrefix}${this.getEscapedStepName(
      stepId
    )}(${this.formatStepName(stepId)})`
  }

  getSubgraph(defsStr: string, linePrefix: string): string {
    return `${linePrefix}subgraph parallel${getRandomString()} [Parallel]${linePrefix}${defsStr}${linePrefix}end`
  }

  getEscapedStepName(originalName: string | undefined): string {
    return originalName?.replaceAll("-", "") || ""
  }

  formatStepName(originalName: string): string {
    if (!this.options?.prettyNames) {
      return originalName
    }
    return originalName
      .replaceAll("-", " ")
      .replaceAll(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
      .join(" ")
  }

  getLinePrefix(indentation = 0): string {
    return `\n${DiagramBuilder.SPACING.repeat(indentation)}`
  }

  // TODO need to explore with this function
  // for now it just returns the joined links, but
  // it should split links on multiple lines in the
  // diagram
  formatLinks(links: string[], level = 2): string {
    const linePrefix = this.getLinePrefix(level)
    return links.join(linePrefix)

    // This is used to ensure that a line doesn't get too long
    // let nodesInCurrentLine = 0
    // // TODO change this to be a command line option
    // const maxNodesInLine = 3

    // if (links.length <= maxNodesInLine) {
    //   return links.join(linePrefix)
    // }

    // let finalStr = ""

    // links.forEach((link) => {
    //   if (nodesInCurrentLine === 0) {
    //     finalStr += "subgraph"
    //   }

    //   finalStr += link
    //   ++nodesInCurrentLine
    //   if (nodesInCurrentLine === maxNodesInLine) {
    //     finalStr += "end"
    //     nodesInCurrentLine = 0
    //   }
    // })

    // return finalStr
  }
}
