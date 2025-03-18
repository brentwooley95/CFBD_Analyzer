import React, { useState, useEffect } from 'react';
import TeamDrop from '../components/TeamDrop';
import {
    fetchTeams,
    fetchTeamGameStats,
    fetchTeamRecordBreakdown,
    fetchTeamPostseasonResults,
    fetchTeamRecruitingRankings
} from '../services/api';
import TeamGameStats from '../components/TeamGameStats';
import TeamRecordBreakdown from '../components/TeamRecordBreakdown';
import TeamPostseasonResults from '../components/TeamPostseasonResults';
import TeamRecruitRankings from '../components/TeamRecruitRankings';

const Team = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [gameStats, setGameStats] = useState([]);
    const [recordBreakdown, setRecordBreakdown] = useState([]);
    const [postseasonResults, setPostseasonResults] = useState([]);
    const [recruitingData, setRecruitingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTeams = async () => {
            setTeams(await fetchTeams());
        };
        loadTeams();
    }, []);

    const handleChange = async (event) => {
        const teamName = event.target.value;
        setSelectedTeam(teamName);
        setLoading(true);
        setError("");

        try {
            setGameStats(await fetchTeamGameStats(teamName));
            setRecordBreakdown(await fetchTeamRecordBreakdown(teamName));
            setPostseasonResults(await fetchTeamPostseasonResults(teamName));
            setRecruitingData(await fetchTeamRecruitingRankings(teamName));
        } catch (err) {
            setError("Failed to load team data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comparison-page">
            <h2 className="title">Historical Performance from 2014 to Present</h2>
            <div className="form-container">
                <TeamDrop teams={teams} selectedTeam={selectedTeam} handleChange={handleChange} />
            </div>

            {loading && <div className="alert alert-info text-center">Loading team data...</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            {!loading && selectedTeam && (
                <>
                    <TeamGameStats gameStats={gameStats} />
                    <TeamRecordBreakdown recordBreakdown={recordBreakdown} />
                    <TeamPostseasonResults postseasonResults={postseasonResults} />
                    <TeamRecruitRankings recruitingData={recruitingData} />
                </>
            )}
        </div>
    );
};

export default Team;
