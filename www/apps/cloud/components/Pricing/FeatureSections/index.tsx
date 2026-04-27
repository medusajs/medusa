import React from "react"
import clsx from "clsx"
import {
  FeatureTableFields,
  Block,
  Span,
  TooltipBlock,
} from "../../../utils/types"
import { BorderedIcon, H3, MarkdownContent, MDXComponents } from "docs-ui"
import slugify from "slugify"
import {
  CodePullRequest,
  CurrencyDollar,
  EnvelopeContent,
  ServerStack,
  Shopping,
  Users,
  Window,
  WIP,
} from "@medusajs/icons"
import { config } from "../../../config"

const P = MDXComponents.p

interface FeatureSectionsProps {
  featureSections: FeatureTableFields["featureSections"]
  columnCount: number
  columns: string[]
}

const featureLinks: Record<string, string> = {
  orders: "/resources/commerce-modules/order",
  products: "/resources/commerce-modules/product",
  "sales channels": "/resources/commerce-modules/sales-channels",
  "regions & currencies": "/resources/commerce-modules/region",
  "github integration":
    "/cloud/projects#2-create-project-from-an-existing-application",
  "push-to-deploy flow": "/cloud/deployments#how-are-deployments-created",
  previews: "/cloud/environments/preview",
  "auto configuration:":
    "/cloud/projects#prerequisite-medusa-application-configurations",
  postgres: "/cloud/database",
  redis: "/cloud/redis",
  s3: "/cloud/s3",
  "environment variables": "/cloud/environments/environment-variables",
  "data import/export": "/cloud/database#importexport-database-dumps",
  logs: "/cloud/logs",
  "unlimited long-lived environments": "/cloud/environments/long-lived",
  "long-lived environments (lle)": "/cloud/environments/long-lived",
  "preview environments (pe)": "/cloud/environments/preview",
  "cloud seats": "/cloud/organizations#view-organization-members",
  "object storage": "/cloud/s3",
  "database storage": "/cloud/database",
  "key value store": "/cloud/redis",
  "admin dashboard users": "/user-guide/settings/users",
  "unlimited deployments": "/cloud/deployments",
  "traffic load balancing": "/cloud/comparison#auto-scaling",
  "log retention": "/cloud/logs",
  "real-time 24/7 monitoring": "/cloud/comparison#high-availability",
  "zero-downtime deployment": "/cloud/deployments",
  backups: "/cloud/database#cloud-database-backups",
  "performance tuning": "/cloud/comparison#performance",
  "sla-backed uptime": "/cloud/comparison#high-availability",
  support: "/cloud/comparison#support",
  "medusa cache": "/cloud/cache",
  "hosting of monorepos": "/cloud/projects/prerequisites#monorepo-setup",
  "custom domains": "/cloud/storefront#storefront-custom-domain",
  "storefront previews": "/cloud/environments/preview",
}

const featureIcons: Record<string, React.FC> = {
  "Commerce features": Shopping,
  "Development Platform": CodePullRequest,
  "Build & Deploy": ServerStack,
  "Compute & Resources": WIP,
  "Organization & Billing": CurrencyDollar,
  "Enterprise Support": Users,
  "Medusa Emails": EnvelopeContent,
  Storefronts: Window,
}

// Helper function to render Block content (Sanity rich text)
const renderBlockContent = (blocks: Block[]) => {
  if (!blocks || blocks.length === 0) {
    return ""
  }

  return blocks
    .map((block) => {
      if (block._type === "block" && block.children) {
        return block.children
          .map((child: Span | TooltipBlock) => {
            if (child._type === "span") {
              const key = child.text.trim().toLowerCase()
              return featureLinks[key]
                ? "[" +
                    child.text +
                    "](" +
                    config.baseUrl +
                    featureLinks[key] +
                    ")"
                : child.text
            }
            return ""
          })
          .join("  \n")
      }
      return ""
    })
    .join("  \n")
    .replaceAll("-", "\\-")
}

