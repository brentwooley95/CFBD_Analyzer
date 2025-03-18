 import React from "react";
/* Table component for Game view page, showing all games played for a single season and team */
const GamePerformances = ({ gameData }) => {
    if (!gameData.length) {
        return <p className="text-center">No game data available for this team and season.</p>;
    }

    return (
        <div className="card p-4 mb-4" style={{ maxWidth: "100%", overflowX: "auto" }}>
            <h3 className="text-center">Game Performances</h3>
            <div className="table-responsive">
                <table className="table table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>Date</th>
                            <th>Opponent</th>
                            <th>Opponent Tier</th>
                            <th>Game Type</th>
                            <th>Team Score</th>
                            <th>Opponent Score</th>
                            <th>Result</th>
                            <th>Pass Total PPA</th>
                            <th>Rush Total PPA</th>
                            <th>Expl. PPA</th>
                            <th>Success Rate</th>
                            <th>Oppt. Total Pass PPA</th>
                            <th>Oppt. Total Rush PPA</th>
                            <th>Oppt. Expl. PPA</th>
                            <th>Oppt. Success Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gameData.map((game) => (
                            <tr key={game.game_date}>
                                <td>{new Date(game.game_date).toLocaleDateString()}</td>
                                <td>{game.opponent_name}</td>
                                <td>{game.oppt_tier}</td>
                                <td>{game.game_type}</td>
                                <td>{game.team_score}</td>
                                <td>{game.opponent_score}</td>
                                <td className={game.result === "Win" ? "text-success fw-bold" : "text-danger fw-bold"}>
                                    {game.result}
                                </td>
                                <td>{(game.weighted_offense_pass_ppa ?? 0).toFixed(2)}</td>
                                <td>{(game.weighted_offense_rush_ppa ?? 0).toFixed(2)}</td>
                                <td>{(game.weighted_offense_explosiveness ?? 0).toFixed(2)}</td>
                                <td>{((game.offense_success_rate ?? 0) * 100).toFixed(1)}%</td>
                                <td>{(game.weighted_defense_pass_ppa ?? 0).toFixed(2)}</td>
                                <td>{(game.weighted_defense_rush_ppa ?? 0).toFixed(2)}</td>
                                <td>{(game.weighted_defense_explosiveness ?? 0).toFixed(2)}</td>
                                <td>{((game.defense_success_rate ?? 0) * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GamePerformances;
