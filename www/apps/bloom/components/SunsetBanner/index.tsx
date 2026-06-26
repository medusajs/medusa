"use client"

import React from "react"
import { Link, useModal } from "docs-ui"
import clsx from "clsx"

const CLOUD_CLI_DOCS_URL =
  "https://docs.medusajs.com/learn/introduction/build-with-llms-ai/cloud-cli"
const BUILDING_WITH_AGENTS_DOCS_URL =
  "https://docs.medusajs.com/learn/introduction/build-with-llms-ai"

const SunsetModalContent = () => {
  return (
    <div className="flex flex-col gap-docs_1 text-medusa-fg-subtle text-medium">
      <p>
        We&apos;re sunsetting Bloom. The service will shut down on 1 July 2026.
      </p>
      <p>
        This wasn&apos;t an easy call. We&apos;ve decided to focus on making
        local coding agents, such Claude Code and Codex, work better with Medusa
        Cloud.
      </p>
      <p>
        That&apos;s where the tooling is stronger, and where we think we can
        have the most impact.
      </p>
      <p>
        If you want to continue building on Medusa, here are some helpful
        resources documenting how a local agent setup works:
      </p>
      <ul className="flex flex-col gap-docs_0.5 list-disc pl-docs_1.5">
        <li>
          <Link href={CLOUD_CLI_DOCS_URL}>Medusa Cloud CLI for agents</Link>
        </li>
        <li>
          <Link href={BUILDING_WITH_AGENTS_DOCS_URL}>
            Building Medusa applications with agents
          </Link>
        </li>
      </ul>
      <p>
        Bloom will stay up until 1 July 2026. If you have questions, reach out
        to <Link href="mailto:oli@medusajs.com">oli@medusajs.com</Link> and
        we&apos;ll respond to them as fast as possible.
      </p>
    </div>
  )
}

const SunsetBanner = () => {
  const { setModalProps } = useModal()

  const openDetails = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setModalProps({
      title: "We're sunsetting Bloom",
      children: <SunsetModalContent />,
      // The Modal provider renders its overlay at z-[499] while the dialog
      // defaults to z-50, so raise the dialog above the overlay.
      style: { zIndex: 500 },
    })
  }

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 z-40 h-[40px]",
        "flex items-center justify-center gap-docs_0.5",
        "px-docs_1",
        "bg-[#000000] border-b border-[rgba(255,255,255,0.12)]"
      )}
      role="region"
      aria-label="Bloom sunset announcement"
    >
      <span className="text-compact-small-plus text-[#FFFFFF] text-center">
        We&apos;re sunsetting Bloom by July 1st.{" "}
        <Link
          href="#"
          onClick={openDetails}
          className="underline !text-[#FFFFFF]"
        >
          Read more
        </Link>
      </span>
    </div>
  )
}

export default SunsetBanner
