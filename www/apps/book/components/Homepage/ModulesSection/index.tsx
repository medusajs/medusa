import clsx from "clsx"
import { Card, CardProps, IconHeadline, PuzzleColoredIcon } from "docs-ui"
import { basePathUrl } from "../../../utils/base-path-url"

const HomepageModulesSection = () => {
  const sections: SectionProps[] = [
    {
      title: "Cart & Purchase",
      text: "Checkout, Total calculations, and more",
      modules: [
        {
          title: "Cart",
          text: "Add to cart, checkout, and totals.",
          href: "/resources/commerce-modules/cart",
          image: basePathUrl("/images/cart-icon.png"),
        },
        {
          title: "Payment",
          text: "Process any payment type.",
          href: "/resources/commerce-modules/payment",
          image: basePathUrl("/images/payment-icon.png"),
        },
        {
          title: "Customer",
          text: "Customer and group management.",
          href: "/resources/commerce-modules/customer",
          image: basePathUrl("/images/customer-icon.png"),
        },
      ],
    },
    {
      title: "Merchandising",
      text: "Products, pricing, and promotions.",
      modules: [
        {
          title: "Pricing",
          text: "Configurable pricing engine",
          href: "/resources/commerce-modules/pricing",
          image: basePathUrl("/images/pricing-icon.png"),
        },
        {
          title: "Promotion",
          text: "Discounts and promotions",
          href: "/resources/commerce-modules/promotion",
          image: basePathUrl("/images/promotion-icon.png"),
        },
        {
          title: "Product",
          text: "Variants, categories, and bulk edits",
          href: "/resources/commerce-modules/product",
          image: basePathUrl("/images/product-icon.png"),
        },
      ],
    },
    {
      title: "Fulfillment",
      text: "OMS, fulfilment, and inventory.",
      modules: [
        {
          title: "Order",
          text: "Omnichannel order management",
          href: "/resources/commerce-modules/order",
          image: basePathUrl("/images/order-icon.png"),
        },
        {
          title: "Inventory",
          text: "Multi-warehouse and reservations",
          href: "/resources/commerce-modules/inventory",
          image: basePathUrl("/images/inventory-icon.png"),
        },
        {
          title: "Fulfillment",
          text: "Order fulfillment and shipping",
          href: "/resources/commerce-modules/fulfillment",
          image: basePathUrl("/images/fulfillment-icon.png"),
        },
        {
          title: "Stock Location",
          text: "Locations of stock-kept items",
          href: "/resources/commerce-modules/stock-location",
          image: basePathUrl("/images/stock-location-icon.png"),
        },
      ],
    },
    {
      title: "Regions & Channels",
      text: "Multi-region and omnichannel support.",
      modules: [
        {
          title: "Region",
          text: "Cross-border commerce",
          href: "/resources/commerce-modules/region",
          image: basePathUrl("/images/region-icon.png"),
        },
        {
          title: "Sales Channel",
          text: "Omnichannel sales",
          href: "/resources/commerce-modules/sales-channel",
          image: basePathUrl("/images/sales-channel-icon.png"),
        },
        {
          title: "Tax",
          text: "Granular tax control",
          href: "/resources/commerce-modules/tax",
          image: basePathUrl("/images/tax-icon.png"),
        },
        {
          title: "Currency",
          text: "Multi-currency support",
          href: "/resources/commerce-modules/currency",
          image: basePathUrl("/images/currency-icon.png"),
        },
      ],
    },
    {
      title: "User Access",
      text: "API keys and authentication.",
      modules: [
        {
          title: "API Keys",
          text: "Store and admin access",
          href: "/resources/commerce-modules/api-key",
          image: basePathUrl("/images/api-key-icon.png"),
        },
        {
          title: "User Module",
          text: "Admin user management",
          href: "/resources/commerce-modules/user",
          image: basePathUrl("/images/user-icon.png"),
        },
        {
          title: "Auth",
          text: "Integrate authentication methods",
          href: "/resources/commerce-modules/auth",
          image: basePathUrl("/images/auth-icon.png"),
        },
      ],
    },
  ]

  return (
    <div className="py-4 w-full border-y border-medusa-border-base">
      <div
        className={clsx(
          "flex flex-col",
          "gap-[40px] xs:gap-4",
          "xl:mx-auto xl:max-w-[1136px] w-full px-1 sm:px-4 xl:px-0"
        )}
      >
        <div className="flex flex-col gap-0.5 lg:max-w-[560px]">
          <IconHeadline
            title="Browse Commerce Modules"
            icon={<PuzzleColoredIcon />}
          />
          <h2 className="text-medusa-fg-base text-h1">
            All commerce features are provided as extendable modules in Medusa.
          </h2>
          <span className="text-medusa-fg-subtle text-small-plus">
            Click on any of the commerce modules below to learn more about their
            commerce features, and how to extend and use them for your custom
            use-case.
          </span>
        </div>
        {sections.map((section, index) => (
          <Section {...section} key={index} />
        ))}
      </div>
    </div>
  )
}

type SectionProps = {
  title: string
  text: string
  modules: Omit<CardProps, "type">[]
}

const Section = ({ title, text, modules }: SectionProps) => {
  return (
    <div
      className={clsx("flex flex-col lg:flex-row", "gap-1.5 xs:gap-2 lg:gap-4")}
    >
      <div className="flex flex-col gap-0.5 text-medusa-fg-base w-full lg:w-1/3">
        <h3 className="text-small-plus">{title}</h3>
        <span className="text-h2">{text}</span>
      </div>
      <div
        className={clsx(
          "grid xs:grid-cols-2 xs:grid-rows-2",
          "grid-cols-1 grid-rows-1",
          "lg:gap-x-4 lg:gap-y-0.75 gap-0.75",
          "w-full lg:w-2/3"
        )}
      >
        {modules.map((card, index) => (
          <Card {...card} type="default" key={index} />
        ))}
      </div>
    </div>
  )
}

export default HomepageModulesSection
