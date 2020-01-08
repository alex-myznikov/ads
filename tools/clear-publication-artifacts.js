const fs = require('fs-extra');
const path = require('path');
const cachedManifestFile = path.resolve(__dirname, '../cached-package.json');
const manifestFile = path.resolve(__dirname, '../package.json');
const aliases = ['lists', 'maps', 'queues', 'searches', 'text-processing', 'trees', 'errors', 'comparators'];

aliases.forEach(alias => fs.removeSync(path.resolve(__dirname, `../${alias}`)));
fs.moveSync(cachedManifestFile, manifestFile, { overwrite: true });
