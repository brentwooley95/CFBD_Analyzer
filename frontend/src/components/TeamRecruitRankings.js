import React from 'react';

/* Table component for recuiting rankings on Team view page. Single team for all seasons. */
const TeamRecruitingRankings = ({ recruitingData }) => {
    if (!recruitingData.length) {
        return <p className="text-center">No recruiting data available</p>;
    }

    return (
        <div className="card p-3 mb-4">
            <h3 className="text-center">Recruiting Rankings</h3>
            <table className="table table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Season</th>
                        <th>Rank</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {recruitingData.map((season) => (
                        <tr key={season.season}>
                            <td>{season.season}</td>
                            <td>{season.recruiting_rank}</td>
                            <td>{season.recruiting_points.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamRecruitingRankings;
