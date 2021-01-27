const {
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  rmSync
} = require('fs');
const { resolve, join, dirname } = require('path');
const { readdir } = require('fs').promises;
const tsconfig = require('./tsconfig.json');
const pkg = require('./package.json');

(async () => {
  const src = join(__dirname, tsconfig.compilerOptions.rootDir);

  const getFiles = async (dir, root) => {
    const dirents = await readdir(dir, { withFileTypes: true });
    const _files = await Promise.all(
      dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res, root) : res;
      })
    );

    return Array.prototype
      .concat(..._files)
      .filter(
        (file) =>
          !file.toString().endsWith('.ts') &&
          !file.toString().endsWith('.DS_Store')
      )
      .map((file) => file.toString().replace(root, ''));
  };

  const files = await getFiles(src, src);
  files.forEach((file) => {
    const dir = dirname(file);
    const fileName = file.replace(dir, '');
    const fullDir = join(__dirname, tsconfig.compilerOptions.outDir, dir);
    if (!existsSync(fullDir)) {
      mkdirSync(fullDir, {
        recursive: true
      });
    }

    copyFileSync(
      join(__dirname, tsconfig.compilerOptions.rootDir, file),
      join(fullDir, fileName)
    );
  });

  writeFileSync(
    join(__dirname, tsconfig.compilerOptions.outDir, 'package.json'),
    JSON.stringify(
      {
        ...pkg,
        scripts: {
          start: 'HOST=0.0.0.0 node index.js'
        },
        devDependencies: {}
      },
      null,
      2
    )
  );

  rmSync(join(__dirname, tsconfig.compilerOptions.outDir, '__tests__'), {
    recursive: true,
    force: true
  });
})();
