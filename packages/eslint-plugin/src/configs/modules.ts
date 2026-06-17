import type { Linter } from "eslint"
import { ruleId } from "../constants"
import { ignoresBlock, pluginBlock, tsParserBlock } from "./shared"

/**
 * Modules preset — the rules that govern a Medusa **module** (or provider)
 * package: its service(s), its module definition, and its data models.
 *
 * Unlike `recommended`, whose module rules are scoped to a `modules/`-nested
 * path (matching how modules live inside a Medusa application), this preset
 * targets the layout of a standalone module/provider package — Medusa's own
 * under `packages/modules`, or one a user authors as its own package:
 *
 * - Services — applied across the whole tree. These rules only report on
 *   classes extending `MedusaService`, so a broad scope is safe and needs no
 *   per-folder configuration.
 * - Module definition (`module-name-snake-case`) — scoped to the entry file
 *   `src/index.{ts,js}`, where `Module(...)` is called.
 * - Data models — scoped to model directories, where `model.define(...)` lives.
 * - `loader-must-be-exported-in-module-definition` inspects loader files (not
 *   the entry file), so it stays in the broad block alongside the service
 *   rules; it is self-guarding to loader paths.
 *
 * Each scoped block lists both a `src`-anchored pattern (for linting from a
 * module package root) and a recursive-glob-anchored pattern (for when the
 * package is nested, e.g. linted from a monorepo root).
 *
 * No rule in this preset needs type information, so the parser is configured
 * without `parserOptions.project` — the preset is zero-config.
 */
export function buildModules(plugin: unknown): Linter.Config[] {
  return [
    ignoresBlock,
    pluginBlock(plugin),
    tsParserBlock(),
    {
      // Services. `loader-must-be-exported-in-module-definition` is self-guarding
      // to loader files, so it rides along here rather than on the entry file.
      files: ["**/*.{ts,tsx}"],
      rules: {
        [ruleId("medusa-context-on-context-param")]: "warn",
        [ruleId("service-constructor-must-call-super")]: "error",
        [ruleId("service-methods-must-be-async")]: "error",
        [ruleId("use-inject-manager-on-public-methods")]: "warn",
        [ruleId("loader-must-be-exported-in-module-definition")]: "warn",
      },
    },
    {
      // Module definition — the `Module(...)` entry file.
      files: ["src/index.{ts,js}", "**/src/index.{ts,js}"],
      rules: {
        [ruleId("module-name-snake-case")]: "error",
      },
    },
    {
      // Data models.
      files: ["src/models/**/*.{ts,js}", "**/models/**/*.{ts,js}"],
      rules: {
        [ruleId("data-model-table-name-snake-case")]: "warn",
        [ruleId("link-no-cross-module-relationship")]: "error",
        [ruleId("no-reserved-default-properties-in-model")]: "error",
        [ruleId("primary-key-required")]: "warn",
      },
    },
  ]
}
