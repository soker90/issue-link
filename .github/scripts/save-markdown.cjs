const fs = require('fs');
const path = require('path');

const saveReadmeContent = (string, path, nameFile) =>
  fs.writeFileSync(`${path}/${nameFile}.md`, string, {
    encoding: 'utf8',
  });

/**
 * @param {{
 *  github: InstanceType<typeof import('@actions/github/lib/utils').GitHub>,
 *  context: import('@actions/github/lib/context').Context,
 *  core: import('@actions/core'),
 *  exec: import('@actions/exec')
 * }}
 */
module.exports = async function download({ github, context, core, issue }, path) {
  core.info("Loading issue data");

  const { title, body } = issue;
  core.info(`Issue loaded: ${title}`);


  core.info('Updating markdown file');
  saveReadmeContent(body, path, 'test');


  core.info("Current markdown file updated");
};
