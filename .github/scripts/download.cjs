module.exports = async function download({ github, context, core, exec }) {
  core.info("Loading issue data");

  const { title, body } = github.event.issue;

  core.info(`Issue loaded: ${title}`);

  core.setOutput("title", title);
  core.setOutput("body", body);

  core.info('Current issue loaded');
};
