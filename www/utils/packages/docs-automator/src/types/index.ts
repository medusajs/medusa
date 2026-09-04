export type DocProject = "book" | "resources" | "ui" | "user-guide"

export type PackageKind =
  | "module" // packages/modules/**
  | "core-flow" // packages/core/core-flows/**
  | "framework" // packages/core/framework/**, packages/core/utils/**
  | "admin" // packages/admin/**
  | "design-system" // packages/design-system/**
  | "cli" // packages/cli/**
  | "other" // everything else — included in prompt as advisory context

export interface ChangedPackage {
  /** Path relative to monorepo root, e.g. "packages/modules/product" */
  path: string
  /** Package name, e.g. "product" */
  name: string
  kind: PackageKind
  /** Changed file paths relative to monorepo root */
  files: string[]
  /** Unified diff (truncated) */
  diff: string
}

export interface DocProjectMapping {
  project: DocProject
  /** Absolute path to the doc project root (www/apps/<project>) */
  projectPath: string
  /** Monorepo-relative paths Claude is allowed to modify */
  writableContentDirs: string[]
  reason: string
}

export interface AnalysisResult {
  changedPackages: ChangedPackage[]
  affectedProjects: DocProjectMapping[]
  /** The prompt to pass to Claude Code Action */
  claudePrompt: string
  triggerCommitSha: string
}

export interface AnalyzeOptions {
  commitSha: string
  output?: string
  dryRun?: boolean
}

export interface CloudDispatchPayload {
  /** Natural language prose describing user-facing dashboard changes — no source code */
  descriptions: string
  /**
   * Short plain-language names of features that appear to be gated by a feature flag.
   * Populated by the cloud deployment analyzer; may be empty or absent.
   */
  featureFlaggedFeatures?: string[]
  /** Markdown release notes for a CLI release. Present only for CLI releases; may be empty. */
  releaseNotes?: string
  /** CLI release version, e.g. "0.1.11". Present only for CLI releases. */
  version?: string
}

export interface CloudAnalysisResult {
  affectedProjects: Array<{ project: "cloud"; reason: string }>
  /** The prompt to pass to Claude Code Action */
  claudePrompt: string
  /** Carried through from the dispatch payload for PR body generation */
  featureFlaggedFeatures: string[]
  /** Present only when a CLI-release changelog entry should be written. */
  changelog?: { version: string; notes: string; date?: string }
  /**
   * The dashboard changelog entry this deployment should produce. Present only
   * when the dispatch carries dashboard changes. The workflow reads it to find
   * the entry file Claude was asked to write, so it can render and attach the
   * entry's banner image.
   */
  changelogEntry?: {
    /** The entry's date, in `YYYY-MM-DD` format. */
    date: string
    /** The same date formatted for display, e.g. `August 17, 2026`. */
    displayDate: string
    /** The entry file's path, relative to the repository root. */
    file: string
  }
}

export interface AnalyzeCloudOptions {
  dispatchFile: string
  output?: string
  dryRun?: boolean
}

/** How a webhook event or one of its properties changed in a release. */
export type WebhookChangeType = "added" | "updated" | "removed"

/**
 * A single property of a webhook event's payload. Maps directly to an item of
 * the `types` prop of the `TypeList` component used in the docs.
 */
export interface WebhookProperty {
  /** Property name, e.g. "commit_sha" */
  name: string
  /** Type as shown in the docs, e.g. "string" or "object" */
  type: string
  description?: string
  optional?: boolean
  defaultValue?: string
  /** Nested properties for object types */
  children?: WebhookProperty[]
}

/** A property-level change, used for the changelog and the inline notes. */
export interface WebhookPropertyChange {
  /** Property path, e.g. "data.commit_sha" */
  property: string
  changeType: WebhookChangeType
  /** Optional extra context, e.g. "use `data.commit.sha` instead" */
  description?: string
}

export interface WebhookEvent {
  /** Event name, e.g. "deployment.succeeded" */
  event: string
  changeType: WebhookChangeType
  /** One-sentence description of when the event is delivered */
  description?: string
  /**
   * The full payload schema after this release. Required for `added` and
   * `updated` events, ignored for `removed` ones.
   */
  properties?: WebhookProperty[]
  /** Example payload, either as an object or a pre-serialized JSON string */
  example?: unknown
  /** Property-level changes introduced by this release */
  propertyChanges?: WebhookPropertyChange[]
  /** Name of the feature flag gating the event, if any */
  featureFlag?: string
}

export interface WebhooksDispatchPayload {
  /** The webhook events added, updated, or removed in this release */
  webhooks?: WebhookEvent[]
  /**
   * Free-form prose describing webhook changes that aren't expressible as
   * structured events, e.g. changes to delivery, retries, or signatures.
   */
  descriptions?: string
  /**
   * The date the changes went live, as `YYYY-MM-DD`. Defaults to the date the
   * automation runs. Webhook docs are dated, not versioned.
   */
  releasedAt?: string
}

export interface WebhooksAnalysisResult {
  affectedProjects: Array<{ project: "cloud"; reason: string }>
  /** The prompt to pass to Claude Code Action */
  claudePrompt: string
  /** Carried through from the dispatch payload for PR body generation */
  featureFlaggedFeatures: string[]
  /** The human-readable date used for changelog and inline notes */
  changelogDate: string
  /** One line per change, used in the PR body */
  changeSummary: string[]
}

export interface AnalyzeWebhooksOptions {
  dispatchFile: string
  output?: string
  dryRun?: boolean
}
