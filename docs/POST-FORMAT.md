# Formato de un post de DevLinks

Fuente de verdad del formato de los recursos en `src/content/post/<ID>.md`.
La usan los comandos `/new-post` y `/complete-post` (Claude Code, opencode y
Antigravity) y el agente `post-generator`. Todo el contenido va en **español**.

Cada entrada tiene dos partes: **frontmatter YAML** y **cuerpo Markdown**.

## Frontmatter

```yaml
---
title: <Nombre real del producto, bien escrito (ej. "es-toolkit", "CVA (class-variance-authority)")>
publishDate: <fecha ISO, ej: 2024-06-01T12:00:00+00:00 — conservar la existente al editar>
link: "<URL principal: web oficial del producto si existe; si no, el repo>"
repo: "<URL del repo en GitHub, si tiene>"
docs: "<URL de la documentación oficial — solo si existe y es distinta del repo>"
excerpt: "<1 frase en español, máx ~150 caracteres, que diga qué es. NADA en inglés.>"
type: <repository | tool | service | library | framework | cli | template | github-action | desktop-app | ai-tool | component-library | package-registry>
useCase: "<Para qué sirve, 1 frase práctica en español, empieza por verbo: 'Para ...'>"
pricing: <free | freemium | paid>
status: <active | archived | deprecated>
featured: <true solo si es muy conocido y útil (+10k estrellas); si no, omitir o false>
stack:
  - <tecnologías reales en minúsculas: react, typescript, node, rust...>
tags:
  - <3-6 etiquetas de búsqueda en español, relevantes y correctas>
aditional:
  - <opcional: URLs de material externo realmente útil (comparativas, playground...). Omitir si no hay.>
---
```

**Reglas de YAML críticas:**
- Si `excerpt` o `useCase` contienen `:` (dos puntos), rodear SIEMPRE el valor con comillas dobles.
- `link`, `repo` y `docs` SIEMPRE entre comillas dobles.
- `docs` y `aditional` solo si aportan; si no, se omiten.
- **NO escribir nunca a mano** los campos `stars`, `lastCommit`, `version` ni
  `archived`: los rellena el script `scripts/refresh-github.mjs`. Si existieran, dejarlos como están (el script los actualiza).

## Cuerpo

Usar EXACTAMENTE estas secciones, en este orden:

```markdown
## Qué es

[2-4 frases reales: qué es, quién lo hace, en qué se basa. No copiar la descripción de GitHub tal cual.]

## Para qué sirve

- [Caso de uso concreto 1]
- [Caso de uso concreto 2]
- [Caso de uso concreto 3]
- [Caso de uso concreto 4 — opcional]

## Cuándo usarlo

[2-4 frases o bullets sobre el escenario ideal. Mencionar alternativas si las hay.]

## Ejemplo

[Un ejemplo CONCRETO. Si es librería/CLI/framework: bloque de código realista de
instalación y uso básico con la sintaxis correcta (texto plano en los bloques de
código, nunca entidades HTML como &amp; o &gt;). Si es un servicio/app sin código:
un flujo de uso paso a paso.]

## Puntos clave

- [Característica real y diferenciadora 1]
- [Característica real y diferenciadora 2]
- [Característica real y diferenciadora 3 — sin repetir]

## Ten en cuenta

[Limitaciones reales, requisitos o cuándo NO conviene / mejores alternativas. Si el repo está archivado o sin mantenimiento, decirlo aquí.]
```

> **No incluyas una sección `## Enlaces` en el cuerpo.** Los enlaces se muestran
> automáticamente en el panel lateral de la ficha a partir del frontmatter
> (`link` → "Abrir recurso", `docs` → "Documentación", `repo` → "Repositorio") y
> `aditional` → "Material adicional". Pon ahí cualquier enlace útil, no en el cuerpo.

## Principios

- **Cierto y verificado**: investigar el recurso en su web/repo antes de escribir.
  No inventar. Si algo no se puede confirmar, no afirmarlo.
- **Enlace canónico**: si `link` apunta al repo pero hay web oficial, poner la web
  en `link` y el repo en `repo`. Si un repo cambió de owner/URL, corregirlo.
- **type correcto**: una librería es `library`, no `repository`; una CLI es `cli`.

## Tags habituales (usar los que apliquen, en español)

react, typescript, javascript, node, vue, svelte, astro, nextjs, python, rust, go,
ui, componentes, css, tailwind, diseno, animaciones, iconos, fuentes,
testing, calidad, linter, buenas-practicas, patrones,
build, rendimiento, bundler, vite, webpack,
backend, api, base-datos, autenticacion, seguridad, serverless, edge, baas,
devops, ci-cd, github-action, github, automatizacion, workflows,
cli, herramienta, utilidades, desktop, mobile, versionado,
markdown, contenido, documentacion, cms, rss, feeds,
visualizacion, datos, tablas, graficos,
ia, llm, embeddings,
open-source, self-hosted,
formularios, validacion, estado, hooks,
imagenes, assets, multimedia, svg, pdf,
email, transaccional, notificaciones,
monitorizacion, uptime, status-page,
productividad, organizacion

## Después de crear o editar un post

1. Si el recurso tiene repo de GitHub, ejecutar para rellenar estrellas, último
   commit, versión y estado de archivado:
   ```bash
   node scripts/refresh-github.mjs <ID>.md
   ```
2. Validar que compila (YAML y schema correctos):
   ```bash
   pnpm build   # o: npx astro build  (requiere Node 22+)
   ```
