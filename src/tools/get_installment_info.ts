import type { IyzicoResponse } from "iyzipay";
import { z } from "zod";
import { createClient, getConfig } from "../iyzico/client.js";
import { mapIyzicoFailure } from "../iyzico/error.js";

export const getInstallmentInfoInputShape = {
  binNumber: z
    .string()
    .regex(/^\d{6,8}$/, "Expected 6-8 digit BIN")
    .describe("Bank Identification Number — first 6 to 8 digits of the card."),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Decimal string e.g. '1000' or '1000.50'")
    .describe("Total purchase price as a decimal string (Iyzico expects string, not number)."),
  locale: z.enum(["tr", "en"]).default("en").describe("Response language. Default 'en'."),
};

export const getInstallmentInfoInputSchema = z.object(getInstallmentInfoInputShape);
export type GetInstallmentInfoInput = z.infer<typeof getInstallmentInfoInputSchema>;

export async function getInstallmentInfo(input: GetInstallmentInfoInput): Promise<IyzicoResponse> {
  const config = getConfig();
  const client = createClient(config);

  return new Promise<IyzicoResponse>((resolve, reject) => {
    client.installmentInfo.retrieve(
      {
        locale: input.locale,
        conversationId: `mcp-get-installment-info-${input.binNumber}-${input.price}`,
        binNumber: input.binNumber,
        price: input.price,
      },
      (err, result) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
          return;
        }
        const failure = mapIyzicoFailure(result);
        if (failure) {
          reject(failure);
          return;
        }
        resolve(result);
      },
    );
  });
}
