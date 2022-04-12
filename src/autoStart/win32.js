const { join, basename, dirname } = require('path');

const registry = require('../utils/registry');


const appName = basename(process.execPath, '.exe');

const queuePrefix = [ 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', '/v', appName ];

exports.install = (callback) => {
  const execPath = join(dirname(process.execPath), '..', 'Update.exe') + ` --processStart ${basename(process.execPath)}` + (settings.get('START_MINIMIZED', false) ? ' --process-start-args --start-minimized' : ''); // Add Electron args if start minimized on
  registry.add([[ ...queuePrefix, '/d', execPath ]], callback); // Make reg
};

exports.update = (callback) => exports.isInstalled(installed => installed ? exports.install(callback) : callback()); // Reinstall if installed, else just callback

exports.uninstall = (callback) => registry.spawn([ 'delete', ...queuePrefix, '/f' ], () => callback()); // Delete reg

exports.isInstalled = (callback) => registry.spawn([ 'query', ...queuePrefix ], () => callback(stdout.includes(appName))); // Check reg