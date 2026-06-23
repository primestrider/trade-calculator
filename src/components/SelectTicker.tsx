"use client";

import { act, useMemo, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

import { useQuery } from "@tanstack/react-query";
import { listStock } from "@/server/api";
import type { Stock } from "@/models/stock";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDateTime } from "@/lib/date";
import { Badge } from "./ui/badge";

const formatStockLabel = (stock: Stock) => `${stock.Code} (${stock.Name})`;

type StatBoxProps = {
  label: string;
  value: React.ReactNode;
};

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>

      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

export function SelectTicker() {
  const [query, setQuery] = useState("");
  const [activeTicker, setActiveTicker] = useState<Stock | null>(null);

  const {
    data: stocks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stocks_list"],
    queryFn: listStock,
    staleTime: 5 * 100 * 1000,
  });

  const emptyMessage = (() => {
    if (isLoading) {
      return "Loading stocks...";
    }

    if (query) {
      return "No ticker found.";
    }

    return "Type a ticker or company name to search.";
  })();

  const filteredStocks = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (activeTicker && query === formatStockLabel(activeTicker)) {
      return [];
    }

    if (!q) {
      return [];
    }

    return stocks
      .filter(
        (stock) =>
          stock.Code.toLowerCase().includes(q) ||
          stock.Name.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [stocks, query, activeTicker]);

  const formatNumber = (value: number | null | undefined) =>
    value == null ? "-" : value.toLocaleString("id-ID");

  const formatPercent = (value: number | null | undefined) =>
    value == null ? "-" : `${(value * 100).toFixed(2)}%`;

  const getReturnVariant = (value: number) =>
    value >= 0 ? "default" : "destructive";

  return (
    <div className="space-y-4">
      <Combobox
        items={filteredStocks}
        value={activeTicker?.Code ?? ""}
        onValueChange={(value) => {
          const stock = stocks.find((s) => s.Code === value) ?? null;

          setActiveTicker(stock);

          if (stock) {
            setQuery(formatStockLabel(stock));
          }
        }}>
        <div className="relative">
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
        </div>

        <ComboboxContent>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

          <ComboboxList>
            {(item: Stock) => (
              <ComboboxItem key={item.Code} value={item.Code}>
                <div className="flex flex-col">
                  <span className="font-medium">{item.Code}</span>

                  <span className="text-xs text-muted-foreground">
                    {item.Name}
                  </span>
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {isError && (
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      )}

      {activeTicker && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-2xl">
                    {activeTicker.Code}
                  </CardTitle>

                  <Badge variant="secondary">
                    {activeTicker.NewSectorName}
                  </Badge>
                </div>

                <CardDescription className="mt-1">
                  {activeTicker.Name}
                </CardDescription>
              </div>

              <div className="text-left md:text-right">
                <div className="text-3xl font-bold">
                  {activeTicker.Last.toLocaleString("id-ID")}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  Last Update: {formatDateTime(activeTicker.LastUpdate)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Returns */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={activeTicker.OneDay >= 0 ? "default" : "destructive"}>
                1D {(activeTicker.OneDay * 100).toFixed(2)}%
              </Badge>

              <Badge
                variant={activeTicker.OneWeek >= 0 ? "default" : "destructive"}>
                1W {(activeTicker.OneWeek * 100).toFixed(2)}%
              </Badge>

              <Badge
                variant={
                  activeTicker.OneMonth >= 0 ? "default" : "destructive"
                }>
                1M {(activeTicker.OneMonth * 100).toFixed(2)}%
              </Badge>

              <Badge
                variant={activeTicker.Ytd >= 0 ? "default" : "destructive"}>
                YTD {(activeTicker.Ytd * 100).toFixed(2)}%
              </Badge>
            </div>

            {/* Price Information */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Price Information
              </h3>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <StatBox
                  label="Open"
                  value={activeTicker.AdjustedOpenPrice.toLocaleString("id-ID")}
                />

                <StatBox
                  label="High"
                  value={
                    <span className="text-green-500">
                      {activeTicker.AdjustedHighPrice.toLocaleString("id-ID")}
                    </span>
                  }
                />

                <StatBox
                  label="Low"
                  value={
                    <span className="text-red-500">
                      {activeTicker.AdjustedLowPrice.toLocaleString("id-ID")}
                    </span>
                  }
                />

                <StatBox
                  label="Close"
                  value={activeTicker.AdjustedClosingPrice.toLocaleString(
                    "id-ID"
                  )}
                />
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Statistics
              </h3>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <StatBox
                  label="Volume"
                  value={activeTicker.Volume.toLocaleString("id-ID")}
                />

                <StatBox
                  label="Frequency"
                  value={activeTicker.Frequency.toLocaleString("id-ID")}
                />

                <StatBox
                  label="Value"
                  value={activeTicker.Value.toLocaleString("id-ID")}
                />

                <StatBox
                  label="Market Cap"
                  value={activeTicker.Capitalization?.toLocaleString("id-ID")}
                />
              </div>
            </div>

            {/* Fundamentals */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Fundamentals
              </h3>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <StatBox label="PER" value={activeTicker.Per?.toFixed(2)} />

                <StatBox label="PBR" value={activeTicker.Pbr?.toFixed(2)} />

                <StatBox
                  label="ROE"
                  value={`${(activeTicker.Roe ?? 0 * 100).toFixed(2)}%`}
                />

                <StatBox
                  label="Free Float"
                  value={`${activeTicker.FreeFloatPct?.toFixed(2)}%`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
