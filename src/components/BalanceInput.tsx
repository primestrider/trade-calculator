import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock, LockOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { formatRupiah, parseRupiahInput } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useTradeStore } from "@/store/trade.store";

type BalanceInputProps = {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
};

type RupiahBalanceFieldProps = {
  id: string;
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  endAddon?: React.ReactNode;
};

function clampBalance(value: number, min?: number, max?: number) {
  let next = value;

  if (min !== undefined && next < min) {
    next = min;
  }

  if (max !== undefined && next > max) {
    next = max;
  }

  return next;
}

function RupiahBalanceField({
  id,
  label,
  value,
  onValueChange,
  placeholder = "0",
  disabled = false,
  min = 0,
  max,
  endAddon,
}: Readonly<RupiahBalanceFieldProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const displayValue = isFocused ? draft : formatRupiah(value);

  const handleChange = (input: string) => {
    const parsed = clampBalance(parseRupiahInput(input), min, max);

    setDraft(formatRupiah(parsed) || input.replace(/\D/g, ""));
    onValueChange(parsed);
  };

  return (
    <Field data-disabled={disabled || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>Rp</InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          disabled={disabled}
          value={displayValue}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setDraft(formatRupiah(value));
          }}
          onBlur={() => setIsFocused(false)}
        />

        {endAddon}
      </InputGroup>
    </Field>
  );
}

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

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RupiahBalanceField
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
              type="button"
              variant="outline"
              size="xs"
              disabled={disabled}
              onClick={syncCurrentToTotal}
            >
              <ArrowRight data-icon="inline-start" />
              To Total
            </Button>
          }
        />

        <RupiahBalanceField
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
                onClick={syncTotalToCurrent}
              >
                <ArrowLeft data-icon="inline-start" />
                To Current
              </InputGroupButton>
              <InputGroupButton
                type="button"
                size="icon-xs"
                variant={isTotalLocked ? "secondary" : "ghost"}
                disabled={disabled}
                aria-label={
                  isTotalLocked ? "Unlock total balance" : "Lock total balance"
                }
                aria-pressed={isTotalLocked}
                onClick={toggleTotalLock}
              >
                {isTotalLocked ? <Lock /> : <LockOpen />}
              </InputGroupButton>
            </InputGroupAddon>
          }
        />
      </div>
    </div>
  );
}
