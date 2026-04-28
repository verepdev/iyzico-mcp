import { describe, expect, test } from "bun:test";
import { getPaymentInputSchema } from "../../src/tools/get_payment";

describe("get_payment input schema", () => {
  test("accepts minimal valid input and applies locale default", () => {
    const result = getPaymentInputSchema.parse({
      paymentId: "12345",
      paymentConversationId: "abc-123",
    });
    expect(result.paymentId).toBe("12345");
    expect(result.paymentConversationId).toBe("abc-123");
    expect(result.locale).toBe("en");
  });

  test("accepts explicit locale", () => {
    const result = getPaymentInputSchema.parse({
      paymentId: "12345",
      paymentConversationId: "abc-123",
      locale: "tr",
    });
    expect(result.locale).toBe("tr");
  });

  test("rejects missing paymentId", () => {
    expect(() => getPaymentInputSchema.parse({ paymentConversationId: "abc" })).toThrow();
  });

  test("rejects empty paymentId", () => {
    expect(() =>
      getPaymentInputSchema.parse({
        paymentId: "",
        paymentConversationId: "abc",
      }),
    ).toThrow();
  });

  test("rejects missing paymentConversationId", () => {
    expect(() => getPaymentInputSchema.parse({ paymentId: "12345" })).toThrow();
  });

  test("rejects invalid locale", () => {
    expect(() =>
      getPaymentInputSchema.parse({
        paymentId: "12345",
        paymentConversationId: "abc",
        locale: "de",
      }),
    ).toThrow();
  });
});
