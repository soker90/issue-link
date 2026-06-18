![Proyecto top](https://img.shields.io/badge/Proyecto-molon-flat)
# issue-link

Directorio publico de recursos de programacion: herramientas, repositorios, librerias, servicios y utilidades organizadas por tags, stack, tipo y caso de uso.

La prioridad del proyecto es encontrar rapido recursos por lo que necesitas hacer: monitorizar una web, enviar emails, optimizar imagenes, crear UI, automatizar workflows, probar APIs, etc.

## Contenido

Los recursos viven en `src/content/post/*.md` como Markdown con frontmatter enriquecido.

Campos principales:

- `title`: nombre del recurso.
- `link`: URL principal.
- `repo`: repositorio, si existe.
- `docs`: documentacion, si existe.
- `excerpt`: descripcion corta.
- `type`: tipo de recurso.
- `useCase`: para que sirve en una frase practica.
- `stack`: tecnologias o contexto tecnico.
- `tags`: etiquetas de busqueda.
- `pricing`: `free`, `freemium`, etc.
- `status`: estado del recurso.
- `featured`: marca recursos destacados.

## Desarrollo

```bash
pnpm install
pnpm dev
pnpm build
```

## Pendiente

- Automatizar el enriquecimiento de tags con IA.
- Revisar el flujo de alta de nuevos recursos.
- Anadir filtros persistentes en URL si el directorio crece mucho.
