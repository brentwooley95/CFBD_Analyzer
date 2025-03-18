import React from 'react';

/* Dual table component comparing two team's record breakdown, shown on Team Comparison page */
const RecordBreakdown = ({ recordBreakdown, formData }) => {
    const team1Record = recordBreakdown.find(
        team => team.team_name === formData.team1 && team.season === Number(formData.season1)
    );

    const team2Record = recordBreakdown.find(
        team => team.team_name === formData.team2 && team.season === Number(formData.season2)
    );

    if (!team1Record || !team2Record) {
        return <p></p>;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="card-title text-center">Record Breakdown</h2>

                <table className="table table-bordered table-striped text-center">
                    <colgroup>
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "250px" }} />
                        <col style={{ width: "200px" }} />
                    </colgroup>

                    <thead className="thead-dark">
                        <tr>
                            <th>{team1Record.team_name} {team1Record.season}</th>
                            <th>Opponent Tier</th>
                            <th>{team2Record.team_name} {team2Record.season}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {[1, 2, 3, 4, 5, 6].map((tier) => (
                            <tr key={tier}>
                                <td>{team1Record[`wins_vs_tier${tier}`] || 0}-{team1Record[`losses_vs_tier${tier}`] || 0}</td>
                                <td className="fw-bold">Tier {tier}</td>
                                <td>{team2Record[`wins_vs_tier${tier}`] || 0}-{team2Record[`losses_vs_tier${tier}`] || 0}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot className="table-primary fw-bold">
                        <tr>
                            <td>{team1Record[`total_wins`] || 0}-{team1Record[`total_losses`] || 0}</td>
                            <td>Total FBS Record</td>
                            <td>{team2Record[`total_wins`] || 0}-{team2Record[`total_losses`] || 0}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default RecordBreakdown;