const FeatureSections: React.FC<FeatureSectionsProps> = ({
  featureSections,
  columnCount,
  columns,
}) => {
  if (!featureSections || featureSections.length === 0) {
    return null
  }

  // Calculate consistent column widths
  // Use fractional units to ensure all grids have matching column sizes
  const featureNameFraction = 2 // Feature name gets 2 units
  const featureColumnFraction = `minmax(0, 1fr)` // Each feature column gets 1 unit
  const gridTemplate = `${featureNameFraction}fr repeat(${columnCount}, ${featureColumnFraction})`

  return (
    <div className="w-full flex flex-col rounded shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark overflow-hidden">
      {/* Header */}
      <div
        className="w-full grid gap-0 rounded-t"
        style={{
          gridTemplateColumns: gridTemplate,
        }}
      >
        {/* Features label column */}
        <div className="flex items-center justify-start p-0.5 sm:px-1.5 sm:py-1 border-solid border-r border-medusa-border-base">
          <p className="txt-medium sm:txt-large text-medusa-fg-subtle">
            Features
          </p>
        </div>

        {/* Column headers */}
        {columns.map((column, index) => (
          <div
            key={index}
            className={clsx(
              "flex items-center justify-center p-0.25 sm:p-1 bg-medusa-bg-base",
              index !== columns.length - 1 &&
                "border-solid border-r border-medusa-border-base"
            )}
          >
            <p className="txt-medium sm:txt-large text-medusa-fg-base text-left w-full">
              {column}
            </p>
          </div>
        ))}
      </div>
      {/* Feature Sections */}
      {featureSections.map((section) => (
        <div key={section._key} className="w-full">
          {/* Section Header */}
          <div className="w-full p-1.5 bg-medusa-bg-component flex gap-1 border-medusa-border-base border-y items-center">
            {featureIcons[section.header.subtitle] && (
              <BorderedIcon
                IconComponent={featureIcons[section.header.subtitle]}
                wrapperClassName="p-[7.5px] bg-medusa-bg-component rounded-[5px]"
              />
            )}
            <div>
              <H3
                id={slugify(section.header.subtitle, { lower: true })}
                className="!my-0"
              >
                {section.header.subtitle}
              </H3>
              {/* @ts-expect-error this is a React component */}
              <P className="text-medusa-fg-subtle">{section.header.title}</P>
            </div>
          </div>

          {/* Section Rows */}
          <div className="w-full">
            {section.rows.map((row, index) => (
              <React.Fragment key={row._key}>
                <div
                  className={clsx(
                    "w-full grid gap-0 border-solid border-medusa-border-base",
                    index !== section.rows.length - 1 && "border-b"
                  )}
                  style={{
                    gridTemplateColumns: gridTemplate,
                  }}
                >
                  {/* Feature name column */}
                  <div className="p-0.25 sm:p-1 flex items-center justify-start border-solid border-r border-medusa-border-base">
                    <p className="txt-medium-plus text-medusa-fg-base">
                      <MarkdownContent
                        allowedElements={["br", "a"]}
                        unwrapDisallowed
                      >
                        {renderBlockContent(row.column1)}
                      </MarkdownContent>
                    </p>
                  </div>

                  {/* Feature value columns */}
                  {Array.from({ length: columnCount }, (_, colIndex) => {
                    const columnKey = `column${
                      colIndex + 2
                    }` as keyof typeof row
                    const columnData = row[columnKey] as Block[]

                    return (
                      <div
                        key={colIndex}
                        className={clsx(
                          "p-0.25 sm:p-1 flex items-center justify-center",
                          colIndex !== columnCount - 1 &&
                            "border-solid border-r border-medusa-border-base"
                        )}
                      >
                        <p className="txt-medium text-medusa-fg-base text-left w-full">
                          <MarkdownContent
                            allowedElements={["br", "a"]}
                            unwrapDisallowed
                          >
                            {renderBlockContent(columnData)}
                          </MarkdownContent>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeatureSections
