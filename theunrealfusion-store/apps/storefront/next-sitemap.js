const excludedPaths = ["/checkout", "/account/*"]

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  generateRobotsTxt: true,
  exclude: excludedPaths + ["/[sitemap]"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
