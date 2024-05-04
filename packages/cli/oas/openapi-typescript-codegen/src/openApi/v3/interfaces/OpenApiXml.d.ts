/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#xmlObject
 */
export interface OpenApiXml {
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}
