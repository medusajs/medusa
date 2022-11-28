import { PropsWithChildren } from "react";
import { MedusaProvider } from "./medusa-provider";

type KitchenSinkProps = PropsWithChildren;

/**
 * A component that wraps the app in all the necessary providers.
 */
const KitchenSink = ({ children }: KitchenSinkProps) => {
  return <MedusaProvider>{children}</MedusaProvider>;
};

export default KitchenSink;
