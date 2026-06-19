import { useTradeStore } from "@/store/trade.store";

export function useRiskPerTrades() {
  const currentBalance = useTradeStore((state) => state.currentBalance);

  const riskLevels = useTradeStore((state) => state.riskLevels);

  return riskLevels.map((risk) => ({
    risk,
    amount: currentBalance * risk,
  }));
}
