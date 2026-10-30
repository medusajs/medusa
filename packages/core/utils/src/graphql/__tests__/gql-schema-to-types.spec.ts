import { makeExecutableSchema } from "@graphql-tools/schema"
import fs from "fs"
import path from "path"
import { gqlSchemaToTypes } from "../graphql-to-ts-types"

describe("gqlSchemaToTypes", () => {
  it("should use enumValue directive for enum values", async () => {
    const schema = `
      directive @enumValue(value: String) on ENUM_VALUE

      enum Test {
        Test_A @enumValue(value: "test-a")
        Test_B
      }
    `

    const executableSchema = makeExecutableSchema({
      typeDefs: schema,
    })

    await gqlSchemaToTypes({
      schema: executableSchema,
      outputDir: path.resolve(__dirname, ".test-output/enum-values"),
      filename: "query-entry-points",
      joinerConfigs: [],
      interfaceName: "RemoteQueryEntryPoints",
    })

    const expectedTypes = `
    import "@medusajs/framework/types"
    export type Maybe<T> = T | null;
    export type InputMaybe<T> = Maybe<T>;
    /** All built-in and custom scalars, mapped to their actual values */
    export type Scalars = {
      ID: { input: string; output: string; }
      String: { input: string; output: string; }
      Boolean: { input: boolean; output: boolean; }
      Int: { input: number; output: number; }
      Float: { input: number; output: number; }
    };

    export type Test = | 'test-a' | 'Test_B';

    declare module '@medusajs/framework/types' {
      interface RemoteQueryEntryPoints {

      }
    }`

    const fileName = ".test-output/enum-values/query-entry-points.d.ts"
    const generatedTypes = fs
      .readFileSync(path.resolve(__dirname, fileName))
      .toString()
    expect(normalizeFile(generatedTypes)).toEqual(normalizeFile(expectedTypes))
  })
})

const normalizeFile = (file: string) => {
  return file.replace(/^\s+/g, "").replace(/\s+/g, " ").trim()
}
