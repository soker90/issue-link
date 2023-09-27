const fs = require("fs");
const path = require("path");

const toKebabCase = (phrase) => {
  const words = phrase.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].toLowerCase();
    words[i] = words[i].replace(/([a-z])([A-Z])/g, "$1-$2");
  }
  return words.join("-");
};

const saveContent = ({ path, issue }) => {
  let markdown = "---\n";
  markdown += `'title: ${issue.title}\n'`;

  if (issue.labels?.length > 0) {
    markdown += `labels:\n ${issue.labels
      .map((label) => `  - ${label}\n`)
      .join(" ")}\n`;
  }
  
  markdown += "---\n";
  writeToFile(markdown, path, issue.title);
  writeToFile(issue.body, path, issue.title);
};

const writeToFile = (string, path, nameFile) =>
  fs.writeFileSync(`${path}/${toKebabCase(nameFile)}.md`, string, {
    encoding: "utf8",
    overwrite: true,
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
  saveContent({ path, issue });

  core.info("Current markdown file updated");
};
