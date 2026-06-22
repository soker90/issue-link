#!/usr/bin/env node
/**
 * Actualiza los metadatos de GitHub de cada post que tenga un repositorio asociado:
 *   - stars       → número de estrellas
 *   - lastCommit  → fecha del último push al repo (YYYY-MM-DD)
 *   - version     → última release publicada (si tiene)
 *   - archived    → true si el repo está archivado (además fija status: archived)
 *
 * Además mueve al histórico (src/historico.ts) los recursos que considera muertos:
 *   - Archivados en GitHub (archived: true), o
 *   - Inactivos: sin commits desde hace más de INACTIVE_YEARS años (fija status: inactive).
 * Un recurso con `keepActive: true` en el frontmatter NUNCA se marca como inactivo
 * (para librerías estables "terminadas" que apenas commitean pero siguen vigentes).
 *
 * Usa la CLI de GitHub (`gh api`), por lo que aprovecha tu sesión autenticada
 * y su límite de 5000 peticiones/hora. Las ediciones del frontmatter son
 * puntuales (línea a línea) para mantener los diffs pequeños.
 *
 * Uso:
 *   node scripts/refresh-github.mjs            # todos los posts
 *   node scripts/refresh-github.mjs 93.md 98.md  # solo algunos
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const POST_DIR = path.join(process.cwd(), 'src/content/post');
const HISTORICO_FILE = path.join(process.cwd(), 'src/historico.ts');
const CONCURRENCY = 6;

// Un repo sin commits desde hace más de estos años se considera inactivo y se
// mueve al histórico (salvo que tenga `keepActive: true` en el frontmatter).
const INACTIVE_YEARS = 2;
const INACTIVE_MS = INACTIVE_YEARS * 365 * 24 * 60 * 60 * 1000;

/** ¿La fecha del último commit (YYYY-MM-DD) supera el umbral de inactividad? */
function isInactiveSince(lastCommit) {
  if (!lastCommit) return false; // sin dato fiable → no marcar
  const t = Date.parse(`${lastCommit}T00:00:00Z`);
  if (Number.isNaN(t)) return false;
  return Date.now() - t > INACTIVE_MS;
}

// Ids actualmente en el histórico (se carga al inicio de main()).
let historicalSet = new Set();

/** Lee los ids del histórico (src/historico.ts), ignorando líneas comentadas. */
async function readHistoricoSet() {
  try {
    const content = await readFile(HISTORICO_FILE, 'utf8');
    const arrayPart = content.slice(content.indexOf('export const historicalIds'));
    const ids = [];
    for (const line of arrayPart.split('\n')) {
      const t = line.trim();
      if (t.startsWith('//')) continue;
      const m = t.match(/^"([^"]+)",?$/);
      if (m) ids.push(m[1]);
    }
    return new Set(ids);
  } catch {
    return new Set();
  }
}

/**
 * Añade ids al histórico (src/historico.ts) sin duplicar ni tocar los existentes.
 * Devuelve los ids realmente añadidos.
 */
async function addToHistorico(ids) {
  if (!ids.length) return [];
  let content;
  try {
    content = await readFile(HISTORICO_FILE, 'utf8');
  } catch {
    return [];
  }
  const marker = 'export const historicalIds';
  const idx = content.indexOf(marker);
  if (idx === -1) return [];

  const prefix = content.slice(0, idx); // bloque de comentario/documentación
  const arrayPart = content.slice(idx);

  // ids reales ya presentes (líneas con comillas que NO estén comentadas)
  const existing = [];
  for (const line of arrayPart.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    const m = trimmed.match(/^"([^"]+)",?$/);
    if (m) existing.push(m[1]);
  }

  const seen = new Set(existing);
  const added = [];
  for (const id of ids) {
    if (!seen.has(id)) {
      existing.push(id);
      seen.add(id);
      added.push(id);
    }
  }
  if (!added.length) return [];

  const body = existing.map((id) => `  "${id}",`).join('\n');
  await writeFile(HISTORICO_FILE, `${prefix}export const historicalIds: string[] = [\n${body}\n];\n`);
  return added;
}

/** Llama a `gh api <ruta> --jq <expr>` y devuelve el texto, o null si falla. */
async function gh(apiPath, jq) {
  try {
    const args = ['api', apiPath, '-H', 'Accept: application/vnd.github+json'];
    if (jq) args.push('--jq', jq);
    const { stdout } = await execFileAsync('gh', args, { maxBuffer: 10 * 1024 * 1024 });
    return stdout.trim();
  } catch {
    return null;
  }
}

