import Handlebars from "handlebars"
import {
  ArrayType,
  ConditionalType,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  PredicateType,
  QueryType,
  ReferenceType,
  TupleType,
  TypeOperatorType,
  UnionType,
  UnknownType,
} from "typedoc"
import { Collapse, getType } from "utils"

export default function () {
  Handlebars.registerHelper(
    "type",
    function (
      this:
        | ArrayType
        | IntersectionType
        | IntrinsicType
        | ReferenceType
        | TupleType
        | UnionType
        | TypeOperatorType
        | QueryType
        | PredicateType
        | ReferenceType
        | ConditionalType
        | IndexedAccessType
        | UnknownType
        | InferredType,

      collapse: Collapse = "none",
      emphasis = true
    ) {
      return getType({
        reflectionType: this,
        collapse,
        wrapBackticks: emphasis,
        getRelativeUrlMethod: Handlebars.helpers.relativeURL,
      })
    }
  )
}
