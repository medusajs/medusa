"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkRepository = exports.BaseRepository = void 0;
var utils_1 = require("@medusajs/utils");
Object.defineProperty(exports, "BaseRepository", { enumerable: true, get: function () { return utils_1.MikroOrmBaseRepository; } });
var link_1 = require("./link");
Object.defineProperty(exports, "getLinkRepository", { enumerable: true, get: function () { return link_1.getLinkRepository; } });
