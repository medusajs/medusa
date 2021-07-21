import { graphql } from "gatsby"

export const StoreSections = graphql`
  fragment StoreSections on StoreSections {
    sections {
      ...StoreSection
    }
  }
`

export const StoreSection = graphql`
  fragment StoreSection on StoreSectionsSection {
    section_name
    paths {
      ...StorePath
    }
    schema {
      description
      properties {
        property
        type
        description
        format
      }
    }
  }
`

export const StorePath = graphql`
  fragment StorePath on StoreSectionsSectionPaths {
    name
    methods {
      ...StoreMethod
    }
  }
`

export const StoreMethod = graphql`
  fragment StoreMethod on StoreSectionsSectionPathsMethods {
    tags
    summary
    description
    method
    operationId
    responses {
      ...StoreResponse
    }
    requestBody {
      ...StoreRequestBody
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

export const StoreResponse = graphql`
  fragment StoreResponse on StoreSectionsSectionPathsMethodsResponses {
    status
    description
    content {
      _ref
      property
      description
      items {
        _ref
      }
    }
  }
`

export const StoreRequestBody = graphql`
  fragment StoreRequestBody on StoreSectionsSectionPathsMethodsRequestBody {
    type
    required
    properties {
      description
      property
      type
      items {
        properties {
          property
          description
        }
      }
      properties {
        option_id {
          type
          description
        }
      }
    }
  }
`

export const AdminSections = graphql`
  fragment AdminSections on AdminSections {
    sections {
      ...AdminSection
    }
  }
`

export const AdminSection = graphql`
  fragment AdminSection on AdminSectionsSection {
    section_name
    paths {
      ...AdminPath
    }
    schema {
      description
      properties {
        property
        type
        description
        format
      }
    }
  }
`

export const AdminPath = graphql`
  fragment AdminPath on AdminSectionsSectionPaths {
    name
    methods {
      ...AdminMethod
    }
  }
`

export const AdminMethod = graphql`
  fragment AdminMethod on AdminSectionsSectionPathsMethods {
    tags
    summary
    description
    method
    operationId
    responses {
      ...AdminResponse
    }
    requestBody {
      ...AdminRequestBody
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

export const AdminResponse = graphql`
  fragment AdminResponse on AdminSectionsSectionPathsMethodsResponses {
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

export const AdminRequestBody = graphql`
  fragment AdminRequestBody on AdminSectionsSectionPathsMethodsRequestBody {
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
