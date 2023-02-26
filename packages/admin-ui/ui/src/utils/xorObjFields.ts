const xorObjFields = (obj: Record<string, any>, keyA: string, keyB: string) =>
  obj[keyA] ? { [keyA]: obj[keyA] } : { [keyB]: obj[keyB] }

export default xorObjFields
