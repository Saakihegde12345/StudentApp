#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

function startService(name, command) {
  const child = spawn(command, { shell: true });

  child.stdout.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`[${name}] ${data}`);
  });

  child.on('exit', (code, signal) => {
    const when = new Date().toISOString();
    if (code === 0) {
      console.log(`[${name}] exited normally (code 0) at ${when}`);
    } else {
      console.error(`[${name}] exited with code ${code || signal} at ${when}`);
    }
  });

  child.on('error', (err) => {
    console.error(`[${name}] spawn error:`, err);
  });

  return child;
}

(async function main() {
  // Commands run through the shell; this keeps them cross-shell compatible
  const commands = [
    { name: 'backend', command: 'npm --prefix backend run start' },
    { name: 'frontend', command: 'npm --prefix frontend run start' }
  ];

  const children = {};
  let firstFailure = null;

  for (const item of commands) {
    console.log(`Starting ${item.name}...`);
    children[item.name] = startService(item.name, item.command);

    // listen for exit to detect failures and optionally shutdown the other
    children[item.name].on('exit', (code, signal) => {
      if (code !== 0 && firstFailure === null) {
        firstFailure = { name: item.name, code: code || signal, time: new Date().toISOString() };
        console.error(`\n[STARTUP] ${item.name} failed first with code ${code || signal} at ${firstFailure.time}`);
        // attempt to stop other services to make failure obvious
        for (const [otherName, proc] of Object.entries(children)) {
          if (otherName !== item.name && proc && !proc.killed) {
            try {
              console.log(`[STARTUP] Stopping ${otherName} due to ${item.name} failure...`);
              proc.kill();
            } catch (e) {
              console.warn(`[STARTUP] Could not stop ${otherName}:`, e && e.message ? e.message : e);
            }
          }
        }
      }
    });
  }

  // exit handling: when all children exit, decide exit code
  const exitStates = {};
  for (const item of commands) {
    children[item.name].on('close', (code) => {
      exitStates[item.name] = code;
      const remaining = Object.keys(exitStates).length !== commands.length;
      if (!remaining) {
        // all done
        if (firstFailure) {
          console.error(`[STARTUP] Services completed. First failure: ${firstFailure.name} (code ${firstFailure.code})`);
          process.exit(typeof firstFailure.code === 'number' ? firstFailure.code : 1);
        } else {
          console.log('[STARTUP] All services exited successfully.');
          process.exit(0);
        }
      }
    });
  }
})();
