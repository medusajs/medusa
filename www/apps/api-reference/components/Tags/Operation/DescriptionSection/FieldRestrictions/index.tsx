"use client"

import React from "react"
import clsx from "clsx"
import { Details, DetailsSummary, Link } from "docs-ui"
import { useArea } from "@/providers/area"

export type TagsOperationDescriptionSectionFieldRestrictionsProps = {
  allowed?: string[]
  disallowed?: string[]
}

const TagsOperationDescriptionSectionFieldRestrictions = ({
  allowed,
  disallowed,
}: TagsOperationDescriptionSectionFieldRestrictionsProps) => {
  const { area } = useArea()
  const hasAllowed = (allowed?.length || 0) > 0

  return (
    <>
      <h3 className="border-medusa-border-base border-b py-1.5">
        Allowed and Disallowed Fields
      </h3>
      <div
        className="my-0.5 w-full pl-1 pb-0.5"
        data-testid="field-restrictions"
      >
        This API route restricts the fields and relations you can pass to the{" "}
        <code>fields</code> query parameter. Learn more in the{" "}
        <Link
          href={`/${area}/select-fields-and-relations#allowed-and-disallowed-fields`}
          variant="content"
        >
          Allowed and Disallowed Fields
        </Link>{" "}
        section.
      </div>
      {hasAllowed && (
        <Details
          summaryElm={
            <DetailsSummary
              title="Allowed"
              subtitle="Only these fields and relations can be retrieved in this API route."
            />
          }
          data-testid="field-restrictions-allowed"
        >
          <FieldList fields={allowed!} />
        </Details>
      )}
      {(disallowed?.length || 0) > 0 && (
        <Details
          summaryElm={
            <DetailsSummary
              title="Disallowed"
              subtitle="These fields and relations can never be retrieved in this API route."
            />
          }
          className={clsx(hasAllowed && "border-t-0")}
          data-testid="field-restrictions-disallowed"
        >
          <FieldList fields={disallowed!} />
        </Details>
      )}
    </>
  )
}

export default TagsOperationDescriptionSectionFieldRestrictions

const isPattern = (field: string) => /^\/.*\/[a-z]*$/.test(field)

const FieldList = ({ fields }: { fields: string[] }) => {
  const hasPatterns = fields.some(isPattern)

  return (
    <div className="my-0.5 w-full pl-1 pb-0.5 flex flex-col gap-0.5">
      <ul className="list-none flex flex-wrap gap-0.5 p-0 my-0">
        {fields.map((field) => (
          <li key={field} className="my-0">
            <span
              className={clsx(
                "font-monospace text-compact-small px-docs_0.5 py-docs_0.25",
                "bg-medusa-bg-component border border-solid border-medusa-border-base",
                "rounded-docs_sm",
                isPattern(field)
                  ? "text-medusa-fg-muted"
                  : "text-medusa-fg-subtle"
              )}
            >
              {field}
            </span>
          </li>
        ))}
      </ul>
      {hasPatterns && (
        <span className="text-medusa-fg-muted">
          Fields wrapped in <code>/.../</code> are regular expressions that
          match a family of fields or relations.
        </span>
      )}
    </div>
  )
}
