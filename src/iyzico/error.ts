export function mapIyzicoFailure(result: unknown): Error | null {
  if (
    !result ||
    typeof result !== "object" ||
    !("errorCode" in result) ||
    (result as { errorCode?: unknown }).errorCode == null
  ) {
    return null;
  }
  const r = result as { errorCode?: string; errorMessage?: string };
  return new Error(`Iyzico API error ${r.errorCode}: ${r.errorMessage ?? "no message"}`);
}
