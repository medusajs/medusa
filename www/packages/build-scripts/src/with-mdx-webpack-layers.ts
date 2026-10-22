import type { NextConfig } from "next"

type WebpackConfig = Parameters<NonNullable<NextConfig["webpack"]>>[0]
type WebpackContext = Parameters<NonNullable<NextConfig["webpack"]>>[1]
type Rule = {
  test?: unknown
  use?: unknown
  oneOf?: Rule[]
  issuerLayer?: unknown
}

const MDX_REGEX = /\.mdx$/

const isNextMdxRule = (rule: Rule, defaultLoader: unknown) =>
  rule.test instanceof RegExp &&
  rule.test.test("page.mdx") &&
  Array.isArray(rule.use) &&
  rule.use.includes(defaultLoader)

/**
 * Works around https://github.com/vercel/next.js/issues/91735, where webpack
 * compiles every MDX page as a client component. Must wrap the config returned
 * by `@next/mdx`.
 */
export const withMdxWebpackLayers = (nextConfig: NextConfig): NextConfig => ({
  ...nextConfig,
  webpack(config: WebpackConfig, context: WebpackContext) {
    const resolvedConfig =
      typeof nextConfig.webpack === "function"
        ? nextConfig.webpack(config, context)
        : config
    const rules = (resolvedConfig.module?.rules || []) as Rule[]
    const defaultLoader = context.defaultLoaders.babel

    for (const rule of rules) {
      if (isNextMdxRule(rule, defaultLoader)) {
        rule.use = (rule.use as unknown[]).filter((use) => use !== defaultLoader)
      }
    }

    const codeTests = new Set<{ or: unknown[] }>()
    for (const rule of rules) {
      for (const subRule of rule.oneOf || []) {
        const test = subRule.test as { or?: unknown[] } | undefined
        if (subRule.issuerLayer && Array.isArray(test?.or)) {
          codeTests.add(test as { or: unknown[] })
        }
      }
    }

    if (!codeTests.size) {
      throw new Error(
        "withMdxWebpackLayers: couldn't find Next.js code rules to route MDX through"
      )
    }

    for (const test of codeTests) {
      if (!test.or.includes(MDX_REGEX)) {
        test.or.push(MDX_REGEX)
      }
    }

    return resolvedConfig
  },
})
