import { RuleSetRule } from "webpack"
import { cssLoader } from "./css"
import { svgLoader } from "./svg"
import { tsLoader } from "./ts"

export const loaders: RuleSetRule[] = [cssLoader, svgLoader, tsLoader]
