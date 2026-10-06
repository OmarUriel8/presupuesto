"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import type { MovimientoRow } from "@/components/movimientos/movimiento-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CATEGORIA_TODAS = "todas";

export type OperadorMonto = "mayor" | "menor";

export interface FiltrosMovimiento {
  /** Texto libre: coincide con descripción o notas. */
  texto: string;
  /** Id de categoría o "todas". */
  categoriaId: string;
  /** Límite inferior inclusivo (AAAA-MM-DD) o "" sin límite. */
  fechaDesde: string;
  /** Límite superior inclusivo (AAAA-MM-DD) o "" sin límite. */
  fechaHasta: string;
  operadorMonto: OperadorMonto;
  /** Monto de comparación como texto (input numérico) o "" sin filtro. */
  monto: string;
}

/** Fecha local en formato AAAA-MM-DD (igual que los inputs date). */
function aFechaLocal(fecha: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
}

/** Misma fecha un mes atrás, ajustada al último día si el mes es más corto. */
function haceUnMes(fecha: Date): Date {
  const ultimoDiaPrevio = new Date(fecha.getFullYear(), fecha.getMonth(), 0).getDate();
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth() - 1,
    Math.min(fecha.getDate(), ultimoDiaPrevio)
  );
}

/** Filtros iniciales: sin texto ni categoría ni monto, rango del último mes. */
export function filtrosPorDefecto(): FiltrosMovimiento {
  const hoy = new Date();
  return {
    texto: "",
    categoriaId: CATEGORIA_TODAS,
    fechaDesde: aFechaLocal(haceUnMes(hoy)),
    fechaHasta: aFechaLocal(hoy),
    operadorMonto: "mayor",
    monto: "",
  };
}

/** Aplica los filtros sobre los movimientos ya cargados (todo en cliente). */
export function filtrarMovimientos(
  movimientos: MovimientoRow[],
  filtros: FiltrosMovimiento
): MovimientoRow[] {
  const texto = filtros.texto.trim().toLowerCase();
  const montoNum = filtros.monto.trim() === "" ? null : Number(filtros.monto);
  const montoValido = montoNum !== null && Number.isFinite(montoNum) ? montoNum : null;

  return movimientos.filter((m) => {
    if (
      filtros.categoriaId !== CATEGORIA_TODAS &&
      m.categoria.id_categoria !== filtros.categoriaId
    ) {
      return false;
    }
    if (texto) {
      const contenido = `${m.descripcion} ${m.notas ?? ""}`.toLowerCase();
      if (!contenido.includes(texto)) return false;
    }
    // Las fechas viajan como AAAA-MM-DD: la comparación lexicográfica equivale
    // a la cronológica. Ambos límites son inclusivos.
    if (filtros.fechaDesde && m.fecha < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && m.fecha > filtros.fechaHasta) return false;
    if (montoValido !== null) {
      if (filtros.operadorMonto === "mayor" && !(m.monto > montoValido)) return false;
      if (filtros.operadorMonto === "menor" && !(m.monto < montoValido)) return false;
    }
    return true;
  });
}

interface MovimientoFiltersProps {
  filtros: FiltrosMovimiento;
  onChange: (filtros: FiltrosMovimiento) => void;
  /** Se invoca al cambiar las fechas para reconsultar al servidor. */
  onRangoChange?: (desde: string, hasta: string) => void;
  /** Movimientos sin filtrar: de aquí salen las opciones de categoría. */
  movimientos: MovimientoRow[];
  total: number;
  filtrados: number;
}

/** Barra de búsqueda y filtros de movimientos (texto, categoría, fechas, monto). */
export function MovimientoFilters({
  filtros,
  onChange,
  onRangoChange,
  movimientos,
  total,
  filtrados,
}: MovimientoFiltersProps): React.JSX.Element {
  // Opciones derivadas de los datos: toda categoría con movimientos es filtrable,
  // incluso si ya no está activa.
  const categorias = React.useMemo(() => {
    const mapa = new Map<string, string>();
    for (const m of movimientos) {
      if (!mapa.has(m.categoria.id_categoria)) {
        mapa.set(m.categoria.id_categoria, m.categoria.nombre);
      }
    }
    return [...mapa.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [movimientos]);

  function actualizar(cambios: Partial<FiltrosMovimiento>): void {
    onChange({ ...filtros, ...cambios });
  }

  /** Las fechas viven en el servidor: se actualizan en local y se reconsultan. */
  function actualizarFechas(fechaDesde: string, fechaHasta: string): void {
    onChange({ ...filtros, fechaDesde, fechaHasta });
    onRangoChange?.(fechaDesde, fechaHasta);
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        <div className="min-w-0 space-y-1.5 lg:col-span-3">
          <Label htmlFor="filtro-texto">Buscar</Label>
          <div className="relative">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="filtro-texto"
              placeholder="Descripción o notas..."
              value={filtros.texto}
              onChange={(event) => actualizar({ texto: event.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1.5 lg:col-span-2">
          <Label htmlFor="filtro-categoria">Categoría</Label>
          <Select
            value={filtros.categoriaId}
            onValueChange={(value) => actualizar({ categoriaId: value })}
          >
            <SelectTrigger id="filtro-categoria" className="w-full">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CATEGORIA_TODAS}>Todas las categorías</SelectItem>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0 space-y-1.5 lg:col-span-4">
          <Label>Rango de fechas</Label>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              aria-label="Fecha desde"
              value={filtros.fechaDesde}
              onChange={(event) => actualizarFechas(event.target.value, filtros.fechaHasta)}
            />
            <span className="text-muted-foreground shrink-0 text-sm">a</span>
            <Input
              type="date"
              aria-label="Fecha hasta"
              value={filtros.fechaHasta}
              onChange={(event) => actualizarFechas(filtros.fechaDesde, event.target.value)}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1.5 lg:col-span-3">
          <Label htmlFor="filtro-monto">Monto</Label>
          <div className="flex items-center gap-2">
            <Select
              value={filtros.operadorMonto}
              onValueChange={(value) => actualizar({ operadorMonto: value as OperadorMonto })}
            >
              <SelectTrigger aria-label="Comparación de monto" className="w-[96px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mayor">Mayor</SelectItem>
                <SelectItem value="menor">Menor</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="filtro-monto"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={filtros.monto}
              onChange={(event) => actualizar({ monto: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          {filtrados} de {total} movimientos
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(filtrosPorDefecto())}
        >
          <XIcon className="h-4 w-4" />
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
