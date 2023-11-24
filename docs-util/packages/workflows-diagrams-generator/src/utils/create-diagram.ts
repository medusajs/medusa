import { TransactionStepsDefinition } from "@medusajs/orchestration"
import { getLinePrefix } from "./formatting.js"

export default function (workflow: TransactionStepsDefinition): string {
  const topLevelLinePrefix = getLinePrefix(1)

  let diagram = `%%{
    init: {
      'theme': 'base',
      'themeVariables': {
        'background': '#F9FAFB',
        'primaryColor': '#FFFFFF',
        'primaryTextColor': '#030712',
        'primaryBorderColor': '#D1D5DB',
        'lineColor': '#11181C',
        'fontFamily': 'Inter',
        'fontSize': '13px',
        'clusterBkg': 'transparent',
        'clusterBorder': 'transparent'
      }
    }
  }%%${topLevelLinePrefix}flowchart TB`

  const stepsDiagram = getSteps(workflow)

  diagram += stepsDiagram.defsStr + `\n` + formatLinks(stepsDiagram.links)

  return diagram
}

type ReturnedSteps = {
  escapedStepNames: string[]
  links: string[]
  defsStr: string
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
    flowArr.forEach((flowItem) => {
      const flowSteps = getSteps(flowItem)
      defsStr += `${linePrefix}${flowSteps.defsStr}`
      links.push(...flowSteps.links)
      escapedStepNames.push(...flowSteps.escapedStepNames)
    })
  } else {
    const flowItem = flow as TransactionStepsDefinition
    const escapedName = flowItem.action?.replaceAll("-", "") || ""

    if (escapedName.length) {
      escapedStepNames.push(escapedName)
      defsStr += `${linePrefix}${escapedName}[${flowItem.action!}]`
    }

    if (flowItem.next) {
      const nextSteps = getSteps(flowItem.next, level)
      defsStr += `${linePrefix}${nextSteps.defsStr}`
      if (escapedName.length) {
        nextSteps.escapedStepNames.forEach((escapedStep) => {
          links.push(`${linePrefix}${escapedName} --> ${escapedStep}`)
        })
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
