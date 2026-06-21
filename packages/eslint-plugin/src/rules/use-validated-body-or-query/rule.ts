import * as fs from "fs"
import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { parse } from "@typescript-eslint/typescript-estree"
import { createRule } from "../../create-rule"
import { FRAMEWORK_HTTP_SOURCE } from "../../constants"
import { findApiRoot, getApiRouteSegments } from "../../util/api-route"

type MessageIds = "useValidatedBody" | "useValidatedQuery"

const HTTP_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
])

const VALIDATE_BODY = "validateAndTransformBody"
const VALIDATE_QUERY = "validateAndTransformQuery"
const DEFINE_MIDDLEWARES = "defineMiddlewares"

const MIDDLEWARE_BASENAMES = ["middlewares.ts", "middlewares.js"]

type ValidationMap = {
  body: Set<string> // uppercase HTTP methods covered by body validation; "*" means all
  query: Set<string> // same for query validation
}

function getApiRoutePath(filename: string): string | null {
  const segments = getApiRouteSegments(filename)
  if (!segments) {
    return null
  }
  return "/" + segments.join("/")
}

function findMiddlewaresFile(filename: string): string | null {
  const apiRoot = findApiRoot(filename)
  if (!apiRoot) {
    return null
  }
  for (const base of MIDDLEWARE_BASENAMES) {
    const candidate = `${apiRoot}/${base}`
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }
  return null
}

function matcherToRegex(matcher: string): RegExp {
  // Convert Medusa matcher syntax to a regex.
  // - `:param` segments → `[^/]+`
  // - `*` → `.*`
  // - escape other regex chars
  let out = ""
  let i = 0
  while (i < matcher.length) {
    const c = matcher[i]
    if (c === ":") {
      // skip param name
      i++
      while (i < matcher.length && /[A-Za-z0-9_]/.test(matcher[i])) {
        i++
      }
      out += "[^/]+"
      continue
    }
    if (c === "*") {
      out += ".*"
      i++
      continue
    }
    if (/[.+?^${}()|[\]\\]/.test(c)) {
      out += "\\" + c
    } else {
      out += c
    }
    i++
  }
  return new RegExp(`^${out}/?$`)
}

function routePathToMatchable(routePath: string): string {
  // Convert `[id]` → `:id` so we can run the same regex.
  return routePath.replace(/\[([A-Za-z_][A-Za-z0-9_]*)\]/g, ":$1")
}

