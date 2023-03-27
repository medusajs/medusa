import fse from "fs-extra"

export async function getPackageDevDependencies(
  packagePath: string
): Promise<string[]> {
  const packageJson = await fse.readJSON(packagePath)

  return Object.keys(packageJson.devDependencies || {})
}
