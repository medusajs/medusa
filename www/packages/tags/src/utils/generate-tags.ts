import { existsSync, statSync } from "fs"
import { mkdir, readdir, rm, writeFile } from "fs/promises"
import path from "path"
import type { Tags } from "types"
import { findPageTitle, getFrontMatterSync } from "docs-utils"

type ConfigItem = {
  path: string
  contentPaths: {
    path: string
    omitFromPath?: boolean
  }[]
  tagBasePath?: string
}

// We need to set the base URL to solve problems
// when linking between projects
// TODO maybe find a better way of setting this
const BASE_URL = "https://docs.medusajs.com"

const config: ConfigItem[] = [
  {
    path: path.resolve("..", "..", "apps", "book"),
    contentPaths: [
      {
        path: "app",
        omitFromPath: true,
      },
    ],
  },
  {
    path: path.resolve("..", "..", "apps", "resources"),
    contentPaths: [
      {
        path: "app",
        omitFromPath: true,
      },
      {
        path: "references",
      },
    ],
    tagBasePath: "/resources",
  },
  {
    path: path.resolve("..", "..", "apps", "ui"),
    contentPaths: [
      {
        path: "app",
        omitFromPath: true,
      },
    ],
    tagBasePath: "/ui",
  },
  {
    path: path.resolve("..", "..", "apps", "user-guide"),
    contentPaths: [
      {
        path: "app",
        omitFromPath: true,
      },
    ],
    tagBasePath: "/user-guide",
  },
]

function normalizePageTitle(title: string): string {
  // remove variables from title
  return title.replaceAll(/\$\{.+\}/g, "").trim()
}

function tagNameToFileName(tagName: string): string {
  return `${tagName.toLowerCase().replaceAll(" ", "-")}.ts`
}

function tagNameToVarName(tagName: string): string {
  return tagName
    .toLowerCase()
    .replaceAll(/\s([a-zA-Z\d])/g, (captured) => captured.toUpperCase().trim())
}

export async function generateTags(basePath?: string) {
  basePath = basePath || path.resolve()
  const tags: Tags = {}
  async function getTags(item: ConfigItem) {
    async function scanDirectory(currentDirPath: string, omitPath?: string) {
      const files = await readdir(currentDirPath)

      for (const file of files) {
        const fullPath = path.join(currentDirPath, file)
        if (!file.endsWith(".mdx") || file.startsWith("_")) {
          if (statSync(fullPath).isDirectory()) {
            await scanDirectory(fullPath, omitPath)
          }
          continue
        }

        const frontmatter = getFrontMatterSync(fullPath)
        const fileBasename = path.basename(file)
        const itemBasePath = path.join(item.path, omitPath || "")

        frontmatter.tags?.forEach((tag) => {
          const tagName = typeof tag === "string" ? tag : tag.name
          const tagLabel = typeof tag !== "string" ? tag.label : undefined
          if (!Object.hasOwn(tags, tagName)) {
            tags[tagName] = []
          }

          tags[tagName].push({
            title:
              tagLabel ||
              normalizePageTitle(
                frontmatter.sidebar_label || findPageTitle(fullPath) || ""
              ),
            path: `${BASE_URL}${item.tagBasePath}${
              frontmatter.slug ||
              fullPath.replace(itemBasePath, "").replace(`/${fileBasename}`, "")
            }`,
          })
        })
      }
    }

    for (const contentPath of item.contentPaths) {
      const basePath = path.join(item.path, contentPath.path)

      await scanDirectory(
        basePath,
        !contentPath.omitFromPath ? "" : contentPath.path
      )
    }
  }

  await Promise.all(
    config
      .filter((item) => existsSync(item.path))
      .map(async (item) => {
        await getTags(item)
      })
  )

  const tagsDir = path.join(basePath, "src", "tags")
  // clear existing tags
  await rm(tagsDir, {
    recursive: true,
    force: true,
  })
  await mkdir(tagsDir)
  // write tags
  const files: string[] = []
  await Promise.all(
    Object.keys(tags).map(async (tagName) => {
      const fileName = tagNameToFileName(tagName)
      const varName = tagNameToVarName(tagName)

      const content = `export const ${varName} = ${JSON.stringify(tags[tagName], null, 2)}`

      await writeFile(path.join(tagsDir, fileName), content)
      files.push(fileName.replace(/\.ts$/, ".js"))
    })
  )

  // write index.ts
  const indexContent = files.sort().map((file) => `export * from "./${file}"\n`)
  await writeFile(path.join(tagsDir, "index.ts"), indexContent)
}
