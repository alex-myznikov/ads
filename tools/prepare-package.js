const fs = require('fs-extra');
const path = require('path');
const cachedManifestFile = path.resolve(__dirname, '../cached-package.json');
const manifestFile = path.resolve(__dirname, '../package.json');
const aliases = ['lists', 'maps', 'queues', 'searches', 'text-processing', 'trees', 'errors', 'comparators'];
const devManifestFields = ['scripts', 'devDependencies', 'nyc'];

// Prepare aliases to import sources from 'ads-js/<source_group_name>'
aliases
  .forEach(alias => {
    const aliasPath = path.resolve(__dirname, `../${alias}`);

    if (fs.existsSync(aliasPath)) fs.removeSync(aliasPath);
    fs.ensureDirSync(aliasPath);
    fs.writeJSONSync(`${aliasPath}/package.json`, {
      name: `ads-js/${alias}`,
      main: `../dist/cjs/${alias}/index.js`,
      module: `../dist/esm/${alias}/index.js`,
      types: `../dist/types/${alias}/index.d.ts`,
    }, { spaces: 2 });
  });

// Strip unnecessary sections out of published package.json version
fs.copyFileSync(manifestFile, cachedManifestFile);
Object.entries(fs.readJSONSync(manifestFile)).reduce((acc, cur) => {
  if (!devManifestFields.includes(cur[0])) acc[cur[0]] = cur[1];

  return acc;
}, {});
