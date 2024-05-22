import { parse, type ParseResult, type ParserOptions } from "@babel/parser"
import _traverse, { type NodePath } from "@babel/traverse"
import {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  File,
  ObjectProperty,
} from "@babel/types"

/**
 * Depending on whether we are running the CJS or ESM build of the plugin, we
 * need to import the default export of the `@babel/traverse` package in
 * different ways.
 */
let traverse: typeof _traverse

if (typeof _traverse === "function") {
  traverse = _traverse
} else {
  traverse = (_traverse as any).default
}

export { parse, traverse }
export type {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  File,
  NodePath,
  ObjectProperty,
  ParseResult,
  ParserOptions,
}
