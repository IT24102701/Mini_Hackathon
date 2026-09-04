const {
  getSupabaseClient,
  hasSupabaseConfig,
  hasServerSupabaseKey,
} = require('../services/supabase');
const { searchBoardings } = require('../services/searchService');
const { rankBoardings } = require('../services/matchingService');

function getSupabaseOrRespond(res) {
  if (!hasSupabaseConfig()) {
    res.status(500).json({
      success: false,
      message:
        'Supabase is not configured. Add SUPABASE_URL and SUPABASE_KEY in server/.env.',
    });
    return null;
  }

  if (!hasServerSupabaseKey()) {
    res.status(500).json({
      success: false,
      message:
        'Supabase is using a publishable key. Set SUPABASE_KEY to a server Secret key or service_role key in server/.env, then restart the server.',
    });
    return null;
  }

  return getSupabaseClient();
}

function parseBoardingId(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

async function getAllBoardings(req, res) {
  const supabase = getSupabaseOrRespond(res);

  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from('boardings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'We could not load boardings right now. Please try again.',
    });
  }

  return res.status(200).json({
    success: true,
    data: data || [],
  });
}

async function searchBoardingsByPreferences(req, res) {
  const supabase = getSupabaseOrRespond(res);

  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from('boardings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'We could not search boardings right now. Please try again.',
    });
  }

  const matches = searchBoardings(data || [], req.query);

  return res.status(200).json({
    success: true,
    data: rankBoardings(matches, req.query),
  });
}

async function getBoardingById(req, res) {
  const boardingId = parseBoardingId(req.params.id);

  if (!boardingId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid boarding ID.',
    });
  }

  const supabase = getSupabaseOrRespond(res);

  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from('boardings')
    .select('*')
    .eq('id', boardingId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'We could not load that boarding right now. Please try again.',
    });
  }

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Boarding not found.',
    });
  }

  return res.status(200).json({
    success: true,
    data,
  });
}

async function createBoarding(req, res) {
  const supabase = getSupabaseOrRespond(res);

  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from('boardings')
    .insert([req.validatedBoarding || req.body])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'We could not create the boarding right now. Please try again.',
    });
  }

  return res.status(201).json({
    success: true,
    data,
  });
}

module.exports = {
  getAllBoardings,
  searchBoardingsByPreferences,
  getBoardingById,
  createBoarding,
};
