/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  transform: {
    "^.+\\.[jt]s?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
        isolatedModules: false,
        useESM: true,
      }
    ],
  },
  preset: 'ts-jest',
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    '(.+)\\.js': '$1'
},
  testTimeout: 300000
}