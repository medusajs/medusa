/**
 * The `Policy` global is the last remaining RBAC global registry. It is
 * scheduled for removal, once its consumers resolve the registered policies
 * from the container instead.
 */
declare global {
  var Policy: Record<
    string,
    { resource: string; operation: string; description?: string }
  >
}

export {}
