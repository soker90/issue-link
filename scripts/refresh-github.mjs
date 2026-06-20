#!/usr/bin/env node
/**
 * Actualiza los metadatos de GitHub de cada post que tenga un repositorio asociado:
 *   - stars       → número de estrellas
 *   - lastCommit  → fecha del último push al repo (YYYY-MM-DD)
 *   - version     → última release publicada (si tiene)
 *   - archived    → true si el repo está archivado (además fija status: archived)
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
const CONCURRENCY = 6;

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
  const repoJson = await gh(`/repos/${owner}/${repo}`, '{stars: .stargazers_count, archived: .archived, pushed: .pushed_at}');
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

  if (meta.archived) {
    fm = setField(fm, 'archived', 'true');
    fm = setField(fm, 'status', 'archived');
  } else {
    fm = removeField(fm, 'archived');
    if (getField(fm, 'status') === 'archived') fm = setField(fm, 'status', 'active');
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
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const files = argv.length ? argv : (await readdir(POST_DIR)).filter((f) => f.endsWith('.md'));

  const results = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map((f) => processFile(f).catch((e) => ({ file: f, status: 'excepcion', error: String(e) }))));
    for (const r of batchResults) {
      results.push(r);
      if (r.status === 'ok') {
        const flags = [r.stars != null ? `★${r.stars}` : '', r.version || '', r.archived ? 'ARCHIVADO' : ''].filter(Boolean).join(' ');
        console.log(`✓ ${r.file.padEnd(14)} ${r.repo} ${flags}`);
      } else if (!['sin-repo', 'repo-no-github'].includes(r.status)) {
        console.log(`✗ ${r.file.padEnd(14)} ${r.status}${r.repo ? ' ' + r.repo : ''}`);
      }
    }
  }

  const by = (s) => results.filter((r) => r.status === s).length;
  console.log(
    `\nResumen: ${by('ok')} actualizados · ${by('sin-repo')} sin repo · ${by('repo-no-github')} repo no-GitHub · ` +
      `${by('error-api') + by('excepcion')} con error · ${results.filter((r) => r.archived).length} archivados`
  );
}

main();
