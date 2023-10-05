#!/usr/bin/env node
import path from "path"
import fs from "fs"
import { exec } from "child_process"

const referenceNames = process.argv.slice(2)
referenceNames.forEach((names) => {
  const configPathName = path.join(
    __dirname,
    "..",
    "typedoc-config",
    `${names}.js`
  )

  // check if the config file exists
  if (!fs.existsSync(configPathName)) {
    throw new Error(
      `Config file for ${names} doesn't exist. Make sure to create it in ${configPathName}`
    )
  }

  const typedocProcess = exec(`typedoc --options ${configPathName}`)
  typedocProcess.stdout?.pipe(process.stdout)
  typedocProcess.stderr?.pipe(process.stdout)
})
