// ============================================================
//  Datos de una noticia — tipos, valores vacíos y validación
//  (No hace falta tocar este archivo para crear una noticia.)
// ============================================================

export type ColorVariacion = "auto" | "verde" | "rojo";

export type Noticia = {
  /** Etiqueta superior. Ej: "ÚLTIMA HORA", "MERCADOS", "DIVISAS". */
  categoria: string;
  /** Titular principal. Ideal: menos de 70 caracteres. */
  titular: string;
  /** Fecha visible en la cabecera. Ej: "30 SEP 2026". */
  fecha: string;
  /** Nombre del activo. Ej: "USD/MXN", "S&P 500", "BITCOIN". */
  activo: string;
  /** Valor actual del activo (número real, verificado). */
  valor: number | null;
  /** Decimales con los que se muestra el valor. */
  decimales: number;
  /** Texto antes del valor. Ej: "$" o "". */
  prefijo: string;
  /** Texto después del valor. Ej: "%", " pts" o "". */
  sufijo: string;
  /** Variación en % (ej: -0.85 o 1.2). */
  variacion: number | null;
  /**
   * "auto": verde si sube, rojo si baja.
   * "verde"/"rojo": fuerza el color (útil p.ej. en USD/MXN, donde que
   * baje significa que el peso se fortalece).
   */
  colorVariacion: ColorVariacion;
  /** Serie del gráfico, del más antiguo al más reciente (mín. 2 puntos). */
  puntosGrafico: number[];
  /** Qué periodo cubre el gráfico. Ej: "Últimos 5 días". */
  periodoGrafico: string;
  /** Una línea de contexto. Opcional (vacío = no se muestra). */
  resumen: string;
  /** Origen de los datos. Ej: "Fuente: Banxico". Obligatorio. */
  fuente: string;
  /** Llamado a la acción final. */
  cta: string;
  /**
   * Ponlo en true SOLO cuando hayas comprobado cifras y fuente.
   * Mientras sea false el video lleva la marca "BORRADOR".
   */
  verificado: boolean;
};

/** Plantilla vacía: sin cifras. Nada aquí se presenta como dato real. */
export const NOTICIA_VACIA: Noticia = {
  categoria: "MERCADOS",
  titular: "",
  fecha: "",
  activo: "",
  valor: null,
  decimales: 2,
  prefijo: "",
  sufijo: "",
  variacion: null,
  colorVariacion: "auto",
  puntosGrafico: [],
  periodoGrafico: "",
  resumen: "",
  fuente: "",
  cta: "Síguenos para más noticias financieras",
  verificado: false,
};

const esNumero = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/** Devuelve la lista de problemas. Vacía = la noticia está completa. */
export const validarNoticia = (n: Noticia): string[] => {
  const errores: string[] = [];
  if (!n.titular.trim()) errores.push("falta el titular");
  if (!n.fecha.trim()) errores.push("falta la fecha");
  if (!n.activo.trim()) errores.push("falta el activo");
  if (!esNumero(n.valor)) errores.push("falta el valor (número)");
  if (!esNumero(n.variacion)) errores.push("falta la variación (número)");
  if (!n.fuente.trim()) errores.push("falta la fuente");
  if (!Array.isArray(n.puntosGrafico) || n.puntosGrafico.length < 2) {
    errores.push("el gráfico necesita al menos 2 puntos");
  } else if (!n.puntosGrafico.every(esNumero)) {
    errores.push("todos los puntos del gráfico deben ser números");
  }
  if (!n.periodoGrafico.trim()) errores.push("falta el periodo del gráfico");
  if (!["auto", "verde", "rojo"].includes(n.colorVariacion)) {
    errores.push('colorVariacion debe ser "auto", "verde" o "rojo"');
  }
  return errores;
};

/** Completa campos que falten en un JSON con los valores vacíos. */
export const normalizarNoticia = (parcial: Partial<Noticia>): Noticia => ({
  ...NOTICIA_VACIA,
  ...parcial,
});
