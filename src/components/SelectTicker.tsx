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

    // Jika sudah memilih saham dan input menampilkan label,
    // jangan tampilkan dropdown lagi.
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

            // jika user mulai mengetik lagi,
            // hapus pilihan sebelumnya
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

          <div>
            <strong>Symbol:</strong> {activeTicker.symbol}
          </div>

          <div>
            <strong>Ticker:</strong> {activeTicker.ticker}
          </div>

          <div>
            <strong>Name:</strong> {activeTicker.name}
          </div>

          <pre className="mt-4 overflow-auto rounded bg-muted p-3 text-xs">
            {JSON.stringify(activeTicker, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
