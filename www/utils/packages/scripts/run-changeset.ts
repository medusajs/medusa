import util from "node:util"
import { exec } from "child_process"
import path from "node:path"

const promiseExec = util.promisify(exec)

async function main() {
  // check if there are any changes in diff
  const diffFiles = (await promiseExec(`git diff --name-only`)).stdout
    .toString()
    .split("\n")
    .filter(Boolean)

  if (!diffFiles.length) {
    console.log("No files were changed, skipping generating changeset...")
    return
  }

  // run changeset
  await promiseExec(`yarn changeset --empty`, {
    cwd: path.resolve("..", "..", ".."),
  })
  console.log("Generated changeset.")
}

void main()
