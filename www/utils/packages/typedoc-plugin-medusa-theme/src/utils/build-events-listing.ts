import Handlebars from "handlebars"
import pkg from "slugify"
import {
  ContainerReflection,
  DeclarationReflection,
  ReflectionKind,
} from "typedoc"
import type { DocBlock, DocEvent } from "types"

const slugify = pkg.default

/**
 * Builds the structured events reference listing (the `isEventsReference`
 * pages). Mirrors the data extraction of the `eventsListing` Handlebars helper:
 * event variables are grouped by their `@category` tag, and each event's
 * details come from its `@eventName` / `@eventPayload` / `@workflows` /
 * `@since` / `@deprecated` tags and summary.
 */
export function buildEventsListingBlock(
  model: ContainerReflection
): Extract<DocBlock, { kind: "eventsListing" }> | undefined {
  let eventVariables = (model.children || []) as DeclarationReflection[]
  if (!eventVariables.length) {
    return undefined
  }

  if (model.kind === ReflectionKind.Module) {
    eventVariables = eventVariables
      .map((eventVariable) => (eventVariable.children || []) as DeclarationReflection[])
      .flat()
  }

  const combined = combineEventVariablesByCategory(eventVariables)
  const categories = Object.entries(combined)
    .sort(([catA], [catB]) => catA.localeCompare(catB))
    .map(([title, events]) => ({
      title: title || undefined,
      events: events.map(extractEvent).filter((event): event is DocEvent =>
        Boolean(event)
      ),
    }))
    .filter((category) => category.events.length)

  if (!categories.length) {
    return undefined
  }

  return { kind: "eventsListing", categories }
}

function combineEventVariablesByCategory(
  children: DeclarationReflection[]
): Record<string, DeclarationReflection[]> {
  const combined: Record<string, DeclarationReflection[]> = {}

  children.forEach((child) => {
    if (child.type?.type !== "reflection" || !child.type.declaration?.children) {
      return
    }
    const header =
      child.comment?.blockTags
        .find((tag) => tag.tag === "@category")
        ?.content.map((content) => content.text)
        .join("") || ""

    if (!combined[header]) {
      combined[header] = []
    }
    combined[header].push(...child.type.declaration.children)
  })

  return combined
}

function extractEvent(event: DeclarationReflection): DocEvent | undefined {
  const name = getTagText(event, "@eventName")
  if (!name) {
    return undefined
  }

  const deprecatedTag = event.comment?.blockTags.find(
    (tag) => tag.tag === "@deprecated"
  )
  const since = getTagText(event, "@since")
  const workflows = [
    ...new Set(
      (getTagText(event, "@workflows") || "")
        .split(", ")
        .map((workflow) => workflow.trim())
        .filter(Boolean)
    ),
  ].map((workflow) => ({
    name: workflow,
    href: `/references/medusa-workflows/${workflow}`,
  }))

  return {
    name,
    id: slugify(name.replace(".", ""), { lower: true }),
    description: event.comment?.summary.length
      ? Handlebars.helpers.comment(event.comment.summary)
      : undefined,
    payload: getTagText(event, "@eventPayload") || undefined,
    workflows: workflows.length ? workflows : undefined,
    deprecated: deprecatedTag ? true : undefined,
    deprecatedMessage: deprecatedTag
      ? deprecatedTag.content.map((content) => content.text).join("").trim() ||
        undefined
      : undefined,
    since: since || undefined,
  }
}

function getTagText(
  reflection: DeclarationReflection,
  tag: `@${string}`
): string | undefined {
  return reflection.comment?.blockTags
    .find((blockTag) => blockTag.tag === tag)
    ?.content.map((content) => content.text)
    .join("")
}
