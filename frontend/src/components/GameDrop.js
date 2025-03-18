import React from "react";
/* Drop down component for game view page, allows single season and team selection */
const GameDrop = ({ teams, seasons, formData, handleChange }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h4 className="card-title text-center">Select Team & Season</h4>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="mb-3">
                            <label className="fw-bold">Season</label>
                            <select name="season" value={formData.season} onChange={handleChange} className="form-select">
                                <option value="">Select Season</option>
                                {seasons.map((season) => (
                                    <option key={season} value={season}>
                                        {season}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="mb-3">
                            <label className="fw-bold">Team</label>
                            <select name="team" value={formData.team} onChange={handleChange} className="form-select">
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team} value={team}>
                                        {team}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDrop;
