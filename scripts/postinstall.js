// Installs CocoaPods after `yarn install`. Runs only on macOS: iOS builds need Xcode.
const { execSync } = require('node:child_process');
const path = require('node:path');

if (process.platform !== 'darwin') {
  process.exit(0);
}

const root = path.resolve(__dirname, '..');
const run = (command, cwd) => execSync(command, { cwd, stdio: 'inherit' });

run('bundle install', root);
run('bundle exec pod install', path.join(root, 'ios'));
