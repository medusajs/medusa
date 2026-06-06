import {
  BigNumber,
  isDefined,
  MathBN,
  toMikroORMEntity,
} from "@zjedene-medusa/framework/utils"
import { Formula, OnInit } from "@zjedene-medusa/framework/mikro-orm/core"

import InventoryItem from "../models/inventory-item"
import InventoryLevel from "../models/inventory-level"

function applyHook() {
  const MikroORMEntity = toMikroORMEntity(InventoryLevel)

  MikroORMEntity.prototype["onInit"] = function () {
    if (isDefined(this.stocked_quantity) && isDefined(this.reserved_quantity)) {
      this.available_quantity = new BigNumber(
        MathBN.sub(this.raw_stocked_quantity, this.raw_reserved_quantity)
      )
    }
  }

  OnInit()(MikroORMEntity.prototype, "onInit")
}

function applyFormulas() {
  const MikroORMEntity = toMikroORMEntity(InventoryItem)

  Formula(
    (item) =>
      `(SELECT SUM(reserved_quantity) FROM inventory_level il WHERE il.inventory_item_id = ${item}.id AND il.deleted_at IS NULL)`,
    { lazy: true, serializer: Number, hidden: true, type: "number" }
  )(MikroORMEntity.prototype, "reserved_quantity")

  Formula(
    (item) =>
      `(SELECT SUM(stocked_quantity) FROM inventory_level il WHERE il.inventory_item_id = ${item}.id AND il.deleted_at IS NULL)`,
    { lazy: true, serializer: Number, hidden: true, type: "number" }
  )(MikroORMEntity.prototype, "stocked_quantity")
}

export const applyEntityHooks = () => {
  applyHook()
  applyFormulas()
}
