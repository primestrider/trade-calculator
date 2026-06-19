const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number, printRp = false): string {
  if (!Number.isFinite(value) || value === 0) {
    return "";
  }

  if (printRp) {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
  return rupiahFormatter.format(value);
}

export function parseRupiahInput(input: string): number {
  const digits = input.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return Number.parseInt(digits, 10);
}
