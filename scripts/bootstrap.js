#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

function runInstall(subdir) {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const cwd = path.resolve(__dirname, '..', subdir);
    console.log(`Running 'npm install' in ${cwd}`);
  // Use shell to improve cross-platform compatibility for locating 'npm'
  const child = spawn(npmCmd, ['install'], { cwd, stdio: 'inherit', shell: true });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`'npm install' failed in ${subdir} with exit code ${code}`));
      }
    });

    child.on('error', (err) => {
      // include code and errno for easier diagnosis
      const e = new Error(err.message || 'spawn error');
      e.code = err.code;
      e.errno = err.errno;
      reject(e);
    });
  });
}

(async function main() {
  try {
    await runInstall('backend');
    await runInstall('frontend');
    console.log('Bootstrap finished: backend and frontend dependencies installed.');
  } catch (err) {
    console.error('Bootstrap failed:', err.message || err);
    process.exit(1);
  }
})();
