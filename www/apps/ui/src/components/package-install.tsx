import { CodeBlock, clx } from "@medusajs/ui"

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
    <CodeBlock
      snippets={[
        { language: "bash", label: "yarn", code: yarn },
        { language: "bash", label: "npm", code: npm },
        { language: "bash", label: "pnpm", code: pnpm },
      ]}
      className={clx("mb-6 mt-8", className)}
    >
      <CodeBlock.Header className="py-3" />
      <CodeBlock.Body hideLineNumbers />
    </CodeBlock>
  )
}

export { PackageInstall }
