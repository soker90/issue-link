![Proyecto top](https://img.shields.io/badge/Proyecto-molon-flat)
![Astro](https://img.shields.io/badge/Astro-6.4.8-orange)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)

# DevLinks

Directorio publico de recursos de programacion: herramientas, repositorios, librerias, servicios y utilidades organizadas por tags, stack, tipo y caso de uso.

La prioridad es encontrar rapido recursos para lo que necesitas hacer: monitorizar una web, enviar emails, optimizar imagenes, crear UI, automatizar workflows, probar APIs, etc.

**URL**: https://link.eduardoparra.es

## Stack

- [Astro 5](https://astro.build) — generador de sitio estatico
- [Tailwind CSS 4](https://tailwindcss.com) — estilos (config CSS-first con `@tailwindcss/vite`)
- [GitHub Issues](https://github.com) — CMS: cada issue con prefijo `[link]` genera un recurso
- [GitHub Pages](https://pages.github.com) — despliegue

## Contenido

Los recursos viven en `src/content/post/*.md` como archivos Markdown con frontmatter enriquecido. No se editan a mano — se crean via GitHub Issues.

### Campos del frontmatter

| Campo | Descripcion |
|---|---|
| `title` | Nombre del recurso |
| `link` | URL principal |
| `repo` | Repositorio, si existe |
| `docs` | Documentacion, si existe |
| `excerpt` | Descripcion corta |
| `type` | Tipo: `repository`, `tool`, `service`, `framework`, `template`, `library`, `github-action`... |
| `useCase` | Para que sirve en una frase practica |
| `stack` | Tecnologias o contexto tecnico |
| `tags` | Etiquetas de busqueda |
| `pricing` | `free`, `freemium`, `paid` |
| `status` | Estado del recurso |
| `featured` | `true` para marcar como destacado (aparece en la tira superior) |
| `aditional` | URLs de material adicional |
| `internal` | Slugs de recursos relacionados dentro del directorio |

### Anadir un recurso

1. Abrir un [nuevo issue](../../issues/new/choose) usando la plantilla **Nuevo enlace**.
2. El titulo debe empezar por `[link]`.
3. El workflow `generate.yml` convierte el issue en un `.md` y hace commit automaticamente.
4. El workflow `deploy.yml` construye y despliega el sitio en GitHub Pages.

## Desarrollo local

Requiere Node >= 24 y pnpm.

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # genera /dist
pnpm preview  # sirve /dist localmente
```

## Despliegue

El despliegue es automatico al hacer push a `master` via `.github/workflows/deploy.yml`.

Tambien se puede lanzar manualmente desde la pestana **Actions** del repositorio.

## Pendiente

- Automatizar el enriquecimiento de tags con IA.
