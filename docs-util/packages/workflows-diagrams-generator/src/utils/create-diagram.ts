import { TransactionStepsDefinition } from "@medusajs/orchestration"
import { getLinePrefix } from "./formatting.js"
import getRandomString from "./get-random-string.js"

type CreateDiagramOptions = {
  workflow: TransactionStepsDefinition
  addTheme?: boolean
}

export default function ({
  workflow,
  addTheme = true,
}: CreateDiagramOptions): string {
  const topLevelLinePrefix = getLinePrefix(1)

  let diagram = `${
    addTheme ? getThemeConfig() : ""
  }${topLevelLinePrefix}flowchart TB`

  const stepsDiagram = getSteps(workflow)

  diagram += stepsDiagram.defsStr + `\n` + formatLinks(stepsDiagram.links)

  return diagram
}

type ReturnedSteps = {
  escapedStepNames: string[]
  links: string[]
  defsStr: string
}

function getThemeConfig(): string {
  return `%%{
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
}

function getSteps(
  flow: TransactionStepsDefinition | TransactionStepsDefinition[],
  level = 2
): ReturnedSteps {
  const links: string[] = []
  let defsStr = ""
  const escapedStepNames: string[] = []
  const linePrefix = getLinePrefix(level)

  const flowArr: TransactionStepsDefinition[] | undefined = Array.isArray(flow)
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
      const flowSteps = getSteps(flowItem)
      if (areStepsParallel) {
        const escapedName = getEscapedStepName(flowItem.action)
        if (escapedName) {
          const itemDefinition = `${linePrefix}${escapedName}(${flowItem.action!})`
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
      defsStr += `${getSubgraph(
        definitionKeys.join(""),
        linePrefix
      )}${linePrefix}${Object.values(parallelDefinitions).join("")}`
    }
  } else {
    const flowItem = flow as TransactionStepsDefinition
    const escapedName = getEscapedStepName(flowItem.action)

    if (escapedName.length) {
      escapedStepNames.push(escapedName)
      defsStr += `${linePrefix}${escapedName}(${flowItem.action!})`
    }

    if (flowItem.next) {
      const nextSteps = getSteps(flowItem.next, level)
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

function getSubgraph(defsStr: string, linePrefix: string): string {
  return `${linePrefix}subgraph parallel${getRandomString()} [Parallel]${linePrefix}${defsStr}${linePrefix}end`
}

function getEscapedStepName(originalName: string | undefined): string {
  return originalName?.replaceAll("-", "") || ""
}

// TODO need to explore with this function
// for now it just returns the joined links, but
// it should split links on multiple lines in the
// diagram
function formatLinks(links: string[], level = 2): string {
  const linePrefix = getLinePrefix(level)
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
