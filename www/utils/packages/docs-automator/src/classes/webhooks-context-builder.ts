import {
  WebhookEvent,
  WebhookProperty,
  WebhookPropertyChange,
  WebhooksAnalysisResult,
  WebhooksDispatchPayload,
} from "../types/index.js"

const REFERENCE_PAGE = "www/apps/cloud/app/webhooks/page.mdx"
const CHANGELOG_PAGE = "www/apps/cloud/app/webhooks/changelog/page.mdx"

/**
 * Builds the Claude prompt that updates the Cloud webhooks reference and
 * changelog pages from a webhook deployment dispatch payload.
 *
 * Webhook docs are dated rather than versioned, so every entry is keyed by the
 * date the change went live.
 *
 * Everything that must be accurate (payload schemas, example payloads, and
 * changelog entries) is rendered here as ready-to-paste MDX so that Claude
 * only decides placement and prose, never the schema itself.
 */
export class WebhooksContextBuilder {
  build(
    payload: WebhooksDispatchPayload,
    fallbackDate: Date
  ): WebhooksAnalysisResult {
    const events = payload.webhooks ?? []
    const changelogDate = this.formatDate(payload.releasedAt, fallbackDate)

    return {
      affectedProjects: [
        {
          project: "cloud",
          reason: "Webhook event delivery changed in Cloud Production",
        },
      ],
      claudePrompt: this.buildPrompt(payload, events, changelogDate),
      featureFlaggedFeatures: events
        .filter((event) => !!event.featureFlag)
        .map((event) => `${event.event} (${event.featureFlag})`),
      changelogDate,
      changeSummary: events.map(
        (event) => `${this.pastTense(event.changeType)} \`${event.event}\``
      ),
    }
  }

  /**
   * Formats `YYYY-MM-DD` as "August 4, 2026". Falls back to the date the
   * automation runs when the payload doesn't carry a release date.
   */
  private formatDate(releasedAt: string | undefined, fallback: Date): string {
    const date = releasedAt ? new Date(`${releasedAt}T00:00:00Z`) : fallback

    if (Number.isNaN(date.getTime())) {
      throw new Error(
        `Invalid releasedAt value: ${releasedAt}. Expected YYYY-MM-DD.`
      )
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  }

  private pastTense(changeType: WebhookEvent["changeType"]): string {
    switch (changeType) {
      case "added":
        return "Added"
      case "removed":
        return "Removed"
      default:
        return "Updated"
    }
  }

  /** Wraps a value in a template literal, escaping what would break it. */
  private toTemplate(value: string): string {
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${")

    return `\`${escaped}\``
  }

  /** Types are shown as inline code in the docs, e.g. `` "`string`" ``. */
  private toTypeValue(type: string): string {
    return JSON.stringify(`\`${type.replace(/`/g, "")}\``)
  }

  private renderProperties(
    properties: WebhookProperty[],
    indentLevel: number
  ): string {
    const indent = " ".repeat(indentLevel * 2)
    const inner = " ".repeat((indentLevel + 1) * 2)

    return properties
      .map((property) => {
        const lines = [
          `${indent}{`,
          `${inner}name: ${JSON.stringify(property.name)},`,
          `${inner}type: ${this.toTypeValue(property.type)},`,
        ]

        if (property.description) {
          lines.push(
            `${inner}description: ${this.toTemplate(property.description)},`
          )
        }

        if (property.optional) {
          lines.push(`${inner}optional: true,`)
        }

        if (property.defaultValue) {
          lines.push(
            `${inner}defaultValue: ${this.toTemplate(property.defaultValue)},`
          )
        }

        if (property.children?.length) {
          lines.push(`${inner}children: [`)
          lines.push(this.renderProperties(property.children, indentLevel + 2))
          lines.push(`${inner}],`)
        }

        lines.push(`${indent}},`)

        return lines.join("\n")
      })
      .join("\n")
  }

  /** Renders the `TypeList` block documenting an event's payload. */
  private renderTypeList(event: WebhookEvent): string {
    if (!event.properties?.length) {
      return ""
    }

    return [
      `<TypeList`,
      `  types={[`,
      this.renderProperties(event.properties, 2),
      `  ]}`,
      `  sectionTitle="${event.event}"`,
      `/>`,
    ].join("\n")
  }

