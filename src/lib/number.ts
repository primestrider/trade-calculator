const formatNumber = (value: number | null | undefined) =>
  value == null ? "-" : value.toLocaleString("id-ID");

const formatPercent = (value: number | null | undefined) =>
  value == null ? "-" : `${(value * 100).toFixed(2)}%`;

const getReturnVariant = (value: number) =>
  value >= 0 ? "default" : "destructive";
