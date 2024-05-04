"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileService = void 0;
var utils_1 = require("@medusajs/utils");
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var LocalFileService = /** @class */ (function (_super) {
    __extends(LocalFileService, _super);
    function LocalFileService(_, options) {
        var _this = _super.call(this) || this;
        _this.getUploadFilePath = function (fileKey) {
            return path_1.default.join(_this.uploadDir_, fileKey);
        };
        _this.getUploadFileUrl = function (fileKey) {
            return path_1.default.join(_this.backendUrl_, _this.getUploadFilePath(fileKey));
        };
        _this.uploadDir_ = (options === null || options === void 0 ? void 0 : options.upload_dir) || "uploads";
        _this.backendUrl_ = (options === null || options === void 0 ? void 0 : options.backend_url) || "http://localhost:9000";
        return _this;
    }
    LocalFileService.prototype.upload = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedFilename, fileKey, filePath, fileUrl, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!file) {
                            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "No file provided");
                        }
                        if (!file.filename) {
                            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "No filename provided");
                        }
                        parsedFilename = path_1.default.parse(file.filename);
                        if (parsedFilename.dir) {
                            this.ensureDirExists(parsedFilename.dir);
                        }
                        fileKey = path_1.default.join(parsedFilename.dir, "".concat(Date.now(), "-").concat(parsedFilename.base));
                        filePath = this.getUploadFilePath(fileKey);
                        fileUrl = this.getUploadFileUrl(fileKey);
                        content = Buffer.from(file.content, "binary");
                        return [4 /*yield*/, promises_1.default.writeFile(filePath, content)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                key: fileKey,
                                url: fileUrl,
                            }];
                }
            });
        });
    };
    LocalFileService.prototype.delete = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = this.getUploadFilePath(file.fileKey);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, promises_1.default.access(filePath, promises_1.default.constants.F_OK)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, promises_1.default.unlink(filePath)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LocalFileService.prototype.getPresignedDownloadUrl = function (fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promises_1.default.access(this.getUploadFilePath(fileData.fileKey), promises_1.default.constants.F_OK)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, "File with key ".concat(fileData.fileKey, " not found"));
                    case 3: return [2 /*return*/, this.getUploadFileUrl(fileData.fileKey)];
                }
            });
        });
    };
    LocalFileService.prototype.ensureDirExists = function (dirPath) {
        return __awaiter(this, void 0, void 0, function () {
            var relativePath, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        relativePath = path_1.default.join(this.uploadDir_, dirPath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, promises_1.default.access(relativePath, promises_1.default.constants.F_OK)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        e_2 = _a.sent();
                        return [4 /*yield*/, promises_1.default.mkdir(relativePath, { recursive: true })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LocalFileService.identifier = "localfs";
    return LocalFileService;
}(utils_1.AbstractFileProviderService));
exports.LocalFileService = LocalFileService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9sb2NhbC1maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlDQUEwRTtBQUMxRSx5REFBNEI7QUFDNUIsOENBQXVCO0FBRXZCO0lBQXNDLG9DQUEyQjtJQUsvRCwwQkFBWSxDQUFDLEVBQUUsT0FBZ0M7UUFBL0MsWUFDRSxpQkFBTyxTQUdSO1FBcUVPLHVCQUFpQixHQUFHLFVBQUMsT0FBZTtZQUMxQyxPQUFPLGNBQUksQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUE7UUFFTyxzQkFBZ0IsR0FBRyxVQUFDLE9BQWU7WUFDekMsT0FBTyxjQUFJLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDckUsQ0FBQyxDQUFBO1FBN0VDLEtBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsVUFBVSxLQUFJLFNBQVMsQ0FBQTtRQUNsRCxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFdBQVcsS0FBSSx1QkFBdUIsQ0FBQTs7SUFDcEUsQ0FBQztJQUVLLGlDQUFNLEdBQVosVUFDRSxJQUFxQzs7Ozs7O3dCQUVyQyxJQUFJLENBQUMsSUFBSSxFQUFFOzRCQUNULE1BQU0sSUFBSSxtQkFBVyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO3lCQUMxRTt3QkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDbEIsTUFBTSxJ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