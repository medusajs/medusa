import confirm from "@inquirer/confirm"
import { spawn, spawnSync } from "child_process"

type McloudArgs = {
  args?: string[]
}

const MCLOUD_PACKAGE = "@medusajs/mcloud"

function isMcloudInstalled() {
  const result = spawnSync("mcloud", ["--version"], {
    stdio: "ignore",
  })

  return result.status === 0 && !result.error
}

function getPackageManagerInfo(): {
  name: "npm" | "pnpm" | "yarn" | "bun"
  args: string[]
} {
  const userAgent = process.env.npm_config_user_agent ?? ""

  if (userAgent.startsWith("pnpm")) {
    return {
      name: "pnpm",
      args: ["add", "-g", MCLOUD_PACKAGE],
    }
  }

  if (userAgent.startsWith("yarn")) {
    return {
      name: "yarn",
      args: ["global", "add", MCLOUD_PACKAGE],
    }
  }

  if (userAgent.startsWith("bun")) {
    return {
      name: "bun",
      args: ["add", "-g", MCLOUD_PACKAGE],
    }
  }

  return {
    name: "npm",
    args: ["i", "-g", MCLOUD_PACKAGE],
  }
}

async function installMcloud() {
  const packageManager = getPackageManagerInfo()

  const shouldInstall = await confirm({
    message: `The mcloud command requires the mcloud CLI. Install latest ${MCLOUD_PACKAGE} globally with ${packageManager.name}?`,
    default: true,
  })

  if (!shouldInstall) {
    process.exit(1)
  }

  const installProcess = spawn(packageManager.name, packageManager.args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  await new Promise<void>((resolve, reject) => {
    installProcess.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(
          new Error(
            `Failed to install ${MCLOUD_PACKAGE}. Try again or install the mcloud CLI manually, or if the issue persists create a Github issue. Error code: ${code}.`
          )
        )
      }
    })

    installProcess.on("error", (error) => {
      reject(error)
    })
  })
}

function runMcloudProxy(args: string[]) {
  const child = spawn("mcloud", args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  child.on("close", (code) => {
    process.exit(code ?? 1)
  })

  child.on("error", () => {
    process.exit(1)
  })
}

export default async function mcloud({ args = [] }: McloudArgs) {
  if (!isMcloudInstalled()) {
    await installMcloud()
  }

  runMcloudProxy(args)
}
