import { IconProps } from "@medusajs/icons/dist/types"
import { HeadlineTags, ShadedBlock } from "docs-ui"
import {
  Buildings,
  BuildingTax,
  Cash,
  Channels,
  CreditCard,
  CurrencyDollar,
  FlyingBox,
  IdBadge,
  Key,
  ListCheckbox,
  Map,
  MapPin,
  ReceiptPercent,
  ShoppingCart,
  Tag,
  User,
  Users,
} from "@medusajs/icons"
import clsx from "clsx"
import HomepageNewsletter from "./Newsletter"
import Link from "next/link"

type SectionProps = {
  title: string
  modules: {
    name: string
    description: string
    link: string
    Icon: React.FC<IconProps>
  }[]
}

const HomepageCommerceModulesSection = () => {
  const sections: SectionProps[] = [
    {
      title: "Cart & Purchase",
      modules: [
        {
          name: "Cart",
          description: "Add to cart, checkout, and totals",
          link: "/resources/commerce-modules/cart",
          Icon: ShoppingCart,
        },
        {
          name: "Payment",
          description: "Process any payment type",
          link: "/resources/commerce-modules/payment",
          Icon: CreditCard,
        },
        {
          name: "Customer",
          description: "Customer and group management",
          link: "/resources/commerce-modules/customer",
          Icon: Users,
        },
      ],
    },
    {
      title: "Merchandising",
      modules: [
        {
          name: "Pricing",
          description: "Configurable pricing engine",
          link: "/resources/commerce-modules/pricing",
          Icon: CurrencyDollar,
        },
        {
          name: "Promotion",
          description: "Discounts and promotions",
          link: "/resources/commerce-modules/promotion",
          Icon: ReceiptPercent,
        },
        {
          name: "Product",
          description: "Variants, categories, and bulk edits",
          link: "/resources/commerce-modules/product",
          Icon: Tag,
        },
      ],
    },
    {
      title: "Fulfillment",
      modules: [
        {
          name: "Order",
          description: "Omnichannel order management",
          link: "/resources/commerce-modules/order",
          Icon: ListCheckbox,
        },
        {
          name: "Inventory",
          description: "Multi-warehouse and reservations",
          link: "/resources/commerce-modules/inventory",
          Icon: Buildings,
        },
        {
          name: "Fulfillment",
          description: "Order fulfillment and shipping",
          link: "/resources/commerce-modules/fulfillment",
          Icon: FlyingBox,
        },
        {
          name: "Stock Location",
          description: "Locations of stock-kept items",
          link: "/resources/commerce-modules/stock-location",
          Icon: MapPin,
        },
      ],
    },
    {
      title: "Regions & Channels",
      modules: [
        {
          name: "Region",
          description: "Cross-border commerce",
          link: "/resources/commerce-modules/region",
          Icon: Map,
        },
        {
          name: "Sales Channel",
          description: "Omnichannel sales",
          link: "/resources/commerce-modules/sales-channel",
          Icon: Channels,
        },
        {
          name: "Tax",
          description: "Granular tax control",
          link: "/resources/commerce-modules/tax",
          Icon: BuildingTax,
        },
        {
          name: "Currency",
          description: "Multi-currency support",
          link: "/resources/commerce-modules/currency",
          Icon: Cash,
        },
      ],
    },
    {
      title: "User Access",
      modules: [
        {
          name: "API Keys",
          description: "Store and admin access",
          link: "/resources/commerce-modules/api-key",
          Icon: Key,
        },
        {
          name: "User Module",
          description: "Admin user management",
          link: "/resources/commerce-modules/user",
          Icon: User,
        },
        {
          name: "Auth",
          description: "Integrate authentication methods",
          link: "/resources/commerce-modules/auth",
          Icon: IdBadge,
        },
      ],
    },
  ]
  return (
    <div className="w-full border-b border-medusa-border-base">
      <div className="p-2 flex gap-2 border-b border-medusa-border-base">
        <h2 className="text-h1 text-medusa-fg-base min-w-max">
          Commerce Modules
        </h2>
        <ShadedBlock className="w-full min-h-2" />
      </div>
      <div className="flex flex-wrap gap-0">
        {sections.map((section, index) => (
          <div
            key={index}
            className={clsx(
              "py-2 w-full sm:w-1/2 lg:w-1/3",
              "flex flex-col gap-1 items-start",
              "border-medusa-border-base",
              "border-b",
              index === 3 && "lg:border-b-0",
              index > 3 && "sm:border-b-0",
              index % 3 !== 2 && "border-r",
              index === 2 && "border-r lg:border-r-0"
            )}
          >
            <HeadlineTags tags={[section.title]} className="px-2" />
            {section.modules.map(({ Icon, ...module }, modIndex) => (
              <div
                key={modIndex}
                className="flex flex-col gap-0 group relative px-2 w-full"
              >
                <span className="absolute top-0 left-0 lg:-left-px w-[2px] h-full bg-transparent group-hover:bg-medusa-fg-interactive" />
                <div className="flex gap-0.5 items-center">
                  <Icon className="text-medusa-fg-subtle group-hover:text-medusa-fg-interactive" />
                  <span className="text-medusa-fg-base text-medium-plus">
                    {module.name}
                  </span>
                </div>
                <p className="text-medusa-fg-subtle text-medium">
                  {module.description}
                </p>
                <Link
                  href={module.link}
                  className="absolute left-0 top-0 w-full h-full opacity-0"
                >
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        ))}
        <HomepageNewsletter />
      </div>
    </div>
  )
}

export default HomepageCommerceModulesSection
