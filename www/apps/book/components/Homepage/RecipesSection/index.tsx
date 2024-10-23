import clsx from "clsx"
import {
  CalendarRefreshIcon,
  Card,
  CardProps,
  ChefHatIcon,
  IconHeadline,
  ImageBinaryIcon,
  Link,
  ScrollTextIcon,
  ShopIcon,
} from "docs-ui"

const HomepageRecipesSection = () => {
  const cards: CardProps[] = [
    {
      type: "large",
      title: "Marketplace",
      text: "Build a marketplace with multiple vendors",
      href: "https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors",
      icon: ShopIcon,
    },
    {
      type: "large",
      title: "Subscriptions",
      text: "Implement a subscription-based commerce store.",
      href: "https://docs.medusajs.com/resources/recipes/subscriptions/examples/standard",
      icon: CalendarRefreshIcon,
    },
    {
      type: "large",
      title: "Restaurant-Delivery",
      text: "Build a restaurant marketplace inspired by UberEats, with real-time delivery handling",
      href: "https://docs.medusajs.com/resources/recipes/marketplace/examples/restaurant-delivery",
      icon: ChefHatIcon,
    },
    {
      type: "large",
      title: "Digital Products",
      text: "Sell digital products with custom fulfillment.",
      href: "https://docs.medusajs.com/resources/recipes/digital-products/examples/standard",
      icon: ImageBinaryIcon,
    },
  ]
  return (
    <div className={clsx("py-4 w-full")}>
      <div
        className={clsx(
          "flex flex-col lg:flex-row",
          "gap-2 lg:gap-4",
          "xl:mx-auto xl:max-w-[1136px] w-full px-1 sm:px-4 xl:px-0"
        )}
      >
        <div className="flex flex-col gap-1 w-full lg:w-1/3 xl:max-w-[336px]">
          <div className="flex flex-col gap-0.5">
            <IconHeadline title="Recipes" icon={<ScrollTextIcon />} />
            <h2 className="text-h1 text-medusa-fg-base">
              Medusa’s framework supports any business use case.
            </h2>
            <span className="text-medusa-fg-subtle text-small-plus">
              These recipes show how you to build a use case by customizing and
              extending existing data models and features, or creating new ones.
            </span>
          </div>
          <Link
            href={"https://docs.medusajs.com/resources/recipes"}
            className="flex gap-0.25 items-center text-compact-small-plus"
            withIcon
          >
            <span>View All Recipes</span>
          </Link>
        </div>
        <div
          className={clsx(
            "grid xs:grid-cols-2 xs:grid-rows-2 lg:gap-x-4 lg:gap-y-1.5",
            "xs:gap-x-1.5 xs:gap-y-2 grid-cols-1 gap-1.5",
            "w-full lg:w-2/3"
          )}
        >
          {cards.map((card, index) => (
            <Card {...card} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomepageRecipesSection
