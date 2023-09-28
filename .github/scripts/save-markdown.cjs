const fs = require("fs");
const path = require("path");

const saveContent = ({ path, issue, core }) => {
  let markdown = "---\n";
  markdown += `title: ${issue.title}\n'`;

  if (issue.labels && issue.labels.length > 0) {
    markdown += `labels:\n ${issue.labels
      .map((label) => `  - ${label}`)
      .join("\n")}`;
  }

  markdown += "---\n";
  markdown += issue.body;

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