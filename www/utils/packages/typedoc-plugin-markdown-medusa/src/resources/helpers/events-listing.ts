import Handlebars from "handlebars"
import pkg from "slugify"
import { DeclarationReflection, ReflectionKind } from "typedoc"

const slugify = pkg.default

export default function () {
  Handlebars.registerHelper(
    "eventsListing",
    function (this: DeclarationReflection) {
      let eventVariables = this.children || []

      if (!eventVariables.length) {
        return ""
      }

      if (this.kind === ReflectionKind.Module) {
        eventVariables = eventVariables
          .map((eventVariable) => eventVariable.children || [])
          .flat()
      }

      const combinedEventVariables =
        combineEventVariablesByCategory(eventVariables)

      const content: string[] = []
      // Sort categories alphabetically
      const eventVariableCatEntries = Object.entries(
        combinedEventVariables
      ).sort(([catA], [catB]) => catA.localeCompare(catB))
      const hasMoreThanOneCategory = eventVariableCatEntries.length > 1

      eventVariableCatEntries.forEach(([category, events], index) => {
        const subtitleLevel = hasMoreThanOneCategory ? 3 : 2
        const showHeader = category && hasMoreThanOneCategory
        content.push(
          formatEvents(events, {
            subtitleLevel,
            header: showHeader ? category : undefined,
          })
        )
        if (index < eventVariableCatEntries.length - 1) {
          content.push("")
          content.push("---")
          content.push("")
        }
      })

      return content.join("\n")
    }
  )
}

