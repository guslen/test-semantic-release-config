import archiver, { Format } from 'archiver';
import { join as pathJoin } from 'path';
import { createWriteStream } from 'fs';
import { rimrafSync } from 'rimraf';

type Archive = {
  archiveName: string;
  inputDirectory: string;
  archiveTypes: Format[];
};

const rootDirectory = process.cwd();
const defaultArchiveTypes: Format[] = ['zip', 'tar'];
const archives: Archive[] = [
  {
    archiveName: 'dist',
    inputDirectory: pathJoin(rootDirectory, 'dist'),
    archiveTypes: defaultArchiveTypes,
  },
];

const createdArchives: string[] = [];
const archiveCallbacks = archives.flatMap(({ archiveName, inputDirectory, archiveTypes }) => {
  return archiveTypes.map((archiveType) => {
    const archiveOutputPath = pathJoin(rootDirectory, `${archiveName}.${archiveType}`);
    rimrafSync(archiveOutputPath);
    const archiverType = archiver(archiveType);
    archiverType.directory(inputDirectory, false);
    archiverType.pipe(createWriteStream(archiveOutputPath));
    createdArchives.push(archiveOutputPath);
    return archiverType.finalize();
  });
});

Promise.all(archiveCallbacks)
  .then(() => {
    console.log('Archives created at', createdArchives);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
