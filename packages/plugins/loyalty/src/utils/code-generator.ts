import crypto from "crypto";

export function generateCode(
  prefix: string = "GIFT",
  sections: number = 4
): string {
  // Characters to use (excluding similar-looking characters like 0/O, 1/I)
  const characters: string = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const length: number = sections * 4;

  // Generate one random byte per character. 256 is a multiple of the
  // character set size (32), so the modulo below introduces no bias.
  const randomBytes: Buffer = crypto.randomBytes(length);

  // Generate the code
  let code: string = "";
  for (let i = 0; i < length; i++) {
    // Use a modulo operation to select a character from our set
    const randomIndex: number = randomBytes[i] % characters.length;
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
