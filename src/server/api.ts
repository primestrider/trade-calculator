import type { StockSearchParams, Stock, Sector } from "@/models/stock";

export async function searchStock(
  params: StockSearchParams = {}
): Promise<Stock | null> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/stock/${params.keywords}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks (${response.status})`);
  }

  const stocks: Stock[] = await response.json();

  return stocks[0] ?? null;
}

export async function listStock(): Promise<Stock[]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/stock/list`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks (${response.status})`);
  }

  const stocks: Stock[] = await response.json();

  return stocks;
}

export async function listSector(): Promise<Sector[] | null> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/sectors/list`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch sectors (${response.status})`);
  }

  const sectors: Sector[] = await response.json();

  return sectors;
}
