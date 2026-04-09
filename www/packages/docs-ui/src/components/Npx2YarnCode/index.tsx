import React from "react"
import { CodeBlock, CodeBlockMetaFields } from "@/components/CodeBlock"
import { CodeTabs } from "@/components/CodeTabs"
import { CodeTab } from "@/components/CodeTabs/Item"
import { npxToYarn } from "@/utils/npx-to-yarn"

type Npx2YarnCodeProps = {
  npxCode: string
  isExecutable?: boolean
} & Omit<CodeBlockMetaFields, "npx2yarn">

export const Npx2YarnCode = ({
  npxCode,
  isExecutable = false,
  ...codeOptions
}: Npx2YarnCodeProps) => {
  // convert npx code
  const yarnCode = npxToYarn(npxCode, "yarn", isExecutable)
  const pnpmCode = npxToYarn(npxCode, "pnpm", isExecutable)
  const lang = "bash"

  codeOptions.hasTabs = true

  const tabs = [
    {
      label: "yarn",
      value: "yarn",
      code: {
        source: yarnCode,
        lang,
        ...codeOptions,
      },
    },
    {
      label: "pnpm",
      value: "pnpm",
      code: {
        source: pnpmCode,
        lang,
        ...codeOptions,
      },
    },
    {
      label: "npx",
      // keep it npm so it matches the tab name in Npm2YarnCode
      value: "npm",
      code: {
        source: npxCode,
        lang,
        ...codeOptions,
      },
    },
  ]

  return (
    // Keep the group name same as Npm2YarnCode, value selection will be synced across both components
    <CodeTabs group="npm2yarn">
      {tabs.map((tab, index) => (
        <CodeTab label={tab.label} value={tab.value} key={index}>
          <CodeBlock {...tab.code} />
        </CodeTab>
      ))}
    </CodeTabs>
  )
}
