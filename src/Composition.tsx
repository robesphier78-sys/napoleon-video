import { CalculateMetadataFunction, Composition } from "remotion";
import noticiaActual from "./noticia-actual.json";
import { FORMATO } from "./plantilla/estilo";
import { NoticiaFinanciera } from "./plantilla/NoticiaFinanciera";
import { Noticia, normalizarNoticia, validarNoticia } from "./plantilla/tipos";

// ============================================================
//  Registro de la plantilla "NoticiaFinanciera"
//  Vertical 9:16 · 1080x1920 · 8 s · 30 fps
//
//  Los datos de la noticia NO se escriben aquí:
//   - Vista previa / render rápido  → src/noticia-actual.json
//   - Render desde un archivo       → --props=noticias/<archivo>.json
// ============================================================

const slug = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const calculateMetadata: CalculateMetadataFunction<Noticia> = ({
  props,
  isRendering,
}) => {
  const n = normalizarNoticia(props);
  const errores = validarNoticia(n);

  // Bloquea el render si faltan datos, para no publicar nada incompleto.
  if (isRendering && errores.length > 0) {
    throw new Error(
      `No se puede renderizar la noticia, faltan datos:\n- ${errores.join("\n- ")}`,
    );
  }

  const nombre = [n.fecha, n.activo].map(slug).filter(Boolean).join("_");
  return {
    props: n,
    defaultOutName: `${nombre || "noticia"}${n.verificado ? "" : "_BORRADOR"}.mp4`,
  };
};

export const MyComposition = () => {
  return (
    <Composition
      id="NoticiaFinanciera"
      component={NoticiaFinanciera}
      durationInFrames={FORMATO.segundos * FORMATO.fps}
      fps={FORMATO.fps}
      width={FORMATO.ancho}
      height={FORMATO.alto}
      defaultProps={normalizarNoticia(noticiaActual as Partial<Noticia>)}
      calculateMetadata={calculateMetadata}
    />
  );
};
