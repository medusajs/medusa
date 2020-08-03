"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var inventorySync = function inventorySync(container) {
  var brightpearlService = container.resolve("brightpearlService");
  var eventBus = container.resolve("eventBusService");
  var pattern = "43 4,10,14,20 * * *"; // nice for tests "*/10 * * * * *"

  eventBus.createCronJob("inventory-sync", {}, pattern, brightpearlService.syncInventory());
};

var _default = inventorySync;
exports["default"] = _default;