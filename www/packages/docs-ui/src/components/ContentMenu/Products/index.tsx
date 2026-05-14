"use client"

import React, { useMemo } from "react"
import { useSiteConfig } from "@/providers/SiteConfig"
import { products } from "../../../constants"
import { Product } from "types"
import { BorderedIcon } from "../../BorderedIcon"
import clsx from "clsx"
import { ContentMenuSection } from "../Section"

export const ContentMenuProducts = () => {
  const { frontmatter, config } = useSiteConfig()

  const loadedProducts = useMemo(() => {
    return frontmatter.products
      ?.sort()
      .map((product) => {
        return products.find(
          (p) => p.name.toLowerCase() === product.toLowerCase()
        )
      })
      .filter(Boolean) as Product[]
  }, [frontmatter.products])

  if (!loadedProducts?.length) {
    return null
  }

  const getProductUrl = (product: Product) => {
    return `${config.baseUrl}${product.path}`
  }

  const getProductImageUrl = (product: Product) => {
    return `${config.basePath}${product.image}`
  }

  return (
    <ContentMenuSection
      title="Modules used"
      hideChildrenDivider={!config.contentMenuSections?.whatsNew}
    >
      <div className="flex flex-col gap-docs_0.5 p-docs_1">
        <span className="text-x-small-plus text-medusa-fg-muted">
          Modules used
        </span>
        {loadedProducts.map((product, index) => (
          <a
            key={index}
            href={getProductUrl(product)}
            className="flex gap-docs_0.5 items-center group"
            data-testid="product-link"
          >
            <BorderedIcon
              wrapperClassName={clsx("bg-medusa-bg-base")}
              icon={getProductImageUrl(product)}
              iconWidth={16}
              iconHeight={16}
            />
            <span
              className={
                "text-medusa-fg-subtle text-x-small-plus group-hover:text-medusa-fg-base transition-colors"
              }
            >
              {product.title}
            </span>
          </a>
        ))}
      </div>
    </ContentMenuSection>
  )
}
