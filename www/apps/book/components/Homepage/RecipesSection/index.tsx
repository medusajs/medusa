import clsx from "clsx"
import RecipesSectionIcon from "./Icons/section"
import { HeadlineTags } from "docs-ui"
import RecipesMarketplaceIcon from "./Icons/marketplace"
import RecipesErpIcon from "./Icons/erp"
import RecipesBundledProductsIcon from "./Icons/bundled-products"
import RecipesSubscriptionsIcon from "./Icons/subscriptions"
import RecipesRestaurantIcon from "./Icons/restaurant"
import RecipesDigitalProductsIcon from "./Icons/digital-products"
import HomepageEdges from "../Edges"
import Link from "next/link"

type Card = {
  title: string
  description: string
  link: string
  icon: React.ReactNode
}

const HomepageRecipesSection = () => {
  const cards: Card[] = [
    {
      title: "Marketplace",
      description: "Build a marketplace with multiple vendors.",
      link: "https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors",
      icon: (
        <RecipesMarketplaceIcon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
      ),
    },
    {
      title: "ERP",
      description:
        "Integrate an ERP system to manage custom product prices, purchase rules, syncing orders, and more.",
      link: "https://docs.medusajs.com/resources/recipes/erp",
      icon: (
        <RecipesErpIcon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
      ),
    },
    {
      title: "Bundled Products",
      description:
        "Sell products as bundles with Admin and storefront customizations.",
      link: "https://docs.medusajs.com/resources/recipes/bundled-products/examples/standard",
      icon: (
        <RecipesBundledProductsIcon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
      ),
    },
    {
      title: "Subscriptions",
      description: "Implement a subscription-based commerce store.",
      link: "https://docs.medusajs.com/resources/recipes/subscriptions/examples/standard",
      icon: (
        <RecipesSubscriptionsIcon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
      ),
    },
    {
      title: "Restaurant-Delivery",
      description:
        "Build a restaurant marketplace inspired by UberEats, with real-time delivery handling.",
      link: "https://docs.medusajs.com/resources/recipes/marketplace/examples/restaurant-delivery",
      icon: (
        <RecipesRestaurantIcon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
      ),
    },
    {
      title: "Digital Products",
      description: "Sell digital products with custom fulfillment.",
      link: "https://docs.medusajs.com/resources/recipes/digital-products/examples/standard",
      icon: (
        <RecipesDigitalProductsIcon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
      ),
    },
  ]
  return (
    <div className="w-full border-b border-medusa-border-base">
      <div className="flex flex-col md:flex-row gap-0 justify-center border-b border-medusa-border-base">
        <div
          className={clsx(
            "w-full md:w-1/2 lg:w-1/3 bg-medusa-bg-component p-2",
            "flex justify-center items-center",
            "md:border-r border-medusa-border-base",
            "border-b md:border-b-0"
          )}
        >
          <RecipesSectionIcon />
        </div>
        <div
          className={clsx(
            "w-full md:w-1/2 lg:w-2/3 py-4 px-2",
            "flex flex-col gap-0.75 justify-center"
          )}
        >
          <HeadlineTags
            tags={[
              "Recipes",
              {
                text: "View all",
                link: "https://docs.medusajs.com/resources/recipes",
              },
            ]}
            className="!justify-start"
          />
          <h2 className="text-h1 text-medusa-fg-base lg:max-w-[450px]">
            Medusa’s framework supports any business use case.
          </h2>
          <p className="txt-large text-medusa-fg-base">
            These recipes show you how to build a use case by customizing and
            extending existing data models and features, or creating new ones.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-0 flex-col sm:flex-row">
        {cards.map((card, index) => (
          <div
            key={index}
            className={clsx(
              "w-full sm:w-1/2 md:w-1/3 p-2 flex gap-1 flex-col",
              "border-b last:!border-b-0",
              index >= 3 && "md:border-b-0",
              index >= 4 && "sm:border-b-0",
              index % 3 !== 2 && "border-r",
              index === 2 && "border-r md:border-r-0",
              "border-medusa-border-base",
              "group relative"
            )}
          >
            <div
              className={clsx(
                "!h-[2px] bg-medusa-fg-interactive opacity-0 group-hover:opacity-100",
                "absolute -top-[2px] left-0 w-full transition-opacity duration-100"
              )}
            />
            <div
              className={clsx(
                "bg-medusa-alphas-alpha-6 border border-medusa-border-base",
                "w-3 h-3 flex justify-center items-center relative",
                "group-hover:bg-transparent group-hover:border-transparent",
                "transition-all duration-100"
              )}
            >
              {card.icon}
              <HomepageEdges className="group-hover:border-medusa-fg-interactive transition-colors duration-100" />
            </div>
            <div className="flex flex-col gap-0">
              <h3 className="text-medium-plus text-medusa-fg-base">
                {card.title}
              </h3>
              <p className="text-medium text-medusa-fg-subtle">
                {card.description}
              </p>
            </div>
            <Link
              href={card.link}
              className="absolute top-0 left-0 w-full h-full opacity-0"
            >
              Learn more
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomepageRecipesSection
