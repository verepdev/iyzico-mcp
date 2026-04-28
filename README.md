# iyzico-mcp

> MCP server for Iyzico (Turkish payment processor) — read-mostly access for Claude / Cursor / cline.

**v0.0.1** — read tools: `get_payment`, `list_payments`. Not yet published to npm; install from source.

## Tools

### `get_payment`

Retrieve an Iyzico payment by its payment ID and merchant conversation ID. Returns the full Iyzico payment object as JSON (card details masked by Iyzico).

**Input:**

| field | type | required | notes |
|---|---|---|---|
| `paymentId` | string | yes | Iyzico payment ID returned at payment creation. |
| `paymentConversationId` | string | yes | Merchant-side conversation ID set at payment creation. |
| `locale` | `"tr"` \| `"en"` | no | Response language. Default `"en"`. |

### `list_payments`

List Iyzico payments for a single date. Iyzico's reporting API queries one day at a time and returns paginated results — to scan a range, the client calls this tool once per day.

**Input:**

| field | type | required | notes |
|---|---|---|---|
| `transactionDate` | string | yes | YYYY-MM-DD. The single day to query. |
| `page` | int (≥1) | no | 1-based page number. Iyzico applies its own default if omitted. |
| `locale` | `"tr"` \| `"en"` | no | Response language. Default `"en"`. |

## Setup

### Install from source

```bash
git clone https://github.com/verepdev/iyzico-mcp
cd iyzico-mcp
bun install
bun run build
```

### Environment

Required:

- `IYZICO_API_KEY` — Iyzico API key.
- `IYZICO_SECRET_KEY` — Iyzico API secret.
- `IYZICO_BASE_URL` — `https://sandbox-api.iyzipay.com` (sandbox) or `https://api.iyzipay.com` (production). **No default** — set explicitly to avoid accidental production hits.

### Claude Desktop config

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "iyzico": {
      "command": "node",
      "args": ["/absolute/path/to/iyzico-mcp/dist/index.js"],
      "env": {
        "IYZICO_API_KEY": "sandbox-...",
        "IYZICO_SECRET_KEY": "sandbox-...",
        "IYZICO_BASE_URL": "https://sandbox-api.iyzipay.com"
      }
    }
  }
}
```

Restart Claude Desktop.

Other MCP clients (Cursor, cline) follow the same pattern with their own config formats.

## Local development

```bash
bun install
bun test          # unit tests
bun run lint      # Biome lint+format check
bun run format    # auto-format
bun run build     # build to dist/

# MCP Inspector — interactive UI for testing the server
npx @modelcontextprotocol/inspector node dist/index.js
```

## License

[MIT](LICENSE) — by [@verepdev](https://github.com/verepdev).
