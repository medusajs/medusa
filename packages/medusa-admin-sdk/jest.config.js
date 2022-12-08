module.exports = {
  moduleFileExtensions: ["ts"],
  testTimeout: 100000,
  preset: "ts-jest",
  rootDir: "src",
  testRegex: ".*\\.test\\.ts$",
  transformIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
}
