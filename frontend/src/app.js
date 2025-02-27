import React, {useState, useEffect} from 'react'
import api from './api'


/* const App = () => {
    const [transaction, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
    });
*/
const App = () => {
    // State for team comparison and record breakdown
    const [gameStats, setGameStats] = useState([]);
    const [recordBreakdown, setRecordBreakdown] = useState([]);
    const [teams, setTeams] = useState([]); // Stores team list for dropdown
    const [seasons, setSeasons] = useState([]); // Stores season list for dropdown
    const [formData, setFormData] = useState({
        season: '',
        team1: '',
        team2: ''
    });

    /*
        const fetchTransactions = async () => {
            const response = await api.get('/transactions');
            setTransactions(response.data)
        };

        useEffect(() => {
            fetchTransactions();
        }, []);

    */
    // Fetch teams from FastAPI
    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams'); // Fetch list of teams
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };


    // Fetch seasons from FastAPI
    const fetchSeasons = async () => {
        try {
            const response = await api.get('/seasons'); // Fetch list of seasons
            setSeasons(response.data);
        } catch (error) {
            console.error('Error fetching seasons:', error);
        }
    };


    // Fetch game stats from FastAPI
    const fetchGameStats = async () => {
        if (!formData.season || !formData.team1 || !formData.team2) {
            console.error("Missing parameters: season, team1, or team2");
            return;  // Stop the function if any value is empty
        }
        try {
            const response = await api.get('/game_stats', {
                params: {
                    season: formData.season,
                    team1: formData.team1,
                    team2: formData.team2
                }
            });
            setGameStats(response.data);
        } catch (error) {
            console.error('Error fetching game stats:', error);
        }
    };

    // Fetch record breakdown from FastAPI
    const fetchRecordBreakdown = async () => {
        if (!formData.season || !formData.team1 || !formData.team2) {
            console.error("Missing parameters: season, team1, or team2");
            return;  // Stop the function if any value is empty
        }
        try {
            const response = await api.get('/record_breakdown', {
                params: {
                    season: formData.season,
                    team1: formData.team1,
                    team2: formData.team2
                }
            });
            setRecordBreakdown(response.data);
        } catch (error) {
            console.error('Error fetching record breakdown:', error);
        }
    };

    // Fetch teams and seasons when component mounts
    useEffect(() => {
        fetchTeams();
        fetchSeasons();
    }, []);

    // Handle dropdown selection changes
    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Handle form submission to update data
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        fetchGameStats();
        fetchRecordBreakdown();
    };


    /*
      const handleInputChange = (event) => {
          const value = event.target.type ==== 'checkbox' ? event.target.checked : event.target.value;
          setFormData({
              ...formData,
              [event.target.name]: value,
              });
          };
  */


    /*
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await api.post('/transaction', formData);
        fetchTransactions();
        setFormData({
            amount: '',
            category: '',
            description: '',
            is_income: false,
            date: ''
        });
    */


    const team1Stats = gameStats.find(team => team.team_name === formData.team1);
    const team2Stats = gameStats.find(team => team.team_name === formData.team2);

  const getHighlightClass = (team1Value, team2Value, isHigherBetter = true) => {
    if (team1Value > team2Value) {
        return isHigherBetter ? "bg-success text-white fw-bold" : "bg-danger text-white fw-bold"; // Green for better, Red for worse
    } else if (team1Value < team2Value) {
        return isHigherBetter ? "bg-danger text-white fw-bold" : "bg-success text-white fw-bold";
    }
    return ""; // No highlighting if values are equal
};


return (
    <div>
        <h1>CFB Matchup Tool</h1>

        {/* Form to Select Teams and Season */}
        <form onSubmit={handleFormSubmit}>
            <label>Season:</label>
            <select name="season" value={formData.season} onChange={handleInputChange}>
                <option value="">Select Season</option>
                {seasons.map((season) => (
                    <option key={season} value={season}>{season}</option>
                ))}
            </select>

            <label>Team 1:</label>
            <select name="team1" value={formData.team1} onChange={handleInputChange}>
                <option value="">Select Team 1</option>
                {teams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                ))}
            </select>

            <label>Team 2:</label>
            <select name="team2" value={formData.team2} onChange={handleInputChange}>
                <option value="">Select Team 2</option>
                {teams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                ))}
            </select>

            <button type="submit">Compare</button>
        </form>

        {/* Display Game Stats */}

