#!/usr/bin/env node

import { Octokit } from "@octokit/core"
import fs from "fs"
import path from "path"
import { getDirname } from "utils"

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
})

type DocsConfig = {
  version: {
    number: string
    releaseUrl: string
    releaseDate: string
  }
}

function getConfigPath() {
  const __dirname = getDirname(import.meta.url)
  return path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "packages",
    "docs-ui",
    "src",
    "global-config.ts"
  )
}

const configFilePrefix = `/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import { DocsConfig } from "types"

export const globalConfig: Pick<DocsConfig, "version"> = `

async function main() {
  //retrieve the latest release
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/latest",
    {
      owner: "medusajs",
      repo: "medusa",
      sha: "develop",
    }
  )

  const version = response.data.tag_name.replace(/\.0$/, "").replace(/^v/, "")

  // get the existing version
  const configPath = getConfigPath()
  const configContent = fs
    .readFileSync(configPath, "utf-8")
    .replace(configFilePrefix, "")
  const oldConfig: DocsConfig = JSON.parse(configContent)

  if (oldConfig.version.number === version) {
    return
  }

  //add new announcement
  const config: DocsConfig = {
    version: {
      number: version,
      releaseUrl: response.data.html_url,
      releaseDate: response.data.published_at || new Date().toISOString(),
    },
  }

  //write new config file
  fs.writeFileSync(
    configPath,
    `${configFilePrefix}${JSON.stringify(config, undefined, 2)}`
  )
  console.log(`Version in config has been updated.`)
}

void main()
