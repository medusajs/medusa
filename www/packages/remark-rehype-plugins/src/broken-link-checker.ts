import { existsSync, readdirSync, readFileSync } from "fs"
import path from "path"
import type { Transformer } from "unified"
import type {
  BrokenLinkCheckerOptions,
  UnistNode,
  UnistNodeWithData,
  UnistTree,
} from "types"
import type { VFile } from "vfile"
import { parseCrossProjectLink } from "./utils/cross-project-link-utils.js"
import { SlugChange } from "types"
import getAttribute from "./utils/get-attribute.js"
import { estreeToJs } from "docs-utils"
import { performActionOnLiteral } from "./utils/perform-action-on-literal.js"
import { MD_LINK_REGEX } from "./constants.js"

function getErrorMessage({
  link,
  file,
  additionalMessage = "",
}: {
  link: string
  file: VFile
  additionalMessage?: string
}): string {
  return `Broken link found! ${link} linked in ${file.history[0]}${
    additionalMessage ? `: ${additionalMessage}` : ""
  }`
}

function checkLocalLinkExists({
  link,
  file,
  currentPageFilePath,
  rootBasePath = { default: "app" },
  slugChanges = [],
}: {
  link: string
  file: VFile
  currentPageFilePath: string
  rootBasePath?: BrokenLinkCheckerOptions["rootBasePath"]
  slugChanges?: SlugChange[]
}) {
  let fileToCheck = link
  let basePath = currentPageFilePath
  if (!fileToCheck.endsWith("page.mdx")) {
    // if the link doesn't end with page.mdx, add it
    // find route base path
    let routeBasePath = rootBasePath.overrides
      ? Object.entries(rootBasePath.overrides).find(([key]) =>
          fileToCheck.startsWith(key)
        )?.[1]
      : rootBasePath.default
    if (routeBasePath === undefined) {
      routeBasePath = rootBasePath.default
    }
    fileToCheck = `${routeBasePath}${fileToCheck}/page.mdx`.replace(
      /\/{2,}/g,
      "/"
    )
    basePath = file.cwd
  }
  // remove leading slash if present
  fileToCheck = fileToCheck.replace(/^\//, "")
  // get absolute path of the URL
  const linkedFilePath = path.resolve(basePath, fileToCheck).replace(/#.*$/, "")
  // check if the file exists
  if (existsSync(linkedFilePath)) {
    return
  }

  // maybe check in slugs
  if (!slugChanges.length) {
    throw new Error(
      getErrorMessage({
        link,
        file,
      })
    )
  }

  checkSlugExists({
    slugChanges,
    pathToCheck: link,
    link,
    file,
    baseProjectPath: file.cwd,
  })
}

function checkSlugExists({
  slugChanges,
  pathToCheck,
  link,
  file,
  baseProjectPath,
}: {
  slugChanges: SlugChange[]
  pathToCheck: string
  baseProjectPath: string
  link: string
  file: VFile
}) {
  const slugChange = slugChanges.find(
    (change) => change.newSlug === pathToCheck
  )

  if (
    !slugChange ||
    !mdxPageExists(path.join(baseProjectPath, slugChange.origSlug))
  ) {
    throw new Error(
      getErrorMessage({
        link,
        file,
      })
    )
  }
}

function mdxPageExists(pagePath: string): boolean {
  if (!existsSync(pagePath)) {
    // for projects that use a convention other than mdx
    // check if an mdx file exists with the same name
    if (existsSync(`${pagePath}.mdx`)) {
      return true
    }
    return false
  }

  return (
    existsSync(path.join(pagePath, "page.mdx")) ||
    existsSync(path.join(pagePath, "page.tsx"))
  )
}

function componentChecker({
  node,
  ...rest
}: {
  node: UnistNodeWithData
  file: VFile
  currentPageFilePath: string
  options: BrokenLinkCheckerOptions
}) {
  if (!node.name) {
    return
  }

  let attributeName: string | undefined

  const maybeCheckAttribute = () => {
    if (!attributeName) {
      return
    }

    const attribute = getAttribute(node, attributeName)

    if (!attribute) {
      return
    }

    if (typeof attribute.value === "string") {
      checkLink({
        link: attribute.value,
        ...rest,
      })
      return
    }

    if (!attribute.value.data?.estree) {
      return
    }

    const itemJsVar = estreeToJs(attribute.value.data.estree)

    if (!itemJsVar || "name" in itemJsVar) {
      return
    }

    performActionOnLiteral(itemJsVar, (item) => {
      checkLink({
        link: item.original.value as string,
        ...rest,
      })
    })
  }

  switch (node.name) {
    case "Prerequisites":
    case "CardList":
      attributeName = "items"
      break
    case "Card":
      attributeName = "href"
      break
    case "WorkflowDiagram":
      attributeName = "workflow"
      break
    case "TypeList":
      attributeName = "types"
      break
  }

  maybeCheckAttribute()
}

function checkLink({
  link,
  file,
  currentPageFilePath,
  options,
}: {
  link: unknown | undefined
  file: VFile
  currentPageFilePath: string
  options: BrokenLinkCheckerOptions
}) {
  if (!link || typeof link !== "string" || link === "/" || link === "#") {
    return
  }
  // try to remove hash
  const hashIndex = link.lastIndexOf("#")
  const likeWithoutHash = hashIndex !== -1 ? link.substring(0, hashIndex) : link
  if (likeWithoutHash.match(/page\.mdx?$/) || likeWithoutHash.startsWith("/")) {
    checkLocalLinkExists({
      link: likeWithoutHash,
      file,
      currentPageFilePath,
      slugChanges: options.generatedSlugs,
      rootBasePath: options.rootBasePath,
    })
    return
  }

  const parsedLink = parseCrossProjectLink(likeWithoutHash)

  if (!parsedLink) {
    if (MD_LINK_REGEX.test(link)) {
      // try fixing MDX links
      let linkMatches
      let tempLink = link
      MD_LINK_REGEX.lastIndex = 0

      while ((linkMatches = MD_LINK_REGEX.exec(tempLink)) !== null) {
        if (!linkMatches.groups?.link) {
          return
        }

        checkLink({
          link: linkMatches.groups.link,
          file,
          currentPageFilePath,
          options,
        })

        tempLink = tempLink.replace(linkMatches.groups.link, "")
        // reset regex
        MD_LINK_REGEX.lastIndex = 0
      }
    }
    return
  } else if (!Object.hasOwn(options.crossProjects, parsedLink.area)) {
    throw new Error(
      getErrorMessage({
        link,
        file,
        additionalMessage: `Unknown project area: ${parsedLink.area}`,
      })
    )
  }

  const projectOptions = options.crossProjects[parsedLink.area]

  if (parsedLink.path.length && !parsedLink.path.startsWith("/")) {
    throw new Error(
      getErrorMessage({
        link,
        file,
        additionalMessage: `Cross project paths must start with a slash.`,
      })
    )
  }

  if (projectOptions.skipSlugValidation) {
    // if slug validation is skipped, just check if the file exists
    return
  }

  const isReferenceLink =
    parsedLink.path.startsWith("/references") &&
    parsedLink.path !== "/references-overview"
  const baseDir = isReferenceLink
    ? "references"
    : projectOptions.contentPath || "app"
  const pagePath = isReferenceLink
    ? parsedLink.path.replace(/^\/references/, "")
    : parsedLink.path
  // check if the file exists
  if (mdxPageExists(path.join(projectOptions.projectPath, baseDir, pagePath))) {
    return
  }

  // file doesn't exist, check if slugs are enabled and generated
  if (!projectOptions.generatedSlugs) {
    throw new Error(
      getErrorMessage({
        link,
        file,
      })
    )
  }

  checkSlugExists({
    slugChanges: projectOptions.generatedSlugs,
    pathToCheck: parsedLink.path,
    link,
    file,
    baseProjectPath: projectOptions.projectPath,
  })
}

function loadSlugs(projectPath: string): SlugChange[] {
  // file doesn't exist, check if slugs are enabled and generated
  const generatedSlugsPath = path.join(
    projectPath,
    "generated",
    "slug-changes.mjs"
  )
  if (!existsSync(generatedSlugsPath)) {
    throw new Error(`Cross project ${projectPath} has no generated slugs file.`)
  }

  const generatedSlugContent = readFileSync(generatedSlugsPath, "utf-8")
  return JSON.parse(
    generatedSlugContent.substring(generatedSlugContent.indexOf("["))
  ) as SlugChange[]
}

const allowedComponentNames = [
  "Card",
  "CardList",
  "Prerequisites",
  "WorkflowDiagram",
  "TypeList",
]

export function brokenLinkCheckerPlugin(
  options: BrokenLinkCheckerOptions
): Transformer {
  return async (tree, file) => {
    const { visit } = await import("unist-util-visit")

    // load slug changes for the current project
    if (options.hasGeneratedSlugs) {
      options.generatedSlugs = loadSlugs(file.cwd)
    }

    // load slug changes for cross projects
    if (options.crossProjects) {
      for (const project of Object.values(options.crossProjects)) {
        if (!project.hasGeneratedSlugs) {
          continue
        }

        project.generatedSlugs = loadSlugs(project.projectPath)
      }
    }

    const currentPageFilePath = file.history[0].replace(
      `/${path.basename(file.history[0])}`,
      ""
    )

    visit(
      tree as UnistTree,
      ["element", "mdxJsxFlowElement"],
      (node: UnistNode) => {
        if (node.tagName === "a" && node.properties?.href) {
          checkLink({
            link: node.properties.href,
            file,
            currentPageFilePath,
            options,
          })
        } else if (node.name && allowedComponentNames.includes(node.name)) {
          componentChecker({
            node: node as UnistNodeWithData,
            file,
            currentPageFilePath,
            options,
          })
        }
      }
    )
  }
}
