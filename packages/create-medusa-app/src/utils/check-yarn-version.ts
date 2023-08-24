import promiseExec from "./promise-exec.js"

export const REQUIRED_YARN_CONFIG = "node-modules"

export default async function checkYarnVersion(): Promise<boolean> {
  let isVersion3 = false
  try {
    const result = await promiseExec("yarn -v")
    isVersion3 = /^3\./.test(result.stdout)
  } catch (e) {
    // ignore yarn not installed
  }

  return isVersion3
}

export async function getYarnOriginalConfig(): Promise<string> {
  return (await promiseExec("yarn config get nodeLinker")).stdout
}

export async function setYarnConfig(value: string) {
  await promiseExec(`yarn config set nodeLinker ${value}`)
}
