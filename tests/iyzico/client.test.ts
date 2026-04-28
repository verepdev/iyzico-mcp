import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { getConfig } from "../../src/iyzico/client";

const ENV_KEYS = ["IYZICO_API_KEY", "IYZICO_SECRET_KEY", "IYZICO_BASE_URL"] as const;

describe("getConfig (env validation)", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = original[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  test("throws when all env vars missing", () => {
    expect(() => getConfig()).toThrow(/Missing Iyzico credentials/);
  });

  test("throws and lists which env vars are missing", () => {
    process.env.IYZICO_API_KEY = "k";
    expect(() => getConfig()).toThrow(/IYZICO_SECRET_KEY/);
    expect(() => getConfig()).toThrow(/IYZICO_BASE_URL/);
  });

  test("throws even if base URL is missing (no default)", () => {
    process.env.IYZICO_API_KEY = "k";
    process.env.IYZICO_SECRET_KEY = "s";
    expect(() => getConfig()).toThrow(/IYZICO_BASE_URL/);
  });

  test("returns config when all env vars set", () => {
    process.env.IYZICO_API_KEY = "k";
    process.env.IYZICO_SECRET_KEY = "s";
    process.env.IYZICO_BASE_URL = "https://sandbox-api.iyzipay.com";
    const config = getConfig();
    expect(config.apiKey).toBe("k");
    expect(config.secretKey).toBe("s");
    expect(config.uri).toBe("https://sandbox-api.iyzipay.com");
  });
});
