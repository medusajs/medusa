module.exports = {
  transform: {
    "^.+\\.[jt]s$": ["@swc/jest"],
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `ts`],
}
