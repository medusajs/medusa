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
      ...response
    }
    requestBody {
      ...requestBody
    }

    parameters {
      description
      in
      name
      required
      schema {
        type
      }
    }
  }
`

export const response = graphql`
  fragment response on ApiNodeSectionsSectionPathsMethodsResponses {
    status
    description
    content {
      _ref
      type
      property
      description
      items {
        type
        _ref
      }
    }
  }
`

export const requestBody = graphql`
  fragment requestBody on ApiNodeSectionsSectionPathsMethodsRequestBody {
    type
    required
    properties {
      description
      enum
      format
      oneOf {
        _ref
      }
      property
      type
      items {
        type
        properties {
          type
          property
          enum
          description
          items {
            type
          }
        }
      }
      properties {
        price {
          type
          description
        }
        option_id {
          type
          description
        }
        value {
          type
          description
        }
      }
    }
  }
`
