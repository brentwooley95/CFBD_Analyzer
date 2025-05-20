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
    // Step 1: Get all distinct seasons via RPC
    const { data: seasonData, error: seasonError } = await supabase.rpc('get_distinct_seasons');

    if (seasonError) {
      console.error('Error fetching seasons:', seasonError);
      return [];
    }

    const seasons = seasonData.map(item => item.season); // Ensure you extract the values correctly

    // Step 2: Fetch game stats for the given team across all seasons
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
  const { data, error } = await supabase.rpc('fetch_team_record_breakdown', {
    team_input: team,
  });

  if (error) {
    console.error('Error fetching team record breakdown:', error);
    return [];
  }

  return data;
}


export async function fetchTeamPostseasonResults(team) {
  try {
    // Step 1: Get all distinct seasons via RPC
    const { data: seasonData, error: seasonError } = await supabase.rpc('get_distinct_seasons');

    if (seasonError) {
      console.error('Error fetching seasons:', seasonError);
      return [];
    }

    const seasons = seasonData.map(item => item.season);

    // Step 2: Fetch postseason results for the given team across those seasons
    const { data, error } = await supabase
      .from('postseason_results')
      .select(`
        team_name,
        season,
        postseason_name,
        opponent_name,
        result,
        team_score,
        opponent_score
      `)
      .eq('team_name', team)
      .in('season', seasons)
      .order('season', { ascending: true });

    if (error) {
      console.error('Error fetching postseason results:', error);
      return [];
    }

    // Step 3: Nullify irrelevant fields when postseason = 'No Postseason'
    const filtered = data.map(row => {
      if (row.postseason_name === 'No Postseason') {
        return {
          ...row,
          opponent_name: null,
          result: null,
          team_score: null,
          opponent_score: null,
        };
      }
      return row;
    });

    return filtered;
  } catch (err) {
    console.error('Unexpected error fetching postseason results:', err);
    return [];
  }
}


export async function fetchTeamRecruitingRankings(team) {
  try {
    // Step 1: Get all distinct seasons via RPC
    const { data: seasonData, error: seasonError } = await supabase.rpc('get_distinct_seasons');

    if (seasonError) {
      console.error('Error fetching seasons:', seasonError);
      return [];
    }

    const seasons = seasonData.map(item => item.season);

    // Step 2: Look up the team_id based on team name
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('team_id')
      .eq('team_name', team)
      .single();

    if (teamError || !teamData) {
      console.error('Error fetching team_id:', teamError || 'Team not found');
      return [];
    }

    const team_id = teamData.team_id;

    // Step 3: Query recruit_rankings directly by team_id and season
    const { data, error } = await supabase
      .from('recruit_rankings')
      .select('season, recruiting_rank, recruiting_points')
      .eq('team_id', team_id)
      .in('season', seasons)
      .order('season', { ascending: true });

    if (error) {
      console.error('Error fetching recruiting rankings:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in fetchTeamRecruitingRankings:', err);
    return [];
  }
}


export const fetchGamePerformance = async (team, season) => {
  const { data, error } = await supabase.rpc('fetch_single_game_performance', {
    team_input: team,
    season_input: season,
  });

  if (error) {
    console.error('Error fetching single game performance:', error);
    return [];
  }

  return data;
};


export const fetchPassLeaders = async () => {
  const { data, error } = await supabase
    .from("game_stats")
    .select("team_name, season, total_passing_offense_score")
    .gte("games_played", 6)
    .order("total_passing_offense_score", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching pass leaders:", error);
    return [];
  }

  return data;
};


export const fetchRushLeaders = async () => {
  const { data, error } = await supabase
    .from("game_stats")
    .select("team_name, season, total_rushing_offense_score")
    .gte("games_played", 6)
    .order("total_rushing_offense_score", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching rush leaders:", error);
    return [];
  }

  return data;
};

export const fetchExplosiveLeaders = async () => {
  const { data, error } = await supabase
    .from("game_stats")
    .select("team_name, season, avg_explosiveness")
    .gte("games_played", 6)
    .order("avg_explosiveness", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching explosiveness leaders:", error);
    return [];
  }

  return data;
};

export const fetchPassDefenseLeaders = async () => {
  const { data, error } = await supabase
    .from("game_stats")
    .select("team_name, season, total_passing_defense_score")
    .gte("games_played", 6)
    .order("total_passing_defense_score", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching pass defense leaders:", error);
    return [];
  }

  return data;
};

export const fetchRushDefenseLeaders = async () => {
  const { data, error } = await supabase
    .from("game_stats")
    .select("team_name, season, total_rushing_defense_score")
    .gte("games_played", 6)
    .order("total_rushing_defense_score", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching rush defense leaders:", error);
    return [];
  }

  return data;
};

export const fetchContainmentLeaders = async () => {
  const { data, error } = await supabase
    .from("game_stats")
    .select("team_name, season, avg_allowed_explosiveness")
    .gte("games_played", 6)
    .order("avg_allowed_explosiveness", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching allowed explosiveness:", error);
    return [];
  }

  return data;
};
