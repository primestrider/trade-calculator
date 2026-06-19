import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock, LockOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { formatRupiah } from "@/lib/currency";
import { cn, formatPercentage } from "@/lib/utils";
import { useTradeStore } from "@/store/trade.store";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CurrencyInput } from "./CurrencyInput";

type BalanceInputProps = {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
};

export function BalanceInput({
  placeholder = "0",
  disabled = false,
  className,
  min = 0,
  max,
}: Readonly<BalanceInputProps>) {
  const currentBalance = useTradeStore((state) => state.currentBalance);
  const totalBalance = useTradeStore((state) => state.totalBalance);
  const isTotalLocked = useTradeStore((state) => state.isTotalLocked);
  const setCurrentBalance = useTradeStore((state) => state.setCurrentBalance);
  const setTotalBalance = useTradeStore((state) => state.setTotalBalance);
  const toggleTotalLock = useTradeStore((state) => state.toggleTotalLock);
  const syncCurrentToTotal = useTradeStore((state) => state.syncCurrentToTotal);
  const syncTotalToCurrent = useTradeStore((state) => state.syncTotalToCurrent);

  const [maxRisk] = useState<number>(0.02);

  const riskLevels = [0.02, 0.015, 0.01];

  const riskPerTrades = riskLevels.map((risk) => ({
    risk,
    amount: currentBalance * risk,
  }));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CurrencyInput
          id="current-balance"
          label="Current Balance"
          value={currentBalance}
          onValueChange={setCurrentBalance}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          endAddon={
            <Button
              className="mr-1"
              type="button"
              variant="outline"
              size="xs"
              disabled={disabled}
              onClick={syncTotalToCurrent}>
              <ArrowRight data-icon="inline-start" />
              To Total
            </Button>
          }
        />

        <CurrencyInput
          id="total-balance"
          label="Total Balance"
          value={totalBalance}
          onValueChange={setTotalBalance}
          placeholder={placeholder}
          disabled={disabled || isTotalLocked}
          min={min}
          max={max}
          endAddon={
            <InputGroupAddon align="inline-end" className="pr-1">
              <InputGroupButton
                type="button"
                variant="outline"
                size="xs"
                disabled={disabled || isTotalLocked}
                title={
                  isTotalLocked ? "Unlock total balance to sync" : undefined
                }
                onClick={syncCurrentToTotal}>
                <ArrowLeft data-icon="inline-start" />
                To Current
              </InputGroupButton>
              <InputGroupButton
                className="mr-1"
                type="button"
                size="icon-xs"
                variant={isTotalLocked ? "secondary" : "ghost"}
                disabled={disabled}
                aria-label={
                  isTotalLocked ? "Unlock total balance" : "Lock total balance"
                }
                aria-pressed={isTotalLocked}
                onClick={toggleTotalLock}>
                {isTotalLocked ? <Lock /> : <LockOpen />}
              </InputGroupButton>
            </InputGroupAddon>
          }
        />
      </div>

      {/* RISK PER TRADE */}

      {currentBalance > 0 && (
        <Card>
          <CardContent>
            {" "}
            <CardTitle className="flex flex-wrap items-center space-x-2">
              <h2 className="text-sm font-bold">Risk per Trade</h2>
              <Badge className="text-xs" variant="destructive">
                Max Risk {formatPercentage(maxRisk)}
              </Badge>
            </CardTitle>
            <div className="space-y-1">
              {riskPerTrades.map((item) => (
                <div
                  key={item.risk}
                  className="flex items-center justify-between text-sm">
                  <span>{formatPercentage(item.risk)}</span>
                  <span className="font-semibold">
                    {formatRupiah(item.amount, true)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
