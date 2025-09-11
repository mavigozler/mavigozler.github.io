npx json -I -f package.json -e 'this.scripts={
  dev:"node server.js",
  build:"webpack --mode production",
  test:"jest"
}'