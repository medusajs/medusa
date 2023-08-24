import promiseExec from "./promise-exec.js"

export const REQUIRED_YARN_CONFIG = "node-modules"

export default async function checkYarnVersion(): Promise<boolean> {
  let isIncompatible = false
  try {
    const result = await promiseExec("yarn -v")
    isIncompatible = !/^1\./.test(result.stdout)
  } catch (e) {
    // ignore yarn not installed
  }

  return isIncompatible
}

export function checkIsYarn(): boolean {
  return process.env.npm_execpath?.includes("yarn") || false
}

export async function getYarnOriginalConfig(): Promise<string> {
  return (
    process.env.YARN_NODE_LINKER ||
    (await promiseExec("yarn config get nodeLinker")).stdout.trim()
  )
}

export async function setYarnConfig(value: string) {
  await promiseExec(`yarn config set nodeLinker ${value}`)
}
