export {}

declare global {
  interface Window {
    analytics?: any
  }
}

declare module "@theme/CodeBlock" {
  import type { ReactNode } from "react"
  import type { Props as DocusaurusProps } from "@theme/CodeBlock"

  export interface Props extends DocusaurusProps {
    readonly noReport?: boolean
    readonly noCopy?: boolean
  }
}

declare module "@theme/CodeBlock/Content/String" {
  import type { Props as CodeBlockProps } from "@theme/CodeBlock"

  export interface Props extends Omit<CodeBlockProps, "children"> {
    readonly children: string
    readonly noReport?: boolean
    readonly noCopy?: boolean
  }

  export default function CodeBlockStringContent(props: Props): JSX.Element
}

declare module "@medusajs/docs" {
  import type { ThemeConfig as DocusaurusConfig } from "@docusaurus/preset-classic"

  export declare type ThemeConfig = {
    reportCodeLinkPrefix?: string
  } & DocusaurusConfig
}
