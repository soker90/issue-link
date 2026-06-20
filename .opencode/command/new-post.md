---
description: Genera un post completo de DevLinks a partir del enlace a un repo o recurso
agent: build
---

Crea un nuevo recurso para el directorio DevLinks a partir de este enlace:

**$ARGUMENTS**

Sigue estos pasos:

1. Lee el formato canónico en `docs/POST-FORMAT.md` y respétalo al pie de la letra.
2. **Investiga** el recurso de verdad: descarga la web oficial / el repo y busca en la web si hace falta. Verifica qué es, su stack, si está activo o archivado, la licencia y cuál es el enlace canónico correcto (web oficial vs repo). No inventes nada: escribe solo lo que confirmes.
3. Calcula el **siguiente ID disponible**: el mayor número de archivo en `src/content/post/*.md` + 1.
4. Escribe `src/content/post/<ID>.md` con el frontmatter y el cuerpo completos (secciones Qué es / Para qué sirve / Cuándo usarlo / Ejemplo / Puntos clave / Ten en cuenta). Los enlaces NO van en el cuerpo: ponlos en el frontmatter (link/repo/docs y aditional para material extra), todo en español. Usa la fecha de hoy en `publishDate`. NO escribas los campos `stars`, `lastCommit`, `version` ni `archived`.
5. Si el recurso tiene repo de GitHub, ejecuta `node scripts/refresh-github.mjs <ID>.md` para rellenar las métricas.
6. Ejecuta `pnpm build` para validar que compila.
7. Informa del archivo creado, el ID, y cualquier corrección o aviso (enlace cambiado, repo archivado, etc.).
