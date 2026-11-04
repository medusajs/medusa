import { generateCode } from "../code-generator";

const CODE_CHARACTERS = "[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]";

const stripCode = (code: string, prefix: string) =>
  code.slice(prefix.length + 1).replace(/-/g, "");

describe("generateCode", () => {
  it("formats the code as the prefix followed by sections of 4 characters", () => {
    const code = generateCode("GIFT", 4);

    expect(code).toMatch(new RegExp(`^GIFT(-${CODE_CHARACTERS}{4}){4}$`));
  });

  it("omits the prefix when an empty prefix is given", () => {
    const code = generateCode("", 2);

    expect(code).toMatch(
      new RegExp(`^${CODE_CHARACTERS}{4}-${CODE_CHARACTERS}{4}$`)
    );
  });

  it.each([
    { prefix: "GIFT", sections: 4 },
    { prefix: "SC", sections: 4 },
    { prefix: "GIFT", sections: 8 },
  ])(
    "doesn't repeat the leading characters at the end of a $sections-section code",
    ({ prefix, sections }) => {
      const length = sections * 4;
      const usedBytes = Math.ceil((length * 5) / 8);
      const repeatedLength = length - usedBytes;

      for (let i = 0; i < 100; i++) {
        const characters = stripCode(generateCode(prefix, sections), prefix);

        expect(characters).toHaveLength(length);
        expect(characters.slice(usedBytes)).not.toEqual(
          characters.slice(0, repeatedLength)
        );
      }
    }
  );
});
