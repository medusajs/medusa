import { writeFile } from "fs/promises"
import path from "path"
import {
  getMdxPageTitle,
  getTitleFromUrl,
  retrieveMdxPageFiles,
} from "./retrieve-mdx-pages.js"

export type LlmsIndexLink = {
  title: string
  url: string
}

export type LlmsIndexSection = {
  title: string
  links: LlmsIndexLink[]
}

type Options = {
  title: string
  description: string
  sections: LlmsIndexSection[]
  /**
   * Where to write the generated file. Defaults to `public/llms.txt` of the
   * current project.
   */
  outputPath?: string
}

/**
 * Writes an `llms.txt` index (https://llmstxt.org) that links to every page of
 * a docs project, so agents can discover pages that the root `llms.txt` doesn't
 * list.
 */
export const generateLlmsIndex = async ({
  title,
  description,
  sections,
  outputPath,
}: Options) => {
  const content = [
    `# ${title}`,
    `> ${description}`,
    ...sections
      .filter((section) => section.links.length)
      .map((section) =>
        [
          `## ${section.title}`,
          section.links
            .map((link) => `- [${link.title}](${link.url})`)
            .join("\n"),
        ].join("\n\n")
      ),
  ].join("\n\n")

  await writeFile(
    outputPath || path.join(path.resolve(), "public", "llms.txt"),
    `${content}\n`,
    { flag: "w" }
  )
}

/**
 * Builds `llms.txt` links for every MDX page of the current project, plus
 * `extraPaths` that aren't backed by an MDX page. `baseUrl` must include the
 * project's base path.
 */
export const getMdxPagesLlmsLinks = ({
  baseUrl,
  basePath,
  extraPaths = [],
}: {
  baseUrl: string
  basePath?: string
  extraPaths?: string[]
}): LlmsIndexLink[] => {
  const pages = retrieveMdxPageFiles({
    basePath: basePath || path.join(path.resolve(), "app"),
  })

  return [
    ...pages.map((page) => ({
      title: getMdxPageTitle(page),
      url: `${baseUrl}${page.url}`,
    })),
    ...extraPaths.map((extraPath) => ({
      title: getTitleFromUrl(extraPath),
      url: `${baseUrl}${extraPath}`,
    })),
  ].sort((a, b) => a.url.localeCompare(b.url))
}
