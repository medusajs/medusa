export default `
scalar Date
scalar JSON

type Translation {
  id: ID!
  lang: String!
  attributes: JSON!
  createdAt: Date!
  updatedAt: Date!
}
`
