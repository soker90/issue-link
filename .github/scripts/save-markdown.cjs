const fs = require("fs");
const path = require("path");

const formatBody = (body) => {
  const elements = {};
  const regex = /### --> ([^\n]+)\n([\s\S]*?)(?=(### --> |$))/g;
  let match;

  while ((match = regex.exec(body)) !== null) {
    const section = match[1].trim();
    const content = match[2].trim();

    elements[section] = content;
  }

  return elements;
};

const clearTitle = (title) => title.replace(/\[link\]: /, "");

const isFieldValid = (field) => field && field!=='_No response_';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const isDuplicate = (dirPath, link, currentFilename) => {
  if (!link) return null;

  const cleanLink = link.trim().toLowerCase();

  // Extract github owner/repo if it's a GitHub URL
  const ghMatch = cleanLink.match(/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/);
  const ghRepo = ghMatch ? ghMatch[1].replace(/\.git$/, '').toLowerCase() : null;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

  for (const file of files) {
    if (file === currentFilename) continue;

    try {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');

      // Check link: field in frontmatter
      const linkMatch = content.match(/^link:\s*"?([^"\n]+)"?/m);
      if (linkMatch) {
        const existingLink = linkMatch[1].replace(/['"]/g, "").trim().toLowerCase();
        if (existingLink === cleanLink) {
          return file;
        }
      }

      // Check repo: field in frontmatter
      const repoMatch = content.match(/^repo:\s*"?([^"\n]+)"?/m);
      if (repoMatch) {
        const existingRepo = repoMatch[1].replace(/['"]/g, "").trim().toLowerCase();
        if (existingRepo === cleanLink) {
          return file;
        }
      }

      // If it's a GitHub URL, check if the repo matches
      if (ghRepo) {
        const matches = content.matchAll(/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/gi);
        for (const match of matches) {
          const existingGhRepo = match[1].replace(/\.git$/, '').toLowerCase();
          if (existingGhRepo === ghRepo) {
            return file;
          }
        }
      }
    } catch (e) {
      // Ignore read errors
    }
  }

  return null;
};

const getFilename = (dirPath, issue) => {
  // 1. If issue-specific file already exists, keep updating it
  const prefixedFilename = `issue-${issue.number}`;
  const prefixedPath = path.join(dirPath, `${prefixedFilename}.md`);
  if (fs.existsSync(prefixedPath)) {
    return prefixedFilename;
  }

  // 2. If legacy number-only file exists, check if it's the same resource
  const defaultFilename = `${issue.number}`;
  const defaultPath = path.join(dirPath, `${defaultFilename}.md`);
  if (fs.existsSync(defaultPath)) {
    try {
      const content = fs.readFileSync(defaultPath, "utf8");
      const titleMatch = content.match(/^title:\s*(.*)$/m);
      if (titleMatch) {
        const existingTitle = titleMatch[1].replace(/['"]/g, "").trim();
        const cleanIssueTitle = clearTitle(issue.title).trim();
        if (existingTitle.toLowerCase() === cleanIssueTitle.toLowerCase()) {
          return defaultFilename;
        }
      }
    } catch (e) {
      // Ignore read error
    }
  }

  // 3. Otherwise, use the prefixed name to avoid collisions
  return prefixedFilename;
};

const saveContent = ({ path: dirPath, issue, core }) => {
  const formated = formatBody(issue.body);
  const nameFile = getFilename(dirPath, issue);

  const link = formated["Enlace"];
  if (isFieldValid(link)) {
    const duplicateFile = isDuplicate(dirPath, link, `${nameFile}.md`);
    if (duplicateFile) {
      core.warning(`Duplicate resource detected! The link ${link} is already present in ${duplicateFile}. Skipping generation.`);
      return;
    }
  }

  let markdown = "---\n";
  markdown += `title: ${clearTitle(issue.title)}\n`;
  markdown += `publishDate: ${issue.updated_at}\n`;

  if(isFieldValid(link))
    markdown += `link: ${link}\n`;

  const excerpt = formated["Descripción"];
  if(isFieldValid(excerpt))
    markdown += `excerpt: ${excerpt}\n`;

  const aditional = formated["Enlaces adicionales"];
  if (isFieldValid(aditional)) {
    const indentedAditional = aditional.split("\n").map(line => `  ${line}`).join("\n");
    markdown += `aditional:\n${indentedAditional}\n`;
  }

  const internal = formated["Otros enlaces internos relacionados"];
  if (isFieldValid(internal)) {
    const indentedInternal = internal.split("\n").map(line => `  ${line}`).join("\n");
    markdown += `internal:\n${indentedInternal}\n`;
  }

  if (issue.labels && issue.labels.length > 0) {
    core.info("Labels found");
    markdown += `tags:\n${issue.labels
      .map((label) => `  - ${label.name}`)
      .join("\n")}\n`;
  }

  markdown += "---\n";

  const body = formated["Cuerpo"];
  if(isFieldValid(body))
    markdown += body;

  core.info(`Markdown: ${markdown}`);

  writeToFile(markdown, dirPath, nameFile);
};

const writeToFile = (string, path, nameFile, overwrite = false) =>
  fs.writeFileSync(`${path}/${nameFile}.md`, string, {
    encoding: "utf8",
    overwrite,
  });

/**
 * @param {{
 *  github: InstanceType<typeof import('@actions/github/lib/utils').GitHub>,
 *  context: import('@actions/github/lib/context').Context,
 *  core: import('@actions/core'),
 *  exec: import('@actions/exec')
 * }}
 */
module.exports = async function download(
  { github, context, core, issue },
  path
) {
  core.info("Loading issue data");

  const { title } = issue;
  core.info(`Issue loaded: ${title}`);

  core.info("Updating markdown file");
  saveContent({ path, issue, core });

  core.info("Current markdown file updated");
};
