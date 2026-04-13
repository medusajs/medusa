import crypto from "crypto";

export function generateCode(
  prefix: string = "GIFT",
  sections: number = 4
): string {
  // Characters to use (excluding similar-looking characters like 0/O, 1/I)
  const characters: string = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  // Calculate how many bytes we need for generating our code
  // We need enough random bytes to select from our character set
  const length: number = sections * 4;
  const byteLength: number = Math.ceil(
    (length * Math.log2(characters.length)) / 8
  );

  // Generate random bytes
  const randomBytes: Buffer = crypto.randomBytes(byteLength);

  // Generate the code
  let code: string = "";
  for (let i = 0; i < length; i++) {
    // Use a modulo operation to select a character from our set
    const randomIndex: number =
      randomBytes[i % randomBytes.length] % characters.length;
    code += characters.charAt(randomIndex);
  }

  // Split into chunks of 4 characters
  const chunks: string[] = [];
  for (let i = 0; i < code.length; i += 4) {
    chunks.push(code.slice(i, i + 4));
  }

  // Format with prefix
  return prefix ? `${prefix}-${chunks.join("-")}` : chunks.join("-");
}
