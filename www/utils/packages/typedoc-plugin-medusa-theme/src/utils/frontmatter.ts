import { Reflection } from "typedoc"
import { FrontmatterData, Tag } from "types"
import { getTagComments, getTagsAsArray } from "utils"
import { replaceTemplateVariables } from "./reflection-template-strings.js"

export function getPageFrontmatter({
  frontmatterData,
  reflection,
}: {
  frontmatterData: FrontmatterData | undefined
  reflection: Reflection
}): FrontmatterData | undefined {
  if (!frontmatterData) {
    return
  }

  // format frontmatter data in case it has any template variables
  const resolvedFrontmatter = resolveFrontmatterVariables(
    frontmatterData,
    reflection
  )

  // check if reflection has an `@tags` tag
  const tagsComment = getTagComments(reflection)
  if (tagsComment?.length && !("tags" in resolvedFrontmatter)) {
    resolvedFrontmatter["tags"] = []
  }
  tagsComment?.forEach((tag) => {
    const tagContent = getTagsAsArray(tag)
    resolvedFrontmatter["tags"]?.push(...tagContent)
  })
  if (resolvedFrontmatter["tags"]?.length) {
    resolvedFrontmatter["tags"] = getUniqueTags(resolvedFrontmatter["tags"])
  }

  return resolvedFrontmatter
}

function resolveFrontmatterVariables(
  frontmatterData: FrontmatterData,
  reflection: Reflection
): FrontmatterData {
  const tempFrontmatterData: FrontmatterData = JSON.parse(
    JSON.stringify(frontmatterData)
  )
  Object.keys(tempFrontmatterData).forEach((key) => {
    const value = tempFrontmatterData[key]
    if (!value || typeof value !== "string") {
      return
    }

    tempFrontmatterData[key] = replaceTemplateVariables(reflection, value)
  })

  return tempFrontmatterData
}

function getUniqueTags(tags: Tag[]): Tag[] {
  const tagsMap = new Map<string, Tag>()
  tags.forEach((tag) => {
    const tagName = typeof tag === "string" ? tag : tag.name

    tagsMap.set(tagName, tag)
  })

  return Array.from(tagsMap.values())
}
