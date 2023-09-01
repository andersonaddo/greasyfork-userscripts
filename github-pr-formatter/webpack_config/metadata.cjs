//https://github.com/Trim21/userscript-metadata-webpack-plugin
module.exports = {
  name: "Github PR Organizer & Formatter",
  namespace: "happyviking",
  description: "Organizes and tabs PRs to make it easier to see what to prioritize.",
  author: "HappyViking",
  match: ["https://github.com/*/pulls*"],
  exclude: ["https://github.com/*/pulls/*"],
  "run-at": "document-end",
  //The `require` field needs to be here, even if I don't require anything so my dev npm script works
  require: [""],
  version: "1.2.0",
  license: "MIT"
};
