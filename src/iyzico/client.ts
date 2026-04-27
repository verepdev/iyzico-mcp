import Iyzipay, { type IyzipayConfig } from "iyzipay";

const REQUIRED_ENV = ["IYZICO_API_KEY", "IYZICO_SECRET_KEY", "IYZICO_BASE_URL"] as const;

export function getConfig(): IyzipayConfig {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing Iyzico credentials: ${missing.join(", ")}. Set IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL (no default base URL — set sandbox or production explicitly).`,
    );
  }
  return {
    apiKey: process.env.IYZICO_API_KEY as string,
    secretKey: process.env.IYZICO_SECRET_KEY as string,
    uri: process.env.IYZICO_BASE_URL as string,
  };
}

export function createClient(config: IyzipayConfig): Iyzipay {
  return new Iyzipay(config);
}
