import type { IyzicoResponse } from "iyzipay";
import { z } from "zod";
import { createClient, getConfig } from "../iyzico/client.js";
import { mapIyzicoFailure } from "../iyzico/error.js";

export const getSubscriptionInputShape = {
  subscriptionReferenceCode: z
    .string()
    .min(1)
    .describe(
      "Iyzico subscription reference code (returned at subscription creation, used as the subscription's permanent ID).",
    ),
  locale: z.enum(["tr", "en"]).default("en").describe("Response language. Default 'en'."),
};

export const getSubscriptionInputSchema = z.object(getSubscriptionInputShape);
export type GetSubscriptionInput = z.infer<typeof getSubscriptionInputSchema>;

export async function getSubscription(input: GetSubscriptionInput): Promise<IyzicoResponse> {
  const config = getConfig();
  const client = createClient(config);

  return new Promise<IyzicoResponse>((resolve, reject) => {
    client.subscription.retrieve(
      {
        locale: input.locale,
        conversationId: `mcp-get-subscription-${input.subscriptionReferenceCode}`,
        subscriptionReferenceCode: input.subscriptionReferenceCode,
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
