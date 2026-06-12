export type StockQuote = {
  symbol: string;
  price: number | null;
  currency: string | null;
  change: number | null;
  changePercent: number | null;
  marketState: string | null;
  shortName: string | null;
};

export async function getStockQuote(
  symbol: string,
  signal?: AbortSignal
): Promise<StockQuote> {
  const response = await fetch(
    `/api/quote?symbol=${encodeURIComponent(symbol)}`,
    { signal }
  );

  const data = (await response.json()) as StockQuote & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to fetch stock quote");
  }

  return data;
}

export function formatStockPrice(
  price: number,
  currency: string | null = "IDR"
) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency === "IDR" || !currency ? "IDR" : currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatChangePercent(value: number) {
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${value > 0 ? "+" : ""}${formatted}%`;
}
