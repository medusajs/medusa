/**
 * Inlined in the entry: an fs layer serving the directories and files the
 * build snapshotted (keyed like everything else), so boot never needs the
 * packages on disk. Anything not snapshotted falls through to the real fs.
 */
export const RUNTIME_VIRTUAL_FS = `
function __medusaInstallVirtualFs(directories, files) {
  var fs = require("fs"), path = require("path"), url = require("url");
  var dirs = new Map(Object.entries(directories));
  var contents = new Map(Object.entries(files));
  var toPath = (p) => (p instanceof URL ? url.fileURLToPath(p) : typeof p === "string" ? path.resolve(p) : null);
  var kindOf = (p) => {
    var file = toPath(p);
    if (!file) return null;
    var key = __medusaPathToKey(file);
    if (dirs.has(key)) return "dir";
    if (contents.has(key)) return "file";
    // Walk up to the nearest snapshotted directory, then back down: a name
    // missing from a snapshotted listing doesn't exist (listings are complete)
    var missing = [];
    for (var dir = file; ; ) {
      var parent = path.dirname(dir);
      if (parent === dir) return null;
      missing.unshift(path.basename(dir));
      dir = parent;
      if (dirs.has(__medusaPathToKey(dir))) break;
    }
    for (var i = 0; i < missing.length; i++) {
      var entry = (dirs.get(__medusaPathToKey(dir)) || []).find((e) => e[0] === missing[i]);
      if (!entry) return "missing";
      if (i === missing.length - 1) return entry[1] ? "dir" : "file";
      if (!entry[1]) return "missing";
      dir = path.join(dir, missing[i]);
    }
    return null;
  };
  globalThis.__medusaVirtualKind = kindOf;
  globalThis.__medusaVirtualRead = (p) => {
    var file = toPath(p);
    return file ? contents.get(__medusaPathToKey(file)) : undefined;
  };
  var enoent = (op, p) => Object.assign(new Error("ENOENT: no such file or directory, " + op + " '" + p + "'"), { code: "ENOENT", errno: -2, syscall: op, path: String(p) });
  var stats = (kind) => {
    var time = new Date(0);
    return { isDirectory: () => kind === "dir", isFile: () => kind === "file", isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, size: 0, mode: kind === "dir" ? 16877 : 33188, mtime: time, ctime: time, atime: time, birthtime: time, mtimeMs: 0, ctimeMs: 0, atimeMs: 0, birthtimeMs: 0 };
  };
  var dirent = (name, isDir, parent) => ({ name, parentPath: parent, path: parent, isDirectory: () => isDir, isFile: () => !isDir, isSymbolicLink: () => false });
  var list = (p, options) => {
    var dir = toPath(p);
    var withTypes = options && typeof options === "object" && options.withFileTypes;
    var recursive = options && typeof options === "object" && options.recursive;
    var out = [];
    var walk = (current, prefix) => {
      for (var entry of dirs.get(__medusaPathToKey(current)) || []) {
        var name = prefix ? path.join(prefix, entry[0]) : entry[0];
        out.push(withTypes ? dirent(entry[0], entry[1], current) : name);
        if (recursive && entry[1]) walk(path.join(current, entry[0]), name);
      }
    };
    walk(dir, "");
    return out;
  };
  var read = (p, options) => {
    var data = contents.get(__medusaPathToKey(toPath(p)));
    var encoding = typeof options === "string" ? options : options && options.encoding;
    return encoding ? data : Buffer.from(data);
  };
  var syncVariant = (name, run) => {
    var original = fs[name];
    fs[name] = function (p, ...rest) {
      var kind = kindOf(p);
      return kind ? run(kind, p, rest, name) : original.call(this, p, ...rest);
    };
  };
  var answer = (kind, p, rest, op) => {
    switch (op.replace(/Sync$/, "")) {
      case "existsSync": case "exists": return kind !== "missing";
      case "readdir": if (kind !== "dir") throw enoent("scandir", p); return list(p, rest[0]);
      case "stat": case "lstat": if (kind === "missing") throw enoent(op, p); return stats(kind);
      case "access": if (kind === "missing") throw enoent("access", p); return undefined;
      case "realpath": if (kind === "missing") throw enoent("realpath", p); return toPath(p);
      case "readFile": if (kind !== "file" || !contents.has(__medusaPathToKey(toPath(p)))) throw enoent("open", p); return read(p, rest[0]);
    }
  };
  for (var name of ["readdirSync", "statSync", "lstatSync", "accessSync", "realpathSync", "readFileSync"]) syncVariant(name, answer);
  var existsSync = fs.existsSync;
  fs.existsSync = (p) => { var kind = kindOf(p); return kind ? kind !== "missing" : existsSync(p); };
  fs.realpathSync.native = fs.realpathSync;
  for (var name of ["readdir", "stat", "lstat", "access", "realpath", "readFile"]) {
    (function (name) {
      var original = fs[name];
      fs[name] = function (p, ...rest) {
        var kind = kindOf(p);
        if (!kind) return original.call(this, p, ...rest);
        var cb = rest.pop();
        try { var result = answer(kind, p, rest, name); process.nextTick(() => cb(null, result)); } catch (e) { process.nextTick(() => cb(e)); }
      };
      var promised = fs.promises[name];
      fs.promises[name] = function (p, ...rest) {
        var kind = kindOf(p);
        if (!kind) return promised.call(this, p, ...rest);
        try { return Promise.resolve(answer(kind, p, rest, name)); } catch (e) { return Promise.reject(e); }
      };
    })(name);
  }
  // fs-extra and others expect the native variant of the callback form too
  fs.realpath.native = fs.realpath;
}
`
