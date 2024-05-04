"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryRepository = exports.ProductRepository = exports.BaseRepository = void 0;
var utils_1 = require("@medusajs/utils");
Object.defineProperty(exports, "BaseRepository", { enumerable: true, get: function () { return utils_1.MikroOrmBaseRepository; } });
var product_1 = require("./product");
Object.defineProperty(exports, "ProductRepository", { enumerable: true, get: function () { return product_1.ProductRepository; } });
var product_category_1 = require("./product-category");
Object.defineProperty(exports, "ProductCategoryRepository", { enumerable: true, get: function () { return product_category_1.ProductCategoryRepository; } });
