import { describe, expect, test } from "bun:test";
import { getBinInfoInputSchema } from "../../src/tools/get_bin_info";

describe("get_bin_info input schema", () => {
  test("accepts 6-digit BIN and applies locale default", () => {
    const result = getBinInfoInputSchema.parse({ binNumber: "528790" });
    expect(result.binNumber).toBe("528790");
    expect(result.locale).toBe("en");
  });

  test("accepts 8-digit BIN", () => {
    const result = getBinInfoInputSchema.parse({ binNumber: "55287900" });
    expect(result.binNumber).toBe("55287900");
  });

  test("accepts explicit locale", () => {
    const result = getBinInfoInputSchema.parse({ binNumber: "528790", locale: "tr" });
    expect(result.locale).toBe("tr");
  });

  test("rejects missing binNumber", () => {
    expect(() => getBinInfoInputSchema.parse({})).toThrow();
  });

  test("rejects too-short BIN (5 digits)", () => {
    expect(() => getBinInfoInputSchema.parse({ binNumber: "12345" })).toThrow();
  });

  test("rejects too-long BIN (9 digits)", () => {
    expect(() => getBinInfoInputSchema.parse({ binNumber: "123456789" })).toThrow();
  });

  test("rejects non-numeric BIN", () => {
    expect(() => getBinInfoInputSchema.parse({ binNumber: "abc123" })).toThrow();
  });

  test("rejects invalid locale", () => {
    expect(() => getBinInfoInputSchema.parse({ binNumber: "528790", locale: "de" })).toThrow();
  });
});
