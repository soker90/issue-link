---
title: jsDelivr
publishDate: 2026-06-20T17:50:15Z
link: https://www.jsdelivr.com/
excerpt: Un CDN público y gratuito para npm y GitHub.
aditional:
- [Web oficial de jsDelivr](https://www.jsdelivr.com/)
- [Repositorio de jsDelivr en GitHub](https://github.com/jsdelivr/jsdelivr)
tags:
  - tools
  - publicado
  - utilidades
  - librerias
  - dependencies
---
jsDelivr es una red de entrega de contenido (CDN) pública, gratuita y de código abierto orientada a desarrolladores. Es utilizada principalmente para servir de forma rápida y ultra-confiable archivos JavaScript, CSS, fuentes y otros activos web estáticos directamente desde repositorios de GitHub, el registro de npm o WordPress.

## Para qué sirve

- **Cargar librerías npm**: Permite importar cualquier paquete publicado en npm sin necesidad de instalarlo localmente ni configurar bundles en desarrollo rápido.
- **Servir código desde GitHub**: Funciona como un hosting directo para archivos de código fuente alojados en repositorios públicos de GitHub.
- **Optimizar rendimiento con multi-CDN**: jsDelivr combina múltiples proveedores de CDN (como Cloudflare, Fastly, Bunny y GCore) en una única infraestructura inteligente para derivar el tráfico al servidor más rápido.
- **Acceder a versiones específicas**: Permite enlazar a versiones exactas, rangos semánticos (semver) o directamente a la última versión disponible de un archivo.

## Ejemplos de uso

### 1. Cargar una librería npm
Puedes cargar cualquier archivo de un paquete npm usando la siguiente estructura:
`https://cdn.jsdelivr.net/npm/package@version/file`

Ejemplo con la build para navegador de Tailwind CSS v4:
```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

### 2. Cargar desde GitHub
Puedes acceder a archivos de repositorios públicos usando:
`https://cdn.jsdelivr.net/gh/user/repo@version/file`

Ejemplo con la librería jQuery:
```html
<script src="https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.0/dist/jquery.min.js"></script>
```

## Cuándo usarlo

Es una opción excelente para entornos de prototipado rápido, entornos interactivos en línea (como CodePen o JSFiddle), proyectos estáticos sencillos que no requieren un proceso de compilación complejo (build pipeline), o para servir activos estáticos pesados fuera de tu propio servidor de hosting para reducir ancho de banda.

## Puntos clave

- **Sin límites de ancho de banda**: Completamente gratuito y sin límites estrictos de tráfico para proyectos legítimos de código abierto.
- **Infraestructura Multi-CDN**: Combina redes de primer nivel para ofrecer un uptime prácticamente del 100% y latencias mínimas.
- **Minificación automática**: Si agregas `.min` al final del nombre del archivo y este no está minificado, jsDelivr puede generar la versión minificada al vuelo para ciertos archivos.
- **Uso en China continental**: Cuenta con enlaces optimizados y licencias ICP para servir archivos de manera confiable en China sin bloqueos por el Great Firewall.

## Ten en cuenta

- **No es aconsejable para producción crítica en grandes apps**: Depender de un CDN externo gratuito introduce un punto de fallo externo. En proyectos empresariales grandes se prefiere empaquetar las dependencias localmente.
- **Seguridad**: Para mitigar riesgos de inyección de código (si el paquete npm o repo es comprometido), se recomienda usar la validación de integridad Subresource Integrity (SRI) con el atributo `integrity`.
- **Actualizaciones por caché**: Si enlazas a la última versión (e.g. `@latest` o sin versión), el CDN almacena en caché el archivo por un tiempo (usualmente 24 horas), por lo que las actualizaciones de tu código en GitHub pueden no reflejarse inmediatamente.