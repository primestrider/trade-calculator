import { formatRupiah, parseRupiahInput } from "@/lib/currency";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
type CurrencyInputFieldProps = {
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

const clampBalance = (value: number, min?: number, max?: number) => {
  let next = value;

  if (min !== undefined && next < min) {
    next = min;
  }

  if (max !== undefined && next > max) {
    next = max;
  }

  return next;
};

export const CurrencyInput = ({
  id,
  label,
  value,
  onValueChange,
  placeholder = "0",
  disabled = false,
  min = 0,
  max,
  endAddon,
}: Readonly<CurrencyInputFieldProps>) => {
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
};
