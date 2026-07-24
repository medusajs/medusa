import {
  apiRefIntroSections as rawIntroSections,
  apiRefPaths as rawPaths,
  apiRefRedirects as rawRedirects,
} from "@/generated/api-ref-paths.mjs"
import { OpenAPI } from "types"

export type ApiRefIntroSection = {
  slug: string
  title: string
}

export type ApiRefOperationEntry = {
  slug: string
  path: string
  oldHash: string
  title: string
  method: string
}

export type ApiRefTagEntry = {
  name: string
  path: string
  schemaPath: string | null
  operations: Record<string, ApiRefOperationEntry>
}

export type ApiRefAreaPaths = {
  intro: Record<string, string>
  tags: Record<string, ApiRefTagEntry>
}

/**
 * Typed accessors for the generated API-reference path/redirect maps. The
 * underlying `.mjs` is emitted with literal (non-indexable) types, so the
 * whole app reads these maps through this module instead.
 */
export const apiRefIntroSections = rawIntroSections as Record<
  OpenAPI.Area,
  ApiRefIntroSection[]
>

export const apiRefPaths = rawPaths as Record<OpenAPI.Area, ApiRefAreaPaths>

export const apiRefRedirects = rawRedirects as Record<
  OpenAPI.Area,
  Record<string, string>
>
