import { describe, expect, test } from "bun:test";
import { getInstallmentInfoInputSchema } from "../../src/tools/get_installment_info";

describe("get_installment_info input schema", () => {
  test("accepts integer price string and applies locale default", () => {
    const result = getInstallmentInfoInputSchema.parse({
      binNumber: "528790",
      price: "1000",
    });
    expect(result.binNumber).toBe("528790");
    expect(result.price).toBe("1000");
    expect(result.locale).toBe("en");
  });

  test("accepts decimal price with two decimals", () => {
    const result = getInstallmentInfoInputSchema.parse({
      binNumber: "528790",
      price: "1000.50",
    });
    expect(result.price).toBe("1000.50");
  });

  test("accepts decimal price with one decimal", () => {
    const result = getInstallmentInfoInputSchema.parse({
      binNumber: "528790",
      price: "1.0",
    });
    expect(result.price).toBe("1.0");
  });

  test("rejects missing binNumber", () => {
    expect(() => getInstallmentInfoInputSchema.parse({ price: "100" })).toThrow();
  });

  test("rejects missing price", () => {
    expect(() => getInstallmentInfoInputSchema.parse({ binNumber: "528790" })).toThrow();
  });

  test("rejects invalid BIN format", () => {
    expect(() =>
      getInstallmentInfoInputSchema.parse({ binNumber: "12345", price: "100" }),
    ).toThrow();
  });

  test("rejects price with too many decimals", () => {
    expect(() =>
      getInstallmentInfoInputSchema.parse({ binNumber: "528790", price: "100.555" }),
    ).toThrow();
  });

  test("rejects non-numeric price", () => {
    expect(() =>
      getInstallmentInfoInputSchema.parse({ binNumber: "528790", price: "abc" }),
    ).toThrow();
  });

  test("rejects negative-sign price", () => {
    expect(() =>
      getInstallmentInfoInputSchema.parse({ binNumber: "528790", price: "-100" }),
    ).toThrow();
  });

  test("rejects invalid locale", () => {
    expect(() =>
      getInstallmentInfoInputSchema.parse({
        binNumber: "528790",
        price: "100",
        locale: "de",
      }),
    ).toThrow();
  });
});
