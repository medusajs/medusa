import clsx from "clsx"
import { Link } from "docs-ui"

const HomepageLinksSection = () => {
  const sections: SectionProps[] = [
    {
      title: "Customize Medusa Application",
      links: [
        {
          href: "/learn",
          text: "Create your first application",
        },
        {
          href: "/learn/customization",
          text: "Build a Module",
        },
        {
          href: "https://docs.medusajs.com/resources/integrations",
          text: "Browse third-party integrations",
        },
      ],
    },
    {
      title: "Admin Development",
      links: [
        {
          href: "/learn/basics/admin-customizations",
          text: "Build a UI Widget",
        },
        {
          href: "/learn/advanced-development/admin/ui-routes",
          text: "Add a UI Route",
        },
        {
          href: "https://docs.medusajs.com/ui",
          text: "Browse the UI component library",
        },
      ],
    },
    {
      title: "Storefront Development",
      links: [
        {
          href: "https://docs.medusajs.com/resources/nextjs-starter",
          text: "Explore our storefront starter",
        },
        {
          href: "https://docs.medusajs.com/resources/storefront-development",
          text: "Build a custom storefront",
        },
        {
          href: "https://docs.medusajs.com/ui",
          text: "Browse the UI component library",
        },
      ],
    },
  ]
  return (
    <div
      className={clsx(
        "hidden lg:block py-4 w-full",
        "border-y border-medusa-border-base xl:mx-auto"
      )}
    >
      <div className="flex gap-4 flex-wrap xl:mx-auto xl:max-w-[1136px] w-full px-4 xl:px-0">
        {sections.map((section, index) => (
          <Section {...section} key={index} />
        ))}
      </div>
    </div>
  )
}

type SectionProps = {
  title: string
  links: {
    text: string
    href: string
  }[]
}

const Section = ({ title, links }: SectionProps) => {
  return (
    <div className="flex flex-col gap-0.5 flex-1">
      <h3 className="text-h3 text-medusa-fg-base">{title}</h3>
      {links.map((link, index) => (
        <Link key={index} className="text-compact-small-plus" href={link.href}>
          {link.text}
        </Link>
      ))}
    </div>
  )
}

export default HomepageLinksSection
