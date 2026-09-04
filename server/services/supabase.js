const { createClient } = require('@supabase/supabase-js');

let supabaseClient;

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
}

function hasServerSupabaseKey() {
  const key = process.env.SUPABASE_KEY || '';

  if (key.startsWith('sb_secret_')) {
    return true;
  }

  try {
    const [, payload] = key.split('.');
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return claims.role === 'service_role';
  } catch {
    return false;
  }
}

function getSupabaseClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }

  return supabaseClient;
}

module.exports = {
  getSupabaseClient,
  hasSupabaseConfig,
  hasServerSupabaseKey,
};