/** Extrae { owner, repo } de una URL de github.com, o null. */
function parseRepo(url) {
  if (!url) return null;
  const m = url.match(/github\.com[/:]([^/]+)\/([^/#?]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

/** Devuelve solo el bloque de frontmatter (entre los dos primeros ---). */
function splitFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  return { fm: m[1], rest: content.slice(m[0].length), raw: m[0] };
}

/** Sustituye/inserta una clave de primer nivel en el frontmatter. */
function setField(fm, key, value) {
  const line = `${key}: ${value}`;
  const re = new RegExp(`^${key}:.*$`, 'm');
  if (re.test(fm)) return fm.replace(re, line);
  return `${fm}\n${line}`;
}

/** Elimina una clave de primer nivel del frontmatter. */
function removeField(fm, key) {
  return fm.replace(new RegExp(`^${key}:.*\\n?`, 'm'), '');
}

/** Lee el valor (sin comillas) de una clave de primer nivel. */
function getField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return undefined;
  return m[1].trim().replace(/^["']|["']$/g, '');
}

async function fetchRepoMeta({ owner, repo }) {
  const repoJson = await gh(
    `/repos/${owner}/${repo}`,
    '{stars: .stargazers_count, archived: .archived, pushed: .pushed_at}'
  );
  if (!repoJson) return null;
  let info;
  try {
    info = JSON.parse(repoJson);
  } catch {
    return null;
  }
  // Última release (puede no existir → null)
  let version = await gh(`/repos/${owner}/${repo}/releases/latest`, '.tag_name');
  if (!version) {
    // Fallback: última etiqueta
    const tag = await gh(`/repos/${owner}/${repo}/tags?per_page=1`, '.[0].name');
    version = tag || null;
  }
  return {
    stars: typeof info.stars === 'number' ? info.stars : null,
    archived: !!info.archived,
    lastCommit: info.pushed ? info.pushed.slice(0, 10) : null,
    version: version || null,
  };
}

async function processFile(file) {
  const filePath = path.join(POST_DIR, file);
  const content = await readFile(filePath, 'utf8');
  const parts = splitFrontmatter(content);
  if (!parts) return { file, status: 'sin-frontmatter' };

  // Los recursos históricos o ya archivados no se refrescan: sus datos quedan
  // congelados (no tiene sentido seguir consultando proyectos muertos/deprecados).
  const id = file.replace(/\.md$/, '');
  if (historicalSet.has(id) || getField(parts.fm, 'archived') === 'true') {
    return { file, status: 'omitido', reason: historicalSet.has(id) ? 'historico' : 'archivado' };
  }

  const repoUrl = getField(parts.fm, 'repo');
  const parsed = parseRepo(repoUrl);
  if (!parsed) return { file, status: repoUrl ? 'repo-no-github' : 'sin-repo' };

  const meta = await fetchRepoMeta(parsed);
  if (!meta) return { file, status: 'error-api', repo: `${parsed.owner}/${parsed.repo}` };

  let fm = parts.fm;
  if (meta.stars !== null) fm = setField(fm, 'stars', String(meta.stars));
  if (meta.lastCommit) fm = setField(fm, 'lastCommit', meta.lastCommit);
  if (meta.version) fm = setField(fm, 'version', JSON.stringify(meta.version));
  else fm = removeField(fm, 'version');

  // Inactividad: sin commits desde hace > INACTIVE_YEARS años. No aplica a repos
  // archivados (esos van por su propia vía) ni a los marcados con keepActive: true.
  const keepActive = getField(parts.fm, 'keepActive') === 'true';
  const inactive = !meta.archived && !keepActive && isInactiveSince(meta.lastCommit);

  if (meta.archived) {
    fm = setField(fm, 'archived', 'true');
    fm = setField(fm, 'status', 'archived');
  } else {
    fm = removeField(fm, 'archived');
    if (getField(fm, 'status') === 'archived') fm = setField(fm, 'status', 'active');
  }

  if (inactive) {
    fm = setField(fm, 'status', 'inactive');
  } else if (!meta.archived && getField(fm, 'status') === 'inactive') {
    // Revivió (o se le puso keepActive): vuelve a activo.
    fm = setField(fm, 'status', 'active');
  }

  const newContent = `---\n${fm}\n---\n${parts.rest}`;
  if (newContent !== content) await writeFile(filePath, newContent);
  return {
    file,
    status: 'ok',
    repo: `${parsed.owner}/${parsed.repo}`,
    stars: meta.stars,
    version: meta.version,
    archived: meta.archived,
    inactive,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const files = argv.length ? argv : (await readdir(POST_DIR)).filter((f) => f.endsWith('.md'));

  historicalSet = await readHistoricoSet();

  const results = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((f) => processFile(f).catch((e) => ({ file: f, status: 'excepcion', error: String(e) })))
    );
    for (const r of batchResults) {
      results.push(r);
      if (r.status === 'ok') {
        const flags = [
          r.stars != null ? `★${r.stars}` : '',
          r.version || '',
          r.archived ? 'ARCHIVADO' : '',
          r.inactive ? 'INACTIVO' : '',
        ]
          .filter(Boolean)
          .join(' ');
        console.log(`✓ ${r.file.padEnd(14)} ${r.repo} ${flags}`);
      } else if (r.status === 'omitido') {
        console.log(`· ${r.file.padEnd(14)} omitido (${r.reason})`);
      } else if (!['sin-repo', 'repo-no-github'].includes(r.status)) {
        console.log(`✗ ${r.file.padEnd(14)} ${r.status}${r.repo ? ' ' + r.repo : ''}`);
      }
    }
  }

  // Los repos detectados como archivados o inactivos en esta pasada se añaden al histórico.
  const historicoIds = results.filter((r) => r.archived || r.inactive).map((r) => r.file.replace(/\.md$/, ''));
  const added = await addToHistorico(historicoIds);
  if (added.length) {
    console.log(`\n📁 Añadidos al histórico (src/historico.ts): ${added.join(', ')}`);
  }

  const by = (s) => results.filter((r) => r.status === s).length;
  console.log(
    `\nResumen: ${by('ok')} actualizados · ${by('omitido')} omitidos (historico/archivado) · ${by('sin-repo')} sin repo · ` +
      `${by('repo-no-github')} repo no-GitHub · ${by('error-api') + by('excepcion')} con error · ` +
      `${results.filter((r) => r.archived).length} archivados · ${results.filter((r) => r.inactive).length} inactivos`
  );
}

main();
