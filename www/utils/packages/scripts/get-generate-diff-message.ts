import { execSync } from "child_process"
import * as core from "@actions/core"

const command = `git --no-pager diff --minimal --name-only ../../../apps/resources/references`
const diffOutput = execSync(command).toString()

const files = diffOutput.toString().split("\n").filter(Boolean)

const referenceNames: Set<string> = new Set([])

files.forEach((file) => {
  const referenceName = file
    .replace("www/apps/resources/references/", "")
    .split("/")[0]

  if (referenceName) {
    referenceNames.add(referenceName)
  }
})

let strOutput = "Generated the following references:\n"

referenceNames.forEach((referenceName) => {
  strOutput += `- \`${referenceName}\`\n`
})

core.setOutput("body", strOutput)
