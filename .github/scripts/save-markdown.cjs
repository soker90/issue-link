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

const saveContent = ({ path, issue, core }) => {
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

  writeToFile(markdown, path, issue.number);
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
