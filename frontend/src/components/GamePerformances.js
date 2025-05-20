import React from "react";
import { getColorClass } from "../styles/colorHelpers";

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
                            <th>Oppt. Score</th>
                            <th>Result</th>
                            <th>Pass Score</th>
                            <th>Rush Score</th>
                            <th>Expl. Score</th>
                            <th>Success Rate</th>
                            <th>Def. Pass Score</th>
                            <th>Def. Rush Score</th>
                            <th>Cont. Score</th>
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
                                <td className={getColorClass(game.total_passing_offense_score ?? 0)}>
                                    {(game.total_passing_offense_score ?? 0).toFixed(2)}
                                </td>
                                <td className={getColorClass(game.total_rushing_offense_score ?? 0)}>
                                    {(game.total_rushing_offense_score ?? 0).toFixed(2)}
                                </td>
                                <td className={getColorClass(game.explosiveness ?? 0)}>
                                    {(game.explosiveness ?? 0).toFixed(2)}
                                </td>
                                <td className={getColorClass(game.success_rate ?? 0, true)}>
                                    {((game.success_rate ?? 0) * 100).toFixed(1)}%
                                </td>
                                <td className={getColorClass(game.total_passing_defense_score ?? 0)}>
                                    {(game.total_passing_defense_score ?? 0).toFixed(2)}
                                </td>
                                <td className={getColorClass(game.total_rushing_defense_score ?? 0)}>
                                    {(game.total_rushing_defense_score ?? 0).toFixed(2)}
                                </td>
                                <td className={getColorClass(game.allowed_explosiveness ?? 0)}>
                                    {(game.allowed_explosiveness ?? 0).toFixed(2)}
                                </td>
                                <td className={getColorClass(game.allowed_success ?? 0, true, true)}>
                                    {((game.allowed_success ?? 0) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GamePerformances;
