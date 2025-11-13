const { createClient } = require('@supabase/supabase-js');
const User = require('../models/user.model');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} else {
  // If the service role key isn't configured we can't verify tokens server-side.
  // In that case middleware will reject requests and log a clear message.
  // Make sure to set SUPABASE_SERVICE_ROLE_KEY in your backend .env for verification.
  // eslint-disable-next-line no-console
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY not configured; Supabase token verification is disabled.');
}

module.exports = async function verifySupabase(req, res, next) {
  if (!supabase) return res.status(401).json({ error: 'Supabase verification not configured' });

  const header = req.headers.authorization || req.headers.Authorization;
  const token = header && header.split && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing Authorization token' });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = data.user;

    // Sync minimal profile to MongoDB (upsert)
    try {
      await User.findOneAndUpdate(
        { supabaseId: user.id },
        { supabaseId: user.id, email: user.email, name: user.user_metadata?.full_name || user.email },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (syncErr) {
      // Log and continue — user verification succeeded so allow request
      // eslint-disable-next-line no-console
      console.warn('Failed to sync Supabase user to MongoDB:', syncErr.message || syncErr);
    }

    req.user = user;
    next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error verifying Supabase token:', err.message || err);
    return res.status(401).json({ error: 'Token verification failed' });
  }
};