function collectValidationFromMiddlewaresFile(
  filePath: string,
  routePath: string
): ValidationMap | null {
  let source: string
  try {
    source = fs.readFileSync(filePath, "utf8")
  } catch {
    return null
  }
  let ast: ReturnType<typeof parse>
  try {
    ast = parse(source, {
      jsx: filePath.endsWith("x"),
      loc: false,
      range: false,
    })
  } catch {
    return null
  }

  // Track local names for validateAndTransformBody/Query and defineMiddlewares
  const bodyValidatorNames = new Set<string>()
  const queryValidatorNames = new Set<string>()
  const defineMiddlewaresNames = new Set<string>()

  for (const node of ast.body) {
    if (node.type !== "ImportDeclaration") {
      continue
    }
    if (
      typeof node.source.value !== "string" ||
      node.source.value !== FRAMEWORK_HTTP_SOURCE
    ) {
      continue
    }
    for (const spec of node.specifiers) {
      if (
        spec.type !== "ImportSpecifier" ||
        spec.imported.type !== "Identifier"
      ) {
        continue
      }
      if (spec.imported.name === VALIDATE_BODY) {
        bodyValidatorNames.add(spec.local.name)
      } else if (spec.imported.name === VALIDATE_QUERY) {
        queryValidatorNames.add(spec.local.name)
      } else if (spec.imported.name === DEFINE_MIDDLEWARES) {
        defineMiddlewaresNames.add(spec.local.name)
      }
    }
  }

  const result: ValidationMap = { body: new Set(), query: new Set() }
  const matchable = routePathToMatchable(routePath)

  const extractMethods = (node: any): string[] => {
    if (!node) {
      return []
    }
    if (node.type === "Literal" && typeof node.value === "string") {
      return [node.value.toUpperCase()]
    }
    if (node.type === "ArrayExpression") {
      const out: string[] = []
      for (const el of node.elements) {
        if (el && el.type === "Literal" && typeof el.value === "string") {
          out.push(el.value.toUpperCase())
        }
      }
      return out
    }
    return []
  }

  const handleRouteEntry = (entry: any): void => {
    if (!entry || entry.type !== "ObjectExpression") {
      return
    }
    let matcher: string | null = null
    let methods: string[] = []
    let middlewares: any[] = []
    for (const prop of entry.properties) {
      if (
        prop.type !== "Property" ||
        prop.computed ||
        (prop.key.type !== "Identifier" && prop.key.type !== "Literal")
      ) {
        continue
      }
      const keyName =
        prop.key.type === "Identifier" ? prop.key.name : String(prop.key.value)
      if (keyName === "matcher") {
        if (
          prop.value.type === "Literal" &&
          typeof prop.value.value === "string"
        ) {
          matcher = prop.value.value
        }
      } else if (keyName === "method" || keyName === "methods") {
        methods = extractMethods(prop.value)
      } else if (keyName === "middlewares") {
        if (prop.value.type === "ArrayExpression") {
          middlewares = prop.value.elements
        }
      }
    }
    if (!matcher) {
      return
    }

    let regex: RegExp
    try {
      regex = matcherToRegex(matcher)
    } catch {
      return
    }
    if (!regex.test(matchable)) {
      return
    }

    const targets = methods.length ? methods : ["*"]
    let hasBody = false
    let hasQuery = false
    for (const mw of middlewares) {
      if (!mw || mw.type !== "CallExpression") {
        continue
      }
      if (mw.callee.type !== "Identifier") {
        continue
      }
      if (bodyValidatorNames.has(mw.callee.name)) {
        hasBody = true
      }
      if (queryValidatorNames.has(mw.callee.name)) {
        hasQuery = true
      }
    }
    if (hasBody) {
      for (const m of targets) {
        result.body.add(m)
      }
    }
    if (hasQuery) {
      for (const m of targets) {
        result.query.add(m)
      }
    }
  }

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") {
      return
    }
    if (Array.isArray(node)) {
      for (const child of node) {
        walk(child)
      }
      return
    }
    const n = node as { type?: string; [k: string]: unknown }
    if (
      n.type === "CallExpression" &&
      (n as any).callee?.type === "Identifier" &&
      defineMiddlewaresNames.has((n as any).callee.name)
    ) {
      const arg = (n as any).arguments?.[0]
      if (arg?.type === "ObjectExpression") {
        for (const prop of arg.properties) {
          if (
            prop.type !== "Property" ||
            prop.computed ||
            !(
              (prop.key.type === "Identifier" && prop.key.name === "routes") ||
              (prop.key.type === "Literal" && prop.key.value === "routes")
            )
          ) {
            continue
          }
          if (prop.value.type === "ArrayExpression") {
            for (const el of prop.value.elements) {
              handleRouteEntry(el)
            }
          }
        }
      }
    }
    for (const key of Object.keys(n)) {
      if (key === "parent" || key === "loc" || key === "range") {
        continue
      }
      walk(n[key])
    }
  }
  walk(ast.body)
  return result
}

function getHandlerFunction(
  node: TSESTree.ExportNamedDeclaration
): { fn: TSESTree.Node; method: string } | null {
  const decl = node.declaration
  if (!decl) {
    return null
  }
  if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
    for (const d of decl.declarations) {
      if (
        d.id.type === AST_NODE_TYPES.Identifier &&
        HTTP_METHODS.has(d.id.name) &&
        d.init &&
        (d.init.type === AST_NODE_TYPES.ArrowFunctionExpression ||
          d.init.type === AST_NODE_TYPES.FunctionExpression)
      ) {
        return { fn: d.init, method: d.id.name }
      }
    }
    return null
  }
  if (
    decl.type === AST_NODE_TYPES.FunctionDeclaration &&
    decl.id &&
    HTTP_METHODS.has(decl.id.name)
  ) {
    return { fn: decl, method: decl.id.name }
  }
  return null
}

