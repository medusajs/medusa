import { Model, NestedRelation } from "../../../client/interfaces/Model"

export const handleExpandedRelations = (model: Model, allModels: Model[]) => {
  const xExpandedRelation = model.spec["x-expanded-relations"]
  if (!xExpandedRelation) {
    return
  }
  const field = xExpandedRelation.field
  const relations = xExpandedRelation.relations ?? []
  const totals = xExpandedRelation.totals ?? []
  const implicit = xExpandedRelation.implicit ?? []

  const nestedRelation: NestedRelation = {
    field,
    nestedRelations: [],
  }

  for (const relation of [...relations, ...totals, ...implicit]) {
    const splitRelation = relation.split(".")
    walkSplitRelations(nestedRelation, splitRelation, 0)
  }

  walkNestedRelations(allModels, model, model, nestedRelation)
  model.imports = [...new Set(model.imports)]

  const prop = getPropertyByName(nestedRelation.field, model)
  if (prop) {
    prop.nestedRelations = [nestedRelation]
  }
}

const walkSplitRelations = (
  parentNestedRelation: NestedRelation,
  splitRelation: string[],
  depthIndex: number
) => {
  const field = splitRelation[depthIndex]
  let nestedRelation: NestedRelation | undefined =
    parentNestedRelation.nestedRelations.find(
      (nestedRelation) => nestedRelation.field === field
    )
  if (!nestedRelation) {
    nestedRelation = {
      field,
      nestedRelations: [],
    }
    parentNestedRelation.nestedRelations.push(nestedRelation)
  }
  depthIndex++
  if (depthIndex < splitRelation.length) {
    walkSplitRelations(nestedRelation, splitRelation, depthIndex)
  }
}

const walkNestedRelations = (
  allModels: Model[],
  rootModel: Model,
  model: Model,
  nestedRelation: NestedRelation,
  parentNestedRelation?: NestedRelation
) => {
  const prop =
    model.export === "all-of"
      ? findPropInAllOf(nestedRelation.field, model, allModels)
      : getPropertyByName(nestedRelation.field, model)
  if (!prop) {
    return
  }
  if (!["reference", "array"].includes(prop.export)) {
    return
  }

  nestedRelation.base = prop.type
  nestedRelation.isArray = prop.export === "array"

  for (const childNestedRelation of nestedRelation.nestedRelations) {
    const childModel = getModelByName(prop.type, allModels)
    if (!childModel) {
      return
    }
    rootModel.imports.push(prop.type)
    if (parentNestedRelation) {
      parentNestedRelation.hasDepth = true
    }
    walkNestedRelations(
      allModels,
      rootModel,
      childModel,
      childNestedRelation,
      nestedRelation
    )
  }
}

const findPropInAllOf = (
  fieldName: string,
  model: Model,
  allModels: Model[]
) => {
  for (const property of model.properties) {
    switch (property.export) {
      case "interface":
        return getPropertyByName(fieldName, model)
      case "reference":
        const tmpModel = getModelByName(property.type, allModels)
        if (tmpModel) {
          return getPropertyByName(fieldName, tmpModel)
        }
        break
    }
  }
}

function getModelByName(name: string, models: Model[]): Model | void {
  for (const model of models) {
    if (model.name === name) {
      return model
    }
  }
}

function getPropertyByName(name: string, model: Model): Model | void {
  for (const property of model.properties) {
    if (property.name === name) {
      return property
    }
  }
}
