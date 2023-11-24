import escapeStr from "./escape-str.js"
import { Workflow } from "./types.js"

export default function (workflow: Workflow): string {
  const spacing = `\t`
  const linePrefix = `\n${spacing}`
  let str = `%%{
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
  }%%
  ${spacing}flowchart LR
  ${spacing}subgraph`
  // start step
  str += `${linePrefix}${spacing}startStep["\`Start
  ${spacing}${spacing}input: ${escapeStr(JSON.stringify(workflow.input))}
  ${spacing}\`"]`

  const innerSteps: string[] = []

  // This is used to ensure that a line doesn't get too long
  // Its initial value is `1` since the start node is the first
  // node in line
  let nodesInCurrentLine = 1
  // TODO change this to be a command line option
  const maxNodesInLine = 3

  // add steps
  workflow.steps.forEach((step) => {
    if (nodesInCurrentLine === 0) {
      str += `${linePrefix}subgraph`
    }
    let escapedName = step.name.replaceAll("-", "")
    while (innerSteps.includes(escapedName)) {
      escapedName = `${escapedName}${getRandomNumber()}`
    }
    innerSteps.push(escapedName)
    str += `${linePrefix}${escapedName}[${step.name}]`
    nodesInCurrentLine += 1
    if (nodesInCurrentLine === maxNodesInLine) {
      str += `${linePrefix}end`
      nodesInCurrentLine = 0
    }
  })

  // end step
  str += `${linePrefix}endStep["\`End
  ${spacing}output: ${escapeStr(JSON.stringify(workflow.output))}
  ${spacing}\`"]`

  // add arrows for steps
  str += `${linePrefix}startStep --> ${innerSteps.join(" --> ")} --> endStep`

  return str
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100)
}
