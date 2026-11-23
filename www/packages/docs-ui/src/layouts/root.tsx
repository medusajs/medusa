import React from "react"
import clsx from "clsx"
import { MainNav, RootProviders, Sidebar, SidebarProps } from "@/components"
import { MainContentLayout, MainContentLayoutProps } from "./main-content"
import { AiAssistantChatWindow } from "../components/AiAssistant/ChatWindow"
import { TechArticleJsonLd } from "../components/TechArticleJsonLd"
import { AgentDirective } from "../components/AgentDirective"
import { WebMcpTools } from "../components/WebMcpTools"

export type RootLayoutProps = {
  bodyClassName?: string
  sidebarProps?: SidebarProps
  showBreadcrumbs?: boolean
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
  footerComponent?: React.ReactNode
} & MainContentLayoutProps

export const RootLayout = ({
  bodyClassName,
  sidebarProps,
  ProvidersComponent,
  ...mainProps
}: RootLayoutProps) => {
  return (
    <body className={clsx("h-screen w-full overflow-hidden")}>
      <AgentDirective />
      <div
        className={clsx(
          "bg-medusa-bg-base font-base text-medium w-full",
          "text-medusa-fg-base",
          "h-full overflow-hidden",
          "flex flex-col"
        )}
      >
        <RootProviders>
          <ProvidersComponent>
            <MainNav />
            <div
              className={clsx(
                "w-full flex-1 min-h-0",
                "grid grid-cols-1 lg:mx-auto lg:grid-cols-[221px_1fr]",
                bodyClassName
              )}
              id="root-layout"
            >
              <Sidebar {...sidebarProps} />
              <div className={clsx("relative", "h-full min-h-0", "flex")}>
                <MainContentLayout {...mainProps} />
                <AiAssistantChatWindow />
              </div>
            </div>
            <TechArticleJsonLd />
            <WebMcpTools />
          </ProvidersComponent>
        </RootProviders>
      </div>
    </body>
  )
}
