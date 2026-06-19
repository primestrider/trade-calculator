"use client";

import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

import indonesiaStocks from "../assets/indonesia_stocks.json";

// import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { searchStock } from "@/server/api";

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
          stock.name.toLowerCase().includes(q),
      )
      .slice(0, 50);
  }, [query, activeTicker]);

  const {
    data: stock,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["stocks", activeTicker?.symbol],

    enabled: !!activeTicker?.symbol,

    queryFn: () =>
      searchStock({
        keywords: activeTicker!.ticker,
      }),
  });

  return (
    <div className="space-y-4">
      <Combobox
        items={filteredStocks}
        value={activeTicker?.symbol ?? ""}
        onValueChange={(value) => {
          const stock =
            listIndonesiaStocks.find((s) => s.symbol === value) ?? null;

          setActiveTicker(stock);

          if (stock) {
            setQuery(formatStockLabel(stock));
          }
        }}
      >
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
              <ComboboxItem key={item.symbol} value={item.symbol}>
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

          <div className="mt-4 rounded-lg bg-muted p-4">
            <div className="text-xs font-medium text-muted-foreground">
              Stock Information
            </div>

            {isLoading && (
              <p className="mt-2 text-sm text-muted-foreground">
                Loading stock data...
              </p>
            )}

            {isError && (
              <p className="mt-2 text-sm text-destructive">
                {(error as Error).message}
              </p>
            )}

            {!isLoading && !isError && !stock && (
              <p className="mt-2 text-sm text-muted-foreground">
                Stock data not found.
              </p>
            )}

            {stock && (
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <strong>Code:</strong> {stock.code}
                </div>

                <div>
                  <strong>Company:</strong> {stock.name}
                </div>

                <div>
                  <strong>Price:</strong> {stock.last.toLocaleString("id-ID")}
                </div>

                <div>
                  <strong>PER:</strong> {stock.per.toFixed(2)}
                </div>

                <div>
                  <strong>PBR:</strong> {stock.pbr.toFixed(2)}
                </div>

                <div>
                  <strong>ROE:</strong> {(stock.roe * 100).toFixed(2)}%
                </div>

                <div>
                  <strong>Market Cap:</strong>{" "}
                  {stock.capitalization.toLocaleString("id-ID")}
                </div>

                <div>
                  <strong>1 Year Return:</strong>{" "}
                  {(stock.oneYear * 100).toFixed(2)}%
                </div>

                <div>
                  <strong>YTD:</strong> {(stock.ytd * 100).toFixed(2)}%
                </div>

                {isFetching && (
                  <p className="text-xs text-muted-foreground">Refreshing...</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
