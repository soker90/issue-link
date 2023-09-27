module.exports = async function download () {
  core.info('Loading issue data')
  const { data: { body } } = await octokit.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  })

  core.info(data.body)

}
