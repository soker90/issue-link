/**
 * Recursos antiguos que ya NO son relevantes.
 *
 * Los posts cuyo id aparezca aquí:
 *   - NO salen en la home, ni en la búsqueda, ni en tags/categorías, ni en el RSS.
 *   - Siguen teniendo su ficha individual accesible (no se borran).
 *   - Se listan únicamente en la página /historico, a modo de archivo histórico.
 *
 * El id es el nombre del archivo en `src/content/post/` SIN la extensión .md,
 * que coincide con la URL del recurso. Por ejemplo:
 *   - src/content/post/120.md      -> "120"   (URL /120)
 *   - src/content/post/issue-33.md -> "issue-33"
 *
 * Añade aquí los ids, uno por línea:
 */
export const historicalIds: string[] = [
  "107",
  "149",
  "150",
  "191",
  "202",
  "225",
  "67",
  "94",
];
