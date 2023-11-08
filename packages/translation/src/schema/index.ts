export default `
scalar Date
scalar JSON

type Translation {
  id: ID!
  local: String!
  attributes: JSON!
  createdAt: Date!
  updatedAt: Date!
}
`
