import React from 'react';

/* Table component for record breakdown for a single team for all seasons. Team view page. */
const TeamRecordBreakdown = ({ recordBreakdown }) => {
    if (!recordBreakdown.length) {
        return <p className="text-center">No record breakdown available</p>;
    }

    const teamRecord = recordBreakdown[0]; // Aggregated record (single row)

    return (
        <div className="card p-3 mb-4">
            <h3 className="text-center">Record Breakdown by Tier of Opponent</h3>
            <table className="table table-bordered text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>Opponent Tier</th>
                        <th>Record</th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4, 5, 6].map((tier) => (
                        <tr key={tier}>
                            <td>Tier {tier}</td>
                            <td>
                                {teamRecord[`wins_vs_tier${tier}`] || 0}-
                                {teamRecord[`losses_vs_tier${tier}`] || 0}
                            </td>
                        </tr>
                    ))}
                    <tr className="font-weight-bold">
                        <td>Total FBS Record</td>
                        <td>{teamRecord.total_wins}-{teamRecord.total_losses}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TeamRecordBreakdown;
