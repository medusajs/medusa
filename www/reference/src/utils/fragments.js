import { graphql } from "gatsby"

export const sections = graphql`
  fragment sections on ApiNodeSections {
    sections {
      ...section
    }
  }
`

export const section = graphql`
  fragment section on ApiNodeSectionsSection {
    section_name
    paths {
      ...path
    }
  }
`

export const path = graphql`
  fragment path on ApiNodeSectionsSectionPaths {
    name
    methods {
      ...method
    }
  }
`

export const method = graphql`
  fragment method on ApiNodeSectionsSectionPathsMethods {
    tags
    summary
    description
    method
    operationId
    responses {
      description
      status
    }
    requestBody {
      content {
        application_json {
          schema {
            type
          }
        }
      }
    }
    parameters {
      description
      in
      name
      required
    }
  }
`
