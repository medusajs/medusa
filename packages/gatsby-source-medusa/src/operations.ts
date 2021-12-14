import { SourceNodesArgs } from "gatsby";
import { createClient } from "./client";

export function createOperations(
  options: MedusaPluginOptions,
  { reporter }: SourceNodesArgs
): IOperations {
  const client = createClient(options, reporter);

  function createOperation(
    name: "products" | "collections" | "regions" | "orders",
    queryString?: string
  ): IMedusaOperation {
    return {
      execute: (): Promise<any[]> => client[name](queryString),
      name: name,
    };
  }

  return {
    createProductsOperation: createOperation("products"),
    createCollectionsOperation: createOperation("collections"),
    createRegionsOperation: createOperation("regions"),
    createOrdersOperation: createOperation("orders"),
    incrementalProductsOperation: (date: Date) =>
      createOperation("products", date.toISOString()),
    incrementalCollectionsOperation: (date: Date) =>
      createOperation("collections", date.toISOString()),
    incrementalRegionsOperation: (date: Date) =>
      createOperation("regions", date.toISOString()),
    incrementalOrdersOperation: (date: Date) =>
      createOperation("orders", date.toISOString()),
  };
}
