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
}

export interface CloudAnalysisResult {
  affectedProjects: Array<{ project: "cloud"; reason: string }>
  /** The prompt to pass to Claude Code Action */
  claudePrompt: string
  /** Carried through from the dispatch payload for PR body generation */
  featureFlaggedFeatures: string[]
}

export interface AnalyzeCloudOptions {
  dispatchFile: string
  output?: string
  dryRun?: boolean
}
