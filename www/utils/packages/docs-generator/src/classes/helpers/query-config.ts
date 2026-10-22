import chalk from "chalk"
import { globSync } from "glob"
import { dirname, resolve } from "path"
import ts from "typescript"
import { API_ROUTE_PARAM_REGEX } from "../../constants.js"
import loadTsModule from "../../utils/load-ts-module.js"

const VALIDATE_QUERY_FN_NAME = "validateAndTransformQuery"
const PARAM_PLACEHOLDER = "1"

/**
 * The fields and relations restrictions of an API route's query configuration.
 */
export type FieldRestrictions = {
  /**
   * The fields and relations that can be requested. If it's not set, all
   * fields and relations can be requested.
   */
  allowed?: string[]
  /**
   * The fields and relations that can never be requested.
   */
  disallowed?: string[]
}

/**
 * A route's query configuration, as referenced in a middleware.
 */
type QueryConfigReference = {
  /**
   * The path of the file exporting the query configuration, without its extension.
   */
  modulePath: string
  /**
   * The name of the exported query configuration.
   */
  exportName: string
}

type MiddlewareRoute = {
  matcher: string
  methods: string[]
  queryConfig: QueryConfigReference
}

/**
 * Helper used to retrieve the query configuration that an API route's middleware
 * applies to it. Since the configuration isn't available in the route's file, its
 * middlewares are parsed to find it.
 */
export default class QueryConfigHelper {
  private middlewareRoutes: Map<string, MiddlewareRoute[]> = new Map()

  /**
   * Retrieve the fields and relations restrictions applied to an API route.
   *
   * @param param0 - The route's details.
   * @returns The route's restrictions, if it has any.
   */
  getFieldRestrictions({
    routeFilePath,
    oasPath,
    httpMethod,
  }: {
    /**
     * The path of the route's file.
     */
    routeFilePath: string
    /**
     * The route's OAS path, such as `store/products/[id]`.
     */
    oasPath: string
    /**
     * The route's lowercase HTTP method, such as `get`.
     */
    httpMethod: string
  }): FieldRestrictions | undefined {
    const apiPath = this.getApiPath(routeFilePath)

    if (!apiPath) {
      return
    }

    const middlewareRoute = this.findMiddlewareRoute({
      middlewareRoutes: this.getMiddlewareRoutes(apiPath),
      oasPath,
      httpMethod,
    })

    if (!middlewareRoute) {
      return
    }

    const queryConfig = this.loadQueryConfig(middlewareRoute.queryConfig)

    if (!queryConfig) {
      return
    }

    const allowed = this.normalizeFields(queryConfig.allowed)
    const disallowed = this.normalizeFields(queryConfig.disallowed)

    if (!allowed?.length && !disallowed?.length) {
      return
    }

    return {
      ...(allowed?.length ? { allowed } : {}),
      ...(disallowed?.length ? { disallowed } : {}),
    }
  }

  /**
   * Retrieve the path of the `api` directory that a route belongs to.
   *
   * @param routeFilePath - The path of the route's file.
   * @returns The path of the `api` directory, if found.
   */
  private getApiPath(routeFilePath: string): string | undefined {
    const apiIndex = routeFilePath.indexOf("/api/")

    return apiIndex === -1
      ? undefined
      : routeFilePath.substring(0, apiIndex + "/api".length)
  }

  /**
   * Retrieve the routes that the middlewares of an `api` directory are applied to.
   * The routes are cached since they're the same for every route of the directory.
   *
   * @param apiPath - The path of the `api` directory.
   * @returns The middlewares' routes.
   */
  private getMiddlewareRoutes(apiPath: string): MiddlewareRoute[] {
    const cachedRoutes = this.middlewareRoutes.get(apiPath)

    if (cachedRoutes) {
      return cachedRoutes
    }

    const routes = globSync("**/middlewares.ts", {
      cwd: apiPath,
      absolute: true,
    }).flatMap((filePath) => this.parseMiddlewareFile(filePath))

    this.middlewareRoutes.set(apiPath, routes)

    return routes
  }

  /**
   * Parse a middlewares file to retrieve the routes that apply a query configuration.
   *
   * @param filePath - The path of the middlewares file.
   * @returns The file's middleware routes.
   */
  private parseMiddlewareFile(filePath: string): MiddlewareRoute[] {
    const sourceFile = ts.createSourceFile(
      filePath,
      ts.sys.readFile(filePath) || "",
      ts.ScriptTarget.ES2021,
      true
    )
    const routes: MiddlewareRoute[] = []

    const findRoutes = (node: ts.Node) => {
      if (ts.isObjectLiteralExpression(node)) {
        const route = this.parseMiddlewareRoute(node, sourceFile)

        if (route) {
          routes.push(route)
        }
      }

      ts.forEachChild(node, findRoutes)
    }

    findRoutes(sourceFile)

    return routes
  }

