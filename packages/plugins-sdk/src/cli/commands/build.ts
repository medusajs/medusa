import fse from "fs-extra"
import path from "path"
import { rollup } from "rollup"

export default async function build() {
  const source = path.resolve(process.cwd(), "src")

  try {
    await fse.pathExists(source)
  } catch (error) {
    console.log("Current directory is not a valid plugin")
    process.exit(1)
  }

  const packagePath = path.resolve(process.cwd(), "package.json")

  await rollup({
    input: path.resolve(source, "index.ts"),
  })
}
