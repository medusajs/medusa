import { WorkflowArguments } from "../../helper"

enum Aliases {
  CartAddresses = "CartAddresses",
}

export async function removeAddresses({
  container,
  context,
  data,
}: WorkflowArguments): Promise<void> {}

removeAddresses.aliases = Aliases
