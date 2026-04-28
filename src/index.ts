#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getPayment, getPaymentInputShape } from "./tools/get_payment.js";
import { listPayments, listPaymentsInputShape } from "./tools/list_payments.js";

const server = new McpServer({
  name: "iyzico-mcp",
  version: "0.0.1",
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

const transport = new StdioServerTransport();
await server.connect(transport);
