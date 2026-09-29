import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORES as C, FORMATO, FUENTE, LOCALE_NUMEROS, MARCA } from "./estilo";
import { Noticia, normalizarNoticia, validarNoticia } from "./tipos";

// ============================================================
//  Diseño de la plantilla. Para crear una noticia NO hace falta
//  tocar este archivo: edita src/noticia-actual.json.
// ============================================================

const TOTAL = FORMATO.segundos * FORMATO.fps;

// ---------- Utilidades ----------
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useEntrada = (delay: number, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const formatear = (v: number, decimales: number) =>
  v.toLocaleString(LOCALE_NUMEROS, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });

const tamañoTitular = (texto: string) => {
  const n = texto.length;
  if (n <= 40) return 92;
  if (n <= 60) return 84;
  if (n <= 80) return 74;
  return 64;
};

// ---------- Fondo ----------
const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, TOTAL], [0, 120]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${20 + shift / 10}%, ${C.fondo2} 0%, ${C.fondo1} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.borde} 1px, transparent 1px), linear-gradient(90deg, ${C.borde} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${shift}px`,
          opacity: 0.25,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Cabecera ----------
const Cabecera: React.FC<{ fecha: string }> = ({ fecha }) => {
  const p = useEntrada(0);
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-40, 0])}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 18,
            background: C.oro,
            color: C.fondo1,
            fontWeight: 900,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {MARCA.inicial}
        </div>
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ color: C.blanco, fontWeight: 800, fontSize: 38 }}>
            {MARCA.nombre}
          </div>
          <div
            style={{
              color: C.oro,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 8,
            }}
          >
            {MARCA.subnombre}
          </div>
        </div>
      </div>
      <div style={{ color: C.gris, fontSize: 28, fontWeight: 600 }}>
        {fecha || "FECHA PENDIENTE"}
      </div>
    </div>
  );
};

// ---------- Etiqueta de categoría ----------
const Badge: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const p = useEntrada(8, 12);
  const pulso = 0.6 + 0.4 * Math.abs(Math.sin(frame / 6));
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 70,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 30px",
        borderRadius: 999,
        background: C.rojo,
        transform: `scale(${p})`,
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: C.blanco,
          opacity: pulso,
        }}
      />
      <span
        style={{
          color: C.blanco,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: 3,
        }}
      >
        {texto}
      </span>
    </div>
  );
};

// ---------- Titular ----------
const Titular: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const contenido = texto.trim() || "TITULAR PENDIENTE";
  const palabras = contenido.split(/\s+/);
  // Acelera la aparición si hay muchas palabras para terminar a tiempo.
  const paso = Math.max(1, Math.min(3, Math.floor(36 / palabras.length)));
  return (
    <div
      style={{
        position: "absolute",
        top: 450,
        left: 70,
        right: 70,
        color: texto.trim() ? C.blanco : C.gris,
        fontSize: tamañoTitular(contenido),
        fontWeight: 900,
        lineHeight: 1.08,
        letterSpacing: -1,
      }}
    >
      {palabras.map((w, i) => {
        const delay = 16 + i * paso;
        const o = interpolate(frame, [delay, delay + 10], [0, 1], clamp);
        const y = interpolate(frame, [delay, delay + 10], [30, 0], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: 22,
              opacity: o,
              transform: `translateY(${y}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Gráfico ----------
const ANCHO_G = 860;
const ALTO_G = 240;

const MiniGrafico: React.FC<{ puntos: number[]; color: string }> = ({
  puntos,
  color,
}) => {
  const frame = useCurrentFrame();

  if (puntos.length < 2) {
    return (
      <div
        style={{
          width: ANCHO_G,
          height: ALTO_G,
          border: `3px dashed ${C.borde}`,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.gris,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        GRÁFICO PENDIENTE
      </div>
    );
  }

  const min = Math.min(...puntos);
  const max = Math.max(...puntos);
  const rango = max - min || 1;
  const coords = puntos.map((v, i) => {
    const x = (i / (puntos.length - 1)) * ANCHO_G;
    const y = ALTO_G - ((v - min) / rango) * (ALTO_G - 30) - 15;
    return [x, y] as const;
  });
  const d = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const area = `${d} L${ANCHO_G},${ALTO_G} L0,${ALTO_G} Z`;
  const progreso = interpolate(frame, [70, 130], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const [ux, uy] = coords[coords.length - 1];

  return (
    <svg width={ANCHO_G} height={ALTO_G} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id="revelar">
          <rect
            x={-20}
            y={-20}
            width={(ANCHO_G + 40) * progreso}
            height={ALTO_G + 40}
          />
        </clipPath>
      </defs>
      <path d={area} fill="url(#relleno)" clipPath="url(#revelar)" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#revelar)"
      />
      <circle
        cx={ux}
        cy={uy}
        r={14}
        fill={color}
        opacity={interpolate(progreso, [0.95, 1], [0, 1], clamp)}
      />
    </svg>
  );
};

// ---------- Panel del dato ----------
const PanelDato: React.FC<{ n: Noticia }> = ({ n }) => {
  const frame = useCurrentFrame();
  const p = useEntrada(45);

  const hayVariacion = typeof n.variacion === "number";
  const variacion = n.variacion ?? 0;
  const sube = variacion >= 0;
  const color = !hayVariacion
    ? C.gris
    : n.colorVariacion === "verde"
      ? C.verde
      : n.colorVariacion === "rojo"
        ? C.rojo
        : sube
          ? C.verde
          : C.rojo;

  const conteo = interpolate(frame, [55, 100], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  let textoValor = "—";
  if (typeof n.valor === "number") {
    const inicio = n.puntosGrafico.length >= 2 ? n.puntosGrafico[0] : n.valor;
    textoValor = `${n.prefijo}${formatear(inicio + (n.valor - inicio) * conteo, n.decimales)}${n.sufijo}`;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 800,
        left: 70,
        right: 70,
        padding: "44px 40px 36px",
        borderRadius: 36,
        background: C.panel,
        border: `2px solid ${C.borde}`,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: C.gris,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          {n.activo || "ACTIVO PENDIENTE"}
        </span>
        <span
          style={{
            color,
            background: `${color}26`,
            padding: "10px 24px",
            borderRadius: 16,
            fontSize: 42,
            fontWeight: 800,
          }}
        >
          {hayVariacion
            ? `${sube ? "▲ +" : "▼ "}${(variacion * conteo).toFixed(2)}%`
            : "— %"}
        </span>
      </div>
      <div
        style={{
          color: C.blanco,
          fontSize: textoValor.length > 10 ? 120 : 150,
          fontWeight: 900,
          letterSpacing: -3,
          marginTop: 10,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {textoValor}
      </div>
      <div style={{ marginTop: 20 }}>
        <MiniGrafico puntos={n.puntosGrafico} color={color} />
      </div>
      <div
        style={{
          color: C.gris,
          fontSize: 26,
          fontWeight: 600,
          marginTop: 18,
          opacity: interpolate(frame, [110, 130], [0, 1], clamp),
        }}
      >
        {n.periodoGrafico || "Periodo pendiente"}
      </div>
    </div>
  );
};

// ---------- Resumen y fuente ----------
const Resumen: React.FC<{ texto: string; fuente: string }> = ({
  texto,
  fuente,
}) => {
  const p = useEntrada(120);
  return (
    <div
      style={{
        position: "absolute",
        top: 1500,
        left: 70,
        right: 70,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px)`,
      }}
    >
      {texto.trim() ? (
        <div
          style={{
            borderLeft: `8px solid ${C.oro}`,
            paddingLeft: 28,
            color: C.blanco,
            fontSize: 38,
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 18,
          }}
        >
          {texto}
        </div>
      ) : null}
      <div
        style={{
          color: C.gris,
          fontSize: 28,
          paddingLeft: texto.trim() ? 36 : 0,
        }}
      >
        {fuente || "FUENTE PENDIENTE"}
      </div>
    </div>
  );
};

// ---------- Llamado a la acción ----------
const CTA: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const p = useEntrada(185, 14);
  const brillo = interpolate(frame, [185, TOTAL - 1], [-100, 200], clamp);
  if (!texto.trim()) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 90,
        left: 70,
        right: 70,
        padding: "30px 20px",
        borderRadius: 24,
        background: `linear-gradient(100deg, ${C.oro} ${brillo - 30}%, ${C.oroClaro} ${brillo}%, ${C.oro} ${brillo + 30}%)`,
        color: C.fondo1,
        textAlign: "center",
        fontSize: 40,
        fontWeight: 900,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
      }}
    >
      {texto}
    </div>
  );
};

// ---------- Marca de borrador y avisos ----------
const MarcaBorrador: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        transform: "rotate(-30deg)",
        border: `10px solid ${C.rojo}`,
        color: C.rojo,
        padding: "20px 60px",
        fontSize: 120,
        fontWeight: 900,
        letterSpacing: 10,
        opacity: 0.55,
        borderRadius: 24,
      }}
    >
      BORRADOR
    </div>
  </AbsoluteFill>
);

const AvisoFaltantes: React.FC<{ errores: string[] }> = ({ errores }) => (
  <div
    style={{
      position: "absolute",
      top: 24,
      left: 24,
      right: 24,
      background: C.aviso,
      color: C.fondo1,
      borderRadius: 16,
      padding: "14px 22px",
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.35,
    }}
  >
    Datos incompletos: {errores.join(" · ")}
  </div>
);

// ============================================================
//  Componente principal
// ============================================================
export const NoticiaFinanciera: React.FC<Noticia> = (props) => {
  const n = normalizarNoticia(props);
  const errores = validarNoticia(n);

  return (
    <AbsoluteFill style={{ fontFamily: FUENTE, backgroundColor: C.fondo1 }}>
      <Fondo />
      <Cabecera fecha={n.fecha} />
      <Badge texto={n.categoria} />
      <Titular texto={n.titular} />
      <PanelDato n={n} />
      <Resumen texto={n.resumen} fuente={n.fuente} />
      <CTA texto={n.cta} />
      {!n.verificado ? <MarcaBorrador /> : null}
      {errores.length > 0 ? <AvisoFaltantes errores={errores} /> : null}
    </AbsoluteFill>
  );
};
