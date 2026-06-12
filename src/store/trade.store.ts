import { create } from "zustand";
import { persist } from "zustand/middleware";

type TradeState = {
  currentBalance: number;
  totalBalance: number;
  isTotalLocked: boolean;
  setCurrentBalance: (balance: number) => void;
  setTotalBalance: (balance: number) => void;
  toggleTotalLock: () => void;
  syncCurrentToTotal: () => void;
  syncTotalToCurrent: () => void;
};

type PersistedTradeState = Pick<
  TradeState,
  "currentBalance" | "totalBalance" | "isTotalLocked"
>;

export const useTradeStore = create<TradeState>()(
  persist(
    (set) => ({
      currentBalance: 0,
      totalBalance: 0,
      isTotalLocked: false,
      setCurrentBalance: (currentBalance) => set({ currentBalance }),
      setTotalBalance: (totalBalance) => set({ totalBalance }),
      toggleTotalLock: () =>
        set((state) => ({ isTotalLocked: !state.isTotalLocked })),
      syncCurrentToTotal: () =>
        set((state) => ({ currentBalance: state.totalBalance })),
      syncTotalToCurrent: () =>
        set((state) => ({ totalBalance: state.currentBalance })),
    }),
    {
      name: "trade-store",
      version: 2,
      partialize: (state): PersistedTradeState => ({
        currentBalance: state.currentBalance,
        totalBalance: state.totalBalance,
        isTotalLocked: state.isTotalLocked,
      }),
      migrate: (persistedState) => {
        const state = persistedState as PersistedTradeState & {
          balance?: number;
        };

        if (state.balance !== undefined && state.currentBalance === undefined) {
          return {
            currentBalance: state.balance,
            totalBalance: state.totalBalance ?? 0,
            isTotalLocked: state.isTotalLocked ?? false,
          };
        }

        return {
          ...state,
          isTotalLocked: state.isTotalLocked ?? false,
        };
      },
    }
  )
);