  /**
   * Parse an object literal into a middleware route.
   *
   * @param node - The object literal to parse.
   * @param sourceFile - The source file that the object literal belongs to.
   * @returns The middleware route, if the object literal is one that applies a
   * query configuration.
   */
  private parseMiddlewareRoute(
    node: ts.ObjectLiteralExpression,
    sourceFile: ts.SourceFile
  ): MiddlewareRoute | undefined {
    const matcherProperty = this.getProperty(node, "matcher")
    const middlewaresProperty = this.getProperty(node, "middlewares")

    if (
      !matcherProperty ||
      !middlewaresProperty ||
      !ts.isStringLiteralLike(matcherProperty.initializer) ||
      !ts.isArrayLiteralExpression(middlewaresProperty.initializer)
    ) {
      return
    }

    const validateQueryCall = middlewaresProperty.initializer.elements.find(
      (element) =>
        ts.isCallExpression(element) &&
        element.expression.getText() === VALIDATE_QUERY_FN_NAME
    ) as ts.CallExpression | undefined
    const queryConfigArgument = validateQueryCall?.arguments[1]

    if (!queryConfigArgument) {
      return
    }

    const queryConfig = this.getQueryConfigReference(
      queryConfigArgument,
      sourceFile
    )

    if (!queryConfig) {
      return
    }

    return {
      matcher: matcherProperty.initializer.text,
      methods: this.getMethods(node),
      queryConfig,
    }
  }

  /**
   * Retrieve the file and export name of the query configuration passed to a
   * middleware.
   *
   * @param node - The expression passed as the query configuration.
   * @param sourceFile - The source file that the expression belongs to.
   * @returns The query configuration's reference, if it can be resolved.
   */
  private getQueryConfigReference(
    node: ts.Expression,
    sourceFile: ts.SourceFile
  ): QueryConfigReference | undefined {
    // the configuration is either accessed through a namespace import, such as
    // `QueryConfig.listProductQueryConfig`, or imported directly.
    const localName = ts.isPropertyAccessExpression(node)
      ? node.expression.getText()
      : ts.isIdentifier(node)
        ? node.getText()
        : undefined
    const exportName = ts.isPropertyAccessExpression(node)
      ? node.name.getText()
      : localName

    if (!localName || !exportName) {
      return
    }

    const importPath = this.getImportPath(localName, sourceFile)

    return {
      modulePath: importPath
        ? resolve(dirname(sourceFile.fileName), importPath)
        : sourceFile.fileName,
      exportName,
    }
  }

  /**
   * Retrieve the relative path that a name is imported from in a file.
   *
   * @param localName - The name as it's used in the file.
   * @param sourceFile - The file to retrieve the import path from.
   * @returns The import's relative path, if the name is imported.
   */
  private getImportPath(
    localName: string,
    sourceFile: ts.SourceFile
  ): string | undefined {
    let importPath: string | undefined

    sourceFile.statements.forEach((statement) => {
      if (
        importPath ||
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteralLike(statement.moduleSpecifier) ||
        !statement.importClause?.namedBindings
      ) {
        return
      }

      const { namedBindings } = statement.importClause
      const isImported = ts.isNamespaceImport(namedBindings)
        ? namedBindings.name.getText() === localName
        : namedBindings.elements.some(
            (element) => element.name.getText() === localName
          )

      if (isImported) {
        importPath = statement.moduleSpecifier.text
      }
    })

    return importPath
  }

  /**
   * Retrieve the HTTP methods that a middleware route is applied to.
   *
   * @param node - The middleware route's object literal.
   * @returns The uppercase HTTP methods.
   */
  private getMethods(node: ts.ObjectLiteralExpression): string[] {
    const methodProperty = this.getProperty(node, "method")

    if (!methodProperty) {
      return []
    }

    const { initializer } = methodProperty

    if (ts.isStringLiteralLike(initializer)) {
      return [initializer.text]
    }

    if (!ts.isArrayLiteralExpression(initializer)) {
      return []
    }

    return initializer.elements
      .filter((element) => ts.isStringLiteralLike(element))
      .map((element) => (element as ts.StringLiteral).text)
  }

