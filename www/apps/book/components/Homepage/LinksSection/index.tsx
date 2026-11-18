import clsx from "clsx"
import { HeadlineTags, ShadedBlock } from "docs-ui"
import Link from "next/link"

const HomepageLinksSection = () => {
  const links: {
    tag: string
    links: {
      text: string
      link: string
    }[]
  }[] = [
    {
      tag: "Get Started",
      links: [
        {
          link: "https://docs.medusajs.com/cloud/sign-up",
          text: "Sign up",
        },
        {
          link: "https://docs.medusajs.com/cloud/first-project",
          text: "Create your first project",
        },
        {
          link: "https://docs.medusajs.com/cloud/migrate-self-hosted",
          text: "Migrate from self-hosting",
        },
      ],
    },
    {
      tag: "Customize Medusa",
      links: [
        {
          link: "/learn",
          text: "Learn the Framework",
        },
        {
          link: "https://docs.medusajs.com/cloud/integrations",
          text: "Add integrations",
        },
        {
          link: "/learn/fundamentals/admin",
          text: "Extend the Admin",
        },
      ],
    },
    {
      tag: "Build with Agents",
      links: [
        {
          link: "https://docs.medusajs.com/cloud/ai-toolkit/medusa-mcp",
          text: "Medusa MCP",
        },
        {
          link: "https://docs.medusajs.com/cloud/ai-toolkit/agent-skills",
          text: "Agent Skills",
        },
        {
          link: "https://docs.medusajs.com/cloud/cli",
          text: "Cloud CLI",
        },
      ],
    },
  ]

  return (
    <div className="w-full flex gap-0 flex-col md:flex-row border-b border-medusa-border-base">
      {links.map((section, index) => (
        <div
          key={index}
          className={clsx(
            "p-2 flex justify-between flex-col w-full md:w-1/3 gap-2 md:min-h-[320px]",
            "border-medusa-border-base",
            index !== links.length - 1 && "border-b md:border-b-0 md:border-r"
          )}
        >
          <HeadlineTags tags={[section.tag]} className="!justify-start" />
          <div className="flex flex-col gap-0.75">
            {section.links.map((link, linkIndex) => (
              <div className="flex gap-0.75" key={linkIndex}>
                <ShadedBlock className="!w-2 min-h-2" />
                <Link
                  href={link.link}
                  className={clsx(
                    "flex-1 text-medusa-fg-base text-h2 hover:underline hover:text-medusa-fg-interactive"
                  )}
                >
                  {link.text}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomepageLinksSection
