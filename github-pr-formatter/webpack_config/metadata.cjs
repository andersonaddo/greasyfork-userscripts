//https://github.com/Trim21/userscript-metadata-webpack-plugin
module.exports = {
  name: "Github thing",
  namespace: "happyviking",
  version: 1.0,
  description: "This does a thing",
  author: "HappyViking",
  match: ["*://github.com/"],
  "run-at": "document-end",
  require: [] //This needs to be here if I don't require anything so my dev npm script works
};
