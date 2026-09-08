# Security Review Reference

Load this before Step 10. The inline checklist in `SKILL.md` names the
vulnerability classes; this file gives you the **mental model** for finding
them and Medusa-specific patterns that are easy to miss.

## The core heuristic: trace tainted input to a dangerous sink

Most real vulnerabilities are the same shape: **user-controlled input reaches
a sensitive operation without validation in between.** Don't scan for scary
function names — trace data flow.

1. **Identify the sources** the diff introduces or touches. Anything an
   external caller can influence is tainted: request bodies/params/query,
   headers, uploaded file names and contents, webhook payloads, entity fields
   that were set from any of the above, and values read back from the DB that
   originally came from a user.
2. **Identify the sinks** in the changed code: filesystem paths, **object
   storage keys / bucket paths**, URLs used in server-side fetches, SQL / query
   filters, shell commands, `eval`/`Function`, dynamic `require`/`import`,
   redirect targets, template rendering, response bodies, and logs.
3. **Check what happens between source and sink.** Is the input validated,
   allow-listed, normalized, length-capped, or escaped? If a tainted value
   flows into a sink untouched, that is your finding — regardless of how
   "normal" the surrounding code looks.

If you cannot tell from the diff whether a value is tainted, **read the
callers and the type definition** to see where it originates. A filename or key
that looks internal is often set directly from an upload request.

## Red flag: a diff that WIDENS what user input reaches a sink

The most commonly missed security bug is not new dangerous code — it is a
change that **removes an implicit protection**. Watch for:

- Code that previously used only a *sanitized fragment* of an input and now
  uses **more** of it. Example: parsing a filename and previously using only
  the base name + extension, then changing it to also prepend the parsed
  **directory** — that directory is attacker-controlled and can contain `..`
  or leading `/`.
- Removing a `replace(/[^a-z0-9]/…)`, a `path.basename()`, an allow-list
  check, a length cap, or an `encodeURIComponent`.
- Loosening a validator/regex, widening an accepted type, or making a
  previously-fixed value configurable from the request.
- Concatenating a new user-controlled segment into an existing path, key, URL,
  or identifier string.

When you see the diff route more of an input into a path/key/URL/query, stop
and ask: *"What is the worst string an attacker can put here, and where does it
end up?"* Then confirm the code rejects or neutralizes that string.

## Path / key traversal — filesystem AND object storage

Path traversal is **not limited to `fs.*` calls.** Any construction of a path,
key, or identifier from user input is in scope:

- **Filesystem:** `fs.readFile`, `fs.writeFile`, `createReadStream`,
  `path.join(base, userInput)`, static file serving.
- **Object storage keys** (S3, GCS, R2, etc.): the `Key` / object path passed
  to `PutObject`, `GetObject`, `Upload`, presigned-URL helpers. Cloud SDKs
  treat the key as an opaque string and will happily store `a/../../b`, so
  `..` and leading `/` segments let a caller **escape a configured prefix,
  cross a tenant/namespace boundary, or overwrite another object.**
- **Cache keys, URL paths, redirect targets, archive entry names** (zip-slip).

What to require in the fix:
- Reject or strip `..` segments and leading `/` (and their URL-encoded forms
  `%2e%2e`, `%2f`) **before** the value is used to build the path/key.
- Prefer deriving the safe part explicitly (e.g. `path.basename`, an
  allow-list of characters) over trying to blacklist bad sequences.
- Confirm a configured prefix / base directory actually **contains** the final
  resolved path — prefixing a string does not prevent `..` from climbing out
  of it.

Concrete pattern that MUST be flagged (this is the shape of a real miss):

```ts
// filename comes from the upload request (tainted)
const parsed = path.parse(file.filename)
const dir = parsed.dir ? `${parsed.dir}/` : ""
// prefix is meant to isolate this tenant's files
const key = `${config.prefix}${dir}${parsed.name}-${ulid()}${parsed.ext}`
// filename "../../other-tenant/logo.png" -> key climbs out of `prefix`
```

Finding: *path traversal in the storage key — a crafted `filename` containing
`..` escapes `config.prefix` and can write outside the intended
tenant/namespace. Fix: strip `..`/leading-`/` segments (or reject them) before
building the key.*

## Database injection — beyond raw SQL string concatenation

Raw SQL built from user input (`` `... WHERE id = '${req.params.id}'` ``) is the
obvious case, but Medusa uses MikroORM and the remote-query layer, which have
their own injection surfaces. Flag any of these when the value is tainted:

