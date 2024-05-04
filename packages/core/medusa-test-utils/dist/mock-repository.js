"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var MockRepo = /** @class */ (function () {
    function MockRepo(_a) {
        var _this = this;
        var create = _a.create, update = _a.update, remove = _a.remove, softRemove = _a.softRemove, find = _a.find, findDescendantsTree = _a.findDescendantsTree, findOne = _a.findOne, findOneWithRelations = _a.findOneWithRelations, findOneOrFail = _a.findOneOrFail, save = _a.save, findAndCount = _a.findAndCount, del = _a.del, count = _a.count, insertBulk = _a.insertBulk, metadata = _a.metadata;
        this.insertBulk = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.insertBulk_) {
                return _this.insertBulk_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.create = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.create_) {
                return _this.create_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.softRemove = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.softRemove_) {
                return _this.softRemove_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.remove = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.remove_) {
                return _this.remove_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.update = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.update_) {
                return _this.update_.apply(_this, __spreadArray([], __read(args), false));
            }
        });
        this.findOneOrFail = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.findOneOrFail_) {
                return _this.findOneOrFail_.apply(_this, __spreadArray([], __read(args), false));
            }
        });
        this.findOneWithRelations = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.findOneWithRelations_) {
                return _this.findOneWithRelations_.apply(_this, __spreadArray([], __read(args), false));
            }
        });
        this.findOne = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.findOne_) {
                return _this.findOne_.apply(_this, __spreadArray([], __read(args), false));
            }
        });
        this.findDescendantsTree = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.findDescendantsTree_) {
                return _this.findDescendantsTree_.apply(_this, __spreadArray([], __read(args), false));
            }
        });
        this.find = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.find_) {
                return _this.find_.apply(_this, __spreadArray([], __read(args), false));
            }
        });
        this.save = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.save_) {
                return _this.save_.apply(_this, __spreadArray([], __read(args), false));
            }
            return Promise.resolve.apply(Promise, __spreadArray([], __read(args), false));
        });
        this.findAndCount = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.findAndCount_) {
                return _this.findAndCount_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.count = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.count_) {
                return _this.count_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.delete = jest.fn().mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.delete_) {
                return _this.delete_.apply(_this, __spreadArray([], __read(args), false));
            }
            return {};
        });
        this.create_ = create;
        this.update_ = update;
        this.remove_ = remove;
        this.delete_ = del;
        this.softRemove_ = softRemove;
        this.find_ = find;
        this.findDescendantsTree_ = findDescendantsTree;
        this.findOne_ = findOne;
        this.findOneOrFail_ = findOneOrFail;
        this.save_ = save;
        this.findAndCount_ = findAndCount;
        this.findOneWithRelations_ = findOneWithRelations;
        this.insertBulk_ = insertBulk;
        this.count_ = count;
        this.metadata = metadata !== null && metadata !== void 0 ? metadata : {
            columns: [],
        };
    }
    MockRepo.prototype.setFindOne = function (fn) {
        this.findOne_ = fn;
    };
    return MockRepo;
}());
exports.default = (function (methods) {
    if (methods === void 0) { methods = {}; }
    return new MockRepo(methods);
});
//# sourceMappingURL=mock-repository.js.map