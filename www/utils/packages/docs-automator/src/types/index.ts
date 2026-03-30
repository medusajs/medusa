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
