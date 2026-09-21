const locale = "es-MX";
const currency = "MXN";

const currencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  minimumFractionDigits: 2,
});

export function formatCurrency(value: number | string): string {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numeric)) return currencyFormatter.format(0);
  return currencyFormatter.format(numeric);
}

const dateFormatter = new Intl.DateTimeFormat(locale, {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}

/** Fecha AAAA-MM-DD -> Date en medianoche local (evita el corrimiento por zona horaria). */
export function formatToLocalDate(fecha: string): Date {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day);
}
