import { TransactionStepsDefinition } from "@medusajs/orchestration"
import getRandomString from "../utils/get-random-string.js"

type DiagramBuilderOptions = {
  theme?: boolean
  prettyNames?: boolean
}

type ReturnedSteps = {
  escapedStepNames: string[]
  links: string[]
  defsStr: string
}

export default class DiagramBuilder {
  private options: DiagramBuilderOptions
  static SPACING = "\t"

  constructor(options: DiagramBuilderOptions) {
    this.options = options
  }

  buildDiagram(workflow: TransactionStepsDefinition): string {
    let diagram = `${this.getThemeConfig()}${
      this.options.theme ? this.getLinePrefix(1) : ""
    }flowchart TB`

    const stepsDiagram = this.getSteps(workflow, this.options.theme ? 2 : 1)

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

  getSteps(
    flow: TransactionStepsDefinition | TransactionStepsDefinition[],
    level: number
  ): ReturnedSteps {
    const links: string[] = []
    let defsStr = ""
    const escapedStepNames: string[] = []
    const linePrefix = this.getLinePrefix(level)

    const flowArr: TransactionStepsDefinition[] | undefined = Array.isArray(
      flow
    )
      ? flow
      : !flow.action && Array.isArray(flow.next)
        ? flow.next
        : undefined

    if (flowArr) {
      // these are steps running in parallel
      // since there are changes where the flowArr contains
      // one item, we check the length before treating the
      // main steps as steps running in parallel
      const areStepsParallel = flowArr.length > 1
      const parallelDefinitions: Record<string, string> = {}
      flowArr.forEach((flowItem) => {
        const flowSteps = this.getSteps(flowItem, level)
        if (areStepsParallel) {
          const escapedName = this.getEscapedStepName(flowItem.action)
          if (escapedName) {
            const itemDefinition = `${linePrefix}${escapedName}(${this.formatStepName(
              flowItem.action!
            )})`
            parallelDefinitions[itemDefinition] = flowSteps.defsStr.replace(
              itemDefinition,
              ""
            )
          } else {
            // if the step doesn't have an action name
            // we just show it as a regular step rather than
            // a subgraph
            defsStr += `${linePrefix}${flowSteps.defsStr}`
          }
        } else {
          // if the steps aren't parallel
          // just show them as regular steps
          defsStr += `${linePrefix}${flowSteps.defsStr}`
        }
        links.push(...flowSteps.links)
        escapedStepNames.push(...flowSteps.escapedStepNames)
      })

      // if there are steps in parallel,
      // we show them as a subgraph
      const definitionKeys = Object.keys(parallelDefinitions)
      if (definitionKeys.length) {
        defsStr += `${this.getSubgraph(
          definitionKeys.join(""),
          linePrefix
        )}${linePrefix}${Object.values(parallelDefinitions).join("")}`
      }
    } else {
      const flowItem = flow as TransactionStepsDefinition
      const escapedName = this.getEscapedStepName(flowItem.action)

      if (escapedName.length) {
        escapedStepNames.push(escapedName)
        defsStr += `${linePrefix}${escapedName}(${this.formatStepName(
          flowItem.action!
        )})`
      }

      if (flowItem.next) {
        const nextSteps = this.getSteps(flowItem.next, level)
        defsStr += `${linePrefix}${nextSteps.defsStr}`
        if (escapedName.length) {
          nextSteps.escapedStepNames.forEach((escapedStep) => {
            links.push(`${linePrefix}${escapedName} --> ${escapedStep}`)
          })
        } else {
          escapedStepNames.push(...nextSteps.escapedStepNames)
        }
        links.push(...nextSteps.links)
      }
    }

    return {
      escapedStepNames,
      links,
      defsStr,
    }
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
