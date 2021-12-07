// Util function defining the transformation of booleans when part of req.query
// e.g. /admin/shipping-options?is_return=false -> false
//
// We've previously been using @Type(() => Boolean), but this will always return true for strings.
// See https://github.com/typestack/class-transformer/issues/676
// and https://github.com/typestack/class-transformer/issues/306
//
// The solution here is stolen from: https://github.com/typestack/class-transformer/issues/676#issuecomment-822699830
export const optionalBooleanMapper = new Map([
  ["undefined", undefined],
  ["null", null],
  ["true", true],
  ["false", false],
])
