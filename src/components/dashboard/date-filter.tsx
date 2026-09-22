"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateFilterProps {
  /** Día elegido en formato AAAA-MM-DD. */
  value: string;
  /** Mes/año derivados de la fecha elegida, ej. "Septiembre 2026". */
  mes: string;
  onChange: (fecha: string) => void;
  disabled?: boolean;
}

/**
 * Filtro del dashboard: elige un día y de ahí se deriva el año y el mes
 * que se consultan en la base de datos.
 */
export function DateFilter({
  value,
  mes,
  onChange,
  disabled,
}: DateFilterProps): React.JSX.Element {
  return (
    <div className="flex items-end gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="filtro-fecha" className="text-muted-foreground text-xs">
          Día de referencia
        </Label>
        <Input
          id="filtro-fecha"
          type="date"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-[170px]"
          aria-describedby="filtro-fecha-mes"
        />
      </div>
      <p id="filtro-fecha-mes" className="pb-2 text-sm whitespace-nowrap">
        <span className="text-muted-foreground">Mes: </span>
        <span className="font-medium">{mes}</span>
      </p>
    </div>
  );
}
