#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getBinInfo, getBinInfoInputShape } from "./tools/get_bin_info.js";
import { getInstallmentInfo, getInstallmentInfoInputShape } from "./tools/get_installment_info.js";
import { getPayment, getPaymentInputShape } from "./tools/get_payment.js";
import { listPayments, listPaymentsInputShape } from "./tools/list_payments.js";

const server = new McpServer({
  name: "iyzico-mcp",
  version: "0.0.2",
});

server.tool(
  "get_payment",
  "Retrieve an Iyzico payment by its payment ID and merchant conversation ID. Returns the full payment object (card masked by Iyzico).",
  getPaymentInputShape,
  async (input) => {
    const result = await getPayment(input);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "list_payments",
  "List Iyzico payments for a single date (YYYY-MM-DD). Iyzico's reporting API queries one day at a time and returns paginated results.",
  listPaymentsInputShape,
  async (input) => {
    const result = await listPayments(input);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "get_bin_info",
  "Look up bank/card metadata (issuer bank, card brand, card type, prepaid/credit/debit) for a 6-8 digit BIN — the leading digits of any card number.",
  getBinInfoInputShape,
  async (input) => {
    const result = await getBinInfo(input);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.tool(
  "get_installment_info",
  "List installment options Iyzico will allow for a given card BIN at a given price. Returns the installment schedule (1, 2, 3, 6, 9, 12 months) with per-installment pricing.",
  getInstallmentInfoInputShape,
  async (input) => {
    const result = await getInstallmentInfo(input);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
