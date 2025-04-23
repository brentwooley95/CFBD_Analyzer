import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});



// Fetch seasons from FastAPI
export const fetchSeasons = async () => {
    try {
        const response = await api.get('/seasons');
        return response.data;
    } catch (error) {
        console.error('Error fetching seasons:', error);
        return [];
    }
};

// Fetch game stats from FastAPI
export const fetchGameStats = async (season1, team1, season2, team2) => {
    if (!season1 || !team1 || !season2 || !team2) {
        console.error("Missing parameters: season1, team1, season2, or team2");
        return []; // Ensure function always returns an array
    }
    try {
        const response = await api.get('/game_stats', {
            params: { season1, team1, season2, team2 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching game stats:', error);
        return [];
    }
};

// Fetch record breakdown from FastAPI
export const fetchRecordBreakdown = async (season1, team1, season2, team2) => {
    if (!season1 || !team1 || !season2 || !team2) {
        console.error("Missing parameters: season1, team1, season2, or team2");
        return [];
    }
    try {
        const response = await api.get('/record_breakdown', {
            params: { season1, team1, season2, team2 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching record breakdown:', error);
        return [];
    }
};


// Fetch postseason results
export const fetchPostseasonResults = async (season1, team1, season2, team2) => {
    try {
        const response = await api.get('/postseason_results', {
            params: { season1, team1, season2, team2 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching postseason results:', error);
        return [];
    }
};


export const fetchRecruitingRankings = async (season1, team1, season2, team2) => {
    if (!season1 || !team1 || !season2 || !team2) {
        console.error("Missing parameters: season1, team1, season2, team2");
        return [];
    }
    try {
        const response = await api.get('/recruiting_rankings', {
            params: { season1, team1, season2, team2 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recruiting rankings:', error);
        return [];
    }
};


const BASE_URL = "http://localhost:8000"; // Adjust if needed

export async function fetchTeamGameStats(team) {
    try {
        const encodedTeamName = encodeURIComponent(team);  // Encode team name
        const response = await fetch(`${BASE_URL}/team/game_stats?team=${encodedTeamName}`);
        if (!response.ok) throw new Error("Failed to fetch game stats");
        return response.json();
    } catch (error) {
        console.error("Error fetching team game stats:", error);
        return []; // Return empty array if error occurs
    }
}

export async function fetchTeamRecordBreakdown(team) {
    try {
        const encodedTeamName = encodeURIComponent(team);
        const response = await fetch(`${BASE_URL}/team/record_breakdown?team=${encodedTeamName}`);
        if (!response.ok) throw new Error("Failed to fetch record breakdown");
        return response.json();
    } catch (error) {
        console.error("Error fetching record breakdown:", error);
        return []; // Return empty array if error occurs
    }
}

export async function fetchTeamPostseasonResults(team) {
    try {
        const encodedTeamName = encodeURIComponent(team);
        const response = await fetch(`${BASE_URL}/team/postseason_results?team=${encodedTeamName}`);
        if (!response.ok) throw new Error("Failed to fetch postseason results");
        return response.json();
    } catch (error) {
        console.error("Error fetching postseason results:", error);
        return []; // Return empty array if error occurs
    }
}

export async function fetchTeamRecruitingRankings(team) {
    try {
        const encodedTeamName = encodeURIComponent(team);
        const response = await fetch(`${BASE_URL}/team/recruiting_rankings?team=${encodedTeamName}`);
        if (!response.ok) throw new Error("Failed to fetch recruiting rankings");
        return response.json();
    } catch (error) {
        console.error("Error fetching recruiting rankings:", error);
        return []; // Return empty array if error occurs
    }
}


// Fetch game performances for a selected team and season
export const fetchGamePerformance = async (team, season) => {
    try {
        const response = await axios.get(`${BASE_URL}/games/game_performance`, {
            params: { team_name: team, season: season }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching game performances:", error);
        return [];
    }
};


//  Fetch Home Page Leaders (Top 5 for Each Category)
export const fetchPassLeaders = async () => {
    try {
        const response = await api.get('/home/pass_leaders');
        return response.data;
    } catch (error) {
        console.error("Error fetching pass leaders:", error);
        return [];
    }
};

export const fetchRushLeaders = async () => {
    try {
        const response = await api.get('/home/rush_leaders');
        return response.data;
    } catch (error) {
        console.error("Error fetching rush leaders:", error);
        return [];
    }
};

export const fetchExplosiveLeaders = async () => {
    try {
        const response = await api.get('/home/explosive_leaders');
        return response.data;
    } catch (error) {
        console.error("Error fetching explosive leaders:", error);
        return [];
    }
};

export const fetchPassDefenseLeaders = async () => {
    try {
        const response = await api.get('/home/pass_defense_leaders');
        return response.data;
    } catch (error) {
        console.error("Error fetching pass defense leaders:", error);
        return [];
    }
};

export const fetchRushDefenseLeaders = async () => {
    try {
        const response = await api.get('/home/rush_defense_leaders');
        return response.data;
    } catch (error) {
        console.error("Error fetching rush defense leaders:", error);
        return [];
    }
};

export const fetchContainmentLeaders = async () => {
    try {
        const response = await api.get('/home/containment_leaders');
        return response.data;
    } catch (error) {
        console.error("Error fetching containment leaders:", error);
        return [];
    }
};





export default api;
