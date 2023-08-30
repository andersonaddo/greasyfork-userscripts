//https://github.com/Trim21/userscript-metadata-webpack-plugin
module.exports = {
  name: "Github thing",
  namespace: "happyviking",
  version: 1.0,
  description: "This does a thing",
  author: "HappyViking",
  match: ["https://github.com/*/pulls*"],
  exclude: ["https://github.com/*/pulls/*"],
  "run-at": "document-end",
  //The `require` field needs to be here, even if I don't require anything so my dev npm script works
  require: [""] 
};