  private getProperty(
    node: ts.ObjectLiteralExpression,
    name: string
  ): ts.PropertyAssignment | undefined {
    return node.properties.find(
      (property): property is ts.PropertyAssignment =>
        ts.isPropertyAssignment(property) && property.name.getText() === name
    )
  }

  /**
   * Find the middleware route that applies a query configuration to an API route.
   * Since more than one middleware route can match, such as a wildcard matcher and
   * an exact one, the most specific match is used.
   *
   * @param param0 - The API route's details.
   * @returns The matching middleware route, if any.
   */
  private findMiddlewareRoute({
    middlewareRoutes,
    oasPath,
    httpMethod,
  }: {
    middlewareRoutes: MiddlewareRoute[]
    oasPath: string
    httpMethod: string
  }): MiddlewareRoute | undefined {
    const routePath = `/${oasPath.replaceAll(
      API_ROUTE_PARAM_REGEX,
      PARAM_PLACEHOLDER
    )}`
    const method = httpMethod.toUpperCase()

    return middlewareRoutes
      .filter((middlewareRoute) => {
        const matchesMethod = middlewareRoute.methods.some(
          (middlewareMethod) =>
            middlewareMethod === "ALL" || middlewareMethod === method
        )

        return (
          matchesMethod &&
          this.matcherToRegex(middlewareRoute.matcher).test(routePath)
        )
      })
      .sort(
        (matchA, matchB) =>
          this.getMatcherSpecificity(matchB.matcher) -
          this.getMatcherSpecificity(matchA.matcher)
      )
      .at(0)
  }

  /**
   * Convert a middleware's matcher into a regular expression that can be tested
   * against a route's path. Path parameters are matched by name-insensitive
   * patterns since a matcher's parameter name can be different than the route
   * directory's, and `*` is matched as a wildcard.
   *
   * @param matcher - The matcher to convert.
   * @returns The matcher's regular expression.
   */
  private matcherToRegex(matcher: string): RegExp {
    const pattern = matcher
      .split("/")
      .map((segment) => {
        return segment.startsWith(":")
          ? PARAM_PLACEHOLDER
          : segment
              .replaceAll(/[.+?^${}()|[\]\\]/g, "\\$&")
              .replaceAll("*", ".*")
      })
      .join("/")

    return new RegExp(`^${pattern}$`)
  }

  /**
   * Retrieve how specific a matcher is, which is used to choose between matchers
   * that are applied to the same route. A matcher without wildcards is more
   * specific than one with them, and a longer matcher is more specific than a
   * shorter one.
   *
   * @param matcher - The matcher to check.
   * @returns The matcher's specificity.
   */
  private getMatcherSpecificity(matcher: string): number {
    return matcher.includes("*") ? matcher.length : matcher.length + 1000
  }

  /**
   * Load the query configuration that a middleware applies.
   *
   * @param param0 - The query configuration's reference.
   * @returns The query configuration, if it can be loaded.
   */
  private loadQueryConfig({
    modulePath,
    exportName,
  }: QueryConfigReference):
    | { allowed?: unknown; disallowed?: unknown }
    | undefined {
    try {
      const queryConfig = loadTsModule(modulePath.replace(/\.tsx?$/, ""))[
        exportName
      ]

      return typeof queryConfig === "object" && queryConfig !== null
        ? (queryConfig as { allowed?: unknown; disallowed?: unknown })
        : undefined
    } catch (e) {
      console.warn(
        chalk.yellow(
          `[WARNING] Couldn't load the query configuration ${exportName} of ${modulePath}: ${
            e instanceof Error ? e.message : e
          }`
        )
      )
      return
    }
  }

  /**
   * Normalize the fields of a query configuration into strings that can be added
   * to an OAS. Regular expressions are kept as patterns since they express a
   * family of fields, such as `/_link$/`.
   *
   * @param fields - The fields to normalize.
   * @returns The normalized fields without duplicates.
   */
  private normalizeFields(fields: unknown): string[] | undefined {
    if (!Array.isArray(fields)) {
      return
    }

    const normalizedFields = fields
      .map((field) => {
        if (typeof field === "string") {
          return field
        }

        // the fields are evaluated in a separate context, so a regular expression
        // there isn't an instance of this context's `RegExp`.
        return Object.prototype.toString.call(field) === "[object RegExp]"
          ? String(field)
          : undefined
      })
      .filter((field): field is string => field !== undefined)

    return Array.from(new Set(normalizedFields))
  }
}
