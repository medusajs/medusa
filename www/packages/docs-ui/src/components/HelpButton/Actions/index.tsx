"use client"

import { Bug, Discord, Github } from "@medusajs/icons"
import clsx from "clsx"
import Link from "next/link"
import React from "react"

export const HelpButtonActions = () => {
  const actions = [
    {
      title: "Troubleshooting Guides",
      url: "https://docs.medusajs.com/v2/resources/troubleshooting",
      icon: <Bug />,
    },
    {
      title: "Create a GitHub Issue",
      url: "https://github.com/medusajs/medusa/issues/new/choose",
      icon: <Github />,
    },
    {
      title: "Get Support on Discord",
      url: "https://discord.gg/medusajs",
      icon: <Discord />,
    },
  ]
  return (
    <div
      className={clsx(
        "bg-medusa-bg-component shadow-elevation-flyout",
        "flex flex-col rounded-docs_DEFAULT",
        "mr-0 ml-auto"
      )}
    >
      {actions.map((action, index) => (
        <Link
          href={action.url}
          className={clsx(
            "px-docs_0.5 py-docs_0.25 text-medusa-fg-base",
            "flex flex-row items-center gap-docs_0.5",
            "hover:bg-medusa-bg-component-hover",
            index !== 0 && "border-t border-medusa-border-base border-solid"
          )}
          key={index}
          target="_blank"
        >
          {action.icon}
          <span>{action.title}</span>
        </Link>
      ))}
    </div>
  )
}
