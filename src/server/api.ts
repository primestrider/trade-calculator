import type { StockSearchParams, Stock } from "@/models/stock";

export async function searchStock(
  params: StockSearchParams = {},
): Promise<Stock | null> {
  const searchParams = new URLSearchParams({
    Keywords: params.keywords ?? "",
    pageBegin: String(params.pageBegin ?? 1),
    pageLength: String(params.pageLength ?? 100),
    sortField: params.sortField ?? "Code",
    sortOrder: params.sortOrder ?? "ASC",
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/StockSearchResult/GetAll?${searchParams}`,
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
