---
description: Completa y reescribe un post existente de DevLinks dado su ID
---

# Completar post de DevLinks

El usuario te da el **ID de un post** junto a este comando (toma el número del mensaje
del usuario). El archivo es `src/content/post/<ID>.md`. Reescríbelo por completo.

Pasos:

1. Lee `src/content/post/<ID>.md` para conocer el frontmatter actual (title, link, repo, type, tags, publishDate).
2. Lee el formato canónico en `docs/POST-FORMAT.md` y respétalo al pie de la letra.
3. **Investiga** el recurso de verdad abriendo/descargando la web oficial o el repo y buscando en la web si hace falta. Verifica qué es, su stack, si está activo o archivado, y si el enlace sigue siendo correcto (corrígelo si cambió de owner/URL). No inventes nada.
4. Reescribe el archivo completo con contenido cierto, completo y en español: corrige `title`, `type`, `tags`, `excerpt` y `useCase`; añade `docs`/`aditional` si aportan; e incluye todas las secciones (Qué es / Para qué sirve / Cuándo usarlo / Ejemplo / Puntos clave / Ten en cuenta). Los enlaces NO van en el cuerpo: ponlos en el frontmatter (link/repo/docs y aditional para material extra). **Conserva `publishDate`**. NO escribas a mano `stars`, `lastCommit`, `version` ni `archived`.
5. Si el recurso tiene repo de GitHub, ejecuta `node scripts/refresh-github.mjs <ID>.md` para rellenar las métricas.
6. Ejecuta `pnpm build` (Node 22+) para validar.
7. Resume las correcciones aplicadas y cualquier aviso.
