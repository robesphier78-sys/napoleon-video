// ============================================================
//  Identidad visual de Napoleon Finanzas LATAM
//  Cambia aquí colores, tipografía o marca y se aplica a todas
//  las noticias.
// ============================================================

export const FORMATO = {
  ancho: 1080,
  alto: 1920,
  fps: 30,
  segundos: 8,
} as const;

export const MARCA = {
  inicial: "N",
  nombre: "NAPOLEON FINANZAS",
  subnombre: "LATAM",
} as const;

export const COLORES = {
  fondo1: "#060B1A",
  fondo2: "#0D1B3D",
  oro: "#F5C542",
  oroClaro: "#FFE38A",
  blanco: "#FFFFFF",
  gris: "#9AA7C7",
  verde: "#22C55E",
  rojo: "#EF4444",
  aviso: "#F59E0B",
  panel: "rgba(255,255,255,0.06)",
  borde: "rgba(255,255,255,0.12)",
} as const;

export const FUENTE =
  "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, system-ui, sans-serif";

/** Formato de números (separadores de miles y decimales). */
export const LOCALE_NUMEROS = "es-MX";
