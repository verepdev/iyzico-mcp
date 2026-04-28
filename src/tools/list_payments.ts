import type { IyzicoResponse } from "iyzipay";
import { z } from "zod";
import { createClient, getConfig } from "../iyzico/client.js";

export const listPaymentsInputShape = {
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
    .describe(
      "Date for transactions to list (YYYY-MM-DD). Iyzico's reporting API queries one day at a time; for a range, call once per day.",
    ),
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("1-based page number for pagination. Iyzico applies its own default if omitted."),
  locale: z.enum(["tr", "en"]).default("en").describe("Response language. Default 'en'."),
};

export const listPaymentsInputSchema = z.object(listPaymentsInputShape);
export type ListPaymentsInput = z.infer<typeof listPaymentsInputSchema>;

export async function listPayments(input: ListPaymentsInput): Promise<IyzicoResponse> {
  const config = getConfig();
  const client = createClient(config);

  return new Promise<IyzicoResponse>((resolve, reject) => {
    client.reportingTransactions.retrieve(
      {
        locale: input.locale,
        conversationId: `mcp-list-payments-${input.transactionDate}-${input.page ?? 1}`,
        transactionDate: input.transactionDate,
        page: input.page,
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
          const r = result as { errorCode?: string; errorMessage?: string };
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