  /** Renders the example payload code block for an event. */
  private renderExample(event: WebhookEvent): string {
    if (event.example === undefined || event.example === null) {
      return ""
    }

    const json =
      typeof event.example === "string"
        ? event.example.trim()
        : JSON.stringify(event.example, null, 2)

    return ["```json", json, "```"].join("\n")
  }

  /** Renders the inline "Changes" note added under a changed event. */
  private renderChangesNote(
    changes: WebhookPropertyChange[],
    changelogDate: string
  ): string {
    if (!changes.length) {
      return ""
    }

    const lines = [`<Note title="Changes">`, ""]

    for (const change of changes) {
      lines.push(
        `- ${this.describePropertyChange(change, changelogDate)}`.trimEnd()
      )
    }

    lines.push("", "</Note>")

    return lines.join("\n")
  }

  private describePropertyChange(
    change: WebhookPropertyChange,
    changelogDate: string
  ): string {
    const verb =
      change.changeType === "added"
        ? "added"
        : change.changeType === "removed"
          ? "removed"
          : "changed"

    const sentence = `Medusa ${verb} the \`${change.property}\` property on ${changelogDate}.`

    return change.description ? `${sentence} ${change.description}` : sentence
  }

  /** Renders the full changelog entry for this release. */
  private renderChangelogEntry(
    events: WebhookEvent[],
    descriptions: string | undefined,
    changelogDate: string
  ): string {
    const lines = [`## ${changelogDate}`, ""]
    const sorted = [...events].sort((a, b) => a.event.localeCompare(b.event))

    for (const event of sorted) {
      lines.push(`### ${event.event}`, "")

      if (event.changeType === "added") {
        const suffix = event.description
          ? ` ${this.toSentence(event.description)}`
          : ""
        lines.push(`- Added the \`${event.event}\` event.${suffix}`)
      } else if (event.changeType === "removed") {
        lines.push(
          `- Removed the \`${event.event}\` event. Medusa no longer delivers it.`
        )
      }

      for (const change of event.propertyChanges ?? []) {
        const suffix = change.description ? ` ${change.description}` : ""
        lines.push(
          `- ${this.pastTense(change.changeType)} the \`${change.property}\` property.${suffix}`
        )
      }

      if (
        event.changeType === "updated" &&
        !(event.propertyChanges ?? []).length
      ) {
        const suffix = event.description
          ? ` ${this.toSentence(event.description)}`
          : ""
        lines.push(`- Updated the \`${event.event}\` event.${suffix}`)
      }

      lines.push("")
    }

    if (descriptions?.trim()) {
      lines.push("### Delivery", "", descriptions.trim(), "")
    }

    return lines.join("\n").trimEnd()
  }

  /** Makes sure a description reads as its own sentence in a bullet point. */
  private toSentence(description: string): string {
    const trimmed = description.trim()

    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
  }

  private buildPrompt(
    payload: WebhooksDispatchPayload,
    events: WebhookEvent[],
    changelogDate: string
  ): string {
    const sections: string[] = [
      this.buildSkillSection(),
      this.buildTaskSection(changelogDate),
      this.buildEventsSection(events, changelogDate),
    ]

    if (payload.descriptions?.trim()) {
      sections.push(this.buildDescriptionsSection(payload.descriptions.trim()))
    }

    sections.push(
      this.buildChangelogSection(
        this.renderChangelogEntry(events, payload.descriptions, changelogDate),
        changelogDate
      )
    )
    sections.push(this.buildAffectedProjectSection())
    sections.push(this.buildConstraintsSection())

    return sections.join("\n\n---\n\n")
  }

  private buildSkillSection(): string {
    return `## Instructions

Use the /writing-docs skill before making any documentation changes. Load the \`reference/cloud-style.md\` reference file from that skill. It contains the rules and patterns for writing Cloud documentation correctly, including the Webhooks section that describes the structure of the pages you're about to update.`
  }

