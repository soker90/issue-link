const github = require("@actions/github");
const fs = require("fs");
const path = require("path");
const { repoConfig, slogan, base } = require("../src/.vuepress/config");

const { owner, repo } = repoConfig;
const issueFile = path.resolve(__dirname, "./issues.json");
const cateFile = path.resolve(__dirname, "./cates.json");

let token = null;
if (process.env.NODE_ENV == "local") {
  token = require("./config").token;
} else if (process.env.NODE_ENV == "action") {
  token = process.env.GITHUB_TOKEN;
} else {
  throw error("Wrong Enviorment Params!");
}
