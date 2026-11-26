"use client"

import clsx from "clsx"
import { HeadlineTags, ShadedBlock, useMobile } from "docs-ui"
import React, { useState } from "react"
import { HomepageHorizontalDottedSeparator } from "../../DottedSeparator/Horizontal"
import HomepageEdges from "../../Edges"
import CloudSectionDeploymentsIllustration from "../Illustrations/deployments"
import CloudSectionPreviewEnvironmentsIllustration from "../Illustrations/preview-environments"
import CloudSectionSearchIllustration from "../Illustrations/search"
import CloudSectionEmailsIllustration from "../Illustrations/emails"
import CloudSectionPaymentsIllustration from "../Illustrations/payments"
import CloudSectionMonitoringIllustration from "../Illustrations/monitoring"
import CloudSectionSecurityIllustration from "../Illustrations/security"

type Tab = {
  title: string
  content: string
  link: string
  Illustration: React.ComponentType<{ className?: string }>
}

const tabs: Tab[] = [
  {
    title: "Deployments",
    content:
      "Push to GitHub and go live. Every commit builds and deploys automatically.",
    link: "https://docs.medusajs.com/cloud/deployments",
    Illustration: CloudSectionDeploymentsIllustration,
  },
  {
    title: "Preview environments",
    content:
      "Every pull request gets its own live environment, so you can review changes before they ship.",
    link: "https://docs.medusajs.com/cloud/environments/preview",
    Illustration: CloudSectionPreviewEnvironmentsIllustration,
  },
  {
    title: "Medusa Payments",
    content:
      "Take payments at checkout with Medusa Payments, powered by Stripe, and manage payouts and disputes from the Cloud dashboard.",
    link: "https://docs.medusajs.com/cloud/payments",
    Illustration: CloudSectionPaymentsIllustration,
  },
  {
    title: "Medusa Search",
    content:
      "Help customers find the right product fast with full-text and semantic search.",
    link: "https://docs.medusajs.com/cloud/search",
    Illustration: CloudSectionSearchIllustration,
  },
  {
    title: "Medusa Emails",
    content:
      "Send order confirmations and password resets out of the box, with no email provider to set up.",
    link: "https://docs.medusajs.com/cloud/emails",
    Illustration: CloudSectionEmailsIllustration,
  },
  {
    title: "Monitoring",
    content:
      "See logs, performance, and usage for every environment, and catch issues before customers do.",
    link: "https://docs.medusajs.com/cloud/monitoring",
    Illustration: CloudSectionMonitoringIllustration,
  },
  {
    title: "Enterprise security",
    content:
      "Control who can do what with role-based access, and let your team sign in with SSO.",
    link: "https://docs.medusajs.com/cloud/enterprise",
    Illustration: CloudSectionSecurityIllustration,
  },
]

const HomepageCloudTabs = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { isMobile } = useMobile()

  return (
    <div
      className={clsx(
        "w-full border-b border-medusa-border-base",
        "flex gap-0 flex-col lg:flex-row"
      )}
    >
      <div className="w-full lg:w-1/2 flex flex-col gap-0 border-r border-medusa-border-base">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <button
              className={clsx(
                "px-2 py-1.5 appearance-none text-left",
                "flex flex-col gap-0.5 group"
              )}
              aria-expanded={index === selectedTabIndex}
              onClick={() => setSelectedTabIndex(index)}
            >
              <div className="flex items-center gap-0.5">
                <span
                  className={clsx(
                    "text-code-label group-hover:text-medusa-fg-interactive",
                    index === selectedTabIndex && "text-medusa-fg-interactive",
                    index !== selectedTabIndex && "text-medusa-fg-subtle"
                  )}
                >
                  [ {index + 1} ]
                </span>
                <span className="text-medium-plus text-medusa-fg-base">
                  {tab.title}
                </span>
              </div>
              {index === selectedTabIndex && (
                <p className="text-medusa-fg-subtle text-medium">
                  {tab.content}
                </p>
              )}
            </button>
            {index !== tabs.length - 1 && <HomepageHorizontalDottedSeparator />}
            {isMobile && index === selectedTabIndex && (
              <>
                <IllustrationSection tab={tab} />
                <HomepageHorizontalDottedSeparator />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
      {!isMobile && <IllustrationSection tab={tabs[selectedTabIndex]} />}
    </div>
  )
}

export default HomepageCloudTabs

type IllustrationSectionProps = {
  tab: Tab
}

const IllustrationSection = ({ tab }: IllustrationSectionProps) => {
  return (
    <div className="w-full lg:w-1/2 p-2 flex flex-col gap-2 justify-between bg-medusa-bg-component relative">
      <ShadedBlock className="!h-2" />
      <div className="flex flex-1 justify-center items-center">
        <tab.Illustration className="w-full max-w-[400px] h-auto" />
      </div>
      <ShadedBlock className="!h-2" />
      <HeadlineTags
        tags={[
          tab.title,
          {
            text: "Learn more",
            link: tab.link,
          },
        ]}
      />
      <HomepageEdges />
    </div>
  )
}
