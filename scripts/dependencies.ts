import { execFileSync } from 'child_process';
import os from 'os';
import DependencyVersions from './download/dependencies';
import downloadDependencies from './download/tools';
import downloadMobyOpenAPISpec from './download/moby-openapi';

async function runScripts(): Promise<void> {
  // load desired versions of dependencies
  const depVersions = await DependencyVersions.fromYAMLFile('dependencies.yaml');

  // download the desired versions
  await downloadMobyOpenAPISpec();
  switch (os.platform()) {
  case 'linux':
    await downloadDependencies('linux', depVersions);
    await (await import('./download/lima.mjs')).default();
    break;
  case 'darwin':
    await downloadDependencies('darwin', depVersions);
    await (await import('./download/lima.mjs')).default();
    break;
  case 'win32':
    await downloadDependencies('win32', depVersions);
    await downloadDependencies('wsl', depVersions);
    await (await import('./download/wsl.mjs')).default();
    break;
  }
}

runScripts().then(() => {
  execFileSync('node', ['node_modules/electron-builder/out/cli/cli.js', 'install-app-deps'], { stdio: 'inherit' });
})
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
