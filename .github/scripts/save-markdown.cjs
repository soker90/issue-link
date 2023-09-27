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

const saveReadmeContent = (string, path, nameFile) =>
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

  const { title, body } = issue;
  core.info(`Issue loaded: ${title}`);

  core.info("Updating markdown file");
  saveReadmeContent(body, path, title);

  core.info("Current markdown file updated");
};
