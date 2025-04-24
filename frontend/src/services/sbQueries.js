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
    .from('game_results')
    .select('season');

  if (error) {
    console.error('Error fetching seasons:', error);
    return [];
  }

  // Use Set to deduplicate, then sort in descending order
  const uniqueSeasons = [...new Set(data.map(item => item.season))].sort((a, b) => b - a);
  return uniqueSeasons;
};



export const fetchGameStats = async (season1, team1, season2, team2) => {
  if (!season1 || !team1 || !season2 || !team2) return [];
  return [];
};

export const fetchRecordBreakdown = async (season1, team1, season2, team2) => {
  if (!season1 || !team1 || !season2 || !team2) return [];
  return [];
};

export const fetchPostseasonResults = async (season1, team1, season2, team2) => {
  return [];
};

export const fetchRecruitingRankings = async (season1, team1, season2, team2) => {
  if (!season1 || !team1 || !season2 || !team2) return [];
  return [];
};

export async function fetchTeamGameStats(team) {
  return [];
}

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
