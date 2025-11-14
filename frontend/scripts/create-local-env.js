const fs = require('fs');
const path = require('path');

// Look for values in environment first
let supabaseUrl = process.env.SUPABASE_URL || '';
let supabaseAnon = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON || '';
let apiBase = process.env.API_BASE_URL || 'http://localhost:3000';

// If not found in env, try repo root .env
if (!supabaseUrl || !supabaseAnon) {
  try {
    const repoEnvPath = path.join(__dirname, '..', '..', '.env');
    if (fs.existsSync(repoEnvPath)) {
      const content = fs.readFileSync(repoEnvPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
        if (!m) return;
        const k = m[1];
        let v = m[2] || '';
        // strip optional quotes
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
        if (!supabaseUrl && k === 'SUPABASE_URL') supabaseUrl = v;
        if (!supabaseAnon && (k === 'SUPABASE_ANON_KEY' || k === 'SUPABASE_ANON')) supabaseAnon = v;
        if (k === 'API_BASE_URL') apiBase = v;
      });
    }
  } catch (err) {
    // ignore
  }
}

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL. Please set SUPABASE_URL in environment or in the repo .env file.');
  process.exit(2);
}

if (!supabaseAnon) {
  console.error('Missing SUPABASE_ANON_KEY. Do NOT use the service-role key in the frontend. Create a public anon key in your Supabase project and set SUPABASE_ANON_KEY in environment or the repo .env.');
  process.exit(2);
}

const out = `window.__env = ${JSON.stringify({ SUPABASE_URL: supabaseUrl, SUPABASE_ANON_KEY: supabaseAnon, API_BASE_URL: apiBase }, null, 2)};\n`;
const outPath = path.join(__dirname, '..', 'public', 'env.js');
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath);
