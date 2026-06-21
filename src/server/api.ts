import type { StockSearchParams, Stock } from "@/models/stock";

export async function searchStock(
  params: StockSearchParams = {},
): Promise<Stock | null> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/stock/${params.keywords}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks (${response.status})`);
  }

  const stocks: Stock[] = await response.json();

  return stocks[0] ?? null;
}
