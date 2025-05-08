import { supabase } from './supabaseClient';

export const fetchTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('team_name');

  if (error) {
    console.error('Error fetching teams from Supabase:', error);
    return [];
  }

  return data;  // ✅ This now properly belongs to fetchTeams
};

// Placeholder functions

export const fetchSeasons = async () => {
  const { data, error } = await supabase
    .rpc('get_distinct_seasons');

  if (error) {
    console.error('Error fetching seasons:', error);
    return [];
  }

  return data.map(item => item.season);
};


export const fetchGameStats = async (season1, team1, season2, team2) => {
  if (!season1 || !team1 || !season2 || !team2) {
    console.error("Missing parameters for game stats fetch");
    return [];
  }

  const { data, error } = await supabase.rpc('fetch_game_stats', {
    season1,
    team1,
    season2,
    team2,
  });

  if (error) {
    console.error("Error fetching game stats via RPC:", error);
    return [];
  }

  return data;
};


export const fetchRecordBreakdown = async (season1, team1, season2, team2) => {
  const { data, error } = await supabase.rpc('get_record_breakdown', {
    season1,
    team1,
    season2,
    team2,
  });

  if (error) {
    console.error('Error calling get_record_breakdown RPC:', error);
    return [];
  }

  return data;
};


export const fetchPostseasonResults = async (season1, team1, season2, team2) => {
  const { data, error } = await supabase
    .rpc('fetch_postseason_results', {
      season1,
      team1,
      season2,
      team2
    });

  if (error) {
    console.error("Error fetching postseason results:", error);
    return [];
  }

  return data;
};


export const fetchRecruitingRankings = async (season1, team1, season2, team2) => {
  if (!season1 || !team1 || !season2 || !team2) return [];

  const { data, error } = await supabase.rpc('fetch_recruiting_rankings', {
    season1,
    team1,
    season2,
    team2
  });

  if (error) {
    console.error('Error fetching recruiting rankings:', error);
    return [];
  }

  return data;
};


export const fetchTeamGameStats = async (team) => {
  try {
    // Step 1: Get all distinct seasons
    const { data: seasonData, error: seasonError } = await supabase
      .from('game_results')
      .select('season')
      .order('season', { ascending: true });

    if (seasonError) {
      console.error('Error fetching seasons:', seasonError);
      return [];
    }

    const seasons = [...new Set(seasonData.map(item => item.season))];

    // Step 2: Fetch game stats for the given team across those seasons
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .in('season', seasons)
      .eq('team_name', team)
      .order('season', { ascending: true });

    if (error) {
      console.error('Error fetching team game stats:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in fetchTeamGameStats:', err);
    return [];
  }
};


export async function fetchTeamRecordBreakdown(team) {
  return [];
}

export async function fetchTeamPostseasonResults(team) {
  return [];
}

export async function fetchTeamRecruitingRankings(team) {
  return [];
}

export const fetchGamePerformance = async (team, season) => {
  return [];
};

export const fetchPassLeaders = async () => {
  return [];
};

export const fetchRushLeaders = async () => {
  return [];
};

export const fetchExplosiveLeaders = async () => {
  return [];
};

export const fetchPassDefenseLeaders = async () => {
  return [];
};

export const fetchRushDefenseLeaders = async () => {
  return [];
};

export const fetchContainmentLeaders = async () => {
  return [];
};
