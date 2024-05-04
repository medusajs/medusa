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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.S3FileService = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var utils_1 = require("@medusajs/utils");
var path_1 = __importDefault(require("path"));
var ulid_1 = require("ulid");
// FUTURE: At one point we will probably need to support authenticating with IAM roles instead.
var S3FileService = /** @class */ (function (_super) {
    __extends(S3FileService, _super);
    function S3FileService(_a, options) {
        var logger = _a.logger;
        var _this = this;
        var _b, _c, _d, _e;
        _this = _super.call(this) || this;
        _this.config_ = {
            fileUrl: options.file_url,
            accessKeyId: options.access_key_id,
            secretAccessKey: options.secret_access_key,
            region: options.region,
            bucket: options.bucket,
            prefix: (_b = options.prefix) !== null && _b !== void 0 ? _b : "",
            endpoint: options.endpoint,
            cacheControl: (_c = options.cache_control) !== null && _c !== void 0 ? _c : "public, max-age=31536000",
            downloadFileDuration: (_d = options.download_file_duration) !== null && _d !== void 0 ? _d : 60 * 60,
            additionalClientConfig: (_e = options.additional_client_config) !== null && _e !== void 0 ? _e : {},
        };
        _this.logger_ = logger;
        _this.client_ = _this.getClient();
        return _this;
    }
    S3FileService.prototype.getClient = function () {
        var config = __assign({ credentials: {
                accessKeyId: this.config_.accessKeyId,
                secretAccessKey: this.config_.secretAccessKey,
            }, region: this.config_.region, endpoint: this.config_.endpoint }, this.config_.additionalClientConfig);
        return new client_s3_1.S3Client(config);
    };
    S3FileService.prototype.upload = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedFilename, fileKey, content, command, e_1;
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
                        fileKey = "".concat(this.config_.prefix).concat(parsedFilename.name, "-").concat((0, ulid_1.ulid)()).concat(parsedFilename.ext);
                        content = Buffer.from(file.content, "binary");
                        command = new client_s3_1.PutObjectCommand({
                            // TODO: Add support for private files
                            // We probably also want to support a separate bucket altogether for private files
                            // protected private_bucket_: string
                            // protected private_access_key_id_: string
                            // protected private_secret_access_key_: string
                            // ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
                            Bucket: this.config_.bucket,
                            Body: content,
                            Key: fileKey,
                            ContentType: file.mimeType,
                            CacheControl: this.config_.cacheControl,
                            // Note: We could potentially set the content disposition when uploading,
                            // but storing the original filename as metadata should suffice.
                            Metadata: {
                                "x-amz-meta-original-filename": file.filename,
                            },
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client_.send(command)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.logger_.error(e_1);
                        throw e_1;
                    case 4: return [2 /*return*/, {
                            url: "".concat(this.config_.fileUrl, "/").concat(fileKey),
                            key: fileKey,
                        }];
                }
            });
        });
    };
    S3FileService.prototype.delete = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var command, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new client_s3_1.DeleteObjectCommand({
                            Bucket: this.config_.bucket,
                            Key: file.fileKey,
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client_.send(command)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        // TODO: Rethrow depending on the error (eg. a file not found error is fine, but a failed request should be rethrown)
                        this.logger_.error(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    S3FileService.prototype.getPresignedDownloadUrl = function (fileData) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new client_s3_1.GetObjectCommand({
                            Bucket: this.config_.bucket,
                            Key: "".concat(fileData.fileKey),
                        });
                        return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(this.client_, command, {
                                expiresIn: this.config_.downloadFileDuration,
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    S3FileService.identifier = "s3";
    return S3FileService;
}(utils_1.AbstractFileProviderService));
exports.S3FileService = S3FileService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zMy1maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBTTJCO0FBQzNCLHNFQUE0RDtBQUU1RCx5Q0FBMEU7QUFDMUUsOENBQXVCO0FBQ3ZCLDZCQUEyQjtBQW9CM0IsK0ZBQStGO0FBQy9GO0lBQW1DLGlDQUEyQjtJQU01RCx1QkFBWSxFQUFnQyxFQUFFLE9BQTZCO1lBQTdELE1BQU0sWUFBQTtRQUFwQixpQkFpQkM7O2dCQWhCQyxpQkFBTztRQUVQLEtBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDekIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhO1lBQ2xDLGVBQWUsRUFBRSxPQUFPLENBQUMsaUJBQWlCO1lBQzFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN0QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07WUFDdEIsTUFBTSxFQUFFLE1BQUEsT0FBTyxDQUFDLE1BQU0sbUNBQUksRUFBRTtZQUM1QixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDMUIsWUFBWSxFQUFFLE1BQUEsT0FBTyxDQUFDLGFBQWEsbUNBQUksMEJBQTBCO1lBQ2pFLG9CQUFvQixFQUFFLE1BQUEsT0FBTyxDQUFDLHNCQUFzQixtQ0FBSSxFQUFFLEdBQUcsRUFBRTtZQUMvRCxzQkFBc0IsRUFBRSxNQUFBLE9BQU8sQ0FBQyx3QkFBd0IsbUNBQUksRUFBRTtTQUMvRCxDQUFBO1FBQ0QsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7UUFDckIsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7O0lBQ2pDLENBQUM7SUFFUyxpQ0FBUyxHQUFuQjtRQUNFLElBQU0sTUFBTSxjQUNWLFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUNyQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlO2FBQzlDLEVBQ0QsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUMzQixRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQ3ZDLENBQUE7UUFFRCxPQUFPLElBQUksb0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM3QixDQUFDO0lBRUssOEJBQU0sR0FBWixVQUNFLElBQXFDOzs7Ozs7d0JBRXJDLElBQUksQ0FBQyxJQUFJLEVBQUU7NEJBQ1QsTUFBTSxJQUFJLG1CQUFXLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUE7eUJBQzFFO3dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUNsQixNQUFNLElBQUksbUJBQVcsQ0FDbkIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUM5QixzQkFBc0IsQ0FDdkIsQ0FBQTt5QkFDRjt3QkFFSyxjQUFjLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7d0JBRzFDLE9BQU8sR0FBRyxVQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxTQUFHLGNBQWMsQ0FBQyxJQUFJLGNBQUksSUFBQSxXQUFJLEdBQUUsU0FDcEUsY0FBYyxDQUFDLEdBQUcsQ0FDbEIsQ0FBQTt3QkFFSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO3dCQUM3QyxPQUFPLEdBQUcsSUFBSSw0QkFBZ0IsQ0FBQzs0QkFDbkMsc0NBQXNDOzRCQUN0QyxrRkFBa0Y7NEJBQ2xGLG9DQUFvQzs0QkFDcEMsMkNBQTJDOzRCQUMzQywrQ0FBK0M7NEJBRS9DLHlFQUF5RTs0QkFDekUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTs0QkFDM0IsSUFBSSxFQUFFLE9BQU87NEJBQ2IsR0FBRyxFQUFFLE9BQU87NEJBQ1osV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFROzRCQUMxQixZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZOzRCQUN2Qyx5RUFBeUU7NEJBQ3pFLGdFQUFnRTs0QkFDaEUsUUFBUSxFQUFFO2dDQUNSLDhCQUE4QixFQUFFLElBQUksQ0FBQyxRQUFROzZCQUM5Qzt5QkFDRixDQUFDLENBQUE7Ozs7d0JBR0EscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUE7O3dCQUFoQyxTQUFnQyxDQUFBOzs7O3dCQUVoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsQ0FBQTt3QkFDckIsTUFBTSxHQUFDLENBQUE7NEJBR1Qsc0JBQU87NEJBQ0wsR0FBRyxFQUFFLFVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLGNBQUksT0FBTyxDQUFFOzRCQUN6QyxHQUFHLEVBQUUsT0FBTzt5QkFDYixFQUFBOzs7O0tBQ0Y7SUFFSyw4QkFBTSxHQUFaLFVBQWEsSUFBcUM7Ozs7Ozt3QkFDMUMsT0FBTyxHQUFHLElBQUksK0JBQW1CLENBQUM7NEJBQ3RDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07NEJBQzNCLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTzt5QkFDbEIsQ0FBQyxDQUFBOzs7O3dCQUdBLHFCQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFBOzt3QkFBaEMsU0FBZ0MsQ0FBQTs7Ozt3QkFFaEMscUhBQXFIO3dCQUNySCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsQ0FBQTs7Ozs7O0tBRXhCO0lBRUssK0NBQXVCLEdBQTdCLFVBQ0UsUUFBc0M7Ozs7Ozt3QkFHaEMsT0FBTyxHQUFHLElBQUksNEJBQWdCLENBQUM7NEJBQ25DLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07NEJBQzNCLEdBQUcsRUFBRSxVQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUU7eUJBQzNCLENBQUMsQ0FBQTt3QkFFSyxxQkFBTSxJQUFBLG1DQUFZLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7Z0NBQy9DLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQjs2QkFDN0MsQ0FBQyxFQUFBOzRCQUZGLHNCQUFPLFNBRUwsRUFBQTs7OztLQUNIO0lBdkhNLHdCQUFVLEdBQUcsSUFBSSxDQUFBO0lBd0gxQixvQkFBQztDQUFBLEFBekhELENBQW1DLG1DQUEyQixHQXlIN0Q7QUF6SFksc0NBQWEifQ==