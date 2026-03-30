import path from "path"
import {
  AnalysisResult,
  ChangedPackage,
  DocProjectMapping,
} from "../types/index.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"

export class ContextBuilder {
  private monorepoRoot: string

  constructor() {
    this.monorepoRoot = getMonorepoRoot()
  }

  build(
    changedPackages: ChangedPackage[],
    affectedProjects: DocProjectMapping[],
    commitSha: string
  ): AnalysisResult {
    const claudePrompt = this.buildPrompt(
      changedPackages,
      affectedProjects,
      commitSha
    )

    return {
      changedPackages,
      affectedProjects,
      claudePrompt,
      triggerCommitSha: commitSha,
    }
  }

  private buildPrompt(
    changedPackages: ChangedPackage[],
    affectedProjects: DocProjectMapping[],
    commitSha: string
  ): string {
    const sections: string[] = []

    const knownPackages = changedPackages.filter((p) => p.kind !== "other")
    const otherPackages = changedPackages.filter((p) => p.kind === "other")

    sections.push(this.buildSkillSection())
    sections.push(this.buildTaskSection(commitSha))
    sections.push(this.buildChangedPackagesSection(knownPackages))
    if (otherPackages.length > 0) {
      sections.push(this.buildOtherPackagesSection(otherPackages))
    }
    sections.push(this.buildAffectedProjectsSection(affectedProjects))
    sections.push(this.buildConstraintsSection())

    return sections.join("\n\n---\n\n")
  }

  private buildSkillSection(): string {
    return `## Instructions

Use the /writing-docs skill before making any documentation changes. This skill contains the rules and patterns for writing Medusa documentation correctly.`
  }

  private buildTaskSection(commitSha: string): string {
    return `## Task

Code changes were merged to the \`develop\` branch (commit: \`${commitSha}\`). Review the diffs below and make the necessary documentation updates across the affected documentation projects.

Your job is to:
1. Load the /writing-docs skill
2. Review each changed package diff
3. Determine which documentation actually needs updating (not all code changes need docs — the skill's \`when-to-document.md\` reference file explains the rules)
4. **When reviewing, also check whether the affected feature is already documented.** If a user-facing feature (CLI option, workflow, service method, config key, admin screen) appears in the diff but is missing from the docs, add it — even if the current diff is only a rename or modification, not a new addition.
5. Make targeted edits to the relevant MDX files in the listed writable directories
6. If a new page is needed, create it and add it to the appropriate sidebar file`
  }

  private buildChangedPackagesSection(
    changedPackages: ChangedPackage[]
  ): string {
    const lines: string[] = ["## Changed Packages"]

    for (const pkg of changedPackages) {
      lines.push(`### ${pkg.name} (${pkg.path})`)
      lines.push(`**Kind:** ${pkg.kind}`)
      lines.push(`**Changed files:**`)
      for (const file of pkg.files) {
        lines.push(`- \`${file}\``)
      }
      lines.push("")
      lines.push("**Diff:**")
      lines.push(pkg.diff)
    }

    return lines.join("\n")
  }

  private buildOtherPackagesSection(otherPackages: ChangedPackage[]): string {
    const lines: string[] = [
      "## Other Changed Packages",
      "",
      "The following packages changed but are not automatically mapped to a documentation project. Consider whether these changes require documentation updates — if so, make them in the writable directories listed in the Affected Documentation Projects section.",
    ]

    for (const pkg of otherPackages) {
      lines.push(`### ${pkg.name} (${pkg.path})`)
      lines.push(`**Changed files:**`)
      for (const file of pkg.files) {
        lines.push(`- \`${file}\``)
      }
      lines.push("")
      lines.push("**Diff:**")
      lines.push(pkg.diff)
    }

    return lines.join("\n")
  }

  private buildAffectedProjectsSection(
    affectedProjects: DocProjectMapping[]
  ): string {
    const lines: string[] = [
      "## Affected Documentation Projects",
      "",
      "These are the documentation projects that *may* need updates. Use the /writing-docs skill to determine which ones actually need changes based on the diffs above.",
    ]

    for (const project of affectedProjects) {
      const relProjectPath = path.relative(
        this.monorepoRoot,
        project.projectPath
      )
      lines.push(`### ${project.project}`)
      lines.push(`**Project path:** \`${relProjectPath}\``)
      lines.push(`**Reason selected:** ${project.reason}`)
      lines.push(`**Writable directories (only modify files within these):**`)
      for (const dir of project.writableContentDirs) {
        const relDir = path.relative(this.monorepoRoot, dir)
        lines.push(`- \`${relDir}\``)
      }
      lines.push("")
    }

    return lines.join("\n")
  }

  private buildConstraintsSection(): string {
    return `## Hard Constraints

These are absolute rules. Violating them will cause the workflow to fail:

1. **Never modify \`www/apps/resources/references/\`** — these files are auto-generated by a separate process
2. **Never modify \`www/apps/ui/specs/components/\`** — these files are auto-generated by a separate process
3. **Never modify \`www/apps/api-reference/\`** — this is managed by a separate process entirely
4. **Only write files within the listed writable directories** for each project
5. **Do not run \`yarn prep\` or \`yarn lint:content\`** — these will run automatically after your session ends
6. **Do not invent Cloudinary screenshot URLs** in user-guide files. Images will be added manually if needed.`
  }
}
