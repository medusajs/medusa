import { BaseService } from "medusa-interfaces"
import _ from "lodash"

class QueryBuilderService extends BaseService {
  buildQuery(params, properties) {
    const textSearch = _.pick(params, ["q"])
    const filters = _.pick(params, properties)

    const textQuery = this.buildTextSearchQuery(textSearch, properties)
    const filterQuery = this.buildFilterQuery(filters)

    if (textQuery && filterQuery) {
      return {
        $and: [textQuery, filterQuery],
      }
    } else if (!textQuery && filterQuery) {
      return filterQuery
    } else if (textQuery && !filterQuery) {
      return textQuery
    } else {
      return {}
    }
  }

  buildFilterQuery(filters) {
    if (_.isEmpty(filters)) return

    const filterQuery = {}

    Object.keys(filters).map(filter => {
      filterQuery[filter] = filters[filter]
    })

    return filterQuery
  }

  buildTextSearchQuery(search, searchProperties) {
    if (_.isEmpty(search)) return

    const searchQuery = searchProperties.map(s => ({
      [s]: new RegExp(search.q),
    }))

    return { $or: searchQuery }
  }
}

export default QueryBuilderService
