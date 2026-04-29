import type { IyzicoResponse } from "iyzipay";
import { z } from "zod";
import { createClient, getConfig } from "../iyzico/client.js";
import { mapIyzicoFailure } from "../iyzico/error.js";

export const getBinInfoInputShape = {
  binNumber: z
    .string()
    .regex(/^\d{6,8}$/, "Expected 6-8 digit BIN")
    .describe("Bank Identification Number — first 6 to 8 digits of a card number."),
  locale: z.enum(["tr", "en"]).default("en").describe("Response language. Default 'en'."),
};

export const getBinInfoInputSchema = z.object(getBinInfoInputShape);
export type GetBinInfoInput = z.infer<typeof getBinInfoInputSchema>;

export async function getBinInfo(input: GetBinInfoInput): Promise<IyzicoResponse> {
  const config = getConfig();
  const client = createClient(config);

  return new Promise<IyzicoResponse>((resolve, reject) => {
    client.binNumber.retrieve(
      {
        locale: input.locale,
        conversationId: `mcp-get-bin-info-${input.binNumber}`,
        binNumber: input.binNumber,
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
