import React from 'react';

const TeamDrop = ({ teams, selectedTeam, handleChange }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h4 className="card-title text-center">Select Team</h4>
                <div className="mb-3">
                    <label className="fw-bold">Team</label>
                    <select name="team" value={selectedTeam} onChange={handleChange} className="form-select">
                        <option value="">Select Team</option>
                        {teams.map((team) => (
                            <option key={team.team_id} value={team.team_name}>
                                {team.team_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TeamDrop;