function getFirstParamName(
  fn: TSESTree.Node
):
  | { name: string; pattern: false }
  | { node: TSESTree.ObjectPattern; pattern: true }
  | null {
  if (
    fn.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
    fn.type !== AST_NODE_TYPES.FunctionExpression &&
    fn.type !== AST_NODE_TYPES.FunctionDeclaration
  ) {
    return null
  }
  const first = fn.params[0]
  if (!first) {
    return null
  }
  if (first.type === AST_NODE_TYPES.Identifier) {
    return { name: first.name, pattern: false }
  }
  // Handle `(req: ..., res)` with type annotation wrapper — AST_NODE_TYPES.Identifier still
  // For object destructuring: `({ body, query }, res) => ...`
  if (first.type === AST_NODE_TYPES.ObjectPattern) {
    return { node: first, pattern: true }
  }
  return null
}

export const rule = createRule<[], MessageIds>({
  name: "use-validated-body-or-query",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `req.validatedBody` / `req.validatedQuery` when a `validateAndTransformBody` / `validateAndTransformQuery` middleware is applied to the route.",
    },
    messages: {
      useValidatedBody:
        "Use `req.validatedBody` instead of `req.body`; `validateAndTransformBody` is applied to this route in the middlewares file.",
      useValidatedQuery:
        "Use `req.validatedQuery` instead of `req.query`; `validateAndTransformQuery` is applied to this route in the middlewares file.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) {
      return {}
    }
    const base = path.basename(filename)
    if (base !== "route.ts" && base !== "route.js" && base !== "route.tsx") {
      return {}
    }
    const routePath = getApiRoutePath(filename)
    if (!routePath) {
      return {}
    }

    const middlewaresFile = findMiddlewaresFile(filename)
    if (!middlewaresFile) {
      return {}
    }

    const validation = collectValidationFromMiddlewaresFile(
      middlewaresFile,
      routePath
    )
    if (!validation) {
      return {}
    }
    if (validation.body.size === 0 && validation.query.size === 0) {
      return {}
    }

    const methodApplies = (set: Set<string>, method: string): boolean =>
      set.has("*") || set.has(method)

    const handlerFns: Array<{
      fn: TSESTree.Node
      paramName: string
      method: string
    }> = []

    return {
      ExportNamedDeclaration(node) {
        const handler = getHandlerFunction(node)
        if (!handler) {
          return
        }
        const param = getFirstParamName(handler.fn)
        if (!param || param.pattern) {
          return
        }
        handlerFns.push({
          fn: handler.fn,
          paramName: param.name,
          method: handler.method,
        })
      },
      "Program:exit"() {
        for (const h of handlerFns) {
          const reqName = h.paramName
          const flagBody = methodApplies(validation.body, h.method)
          const flagQuery = methodApplies(validation.query, h.method)
          if (!flagBody && !flagQuery) {
            continue
          }
          const visit = (node: TSESTree.Node): void => {
            if (
              node.type === AST_NODE_TYPES.MemberExpression &&
              !node.computed &&
              node.object.type === AST_NODE_TYPES.Identifier &&
              node.object.name === reqName &&
              node.property.type === AST_NODE_TYPES.Identifier
            ) {
              if (flagBody && node.property.name === "body") {
                context.report({
                  node,
                  messageId: "useValidatedBody",
                  fix: (fixer) =>
                    fixer.replaceText(node.property, "validatedBody"),
                })
              } else if (flagQuery && node.property.name === "query") {
                context.report({
                  node,
                  messageId: "useValidatedQuery",
                  fix: (fixer) =>
                    fixer.replaceText(node.property, "validatedQuery"),
                })
              }
            }
            for (const key of Object.keys(node) as Array<keyof typeof node>) {
              if (key === "parent") {
                continue
              }
              const value = (node as unknown as Record<string, unknown>)[
                key as string
              ]
              if (!value) {
                continue
              }
              if (Array.isArray(value)) {
                for (const child of value) {
                  if (child && typeof child === "object" && "type" in child) {
                    visit(child as TSESTree.Node)
                  }
                }
              } else if (
                typeof value === "object" &&
                "type" in (value as object)
              ) {
                visit(value as TSESTree.Node)
              }
            }
          }
          const fn = h.fn as TSESTree.FunctionLike
          if ("body" in fn && fn.body) {
            visit(fn.body as TSESTree.Node)
          }
        }
      },
    }
  },
})

export default rule
