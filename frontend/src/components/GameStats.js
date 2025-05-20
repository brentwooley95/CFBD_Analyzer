import React from 'react';
/* Dual table component that compares advanced metrics for two teams, shown on Team Comparsion page */
const GameStats = ({ gameStats, formData }) => {
    const team1Stats = gameStats.find(
        team => team.team_name === formData.team1 && team.season === Number(formData.season1)
    );

    const team2Stats = gameStats.find(
        team => team.team_name === formData.team2 && team.season === Number(formData.season2)
    );

    const getColorClass = (value, isSuccessRate = false, reverseScale = false) => {
        let thresholds;

        const applyTextColor = (bgClass) => {
        // Apply white text to darker backgrounds
        const darkBackgrounds = ["bg-success", "bg-danger"];
        return darkBackgrounds.includes(bgClass) ? `${bgClass} text-white` : bgClass;
    };

        if (isSuccessRate) {
            thresholds = reverseScale
                ? [ // Reverse scale for avg_allowed_success (Defense)
                    { limit: 0.3619, color: "bg-success" },
                    { limit: 0.3989, color: "bg-success-subtle" },       // Low Opponent Success → Good (Green)
                    { limit: 0.4449, color: "bg-warning-subtle" }, // Light Green
                    { limit: 0.4799, color: "bg-danger-subtle" }, // Yellow
                    { limit: Infinity, color: "bg-danger" }  // High Opponent Success → Bad (Red)
                  ]
                : [ // Normal scale for avg_success_rate (Offense)
                    { limit: 0.3619, color: "bg-danger" },
                    { limit: 0.3989, color: "bg-danger-subtle" },
                    { limit: 0.4449, color: "bg-warning-subtle" },
                    { limit: 0.4799, color: "bg-success-subtle" },
                    { limit: Infinity, color: "bg-success" }
                  ];
        } else {
            thresholds = [
                { limit: 32.99, color: "bg-danger" },
                { limit: 41.99, color: "bg-danger-subtle" },
                { limit: 56.99, color: "bg-warning-subtle" },
                { limit: 69.99, color: "bg-success-subtle" },
                { limit: Infinity, color: "bg-success" }
            ];
        }

        const bgClass = thresholds.find(t => value < t.limit)?.color || "";
        return applyTextColor(bgClass);
    };

    if (!team1Stats || !team2Stats) {
        return <p></p>;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="card-title text-center">Aggregated Season Metrics</h2>

                <table className="table table-bordered table-striped text-center">
                    <colgroup>
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "250px" }} />
                        <col style={{ width: "200px" }} />
                    </colgroup>

                    <thead className="thead-dark">
                        <tr>
                            <th>{team1Stats.team_name} {team1Stats.season}</th>
                            <th>Offense Metrics</th>
                            <th>{team2Stats.team_name} {team2Stats.season}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* FBS Games Played */}
                        <tr>
                            <td>{team1Stats.games_played}</td>
                            <td className="fw-bold">FBS Games Played</td>
                            <td>{team2Stats.games_played}</td>
                        </tr>

                        {/* Offense Metrics */}
                        {[
                            { label: "Offensive Passing Score", key: "total_passing_offense_score" },
                            { label: "Offensive Rushing Score", key: "total_rushing_offense_score" },
                            { label: "Success Rate", key: "avg_success_rate", format: (val) => `${(val * 100).toFixed(1)}%`, isSuccessRate: true },
                            { label: "Explosiveness", key: "avg_explosiveness" }
                        ].map(({ label, key, format, isSuccessRate }) => (
                            <tr key={key}>
                                <td className={getColorClass(team1Stats[key], isSuccessRate)}>
                                    {format ? format(team1Stats[key]) : team1Stats[key].toFixed(0)}
                                </td>
                                <td>{label}</td>
                                <td className={getColorClass(team2Stats[key], isSuccessRate)}>
                                    {format ? format(team2Stats[key]) : team2Stats[key].toFixed(0)}
                                </td>
                            </tr>
                        ))}

                        {/* Defense Metrics */}
                        <tr>
                            <th colSpan="3" className="text-center fw-bold bg-light">Defense Metrics</th>
                        </tr>

                        {[
                            { label: "Passing Defense Score", key: "total_passing_defense_score" },
                            { label: "Rushing Defense Score", key: "total_rushing_defense_score" },
                            { label: "Opponent Success Rate", key: "avg_allowed_success", format: (val) => `${(val * 100).toFixed(1)}%`, isSuccessRate: true, reverseScale: true },
                            { label: "Containment", key: "avg_allowed_explosiveness" }
                        ].map(({ label, key, format, isSuccessRate, reverseScale }) => (
                            <tr key={key}>
                                <td className={getColorClass(team1Stats[key], isSuccessRate, reverseScale)}>
                                    {format ? format(team1Stats[key]) : team1Stats[key].toFixed(0)}
                                </td>
                                <td>{label}</td>
                                <td className={getColorClass(team2Stats[key], isSuccessRate, reverseScale)}>
                                    {format ? format(team2Stats[key]) : team2Stats[key].toFixed(0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GameStats;
