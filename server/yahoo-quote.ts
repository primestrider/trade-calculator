import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

export type StockQuoteResult = {
  symbol: string;
  price: number | null;
  currency: string | null;
  change: number | null;
  changePercent: number | null;
  marketState: string | null;
  shortName: string | null;
};

export async function fetchStockQuote(
  symbol: string
): Promise<StockQuoteResult> {
  const quote = await yahooFinance.quote(symbol, {
    fields: [
      "symbol",
      "regularMarketPrice",
      "currency",
      "regularMarketChange",
      "regularMarketChangePercent",
      "marketState",
      "shortName",
    ],
  });

  const data = Array.isArray(quote) ? quote[0] : quote;

  if (!data) {
    throw new Error(`No quote data found for ${symbol}`);
  }

  return {
    symbol: data.symbol,
    price: data.regularMarketPrice ?? null,
    currency: data.currency ?? null,
    change: data.regularMarketChange ?? null,
    changePercent: data.regularMarketChangePercent ?? null,
    marketState: data.marketState ?? null,
    shortName: data.shortName ?? null,
  };
}
