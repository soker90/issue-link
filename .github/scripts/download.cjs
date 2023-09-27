/**
 * @param {{
 *  github: InstanceType<typeof import('@actions/github/lib/utils').GitHub>,
 *  context: import('@actions/github/lib/context').Context,
 *  core: import('@actions/core'),
 *  exec: import('@actions/exec')
 * }}
 */
module.exports = async function download({ github, context, core, exec, issue }) {
  core.info("Loading issue data");

  core.info(JSON.stringify(issue, null, 2));

  const { title, body } = issue;
  
  core.info(`Issue loaded: ${title}`);

  core.setOutput("title", title);
  core.setOutput("body", body);

  core.info("Current issue loaded");
};
