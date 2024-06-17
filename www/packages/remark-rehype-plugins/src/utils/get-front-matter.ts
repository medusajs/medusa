import remarkFrontmatter from "remark-frontmatter"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import { FrontMatter } from "../types/index.js"

export async function getFrontMatterUtil(
  filePath: string
): Promise<FrontMatter> {
  return (
    await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter, ["yaml"])
      .use(() => {
        return (tree, file) => {
          matter(file)
        }
      })
      .process(await read(filePath))
  ).data.matter as FrontMatter
}
