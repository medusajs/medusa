/**
 * @oas [get] /admin/products
 * operationId: GetProducts
 * summary: List Products
 * description: Retrieve a list of products. The products can be filtered by fields
 *   such as `id`. The products can also be sorted or paginated.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         description: SUMMARY
 *         properties:
 *           q:
 *             type: string
 *             title: q
 *             description: The product's q.
 *           id:
 *             oneOf:
 *               - type: string
 *                 title: id
 *                 description: The product's ID.
 *               - type: array
 *                 description: The product's ID.
 *                 items:
 *                   type: string
 *                   title: id
 *                   description: The id's ID.
 *           status:
 *             type: array
 *             description: The product's status.
 *             items:
 *               type: string
 *               enum:
 *                 - draft
 *                 - proposed
 *                 - published
 *                 - rejected
 *           title:
 *             type: string
 *             title: title
 *             description: The product's title.
 *           handle:
 *             type: string
 *             title: handle
 *             description: The product's handle.
 *           is_giftcard:
 *             type: boolean
 *             title: is_giftcard
 *             description: The product's is giftcard.
 *           price_list_id:
 *             type: array
 *             description: The product's price list id.
 *             items:
 *               type: string
 *               title: price_list_id
 *               description: The price list id's details.
 *           sales_channel_id:
 *             type: array
 *             description: The product's sales channel id.
 *             items:
 *               type: string
 *               title: sales_channel_id
 *               description: The sales channel id's details.
 *           collection_id:
 *             type: array
 *             description: The product's collection id.
 *             items:
 *               type: string
 *               title: collection_id
 *               description: The collection id's details.
 *           tags:
 *             type: array
 *             description: The product's tags.
 *             items:
 *               type: string
 *               title: tags
 *               description: The tag's tags.
 *           type_id:
 *             type: array
 *             description: The product's type id.
 *             items:
 *               type: string
 *               title: type_id
 *               description: The type id's details.
 *           variants:
 *             type: object
 *             description: The product's variants.
 *             properties: {}
 *           created_at:
 *             type: object
 *             description: The product's created at.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: The created at's $and.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $and
 *                       description: The $and's details.
 *                     - type: object
 *                       description: The $and's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $and's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $and's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $and's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $and's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $and's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $and's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $and's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $and's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $and's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $and's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $and's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $and's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $and's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $and's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $and's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $and's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $and's   @matchall@2360.
 *                           properties: {}
 *                     - type: object
 *                       description: The $and's details.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $and's details.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $and
 *                                 description: The $and's details.
 *                               - type: object
 *                                 description: The $and's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $and's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $and's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $and
 *                                       description: The $and's details.
 *                                     - type: object
 *                                       description: The $and's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $or:
 *                           type: array
 *                           description: The $and's $or.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $or
 *                                 description: The $or's details.
 *                               - type: object
 *                                 description: The $or's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $or's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $or's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $or
 *                                       description: The $or's details.
 *                                     - type: object
 *                                       description: The $or's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: The $and's $eq.
 *                             - type: object
 *                               description: The $and's $eq.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's $eq.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: The $eq's details.
 *                                   - type: object
 *                                     description: The $eq's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $ne:
 *                           oneOf:
 *                             - type: string
 *                               title: $ne
 *                               description: The $and's $ne.
 *                             - type: object
 *                               description: The $and's $ne.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $in:
 *                           type: array
 *                           description: The $and's $in.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $in
 *                                 description: The $in's details.
 *                               - type: object
 *                                 description: The $in's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $nin:
 *                           type: array
 *                           description: The $and's $nin.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $nin
 *                                 description: The $nin's details.
 *                               - type: object
 *                                 description: The $nin's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: The $and's $not.
 *                             - type: object
 *                               description: The $and's $not.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $and's $not.
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's $not.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: The $not's details.
 *                                   - type: object
 *                                     description: The $not's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $gt:
 *                           oneOf:
 *                             - type: string
 *                               title: $gt
 *                               description: The $and's $gt.
 *                             - type: object
 *                               description: The $and's $gt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $gte:
 *                           oneOf:
 *                             - type: string
 *                               title: $gte
 *                               description: The $and's $gte.
 *                             - type: object
 *                               description: The $and's $gte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lt:
 *                           oneOf:
 *                             - type: string
 *                               title: $lt
 *                               description: The $and's $lt.
 *                             - type: object
 *                               description: The $and's $lt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lte:
 *                           oneOf:
 *                             - type: string
 *                               title: $lte
 *                               description: The $and's $lte.
 *                             - type: object
 *                               description: The $and's $lte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: The $and's $like.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: The $and's $re.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: The $and's $ilike.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: The $and's $fulltext.
 *                         $overlap:
 *                           type: array
 *                           description: The $and's $overlap.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: The $overlap's details.
 *                         $contains:
 *                           type: array
 *                           description: The $and's $contains.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: The $contain's $contains.
 *                         $contained:
 *                           type: array
 *                           description: The $and's $contained.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: The $contained's details.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: The $and's $exists.
 *                     - type: array
 *                       description: The $and's details.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             required:
 *                               - exec
 *                               - test
 *                               - source
 *                               - global
 *                               - ignoreCase
 *                               - multiline
 *                               - lastIndex
 *                               - flags
 *                               - sticky
 *                               - unicode
 *                               - dotAll
 *                               - __@match@2351
 *                               - __@replace@2353
 *                               - __@search@2356
 *                               - __@matchAll@2360
 *                             properties:
 *                               exec:
 *                                 type: object
 *                                 description: The $and's exec.
 *                                 properties: {}
 *                               test:
 *                                 type: object
 *                                 description: The $and's test.
 *                                 properties: {}
 *                               source:
 *                                 type: string
 *                                 title: source
 *                                 description: The $and's source.
 *                               global:
 *                                 type: boolean
 *                                 title: global
 *                                 description: The $and's global.
 *                               ignoreCase:
 *                                 type: boolean
 *                                 title: ignoreCase
 *                                 description: The $and's ignorecase.
 *                               multiline:
 *                                 type: boolean
 *                                 title: multiline
 *                                 description: The $and's multiline.
 *                               lastIndex:
 *                                 type: number
 *                                 title: lastIndex
 *                                 description: The $and's lastindex.
 *                               compile:
 *                                 type: object
 *                                 description: The $and's compile.
 *                                 properties: {}
 *                               flags:
 *                                 type: string
 *                                 title: flags
 *                                 description: The $and's flags.
 *                               sticky:
 *                                 type: boolean
 *                                 title: sticky
 *                                 description: The $and's sticky.
 *                               unicode:
 *                                 type: boolean
 *                                 title: unicode
 *                                 description: The $and's unicode.
 *                               dotAll:
 *                                 type: boolean
 *                                 title: dotAll
 *                                 description: The $and's dotall.
 *                               __@match@2351:
 *                                 type: object
 *                                 description: The $and's   @match@2351.
 *                                 properties: {}
 *                               __@replace@2353:
 *                                 type: object
 *                                 description: The $and's   @replace@2353.
 *                                 properties: {}
 *                               __@search@2356:
 *                                 type: object
 *                                 description: The $and's   @search@2356.
 *                                 properties: {}
 *                               __@split@2358:
 *                                 type: object
 *                                 description: The $and's   @split@2358.
 *                                 properties: {}
 *                               __@matchAll@2360:
 *                                 type: object
 *                                 description: The $and's   @matchall@2360.
 *                                 properties: {}
 *               $or:
 *                 type: array
 *                 description: The created at's $or.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $or
 *                       description: The $or's details.
 *                     - type: object
 *                       description: The $or's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $or's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $or's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $or's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $or's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $or's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $or's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $or's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $or's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $or's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $or's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $or's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $or's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $or's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $or's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $or's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $or's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $or's   @matchall@2360.
 *                           properties: {}
 *                     - type: object
 *                       description: The $or's details.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $or's $and.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $and
 *                                 description: The $and's details.
 *                               - type: object
 *                                 description: The $and's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $and's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $and's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $and
 *                                       description: The $and's details.
 *                                     - type: object
 *                                       description: The $and's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $or:
 *                           type: array
 *                           description: The $or's details.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $or
 *                                 description: The $or's details.
 *                               - type: object
 *                                 description: The $or's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $or's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $or's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $or
 *                                       description: The $or's details.
 *                                     - type: object
 *                                       description: The $or's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: The $or's $eq.
 *                             - type: object
 *                               description: The $or's $eq.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's $eq.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: The $eq's details.
 *                                   - type: object
 *                                     description: The $eq's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $ne:
 *                           oneOf:
 *                             - type: string
 *                               title: $ne
 *                               description: The $or's $ne.
 *                             - type: object
 *                               description: The $or's $ne.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $in:
 *                           type: array
 *                           description: The $or's $in.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $in
 *                                 description: The $in's details.
 *                               - type: object
 *                                 description: The $in's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $nin:
 *                           type: array
 *                           description: The $or's $nin.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $nin
 *                                 description: The $nin's details.
 *                               - type: object
 *                                 description: The $nin's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: The $or's $not.
 *                             - type: object
 *                               description: The $or's $not.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $or's $not.
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's $not.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: The $not's details.
 *                                   - type: object
 *                                     description: The $not's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $gt:
 *                           oneOf:
 *                             - type: string
 *                               title: $gt
 *                               description: The $or's $gt.
 *                             - type: object
 *                               description: The $or's $gt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $gte:
 *                           oneOf:
 *                             - type: string
 *                               title: $gte
 *                               description: The $or's $gte.
 *                             - type: object
 *                               description: The $or's $gte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lt:
 *                           oneOf:
 *                             - type: string
 *                               title: $lt
 *                               description: The $or's $lt.
 *                             - type: object
 *                               description: The $or's $lt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lte:
 *                           oneOf:
 *                             - type: string
 *                               title: $lte
 *                               description: The $or's $lte.
 *                             - type: object
 *                               description: The $or's $lte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: The $or's $like.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: The $or's $re.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: The $or's $ilike.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: The $or's $fulltext.
 *                         $overlap:
 *                           type: array
 *                           description: The $or's $overlap.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: The $overlap's details.
 *                         $contains:
 *                           type: array
 *                           description: The $or's $contains.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: The $contain's $contains.
 *                         $contained:
 *                           type: array
 *                           description: The $or's $contained.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: The $contained's details.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: The $or's $exists.
 *                     - type: array
 *                       description: The $or's details.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             required:
 *                               - exec
 *                               - test
 *                               - source
 *                               - global
 *                               - ignoreCase
 *                               - multiline
 *                               - lastIndex
 *                               - flags
 *                               - sticky
 *                               - unicode
 *                               - dotAll
 *                               - __@match@2351
 *                               - __@replace@2353
 *                               - __@search@2356
 *                               - __@matchAll@2360
 *                             properties:
 *                               exec:
 *                                 type: object
 *                                 description: The $or's exec.
 *                                 properties: {}
 *                               test:
 *                                 type: object
 *                                 description: The $or's test.
 *                                 properties: {}
 *                               source:
 *                                 type: string
 *                                 title: source
 *                                 description: The $or's source.
 *                               global:
 *                                 type: boolean
 *                                 title: global
 *                                 description: The $or's global.
 *                               ignoreCase:
 *                                 type: boolean
 *                                 title: ignoreCase
 *                                 description: The $or's ignorecase.
 *                               multiline:
 *                                 type: boolean
 *                                 title: multiline
 *                                 description: The $or's multiline.
 *                               lastIndex:
 *                                 type: number
 *                                 title: lastIndex
 *                                 description: The $or's lastindex.
 *                               compile:
 *                                 type: object
 *                                 description: The $or's compile.
 *                                 properties: {}
 *                               flags:
 *                                 type: string
 *                                 title: flags
 *                                 description: The $or's flags.
 *                               sticky:
 *                                 type: boolean
 *                                 title: sticky
 *                                 description: The $or's sticky.
 *                               unicode:
 *                                 type: boolean
 *                                 title: unicode
 *                                 description: The $or's unicode.
 *                               dotAll:
 *                                 type: boolean
 *                                 title: dotAll
 *                                 description: The $or's dotall.
 *                               __@match@2351:
 *                                 type: object
 *                                 description: The $or's   @match@2351.
 *                                 properties: {}
 *                               __@replace@2353:
 *                                 type: object
 *                                 description: The $or's   @replace@2353.
 *                                 properties: {}
 *                               __@search@2356:
 *                                 type: object
 *                                 description: The $or's   @search@2356.
 *                                 properties: {}
 *                               __@split@2358:
 *                                 type: object
 *                                 description: The $or's   @split@2358.
 *                                 properties: {}
 *                               __@matchAll@2360:
 *                                 type: object
 *                                 description: The $or's   @matchall@2360.
 *                                 properties: {}
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: The created at's $eq.
 *                   - type: object
 *                     description: The created at's $eq.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $eq's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $eq's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $eq's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $eq's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $eq's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $eq's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $eq's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $eq's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $eq's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $eq's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $eq's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $eq's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $eq's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $eq's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $eq's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $eq's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $eq's   @matchall@2360.
 *                         properties: {}
 *                   - type: array
 *                     description: The created at's $eq.
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The $eq's details.
 *                         - type: object
 *                           description: The $eq's details.
 *                           x-schemaName: RegExp
 *                           required:
 *                             - exec
 *                             - test
 *                             - source
 *                             - global
 *                             - ignoreCase
 *                             - multiline
 *                             - lastIndex
 *                             - flags
 *                             - sticky
 *                             - unicode
 *                             - dotAll
 *                             - __@match@2351
 *                             - __@replace@2353
 *                             - __@search@2356
 *                             - __@matchAll@2360
 *                           properties:
 *                             exec:
 *                               type: object
 *                               description: The $eq's exec.
 *                               properties: {}
 *                             test:
 *                               type: object
 *                               description: The $eq's test.
 *                               properties: {}
 *                             source:
 *                               type: string
 *                               title: source
 *                               description: The $eq's source.
 *                             global:
 *                               type: boolean
 *                               title: global
 *                               description: The $eq's global.
 *                             ignoreCase:
 *                               type: boolean
 *                               title: ignoreCase
 *                               description: The $eq's ignorecase.
 *                             multiline:
 *                               type: boolean
 *                               title: multiline
 *                               description: The $eq's multiline.
 *                             lastIndex:
 *                               type: number
 *                               title: lastIndex
 *                               description: The $eq's lastindex.
 *                             compile:
 *                               type: object
 *                               description: The $eq's compile.
 *                               properties: {}
 *                             flags:
 *                               type: string
 *                               title: flags
 *                               description: The $eq's flags.
 *                             sticky:
 *                               type: boolean
 *                               title: sticky
 *                               description: The $eq's sticky.
 *                             unicode:
 *                               type: boolean
 *                               title: unicode
 *                               description: The $eq's unicode.
 *                             dotAll:
 *                               type: boolean
 *                               title: dotAll
 *                               description: The $eq's dotall.
 *                             __@match@2351:
 *                               type: object
 *                               description: The $eq's   @match@2351.
 *                               properties: {}
 *                             __@replace@2353:
 *                               type: object
 *                               description: The $eq's   @replace@2353.
 *                               properties: {}
 *                             __@search@2356:
 *                               type: object
 *                               description: The $eq's   @search@2356.
 *                               properties: {}
 *                             __@split@2358:
 *                               type: object
 *                               description: The $eq's   @split@2358.
 *                               properties: {}
 *                             __@matchAll@2360:
 *                               type: object
 *                               description: The $eq's   @matchall@2360.
 *                               properties: {}
 *               $ne:
 *                 oneOf:
 *                   - type: string
 *                     title: $ne
 *                     description: The created at's $ne.
 *                   - type: object
 *                     description: The created at's $ne.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $ne's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $ne's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $ne's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $ne's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $ne's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $ne's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $ne's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $ne's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $ne's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $ne's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $ne's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $ne's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $ne's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $ne's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $ne's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $ne's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $ne's   @matchall@2360.
 *                         properties: {}
 *               $in:
 *                 type: array
 *                 description: The created at's $in.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $in
 *                       description: The $in's details.
 *                     - type: object
 *                       description: The $in's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $in's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $in's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $in's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $in's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $in's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $in's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $in's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $in's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $in's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $in's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $in's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $in's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $in's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $in's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $in's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $in's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $in's   @matchall@2360.
 *                           properties: {}
 *               $nin:
 *                 type: array
 *                 description: The created at's $nin.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $nin
 *                       description: The $nin's details.
 *                     - type: object
 *                       description: The $nin's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $nin's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $nin's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $nin's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $nin's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $nin's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $nin's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $nin's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $nin's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $nin's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $nin's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $nin's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $nin's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $nin's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $nin's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $nin's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $nin's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $nin's   @matchall@2360.
 *                           properties: {}
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: The created at's $not.
 *                   - type: object
 *                     description: The created at's $not.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $not's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $not's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $not's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $not's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $not's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $not's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $not's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $not's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $not's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $not's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $not's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $not's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $not's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $not's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $not's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $not's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $not's   @matchall@2360.
 *                         properties: {}
 *                   - type: object
 *                     description: The created at's $not.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: The $not's $and.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $and
 *                               description: The $and's details.
 *                             - type: object
 *                               description: The $and's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $and's details.
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's details.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $and
 *                                     description: The $and's details.
 *                                   - type: object
 *                                     description: The $and's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $not's $or.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $or
 *                               description: The $or's details.
 *                             - type: object
 *                               description: The $or's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $or's details.
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's details.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $or
 *                                     description: The $or's details.
 *                                   - type: object
 *                                     description: The $or's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                       $eq:
 *                         oneOf:
 *                           - type: string
 *                             title: $eq
 *                             description: The $not's $eq.
 *                           - type: object
 *                             description: The $not's $eq.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: array
 *                             description: The $not's $eq.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $eq
 *                                   description: The $eq's details.
 *                                 - type: object
 *                                   description: The $eq's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                       $ne:
 *                         oneOf:
 *                           - type: string
 *                             title: $ne
 *                             description: The $not's $ne.
 *                           - type: object
 *                             description: The $not's $ne.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $in:
 *                         type: array
 *                         description: The $not's $in.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $in
 *                               description: The $in's details.
 *                             - type: object
 *                               description: The $in's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                       $nin:
 *                         type: array
 *                         description: The $not's $nin.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $nin
 *                               description: The $nin's details.
 *                             - type: object
 *                               description: The $nin's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                       $not:
 *                         oneOf:
 *                           - type: string
 *                             title: $not
 *                             description: The $not's details.
 *                           - type: object
 *                             description: The $not's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $not's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $not's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $not
 *                                   description: The $not's details.
 *                                 - type: object
 *                                   description: The $not's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                       $gt:
 *                         oneOf:
 *                           - type: string
 *                             title: $gt
 *                             description: The $not's $gt.
 *                           - type: object
 *                             description: The $not's $gt.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $gte:
 *                         oneOf:
 *                           - type: string
 *                             title: $gte
 *                             description: The $not's $gte.
 *                           - type: object
 *                             description: The $not's $gte.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $lt:
 *                         oneOf:
 *                           - type: string
 *                             title: $lt
 *                             description: The $not's $lt.
 *                           - type: object
 *                             description: The $not's $lt.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $lte:
 *                         oneOf:
 *                           - type: string
 *                             title: $lte
 *                             description: The $not's $lte.
 *                           - type: object
 *                             description: The $not's $lte.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: The $not's $like.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: The $not's $re.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: The $not's $ilike.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: The $not's $fulltext.
 *                       $overlap:
 *                         type: array
 *                         description: The $not's $overlap.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: The $overlap's details.
 *                       $contains:
 *                         type: array
 *                         description: The $not's $contains.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: The $contain's $contains.
 *                       $contained:
 *                         type: array
 *                         description: The $not's $contained.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: The $contained's details.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: The $not's $exists.
 *                   - type: array
 *                     description: The created at's $not.
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The $not's details.
 *                         - type: object
 *                           description: The $not's details.
 *                           x-schemaName: RegExp
 *                           required:
 *                             - exec
 *                             - test
 *                             - source
 *                             - global
 *                             - ignoreCase
 *                             - multiline
 *                             - lastIndex
 *                             - flags
 *                             - sticky
 *                             - unicode
 *                             - dotAll
 *                             - __@match@2351
 *                             - __@replace@2353
 *                             - __@search@2356
 *                             - __@matchAll@2360
 *                           properties:
 *                             exec:
 *                               type: object
 *                               description: The $not's exec.
 *                               properties: {}
 *                             test:
 *                               type: object
 *                               description: The $not's test.
 *                               properties: {}
 *                             source:
 *                               type: string
 *                               title: source
 *                               description: The $not's source.
 *                             global:
 *                               type: boolean
 *                               title: global
 *                               description: The $not's global.
 *                             ignoreCase:
 *                               type: boolean
 *                               title: ignoreCase
 *                               description: The $not's ignorecase.
 *                             multiline:
 *                               type: boolean
 *                               title: multiline
 *                               description: The $not's multiline.
 *                             lastIndex:
 *                               type: number
 *                               title: lastIndex
 *                               description: The $not's lastindex.
 *                             compile:
 *                               type: object
 *                               description: The $not's compile.
 *                               properties: {}
 *                             flags:
 *                               type: string
 *                               title: flags
 *                               description: The $not's flags.
 *                             sticky:
 *                               type: boolean
 *                               title: sticky
 *                               description: The $not's sticky.
 *                             unicode:
 *                               type: boolean
 *                               title: unicode
 *                               description: The $not's unicode.
 *                             dotAll:
 *                               type: boolean
 *                               title: dotAll
 *                               description: The $not's dotall.
 *                             __@match@2351:
 *                               type: object
 *                               description: The $not's   @match@2351.
 *                               properties: {}
 *                             __@replace@2353:
 *                               type: object
 *                               description: The $not's   @replace@2353.
 *                               properties: {}
 *                             __@search@2356:
 *                               type: object
 *                               description: The $not's   @search@2356.
 *                               properties: {}
 *                             __@split@2358:
 *                               type: object
 *                               description: The $not's   @split@2358.
 *                               properties: {}
 *                             __@matchAll@2360:
 *                               type: object
 *                               description: The $not's   @matchall@2360.
 *                               properties: {}
 *               $gt:
 *                 oneOf:
 *                   - type: string
 *                     title: $gt
 *                     description: The created at's $gt.
 *                   - type: object
 *                     description: The created at's $gt.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $gt's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $gt's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $gt's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $gt's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $gt's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $gt's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $gt's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $gt's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $gt's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $gt's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $gt's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $gt's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $gt's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $gt's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $gt's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $gt's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $gt's   @matchall@2360.
 *                         properties: {}
 *               $gte:
 *                 oneOf:
 *                   - type: string
 *                     title: $gte
 *                     description: The created at's $gte.
 *                   - type: object
 *                     description: The created at's $gte.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $gte's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $gte's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $gte's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $gte's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $gte's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $gte's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $gte's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $gte's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $gte's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $gte's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $gte's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $gte's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $gte's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $gte's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $gte's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $gte's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $gte's   @matchall@2360.
 *                         properties: {}
 *               $lt:
 *                 oneOf:
 *                   - type: string
 *                     title: $lt
 *                     description: The created at's $lt.
 *                   - type: object
 *                     description: The created at's $lt.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $lt's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $lt's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $lt's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $lt's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $lt's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $lt's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $lt's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $lt's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $lt's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $lt's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $lt's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $lt's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $lt's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $lt's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $lt's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $lt's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $lt's   @matchall@2360.
 *                         properties: {}
 *               $lte:
 *                 oneOf:
 *                   - type: string
 *                     title: $lte
 *                     description: The created at's $lte.
 *                   - type: object
 *                     description: The created at's $lte.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $lte's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $lte's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $lte's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $lte's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $lte's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $lte's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $lte's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $lte's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $lte's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $lte's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $lte's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $lte's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $lte's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $lte's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $lte's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $lte's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $lte's   @matchall@2360.
 *                         properties: {}
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: The created at's $like.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: The created at's $re.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: The created at's $ilike.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: The created at's $fulltext.
 *               $overlap:
 *                 type: array
 *                 description: The created at's $overlap.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: The $overlap's details.
 *               $contains:
 *                 type: array
 *                 description: The created at's $contains.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: The $contain's $contains.
 *               $contained:
 *                 type: array
 *                 description: The created at's $contained.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: The $contained's details.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: The created at's $exists.
 *           updated_at:
 *             type: object
 *             description: The product's updated at.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: The updated at's $and.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $and
 *                       description: The $and's details.
 *                     - type: object
 *                       description: The $and's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $and's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $and's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $and's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $and's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $and's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $and's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $and's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $and's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $and's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $and's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $and's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $and's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $and's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $and's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $and's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $and's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $and's   @matchall@2360.
 *                           properties: {}
 *                     - type: object
 *                       description: The $and's details.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $and's details.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $and
 *                                 description: The $and's details.
 *                               - type: object
 *                                 description: The $and's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $and's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $and's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $and
 *                                       description: The $and's details.
 *                                     - type: object
 *                                       description: The $and's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $or:
 *                           type: array
 *                           description: The $and's $or.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $or
 *                                 description: The $or's details.
 *                               - type: object
 *                                 description: The $or's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $or's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $or's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $or
 *                                       description: The $or's details.
 *                                     - type: object
 *                                       description: The $or's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: The $and's $eq.
 *                             - type: object
 *                               description: The $and's $eq.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's $eq.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: The $eq's details.
 *                                   - type: object
 *                                     description: The $eq's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $ne:
 *                           oneOf:
 *                             - type: string
 *                               title: $ne
 *                               description: The $and's $ne.
 *                             - type: object
 *                               description: The $and's $ne.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $in:
 *                           type: array
 *                           description: The $and's $in.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $in
 *                                 description: The $in's details.
 *                               - type: object
 *                                 description: The $in's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $nin:
 *                           type: array
 *                           description: The $and's $nin.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $nin
 *                                 description: The $nin's details.
 *                               - type: object
 *                                 description: The $nin's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: The $and's $not.
 *                             - type: object
 *                               description: The $and's $not.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $and's $not.
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's $not.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: The $not's details.
 *                                   - type: object
 *                                     description: The $not's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $gt:
 *                           oneOf:
 *                             - type: string
 *                               title: $gt
 *                               description: The $and's $gt.
 *                             - type: object
 *                               description: The $and's $gt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $gte:
 *                           oneOf:
 *                             - type: string
 *                               title: $gte
 *                               description: The $and's $gte.
 *                             - type: object
 *                               description: The $and's $gte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lt:
 *                           oneOf:
 *                             - type: string
 *                               title: $lt
 *                               description: The $and's $lt.
 *                             - type: object
 *                               description: The $and's $lt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lte:
 *                           oneOf:
 *                             - type: string
 *                               title: $lte
 *                               description: The $and's $lte.
 *                             - type: object
 *                               description: The $and's $lte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: The $and's $like.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: The $and's $re.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: The $and's $ilike.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: The $and's $fulltext.
 *                         $overlap:
 *                           type: array
 *                           description: The $and's $overlap.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: The $overlap's details.
 *                         $contains:
 *                           type: array
 *                           description: The $and's $contains.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: The $contain's $contains.
 *                         $contained:
 *                           type: array
 *                           description: The $and's $contained.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: The $contained's details.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: The $and's $exists.
 *                     - type: array
 *                       description: The $and's details.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             required:
 *                               - exec
 *                               - test
 *                               - source
 *                               - global
 *                               - ignoreCase
 *                               - multiline
 *                               - lastIndex
 *                               - flags
 *                               - sticky
 *                               - unicode
 *                               - dotAll
 *                               - __@match@2351
 *                               - __@replace@2353
 *                               - __@search@2356
 *                               - __@matchAll@2360
 *                             properties:
 *                               exec:
 *                                 type: object
 *                                 description: The $and's exec.
 *                                 properties: {}
 *                               test:
 *                                 type: object
 *                                 description: The $and's test.
 *                                 properties: {}
 *                               source:
 *                                 type: string
 *                                 title: source
 *                                 description: The $and's source.
 *                               global:
 *                                 type: boolean
 *                                 title: global
 *                                 description: The $and's global.
 *                               ignoreCase:
 *                                 type: boolean
 *                                 title: ignoreCase
 *                                 description: The $and's ignorecase.
 *                               multiline:
 *                                 type: boolean
 *                                 title: multiline
 *                                 description: The $and's multiline.
 *                               lastIndex:
 *                                 type: number
 *                                 title: lastIndex
 *                                 description: The $and's lastindex.
 *                               compile:
 *                                 type: object
 *                                 description: The $and's compile.
 *                                 properties: {}
 *                               flags:
 *                                 type: string
 *                                 title: flags
 *                                 description: The $and's flags.
 *                               sticky:
 *                                 type: boolean
 *                                 title: sticky
 *                                 description: The $and's sticky.
 *                               unicode:
 *                                 type: boolean
 *                                 title: unicode
 *                                 description: The $and's unicode.
 *                               dotAll:
 *                                 type: boolean
 *                                 title: dotAll
 *                                 description: The $and's dotall.
 *                               __@match@2351:
 *                                 type: object
 *                                 description: The $and's   @match@2351.
 *                                 properties: {}
 *                               __@replace@2353:
 *                                 type: object
 *                                 description: The $and's   @replace@2353.
 *                                 properties: {}
 *                               __@search@2356:
 *                                 type: object
 *                                 description: The $and's   @search@2356.
 *                                 properties: {}
 *                               __@split@2358:
 *                                 type: object
 *                                 description: The $and's   @split@2358.
 *                                 properties: {}
 *                               __@matchAll@2360:
 *                                 type: object
 *                                 description: The $and's   @matchall@2360.
 *                                 properties: {}
 *               $or:
 *                 type: array
 *                 description: The updated at's $or.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $or
 *                       description: The $or's details.
 *                     - type: object
 *                       description: The $or's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $or's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $or's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $or's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $or's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $or's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $or's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $or's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $or's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $or's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $or's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $or's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $or's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $or's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $or's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $or's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $or's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $or's   @matchall@2360.
 *                           properties: {}
 *                     - type: object
 *                       description: The $or's details.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $or's $and.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $and
 *                                 description: The $and's details.
 *                               - type: object
 *                                 description: The $and's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $and's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $and's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $and
 *                                       description: The $and's details.
 *                                     - type: object
 *                                       description: The $and's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $or:
 *                           type: array
 *                           description: The $or's details.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $or
 *                                 description: The $or's details.
 *                               - type: object
 *                                 description: The $or's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $or's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $or's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $or
 *                                       description: The $or's details.
 *                                     - type: object
 *                                       description: The $or's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: The $or's $eq.
 *                             - type: object
 *                               description: The $or's $eq.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's $eq.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: The $eq's details.
 *                                   - type: object
 *                                     description: The $eq's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $ne:
 *                           oneOf:
 *                             - type: string
 *                               title: $ne
 *                               description: The $or's $ne.
 *                             - type: object
 *                               description: The $or's $ne.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $in:
 *                           type: array
 *                           description: The $or's $in.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $in
 *                                 description: The $in's details.
 *                               - type: object
 *                                 description: The $in's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $nin:
 *                           type: array
 *                           description: The $or's $nin.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $nin
 *                                 description: The $nin's details.
 *                               - type: object
 *                                 description: The $nin's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: The $or's $not.
 *                             - type: object
 *                               description: The $or's $not.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $or's $not.
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's $not.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: The $not's details.
 *                                   - type: object
 *                                     description: The $not's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $gt:
 *                           oneOf:
 *                             - type: string
 *                               title: $gt
 *                               description: The $or's $gt.
 *                             - type: object
 *                               description: The $or's $gt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $gte:
 *                           oneOf:
 *                             - type: string
 *                               title: $gte
 *                               description: The $or's $gte.
 *                             - type: object
 *                               description: The $or's $gte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lt:
 *                           oneOf:
 *                             - type: string
 *                               title: $lt
 *                               description: The $or's $lt.
 *                             - type: object
 *                               description: The $or's $lt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lte:
 *                           oneOf:
 *                             - type: string
 *                               title: $lte
 *                               description: The $or's $lte.
 *                             - type: object
 *                               description: The $or's $lte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: The $or's $like.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: The $or's $re.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: The $or's $ilike.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: The $or's $fulltext.
 *                         $overlap:
 *                           type: array
 *                           description: The $or's $overlap.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: The $overlap's details.
 *                         $contains:
 *                           type: array
 *                           description: The $or's $contains.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: The $contain's $contains.
 *                         $contained:
 *                           type: array
 *                           description: The $or's $contained.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: The $contained's details.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: The $or's $exists.
 *                     - type: array
 *                       description: The $or's details.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             required:
 *                               - exec
 *                               - test
 *                               - source
 *                               - global
 *                               - ignoreCase
 *                               - multiline
 *                               - lastIndex
 *                               - flags
 *                               - sticky
 *                               - unicode
 *                               - dotAll
 *                               - __@match@2351
 *                               - __@replace@2353
 *                               - __@search@2356
 *                               - __@matchAll@2360
 *                             properties:
 *                               exec:
 *                                 type: object
 *                                 description: The $or's exec.
 *                                 properties: {}
 *                               test:
 *                                 type: object
 *                                 description: The $or's test.
 *                                 properties: {}
 *                               source:
 *                                 type: string
 *                                 title: source
 *                                 description: The $or's source.
 *                               global:
 *                                 type: boolean
 *                                 title: global
 *                                 description: The $or's global.
 *                               ignoreCase:
 *                                 type: boolean
 *                                 title: ignoreCase
 *                                 description: The $or's ignorecase.
 *                               multiline:
 *                                 type: boolean
 *                                 title: multiline
 *                                 description: The $or's multiline.
 *                               lastIndex:
 *                                 type: number
 *                                 title: lastIndex
 *                                 description: The $or's lastindex.
 *                               compile:
 *                                 type: object
 *                                 description: The $or's compile.
 *                                 properties: {}
 *                               flags:
 *                                 type: string
 *                                 title: flags
 *                                 description: The $or's flags.
 *                               sticky:
 *                                 type: boolean
 *                                 title: sticky
 *                                 description: The $or's sticky.
 *                               unicode:
 *                                 type: boolean
 *                                 title: unicode
 *                                 description: The $or's unicode.
 *                               dotAll:
 *                                 type: boolean
 *                                 title: dotAll
 *                                 description: The $or's dotall.
 *                               __@match@2351:
 *                                 type: object
 *                                 description: The $or's   @match@2351.
 *                                 properties: {}
 *                               __@replace@2353:
 *                                 type: object
 *                                 description: The $or's   @replace@2353.
 *                                 properties: {}
 *                               __@search@2356:
 *                                 type: object
 *                                 description: The $or's   @search@2356.
 *                                 properties: {}
 *                               __@split@2358:
 *                                 type: object
 *                                 description: The $or's   @split@2358.
 *                                 properties: {}
 *                               __@matchAll@2360:
 *                                 type: object
 *                                 description: The $or's   @matchall@2360.
 *                                 properties: {}
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: The updated at's $eq.
 *                   - type: object
 *                     description: The updated at's $eq.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $eq's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $eq's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $eq's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $eq's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $eq's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $eq's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $eq's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $eq's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $eq's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $eq's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $eq's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $eq's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $eq's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $eq's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $eq's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $eq's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $eq's   @matchall@2360.
 *                         properties: {}
 *                   - type: array
 *                     description: The updated at's $eq.
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The $eq's details.
 *                         - type: object
 *                           description: The $eq's details.
 *                           x-schemaName: RegExp
 *                           required:
 *                             - exec
 *                             - test
 *                             - source
 *                             - global
 *                             - ignoreCase
 *                             - multiline
 *                             - lastIndex
 *                             - flags
 *                             - sticky
 *                             - unicode
 *                             - dotAll
 *                             - __@match@2351
 *                             - __@replace@2353
 *                             - __@search@2356
 *                             - __@matchAll@2360
 *                           properties:
 *                             exec:
 *                               type: object
 *                               description: The $eq's exec.
 *                               properties: {}
 *                             test:
 *                               type: object
 *                               description: The $eq's test.
 *                               properties: {}
 *                             source:
 *                               type: string
 *                               title: source
 *                               description: The $eq's source.
 *                             global:
 *                               type: boolean
 *                               title: global
 *                               description: The $eq's global.
 *                             ignoreCase:
 *                               type: boolean
 *                               title: ignoreCase
 *                               description: The $eq's ignorecase.
 *                             multiline:
 *                               type: boolean
 *                               title: multiline
 *                               description: The $eq's multiline.
 *                             lastIndex:
 *                               type: number
 *                               title: lastIndex
 *                               description: The $eq's lastindex.
 *                             compile:
 *                               type: object
 *                               description: The $eq's compile.
 *                               properties: {}
 *                             flags:
 *                               type: string
 *                               title: flags
 *                               description: The $eq's flags.
 *                             sticky:
 *                               type: boolean
 *                               title: sticky
 *                               description: The $eq's sticky.
 *                             unicode:
 *                               type: boolean
 *                               title: unicode
 *                               description: The $eq's unicode.
 *                             dotAll:
 *                               type: boolean
 *                               title: dotAll
 *                               description: The $eq's dotall.
 *                             __@match@2351:
 *                               type: object
 *                               description: The $eq's   @match@2351.
 *                               properties: {}
 *                             __@replace@2353:
 *                               type: object
 *                               description: The $eq's   @replace@2353.
 *                               properties: {}
 *                             __@search@2356:
 *                               type: object
 *                               description: The $eq's   @search@2356.
 *                               properties: {}
 *                             __@split@2358:
 *                               type: object
 *                               description: The $eq's   @split@2358.
 *                               properties: {}
 *                             __@matchAll@2360:
 *                               type: object
 *                               description: The $eq's   @matchall@2360.
 *                               properties: {}
 *               $ne:
 *                 oneOf:
 *                   - type: string
 *                     title: $ne
 *                     description: The updated at's $ne.
 *                   - type: object
 *                     description: The updated at's $ne.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $ne's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $ne's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $ne's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $ne's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $ne's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $ne's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $ne's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $ne's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $ne's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $ne's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $ne's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $ne's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $ne's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $ne's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $ne's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $ne's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $ne's   @matchall@2360.
 *                         properties: {}
 *               $in:
 *                 type: array
 *                 description: The updated at's $in.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $in
 *                       description: The $in's details.
 *                     - type: object
 *                       description: The $in's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $in's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $in's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $in's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $in's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $in's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $in's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $in's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $in's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $in's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $in's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $in's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $in's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $in's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $in's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $in's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $in's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $in's   @matchall@2360.
 *                           properties: {}
 *               $nin:
 *                 type: array
 *                 description: The updated at's $nin.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $nin
 *                       description: The $nin's details.
 *                     - type: object
 *                       description: The $nin's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $nin's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $nin's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $nin's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $nin's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $nin's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $nin's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $nin's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $nin's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $nin's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $nin's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $nin's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $nin's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $nin's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $nin's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $nin's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $nin's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $nin's   @matchall@2360.
 *                           properties: {}
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: The updated at's $not.
 *                   - type: object
 *                     description: The updated at's $not.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $not's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $not's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $not's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $not's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $not's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $not's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $not's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $not's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $not's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $not's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $not's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $not's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $not's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $not's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $not's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $not's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $not's   @matchall@2360.
 *                         properties: {}
 *                   - type: object
 *                     description: The updated at's $not.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: The $not's $and.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $and
 *                               description: The $and's details.
 *                             - type: object
 *                               description: The $and's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $and's details.
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's details.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $and
 *                                     description: The $and's details.
 *                                   - type: object
 *                                     description: The $and's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $not's $or.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $or
 *                               description: The $or's details.
 *                             - type: object
 *                               description: The $or's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $or's details.
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's details.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $or
 *                                     description: The $or's details.
 *                                   - type: object
 *                                     description: The $or's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                       $eq:
 *                         oneOf:
 *                           - type: string
 *                             title: $eq
 *                             description: The $not's $eq.
 *                           - type: object
 *                             description: The $not's $eq.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: array
 *                             description: The $not's $eq.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $eq
 *                                   description: The $eq's details.
 *                                 - type: object
 *                                   description: The $eq's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                       $ne:
 *                         oneOf:
 *                           - type: string
 *                             title: $ne
 *                             description: The $not's $ne.
 *                           - type: object
 *                             description: The $not's $ne.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $in:
 *                         type: array
 *                         description: The $not's $in.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $in
 *                               description: The $in's details.
 *                             - type: object
 *                               description: The $in's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                       $nin:
 *                         type: array
 *                         description: The $not's $nin.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $nin
 *                               description: The $nin's details.
 *                             - type: object
 *                               description: The $nin's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                       $not:
 *                         oneOf:
 *                           - type: string
 *                             title: $not
 *                             description: The $not's details.
 *                           - type: object
 *                             description: The $not's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $not's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $not's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $not
 *                                   description: The $not's details.
 *                                 - type: object
 *                                   description: The $not's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                       $gt:
 *                         oneOf:
 *                           - type: string
 *                             title: $gt
 *                             description: The $not's $gt.
 *                           - type: object
 *                             description: The $not's $gt.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $gte:
 *                         oneOf:
 *                           - type: string
 *                             title: $gte
 *                             description: The $not's $gte.
 *                           - type: object
 *                             description: The $not's $gte.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $lt:
 *                         oneOf:
 *                           - type: string
 *                             title: $lt
 *                             description: The $not's $lt.
 *                           - type: object
 *                             description: The $not's $lt.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $lte:
 *                         oneOf:
 *                           - type: string
 *                             title: $lte
 *                             description: The $not's $lte.
 *                           - type: object
 *                             description: The $not's $lte.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: The $not's $like.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: The $not's $re.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: The $not's $ilike.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: The $not's $fulltext.
 *                       $overlap:
 *                         type: array
 *                         description: The $not's $overlap.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: The $overlap's details.
 *                       $contains:
 *                         type: array
 *                         description: The $not's $contains.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: The $contain's $contains.
 *                       $contained:
 *                         type: array
 *                         description: The $not's $contained.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: The $contained's details.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: The $not's $exists.
 *                   - type: array
 *                     description: The updated at's $not.
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The $not's details.
 *                         - type: object
 *                           description: The $not's details.
 *                           x-schemaName: RegExp
 *                           required:
 *                             - exec
 *                             - test
 *                             - source
 *                             - global
 *                             - ignoreCase
 *                             - multiline
 *                             - lastIndex
 *                             - flags
 *                             - sticky
 *                             - unicode
 *                             - dotAll
 *                             - __@match@2351
 *                             - __@replace@2353
 *                             - __@search@2356
 *                             - __@matchAll@2360
 *                           properties:
 *                             exec:
 *                               type: object
 *                               description: The $not's exec.
 *                               properties: {}
 *                             test:
 *                               type: object
 *                               description: The $not's test.
 *                               properties: {}
 *                             source:
 *                               type: string
 *                               title: source
 *                               description: The $not's source.
 *                             global:
 *                               type: boolean
 *                               title: global
 *                               description: The $not's global.
 *                             ignoreCase:
 *                               type: boolean
 *                               title: ignoreCase
 *                               description: The $not's ignorecase.
 *                             multiline:
 *                               type: boolean
 *                               title: multiline
 *                               description: The $not's multiline.
 *                             lastIndex:
 *                               type: number
 *                               title: lastIndex
 *                               description: The $not's lastindex.
 *                             compile:
 *                               type: object
 *                               description: The $not's compile.
 *                               properties: {}
 *                             flags:
 *                               type: string
 *                               title: flags
 *                               description: The $not's flags.
 *                             sticky:
 *                               type: boolean
 *                               title: sticky
 *                               description: The $not's sticky.
 *                             unicode:
 *                               type: boolean
 *                               title: unicode
 *                               description: The $not's unicode.
 *                             dotAll:
 *                               type: boolean
 *                               title: dotAll
 *                               description: The $not's dotall.
 *                             __@match@2351:
 *                               type: object
 *                               description: The $not's   @match@2351.
 *                               properties: {}
 *                             __@replace@2353:
 *                               type: object
 *                               description: The $not's   @replace@2353.
 *                               properties: {}
 *                             __@search@2356:
 *                               type: object
 *                               description: The $not's   @search@2356.
 *                               properties: {}
 *                             __@split@2358:
 *                               type: object
 *                               description: The $not's   @split@2358.
 *                               properties: {}
 *                             __@matchAll@2360:
 *                               type: object
 *                               description: The $not's   @matchall@2360.
 *                               properties: {}
 *               $gt:
 *                 oneOf:
 *                   - type: string
 *                     title: $gt
 *                     description: The updated at's $gt.
 *                   - type: object
 *                     description: The updated at's $gt.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $gt's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $gt's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $gt's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $gt's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $gt's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $gt's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $gt's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $gt's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $gt's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $gt's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $gt's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $gt's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $gt's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $gt's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $gt's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $gt's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $gt's   @matchall@2360.
 *                         properties: {}
 *               $gte:
 *                 oneOf:
 *                   - type: string
 *                     title: $gte
 *                     description: The updated at's $gte.
 *                   - type: object
 *                     description: The updated at's $gte.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $gte's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $gte's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $gte's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $gte's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $gte's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $gte's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $gte's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $gte's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $gte's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $gte's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $gte's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $gte's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $gte's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $gte's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $gte's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $gte's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $gte's   @matchall@2360.
 *                         properties: {}
 *               $lt:
 *                 oneOf:
 *                   - type: string
 *                     title: $lt
 *                     description: The updated at's $lt.
 *                   - type: object
 *                     description: The updated at's $lt.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $lt's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $lt's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $lt's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $lt's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $lt's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $lt's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $lt's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $lt's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $lt's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $lt's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $lt's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $lt's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $lt's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $lt's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $lt's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $lt's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $lt's   @matchall@2360.
 *                         properties: {}
 *               $lte:
 *                 oneOf:
 *                   - type: string
 *                     title: $lte
 *                     description: The updated at's $lte.
 *                   - type: object
 *                     description: The updated at's $lte.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $lte's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $lte's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $lte's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $lte's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $lte's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $lte's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $lte's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $lte's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $lte's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $lte's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $lte's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $lte's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $lte's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $lte's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $lte's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $lte's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $lte's   @matchall@2360.
 *                         properties: {}
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: The updated at's $like.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: The updated at's $re.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: The updated at's $ilike.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: The updated at's $fulltext.
 *               $overlap:
 *                 type: array
 *                 description: The updated at's $overlap.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: The $overlap's details.
 *               $contains:
 *                 type: array
 *                 description: The updated at's $contains.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: The $contain's $contains.
 *               $contained:
 *                 type: array
 *                 description: The updated at's $contained.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: The $contained's details.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: The updated at's $exists.
 *           deleted_at:
 *             type: object
 *             description: The product's deleted at.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: The deleted at's $and.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $and
 *                       description: The $and's details.
 *                     - type: object
 *                       description: The $and's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $and's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $and's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $and's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $and's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $and's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $and's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $and's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $and's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $and's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $and's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $and's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $and's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $and's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $and's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $and's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $and's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $and's   @matchall@2360.
 *                           properties: {}
 *                     - type: object
 *                       description: The $and's details.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $and's details.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $and
 *                                 description: The $and's details.
 *                               - type: object
 *                                 description: The $and's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $and's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $and's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $and
 *                                       description: The $and's details.
 *                                     - type: object
 *                                       description: The $and's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $or:
 *                           type: array
 *                           description: The $and's $or.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $or
 *                                 description: The $or's details.
 *                               - type: object
 *                                 description: The $or's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $or's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $or's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $or
 *                                       description: The $or's details.
 *                                     - type: object
 *                                       description: The $or's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: The $and's $eq.
 *                             - type: object
 *                               description: The $and's $eq.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's $eq.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: The $eq's details.
 *                                   - type: object
 *                                     description: The $eq's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $ne:
 *                           oneOf:
 *                             - type: string
 *                               title: $ne
 *                               description: The $and's $ne.
 *                             - type: object
 *                               description: The $and's $ne.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $in:
 *                           type: array
 *                           description: The $and's $in.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $in
 *                                 description: The $in's details.
 *                               - type: object
 *                                 description: The $in's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $nin:
 *                           type: array
 *                           description: The $and's $nin.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $nin
 *                                 description: The $nin's details.
 *                               - type: object
 *                                 description: The $nin's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: The $and's $not.
 *                             - type: object
 *                               description: The $and's $not.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $and's $not.
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's $not.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: The $not's details.
 *                                   - type: object
 *                                     description: The $not's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $gt:
 *                           oneOf:
 *                             - type: string
 *                               title: $gt
 *                               description: The $and's $gt.
 *                             - type: object
 *                               description: The $and's $gt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $gte:
 *                           oneOf:
 *                             - type: string
 *                               title: $gte
 *                               description: The $and's $gte.
 *                             - type: object
 *                               description: The $and's $gte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lt:
 *                           oneOf:
 *                             - type: string
 *                               title: $lt
 *                               description: The $and's $lt.
 *                             - type: object
 *                               description: The $and's $lt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lte:
 *                           oneOf:
 *                             - type: string
 *                               title: $lte
 *                               description: The $and's $lte.
 *                             - type: object
 *                               description: The $and's $lte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: The $and's $like.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: The $and's $re.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: The $and's $ilike.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: The $and's $fulltext.
 *                         $overlap:
 *                           type: array
 *                           description: The $and's $overlap.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: The $overlap's details.
 *                         $contains:
 *                           type: array
 *                           description: The $and's $contains.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: The $contain's $contains.
 *                         $contained:
 *                           type: array
 *                           description: The $and's $contained.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: The $contained's details.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: The $and's $exists.
 *                     - type: array
 *                       description: The $and's details.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             required:
 *                               - exec
 *                               - test
 *                               - source
 *                               - global
 *                               - ignoreCase
 *                               - multiline
 *                               - lastIndex
 *                               - flags
 *                               - sticky
 *                               - unicode
 *                               - dotAll
 *                               - __@match@2351
 *                               - __@replace@2353
 *                               - __@search@2356
 *                               - __@matchAll@2360
 *                             properties:
 *                               exec:
 *                                 type: object
 *                                 description: The $and's exec.
 *                                 properties: {}
 *                               test:
 *                                 type: object
 *                                 description: The $and's test.
 *                                 properties: {}
 *                               source:
 *                                 type: string
 *                                 title: source
 *                                 description: The $and's source.
 *                               global:
 *                                 type: boolean
 *                                 title: global
 *                                 description: The $and's global.
 *                               ignoreCase:
 *                                 type: boolean
 *                                 title: ignoreCase
 *                                 description: The $and's ignorecase.
 *                               multiline:
 *                                 type: boolean
 *                                 title: multiline
 *                                 description: The $and's multiline.
 *                               lastIndex:
 *                                 type: number
 *                                 title: lastIndex
 *                                 description: The $and's lastindex.
 *                               compile:
 *                                 type: object
 *                                 description: The $and's compile.
 *                                 properties: {}
 *                               flags:
 *                                 type: string
 *                                 title: flags
 *                                 description: The $and's flags.
 *                               sticky:
 *                                 type: boolean
 *                                 title: sticky
 *                                 description: The $and's sticky.
 *                               unicode:
 *                                 type: boolean
 *                                 title: unicode
 *                                 description: The $and's unicode.
 *                               dotAll:
 *                                 type: boolean
 *                                 title: dotAll
 *                                 description: The $and's dotall.
 *                               __@match@2351:
 *                                 type: object
 *                                 description: The $and's   @match@2351.
 *                                 properties: {}
 *                               __@replace@2353:
 *                                 type: object
 *                                 description: The $and's   @replace@2353.
 *                                 properties: {}
 *                               __@search@2356:
 *                                 type: object
 *                                 description: The $and's   @search@2356.
 *                                 properties: {}
 *                               __@split@2358:
 *                                 type: object
 *                                 description: The $and's   @split@2358.
 *                                 properties: {}
 *                               __@matchAll@2360:
 *                                 type: object
 *                                 description: The $and's   @matchall@2360.
 *                                 properties: {}
 *               $or:
 *                 type: array
 *                 description: The deleted at's $or.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $or
 *                       description: The $or's details.
 *                     - type: object
 *                       description: The $or's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $or's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $or's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $or's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $or's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $or's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $or's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $or's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $or's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $or's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $or's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $or's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $or's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $or's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $or's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $or's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $or's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $or's   @matchall@2360.
 *                           properties: {}
 *                     - type: object
 *                       description: The $or's details.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $or's $and.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $and
 *                                 description: The $and's details.
 *                               - type: object
 *                                 description: The $and's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $and's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $and's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $and
 *                                       description: The $and's details.
 *                                     - type: object
 *                                       description: The $and's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $or:
 *                           type: array
 *                           description: The $or's details.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $or
 *                                 description: The $or's details.
 *                               - type: object
 *                                 description: The $or's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                               - type: object
 *                                 description: The $or's details.
 *                                 properties: {}
 *                               - type: array
 *                                 description: The $or's details.
 *                                 items:
 *                                   oneOf:
 *                                     - type: string
 *                                       title: $or
 *                                       description: The $or's details.
 *                                     - type: object
 *                                       description: The $or's details.
 *                                       x-schemaName: RegExp
 *                                       properties: {}
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: The $or's $eq.
 *                             - type: object
 *                               description: The $or's $eq.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's $eq.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: The $eq's details.
 *                                   - type: object
 *                                     description: The $eq's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $ne:
 *                           oneOf:
 *                             - type: string
 *                               title: $ne
 *                               description: The $or's $ne.
 *                             - type: object
 *                               description: The $or's $ne.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $in:
 *                           type: array
 *                           description: The $or's $in.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $in
 *                                 description: The $in's details.
 *                               - type: object
 *                                 description: The $in's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $nin:
 *                           type: array
 *                           description: The $or's $nin.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $nin
 *                                 description: The $nin's details.
 *                               - type: object
 *                                 description: The $nin's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: The $or's $not.
 *                             - type: object
 *                               description: The $or's $not.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $or's $not.
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's $not.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: The $not's details.
 *                                   - type: object
 *                                     description: The $not's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                         $gt:
 *                           oneOf:
 *                             - type: string
 *                               title: $gt
 *                               description: The $or's $gt.
 *                             - type: object
 *                               description: The $or's $gt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $gte:
 *                           oneOf:
 *                             - type: string
 *                               title: $gte
 *                               description: The $or's $gte.
 *                             - type: object
 *                               description: The $or's $gte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lt:
 *                           oneOf:
 *                             - type: string
 *                               title: $lt
 *                               description: The $or's $lt.
 *                             - type: object
 *                               description: The $or's $lt.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $lte:
 *                           oneOf:
 *                             - type: string
 *                               title: $lte
 *                               description: The $or's $lte.
 *                             - type: object
 *                               description: The $or's $lte.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: The $or's $like.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: The $or's $re.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: The $or's $ilike.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: The $or's $fulltext.
 *                         $overlap:
 *                           type: array
 *                           description: The $or's $overlap.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: The $overlap's details.
 *                         $contains:
 *                           type: array
 *                           description: The $or's $contains.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: The $contain's $contains.
 *                         $contained:
 *                           type: array
 *                           description: The $or's $contained.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: The $contained's details.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: The $or's $exists.
 *                     - type: array
 *                       description: The $or's details.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             required:
 *                               - exec
 *                               - test
 *                               - source
 *                               - global
 *                               - ignoreCase
 *                               - multiline
 *                               - lastIndex
 *                               - flags
 *                               - sticky
 *                               - unicode
 *                               - dotAll
 *                               - __@match@2351
 *                               - __@replace@2353
 *                               - __@search@2356
 *                               - __@matchAll@2360
 *                             properties:
 *                               exec:
 *                                 type: object
 *                                 description: The $or's exec.
 *                                 properties: {}
 *                               test:
 *                                 type: object
 *                                 description: The $or's test.
 *                                 properties: {}
 *                               source:
 *                                 type: string
 *                                 title: source
 *                                 description: The $or's source.
 *                               global:
 *                                 type: boolean
 *                                 title: global
 *                                 description: The $or's global.
 *                               ignoreCase:
 *                                 type: boolean
 *                                 title: ignoreCase
 *                                 description: The $or's ignorecase.
 *                               multiline:
 *                                 type: boolean
 *                                 title: multiline
 *                                 description: The $or's multiline.
 *                               lastIndex:
 *                                 type: number
 *                                 title: lastIndex
 *                                 description: The $or's lastindex.
 *                               compile:
 *                                 type: object
 *                                 description: The $or's compile.
 *                                 properties: {}
 *                               flags:
 *                                 type: string
 *                                 title: flags
 *                                 description: The $or's flags.
 *                               sticky:
 *                                 type: boolean
 *                                 title: sticky
 *                                 description: The $or's sticky.
 *                               unicode:
 *                                 type: boolean
 *                                 title: unicode
 *                                 description: The $or's unicode.
 *                               dotAll:
 *                                 type: boolean
 *                                 title: dotAll
 *                                 description: The $or's dotall.
 *                               __@match@2351:
 *                                 type: object
 *                                 description: The $or's   @match@2351.
 *                                 properties: {}
 *                               __@replace@2353:
 *                                 type: object
 *                                 description: The $or's   @replace@2353.
 *                                 properties: {}
 *                               __@search@2356:
 *                                 type: object
 *                                 description: The $or's   @search@2356.
 *                                 properties: {}
 *                               __@split@2358:
 *                                 type: object
 *                                 description: The $or's   @split@2358.
 *                                 properties: {}
 *                               __@matchAll@2360:
 *                                 type: object
 *                                 description: The $or's   @matchall@2360.
 *                                 properties: {}
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: The deleted at's $eq.
 *                   - type: object
 *                     description: The deleted at's $eq.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $eq's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $eq's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $eq's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $eq's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $eq's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $eq's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $eq's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $eq's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $eq's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $eq's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $eq's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $eq's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $eq's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $eq's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $eq's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $eq's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $eq's   @matchall@2360.
 *                         properties: {}
 *                   - type: array
 *                     description: The deleted at's $eq.
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The $eq's details.
 *                         - type: object
 *                           description: The $eq's details.
 *                           x-schemaName: RegExp
 *                           required:
 *                             - exec
 *                             - test
 *                             - source
 *                             - global
 *                             - ignoreCase
 *                             - multiline
 *                             - lastIndex
 *                             - flags
 *                             - sticky
 *                             - unicode
 *                             - dotAll
 *                             - __@match@2351
 *                             - __@replace@2353
 *                             - __@search@2356
 *                             - __@matchAll@2360
 *                           properties:
 *                             exec:
 *                               type: object
 *                               description: The $eq's exec.
 *                               properties: {}
 *                             test:
 *                               type: object
 *                               description: The $eq's test.
 *                               properties: {}
 *                             source:
 *                               type: string
 *                               title: source
 *                               description: The $eq's source.
 *                             global:
 *                               type: boolean
 *                               title: global
 *                               description: The $eq's global.
 *                             ignoreCase:
 *                               type: boolean
 *                               title: ignoreCase
 *                               description: The $eq's ignorecase.
 *                             multiline:
 *                               type: boolean
 *                               title: multiline
 *                               description: The $eq's multiline.
 *                             lastIndex:
 *                               type: number
 *                               title: lastIndex
 *                               description: The $eq's lastindex.
 *                             compile:
 *                               type: object
 *                               description: The $eq's compile.
 *                               properties: {}
 *                             flags:
 *                               type: string
 *                               title: flags
 *                               description: The $eq's flags.
 *                             sticky:
 *                               type: boolean
 *                               title: sticky
 *                               description: The $eq's sticky.
 *                             unicode:
 *                               type: boolean
 *                               title: unicode
 *                               description: The $eq's unicode.
 *                             dotAll:
 *                               type: boolean
 *                               title: dotAll
 *                               description: The $eq's dotall.
 *                             __@match@2351:
 *                               type: object
 *                               description: The $eq's   @match@2351.
 *                               properties: {}
 *                             __@replace@2353:
 *                               type: object
 *                               description: The $eq's   @replace@2353.
 *                               properties: {}
 *                             __@search@2356:
 *                               type: object
 *                               description: The $eq's   @search@2356.
 *                               properties: {}
 *                             __@split@2358:
 *                               type: object
 *                               description: The $eq's   @split@2358.
 *                               properties: {}
 *                             __@matchAll@2360:
 *                               type: object
 *                               description: The $eq's   @matchall@2360.
 *                               properties: {}
 *               $ne:
 *                 oneOf:
 *                   - type: string
 *                     title: $ne
 *                     description: The deleted at's $ne.
 *                   - type: object
 *                     description: The deleted at's $ne.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $ne's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $ne's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $ne's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $ne's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $ne's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $ne's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $ne's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $ne's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $ne's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $ne's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $ne's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $ne's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $ne's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $ne's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $ne's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $ne's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $ne's   @matchall@2360.
 *                         properties: {}
 *               $in:
 *                 type: array
 *                 description: The deleted at's $in.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $in
 *                       description: The $in's details.
 *                     - type: object
 *                       description: The $in's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $in's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $in's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $in's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $in's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $in's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $in's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $in's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $in's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $in's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $in's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $in's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $in's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $in's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $in's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $in's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $in's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $in's   @matchall@2360.
 *                           properties: {}
 *               $nin:
 *                 type: array
 *                 description: The deleted at's $nin.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $nin
 *                       description: The $nin's details.
 *                     - type: object
 *                       description: The $nin's details.
 *                       x-schemaName: RegExp
 *                       required:
 *                         - exec
 *                         - test
 *                         - source
 *                         - global
 *                         - ignoreCase
 *                         - multiline
 *                         - lastIndex
 *                         - flags
 *                         - sticky
 *                         - unicode
 *                         - dotAll
 *                         - __@match@2351
 *                         - __@replace@2353
 *                         - __@search@2356
 *                         - __@matchAll@2360
 *                       properties:
 *                         exec:
 *                           type: object
 *                           description: The $nin's exec.
 *                           properties: {}
 *                         test:
 *                           type: object
 *                           description: The $nin's test.
 *                           properties: {}
 *                         source:
 *                           type: string
 *                           title: source
 *                           description: The $nin's source.
 *                         global:
 *                           type: boolean
 *                           title: global
 *                           description: The $nin's global.
 *                         ignoreCase:
 *                           type: boolean
 *                           title: ignoreCase
 *                           description: The $nin's ignorecase.
 *                         multiline:
 *                           type: boolean
 *                           title: multiline
 *                           description: The $nin's multiline.
 *                         lastIndex:
 *                           type: number
 *                           title: lastIndex
 *                           description: The $nin's lastindex.
 *                         compile:
 *                           type: object
 *                           description: The $nin's compile.
 *                           properties: {}
 *                         flags:
 *                           type: string
 *                           title: flags
 *                           description: The $nin's flags.
 *                         sticky:
 *                           type: boolean
 *                           title: sticky
 *                           description: The $nin's sticky.
 *                         unicode:
 *                           type: boolean
 *                           title: unicode
 *                           description: The $nin's unicode.
 *                         dotAll:
 *                           type: boolean
 *                           title: dotAll
 *                           description: The $nin's dotall.
 *                         __@match@2351:
 *                           type: object
 *                           description: The $nin's   @match@2351.
 *                           properties: {}
 *                         __@replace@2353:
 *                           type: object
 *                           description: The $nin's   @replace@2353.
 *                           properties: {}
 *                         __@search@2356:
 *                           type: object
 *                           description: The $nin's   @search@2356.
 *                           properties: {}
 *                         __@split@2358:
 *                           type: object
 *                           description: The $nin's   @split@2358.
 *                           properties: {}
 *                         __@matchAll@2360:
 *                           type: object
 *                           description: The $nin's   @matchall@2360.
 *                           properties: {}
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: The deleted at's $not.
 *                   - type: object
 *                     description: The deleted at's $not.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $not's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $not's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $not's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $not's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $not's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $not's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $not's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $not's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $not's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $not's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $not's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $not's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $not's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $not's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $not's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $not's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $not's   @matchall@2360.
 *                         properties: {}
 *                   - type: object
 *                     description: The deleted at's $not.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: The $not's $and.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $and
 *                               description: The $and's details.
 *                             - type: object
 *                               description: The $and's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $and's details.
 *                               properties: {}
 *                             - type: array
 *                               description: The $and's details.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $and
 *                                     description: The $and's details.
 *                                   - type: object
 *                                     description: The $and's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $not's $or.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $or
 *                               description: The $or's details.
 *                             - type: object
 *                               description: The $or's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                             - type: object
 *                               description: The $or's details.
 *                               properties: {}
 *                             - type: array
 *                               description: The $or's details.
 *                               items:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $or
 *                                     description: The $or's details.
 *                                   - type: object
 *                                     description: The $or's details.
 *                                     x-schemaName: RegExp
 *                                     properties: {}
 *                       $eq:
 *                         oneOf:
 *                           - type: string
 *                             title: $eq
 *                             description: The $not's $eq.
 *                           - type: object
 *                             description: The $not's $eq.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: array
 *                             description: The $not's $eq.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $eq
 *                                   description: The $eq's details.
 *                                 - type: object
 *                                   description: The $eq's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                       $ne:
 *                         oneOf:
 *                           - type: string
 *                             title: $ne
 *                             description: The $not's $ne.
 *                           - type: object
 *                             description: The $not's $ne.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $in:
 *                         type: array
 *                         description: The $not's $in.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $in
 *                               description: The $in's details.
 *                             - type: object
 *                               description: The $in's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                       $nin:
 *                         type: array
 *                         description: The $not's $nin.
 *                         items:
 *                           oneOf:
 *                             - type: string
 *                               title: $nin
 *                               description: The $nin's details.
 *                             - type: object
 *                               description: The $nin's details.
 *                               x-schemaName: RegExp
 *                               properties: {}
 *                       $not:
 *                         oneOf:
 *                           - type: string
 *                             title: $not
 *                             description: The $not's details.
 *                           - type: object
 *                             description: The $not's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $not's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $not's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $not
 *                                   description: The $not's details.
 *                                 - type: object
 *                                   description: The $not's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                       $gt:
 *                         oneOf:
 *                           - type: string
 *                             title: $gt
 *                             description: The $not's $gt.
 *                           - type: object
 *                             description: The $not's $gt.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $gte:
 *                         oneOf:
 *                           - type: string
 *                             title: $gte
 *                             description: The $not's $gte.
 *                           - type: object
 *                             description: The $not's $gte.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $lt:
 *                         oneOf:
 *                           - type: string
 *                             title: $lt
 *                             description: The $not's $lt.
 *                           - type: object
 *                             description: The $not's $lt.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $lte:
 *                         oneOf:
 *                           - type: string
 *                             title: $lte
 *                             description: The $not's $lte.
 *                           - type: object
 *                             description: The $not's $lte.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: The $not's $like.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: The $not's $re.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: The $not's $ilike.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: The $not's $fulltext.
 *                       $overlap:
 *                         type: array
 *                         description: The $not's $overlap.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: The $overlap's details.
 *                       $contains:
 *                         type: array
 *                         description: The $not's $contains.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: The $contain's $contains.
 *                       $contained:
 *                         type: array
 *                         description: The $not's $contained.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: The $contained's details.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: The $not's $exists.
 *                   - type: array
 *                     description: The deleted at's $not.
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The $not's details.
 *                         - type: object
 *                           description: The $not's details.
 *                           x-schemaName: RegExp
 *                           required:
 *                             - exec
 *                             - test
 *                             - source
 *                             - global
 *                             - ignoreCase
 *                             - multiline
 *                             - lastIndex
 *                             - flags
 *                             - sticky
 *                             - unicode
 *                             - dotAll
 *                             - __@match@2351
 *                             - __@replace@2353
 *                             - __@search@2356
 *                             - __@matchAll@2360
 *                           properties:
 *                             exec:
 *                               type: object
 *                               description: The $not's exec.
 *                               properties: {}
 *                             test:
 *                               type: object
 *                               description: The $not's test.
 *                               properties: {}
 *                             source:
 *                               type: string
 *                               title: source
 *                               description: The $not's source.
 *                             global:
 *                               type: boolean
 *                               title: global
 *                               description: The $not's global.
 *                             ignoreCase:
 *                               type: boolean
 *                               title: ignoreCase
 *                               description: The $not's ignorecase.
 *                             multiline:
 *                               type: boolean
 *                               title: multiline
 *                               description: The $not's multiline.
 *                             lastIndex:
 *                               type: number
 *                               title: lastIndex
 *                               description: The $not's lastindex.
 *                             compile:
 *                               type: object
 *                               description: The $not's compile.
 *                               properties: {}
 *                             flags:
 *                               type: string
 *                               title: flags
 *                               description: The $not's flags.
 *                             sticky:
 *                               type: boolean
 *                               title: sticky
 *                               description: The $not's sticky.
 *                             unicode:
 *                               type: boolean
 *                               title: unicode
 *                               description: The $not's unicode.
 *                             dotAll:
 *                               type: boolean
 *                               title: dotAll
 *                               description: The $not's dotall.
 *                             __@match@2351:
 *                               type: object
 *                               description: The $not's   @match@2351.
 *                               properties: {}
 *                             __@replace@2353:
 *                               type: object
 *                               description: The $not's   @replace@2353.
 *                               properties: {}
 *                             __@search@2356:
 *                               type: object
 *                               description: The $not's   @search@2356.
 *                               properties: {}
 *                             __@split@2358:
 *                               type: object
 *                               description: The $not's   @split@2358.
 *                               properties: {}
 *                             __@matchAll@2360:
 *                               type: object
 *                               description: The $not's   @matchall@2360.
 *                               properties: {}
 *               $gt:
 *                 oneOf:
 *                   - type: string
 *                     title: $gt
 *                     description: The deleted at's $gt.
 *                   - type: object
 *                     description: The deleted at's $gt.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $gt's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $gt's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $gt's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $gt's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $gt's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $gt's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $gt's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $gt's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $gt's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $gt's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $gt's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $gt's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $gt's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $gt's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $gt's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $gt's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $gt's   @matchall@2360.
 *                         properties: {}
 *               $gte:
 *                 oneOf:
 *                   - type: string
 *                     title: $gte
 *                     description: The deleted at's $gte.
 *                   - type: object
 *                     description: The deleted at's $gte.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $gte's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $gte's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $gte's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $gte's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $gte's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $gte's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $gte's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $gte's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $gte's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $gte's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $gte's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $gte's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $gte's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $gte's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $gte's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $gte's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $gte's   @matchall@2360.
 *                         properties: {}
 *               $lt:
 *                 oneOf:
 *                   - type: string
 *                     title: $lt
 *                     description: The deleted at's $lt.
 *                   - type: object
 *                     description: The deleted at's $lt.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $lt's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $lt's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $lt's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $lt's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $lt's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $lt's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $lt's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $lt's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $lt's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $lt's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $lt's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $lt's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $lt's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $lt's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $lt's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $lt's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $lt's   @matchall@2360.
 *                         properties: {}
 *               $lte:
 *                 oneOf:
 *                   - type: string
 *                     title: $lte
 *                     description: The deleted at's $lte.
 *                   - type: object
 *                     description: The deleted at's $lte.
 *                     x-schemaName: RegExp
 *                     required:
 *                       - exec
 *                       - test
 *                       - source
 *                       - global
 *                       - ignoreCase
 *                       - multiline
 *                       - lastIndex
 *                       - flags
 *                       - sticky
 *                       - unicode
 *                       - dotAll
 *                       - __@match@2351
 *                       - __@replace@2353
 *                       - __@search@2356
 *                       - __@matchAll@2360
 *                     properties:
 *                       exec:
 *                         type: object
 *                         description: The $lte's exec.
 *                         properties: {}
 *                       test:
 *                         type: object
 *                         description: The $lte's test.
 *                         properties: {}
 *                       source:
 *                         type: string
 *                         title: source
 *                         description: The $lte's source.
 *                       global:
 *                         type: boolean
 *                         title: global
 *                         description: The $lte's global.
 *                       ignoreCase:
 *                         type: boolean
 *                         title: ignoreCase
 *                         description: The $lte's ignorecase.
 *                       multiline:
 *                         type: boolean
 *                         title: multiline
 *                         description: The $lte's multiline.
 *                       lastIndex:
 *                         type: number
 *                         title: lastIndex
 *                         description: The $lte's lastindex.
 *                       compile:
 *                         type: object
 *                         description: The $lte's compile.
 *                         properties: {}
 *                       flags:
 *                         type: string
 *                         title: flags
 *                         description: The $lte's flags.
 *                       sticky:
 *                         type: boolean
 *                         title: sticky
 *                         description: The $lte's sticky.
 *                       unicode:
 *                         type: boolean
 *                         title: unicode
 *                         description: The $lte's unicode.
 *                       dotAll:
 *                         type: boolean
 *                         title: dotAll
 *                         description: The $lte's dotall.
 *                       __@match@2351:
 *                         type: object
 *                         description: The $lte's   @match@2351.
 *                         properties: {}
 *                       __@replace@2353:
 *                         type: object
 *                         description: The $lte's   @replace@2353.
 *                         properties: {}
 *                       __@search@2356:
 *                         type: object
 *                         description: The $lte's   @search@2356.
 *                         properties: {}
 *                       __@split@2358:
 *                         type: object
 *                         description: The $lte's   @split@2358.
 *                         properties: {}
 *                       __@matchAll@2360:
 *                         type: object
 *                         description: The $lte's   @matchall@2360.
 *                         properties: {}
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: The deleted at's $like.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: The deleted at's $re.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: The deleted at's $ilike.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: The deleted at's $fulltext.
 *               $overlap:
 *                 type: array
 *                 description: The deleted at's $overlap.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: The $overlap's details.
 *               $contains:
 *                 type: array
 *                 description: The deleted at's $contains.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: The $contain's $contains.
 *               $contained:
 *                 type: array
 *                 description: The deleted at's $contained.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: The $contained's details.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: The deleted at's $exists.
 *           $and:
 *             type: array
 *             description: The product's $and.
 *             items:
 *               type: object
 *               description: The $and's details.
 *               x-schemaName: AdminGetProductsParams
 *               properties:
 *                 q:
 *                   type: string
 *                   title: q
 *                   description: The $and's q.
 *                 id:
 *                   oneOf:
 *                     - type: string
 *                       title: id
 *                       description: The $and's ID.
 *                     - type: array
 *                       description: The $and's ID.
 *                       items:
 *                         type: string
 *                         title: id
 *                         description: The id's ID.
 *                 status:
 *                   type: array
 *                   description: The $and's status.
 *                   items:
 *                     type: string
 *                     enum:
 *                       - draft
 *                       - proposed
 *                       - published
 *                       - rejected
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The $and's title.
 *                 handle:
 *                   type: string
 *                   title: handle
 *                   description: The $and's handle.
 *                 is_giftcard:
 *                   type: boolean
 *                   title: is_giftcard
 *                   description: The $and's is giftcard.
 *                 price_list_id:
 *                   type: array
 *                   description: The $and's price list id.
 *                   items:
 *                     type: string
 *                     title: price_list_id
 *                     description: The price list id's details.
 *                 sales_channel_id:
 *                   type: array
 *                   description: The $and's sales channel id.
 *                   items:
 *                     type: string
 *                     title: sales_channel_id
 *                     description: The sales channel id's details.
 *                 collection_id:
 *                   type: array
 *                   description: The $and's collection id.
 *                   items:
 *                     type: string
 *                     title: collection_id
 *                     description: The collection id's details.
 *                 tags:
 *                   type: array
 *                   description: The $and's tags.
 *                   items:
 *                     type: string
 *                     title: tags
 *                     description: The tag's tags.
 *                 type_id:
 *                   type: array
 *                   description: The $and's type id.
 *                   items:
 *                     type: string
 *                     title: type_id
 *                     description: The type id's details.
 *                 variants:
 *                   type: object
 *                   description: The $and's variants.
 *                   properties: {}
 *                 created_at:
 *                   type: object
 *                   description: The $and's created at.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: The created at's $and.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $and's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $and's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $and
 *                                   description: The $and's details.
 *                                 - type: object
 *                                   description: The $and's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $or:
 *                       type: array
 *                       description: The created at's $or.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $or's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $or's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $or
 *                                   description: The $or's details.
 *                                 - type: object
 *                                   description: The $or's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The created at's $eq.
 *                         - type: object
 *                           description: The created at's $eq.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: array
 *                           description: The created at's $eq.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: The $eq's details.
 *                               - type: object
 *                                 description: The $eq's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $ne:
 *                       oneOf:
 *                         - type: string
 *                           title: $ne
 *                           description: The created at's $ne.
 *                         - type: object
 *                           description: The created at's $ne.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $in:
 *                       type: array
 *                       description: The created at's $in.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $in
 *                             description: The $in's details.
 *                           - type: object
 *                             description: The $in's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $nin:
 *                       type: array
 *                       description: The created at's $nin.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $nin
 *                             description: The $nin's details.
 *                           - type: object
 *                             description: The $nin's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The created at's $not.
 *                         - type: object
 *                           description: The created at's $not.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: object
 *                           description: The created at's $not.
 *                           properties: {}
 *                         - type: array
 *                           description: The created at's $not.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: The $not's details.
 *                               - type: object
 *                                 description: The $not's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $gt:
 *                       oneOf:
 *                         - type: string
 *                           title: $gt
 *                           description: The created at's $gt.
 *                         - type: object
 *                           description: The created at's $gt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $gte:
 *                       oneOf:
 *                         - type: string
 *                           title: $gte
 *                           description: The created at's $gte.
 *                         - type: object
 *                           description: The created at's $gte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lt:
 *                       oneOf:
 *                         - type: string
 *                           title: $lt
 *                           description: The created at's $lt.
 *                         - type: object
 *                           description: The created at's $lt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lte:
 *                       oneOf:
 *                         - type: string
 *                           title: $lte
 *                           description: The created at's $lte.
 *                         - type: object
 *                           description: The created at's $lte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: The created at's $like.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: The created at's $re.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: The created at's $ilike.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: The created at's $fulltext.
 *                     $overlap:
 *                       type: array
 *                       description: The created at's $overlap.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: The $overlap's details.
 *                     $contains:
 *                       type: array
 *                       description: The created at's $contains.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: The $contain's $contains.
 *                     $contained:
 *                       type: array
 *                       description: The created at's $contained.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: The $contained's details.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: The created at's $exists.
 *                 updated_at:
 *                   type: object
 *                   description: The $and's updated at.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: The updated at's $and.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $and's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $and's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $and
 *                                   description: The $and's details.
 *                                 - type: object
 *                                   description: The $and's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $or:
 *                       type: array
 *                       description: The updated at's $or.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $or's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $or's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $or
 *                                   description: The $or's details.
 *                                 - type: object
 *                                   description: The $or's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The updated at's $eq.
 *                         - type: object
 *                           description: The updated at's $eq.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: array
 *                           description: The updated at's $eq.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: The $eq's details.
 *                               - type: object
 *                                 description: The $eq's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $ne:
 *                       oneOf:
 *                         - type: string
 *                           title: $ne
 *                           description: The updated at's $ne.
 *                         - type: object
 *                           description: The updated at's $ne.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $in:
 *                       type: array
 *                       description: The updated at's $in.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $in
 *                             description: The $in's details.
 *                           - type: object
 *                             description: The $in's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $nin:
 *                       type: array
 *                       description: The updated at's $nin.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $nin
 *                             description: The $nin's details.
 *                           - type: object
 *                             description: The $nin's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The updated at's $not.
 *                         - type: object
 *                           description: The updated at's $not.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: object
 *                           description: The updated at's $not.
 *                           properties: {}
 *                         - type: array
 *                           description: The updated at's $not.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: The $not's details.
 *                               - type: object
 *                                 description: The $not's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $gt:
 *                       oneOf:
 *                         - type: string
 *                           title: $gt
 *                           description: The updated at's $gt.
 *                         - type: object
 *                           description: The updated at's $gt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $gte:
 *                       oneOf:
 *                         - type: string
 *                           title: $gte
 *                           description: The updated at's $gte.
 *                         - type: object
 *                           description: The updated at's $gte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lt:
 *                       oneOf:
 *                         - type: string
 *                           title: $lt
 *                           description: The updated at's $lt.
 *                         - type: object
 *                           description: The updated at's $lt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lte:
 *                       oneOf:
 *                         - type: string
 *                           title: $lte
 *                           description: The updated at's $lte.
 *                         - type: object
 *                           description: The updated at's $lte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: The updated at's $like.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: The updated at's $re.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: The updated at's $ilike.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: The updated at's $fulltext.
 *                     $overlap:
 *                       type: array
 *                       description: The updated at's $overlap.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: The $overlap's details.
 *                     $contains:
 *                       type: array
 *                       description: The updated at's $contains.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: The $contain's $contains.
 *                     $contained:
 *                       type: array
 *                       description: The updated at's $contained.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: The $contained's details.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: The updated at's $exists.
 *                 deleted_at:
 *                   type: object
 *                   description: The $and's deleted at.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: The deleted at's $and.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $and's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $and's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $and
 *                                   description: The $and's details.
 *                                 - type: object
 *                                   description: The $and's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $or:
 *                       type: array
 *                       description: The deleted at's $or.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $or's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $or's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $or
 *                                   description: The $or's details.
 *                                 - type: object
 *                                   description: The $or's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The deleted at's $eq.
 *                         - type: object
 *                           description: The deleted at's $eq.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: array
 *                           description: The deleted at's $eq.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: The $eq's details.
 *                               - type: object
 *                                 description: The $eq's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $ne:
 *                       oneOf:
 *                         - type: string
 *                           title: $ne
 *                           description: The deleted at's $ne.
 *                         - type: object
 *                           description: The deleted at's $ne.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $in:
 *                       type: array
 *                       description: The deleted at's $in.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $in
 *                             description: The $in's details.
 *                           - type: object
 *                             description: The $in's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $nin:
 *                       type: array
 *                       description: The deleted at's $nin.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $nin
 *                             description: The $nin's details.
 *                           - type: object
 *                             description: The $nin's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The deleted at's $not.
 *                         - type: object
 *                           description: The deleted at's $not.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: object
 *                           description: The deleted at's $not.
 *                           properties: {}
 *                         - type: array
 *                           description: The deleted at's $not.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: The $not's details.
 *                               - type: object
 *                                 description: The $not's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $gt:
 *                       oneOf:
 *                         - type: string
 *                           title: $gt
 *                           description: The deleted at's $gt.
 *                         - type: object
 *                           description: The deleted at's $gt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $gte:
 *                       oneOf:
 *                         - type: string
 *                           title: $gte
 *                           description: The deleted at's $gte.
 *                         - type: object
 *                           description: The deleted at's $gte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lt:
 *                       oneOf:
 *                         - type: string
 *                           title: $lt
 *                           description: The deleted at's $lt.
 *                         - type: object
 *                           description: The deleted at's $lt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lte:
 *                       oneOf:
 *                         - type: string
 *                           title: $lte
 *                           description: The deleted at's $lte.
 *                         - type: object
 *                           description: The deleted at's $lte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: The deleted at's $like.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: The deleted at's $re.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: The deleted at's $ilike.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: The deleted at's $fulltext.
 *                     $overlap:
 *                       type: array
 *                       description: The deleted at's $overlap.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: The $overlap's details.
 *                     $contains:
 *                       type: array
 *                       description: The deleted at's $contains.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: The $contain's $contains.
 *                     $contained:
 *                       type: array
 *                       description: The deleted at's $contained.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: The $contained's details.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: The deleted at's $exists.
 *                 $and:
 *                   type: array
 *                   description: The $and's details.
 *                   items:
 *                     type: object
 *                     description: The $and's details.
 *                     x-schemaName: AdminGetProductsParams
 *                     properties:
 *                       q:
 *                         type: string
 *                         title: q
 *                         description: The $and's q.
 *                       id:
 *                         oneOf:
 *                           - type: string
 *                             title: id
 *                             description: The $and's ID.
 *                           - type: array
 *                             description: The $and's ID.
 *                             items:
 *                               type: string
 *                               title: id
 *                               description: The id's ID.
 *                       status:
 *                         type: array
 *                         description: The $and's status.
 *                         items:
 *                           type: string
 *                           enum:
 *                             - draft
 *                             - proposed
 *                             - published
 *                             - rejected
 *                       title:
 *                         type: string
 *                         title: title
 *                         description: The $and's title.
 *                       handle:
 *                         type: string
 *                         title: handle
 *                         description: The $and's handle.
 *                       is_giftcard:
 *                         type: boolean
 *                         title: is_giftcard
 *                         description: The $and's is giftcard.
 *                       price_list_id:
 *                         type: array
 *                         description: The $and's price list id.
 *                         items:
 *                           type: string
 *                           title: price_list_id
 *                           description: The price list id's details.
 *                       sales_channel_id:
 *                         type: array
 *                         description: The $and's sales channel id.
 *                         items:
 *                           type: string
 *                           title: sales_channel_id
 *                           description: The sales channel id's details.
 *                       collection_id:
 *                         type: array
 *                         description: The $and's collection id.
 *                         items:
 *                           type: string
 *                           title: collection_id
 *                           description: The collection id's details.
 *                       tags:
 *                         type: array
 *                         description: The $and's tags.
 *                         items:
 *                           type: string
 *                           title: tags
 *                           description: The tag's tags.
 *                       type_id:
 *                         type: array
 *                         description: The $and's type id.
 *                         items:
 *                           type: string
 *                           title: type_id
 *                           description: The type id's details.
 *                       variants:
 *                         type: object
 *                         description: The $and's variants.
 *                         properties: {}
 *                       created_at:
 *                         type: object
 *                         description: The $and's created at.
 *                         properties: {}
 *                       updated_at:
 *                         type: object
 *                         description: The $and's updated at.
 *                         properties: {}
 *                       deleted_at:
 *                         type: object
 *                         description: The $and's deleted at.
 *                         properties: {}
 *                       $and:
 *                         type: array
 *                         description: The $and's details.
 *                         items:
 *                           type: object
 *                           description: The $and's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $and's $or.
 *                         items:
 *                           type: object
 *                           description: The $or's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       expand:
 *                         type: string
 *                         title: expand
 *                         description: The $and's expand.
 *                       fields:
 *                         type: string
 *                         title: fields
 *                         description: The $and's fields.
 *                       offset:
 *                         type: number
 *                         title: offset
 *                         description: The $and's offset.
 *                       limit:
 *                         type: number
 *                         title: limit
 *                         description: The $and's limit.
 *                       order:
 *                         type: string
 *                         title: order
 *                         description: The $and's order.
 *                 $or:
 *                   type: array
 *                   description: The $and's $or.
 *                   items:
 *                     type: object
 *                     description: The $or's details.
 *                     x-schemaName: AdminGetProductsParams
 *                     properties:
 *                       q:
 *                         type: string
 *                         title: q
 *                         description: The $or's q.
 *                       id:
 *                         oneOf:
 *                           - type: string
 *                             title: id
 *                             description: The $or's ID.
 *                           - type: array
 *                             description: The $or's ID.
 *                             items:
 *                               type: string
 *                               title: id
 *                               description: The id's ID.
 *                       status:
 *                         type: array
 *                         description: The $or's status.
 *                         items:
 *                           type: string
 *                           enum:
 *                             - draft
 *                             - proposed
 *                             - published
 *                             - rejected
 *                       title:
 *                         type: string
 *                         title: title
 *                         description: The $or's title.
 *                       handle:
 *                         type: string
 *                         title: handle
 *                         description: The $or's handle.
 *                       is_giftcard:
 *                         type: boolean
 *                         title: is_giftcard
 *                         description: The $or's is giftcard.
 *                       price_list_id:
 *                         type: array
 *                         description: The $or's price list id.
 *                         items:
 *                           type: string
 *                           title: price_list_id
 *                           description: The price list id's details.
 *                       sales_channel_id:
 *                         type: array
 *                         description: The $or's sales channel id.
 *                         items:
 *                           type: string
 *                           title: sales_channel_id
 *                           description: The sales channel id's details.
 *                       collection_id:
 *                         type: array
 *                         description: The $or's collection id.
 *                         items:
 *                           type: string
 *                           title: collection_id
 *                           description: The collection id's details.
 *                       tags:
 *                         type: array
 *                         description: The $or's tags.
 *                         items:
 *                           type: string
 *                           title: tags
 *                           description: The tag's tags.
 *                       type_id:
 *                         type: array
 *                         description: The $or's type id.
 *                         items:
 *                           type: string
 *                           title: type_id
 *                           description: The type id's details.
 *                       variants:
 *                         type: object
 *                         description: The $or's variants.
 *                         properties: {}
 *                       created_at:
 *                         type: object
 *                         description: The $or's created at.
 *                         properties: {}
 *                       updated_at:
 *                         type: object
 *                         description: The $or's updated at.
 *                         properties: {}
 *                       deleted_at:
 *                         type: object
 *                         description: The $or's deleted at.
 *                         properties: {}
 *                       $and:
 *                         type: array
 *                         description: The $or's $and.
 *                         items:
 *                           type: object
 *                           description: The $and's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $or's details.
 *                         items:
 *                           type: object
 *                           description: The $or's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       expand:
 *                         type: string
 *                         title: expand
 *                         description: The $or's expand.
 *                       fields:
 *                         type: string
 *                         title: fields
 *                         description: The $or's fields.
 *                       offset:
 *                         type: number
 *                         title: offset
 *                         description: The $or's offset.
 *                       limit:
 *                         type: number
 *                         title: limit
 *                         description: The $or's limit.
 *                       order:
 *                         type: string
 *                         title: order
 *                         description: The $or's order.
 *                 expand:
 *                   type: string
 *                   title: expand
 *                   description: The $and's expand.
 *                 fields:
 *                   type: string
 *                   title: fields
 *                   description: The $and's fields.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The $and's offset.
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The $and's limit.
 *                 order:
 *                   type: string
 *                   title: order
 *                   description: The $and's order.
 *           $or:
 *             type: array
 *             description: The product's $or.
 *             items:
 *               type: object
 *               description: The $or's details.
 *               x-schemaName: AdminGetProductsParams
 *               properties:
 *                 q:
 *                   type: string
 *                   title: q
 *                   description: The $or's q.
 *                 id:
 *                   oneOf:
 *                     - type: string
 *                       title: id
 *                       description: The $or's ID.
 *                     - type: array
 *                       description: The $or's ID.
 *                       items:
 *                         type: string
 *                         title: id
 *                         description: The id's ID.
 *                 status:
 *                   type: array
 *                   description: The $or's status.
 *                   items:
 *                     type: string
 *                     enum:
 *                       - draft
 *                       - proposed
 *                       - published
 *                       - rejected
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The $or's title.
 *                 handle:
 *                   type: string
 *                   title: handle
 *                   description: The $or's handle.
 *                 is_giftcard:
 *                   type: boolean
 *                   title: is_giftcard
 *                   description: The $or's is giftcard.
 *                 price_list_id:
 *                   type: array
 *                   description: The $or's price list id.
 *                   items:
 *                     type: string
 *                     title: price_list_id
 *                     description: The price list id's details.
 *                 sales_channel_id:
 *                   type: array
 *                   description: The $or's sales channel id.
 *                   items:
 *                     type: string
 *                     title: sales_channel_id
 *                     description: The sales channel id's details.
 *                 collection_id:
 *                   type: array
 *                   description: The $or's collection id.
 *                   items:
 *                     type: string
 *                     title: collection_id
 *                     description: The collection id's details.
 *                 tags:
 *                   type: array
 *                   description: The $or's tags.
 *                   items:
 *                     type: string
 *                     title: tags
 *                     description: The tag's tags.
 *                 type_id:
 *                   type: array
 *                   description: The $or's type id.
 *                   items:
 *                     type: string
 *                     title: type_id
 *                     description: The type id's details.
 *                 variants:
 *                   type: object
 *                   description: The $or's variants.
 *                   properties: {}
 *                 created_at:
 *                   type: object
 *                   description: The $or's created at.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: The created at's $and.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $and's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $and's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $and
 *                                   description: The $and's details.
 *                                 - type: object
 *                                   description: The $and's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $or:
 *                       type: array
 *                       description: The created at's $or.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $or's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $or's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $or
 *                                   description: The $or's details.
 *                                 - type: object
 *                                   description: The $or's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The created at's $eq.
 *                         - type: object
 *                           description: The created at's $eq.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: array
 *                           description: The created at's $eq.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: The $eq's details.
 *                               - type: object
 *                                 description: The $eq's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $ne:
 *                       oneOf:
 *                         - type: string
 *                           title: $ne
 *                           description: The created at's $ne.
 *                         - type: object
 *                           description: The created at's $ne.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $in:
 *                       type: array
 *                       description: The created at's $in.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $in
 *                             description: The $in's details.
 *                           - type: object
 *                             description: The $in's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $nin:
 *                       type: array
 *                       description: The created at's $nin.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $nin
 *                             description: The $nin's details.
 *                           - type: object
 *                             description: The $nin's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The created at's $not.
 *                         - type: object
 *                           description: The created at's $not.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: object
 *                           description: The created at's $not.
 *                           properties: {}
 *                         - type: array
 *                           description: The created at's $not.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: The $not's details.
 *                               - type: object
 *                                 description: The $not's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $gt:
 *                       oneOf:
 *                         - type: string
 *                           title: $gt
 *                           description: The created at's $gt.
 *                         - type: object
 *                           description: The created at's $gt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $gte:
 *                       oneOf:
 *                         - type: string
 *                           title: $gte
 *                           description: The created at's $gte.
 *                         - type: object
 *                           description: The created at's $gte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lt:
 *                       oneOf:
 *                         - type: string
 *                           title: $lt
 *                           description: The created at's $lt.
 *                         - type: object
 *                           description: The created at's $lt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lte:
 *                       oneOf:
 *                         - type: string
 *                           title: $lte
 *                           description: The created at's $lte.
 *                         - type: object
 *                           description: The created at's $lte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: The created at's $like.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: The created at's $re.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: The created at's $ilike.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: The created at's $fulltext.
 *                     $overlap:
 *                       type: array
 *                       description: The created at's $overlap.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: The $overlap's details.
 *                     $contains:
 *                       type: array
 *                       description: The created at's $contains.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: The $contain's $contains.
 *                     $contained:
 *                       type: array
 *                       description: The created at's $contained.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: The $contained's details.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: The created at's $exists.
 *                 updated_at:
 *                   type: object
 *                   description: The $or's updated at.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: The updated at's $and.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $and's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $and's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $and
 *                                   description: The $and's details.
 *                                 - type: object
 *                                   description: The $and's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $or:
 *                       type: array
 *                       description: The updated at's $or.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $or's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $or's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $or
 *                                   description: The $or's details.
 *                                 - type: object
 *                                   description: The $or's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The updated at's $eq.
 *                         - type: object
 *                           description: The updated at's $eq.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: array
 *                           description: The updated at's $eq.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: The $eq's details.
 *                               - type: object
 *                                 description: The $eq's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $ne:
 *                       oneOf:
 *                         - type: string
 *                           title: $ne
 *                           description: The updated at's $ne.
 *                         - type: object
 *                           description: The updated at's $ne.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $in:
 *                       type: array
 *                       description: The updated at's $in.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $in
 *                             description: The $in's details.
 *                           - type: object
 *                             description: The $in's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $nin:
 *                       type: array
 *                       description: The updated at's $nin.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $nin
 *                             description: The $nin's details.
 *                           - type: object
 *                             description: The $nin's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The updated at's $not.
 *                         - type: object
 *                           description: The updated at's $not.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: object
 *                           description: The updated at's $not.
 *                           properties: {}
 *                         - type: array
 *                           description: The updated at's $not.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: The $not's details.
 *                               - type: object
 *                                 description: The $not's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $gt:
 *                       oneOf:
 *                         - type: string
 *                           title: $gt
 *                           description: The updated at's $gt.
 *                         - type: object
 *                           description: The updated at's $gt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $gte:
 *                       oneOf:
 *                         - type: string
 *                           title: $gte
 *                           description: The updated at's $gte.
 *                         - type: object
 *                           description: The updated at's $gte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lt:
 *                       oneOf:
 *                         - type: string
 *                           title: $lt
 *                           description: The updated at's $lt.
 *                         - type: object
 *                           description: The updated at's $lt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lte:
 *                       oneOf:
 *                         - type: string
 *                           title: $lte
 *                           description: The updated at's $lte.
 *                         - type: object
 *                           description: The updated at's $lte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: The updated at's $like.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: The updated at's $re.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: The updated at's $ilike.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: The updated at's $fulltext.
 *                     $overlap:
 *                       type: array
 *                       description: The updated at's $overlap.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: The $overlap's details.
 *                     $contains:
 *                       type: array
 *                       description: The updated at's $contains.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: The $contain's $contains.
 *                     $contained:
 *                       type: array
 *                       description: The updated at's $contained.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: The $contained's details.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: The updated at's $exists.
 *                 deleted_at:
 *                   type: object
 *                   description: The $or's deleted at.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: The deleted at's $and.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $and
 *                             description: The $and's details.
 *                           - type: object
 *                             description: The $and's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $and's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $and's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $and
 *                                   description: The $and's details.
 *                                 - type: object
 *                                   description: The $and's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $or:
 *                       type: array
 *                       description: The deleted at's $or.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $or
 *                             description: The $or's details.
 *                           - type: object
 *                             description: The $or's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                           - type: object
 *                             description: The $or's details.
 *                             properties: {}
 *                           - type: array
 *                             description: The $or's details.
 *                             items:
 *                               oneOf:
 *                                 - type: string
 *                                   title: $or
 *                                   description: The $or's details.
 *                                 - type: object
 *                                   description: The $or's details.
 *                                   x-schemaName: RegExp
 *                                   properties: {}
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: The deleted at's $eq.
 *                         - type: object
 *                           description: The deleted at's $eq.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: array
 *                           description: The deleted at's $eq.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: The $eq's details.
 *                               - type: object
 *                                 description: The $eq's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $ne:
 *                       oneOf:
 *                         - type: string
 *                           title: $ne
 *                           description: The deleted at's $ne.
 *                         - type: object
 *                           description: The deleted at's $ne.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $in:
 *                       type: array
 *                       description: The deleted at's $in.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $in
 *                             description: The $in's details.
 *                           - type: object
 *                             description: The $in's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $nin:
 *                       type: array
 *                       description: The deleted at's $nin.
 *                       items:
 *                         oneOf:
 *                           - type: string
 *                             title: $nin
 *                             description: The $nin's details.
 *                           - type: object
 *                             description: The $nin's details.
 *                             x-schemaName: RegExp
 *                             properties: {}
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: The deleted at's $not.
 *                         - type: object
 *                           description: The deleted at's $not.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                         - type: object
 *                           description: The deleted at's $not.
 *                           properties: {}
 *                         - type: array
 *                           description: The deleted at's $not.
 *                           items:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: The $not's details.
 *                               - type: object
 *                                 description: The $not's details.
 *                                 x-schemaName: RegExp
 *                                 properties: {}
 *                     $gt:
 *                       oneOf:
 *                         - type: string
 *                           title: $gt
 *                           description: The deleted at's $gt.
 *                         - type: object
 *                           description: The deleted at's $gt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $gte:
 *                       oneOf:
 *                         - type: string
 *                           title: $gte
 *                           description: The deleted at's $gte.
 *                         - type: object
 *                           description: The deleted at's $gte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lt:
 *                       oneOf:
 *                         - type: string
 *                           title: $lt
 *                           description: The deleted at's $lt.
 *                         - type: object
 *                           description: The deleted at's $lt.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $lte:
 *                       oneOf:
 *                         - type: string
 *                           title: $lte
 *                           description: The deleted at's $lte.
 *                         - type: object
 *                           description: The deleted at's $lte.
 *                           x-schemaName: RegExp
 *                           properties: {}
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: The deleted at's $like.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: The deleted at's $re.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: The deleted at's $ilike.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: The deleted at's $fulltext.
 *                     $overlap:
 *                       type: array
 *                       description: The deleted at's $overlap.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: The $overlap's details.
 *                     $contains:
 *                       type: array
 *                       description: The deleted at's $contains.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: The $contain's $contains.
 *                     $contained:
 *                       type: array
 *                       description: The deleted at's $contained.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: The $contained's details.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: The deleted at's $exists.
 *                 $and:
 *                   type: array
 *                   description: The $or's $and.
 *                   items:
 *                     type: object
 *                     description: The $and's details.
 *                     x-schemaName: AdminGetProductsParams
 *                     properties:
 *                       q:
 *                         type: string
 *                         title: q
 *                         description: The $and's q.
 *                       id:
 *                         oneOf:
 *                           - type: string
 *                             title: id
 *                             description: The $and's ID.
 *                           - type: array
 *                             description: The $and's ID.
 *                             items:
 *                               type: string
 *                               title: id
 *                               description: The id's ID.
 *                       status:
 *                         type: array
 *                         description: The $and's status.
 *                         items:
 *                           type: string
 *                           enum:
 *                             - draft
 *                             - proposed
 *                             - published
 *                             - rejected
 *                       title:
 *                         type: string
 *                         title: title
 *                         description: The $and's title.
 *                       handle:
 *                         type: string
 *                         title: handle
 *                         description: The $and's handle.
 *                       is_giftcard:
 *                         type: boolean
 *                         title: is_giftcard
 *                         description: The $and's is giftcard.
 *                       price_list_id:
 *                         type: array
 *                         description: The $and's price list id.
 *                         items:
 *                           type: string
 *                           title: price_list_id
 *                           description: The price list id's details.
 *                       sales_channel_id:
 *                         type: array
 *                         description: The $and's sales channel id.
 *                         items:
 *                           type: string
 *                           title: sales_channel_id
 *                           description: The sales channel id's details.
 *                       collection_id:
 *                         type: array
 *                         description: The $and's collection id.
 *                         items:
 *                           type: string
 *                           title: collection_id
 *                           description: The collection id's details.
 *                       tags:
 *                         type: array
 *                         description: The $and's tags.
 *                         items:
 *                           type: string
 *                           title: tags
 *                           description: The tag's tags.
 *                       type_id:
 *                         type: array
 *                         description: The $and's type id.
 *                         items:
 *                           type: string
 *                           title: type_id
 *                           description: The type id's details.
 *                       variants:
 *                         type: object
 *                         description: The $and's variants.
 *                         properties: {}
 *                       created_at:
 *                         type: object
 *                         description: The $and's created at.
 *                         properties: {}
 *                       updated_at:
 *                         type: object
 *                         description: The $and's updated at.
 *                         properties: {}
 *                       deleted_at:
 *                         type: object
 *                         description: The $and's deleted at.
 *                         properties: {}
 *                       $and:
 *                         type: array
 *                         description: The $and's details.
 *                         items:
 *                           type: object
 *                           description: The $and's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $and's $or.
 *                         items:
 *                           type: object
 *                           description: The $or's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       expand:
 *                         type: string
 *                         title: expand
 *                         description: The $and's expand.
 *                       fields:
 *                         type: string
 *                         title: fields
 *                         description: The $and's fields.
 *                       offset:
 *                         type: number
 *                         title: offset
 *                         description: The $and's offset.
 *                       limit:
 *                         type: number
 *                         title: limit
 *                         description: The $and's limit.
 *                       order:
 *                         type: string
 *                         title: order
 *                         description: The $and's order.
 *                 $or:
 *                   type: array
 *                   description: The $or's details.
 *                   items:
 *                     type: object
 *                     description: The $or's details.
 *                     x-schemaName: AdminGetProductsParams
 *                     properties:
 *                       q:
 *                         type: string
 *                         title: q
 *                         description: The $or's q.
 *                       id:
 *                         oneOf:
 *                           - type: string
 *                             title: id
 *                             description: The $or's ID.
 *                           - type: array
 *                             description: The $or's ID.
 *                             items:
 *                               type: string
 *                               title: id
 *                               description: The id's ID.
 *                       status:
 *                         type: array
 *                         description: The $or's status.
 *                         items:
 *                           type: string
 *                           enum:
 *                             - draft
 *                             - proposed
 *                             - published
 *                             - rejected
 *                       title:
 *                         type: string
 *                         title: title
 *                         description: The $or's title.
 *                       handle:
 *                         type: string
 *                         title: handle
 *                         description: The $or's handle.
 *                       is_giftcard:
 *                         type: boolean
 *                         title: is_giftcard
 *                         description: The $or's is giftcard.
 *                       price_list_id:
 *                         type: array
 *                         description: The $or's price list id.
 *                         items:
 *                           type: string
 *                           title: price_list_id
 *                           description: The price list id's details.
 *                       sales_channel_id:
 *                         type: array
 *                         description: The $or's sales channel id.
 *                         items:
 *                           type: string
 *                           title: sales_channel_id
 *                           description: The sales channel id's details.
 *                       collection_id:
 *                         type: array
 *                         description: The $or's collection id.
 *                         items:
 *                           type: string
 *                           title: collection_id
 *                           description: The collection id's details.
 *                       tags:
 *                         type: array
 *                         description: The $or's tags.
 *                         items:
 *                           type: string
 *                           title: tags
 *                           description: The tag's tags.
 *                       type_id:
 *                         type: array
 *                         description: The $or's type id.
 *                         items:
 *                           type: string
 *                           title: type_id
 *                           description: The type id's details.
 *                       variants:
 *                         type: object
 *                         description: The $or's variants.
 *                         properties: {}
 *                       created_at:
 *                         type: object
 *                         description: The $or's created at.
 *                         properties: {}
 *                       updated_at:
 *                         type: object
 *                         description: The $or's updated at.
 *                         properties: {}
 *                       deleted_at:
 *                         type: object
 *                         description: The $or's deleted at.
 *                         properties: {}
 *                       $and:
 *                         type: array
 *                         description: The $or's $and.
 *                         items:
 *                           type: object
 *                           description: The $and's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       $or:
 *                         type: array
 *                         description: The $or's details.
 *                         items:
 *                           type: object
 *                           description: The $or's details.
 *                           x-schemaName: AdminGetProductsParams
 *                           properties: {}
 *                       expand:
 *                         type: string
 *                         title: expand
 *                         description: The $or's expand.
 *                       fields:
 *                         type: string
 *                         title: fields
 *                         description: The $or's fields.
 *                       offset:
 *                         type: number
 *                         title: offset
 *                         description: The $or's offset.
 *                       limit:
 *                         type: number
 *                         title: limit
 *                         description: The $or's limit.
 *                       order:
 *                         type: string
 *                         title: order
 *                         description: The $or's order.
 *                 expand:
 *                   type: string
 *                   title: expand
 *                   description: The $or's expand.
 *                 fields:
 *                   type: string
 *                   title: fields
 *                   description: The $or's fields.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The $or's offset.
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The $or's limit.
 *                 order:
 *                   type: string
 *                   title: order
 *                   description: The $or's order.
 *           expand:
 *             type: string
 *             title: expand
 *             description: The product's expand.
 *           fields:
 *             type: string
 *             title: fields
 *             description: The product's fields.
 *           offset:
 *             type: number
 *             title: offset
 *             description: The product's offset.
 *           limit:
 *             type: number
 *             title: limit
 *             description: The product's limit.
 *           order:
 *             type: string
 *             title: order
 *             description: The product's order.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/products' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Products
 * responses:
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * 
*/