  private buildTaskSection(changelogDate: string): string {
    return `## Task

Cloud's webhook event delivery changed in production on **${changelogDate}**. The sections below list every webhook event that was added, updated, or removed, along with ready-to-paste MDX for each one.

Your job is to:
1. Load the /writing-docs skill and read \`reference/cloud-style.md\`
2. Update the webhooks reference page at \`${REFERENCE_PAGE}\` so it documents every event exactly as described below, keeping events grouped by resource
3. Add the changelog entry to \`${CHANGELOG_PAGE}\`
4. Keep the \`## Events\` summary table on the reference page in sync: add a row for each new event, remove the row of each removed event, and update descriptions when they changed. Keep its rows in alphabetical order by event name

Webhook docs are dated, not versioned. Never introduce version numbers, and always use the date **${changelogDate}** for this release.`
  }

  /**
   * The reference page groups events by the resource they belong to, which is
   * the part of the event name before the dot. For example, `build.created`
   * belongs under the `## Build Events` heading.
   */
  private groupTitle(eventName: string): string {
    const resource = eventName.split(".")[0]
    const words = resource
      .split(/[-_]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

    return `${words.join(" ")} Events`
  }

  private buildEventsSection(
    events: WebhookEvent[],
    changelogDate: string
  ): string {
    if (!events.length) {
      return `## Webhook Events

No structured event changes were reported in this release. Only apply the prose changes described below, if any.`
    }

    // Keep events of the same resource together, alphabetically within each
    // group, so the prompt lists them in the order the page uses
    const groups = new Map<string, WebhookEvent[]>()
    for (const event of events) {
      const title = this.groupTitle(event.event)
      groups.set(title, [...(groups.get(title) ?? []), event])
    }

    const sortedGroups = [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([title, groupEvents]) =>
          [
            title,
            [...groupEvents].sort((a, b) => a.event.localeCompare(b.event)),
          ] as const
      )

    const blocks: string[] = []
    for (const [title, groupEvents] of sortedGroups) {
      blocks.push(
        [
          `### ${title}`,
          ``,
          `These events belong under the \`## ${title}\` heading on the reference page.`,
        ].join("\n")
      )

      for (const event of groupEvents) {
        blocks.push(this.buildEventBlock(event, changelogDate))
      }
    }

    return [
      `## Webhook Events`,
      ``,
      `The reference page groups events by the resource they belong to. Each group is a \`##\` heading, such as \`## ${this.groupTitle(events[0].event)}\`, with a one-sentence intro and one \`###\` subsection per event. Separate groups with \`---\` dividers, but not the events within a group.`,
      ``,
      `If a group heading doesn't exist yet, create it and write its intro sentence. Order groups alphabetically by their heading, and order events alphabetically within a group.`,
      ``,
      blocks.join("\n\n"),
    ].join("\n")
  }

  private buildEventBlock(event: WebhookEvent, changelogDate: string): string {
    const lines = [`#### \`${event.event}\` (${event.changeType})`, ``]

    if (event.changeType === "removed") {
      lines.push(
        `Remove the \`### ${event.event}\` subsection from \`${REFERENCE_PAGE}\`, along with its row in the \`## Events\` table. If it was the last event of the \`## ${this.groupTitle(event.event)}\` group, remove that heading and its intro too. Do not keep a placeholder section for it. The removal is recorded in the changelog entry instead.`
      )

      return lines.join("\n")
    }

    lines.push(
      `Use \`### ${event.event}\` as the subsection heading, under the \`## ${this.groupTitle(event.event)}\` heading.`,
      ``
    )

    if (event.description) {
      lines.push(
        `**Description to use in the section intro:** ${event.description}`,
        ``
      )
    }

    if (event.featureFlag) {
      lines.push(
        `> **Note:** This event is gated by the \`${event.featureFlag}\` feature flag and may not reach all users yet. Document it as normal.`,
        ``
      )
    }

    const typeList = this.renderTypeList(event)
    if (typeList) {
      lines.push(
        `**Payload.** Place this under a \`#### Payload\` heading, replacing the existing \`TypeList\` block for this event if there is one. Paste it exactly as-is:`,
        ``,
        "```mdx",
        typeList,
        "```",
        ``
      )
    }

    const example = this.renderExample(event)
    if (example) {
      lines.push(
        `**Example payload.** Place this under an \`#### Example Payload\` heading, replacing the existing example if there is one. Paste it exactly as-is:`,
        ``,
        "````mdx",
        example,
        "````",
        ``
      )
    }

    const note = this.renderChangesNote(
      event.propertyChanges ?? [],
      changelogDate
    )
    if (note) {
      lines.push(
        `**Changes note.** Place this directly after the section intro, above the \`#### Payload\` heading. If the section already has a \`Changes\` note, add these bullet points at the top of the existing note and keep the previous ones. Paste it exactly as-is:`,
        ``,
        "```mdx",
        note,
        "```",
        ``
      )
    }

    return lines.join("\n").trimEnd()
  }

  private buildDescriptionsSection(descriptions: string): string {
    return `## Other Webhook Changes

The following describes webhook changes that aren't tied to a single event, such as changes to delivery, headers, signatures, or retries. These descriptions contain no source code, only behavioral descriptions. Update the \`## Delivery Details\` section of \`${REFERENCE_PAGE}\` accordingly.

${descriptions}`
  }

  private buildChangelogSection(entry: string, changelogDate: string): string {
    return `## Webhooks Changelog

Record this release in the webhooks changelog page.

**Changelog page:** \`${CHANGELOG_PAGE}\`

Steps:
1. If \`${CHANGELOG_PAGE}\` does not exist, create it first: a \`metadata\` export with the title \`Webhooks Changelog\`, an \`# {metadata.title}\` heading, and a one-sentence intro explaining that it lists notable changes to Cloud's webhook events, newest first. Then add a sidebar entry for it in \`www/apps/cloud/sidebar.mjs\` under the Webhooks category.
2. Add the entry below **newest-first**, directly under the intro and above any existing date sections.
3. If a section for **${changelogDate}** already exists (this release may be re-run), merge the entry into it instead of adding a duplicate section.
4. Paste the entry exactly as-is. Do not rewrite, summarize, or invent events, properties, or dates.

Changelog entry:

${entry}`
  }

  private buildAffectedProjectSection(): string {
    return `## Affected Documentation Project

### cloud

**Project path:** \`www/apps/cloud\`

**Writable files (only modify these):**
- \`${REFERENCE_PAGE}\` — the webhook events reference
- \`${CHANGELOG_PAGE}\` — the dated webhooks changelog
- \`www/apps/cloud/sidebar.mjs\` — only if a page is missing from the sidebar

**Reference page structure:**
- \`## Webhooks Overview\` — what webhooks are and how Medusa delivers them
- \`## Delivery Details\` — headers, signature verification, and retries
- \`## Events\` — a summary table of every event, across all groups, linking to its section
- One \`## <Resource> Events\` section per resource, such as \`## Build Events\`, each starting with a one-sentence intro
- Within a group, one \`### <event name>\` subsection per event, each with a \`#### Payload\` (\`TypeList\`) and a \`#### Example Payload\` (JSON code block)`
  }

  private buildConstraintsSection(): string {
    return `## Hard Constraints

These are absolute rules. Violating them will cause the workflow to fail:

1. **Only write the files listed above.** Never create new pages under \`www/apps/cloud/app/webhooks/\`, since all events live on the single reference page
2. **Never modify \`www/apps/cloud/generated/\`** — auto-generated by \`yarn prep\`, which runs automatically after your session
3. **Do not run \`yarn prep\` or \`yarn lint:content\`** — these run automatically after your session ends
4. **Paste the provided MDX blocks verbatim.** Never edit a payload schema, example payload, or changelog entry, and never infer properties that aren't listed
5. **Never use version numbers for webhooks.** Webhook changes are dated
6. **Write "Medusa" as the subject, never "Cloud"**, for example "Medusa sends this event". Reserve "Cloud" for the platform as a place, such as "changes in Cloud"
7. **Do not document internal platform details.** Only document what a customer receiving webhooks can observe
8. **If a described change is too vague to document accurately, skip it** rather than guess`
  }
}
