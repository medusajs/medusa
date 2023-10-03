#!/usr/bin/env node
import path from "path"
import fs from "fs"
import { exec } from "child_process"

const moduleName = process.argv[2]
const configPathName = path.join(__dirname, "..", "typedoc-config", `typedoc.${moduleName}.js`)

// check if the config file exists
if (!fs.existsSync(configPathName)) {
  throw new Error(`Config file for module ${moduleName} doesn't exist. Make sure to create it in ${configPathName}`)
}

const typedocProcess = exec(`typedoc --options ${configPathName}`)
typedocProcess.stdout?.pipe(process.stdout)
typedocProcess.stderr?.pipe(process.stdout)