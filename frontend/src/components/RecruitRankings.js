import React from 'react';

/* Dual table component comparing two teams recruit information. Team Comparison page. */
const RecruitRankings = ({ recruitingData, formData }) => {
    // Find data for each selected team and season
    const team1Recruiting = recruitingData.find(
        team => team.team_name === formData.team1 && team.season === Number(formData.season1)
    );

    const team2Recruiting = recruitingData.find(
        team => team.team_name === formData.team2 && team.season === Number(formData.season2)
    );

    if (!team1Recruiting || !team2Recruiting) {
        return <p className="text-center"></p>;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="card-title text-center">Recruiting Rankings</h2>

                <table className="table table-striped table-bordered text-center">
                    <colgroup>
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "250px" }} />
                        <col style={{ width: "200px" }} />
                    </colgroup>

                    <thead className="thead-dark">
                        <tr>
                            <th>{team1Recruiting.team_name} {team1Recruiting.season}</th>
                            <th>Recruiting Metrics</th>
                            <th>{team2Recruiting.team_name} {team2Recruiting.season}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Recruiting Rank */}
                        <tr>
                            <td className="text-center fw-bold">{team1Recruiting.recruiting_rank}</td>
                            <td className="fw-bold">Recruiting Rank</td>
                            <td className="text-center fw-bold">{team2Recruiting.recruiting_rank}</td>
                        </tr>

                        {/* Recruiting Points */}
                        <tr>
                            <td className="text-center fw-bold">{team1Recruiting.recruiting_points.toFixed(2)}</td>
                            <td className="fw-bold">Recruiting Points</td>
                            <td className="text-center fw-bold">{team2Recruiting.recruiting_points.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecruitRankings;
