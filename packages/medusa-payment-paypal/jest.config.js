module.exports = {
  transform: {
    "^.+\\.[jt]s?$": "@swc/jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(axios)/).*", "/dist"],
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
}