function combineEventVariablesByCategory(children: DeclarationReflection[]) {
  const combined: Record<string, DeclarationReflection[]> = {}

  children.forEach((child) => {
    if (
      child.type?.type !== "reflection" ||
      !child.type.declaration?.children
    ) {
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

function formatEvents(
  eventProperties: DeclarationReflection[],
  {
    subtitleLevel = 3,
    header = "",
  }: {
    subtitleLevel?: number
    header?: string
  }
) {
  const content: string[] = []
  const subHeaderPrefix = "#".repeat(subtitleLevel)
  if (header) {
    content.push(`${"#".repeat(subtitleLevel - 1)} ${header} Events`)
  }
  content.push("")

  content.push(`${subHeaderPrefix} Summary`)
  content.push("")
  // table start
  content.push(`<Table>`)
  // table header start
  content.push(`  <Table.Header>`)
  content.push(`    <Table.Row>`)
  content.push(`      <Table.HeaderCell>\nEvent\n</Table.HeaderCell>`)
  content.push(`      <Table.HeaderCell>\nDescription\n</Table.HeaderCell>`)
  // table header end
  content.push(`    </Table.Row>`)
  content.push(`  </Table.Header>`)
  // table body start
  content.push(`  <Table.Body>`)
  eventProperties.forEach((event) => {
    let eventName =
      event.comment?.blockTags
        .find((tag) => tag.tag === "@eventName")
        ?.content.map((content) => content.text)
        .join("") || ""
    if (!eventName) {
      return
    }
    eventName = `[${eventName}](#${getEventNameSlug(eventName)})`
    const eventDescription = event.comment?.summary
      .map((content) => content.text)
      .join("")
    const deprecationTag = event.comment?.blockTags.find(
      (tag) => tag.tag === "@deprecated"
    )

    if (deprecationTag) {
      eventName += `\n`
      const deprecationText = deprecationTag.content
        .map((content) => content.text)
        .join("")
        .trim()
      if (deprecationText.length) {
        eventName += `<Tooltip text="${deprecationText}">`
      }
      eventName += `<Badge variant="orange">Deprecated</Badge>`
      if (deprecationText.length) {
        eventName += `</Tooltip>`
      }
    }

    const sinceTag = event.comment?.blockTags.find(
      (tag) => tag.tag === "@since"
    )

    if (sinceTag) {
      eventName += `\n`
      const sinceText = sinceTag.content
        .map((content) => content.text)
        .join("")
        .trim()
      eventName += `<Tooltip text="This event was added in version v${sinceText}">`
      eventName += `<Badge variant="blue">v${sinceText}</Badge>`
      eventName += `</Tooltip>`
    }

    content.push(`    <Table.Row>`)
    content.push(`      <Table.Cell>\n${eventName}\n</Table.Cell>`)
    content.push(`      <Table.Cell>\n${eventDescription}\n</Table.Cell>`)
    content.push(`    </Table.Row>`)
  })
  // table body end
  content.push(`  </Table.Body>`)
  // table end
  content.push(`</Table>`)
  content.push("")

  eventProperties.forEach((event, index) => {
    const eventName = event.comment?.blockTags
      .find((tag) => tag.tag === "@eventName")
      ?.content.map((content) => content.text)
      .join("")
    if (!eventName) {
      return
    }
    const eventDescription = event.comment?.summary
      .map((content) => content.text)
      .join("")
    const eventPayload = event.comment?.blockTags
      .find((tag) => tag.tag === "@eventPayload")
      ?.content.map((content) => content.text)
      .join("")
    const workflows = getEventWorkflows(event)
    const deprecatedTag = event.comment?.blockTags.find(
      (tag) => tag.tag === "@deprecated"
    )
    const deprecatedMessage = deprecatedTag?.content
      .map((content) => content.text)
      .join("")
      .trim()

    const sinceTag = event.comment?.blockTags.find(
      (tag) => tag.tag === "@since"
    )

    content.push(
      getEventHeading({
        titleLevel: subtitleLevel,
        eventName: eventName || "",
        payload: eventPayload || "",
        deprecated: !!deprecatedTag,
        deprecatedMessage,
        since: sinceTag
          ? sinceTag.content
              .map((content) => content.text)
              .join("")
              .trim()
          : undefined,
      })
    )
    content.push("")
    content.push(eventDescription || "")
    content.push("")
    content.push(`${subHeaderPrefix}# Payload`)
    content.push("")
    content.push(eventPayload || "")
    content.push("")
    if (workflows?.length) {
      content.push(
        `${subHeaderPrefix}# Workflows Emitting this Event\n\nThe following workflows emit this event when they're executed. These workflows are executed by Medusa's API routes. You can also view the events emitted by API routes in the [Store](https://docs.medusajs.com/api/store) and [Admin](https://docs.medusajs.com/api/admin) API references.`
      )
      content.push("")
      workflows.forEach((workflow) => {
        content.push(
          `- [${workflow}](/references/medusa-workflows/${workflow})`
        )
      })
      content.push("")
    }
    if (index < eventProperties.length - 1) {
      content.push("---")
      content.push("")
    }
  })

  return content.join("\n")
}

function getEventHeading({
  titleLevel,
  eventName,
  payload,
  deprecated = false,
  deprecatedMessage,
  since,
}: {
  titleLevel: number
  eventName: string
  payload: string
  deprecated?: boolean
  deprecatedMessage?: string
  since?: string
}) {
  const heading = [eventName]
  if (deprecated) {
    if (deprecatedMessage?.length) {
      heading.push(`<Tooltip text="${deprecatedMessage}">`)
    }

    heading.push(`<Badge variant="orange">Deprecated</Badge>`)

    if (deprecatedMessage?.length) {
      heading.push(`</Tooltip>`)
    }
  }
  if (since) {
    if (deprecated) {
      heading.push(`\n`)
    }
    heading.push(`<Tooltip text="This event was added in version v${since}">`)
    heading.push(`<Badge variant="blue">v${since}</Badge>`)
    heading.push(`</Tooltip>`)
  }
  return `<EventHeader headerLvl="${titleLevel}" headerProps={{ id: "${getEventNameSlug(
    eventName
  )}", children: (<>${heading.join(
    "\n"
  )}</>), className: "flex flex-wrap justify-center gap-docs_0.25" }} eventName="${eventName}" payload={\`${payload.replaceAll(
    "`",
    "\\`"
  )}\`} />`
}

function getEventNameSlug(eventName: string) {
  return slugify(eventName.replace(".", ""), { lower: true })
}

function getEventWorkflows(event: DeclarationReflection): string[] | undefined {
  return event.comment?.blockTags
    .find((tag) => tag.tag === "@workflows")
    ?.content.map((content) => content.text)
    .join("")
    .split(", ")
    .filter((text) => text.trim().length > 0)
}
