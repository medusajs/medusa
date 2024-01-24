import DocblockGenerator, { Options } from "../classes/docblock-generator.js"

export default async function run(
  paths: string[],
  options: Omit<Options, "paths">
) {
  console.log("Running...")

  const docblockGenerator = new DocblockGenerator({
    paths,
    ...options,
  })

  await docblockGenerator.run()

  console.log(`Finished running.`)
}
