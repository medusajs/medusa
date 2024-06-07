/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  transform: {
    "^.+\\.[jt]s?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
        isolatedModules: false,
      }
    ],
  },
  preset: 'ts-jest',
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
  testTimeout: 300000,
}