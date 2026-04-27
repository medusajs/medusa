import { spawnSync } from "child_process"
import fs from "fs"
import os from "os"
import path from "path"
import inquirer from "inquirer"
import logMessage from "./log-message.js"
import pkg from '@medusajs/telemetry';
const { Store, track } = pkg

const CLAUDE_DIR = path.join(os.homedir(), ".claude")
const INSTALLED_PLUGINS_FILE = path.join(
  CLAUDE_DIR,
  "plugins",
  "installed_plugins.json"
)
const PLUGIN_ID = "medusa-dev@medusa"
const CONFIG_KEY = "claude-code-plugin.prompted"

function isClaudeCodePresent(): boolean {
  return !!process.env.CLAUDE_CODE || fs.existsSync(CLAUDE_DIR)
}

function isNonInteractive(): boolean {
  return process.env.CI === "true" || !process.stdout.isTTY
}

function isPluginInstalled(): boolean {
  if (!fs.existsSync(INSTALLED_PLUGINS_FILE)) {
    return false
  }
  try {
    const data = JSON.parse(fs.readFileSync(INSTALLED_PLUGINS_FILE, "utf-8"))
    return !!data?.plugins?.[PLUGIN_ID]
  } catch {
    return false
  }
}

function runInstall(): boolean {
  try {
    const marketplace = spawnSync(
      "claude",
      ["plugin", "marketplace", "add", "medusajs/medusa-agent-skills"],
      { stdio: "inherit" }
    )
    if (marketplace.error) {
      return false
    }

    const install = spawnSync("claude", ["plugin", "install", PLUGIN_ID], {
      stdio: "inherit",
    })
    return !install.error
  } catch {
    return false
  }
}

export async function promptClaudeCodePlugin(): Promise<void> {
  if (isNonInteractive() || !isClaudeCodePresent() || isPluginInstalled()) {
    return
  }

  const configStore = new Store()
  console.log(configStore.config_.path)
  if (configStore.getConfig(CONFIG_KEY)) {
    return
  }

  configStore.setConfig(CONFIG_KEY, true)

  const { install } = await inquirer.prompt([
    {
      type: "confirm",
      name: "install",
      message:
        "Working with Medusa is easier with the Medusa Plugin for Claude Code. Would you like to install it?",
      default: true,
    },
  ])

  track("CMA_CLAUDE_CODE_PLUGIN_PROMPT", {
    install,
  })

  if (!install) {
    return
  }

  const success = runInstall()
  if (!success) {
    logMessage({
      message: `Could not auto-install. To install manually, open Claude Code in your project and run:\n\n  /plugin marketplace add medusajs/medusa-agent-skills\n`,
    })
  }
}
