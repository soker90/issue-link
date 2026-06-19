#!/usr/bin/env node
/**
 * sync-stars.mjs
 *
 * Compara las estrellas de GitHub del usuario con los repos ya presentes
 * en src/content/post/*.md y devuelve la lista de repos que faltan.
 *
 * Uso:
 *   node .opencode/scripts/sync-stars.mjs <github_user> [--token <GITHUB_TOKEN>]
 *
 * Salida (stdout): JSON array de objetos con la info de cada repo nuevo:
 *   [{ full_name, html_url, description, homepage, language, topics, stargazers_count, pushed_at }, ...]
 */

import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const POSTS_DIR = join(ROOT, 'src', 'content', 'post');

// ── args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const user = args[0];
const tokenIdx = args.indexOf('--token');
const token = tokenIdx !== -1 ? args[tokenIdx + 1] : process.env.GITHUB_TOKEN;

if (!user) {
  console.error('Uso: node sync-stars.mjs <github_user> [--token <GITHUB_TOKEN>]');
  process.exit(1);
}

// ── helpers ──────────────────────────────────────────────────────────────────
const headers = {
  'User-Agent': 'issue-link-sync',
  'Accept': 'application/vnd.github.v3+json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
};

async function fetchAllStarred(user) {
  const repos = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${user}/starred?per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.length === 0) break;
    repos.push(...data);
    page++;
  }
  return repos;
}

async function getExistingRepos() {
  const files = await readdir(POSTS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const repos = new Set();

  for (const file of mdFiles) {
    const content = await readFile(join(POSTS_DIR, file), 'utf8');

    // Buscar cualquier ocurrencia de github.com/owner/repo en todo el archivo
    const matches = content.matchAll(/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/gi);
    for (const match of matches) {
      repos.add(match[1].replace(/\.git$/, '').toLowerCase());
    }
  }
  return repos;
}

// ── main ─────────────────────────────────────────────────────────────────────
const [starred, existing] = await Promise.all([
  fetchAllStarred(user),
  getExistingRepos(),
]);

const missing = starred.filter(repo => {
  const key = repo.full_name.toLowerCase();
  return !existing.has(key);
});

const enriched = missing.map(r => ({
  full_name: r.full_name,
  html_url: r.html_url,
  description: r.description,
  homepage: r.homepage || null,
  language: r.language,
  topics: r.topics ?? [],
  stargazers_count: r.stargazers_count,
  pushed_at: r.pushed_at,
  archived: r.archived,
}));

// Ordenar de más a menos estrellas
enriched.sort((a, b) => b.stargazers_count - a.stargazers_count);

process.stdout.write(JSON.stringify(enriched, null, 2));
