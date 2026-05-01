import { describe, expect, test } from "bun:test";
import { getSubscriptionInputSchema } from "../../src/tools/get_subscription";

describe("get_subscription input schema", () => {
  test("accepts valid reference code and applies locale default", () => {
    const result = getSubscriptionInputSchema.parse({
      subscriptionReferenceCode: "SUB-REF-12345",
    });
    expect(result.subscriptionReferenceCode).toBe("SUB-REF-12345");
    expect(result.locale).toBe("en");
  });

  test("accepts explicit locale", () => {
    const result = getSubscriptionInputSchema.parse({
      subscriptionReferenceCode: "SUB-REF-12345",
      locale: "tr",
    });
    expect(result.locale).toBe("tr");
  });

  test("rejects missing subscriptionReferenceCode", () => {
    expect(() => getSubscriptionInputSchema.parse({})).toThrow();
  });

  test("rejects empty subscriptionReferenceCode", () => {
    expect(() => getSubscriptionInputSchema.parse({ subscriptionReferenceCode: "" })).toThrow();
  });

  test("rejects invalid locale", () => {
    expect(() =>
      getSubscriptionInputSchema.parse({
        subscriptionReferenceCode: "SUB-REF-12345",
        locale: "de",
      }),
    ).toThrow();
  });
});
