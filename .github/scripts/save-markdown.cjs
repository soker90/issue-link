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

const getFilename = (dirPath, issue) => {
  const defaultFilename = `${issue.number}`;
  const defaultPath = path.join(dirPath, `${defaultFilename}.md`);
  if (!fs.existsSync(defaultPath)) {
    return defaultFilename;
  }

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

  return slugify(clearTitle(issue.title));
};

const saveContent = ({ path: dirPath, issue, core }) => {
  const formated = formatBody(issue.body);

  let markdown = "---\n";
  markdown += `title: ${clearTitle(issue.title)}\n`;
  markdown += `publishDate: ${issue.updated_at}\n`;

  const link = formated["Enlace"]
  if(isFieldValid(link))
    markdown += `link: ${link}\n`;

    const excerpt = formated["Descripción"]
    if(isFieldValid(excerpt))
      markdown += `excerpt: ${excerpt}\n`;

  const aditional = formated["Enlaces adicionales"]
  if(isFieldValid(aditional))
    markdown += `aditional:\n${aditional}\n`;

  const internal = formated["Otros enlaces internos relacionados"]
  if(isFieldValid(internal))
    markdown += `internal:\n${internal}\n`;

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

  const nameFile = getFilename(dirPath, issue);
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
