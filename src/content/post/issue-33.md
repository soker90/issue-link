---
title: jsDelivr
publishDate: 2026-06-20T17:54:41Z
link: 'https://www.jsdelivr.com/'
repo: 'https://github.com/jsdelivr/jsdelivr'
docs: 'https://www.jsdelivr.com/docs'
excerpt: 'CDN público, gratuito y open source para servir paquetes de npm, GitHub y ESM.'
type: service
useCase: 'Para servir librerías de npm o archivos de GitHub desde un CDN rápido y gratuito sin instalar ni compilar nada.'
pricing: free
status: active
tags:
  - cdn
  - javascript
  - librerias
  - rendimiento
  - npm
  - open-source
stars: 6286
lastCommit: 2026-05-29
---

## Qué es

jsDelivr es una red de entrega de contenido (CDN) pública, gratuita y de código abierto (licencia MIT) orientada a desarrolladores. Sirve de forma rápida y fiable archivos JavaScript, CSS, fuentes y otros activos web estáticos directamente desde el registro de npm, repositorios de GitHub y módulos ESM. Funciona como un CDN inteligente que combina varios proveedores de primer nivel (actualmente Cloudflare y Fastly) y enruta cada petición al servidor más rápido según datos de rendimiento reales.

## Para qué sirve

- Cargar cualquier paquete publicado en npm sin instalarlo localmente ni configurar un bundler, ideal para desarrollo rápido.
- Servir archivos de código directamente desde repositorios públicos de GitHub (o desde releases).
- Enlazar a versiones exactas, rangos semánticos (semver) o a la última versión disponible de un archivo.
- Distribuir activos estáticos pesados fuera de tu propio hosting para reducir ancho de banda y latencia.

## Cuándo usarlo

Es una opción excelente para prototipado rápido, entornos interactivos en línea (CodePen, JSFiddle), demos y proyectos estáticos sencillos que no requieren un proceso de compilación. También para servir librerías populares aprovechando el caché global del CDN. Como alternativas están unpkg (centrado en npm) o esm.sh (especializado en ESM); en aplicaciones grandes de producción suele preferirse empaquetar las dependencias localmente.

## Ejemplo

Cargar un archivo de un paquete de npm con la estructura `https://cdn.jsdelivr.net/npm/paquete@version/archivo`:

```html
<!-- Build para navegador de Tailwind CSS v4 -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

Cargar un archivo desde un repositorio de GitHub con `https://cdn.jsdelivr.net/gh/usuario/repo@version/archivo`:

```html
<!-- jQuery 3.6.0 servido desde GitHub -->
<script src="https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.0/dist/jquery.min.js"></script>
```

## Puntos clave

- Gratuito y sin límites estrictos de ancho de banda para proyectos legítimos.
- Infraestructura multi-CDN que ofrece un uptime muy alto y latencias mínimas a nivel global.
- Minificación al vuelo: añadiendo `.min` al nombre de ciertos archivos no minificados, jsDelivr genera la versión minificada automáticamente.
- Enlaces optimizados para servir contenido de forma fiable en China continental gracias a sus licencias ICP.
- Proyecto open source con licencia MIT y comunidad muy activa.

## Ten en cuenta

- Hay límites de tamaño: los archivos individuales de GitHub no pueden superar los **20 MB** y los paquetes mayores de **150 MB** no se sirven por defecto (se pueden solicitar excepciones).
- Depender de un CDN externo introduce un punto de fallo de terceros; en producción crítica conviene valorar empaquetar las dependencias localmente.
- Para mitigar riesgos si un paquete o repo se ve comprometido, usa validación de integridad (Subresource Integrity, atributo `integrity`).
- Si enlazas a la última versión (sin fijar `@version`), el CDN cachea el archivo un tiempo, por lo que los cambios pueden tardar en reflejarse.
