import { ReactNode } from "react"
import { JsonViewSection } from "../common/json-view-section"
import { MetadataSection } from "../common/metadata-section"
import { RequiredPermissionsSection } from "../common/required-permissions-section"
import { LayoutComposer } from "./layout-composer"

export type DetailPageDefaultsOptions = {
  /** Render the metadata section. @default true */
  metadata?: boolean
  /** Render the JSON view section. @default true */
  jsonView?: boolean
  /** Render the required-permissions section. @default true */
  permissions?: boolean
}

/**
 * Returns the sections common to detail pages (metadata, JSON view, and
 * required permissions), each wrapped in a `LayoutComposer.Entry` with a
 * stable id so saved user preferences survive component renames.
 *
 * All three render by default. Pass an options object to opt out of any a
 * given page doesn't use, so the page renders exactly the set it always had:
 *
 * ```tsx
 * sections={{ main: <>{...coreContent}{detailPageDefaultEntries(entity)}</> }}
 * // metadata + json only:
 * {detailPageDefaultEntries(entity, { permissions: false })}
 * ```
 */
export function detailPageDefaultEntries(
  data: object,
  {
    metadata = true,
    jsonView = true,
    permissions = true,
  }: DetailPageDefaultsOptions = {}
): ReactNode {
  return (
    <>
      {metadata && (
        <LayoutComposer.Entry id="MetadataSection">
          <MetadataSection data={data} />
        </LayoutComposer.Entry>
      )}
      {jsonView && (
        <LayoutComposer.Entry id="JsonViewSection">
          <JsonViewSection data={data} />
        </LayoutComposer.Entry>
      )}
      {permissions && (
        <LayoutComposer.Entry id="RequiredPermissionsSection">
          <RequiredPermissionsSection />
        </LayoutComposer.Entry>
      )}
    </>
  )
}
