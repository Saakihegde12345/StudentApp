const fs = require('fs');
const path = require('path');

const out = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
};
// Include API base URL for runtime configuration (used in production)
out.API_BASE_URL = process.env.API_BASE_URL || '';

const content = `window.__env = ${JSON.stringify(out)};`;
const outPath = path.join(__dirname, '..', 'public', 'env.js');
fs.writeFileSync(outPath, content, { encoding: 'utf8' });
console.log('Wrote', outPath);
