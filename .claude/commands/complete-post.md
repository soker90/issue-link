---
description: Completa y reescribe un post existente de DevLinks dado su ID
argument-hint: <id del post, ej. 100>
allowed-tools: Read, Write, Edit, Bash, WebFetch, WebSearch, Glob, Grep
---

Completa y reescribe por completo el post de DevLinks con ID **$ARGUMENTS** (archivo `src/content/post/$ARGUMENTS.md`).

Sigue estos pasos:

1. Lee `src/content/post/$ARGUMENTS.md` para conocer el frontmatter actual (title, link, repo, type, tags, publishDate).
2. Lee el formato canónico en `docs/POST-FORMAT.md` y respétalo al pie de la letra.
3. **Investiga** el recurso de verdad con WebFetch sobre la web oficial / el repo y WebSearch si hace falta. Verifica qué es, su stack, si está activo o archivado, y si el enlace sigue siendo correcto (corrígelo si cambió de owner/URL). No inventes nada.
4. Reescribe el archivo completo con contenido cierto, completo y en español: corrige `title`, `type`, `tags`, `excerpt` y `useCase`; añade `docs`/`aditional` si aportan; e incluye todas las secciones (Qué es / Para qué sirve / Cuándo usarlo / Ejemplo / Puntos clave / Ten en cuenta). Los enlaces NO van en el cuerpo: ponlos en el frontmatter (link/repo/docs y aditional para material extra). **Conserva `publishDate`**. NO escribas a mano `stars`, `lastCommit`, `version` ni `archived`.
5. Si el recurso tiene repo de GitHub, ejecuta `node scripts/refresh-github.mjs $ARGUMENTS.md` para rellenar las métricas.
6. Ejecuta `pnpm build` (o `npx astro build`, Node 22+) para validar.
7. Resume las correcciones aplicadas y cualquier aviso.