- **Raw MikroORM / Knex queries:** `em.execute(...)`, `knex.raw(...)`,
  `manager.getConnection().execute(...)`, or `.raw(...)` fragments built by
  string interpolation instead of bound parameters (`?` / named bindings).
- **Query-filter / operator injection:** passing `req.body`, `req.query`, or
  `req.filterableFields` **straight into** a service `.list*()`, repository, or
  `query.graph({ filters })` call without a validator. An attacker can inject
  operators (`$ne`, `$like`, `$or`, `$gt`, …) or filter on unintended columns
  to read rows they should not see, bypass a scope filter, or turn an equality
  check into a broad match. Medusa routes are expected to validate/whitelist
  the request schema (Zod / `validateAndTransformBody`) and pass only known
  fields into the filter object.
- **Dynamic column / order / table names** from user input (identifiers cannot
  be parameterized) — must be checked against an allow-list.
- **`$where` / JS-expression style filters** or anything that lets the caller
  supply an expression string.

Fix expectation: use bound parameters for values, an allow-list for
identifiers, and validate the request into a known shape before it reaches any
filter or query builder. Never interpolate a tainted value into a query string.

## Output encoding — unescaped JSON, HTML, and prototype pollution

This is the most commonly missed class. A value can be safe in the DB yet
dangerous when it is **serialized back out** without proper encoding:

- **Unescaped JSON embedded in HTML / a `<script>` context (XSS).** The classic
  bug is interpolating `JSON.stringify(data)` into an HTML string or inline
  script — e.g. `` `<script>window.__STATE__=${JSON.stringify(data)}</script>` ``
  or building an HTML email/template from user data. `JSON.stringify` does
  **not** escape HTML, so a value containing `</script>` (or `<!--`, `]]>`,
  U+2028/U+2029) breaks out of the script/tag and injects arbitrary markup.
  Fix: escape the dangerous characters (`<`, `>`, `&`, U+2028, U+2029) in the
  serialized string before embedding it, or pass the data via a `data-*`
  attribute / DOM API rather than string-concatenating it into HTML.
- **User input reflected into any HTML/markup response** (server-rendered pages,
  emails, invoices, SVGs, redirects with a reflected param) without escaping →
  XSS/HTML injection.
- **Building JSON by string concatenation** instead of `JSON.stringify` — a
  quote or brace in the value corrupts or injects into the document. Always
  serialize with `JSON.stringify`, never hand-assemble JSON.
- **`JSON.parse` on untrusted input without a guard** — wrap in try/catch (a
  malformed body should be a 400, not an unhandled throw), and when the parsed
  object is **merged/assigned** into another object (`Object.assign`, spread,
  deep-merge, `lodash.merge`), treat `__proto__` / `constructor` / `prototype`
  keys as **prototype-pollution** vectors — reject or use a null-prototype
  target.
- **`Content-Type` mismatch:** returning user-controlled text as `text/html`
  (or omitting the header so a browser sniffs it as HTML) when it should be
  `application/json` / `text/plain`.

## Authorization on data-scoped routes

For any new/changed route or workflow that reads or mutates data belonging to a
user, store, or customer:

- Is there an ownership/scope check, or does it trust an ID from the request?
- Is the auth/permission middleware actually applied to the new route?
- Can a lower-privileged actor reach an admin-only operation?

## Other classes (see SKILL.md Step 10 for the full list)

- **Code execution:** `eval`/`Function`, dynamic `require`/`import` with user
  paths, shell construction from user input.
- **SSRF:** user-controlled URLs in server-side `fetch`/HTTP calls without an
  allow-list.
- **DoS:** missing size/length/pagination limits on user input.
- **Data exposure:** secrets/PII/internal IDs in responses or logs, stack
  traces leaked to clients, hardcoded credentials.
- **Supply chain:** typosquat packages, `pre/postinstall` scripts,
  lockfile/manifest mismatch.

## Severity and phrasing

- Every confirmed OR plausible security issue is **blocking** — it belongs in
  `blocking_points` with `"requires-more"` in `labels_to_add`, never merely
  mentioned in `summary`.
- If you are not certain the input is reachable/tainted, still flag it as a
  question (*"Can `file.filename` contain `..`? If so this escapes the
  prefix…"*) and keep it blocking — the author must confirm or disprove.
- Use `close-malicious` only for deliberate attacks (backdoors, exfiltration),
  never for good-faith bugs like the traversal above — those are
  `needs-changes`.
- Phrase each finding as:
  *"`<file>:<location>`: `<vuln class>` — `<one-sentence attack scenario>`. Fix: `<concrete fix>`."*
