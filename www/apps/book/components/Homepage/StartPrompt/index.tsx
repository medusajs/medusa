"use client"

import { CheckMini, SquareTwoStack } from "@medusajs/icons"
import clsx from "clsx"
import { CopyButton, HeadlineTags } from "docs-ui"
import HomepageEdges from "../Edges"
import HomepageStartPromptClaudeIcon from "./Icons/Claude"
import HomepageStartPromptCodexIcon from "./Icons/Codex"
import HomepageStartPromptCopilotIcon from "./Icons/Copilot"
import HomepageStartPromptCursorIcon from "./Icons/Cursor"
import HomepageStartPromptGeminiCliIcon from "./Icons/GeminiCli"
import HomepageStartPromptOpenCodeIcon from "./Icons/OpenCode"

const PROMPT =
  "Fetch https://docs.medusajs.com/start and create an ecommerce store with Medusa Cloud"

const agents = [
  { icon: HomepageStartPromptClaudeIcon },
  { icon: HomepageStartPromptCursorIcon },
  { icon: HomepageStartPromptCodexIcon },
  { icon: HomepageStartPromptCopilotIcon },
  { icon: HomepageStartPromptGeminiCliIcon },
  { icon: HomepageStartPromptOpenCodeIcon },
]

const HomepageStartPrompt = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-0 border-y border-medusa-border-base">
      <div
        className={clsx(
          "w-full md:w-1/3 py-4 px-2 flex flex-col gap-0.75 justify-center",
          "border-b md:border-b-0 md:border-r border-medusa-border-base"
        )}
      >
        <HeadlineTags
          tags={[
            "AI Agents",
            {
              text: "Learn more",
              link: "/start",
            },
          ]}
          className="!justify-start"
        />
        <h2 className="text-h1 text-medusa-fg-base">
          Get started with your AI agent.
        </h2>
        <p className="txt-large text-medusa-fg-base">
          Use this prompt with any AI agent to install and deploy a
          Medusa-powered ecommerce store.
        </p>
      </div>
      <div
        className={clsx(
          "w-full md:w-2/3 p-2 flex flex-col gap-2 justify-center",
          "bg-medusa-bg-component relative"
        )}
      >
        <div
          className={clsx(
            "flex items-start justify-between gap-2",
            "border border-medusa-border-base bg-medusa-bg-base",
            "px-1.5 py-1.5 relative"
          )}
        >
          <span className="text-code-body font-mono text-medusa-fg-base leading-relaxed">
            {PROMPT}
          </span>
          <CopyButton
            text={PROMPT}
            className="flex-shrink-0 mt-[2px]"
            buttonClassName={clsx(
              "text-medusa-fg-subtle hover:text-medusa-fg-base",
              "transition-colors duration-100"
            )}
          >
            {({ isCopied }) => {
              return isCopied ? (
                <CheckMini className="text-medusa-fg-interactive" />
              ) : (
                <SquareTwoStack />
              )
            }}
          </CopyButton>
          <HomepageEdges />
        </div>

        <div className="flex items-center gap-0 flex-wrap">
          {agents.map(({ icon: Icon }, index) => (
            <div
              key={index}
              className={clsx(
                "flex items-center px-0.25 py-0.5",
                "text-medusa-fg-subtle"
              )}
            >
              <Icon />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomepageStartPrompt
