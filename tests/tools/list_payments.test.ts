import { describe, expect, test } from "bun:test";
import { listPaymentsInputSchema } from "../../src/tools/list_payments";

describe("list_payments input schema", () => {
  test("accepts minimal valid input and applies locale default", () => {
    const result = listPaymentsInputSchema.parse({
      transactionDate: "2026-04-28",
    });
    expect(result.transactionDate).toBe("2026-04-28");
    expect(result.locale).toBe("en");
    expect(result.page).toBeUndefined();
  });

  test("accepts explicit page and locale", () => {
    const result = listPaymentsInputSchema.parse({
      transactionDate: "2026-04-28",
      page: 3,
      locale: "tr",
    });
    expect(result.page).toBe(3);
    expect(result.locale).toBe("tr");
  });

  test("rejects missing transactionDate", () => {
    expect(() => listPaymentsInputSchema.parse({})).toThrow();
  });

  test("rejects malformed transactionDate (not YYYY-MM-DD)", () => {
    expect(() => listPaymentsInputSchema.parse({ transactionDate: "28-04-2026" })).toThrow();
    expect(() => listPaymentsInputSchema.parse({ transactionDate: "2026/04/28" })).toThrow();
    expect(() => listPaymentsInputSchema.parse({ transactionDate: "2026-4-28" })).toThrow();
  });

  test("rejects non-positive page", () => {
    expect(() =>
      listPaymentsInputSchema.parse({ transactionDate: "2026-04-28", page: 0 }),
    ).toThrow();
    expect(() =>
      listPaymentsInputSchema.parse({ transactionDate: "2026-04-28", page: -1 }),
    ).toThrow();
  });

  test("rejects non-integer page", () => {
    expect(() =>
      listPaymentsInputSchema.parse({ transactionDate: "2026-04-28", page: 1.5 }),
    ).toThrow();
  });

  test("rejects invalid locale", () => {
    expect(() =>
      listPaymentsInputSchema.parse({ transactionDate: "2026-04-28", locale: "de" }),
    ).toThrow();
  });
});
