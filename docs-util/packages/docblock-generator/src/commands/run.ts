import DocblockGenerator, { Options } from "../classes/DocblockGenerator.js"

export default async function run(
  paths: string[],
  options: Omit<Options, "paths">
) {
  const docblockGenerator = new DocblockGenerator({
    paths,
    ...options,
  })

  await docblockGenerator.run()
}
