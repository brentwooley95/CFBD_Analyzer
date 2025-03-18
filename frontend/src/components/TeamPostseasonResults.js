import React from 'react';

/* Table component for Team view page. Shows final postseason game for a single team for all seasons. */
const TeamPostseasonResults = ({ postseasonResults }) => {
    if (!postseasonResults.length) {
        return <p className="text-center">No postseason results available</p>;
    }

    return (
        <div className="card p-3 mb-4">
            <h3 className="text-center">Postseason Results</h3>
            <table className="table table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Season</th>
                        <th>Final Game Played</th>
                        <th>Opponent</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {postseasonResults.map((season) => (
                        <tr key={season.season}>
                            <td>{season.season}</td>
                            <td className={season.postseason_name === "No Postseason" ? "text-danger fw-bold" : "text-success fw-bold"}>
                                {season.postseason_name}</td>
                            <td>{season.opponent_name || "N/A"}</td>
                            <td>
                                {season.result
                                    ? `${season.result} (${season.team_score}-${season.opponent_score})`
                                    : "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamPostseasonResults;
