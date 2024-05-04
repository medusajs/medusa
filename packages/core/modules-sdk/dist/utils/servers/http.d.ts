import { LoadedModule, MedusaAppOutput, MedusaContainer } from "@medusajs/types";
export default function (container: MedusaContainer, loadedModules: Record<string, LoadedModule | LoadedModule[]>, remoteQuery: MedusaAppOutput["query"]): (port: number, options?: Record<string, any>) => Promise<void>;
