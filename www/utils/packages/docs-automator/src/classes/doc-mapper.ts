import path from "path"
import {
  ChangedPackage,
  DocProject,
  DocProjectMapping,
  PackageKind,
} from "../types/index.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"

const KIND_TO_PROJECTS: Record<PackageKind, DocProject[]> = {
  module: ["book", "resources"],
  "core-flow": ["book", "resources"],
  framework: ["book", "resources"],
  // admin casts wide: book+resources for widget/route extension docs,
  // user-guide for UI behavior. Claude decides which applies.
  admin: ["book", "resources", "user-guide"],
  // design-system casts wide: book+resources if component API changed,
  // ui always. Claude decides which applies.
  "design-system": ["book", "resources", "ui"],
  // CLI tools primarily affect resources docs.
  cli: ["resources"],
  // "other" is included as advisory context — Claude decides if updates
  // are needed. Map to all projects so the writable dirs are available.
  other: ["book", "resources", "user-guide"],
}

const WRITABLE_DIRS: Record<DocProject, string[]> = {
  book: ["www/apps/book/app"],
  resources: ["www/apps/resources/app"],
  ui: ["www/apps/ui/app", "www/apps/ui/specs/examples"],
  "user-guide": ["www/apps/user-guide/app"],
}

export class DocMapper {
  private monorepoRoot: string

  constructor() {
    this.monorepoRoot = getMonorepoRoot()
  }

  map(changedPackages: ChangedPackage[]): DocProjectMapping[] {
    const projectSet = new Set<DocProject>()

    for (const pkg of changedPackages) {
      const projects = KIND_TO_PROJECTS[pkg.kind] ?? []
      for (const project of projects) {
        projectSet.add(project)
      }
    }

    return [...projectSet].map((project) =>
      this.buildMapping(project, changedPackages)
    )
  }

  private buildMapping(
    project: DocProject,
    changedPackages: ChangedPackage[]
  ): DocProjectMapping {
    const relevantPackages = changedPackages.filter((pkg) =>
      (KIND_TO_PROJECTS[pkg.kind] ?? []).includes(project)
    )
    const reason = relevantPackages
      .map((pkg) => `${pkg.name} (${pkg.kind})`)
      .join(", ")

    return {
      project,
      projectPath: path.join(this.monorepoRoot, "www", "apps", project),
      writableContentDirs: WRITABLE_DIRS[project].map((dir) =>
        path.join(this.monorepoRoot, dir)
      ),
      reason: `Changes in: ${reason}`,
    }
  }
}
