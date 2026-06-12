"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

import indonesiaStocks from "../assets/indonesia_stocks.json";
import {
  formatChangePercent,
  formatStockPrice,
  getStockQuote,
  type StockQuote,
} from "@/lib/stock-quote";
import { cn } from "@/lib/utils";

type IndonesiaStock = {
  symbol: string;
  ticker: string;
  name: string;
};

const listIndonesiaStocks = indonesiaStocks as IndonesiaStock[];

const formatStockLabel = (stock: IndonesiaStock) =>
  `${stock.symbol} (${stock.name})`;

export function SelectTicker() {
  const [query, setQuery] = useState("");
  const [activeTicker, setActiveTicker] = useState<IndonesiaStock | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const filteredStocks = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (activeTicker && query === formatStockLabel(activeTicker)) {
      return [];
    }

    if (!q) {
      return [];
    }

    return listIndonesiaStocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(q) ||
          stock.ticker.toLowerCase().includes(q) ||
          stock.name.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [query, activeTicker]);

  useEffect(() => {
    if (!activeTicker) {
      setQuote(null);
      setQuoteError(null);
      setQuoteLoading(false);
      return;
    }

    const controller = new AbortController();
    const ticker = activeTicker.ticker;

    async function loadQuote() {
      setQuoteLoading(true);
      setQuoteError(null);

      try {
        const data = await getStockQuote(ticker, controller.signal);

        if (!controller.signal.aborted) {
          setQuote(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setQuote(null);
          setQuoteError(
            error instanceof Error ? error.message : "Failed to fetch price"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setQuoteLoading(false);
        }
      }
    }

    void loadQuote();

    return () => controller.abort();
  }, [activeTicker]);

  return (
    <div className="space-y-4">
      <Combobox
        items={filteredStocks}
        value={activeTicker?.ticker ?? ""}
        onValueChange={(value) => {
          const stock =
            listIndonesiaStocks.find((s) => s.ticker === value) ?? null;

          setActiveTicker(stock);

          if (stock) {
            setQuery(formatStockLabel(stock));
          }
        }}>
        <ComboboxInput
          placeholder="Search ticker..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;

            setQuery(value);

            if (activeTicker && value !== formatStockLabel(activeTicker)) {
              setActiveTicker(null);
            }
          }}
        />

        <ComboboxContent>
          <ComboboxEmpty>
            {query
              ? "No ticker found."
              : "Type a ticker or company name to search."}
          </ComboboxEmpty>

          <ComboboxList>
            {(item: IndonesiaStock) => (
              <ComboboxItem key={item.ticker} value={item.ticker}>
                <div className="flex flex-col">
                  <span className="font-medium">{item.symbol}</span>

                  <span className="text-xs text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {activeTicker && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold">Selected Stock</h3>

          <div className="space-y-1 text-sm">
            <div>
              <strong>Symbol:</strong> {activeTicker.symbol}
            </div>

            <div>
              <strong>Ticker:</strong> {activeTicker.ticker}
            </div>

            <div>
              <strong>Name:</strong> {activeTicker.name}
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-3">
            <div className="text-xs font-medium text-muted-foreground">
              Market Price
            </div>

            {quoteLoading && (
              <p className="mt-1 text-sm text-muted-foreground">
                Loading price...
              </p>
            )}

            {quoteError && (
              <p className="mt-1 text-sm text-destructive">{quoteError}</p>
            )}

            {!quoteLoading && !quoteError && quote?.price != null && (
              <div className="mt-1 flex flex-wrap items-end gap-2">
                <span className="text-2xl font-semibold">
                  {formatStockPrice(quote.price, quote.currency)}
                </span>

                {quote.changePercent != null && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      quote.changePercent > 0
                        ? "text-green-500"
                        : quote.changePercent < 0
                          ? "text-red-500"
                          : "text-muted-foreground"
                    )}>
                    {formatChangePercent(quote.changePercent)}
                  </span>
                )}
              </div>
            )}

            {!quoteLoading && !quoteError && quote?.price == null && (
              <p className="mt-1 text-sm text-muted-foreground">
                Price unavailable.
              </p>
            )}

            {quote?.marketState && !quoteLoading && (
              <p className="mt-2 text-xs text-muted-foreground">
                Market: {quote.marketState}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
