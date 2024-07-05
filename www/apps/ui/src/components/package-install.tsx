import { clx } from "@medusajs/ui"
import { LegacyCodeTabs } from "docs-ui"

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

  return (
    <LegacyCodeTabs
      tabs={[
        { code: { lang: "bash", source: npm }, label: "npm", value: "npm" },
        { code: { lang: "bash", source: yarn }, label: "yarn", value: "yarn" },
        { code: { lang: "bash", source: pnpm }, label: "pnpm", value: "pnpm" },
      ]}
      className={clx("my-4", className)}
    />
  )
}

export { PackageInstall }