<h2>Aggregated Game Metrics</h2>
{team1Stats && team2Stats ? (
<table className="stats-table">
    <colgroup>
        <col style={{ width: "200px" }} />  {/* Team 1 column */}
        <col style={{ width: "200px" }} />  {/* Metric Name */}
        <col style={{ width: "200px" }} />  {/* Team 2 column */}
    </colgroup>
    <thead>
        <tr>
            <th style={{ textAlign: "center", paddingRight: "20px" }}>{team1Stats.team_name}</th>
            <th style={{ textAlign: "center", paddingRight: "20px" }}>Offense Metrics</th>
            <th style={{ textAlign: "center", paddingRight: "20px" }}>{team2Stats.team_name}</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.total_passing_offense_score, team2Stats.total_passing_offense_score)}`}>
                {team1Stats.total_passing_offense_score.toFixed(0)}
            </td>
            <td>Offensive Passing Score</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.total_passing_offense_score, team1Stats.total_passing_offense_score)}`}>
                {team2Stats.total_passing_offense_score.toFixed(0)}
            </td>
        </tr>

        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.total_rushing_offense_score, team2Stats.total_rushing_offense_score)}`}>
                {team1Stats.total_rushing_offense_score.toFixed(0)}
            </td>
            <td>Offensive Rushing Score</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.total_rushing_offense_score, team1Stats.total_rushing_offense_score)}`}>
                {team2Stats.total_rushing_offense_score.toFixed(0)}
            </td>
        </tr>

        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.avg_success_rate, team2Stats.avg_success_rate)}`}>
                {(team1Stats.avg_success_rate * 100).toFixed(1)}%
            </td>
            <td>Success Rate</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.avg_success_rate, team1Stats.avg_success_rate)}`}>
                {(team2Stats.avg_success_rate * 100).toFixed(1)}%
            </td>
        </tr>

        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.avg_explosiveness, team2Stats.avg_explosiveness)}`}>
                {team1Stats.avg_explosiveness.toFixed(0)}
            </td>
            <td>Explosiveness</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.avg_explosiveness, team1Stats.avg_explosiveness)}`}>
                {team2Stats.avg_explosiveness.toFixed(0)}
            </td>
        </tr>
    </tbody>

    <thead>
        <tr>
            <th></th>
            <th style={{ textAlign: "center", paddingRight: "20px" }}>Defense Metrics</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.total_passing_defense_score, team2Stats.total_passing_defense_score)}`}>
                {team1Stats.total_passing_defense_score.toFixed(0)}
            </td>
            <td>Passing Defense Score</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.total_passing_defense_score, team1Stats.total_passing_defense_score)}`}>
                {team2Stats.total_passing_defense_score.toFixed(0)}
            </td>
        </tr>

        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.total_rushing_defense_score, team2Stats.total_rushing_defense_score)}`}>
                {team1Stats.total_rushing_defense_score.toFixed(0)}
            </td>
            <td>Rushing Defense</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.total_rushing_defense_score, team1Stats.total_rushing_defense_score)}`}>
                {team2Stats.total_rushing_defense_score.toFixed(0)}
            </td>
        </tr>

        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.avg_allowed_success, team2Stats.avg_allowed_success, false)}`}>
                {(team1Stats.avg_allowed_success * 100).toFixed(1)}%
            </td>
            <td>Opponent Success Rate</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.avg_allowed_success, team1Stats.avg_allowed_success, false)}`}>
                {(team2Stats.avg_allowed_success * 100).toFixed(1)}%
            </td>
        </tr>

        <tr>
            <td className={`text-center pr-4 ${getHighlightClass(team1Stats.avg_allowed_explosiveness, team2Stats.avg_allowed_explosiveness)}`}>
                {team1Stats.avg_allowed_explosiveness.toFixed(0)}
            </td>
            <td>Containment</td>
            <td className={`text-left pl-4 ${getHighlightClass(team2Stats.avg_allowed_explosiveness, team1Stats.avg_allowed_explosiveness)}`}>
                {team2Stats.avg_allowed_explosiveness.toFixed(0)}
            </td>
        </tr>
    </tbody>
</table>
) : (
<p>No game stats available</p>
)}


{/* Display Record Breakdown in Table Format */}
<h2>Record Breakdown</h2>
{recordBreakdown.length > 0 ? (
<table className="record-table">
    <colgroup>
        <col style={{ width: "200px" }} />  {/* First column - wider */}
        <col style={{ width: "250px" }} />  {/* Team 1 column */}
        <col style={{ width: "200px" }} />  {/* Team 2 column */}
    </colgroup>
    <thead>
        <tr>

            <th style={{ textAlign: "center", paddingRight: "20px" }}>{recordBreakdown[0].team_name}</th>
            <th>Opponent Tier</th>
            <th>{recordBreakdown[1].team_name}</th>
        </tr>
    </thead>
    <tbody>
        {[1, 2, 3, 4, 5, 6].map((tier) => (
            <tr key={tier}>

                <td style={{ textAlign: "center", paddingRight: "20px" }}>{recordBreakdown[0][`wins_vs_tier${tier}`] || 0}-{recordBreakdown[0][`losses_vs_tier${tier}`] || 0}</td>
                <td>Tier {tier}</td>
                <td>{recordBreakdown[1][`wins_vs_tier${tier}`] || 0}-{recordBreakdown[1][`losses_vs_tier${tier}`] || 0}</td>
            </tr>
        ))}
    </tbody>
    <tbody>
            <tr>

                <td style={{ textAlign: "center", paddingRight: "20px" }}>{recordBreakdown[0][`total_wins`] || 0}-{recordBreakdown[0][`total_losses`] || 0}</td>
                <td>Total FBS Record</td>
                <td>{recordBreakdown[1][`total_wins`] || 0}-{recordBreakdown[1][`total_losses`] || 0}</td>
            </tr>
    </tbody>
</table>
) : (
<p>No record breakdown available</p>
)}

    </div>
);
};

export default App;
