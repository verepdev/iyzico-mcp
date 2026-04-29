import { describe, expect, test } from "bun:test";
import { mapIyzicoFailure } from "../../src/iyzico/error";

describe("mapIyzicoFailure", () => {
  test("returns null for null/undefined input", () => {
    expect(mapIyzicoFailure(null)).toBeNull();
    expect(mapIyzicoFailure(undefined)).toBeNull();
  });

  test("returns null for non-object input", () => {
    expect(mapIyzicoFailure("string")).toBeNull();
    expect(mapIyzicoFailure(42)).toBeNull();
  });

  test("returns null for object without errorCode", () => {
    expect(mapIyzicoFailure({ status: "success", paymentId: "123" })).toBeNull();
  });

  test("returns null when errorCode is null/undefined", () => {
    expect(mapIyzicoFailure({ errorCode: null })).toBeNull();
    expect(mapIyzicoFailure({ errorCode: undefined })).toBeNull();
  });

  test("returns Error with code and message when errorCode present", () => {
    const err = mapIyzicoFailure({
      errorCode: "1001",
      errorMessage: "api credentials are not found",
    });
    expect(err).toBeInstanceOf(Error);
    expect(err?.message).toBe("Iyzico API error 1001: api credentials are not found");
  });

  test("falls back to 'no message' when errorMessage missing", () => {
    const err = mapIyzicoFailure({ errorCode: "5" });
    expect(err?.message).toBe("Iyzico API error 5: no message");
  });

  test("works with numeric status field present (reportingTransactions style)", () => {
    const err = mapIyzicoFailure({
      status: 401,
      errorCode: "5",
      errorMessage: "Authentication failed!",
    });
    expect(err?.message).toBe("Iyzico API error 5: Authentication failed!");
  });

  test("works with string 'failure' status (payment.retrieve style)", () => {
    const err = mapIyzicoFailure({
      status: "failure",
      errorCode: "1001",
      errorMessage: "api credentials are not found",
    });
    expect(err?.message).toBe("Iyzico API error 1001: api credentials are not found");
  });
});
