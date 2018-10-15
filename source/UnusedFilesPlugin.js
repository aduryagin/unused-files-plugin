import fs from 'fs';
import { getAllFiles } from './utils';

export class UnusedFilesPlugin {
  constructor(options) {
    this.options = {
      ignore: [/node_modules/, /\.DS_Store/, /__tests?__/],
      remove: false,
      ...options,
    };

    if (!options.folders) throw new Error('You must specify `folders` option.');
    if (!Array.isArray(options.folders)) throw new Error('`folders` must be array.');
    if (!Array.isArray(options.ignore)) throw new Error('`ignore` must be array.');

    this.dependencies = [];
  }

  filterDependencies(dependencies) {
    return dependencies.filter(dep => !this.options.ignore.some(ignoreMatch => ignoreMatch.test(dep)));
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('UnusedFilesPlugin', async (compilation, callback) => {
      const dependencies = this.filterDependencies(Array.from(compilation.fileDependencies));
      this.dependencies = this.dependencies.concat(dependencies);
      callback();
    });

    compiler.hooks.afterEmit.tapAsync('UnusedFilesPlugin', async (compilation, callback) => {
      const sourceFolders = this.options.folders;

      await Promise.all(
        sourceFolders.map(
          sourceFolder =>
            new Promise(resolve => {
              const files = this.filterDependencies(getAllFiles(sourceFolder));

              files.forEach(file => {
                if (this.dependencies.indexOf(file) === -1) {
                  console.log(file);
                  if (this.options.remove) fs.unlinkSync(file);
                }
              });
              resolve();
            })
        )
      );

      callback();
    });
  }
}

export default UnusedFilesPlugin;
