const { createClient } = require('@supabase/supabase-js');

let supabaseClient;

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
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
};
