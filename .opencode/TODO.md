# TODO — Entradas pendientes de completar

Este archivo recoge las entradas que hay que escribir o reescribir con el **formato completo** del proyecto.

## Qué es el formato completo

Cada entrada en `src/content/post/<ID>.md` debe tener:

### Frontmatter

```yaml
---
title: <Nombre legible>
publishDate: <fecha ISO, ej: 2024-06-01T12:00:00+00:00>
link: "<URL principal — web oficial si existe, si no el repo>"
repo: "<URL del repo en GitHub>"
docs: "<URL docs — solo si existe y es distinta al repo>"
excerpt: <Descripción corta en español, 1-2 frases específicas y útiles>
type: <repository | tool | service | library | framework | template | github-action | desktop-app | ai-tool | component-library | package-registry>
useCase: <Para qué sirve en una frase práctica. Empieza con verbo infinitivo.>
pricing: <free | freemium | paid>
status: <active | archived | deprecated>
featured: <true solo si es muy conocido y muy útil | false>
stack:
  - <tecnologías en minúsculas>
tags:
  - <etiquetas en minúsculas, máximo 8>
---
```

**REGLA CRÍTICA DE YAML:** si `excerpt` o `useCase` contienen `:`, rodear con comillas dobles.

### Cuerpo

```markdown
## Qué es

[2-4 frases reales. No copiar la description de GitHub. Explicar el problema que resuelve.]

## Para qué sirve

- [Caso de uso concreto 1]
- [Caso de uso concreto 2]
- [Caso de uso concreto 3]

## Cuándo usarlo

[2-3 frases con el contexto específico. Mencionar alternativas si las hay.]

## Puntos clave

- [Característica técnica 1]
- [Característica técnica 2]
- [Característica técnica 3]

## Ten en cuenta

[2-3 frases con limitaciones, gotchas o consideraciones antes de adoptarlo.]

## Enlaces

- [Web oficial](URL) — solo si link != repo
- [Repositorio en GitHub](URL)
- [Documentación](URL) — solo si existe
```

---

## Entradas a reescribir (existen pero tienen contenido genérico de IA)

> [!NOTE]
> **Estado: COMPLETADO** — Todas las siguientes entradas han sido reescritas siguiendo el formato completo.

| ID | Título | Repo |
|----|--------|------|
| 208 | Refined GitHub | https://github.com/refined-github/refined-github |
| 209 | rclone | https://github.com/rclone/rclone |
| 210 | D3.js | https://github.com/d3/d3 |
| 211 | localForage | https://github.com/localForage/localForage |
| 212 | Passport.js | https://github.com/jaredhanson/passport |
| 213 | MDX | https://github.com/mdx-js/mdx |
| 214 | Release Drafter | https://github.com/release-drafter/release-drafter |
| 215 | SheetJS | https://github.com/SheetJS/sheetjs |
| 216 | happy-dom | https://github.com/capricorn86/happy-dom |
| 217 | Atuin | https://github.com/atuinsh/atuin |
| 218 | Pomotroid | https://github.com/Splode/pomotroid |
| 219 | Nextron | https://github.com/saltyshiomix/nextron |

---

## Entradas a crear (no existen todavía)

> [!NOTE]
> **Estado: COMPLETADO** — Todas las siguientes entradas han sido creadas secuencialmente a partir del ID 220.

| ID | Título | Repo | Notas |
|----|--------|------|-------|
| 220 | size-limit | https://github.com/ai/size-limit | Herramienta para medir el coste real en bytes de tu JS |
| 221 | eslint-plugin-testing-library | https://github.com/testing-library/eslint-plugin-testing-library | Plugin ESLint con reglas para Testing Library |
| 222 | JavaScript Data Structures & Algorithms | https://github.com/loiane/javascript-datastructures-algorithms | Colección de estructuras de datos y algoritmos en JS/TS |
| 223 | Clean Code JavaScript (español) | https://github.com/andersontr15/clean-code-javascript-es | Clean Code traducido al español |
| 224 | readme-md-generator | https://github.com/kefranabg/readme-md-generator | CLI para generar README.md bonitos |
| 225 | cypress-react-unit-test | https://github.com/cypress-io/cypress-react-unit-test | Tests unitarios de componentes React con Cypress |
| 226 | mui-datatables | https://github.com/gregnb/mui-datatables | Datatables para React con Material-UI |
| 227 | trackerslist | https://github.com/ngosang/trackerslist | Lista actualizada de trackers públicos de BitTorrent |
| 228 | melon | https://github.com/kibibytes/melon | Acortador de URLs usando GitHub Gists |
| 229 | music-box | https://github.com/AnandChowdhary/music-box | GitHub Action para mostrar el informe semanal de Last.fm en un Gist |
| 230 | bookshelf-action | https://github.com/AnandChowdhary/bookshelf-action | GitHub Action para rastrear lecturas en GitHub |
| 231 | SendScriptWhatsApp | https://github.com/Matt-Fontes/SendScriptWhatsApp | Script para enviar el guión de Shrek línea a línea por WhatsApp |
| 232 | smarttv-twitch | https://github.com/fgl27/smarttv-twitch | Cliente de Twitch para Samsung Smart TVs |

---

## Notas para el agente

- Antes de empezar, verificar el último ID con: `ls src/content/post/*.md | sort -V | tail -1`
- Después de crear/editar entradas, ejecutar `pnpm build` para validar YAML y schema
- El agente `post-generator` (`.opencode/agent/post-generator.md`) tiene instrucciones detalladas de formato
- Para entradas archivadas o con poco mantenimiento, poner `status: archived` y mencionarlo en "Ten en cuenta"
