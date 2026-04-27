#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "iyzico-mcp",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
