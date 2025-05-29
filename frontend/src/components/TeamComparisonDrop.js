import React from 'react';
import '../App.css';


/* Dropdown component for Team comparison page, allows selection of two teams with two corresponding seasons. */
const TeamComparisonDrop = ({ seasons, teams, formData, handleChange }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h4 className="card-title text-center">Select Seasons & Teams</h4>

                <div className="row justify-content-center">
                    {/* Team 1 Selection */}
                    <div className="col-md-5 team1-section">
                        <div className="mb-3">
                            <label className="fw-bold">Season 1</label>
                            <select name="season1" value={formData.season1} onChange={handleChange} className="form-select">
                                <option value="">Select Season</option>
                                {seasons.map((season) => (
                                    <option key={season} value={season}>{season}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Team 1</label>
                            <select name="team1" value={formData.team1} onChange={handleChange} className="form-select">
                                <option value="">Select Team 1</option>
                                {teams.map((team) => (
                                    <option key={team.team_id} value={team.team_name}>{team.team_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Team 2 Selection */}
                    <div className="col-md-5 team2-section">
                        <div className="mb-3">
                            <label className="fw-bold">Season 2</label>
                            <select name="season2" value={formData.season2} onChange={handleChange} className="form-select">
                                <option value="">Select Season</option>
                                {seasons.map((season) => (
                                    <option key={season} value={season}>{season}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Team 2</label>
                            <select name="team2" value={formData.team2} onChange={handleChange} className="form-select">
                                <option value="">Select Team 2</option>
                                {teams.map((team) => (
                                    <option key={team.team_id} value={team.team_name}>{team.team_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamComparisonDrop;
