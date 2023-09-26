import React, { type ReactNode } from "react"
import clsx from "clsx"
import Translate from "@docusaurus/Translate"
import type { Props } from "@theme/Admonition"
import {
  ExclamationCircleSolid,
  InformationCircleSolid,
  LightBulbSolid,
} from "@medusajs/icons"

function NoteIcon() {
  return (
    <InformationCircleSolid className="inline-block mr-0.125 text-medusa-tag-blue-icon" />
  )
}

function TipIcon() {
  return (
    <LightBulbSolid className="inline-block mr-0.125 text-medusa-tag-orange-icon" />
  )
}

function DangerIcon() {
  return (
    <ExclamationCircleSolid className="inline-block mr-0.125 text-medusa-fg-error" />
  )
}

function InfoIcon() {
  return NoteIcon()
}

function CautionIcon() {
  return DangerIcon()
}

type AdmonitionConfig = {
  iconComponent: React.ComponentType
  infimaClassName: string
  label: ReactNode
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const AdmonitionConfigs: Record<Props["type"], AdmonitionConfig> = {
  note: {
    infimaClassName: "secondary",
    iconComponent: NoteIcon,
    label: (
      <Translate
        id="theme.admonition.note"
        description="The default label used for the Note admonition (:::note)"
      >
        note
      </Translate>
    ),
  },
  tip: {
    infimaClassName: "success",
    iconComponent: TipIcon,
    label: (
      <Translate
        id="theme.admonition.tip"
        description="The default label used for the Tip admonition (:::tip)"
      >
        tip
      </Translate>
    ),
  },
  danger: {
    infimaClassName: "danger",
    iconComponent: DangerIcon,
    label: (
      <Translate
        id="theme.admonition.danger"
        description="The default label used for the Danger admonition (:::danger)"
      >
        danger
      </Translate>
    ),
  },
  info: {
    infimaClassName: "info",
    iconComponent: InfoIcon,
    label: (
      <Translate
        id="theme.admonition.info"
        description="The default label used for the Info admonition (:::info)"
      >
        info
      </Translate>
    ),
  },
  caution: {
    infimaClassName: "warning",
    iconComponent: CautionIcon,
    label: (
      <Translate
        id="theme.admonition.caution"
        description="The default label used for the Caution admonition (:::caution)"
      >
        caution
      </Translate>
    ),
  },
}

// Legacy aliases, undocumented but kept for retro-compatibility
const aliases = {
  secondary: "note",
  important: "info",
  success: "tip",
  warning: "danger",
} as const

function getAdmonitionConfig(unsafeType: string): AdmonitionConfig {
  const type =
    (aliases as { [key: string]: Props["type"] })[unsafeType] ?? unsafeType
  const config = (AdmonitionConfigs as { [key: string]: AdmonitionConfig })[
    type
  ]
  if (config) {
    return config
  }
  console.warn(
    `No admonition config found for admonition type "${type}". Using Info as fallback.`
  )
  return AdmonitionConfigs.info
}

// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children: ReactNode): {
  mdxAdmonitionTitle: ReactNode | undefined
  rest: ReactNode
} {
  const items = React.Children.toArray(children)
  const mdxAdmonitionTitle = items.find(
    (item) =>
      React.isValidElement(item) &&
      (item.props as { mdxType: string } | null)?.mdxType ===
        "mdxAdmonitionTitle"
  )
  const rest = <>{items.filter((item) => item !== mdxAdmonitionTitle)}</>
  return {
    mdxAdmonitionTitle,
    rest,
  }
}

function processAdmonitionProps(props: Props): Props {
  const { mdxAdmonitionTitle, rest } = extractMDXAdmonitionTitle(props.children)
  return {
    ...props,
    title: props.title ?? mdxAdmonitionTitle,
    children: rest,
  }
}

export default function Admonition(props: Props): JSX.Element {
  const { children, type, icon: iconProp } = processAdmonitionProps(props)

  const typeConfig = getAdmonitionConfig(type)
  const { iconComponent: IconComponent } = typeConfig
  const icon = iconProp ?? <IconComponent />
  return (
    <div
      className={clsx(
        "p-1 border border-solid border-medusa-border-base rounded",
        "bg-medusa-bg-subtle dark:bg-medusa-bg-base shadow-none",
        "[&_a]:no-underline [&_a]:text-medusa-fg-interactive hover:[&_a]:text-medusa-fg-interactive-hover ",
        "mb-2 alert"
      )}
    >
      <div className={clsx("flex")}>
        <span className={clsx("inline-block h-1.5 w-1.5 mr-1")}>{icon}</span>
        <div
          className={clsx(
            "text-medusa-fg-subtle",
            "text-medium flex-1 [&>*:last-child]:mb-0",
            "[&>p>code]:px-0.5 [&>p>code]:text-code-label"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
