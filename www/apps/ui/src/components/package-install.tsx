import { clx } from "@medusajs/ui"
import { CodeBlock, CodeTab, CodeTabs } from "docs-ui"

type PackageInstallProps = {
  packageName: string
  devDependency?: boolean
  version?: string
  className?: string
}

const PackageInstall = ({
  packageName,
  devDependency = false,
  version,
  className,
}: PackageInstallProps) => {
  const pkg = `${packageName}${version ? `@${version}` : ""}`

  const yarn = `yarn add ${devDependency ? "-D " : ""}${pkg}`
  const npm = `npm install ${pkg} ${devDependency ? "--save-dev" : "--save"}`
  const pnpm = `pnpm add ${devDependency ? "-D " : ""}${pkg}`

  const tabs = [
    { code: { lang: "bash", source: npm }, label: "npm", value: "npm" },
    { code: { lang: "bash", source: yarn }, label: "yarn", value: "yarn" },
    { code: { lang: "bash", source: pnpm }, label: "pnpm", value: "pnpm" },
  ]

  return (
    <CodeTabs group="npm2yarn" className={clx("my-4", className)}>
      {tabs.map((tab, index) => (
        <CodeTab label={tab.label} value={tab.value} key={index}>
          <CodeBlock {...tab.code} />
        </CodeTab>
      ))}
    </CodeTabs>
  )
}

export { PackageInstall }
