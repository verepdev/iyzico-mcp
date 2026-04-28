import type { IyzicoResponse } from "iyzipay";
import { z } from "zod";
import { createClient, getConfig } from "../iyzico/client.js";

export const getPaymentInputShape = {
  paymentId: z.string().min(1).describe("Iyzico payment ID returned at payment creation."),
  paymentConversationId: z
    .string()
    .min(1)
    .describe("Merchant-side conversation ID set at payment creation."),
  locale: z.enum(["tr", "en"]).default("en").describe("Response language. Default 'en'."),
};

export const getPaymentInputSchema = z.object(getPaymentInputShape);
export type GetPaymentInput = z.infer<typeof getPaymentInputSchema>;

export async function getPayment(input: GetPaymentInput): Promise<IyzicoResponse> {
  const config = getConfig();
  const client = createClient(config);

  return new Promise<IyzicoResponse>((resolve, reject) => {
    client.payment.retrieve(
      {
        locale: input.locale,
        conversationId: input.paymentConversationId,
        paymentId: input.paymentId,
        paymentConversationId: input.paymentConversationId,
      },
      (err, result) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
          return;
        }
        if (
          result &&
          typeof result === "object" &&
          "status" in result &&
          (result as { status?: string }).status === "failure"
        ) {
          const r = result as {
            errorCode?: string;
            errorMessage?: string;
          };
          reject(
            new Error(
              `Iyzico API error ${r.errorCode ?? "unknown"}: ${r.errorMessage ?? "no message"}`,
            ),
          );
          return;
        }
        resolve(result);
      },
    );
  });
}
