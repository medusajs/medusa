export default `
type SalesChannel {
  id: ID!
  name: String!
  description: String
  is_disabled: Boolean!
  created_at: DateTime!
  metadata: JSON
  updated_at: DateTime!
  deleted_at: DateTime
}
`
